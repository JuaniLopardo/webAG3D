-- =====================================================
-- 1. Listar todas las tablas del esquema público
-- =====================================================
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;


-- =====================================================
-- 2. Columnas de las tablas que usamos
-- (perfiles, pedidos, productos, carrito)
-- =====================================================
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('perfiles', 'pedidos', 'productos', 'carrito')
order by table_name, ordinal_position;


-- =====================================================
-- 3. Foreign keys de cada tabla
-- =====================================================
select
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_schema as foreign_table_schema,
  ccu.table_name   as foreign_table_name,
  ccu.column_name  as foreign_column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema = 'public'
  and tc.table_name in ('perfiles', 'pedidos', 'productos', 'carrito')
order by tc.table_name;


-- =====================================================
-- 4. RLS policies activas
-- =====================================================
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('perfiles', 'pedidos', 'productos', 'carrito')
order by tablename, policyname;


-- =====================================================
-- 5. Una fila de ejemplo de cada tabla (para ver nombres reales de campos)
-- =====================================================
select 'perfiles' as tabla, jsonb_object_keys(to_jsonb(t)) as columnas
from public.perfiles t limit 1;

select 'pedidos' as tabla, jsonb_object_keys(to_jsonb(t)) as columnas
from public.pedidos t limit 1;

select 'productos' as tabla, jsonb_object_keys(to_jsonb(t)) as columnas
from public.productos t limit 1;

-- Para carrito (puede estar vacía, por eso el try)
do $$
begin
  if exists (select 1 from public.carrito limit 1) then
    perform 1;
  end if;
end$$;
