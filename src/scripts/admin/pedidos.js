import { adminState } from './state.js';

const supabase = adminState.supabase;

const pedidosMainContainer = document.getElementById('admin-pedidos-container');

// Elements for manual order modal
const modalPedidoManual = document.getElementById('modal-nuevo-pedido');
const btnNuevoPedidoManual = document.getElementById('btn-nuevo-pedido-manual');
const btnCloseOrderModal = document.getElementById('btn-close-order-modal');
const formNuevoPedido = document.getElementById('form-nuevo-pedido');
const itemsManualContainer = document.getElementById('items-manual-container');
const btnAddItemManual = document.getElementById('btn-add-item-manual');
const selectClienteManual = document.getElementById('new-order-cliente');

export async function cargarPedidos() {
  if (!pedidosMainContainer) return;

  const from = adminState.paginaPedidos * adminState.pageSize;
  const to = from + adminState.pageSize - 1;

  const { data: orders, error, count } = await supabase
    .from('pedidos')
    .select('*, perfiles(email, nombre_completo)', { count: 'exact' })
    .order('fecha_pedido', { ascending: false })
    .range(from, to);

  if (error || !orders) return;

  const statuses = ['Recibido', 'en diseño', 'en producción', 'en preparación para envío', 'enviado'];

  pedidosMainContainer.innerHTML = orders.map(order => {
    const fecha = new Date(order.fecha_pedido).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const cliente = order.perfiles || { email: 'Desconocido', nombre_completo: 'Desconocido' };
    const items = Array.isArray(order.items) ? order.items : [];
    
    return `
      <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
        <td class="p-4">
          <p class="font-bold text-gray-900">#${order.id}</p>
          <p class="text-[10px] text-gray-500">${fecha}</p>
        </td>
        <td class="p-4">
          <p class="font-medium text-gray-900">${cliente.nombre_completo || 'Sin nombre'}</p>
          <p class="text-[10px] text-gray-500">${cliente.email}</p>
        </td>
        <td class="p-4">
          <div class="space-y-1">
            ${items.map((item) => `
              <div class="text-[10px] text-gray-600">
                <span class="font-bold">${item.cantidad}x</span> ${item.titulo} 
                ${item.variante ? `<span class="italic">(${item.variante})</span>` : ''}
              </div>
            `).join('')}
          </div>
        </td>
        <td class="p-4">
          <div class="flex flex-col gap-2">
            <select class="select-order-status border border-gray-300 rounded px-2 py-1 text-[10px] focus:ring-2 focus:ring-primary outline-none" data-id="${order.id}">
              ${statuses.map(s => `<option value="${s}" ${order.estado === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
            <input type="text" class="input-order-tracking border border-gray-300 rounded px-2 py-1 text-[10px] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="N° de Tracking o URL" value="${order.tracking || ''}" />
          </div>
        </td>
        <td class="p-4 text-right">
          <button class="btn-actualizar-pedido bg-primary-light text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm" data-id="${order.id}">
            Actualizar
          </button>
        </td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.btn-actualizar-pedido').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const target = e.currentTarget;
      const id = target.dataset.id;
      const row = target.closest('tr');
      const nuevoEstado = row?.querySelector('.select-order-status').value;
      const nuevoTracking = row?.querySelector('.input-order-tracking').value;

      target.textContent = '...';
      target.disabled = true;

      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado, tracking: nuevoTracking })
        .eq('id', id);

      if (updateError) {
        alert('Error al actualizar: ' + updateError.message);
      }
      
      target.textContent = 'Actualizar';
      target.disabled = false;
    });
  });

  // Actualizar UI de paginación
  const infoPag = document.getElementById('info-pag-pedidos');
  if (infoPag && count !== null) {
    const totalPaginas = Math.ceil(count / adminState.pageSize);
    infoPag.textContent = `Página ${adminState.paginaPedidos + 1} de ${totalPaginas || 1}`;
  }

  const btnPrev = document.getElementById('btn-pedidos-prev');
  const btnNext = document.getElementById('btn-pedidos-next');
  if (btnPrev) btnPrev.disabled = adminState.paginaPedidos === 0;
  if (btnNext) btnNext.disabled = (adminState.paginaPedidos + 1) * adminState.pageSize >= (count || 0);
}

function crearFilaItemManual() {
  if (!itemsManualContainer) return;
  const row = document.createElement('div');
  row.className = 'item-manual-row p-3 bg-gray-50 rounded-lg border border-gray-200 relative pt-8 sm:pt-3';
  
  row.innerHTML = `
    <button type="button" class="btn-remove-item absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">&times;</button>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Producto</label>
        <select class="select-prod-manual w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" required>
          <option value="">Selecciona...</option>
          ${adminState.productos.map(p => `<option value="${p.id}">${p.titulo}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cantidad</label>
        <input type="number" class="input-qty-manual w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white" min="1" value="1" required />
      </div>
      <div class="sm:col-span-2 vars-manual-container flex flex-wrap gap-2"></div>
    </div>
  `;

  const selectProd = row.querySelector('.select-prod-manual');
  const varsContainer = row.querySelector('.vars-manual-container');

  selectProd.addEventListener('change', () => {
    const prodId = selectProd.value;
    const prod = adminState.productos.find(p => p.id.toString() === prodId);
    varsContainer.innerHTML = '';
    if (prod && prod.variables) {
      Object.entries(prod.variables).forEach(([key, options]) => {
        const sel = document.createElement('select');
        sel.className = 'select-var-manual px-2 py-1 border border-gray-300 rounded text-[10px] bg-white';
        sel.setAttribute('data-key', key);
        sel.innerHTML = `<option value="">${key}...</option>` + 
          options.map((o) => `<option value="${o}">${o}</option>`).join('');
        varsContainer.appendChild(sel);
      });
    }
  });

  row.querySelector('.btn-remove-item')?.addEventListener('click', () => row.remove());
  itemsManualContainer.appendChild(row);
}

export function initPedidos() {
  if (btnNuevoPedidoManual) {
    btnNuevoPedidoManual.addEventListener('click', () => {
      if (!selectClienteManual) return;
      // Poblar clientes
      selectClienteManual.innerHTML = '<option value="">Selecciona un cliente</option>' + 
        adminState.usuarios.map(u => `<option value="${u.id}">${u.email} (${u.nombre_completo || 'Sin nombre'})</option>`).join('');
      
      if (itemsManualContainer) {
        itemsManualContainer.innerHTML = '';
        crearFilaItemManual();
      }
      modalPedidoManual?.classList.replace('hidden', 'flex');
    });
  }

  if (btnCloseOrderModal) {
    btnCloseOrderModal.addEventListener('click', () => modalPedidoManual?.classList.replace('flex', 'hidden'));
  }

  if (btnAddItemManual) {
    btnAddItemManual.addEventListener('click', () => crearFilaItemManual());
  }

  // Listeners para paginación
  document.getElementById('btn-pedidos-prev')?.addEventListener('click', () => {
    if (adminState.paginaPedidos > 0) {
      adminState.paginaPedidos--;
      cargarPedidos();
    }
  });
  document.getElementById('btn-pedidos-next')?.addEventListener('click', () => {
    adminState.paginaPedidos++;
    cargarPedidos();
  });

  if (formNuevoPedido) {
    formNuevoPedido.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSave = document.getElementById('btn-save-manual-order');
      if (!btnSave) return;
      btnSave.disabled = true;
      btnSave.textContent = 'Guardando...';

      const items = [];
      document.querySelectorAll('.item-manual-row').forEach(row => {
        const prodId = row.querySelector('.select-prod-manual').value;
        const qty = parseInt(row.querySelector('.input-qty-manual').value);
        const product = adminState.productos.find(p => p.id.toString() === prodId);
        
        let varianteText = '';
        row.querySelectorAll('.select-var-manual').forEach(v => {
          const val = v.value;
          if (val) varianteText += (varianteText ? ' / ' : '') + val;
        });

        if (product) {
          items.push({
            id: product.id,
            titulo: product.titulo,
            cantidad: qty,
            variante: varianteText,
            subtotal: (product.precio || 0) * qty
          });
        }
      });

      const { error } = await supabase.from('pedidos').insert({
        cliente_id: selectClienteManual.value,
        estado: 'Recibido',
        items: items,
        fecha_pedido: new Date().toISOString()
      });

      if (error) {
        alert('Error al crear cotización: ' + error.message);
      } else {
        modalPedidoManual?.classList.replace('flex', 'hidden');
        cargarPedidos();
      }
      btnSave.disabled = false;
      btnSave.textContent = 'Crear Cotización';
    });
  }
}
