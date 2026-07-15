/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { u as renderHead, w as renderTemplate } from './entrypoint_Hi6hINZd.mjs';
import 'clsx';
import { r as renderScript } from './script_iD-g3G7V.mjs';

const $$CambiarPassword = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nueva Contraseña - AG3D</title>${renderHead()}</head> <body class="bg-gray-100 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center p-4"> <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200"> <div class="text-center mb-8"> <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">Nueva Contraseña</h1> <p class="text-gray-500 mt-2 text-sm">Ingresa tu nueva clave de acceso</p> </div> <form id="form-update" class="space-y-5"> <div> <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña Nueva</label> <div class="relative"> <input type="password" id="new-password" required minlength="6" class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition pr-12" placeholder="••••••••"> <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none" data-target="new-password"> <svg class="eye-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> </button> </div> </div> <div> <label class="block text-sm font-semibold text-gray-700 mb-1">Confirmar Contraseña</label> <div class="relative"> <input type="password" id="confirm-password" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition pr-12" placeholder="••••••••"> <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none" data-target="confirm-password"> <svg class="eye-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> </button> </div> </div> <p id="mensaje" class="text-xs font-semibold text-center h-4"></p> <button type="submit" id="btn-update" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]">
Actualizar Contraseña
</button> </form> </div> ${renderScript($$result, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/cambiar-password.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/cambiar-password.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/cambiar-password.astro";
const $$url = "/cambiar-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CambiarPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
