/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { t as renderComponent, w as renderTemplate, r as maybeRenderHead } from './entrypoint_Hi6hINZd.mjs';
import { r as renderScript } from './script_iD-g3G7V.mjs';
import { $ as $$Layout } from './Layout_2s4kLoH4.mjs';

const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Producto" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 py-12 max-w-5xl"> <div id="producto-loading" class="text-center py-24"> <svg class="animate-spin mx-auto w-8 h-8 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg> <p class="text-gray-500">Cargando producto...</p> </div> <div id="producto-error" class="hidden text-center py-24"> <p class="text-red-500 font-bold text-lg" id="producto-error-msg">Producto no encontrado.</p> <a href="/catalogo" class="inline-block mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg">Volver al catálogo</a> </div> <div id="producto-container" class="hidden bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"></div> </main> ${renderScript($$result2, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/producto/[id].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/producto/[id].astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/producto/[id].astro";
const $$url = "/producto/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
