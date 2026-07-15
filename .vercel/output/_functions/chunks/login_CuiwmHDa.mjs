/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { u as renderHead, w as renderTemplate } from './entrypoint_Hi6hINZd.mjs';
import 'clsx';
import { r as renderScript } from './script_iD-g3G7V.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Iniciar Sesión - AG3D</title>${renderHead()}</head> <body class="bg-gray-100 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center p-4"> <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200"> <div class="text-center mb-8"> <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h1> <p class="text-gray-500 mt-2">Ingresa a tu cuenta para ver tus cotizaciones</p> </div> <form id="form-login" class="space-y-5"> <div> <label class="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label> <input type="email" id="login-email" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" placeholder="tu@email.com"> </div> <div> <div class="flex justify-between items-center mb-1"> <label class="text-sm font-semibold text-gray-700">Contraseña</label> <a href="/recuperar" class="text-xs text-primary hover:underline font-medium">¿Olvidaste tu contraseña?</a> </div> <div class="relative"> <input type="password" id="login-password" required class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition pr-12" placeholder="••••••••"> <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none" data-target="login-password"> <svg class="eye-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> </button> </div> </div> <p id="mensaje-error" class="text-red-500 text-xs font-semibold text-center h-4"></p> <button type="submit" id="btn-ingresar" class="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]">
Ingresar
</button> </form> <div class="mt-8 pt-6 border-t border-gray-100 text-center"> <p class="text-gray-600 text-sm">
¿No tienes una cuenta?
<a href="/registro" class="text-primary font-bold hover:underline">Regístrate gratis</a> </p> <a href="/" class="block mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">Volver al catálogo</a> </div> </div> ${renderScript($$result, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/login.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/login.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
