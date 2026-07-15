/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { t as renderComponent, w as renderTemplate, r as maybeRenderHead } from './entrypoint_Hi6hINZd.mjs';
import { r as renderScript } from './script_iD-g3G7V.mjs';
import { $ as $$Layout } from './Layout_2s4kLoH4.mjs';

const $$Catalogo = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Catálogo de Productos" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12 md:py-16 bg-gray-50 min-h-screen"> <div class="container mx-auto px-4 w-full max-w-7xl"> <div class="mb-10 text-center"> <h1 class="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Nuestro Catálogo</h1> <p class="mt-3 text-gray-500 text-sm md:text-base">Explorá todos nuestros productos personalizados.</p> </div> <div id="admin-banner" class="hidden mb-6 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg flex items-start gap-3"> <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <div> <p class="text-amber-800 font-semibold text-sm">Estás navegando como administrador</p> <p class="text-amber-700 text-xs mt-0.5">Las compras están deshabilitadas. Para gestionar el catálogo, andá al <a href="/admin" class="underline font-semibold">panel de administración</a>.</p> </div> </div> <div class="sticky top-[72px] z-30 bg-gray-50/95 backdrop-blur py-4 mb-8 border-b border-gray-200"> <div class="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto"> <div class="relative flex-1"> <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"></path> </svg> <input id="search-input" type="text" placeholder="Buscar productos..." class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"> </div> <select id="sort-select" class="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"> <option value="recientes">Más recientes</option> <option value="az">Título A-Z</option> <option value="za">Título Z-A</option> </select> </div> <p id="results-count" class="text-center text-xs text-gray-500 mt-3"></p> </div> <div id="catalogo-loading" class="text-center py-16"> <svg class="animate-spin mx-auto w-8 h-8 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> <p class="text-gray-500">Cargando productos...</p> </div> <div id="catalogo-grid" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"></div> <div id="empty-state" class="hidden text-center py-16"> <svg class="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"></path> </svg> <p class="text-gray-500 text-lg">No encontramos productos con tu búsqueda.</p> </div> </div> </section> ` })} ${renderScript($$result, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/catalogo.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/catalogo.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/catalogo.astro";
const $$url = "/catalogo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Catalogo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
