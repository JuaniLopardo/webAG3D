import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PedidoRow {
  id: string
  fecha_pedido: string
  estado: string
  cliente_id: string
  tracking: string | null
  items: any[]
  perfiles: {
    email: string
    nombre_completo: string
  } | null
}

interface SyncPayload {
  since?: string
  limit?: number
  offset?: number
  record_id?: string
}

const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

async function appendToSheets(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  const response = await fetch(
    `${SHEETS_API_BASE}/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Sheets API error: ${response.status} ${error}`)
  }

  return response.json()
}

async function getGoogleAccessToken() {
  const clientEmail = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const privateKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')
  const scopes = ['https://www.googleapis.com/auth/spreadsheets']

  if (!clientEmail || !privateKey) {
    throw new Error('Google service account credentials not configured')
  }

  const jwt = await createJWT(clientEmail, privateKey, scopes)
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(`Token error: ${JSON.stringify(data)}`)
  return data.access_token
}

async function createJWT(clientEmail: string, privateKey: string, scopes: string[]) {
  const header = { alg: 'RS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: clientEmail,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }

  const encoder = new TextEncoder()
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const unsigned = `${headerB64}.${payloadB64}`

  const key = await crypto.subtle.importKey(
    'pkcs8',
    str2ab(privateKey.replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\n/g, '')),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned))
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

  return `${unsigned}.${sigB64}`
}

function str2ab(str: string) {
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatItems(items: any[]) {
  return items.map(it => {
    const vars = it.variables ? Object.entries(it.variables).map(([k, v]) => `${k}:${v}`).join(', ') : ''
    return `${it.titulo} x${it.cantidad}${vars ? ` (${vars})` : ''}`
  }).join('; ')
}

function buildRows(pedidos: PedidoRow[]) {
  return pedidos.map(p => [
    p.id,
    formatFecha(p.fecha_pedido),
    p.perfiles?.email || '',
    p.perfiles?.nombre_completo || '',
    p.estado,
    formatItems(p.items || []),
    (p.items || []).reduce((sum, it) => sum + Number(it.cantidad || 0), 0),
    p.tracking || '',
  ])
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const spreadsheetId = Deno.env.get('GOOGLE_SHEETS_SPREADSHEET_ID')
    if (!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID not configured')

    const url = new URL(req.url)
    const since = url.searchParams.get('since')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Parse body for record_id (cuando se invoca desde el cliente)
    let recordId: string | null = url.searchParams.get('record_id')
    if (!recordId) {
      try {
        const body = await req.clone().json() as SyncPayload
        recordId = body?.record_id || null
      } catch { /* body vacío o no JSON, ignorar */ }
    }

    let query = supabase
      .from('pedidos')
      .select(`
        id, fecha_pedido, estado, cliente_id, tracking,
        items,
        perfiles!inner(email, nombre_completo)
      `)
      .order('fecha_pedido', { ascending: false })

    if (recordId) {
      query = query.eq('id', recordId)
    } else {
      query = query.range(offset, offset + limit - 1)
      if (since) {
        query = query.gte('fecha_pedido', since)
      }
    }

    const { data: pedidos, error } = await query
    if (error) throw error
    if (!pedidos || pedidos.length === 0) {
      return new Response(JSON.stringify({ synced: 0, message: 'No hay pedidos nuevos' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const accessToken = await getGoogleAccessToken()
    const rows = buildRows(pedidos as PedidoRow[])
    await appendToSheets(accessToken, spreadsheetId, 'Cotizaciones!A:H', rows)

    return new Response(JSON.stringify({ synced: rows.length, lastId: pedidos[0].id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Sync error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})