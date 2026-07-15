/* empty css               */
import { c as createComponent } from './astro-component_C7yNNSoH.mjs';
import 'piccolore';
import { t as renderComponent, w as renderTemplate, r as maybeRenderHead, k as addAttribute, d as Fragment } from './entrypoint_Hi6hINZd.mjs';
import { r as renderScript } from './script_iD-g3G7V.mjs';
import { createClient } from '@supabase/supabase-js';
import { $ as $$Layout } from './Layout_2s4kLoH4.mjs';
import fs from 'node:fs';
import nodePath from 'node:path';

const supabaseUrl = "https://thpgyewhxkczzdtonrfm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocGd5ZXdoeGtjenpkdG9ucmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTgxMjgsImV4cCI6MjA5NTgzNDEyOH0.kvSWfEoxCa2dvQcUaBEgsQRGybv7AJedxqGINMvHgXc";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    // Fuerza a guardar la sesión
    autoRefreshToken: true,
    storageKey: "ag3d-auth-token"
    // Nombre único para la memoria
  }
});

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: productos, error } = await supabase.from("productos").select("*").order("id");
  const logosDir = nodePath.resolve("public/logos");
  let filasLogos = [];
  if (fs.existsSync(logosDir)) {
    const logos = fs.readdirSync(logosDir).filter((f) => f.endsWith(".png")).sort((a, b) => {
      const na = parseInt(a.replace(".png", ""), 10);
      const nb = parseInt(b.replace(".png", ""), 10);
      return na - nb;
    });
    const size = Math.ceil(logos.length / 3);
    filasLogos = [logos.slice(0, size), logos.slice(size, size * 2), logos.slice(size * 2)];
  }
  const heroDir = nodePath.resolve("public/assets/hero");
  let heroImages = [];
  if (fs.existsSync(heroDir)) {
    const files = fs.readdirSync(heroDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort();
    const names = new Set(files);
    const handled = /* @__PURE__ */ new Set();
    heroImages = [];
    for (const f of files) {
      if (handled.has(f)) continue;
      if (f.endsWith(".webp")) {
        const base = f.replace(/\.\w+$/, "");
        const orig = files.find((o) => !o.endsWith(".webp") && o.replace(/\.\w+$/, "") === base);
        if (orig) {
          heroImages.push({ file: orig, webp: f });
          handled.add(orig);
          handled.add(f);
        } else {
          heroImages.push({ file: f, webp: null });
          handled.add(f);
        }
      } else {
        const webp = f.replace(/\.\w+$/, ".webp");
        if (names.has(webp)) {
          heroImages.push({ file: f, webp });
          handled.add(f);
          handled.add(webp);
        } else {
          heroImages.push({ file: f, webp: null });
          handled.add(f);
        }
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Accesorios e Indumentaria Personalizada", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section id="home" class="bg-white py-20 text-center" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4" data-astro-cid-j7pv25f6> <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6" data-astro-cid-j7pv25f6>Llevamos tu logo a otro nivel</h1> <p class="text-lg md:text-xl text-gray-600 mb-10" data-astro-cid-j7pv25f6>Llaveros, indumentaria y accesorios impresos en 3D y personalizados para tu empresa.</p> <a href="/catalogo" class="inline-block bg-primary hover:bg-primary-hover text-white text-xl font-bold px-10 py-5 rounded-full transition shadow-xl hover:scale-105 active:scale-95 mb-12" data-astro-cid-j7pv25f6>
Explorar Catálogo
</a> <!-- Hero: carrusel flexible --> <div id="hero" class="relative w-full max-w-4xl mx-auto h-72 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200" data-astro-cid-j7pv25f6> ${heroImages.length === 0 ? renderTemplate`<img src="/assets/hero-placeholder.jpg" class="w-full h-full object-cover opacity-50" alt="Muestra de impresión 3D" data-astro-cid-j7pv25f6>` : heroImages.length === 1 ? renderTemplate`<picture data-astro-cid-j7pv25f6> ${heroImages[0].webp && renderTemplate`<source${addAttribute(`/assets/hero/${heroImages[0].webp}`, "srcset")} type="image/webp" data-astro-cid-j7pv25f6>`} <img${addAttribute(`/assets/hero/${heroImages[0].file}`, "src")} class="w-full h-full object-cover" alt="Trabajo AG3D" loading="eager" data-astro-cid-j7pv25f6> </picture>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-j7pv25f6": true }, { "default": async ($$result3) => renderTemplate` <div id="hero-track" class="flex h-full transition-transform duration-500 ease-in-out will-change-transform" style="transform: translateX(0%);" data-astro-cid-j7pv25f6> ${heroImages.map((img, i) => renderTemplate`<div${addAttribute(i, "key")} class="w-full h-full flex-shrink-0" data-astro-cid-j7pv25f6> <picture data-astro-cid-j7pv25f6> ${img.webp && renderTemplate`<source${addAttribute(`/assets/hero/${img.webp}`, "srcset")} type="image/webp" data-astro-cid-j7pv25f6>`} <img${addAttribute(`/assets/hero/${img.file}`, "src")}${addAttribute(`Trabajo AG3D ${i + 1}`, "alt")} class="w-full h-full object-cover"${addAttribute(i === 0 ? "eager" : "lazy", "loading")} data-astro-cid-j7pv25f6> </picture> </div>`)} </div> <div id="hero-dots" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10" data-astro-cid-j7pv25f6> ${heroImages.map((_, i) => renderTemplate`<button${addAttribute(i, "key")} class="hero-dot w-3 h-3 rounded-full bg-white/60 hover:bg-white/90 transition-all duration-200"${addAttribute(i, "data-index")}${addAttribute(`Foto ${i + 1}`, "aria-label")} data-astro-cid-j7pv25f6></button>`)} </div> ` })}`} </div> </div> </section> <section id="clientes" class="bg-secondary text-white py-20 text-center overflow-hidden scroll-mt-28" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4 mb-10" data-astro-cid-j7pv25f6> <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white" data-astro-cid-j7pv25f6>Confían en nosotros</h2> <p class="text-lg text-gray-300" data-astro-cid-j7pv25f6>Empresas que ya tienen sus productos AG3D.</p> </div> <div class="space-y-10" data-astro-cid-j7pv25f6> ${filasLogos.map((fila, i) => renderTemplate`<div class="logos-fila relative overflow-hidden w-full" data-astro-cid-j7pv25f6> <div class="logos-track flex items-center gap-16 md:gap-20"${addAttribute(`animation: scrollLogos-${i} 80s linear infinite;`, "style")} data-astro-cid-j7pv25f6> ${fila.map((l) => renderTemplate`<img${addAttribute(`/logos/${l}`, "src")} alt="Cliente" loading="lazy" class="logo-img" data-astro-cid-j7pv25f6>`)} ${fila.map((l) => renderTemplate`<img${addAttribute(`/logos/${l}`, "src")} alt="Cliente" loading="lazy" class="logo-img" data-astro-cid-j7pv25f6>`)} </div> </div>`)} </div> </section>  <section id="nosotros" class="bg-white py-20 scroll-mt-28" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4 max-w-5xl" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-center mb-10" data-astro-cid-j7pv25f6>Sobre nosotros</h2> <div class="space-y-5 text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Somos AG3D, un emprendimiento con más de 4 años en el mercado, dedicado a crear productos personalizados para empresas, emprendimientos y marcas.</p> <p data-astro-cid-j7pv25f6>Diseñamos y producimos merchandising con logo, como llaveros, indumentaria y accesorios, cuidando cada detalle para que tu marca se vea profesional.</p> <p data-astro-cid-j7pv25f6>Trabajamos con atención personalizada, boceto previo y envíos a todo el país.</p> </div> </div> </section> <section id="faq" class="py-20 scroll-mt-28" data-astro-cid-j7pv25f6> <div class="container mx-auto px-4 max-w-3xl" data-astro-cid-j7pv25f6> <h2 class="text-3xl font-bold text-center mb-10" data-astro-cid-j7pv25f6>Preguntas Frecuentes</h2> <details class="bg-white mb-4 p-4 rounded-lg shadow cursor-pointer group" data-astro-cid-j7pv25f6> <summary class="font-semibold text-lg outline-none" data-astro-cid-j7pv25f6>¿Cuál es la demora de entrega?</summary> <p class="mt-4 text-gray-600" data-astro-cid-j7pv25f6>El plazo máximo de producción es de hasta 10 días hábiles, dependiendo del producto, la cantidad y la complejidad del diseño.</p> </details> <details class="bg-white mb-4 p-4 rounded-lg shadow cursor-pointer group" data-astro-cid-j7pv25f6> <summary class="font-semibold text-lg outline-none" data-astro-cid-j7pv25f6>¿Qué métodos de envío utilizan?</summary> <div class="mt-4 text-gray-600 space-y-2" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Realizamos envíos a todo el país por Andreani o Correo Argentino.</p> <p data-astro-cid-j7pv25f6>Podés elegir envío a sucursal o domicilio, según disponibilidad de la empresa de transporte.</p> </div> </details> <details class="bg-white mb-4 p-4 rounded-lg shadow cursor-pointer group" data-astro-cid-j7pv25f6> <summary class="font-semibold text-lg outline-none" data-astro-cid-j7pv25f6>¿Cómo debo enviar el logo?</summary> <div class="mt-4 text-gray-600 space-y-2" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>Para trabajar el diseño de la mejor manera, recomendamos enviar el logo en alguno de estos formatos, en este orden de preferencia: .AI, PDF, PNG o JPEG.</p> <p data-astro-cid-j7pv25f6>Cuanto mejor sea la calidad del archivo, mejor será el resultado final del producto personalizado.</p> </div> </details> </div> </section> ` })} ${renderScript($$result, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/index.astro", void 0);

const $$file = "C:/Users/lopar/OneDrive/Documentos/AG3D WEB/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
