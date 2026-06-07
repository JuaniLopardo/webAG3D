import { supabase } from '../../lib/supabase';

export const adminState = {
  supabase,
  productos: [],
  usuarios: [],
  fotosParaSubir: [],
  paginaProductos: 0,
  paginaPedidos: 0,
  pageSize: 10
};
