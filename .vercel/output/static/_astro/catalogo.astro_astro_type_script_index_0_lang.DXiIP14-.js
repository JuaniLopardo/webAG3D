import{s as h}from"./supabase.DoZ8rsqu.js";import{i as y}from"./auth.DadfgpCy.js";const n=document.getElementById("catalogo-grid"),u=document.getElementById("empty-state"),v=document.getElementById("catalogo-loading"),g=document.getElementById("search-input"),f=document.getElementById("sort-select"),b=document.getElementById("results-count");function p(e){if(!e)return null;if(typeof e=="string"){if(e.startsWith("{"))try{return JSON.parse(e).url}catch{return null}return e}return e.url||null}function L(e){n.innerHTML=e.map(t=>{const s=Array.isArray(t.fotos)?t.fotos:t.fotos?[t.fotos]:[],o=p(s[0]),a=p(s[1]);return`
        <a href="/producto/${t.id}"
           class="card-producto group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
           data-titulo="${(t.titulo||"").toLowerCase()}"
           data-descripcion="${(t.descripcion||"").toLowerCase()}">
          <div class="relative w-full aspect-square overflow-hidden bg-gray-100">
            ${o?`
              <img src="${o}" alt="${t.titulo}" class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 group-hover:opacity-0" loading="lazy">
              ${a?`<img src="${a}" alt="${t.titulo} alt" class="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 opacity-0 group-hover:opacity-100" loading="lazy">`:""}
            `:`
              <div class="w-full h-full bg-gray-200 flex items-center justify-center p-6 text-center">
                <span class="text-gray-400 font-medium text-sm">Sin imagen</span>
              </div>
            `}
          </div>
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 leading-tight line-clamp-2 group-hover:text-primary transition-colors">${t.titulo}</h3>
            <p class="text-gray-500 text-xs line-clamp-2">${t.descripcion||""}</p>
          </div>
        </a>`}).join("")}function m(){const e=g.value.trim().toLowerCase(),t=Array.from(document.querySelectorAll(".card-producto"));let s=0;t.forEach(r=>{const d=r.dataset.titulo||"",c=r.dataset.descripcion||"",l=!e||d.includes(e)||c.includes(e);r.classList.toggle("hidden",!l),l&&s++});const o=f.value,a=t.filter(r=>!r.classList.contains("hidden"));a.sort((r,d)=>{const c=r.dataset.titulo||"",l=d.dataset.titulo||"";return o==="az"?c.localeCompare(l):o==="za"?l.localeCompare(c):0}),a.forEach(r=>n.appendChild(r)),s===0?(u.classList.remove("hidden"),n.classList.add("hidden")):(u.classList.add("hidden"),n.classList.remove("hidden"));const i=t.length;b.textContent=e?`Mostrando ${s} de ${i} producto${i!==1?"s":""}`:`${i} producto${i!==1?"s":""} disponible${i!==1?"s":""}`}document.addEventListener("DOMContentLoaded",async()=>{const e=await y();e&&document.getElementById("admin-banner")?.classList.remove("hidden");const{data:t,error:s}=await h.from("productos").select("*").order("id");if(v?.classList.add("hidden"),s){n.classList.remove("hidden"),n.innerHTML=`<div class="col-span-full text-center text-red-500 py-16">Error al cargar productos: ${s.message}</div>`;return}if(!t||t.length===0){u.classList.remove("hidden");return}n.classList.remove("hidden"),L(t),e&&document.querySelectorAll("a.card-producto").forEach(o=>{o.removeAttribute("href"),o.style.pointerEvents="none",o.style.opacity="0.6",o.style.cursor="not-allowed",o.setAttribute("title","Las compras están deshabilitadas para administradores")}),m()});g.addEventListener("input",m);f.addEventListener("change",m);
