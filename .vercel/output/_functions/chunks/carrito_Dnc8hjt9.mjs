/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import './entrypoint_Hi6hINZd.mjs';
import 'clsx';

const $$Carrito = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Carrito;
  return Astro2.redirect("/dashboard?tab=carrito");
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/carrito.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/carrito.astro";
const $$url = "/carrito";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Carrito,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
