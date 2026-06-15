import { adminState } from './state.js';

const supabase = adminState.supabase;
let ultimoConteo = 0;
let intervalo = null;

function mostrarToast(cantidad) {
  // Remover toast anterior si existe
  const anterior = document.getElementById('toast-nuevas-cotizaciones');
  if (anterior) anterior.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-nuevas-cotizaciones';
  toast.className = 'fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up cursor-pointer hover:bg-green-700 transition';
  toast.innerHTML = `
    <span class="text-lg">🆕</span>
    <span><strong>${cantidad}</strong> nueva${cantidad > 1 ? 's' : ''} cotización${cantidad > 1 ? 'es' : ''} recibida${cantidad > 1 ? 's' : ''}</span>
    <button id="btn-cerrar-toast" class="ml-2 text-white/70 hover:text-white text-lg leading-none">&times;</button>
  `;

  toast.addEventListener('click', (e) => {
    if (e.target.id === 'btn-cerrar-toast') {
      toast.remove();
      return;
    }
    // Cambiar a pestaña de cotizaciones
    document.getElementById('tab-pedidos')?.click();
    toast.remove();
  });

  document.body.appendChild(toast);

  // Auto-cerrar después de 10 segundos
  setTimeout(() => {
    if (document.getElementById('toast-nuevas-cotizaciones')) {
      toast.remove();
    }
  }, 10000);
}

function actualizarBadge(conteo) {
  let badge = document.getElementById('badge-nuevas-cotizaciones');
  if (conteo === 0) {
    if (badge) badge.remove();
    return;
  }
  if (!badge) {
    const tab = document.getElementById('tab-pedidos');
    if (!tab) return;
    badge = document.createElement('span');
    badge.id = 'badge-nuevas-cotizaciones';
    badge.className = 'ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full';
    tab.appendChild(badge);
  }
  badge.textContent = conteo;
}

export async function verificarNuevasCotizaciones() {
  const { count, error } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'no confirmado');

  if (error || count === null) return;

  if (ultimoConteo > 0 && count > ultimoConteo) {
    mostrarToast(count - ultimoConteo);
  }

  ultimoConteo = count;
  actualizarBadge(count);
}

export function initNotificaciones() {
  // Obtener conteo inicial
  verificarNuevasCotizaciones();

  // Pollear cada 30 segundos
  intervalo = setInterval(verificarNuevasCotizaciones, 30000);
}

export function detenerNotificaciones() {
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;
  }
}
