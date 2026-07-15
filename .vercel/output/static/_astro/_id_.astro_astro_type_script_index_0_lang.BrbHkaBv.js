import{s as L}from"./supabase.DoZ8rsqu.js";import{f as T,a as J}from"./cart.DWRfWgH-.js";import{i as H}from"./auth.DadfgpCy.js";const $=Number(location.pathname.split("/").pop()),_=document.getElementById("producto-loading"),F=document.getElementById("producto-error"),C=document.getElementById("producto-error-msg"),P=document.getElementById("producto-container");function z(e){if(!e)return null;if(typeof e=="string"){if(e.startsWith("{"))try{return JSON.parse(e).url}catch{return null}return e}return e.url||null}function D(e){const r=Array.isArray(e.fotos)?e.fotos:e.fotos?[e.fotos]:[],u=e.variables||{},f=e.mapeo_fotos||{},n=Number(e.cantidad_minima)||1,m=z(r[0]),v=Object.keys(u).length>0;document.title=`${e.titulo} | AG3D`,P.innerHTML=`
        <div class="md:w-1/2 bg-white flex flex-col items-center justify-center p-4 md:p-8 relative group">
          ${r.length>0?`
            <div class="w-full max-w-md relative" id="galeria-container" data-fotos='${JSON.stringify(r)}' data-mapeo='${JSON.stringify(f)}'>
              <div class="aspect-square w-full bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative">
                <img id="foto-principal" src="${m}" alt="${e.titulo}" class="w-full h-full object-contain transition-opacity duration-300" />
              </div>
              ${r.length>1?`
                <button id="btn-prev" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md font-bold text-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">&lt;</button>
                <button id="btn-next" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-md font-bold text-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110">&gt;</button>
                <div class="flex justify-center gap-2 mt-4">
                  ${r.map((s,g)=>`<div class="w-2.5 h-2.5 rounded-full dot-indicador transition-colors ${g===0?"bg-primary":"bg-gray-300"}" data-index="${g}"></div>`).join("")}
                </div>
              `:""}
            </div>
          `:`
            <div class="w-full min-h-[300px] bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
              <span class="text-gray-400 text-lg font-medium">Sin imagen disponible</span>
            </div>
          `}
        </div>
        <div class="md:w-1/2 p-8 md:p-12">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${e.titulo}</h1>
          <p class="text-gray-600 mb-6 text-lg leading-relaxed">${e.descripcion||""}</p>
          <div class="bg-primary-light border-l-4 border-primary p-4 mb-8">
            <p class="text-primary font-semibold">Mínimo: <span id="minimo-num" class="text-secondary font-bold">${n} unidades</span></p>
            <p class="text-xs text-gray-500 mt-1">Podés combinar diferentes variables para llegar al mínimo.</p>
          </div>
          ${v?`
            <div class="mb-8 space-y-6">
              ${Object.entries(u).map(([s,g])=>`
                <div>
                  <span class="block font-bold text-gray-900 capitalize mb-3 text-sm tracking-wide">${s}:</span>
                  <div class="flex flex-wrap gap-2" data-var-group="${s}">
                    ${g.map(x=>`
                      <button class="var-btn px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium border-2 border-gray-200 hover:border-primary hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary-light" data-valor="${x}" data-var-key="${s}">${x}</button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          `:""}
          <div id="cliente-only">
            <div class="mb-6">
              <label class="block font-bold text-gray-900 text-sm tracking-wide mb-2">Cantidad:</label>
              <div class="flex items-center gap-3">
                <button id="qty-minus" type="button" class="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-primary hover:text-primary text-gray-600 font-bold text-lg transition">−</button>
                <input id="qty-input" type="number" min="1" value="1" class="w-20 h-10 text-center border-2 border-gray-200 rounded-lg font-semibold focus:outline-none focus:border-primary" />
                <button id="qty-plus" type="button" class="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-primary hover:text-primary text-gray-600 font-bold text-lg transition">+</button>
                <span class="text-sm text-gray-500">unidades</span>
              </div>
            </div>
            <div id="cart-status" class="mb-4 text-sm text-gray-600"></div>
            <button id="btn-add-cart" type="button" data-titulo="${e.titulo}" data-foto="${m||""}" data-minimo="${n}" disabled class="w-full px-8 py-4 bg-primary text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none">Agregar al carrito</button>
            <p id="login-hint" class="text-xs text-gray-500 mt-3 text-center"><a href="/login" class="text-primary hover:underline">Iniciá sesión</a> para agregar al carrito.</p>
          </div>
          <div id="admin-only" class="hidden bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-lg">
            <p class="text-gray-700 font-semibold mb-1">Estás navegando como administrador.</p>
            <p class="text-sm text-gray-500">Para gestionar este producto, andá al <a href="/admin" class="text-primary hover:underline font-semibold">panel de administración</a>.</p>
          </div>
        </div>
      `,G(r,n)}function G(e,r){const u=document.getElementById("galeria-container"),f=u?.getAttribute("data-fotos"),n=f?JSON.parse(f):e,m=document.getElementById("foto-principal"),v=document.getElementById("btn-prev"),s=document.getElementById("btn-next"),g=document.querySelectorAll(".dot-indicador"),x=document.querySelectorAll(".var-btn"),a=document.getElementById("btn-add-cart"),i=document.getElementById("qty-input"),M=document.getElementById("qty-minus"),O=document.getElementById("qty-plus"),b=document.getElementById("cart-status"),I=document.querySelectorAll("[data-var-group]");let p=0;const E={};let h=null;function B(t){if(!t)return"";if(typeof t=="string"){if(t.startsWith("{"))try{return JSON.parse(t).url}catch{return t}return t}return t.url||""}function w(t){t<0||t>=n.length||(p=t,m.style.opacity="0.5",setTimeout(()=>{m.src=B(n[p]),m.style.opacity="1"},150),g.forEach((o,l)=>{l===p?o.classList.replace("bg-gray-300","bg-primary"):o.classList.replace("bg-primary","bg-gray-300")}))}v&&s&&(v.addEventListener("click",()=>{let t=p-1;t<0&&(t=n.length-1),w(t)}),s.addEventListener("click",()=>{let t=p+1;t>=n.length&&(t=0),w(t)})),x.forEach(t=>{t.addEventListener("click",o=>{const l=o.currentTarget,y=l.getAttribute("data-valor"),A=l.getAttribute("data-var-key")||"";if(!y||!A)return;(l.parentElement?.querySelectorAll(".var-btn")||[]).forEach(c=>{c.classList.remove("border-primary","bg-primary-light","text-primary"),c.classList.add("border-gray-200","text-gray-700")}),l.classList.remove("border-gray-200","text-gray-700"),l.classList.add("border-primary","bg-primary-light","text-primary"),E[A]=y,d();const q=u?.getAttribute("data-mapeo"),N=q?JSON.parse(q):{},k=n.findIndex(c=>{const j=typeof c=="string"&&c.startsWith("{")?JSON.parse(c):c;return typeof j=="object"&&j.variableAsociada===y});k!==-1?w(k):N[y]!==void 0&&w(N[y])})}),M?.addEventListener("click",()=>{const t=Math.max(1,Number(i.value)-1);i.value=String(t),d()}),O?.addEventListener("click",()=>{i.value=String(Number(i.value)+1),d()}),i?.addEventListener("input",()=>{Number(i.value)<1&&(i.value="1"),d()});function S(){if(I.length===0)return!0;for(const t of Array.from(I)){const o=t.dataset.varGroup||"";if(!E[o])return!1}return!0}function d(){const t=T($);if(!h){a.disabled=!0,a.textContent="Iniciá sesión para agregar al carrito",b.innerHTML="",document.getElementById("login-hint")?.classList.remove("hidden");return}if(document.getElementById("login-hint")?.classList.add("hidden"),!S()){a.disabled=!0,a.textContent="Elegí todas las variables",b.innerHTML="";return}if(a.disabled=!1,a.textContent="Agregar al carrito",t===0)b.innerHTML=`<span class="text-gray-500">Podés ir sumando unidades y variables. Podés solicitar cotización al llegar al mínimo de <b>${r}</b>.</span>`;else if(t<r){const o=r-t;b.innerHTML=`<span class="text-accent">Llevás <b>${t}</b> en carrito. Faltan <b>${o}</b> para el mínimo (podés sumar más variables).</span>`}else b.innerHTML=`<span class="text-green-600 font-semibold">✓ Mínimo cubierto. Llevás ${t} en carrito.</span>`}a?.addEventListener("click",async()=>{const t=Number(i.value)||1;if(!a.disabled){if(!h){alert("Necesitás iniciar sesión para agregar al carrito."),window.location.href="/login?redirect="+encodeURIComponent(location.pathname);return}if(!S()){alert("Elegí una opción de cada variable antes de agregar.");return}J({producto_id:$,titulo:a.dataset.titulo||document.querySelector("h1")?.textContent||"",foto_url:a.dataset.foto||B(n[0]),cantidad_minima:r,variables:{...E},cantidad:t}),a.textContent="¡Agregado!",a.classList.replace("bg-primary","bg-green-500"),setTimeout(()=>{a.classList.replace("bg-green-500","bg-primary"),d()},1500)}}),L.auth.onAuthStateChange((t,o)=>{h=o,d()}),L.auth.getSession().then(({data:{session:t}})=>{h=t,d()})}document.addEventListener("DOMContentLoaded",async()=>{const{data:e,error:r}=await L.from("productos").select("*").eq("id",$).single();if(_?.classList.add("hidden"),r||!e){F?.classList.remove("hidden"),C&&(C.textContent=r?`Error al cargar producto: ${r.message}`:"Producto no encontrado.");return}P.classList.remove("hidden"),D(e),await H()&&(document.getElementById("cliente-only")?.classList.add("hidden"),document.getElementById("admin-only")?.classList.remove("hidden"))});
