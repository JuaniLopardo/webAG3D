import { adminState } from './state.js';

const supabase = adminState.supabase;

const usuariosContainer = document.getElementById('admin-usuarios-container');
const modalPedidos = document.getElementById('modal-pedidos');
const btnCerrarPedidos = document.getElementById('btn-cerrar-pedidos');
const pedidosContainer = document.getElementById('pedidos-cliente-container');

export async function cargarUsuarios() {
  if (!usuariosContainer) return;
  const { data: usuarios, error } = await supabase.from('perfiles').select('*').order('email');
  if (error || !usuarios) return;
  adminState.usuarios = usuarios;

  usuariosContainer.innerHTML = usuarios.map(u => {
    const igUser = u.instagram ? u.instagram.replace('@', '') : null;
    const igLink = igUser 
      ? `<a href="https://instagram.com/${igUser}" target="_blank" class="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1.5 text-xs transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44c-.795 0-1.44-.645-1.44-1.44s.645-1.44 1.44-1.44z"/></svg>
          @${igUser}
        </a>`
      : '<span class="text-gray-400 italic text-xs">No vinculado</span>';

    return `
      <tr class="hover:bg-gray-50 transition border-b border-gray-100">
        <td class="p-4">
          <p class="font-medium text-gray-900 text-sm">${u.email || '<span class="text-red-400 italic">Email no sincronizado</span>'}</p>
          <p class="text-[10px] text-gray-400 font-mono">${u.id}</p>
        </td>
        <td class="p-4">
          <p class="text-sm text-gray-700 font-bold">${u.nombre_completo || '<span class="italic text-gray-400">Sin nombre</span>'}</p>
          ${u.nombre_empresa ? `<p class="text-[10px] text-primary font-bold uppercase tracking-tighter mt-0.5">${u.nombre_empresa}</p>` : ''}
          <p class="text-xs text-gray-500 mt-1">${u.telefono || 'Sin teléfono'}</p>
        </td>
        <td class="p-4">${igLink}</td>
        <td class="p-4 text-right">
          <button class="btn-pedidos bg-primary-light text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm" 
            data-user-id="${u.id}" 
            data-user-email="${u.email}">
            Ver Pedidos
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-pedidos').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget;
      const userId = target.dataset.userId;
      const userEmail = target.dataset.userEmail;
      
      if (modalPedidos) {
        modalPedidos.classList.replace('hidden', 'flex');
      }
      if (pedidosContainer) {
        pedidosContainer.innerHTML = '<p class="text-center py-10 animate-pulse">Consultando pedidos...</p>';
      }

      const { data: orders, error: errorOrders } = await supabase
        .from('pedidos')
        .select('*')
        .eq('cliente_id', userId)
        .order('fecha_pedido', { ascending: false });

      if (!pedidosContainer) return;

      if (errorOrders || !orders || orders.length === 0) {
        pedidosContainer.innerHTML = `
          <div class="text-center py-12">
            <p class="text-gray-500 mb-4 italic">No se encontraron pedidos para ${userEmail}</p>
            <div class="inline-block px-3 py-1 bg-gray-100 rounded text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: ${userId}</div>
          </div>
        `;
        return;
      }

      pedidosContainer.innerHTML = `
        <div class="space-y-4">
          ${orders.map(order => {
            const fecha = new Date(order.fecha_pedido).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const items = order.items || [];
            return `
              <div class="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors bg-gray-50">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span class="text-[10px] font-bold text-primary uppercase tracking-tight">Pedido #${order.id}</span>
                    <p class="text-sm font-bold text-gray-900">${fecha}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    ${order.estado || 'pendiente'}
                  </span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  ${Array.isArray(items) ? items.map((item) => `
                    <div class="flex justify-between border-t border-gray-200 pt-1 mt-1">
                      <span>${item.cantidad}x ${item.titulo} ${item.variante ? `(${item.variante})` : ''}</span>
                      <span class="font-mono">$${item.subtotal || 0}</span>
                    </div>
                  `).join('') : '<p>No hay detalles de items</p>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>`;
    });
  });
}

export function initUsuarios() {
  if (btnCerrarPedidos) {
    btnCerrarPedidos.onclick = () => {
      modalPedidos?.classList.replace('flex', 'hidden');
    };
  }
}
