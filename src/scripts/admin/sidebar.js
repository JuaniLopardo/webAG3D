import { cargarPedidos } from './pedidos.js';
import { cargarUsuarios } from './usuarios.js';

export function initSidebar() {
  const tabs = {
    pedidos: { btn: document.getElementById('tab-pedidos'), sec: document.getElementById('section-pedidos') },
    productos: { btn: document.getElementById('tab-productos'), sec: document.getElementById('section-productos') },
    usuarios: { btn: document.getElementById('tab-usuarios'), sec: document.getElementById('section-usuarios') }
  };

  function switchTab(activeKey) {
    Object.entries(tabs).forEach(([key, elements]) => {
      if (!elements.btn || !elements.sec) return;
      if (key === activeKey) {
        elements.btn.className = 'w-full text-left px-4 py-3 rounded-lg bg-primary text-white font-medium transition';
        elements.sec.classList.remove('hidden');
        elements.sec.classList.add('block');
        if (key === 'usuarios') cargarUsuarios();
        if (key === 'pedidos') {
          cargarPedidos();
          cargarUsuarios();
        }
      } else {
        elements.btn.className = 'w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-medium transition';
        elements.sec.classList.remove('block');
        elements.sec.classList.add('hidden');
      }
    });
  }

  tabs.pedidos.btn?.addEventListener('click', () => switchTab('pedidos'));
  tabs.productos.btn?.addEventListener('click', () => switchTab('productos'));
  tabs.usuarios.btn?.addEventListener('click', () => switchTab('usuarios'));
}
