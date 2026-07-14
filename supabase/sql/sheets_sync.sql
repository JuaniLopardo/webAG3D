-- ============================================
-- Google Sheets Sync: Trigger + pg_cron
-- ============================================

-- 1. Función helper que llama al Edge Function
CREATE OR REPLACE FUNCTION public.notify_sheets_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payload jsonb;
BEGIN
  -- Solo para pedidos con estado 'no confirmado' (creados por cliente)
  IF NEW.estado = 'no confirmado' THEN
    v_payload := jsonb_build_object(
      'record_id', NEW.id,
      'operation', TG_OP,
      'table', 'pedidos'
    );

    -- Notifica al canal para que el Edge Function pueda procesar
    PERFORM pg_notify('sheets_sync', v_payload::text);
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Trigger en pedidos (INSERT y UPDATE de estado)
DROP TRIGGER IF EXISTS trigger_sheets_sync ON public.pedidos;
CREATE TRIGGER trigger_sheets_sync
AFTER INSERT OR UPDATE OF estado ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.notify_sheets_sync();

-- 3. Función para ser llamada por pg_cron (polling de respaldo)
CREATE OR REPLACE FUNCTION public.sync_pedidos_to_sheets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_sync timestamptz;
  v_count int;
BEGIN
  -- Obtener timestamp de la última sincronización exitosa
  SELECT COALESCE(
    (SELECT max(fecha_pedido) FROM public.pedidos WHERE estado = 'no confirmado'),
    now() - interval '1 day'
  ) INTO v_last_sync;

  -- Aquí se llamaría al Edge Function via HTTP
  -- Pero pg_cron no puede hacer HTTP directo.
  -- Alternativa: usar supabase functions invoke desde un worker externo
  -- o confiar en el trigger + reintento manual.

  -- Como fallback, registramos en log
  INSERT INTO public.sync_log (last_sync_at, status, details)
  VALUES (now(), 'trigger_only', jsonb_build_object(
    'message', 'Sync via trigger. pg_cron would call Edge Function here.',
    'last_checked', v_last_sync
  ))
  ON CONFLICT DO NOTHING;
END;
$$;

-- 4. Tabla de log de sincronización (opcional pero recomendada)
CREATE TABLE IF NOT EXISTS public.sync_log (
  id bigserial PRIMARY KEY,
  last_sync_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_sync_log_created_at ON public.sync_log(created_at DESC);

-- RLS en sync_log
ALTER TABLE public.sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read sync_log" ON public.sync_log
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert sync_log" ON public.sync_log
FOR INSERT WITH CHECK (public.is_admin());

-- 5. Comentarios
COMMENT ON TRIGGER trigger_sheets_sync ON public.pedidos
IS 'Dispara notificación a sheets_sync al crear/actualizar pedidos en estado "no confirmado"';
COMMENT ON FUNCTION public.notify_sheets_sync()
IS 'Envía notificación pg_notify para sincronizar con Google Sheets';
COMMENT ON FUNCTION public.sync_pedidos_to_sheets()
IS 'Función de respaldo para pg_cron (requiere worker externo para invocar Edge Function)';