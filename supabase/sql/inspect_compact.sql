-- Backup query: schema compacto de cada tabla
select
  c.table_name,
  string_agg(c.column_name || ' ' || c.data_type, ', ' order by c.ordinal_position) as columns
from information_schema.columns c
where c.table_schema = 'public'
  and c.table_name in ('perfiles', 'pedidos', 'productos', 'carrito')
group by c.table_name
order by c.table_name;
