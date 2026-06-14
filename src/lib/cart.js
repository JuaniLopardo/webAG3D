// src/lib/cart.js
// Lógica del carrito: persistencia en localStorage + sync con Supabase cuando hay sesión.
import { supabase } from './supabase.js';

const STORAGE_KEY = 'ag3d-carrito';

/**
 * Estructura de un item:
 * {
 *   id: string,           // uuid local (para keys)
 *   producto_id: number,
 *   titulo: string,
 *   foto_url: string|null,
 *   cantidad_minima: number,
 *   variables: object,    // { "color": "Rojo", "talle": "M" }
 *   cantidad: number
 * }
 */

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocal(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('No se pudo guardar el carrito en localStorage', e);
  }
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
}

function varsKey(variables) {
  // Normaliza el objeto para que el mismo set de variables tenga siempre la misma key
  const keys = Object.keys(variables || {}).sort();
  return keys.map(k => `${k}=${variables[k]}`).join('|');
}

function mismoItem(a, b) {
  return a.producto_id === b.producto_id && varsKey(a.variables) === varsKey(b.variables);
}

export function getItems() {
  return getLocal();
}

export function getCount() {
  return getLocal().reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);
}

export function getCountByProducto(productoId) {
  return getLocal()
    .filter(it => it.producto_id === productoId)
    .reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0);
}

export function addItem({ producto_id, titulo, foto_url, cantidad_minima, variables, cantidad }) {
  const items = getLocal();
  const vars = variables || {};
  const cand = {
    id: uuid(),
    producto_id,
    titulo,
    foto_url: foto_url || null,
    cantidad_minima: Number(cantidad_minima) || 1,
    variables: vars,
    cantidad: Number(cantidad) || 1,
  };

  const idx = items.findIndex(it => mismoItem(it, cand));
  if (idx >= 0) {
    items[idx] = { ...items[idx], cantidad: items[idx].cantidad + cand.cantidad };
  } else {
    items.push(cand);
  }
  setLocal(items);
  return cand;
}

export function updateCantidad(itemId, cantidad) {
  const items = getLocal();
  const idx = items.findIndex(it => it.id === itemId);
  if (idx === -1) return;
  if (cantidad <= 0) {
    items.splice(idx, 1);
  } else {
    items[idx].cantidad = cantidad;
  }
  setLocal(items);
}

export function removeItem(itemId) {
  const items = getLocal().filter(it => it.id !== itemId);
  setLocal(items);
}

export function clearLocal() {
  setLocal([]);
}

export function getTotalUnitsByProducto(productoId) {
  return getCountByProducto(productoId);
}

// ========================================
// SYNC CON SUPABASE
// ========================================

/**
 * Sube el carrito local a Supabase. Se llama cuando:
 *  - el usuario hace login
 *  - el usuario modifica/agrega un item al carrito
 *
 * Política: Supabase es la fuente de verdad para el user logueado.
 * Si el server ya tiene items que el local no, los mergeamos sumando cantidades
 * para la misma combinación. El server siempre gana (es el más reciente entre devices).
 */
export async function syncUp() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const local = getLocal();
  if (local.length === 0) return;

  const rows = local.map(it => ({
    user_id: session.user.id,
    producto_id: it.producto_id,
    titulo: it.titulo,
    foto_url: it.foto_url,
    cantidad_minima: it.cantidad_minima,
    variables: it.variables || {},
    cantidad: it.cantidad,
  }));

  // upsert por (user_id, producto_id, variables)
  const { error } = await supabase
    .from('carrito')
    .upsert(rows, { onConflict: 'user_id,producto_id,variables' });

  if (error) console.warn('syncUp carrito error:', error);
}

/**
 * Descarga el carrito del server al local. Se llama en login / carga inicial.
 */
export async function syncDown() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { data, error } = await supabase
    .from('carrito')
    .select('*')
    .eq('user_id', session.user.id);

  if (error) {
    console.warn('syncDown carrito error:', error);
    return;
  }

  // merge: si el local ya tiene un item con la misma combinación, sumamos
  const local = getLocal();
  const localKey = (it) => `${it.producto_id}::${varsKey(it.variables)}`;
  const localMap = new Map(local.map(it => [localKey(it), { ...it }]));

  for (const row of data || []) {
    const k = `${row.producto_id}::${varsKey(row.variables || {})}`;
    if (localMap.has(k)) {
      const existing = localMap.get(k);
      existing.cantidad = Math.max(existing.cantidad, row.cantidad);
    } else {
      localMap.set(k, {
        id: uuid(),
        producto_id: row.producto_id,
        titulo: row.titulo,
        foto_url: row.foto_url,
        cantidad_minima: row.cantidad_minima,
        variables: row.variables || {},
        cantidad: row.cantidad,
      });
    }
  }

  const merged = Array.from(localMap.values());
  setLocal(merged);
  await syncUp(); // persistir el merge de vuelta
}

/**
 * Vacía el carrito en ambos lados (localStorage + Supabase).
 */
export async function clearAll() {
  clearLocal();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('carrito').delete().eq('user_id', session.user.id);
  if (error) console.warn('clearAll carrito error:', error);
}

/**
 * Sincroniza al hacer login. Llamar desde la página donde el user se loguea.
 */
export async function onLogin() {
  // Asegurar que exista la fila del perfil (necesaria para FKs de pedidos, etc.)
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.from('perfiles').upsert({
      id: session.user.id,
      email: session.user.email,
    }, { onConflict: 'id' });
  }
  await syncDown();
  await syncUp();
}

/**
 * Crea un pedido (cotización) en Supabase a partir del carrito actual.
 * Devuelve la cotización creada.
 */
export async function crearPedidoDesdeCarrito() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Necesitás iniciar sesión para solicitar una cotización.');

  const items = getLocal();
  if (items.length === 0) throw new Error('Tu carrito está vacío.');

  const { error: perfilError } = await supabase.from('perfiles').upsert({
    id: session.user.id,
    email: session.user.email,
  }, { onConflict: 'id' });
  if (perfilError) {
    throw new Error('No se pudo preparar tu perfil para la cotización: ' + perfilError.message);
  }

  const pedidoItems = items.map(it => ({
    producto_id: it.producto_id,
    titulo: it.titulo,
    foto_url: it.foto_url,
    variables: it.variables || {},
    cantidad: it.cantidad,
  }));

  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      cliente_id: session.user.id,
      estado: 'pendiente',
      items: pedidoItems,
      fecha_pedido: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  await clearAll();
  return data;
}

/**
 * Construye el texto del mensaje de WhatsApp para la cotización.
 * No depende de localStorage, recibe los items directamente.
 */
export function construirMensajeCotizacion(items, email) {
  const lineas = items.map((it, i) => {
    const varsTxt = Object.keys(it.variables || {}).length
      ? Object.entries(it.variables).map(([k, v]) => `   ${k}: ${v}`).join('\n')
      : '';
    return `${i + 1}. ${it.titulo}\n${varsTxt}   x${it.cantidad} unidades`;
  });

  const total = items.reduce((acc, it) => acc + Number(it.cantidad || 0), 0);

  return `¡Hola AG3D! Quiero solicitar una cotización:\n\n━━━ Cotización ━━━\n${lineas.join('\n\n')}\n━━━━━━━━━━━━━━━━\nTotal unidades: ${total}\n━━━━━━━━━━━━━━━━\n\nDatos del cliente:\nEmail: ${email}\n\nQuedo atento a la cotización.`;
}

/**
 * Genera la URL de WhatsApp a partir de un mensaje ya construido.
 */
export function buildWhatsappUrlFromMessage(mensaje, whatsappNumber) {
  const num = String(whatsappNumber || '').replace(/\D/g, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`;
}
