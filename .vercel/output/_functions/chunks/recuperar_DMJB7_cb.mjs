/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { u as renderHead, w as renderTemplate } from './entrypoint_Hi6hINZd.mjs';
import 'clsx';
import { r as renderScript } from './script_iD-g3G7V.mjs';

const $$Recuperar = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Recuperar Contraseña - AG3D</title>${renderHead()}</head> <body class="bg-gray-100 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center p-4"> <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200"> <div class="text-center mb-8"> <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Recuperar Contraseña</h1> <p class="text-gray-500 mt-2 text-sm">Te enviaremos un enlace para restablecer tu acceso</p> </div> <form id="form-recuperar" class="space-y-5"> <div> <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label> <input type="email" id="reset-email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition" placeholder="tu@email.com"> </div> <p id="mensaje" class="text-xs font-semibold text-center h-4"></p> <button type="submit" id="btn-enviar" class="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]">
Enviar Instrucciones
</button> </form> <div class="mt-8 pt-6 border-t border-gray-100 text-center"> <a href="/login" class="text-primary font-bold hover:underline text-sm">Volver al inicio de sesión</a> </div> </div> ${renderScript($$result, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/recuperar.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/recuperar.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/recuperar.astro";
const $$url = "/recuperar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Recuperar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
