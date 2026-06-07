-- ========================================
-- Tabla: carrito
-- Almacena items del carrito de un usuario.
-- Una fila por combinación (producto + selección de variables).
-- La cantidad mínima es por producto (no por item).
-- ========================================

create table public.carrito (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  producto_id bigint not null references public.productos(id) on delete cascade,

  -- snapshot de los datos del producto al momento de agregar
  -- (así aunque el admin edite el producto, el carrito no se rompe)
  titulo text not null,
  foto_url text,
  cantidad_minima integer not null default 1,

  -- variables elegidas: { "color": "Rojo", "talle": "M" }
  -- si el producto no tiene variables, queda como {}
  variables jsonb not null default '{}'::jsonb,

  -- cantidad de unidades para esta combinación
  cantidad integer not null default 1 check (cantidad > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Solo un item por (user, producto, combinación de variables)
create unique index carrito_unique_item
  on public.carrito (user_id, producto_id, variables);

-- Índices secundarios
create index carrito_user_idx on public.carrito(user_id);
create index carrito_producto_idx on public.carrito(producto_id);

-- RLS
alter table public.carrito enable row level security;

-- Usuarios solo ven/modifican SU propio carrito
create policy "carrito_select_own"
  on public.carrito for select
  using (auth.uid() = user_id);

create policy "carrito_insert_own"
  on public.carrito for insert
  with check (auth.uid() = user_id);

create policy "carrito_update_own"
  on public.carrito for update
  using (auth.uid() = user_id);

create policy "carrito_delete_own"
  on public.carrito for delete
  using (auth.uid() = user_id);

-- Trigger updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger carrito_updated_at
  before update on public.carrito
  for each row execute function public.set_updated_at();
