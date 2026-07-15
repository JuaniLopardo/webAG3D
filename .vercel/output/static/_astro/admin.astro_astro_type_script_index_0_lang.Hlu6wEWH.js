import{s as P}from"./supabase.DoZ8rsqu.js";const r={supabase:P,productos:[],usuarios:[],fotosParaSubir:[],paginaProductos:0,paginaPedidos:0,pageSize:10},R=r.supabase,G=document.getElementById("admin-pedidos-container"),j=document.getElementById("modal-nuevo-pedido"),W=document.getElementById("btn-nuevo-pedido-manual"),J=document.getElementById("btn-close-order-modal"),K=document.getElementById("form-nuevo-pedido"),M=document.getElementById("items-manual-container"),Q=document.getElementById("btn-add-item-manual"),z=document.getElementById("new-order-cliente"),ge=document.getElementById("filter-fecha-desde"),be=document.getElementById("filter-fecha-hasta"),fe=document.getElementById("btn-filtrar-pedidos"),ve=document.getElementById("btn-descargar-csv");let D=null;function ce(){let e=R.from("pedidos").select("*, perfiles(email, nombre_completo)",{count:"exact"});const t=ge?.value,a=be?.value;return t&&(e=e.gte("fecha_pedido",`${t}T00:00:00Z`)),a&&(e=e.lte("fecha_pedido",`${a}T23:59:59Z`)),e=e.order("fecha_pedido",{ascending:!1}),D={desde:t,hasta:a},e}async function I(){if(!G)return;const e=r.paginaPedidos*r.pageSize,t=e+r.pageSize-1,a=ce(),{data:c,error:n,count:s}=await a.range(e,t);if(n||!c)return;const m=["no confirmado","Recibido","en diseño","en producción","en preparación para envío","enviado"];G.innerHTML=c.map(l=>{const f=new Date(l.fecha_pedido).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),i=l.perfiles||{email:"Desconocido",nombre_completo:"Desconocido"},v=Array.isArray(l.items)?l.items:[];return`
      <tr class="hover:bg-gray-50 transition border-b border-gray-100 text-sm">
        <td class="p-4">
          <p class="font-bold text-gray-900">#${l.id}</p>
          <p class="text-[10px] text-gray-500">${f}</p>
        </td>
        <td class="p-4">
          <p class="font-medium text-gray-900">${i.nombre_completo||"Sin nombre"}</p>
          <p class="text-[10px] text-gray-500">${i.email}</p>
        </td>
        <td class="p-4">
          <div class="space-y-1">
            ${v.map(g=>`
              <div class="text-[10px] text-gray-600">
                <span class="font-bold">${g.cantidad}x</span> ${g.titulo} 
                ${g.variante?`<span class="italic">(${g.variante})</span>`:""}
              </div>
            `).join("")}
          </div>
        </td>
        <td class="p-4">
          <div class="flex flex-col gap-2">
            <select class="select-order-status border border-gray-300 rounded px-2 py-1 text-[10px] focus:ring-2 focus:ring-primary outline-none" data-id="${l.id}">
              ${m.map(g=>`<option value="${g}" ${l.estado===g?"selected":""}>${g}</option>`).join("")}
            </select>
            <input type="text" class="input-order-tracking border border-gray-300 rounded px-2 py-1 text-[10px] focus:ring-2 focus:ring-primary outline-none" 
              placeholder="N° de Tracking o URL" value="${l.tracking||""}" />
          </div>
        </td>
        <td class="p-4 text-right">
          <button class="btn-actualizar-pedido bg-primary-light text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm" data-id="${l.id}">
            Actualizar
          </button>
        </td>
      </tr>
    `}).join(""),document.querySelectorAll(".btn-actualizar-pedido").forEach(l=>{l.addEventListener("click",async f=>{const i=f.currentTarget,v=i.dataset.id,g=i.closest("tr"),p=g?.querySelector(".select-order-status").value,b=g?.querySelector(".input-order-tracking").value;i.textContent="...",i.disabled=!0;const{error:y}=await R.from("pedidos").update({estado:p,tracking:b}).eq("id",v);y&&alert("Error al actualizar: "+y.message),i.textContent="Actualizar",i.disabled=!1})});const u=document.getElementById("info-pag-pedidos");if(u&&s!==null){const l=Math.ceil(s/r.pageSize);u.textContent=`Página ${r.paginaPedidos+1} de ${l||1}`}const o=document.getElementById("btn-pedidos-prev"),d=document.getElementById("btn-pedidos-next");o&&(o.disabled=r.paginaPedidos===0),d&&(d.disabled=(r.paginaPedidos+1)*r.pageSize>=(s||0))}function Z(){if(!M)return;const e=document.createElement("div");e.className="item-manual-row p-3 bg-gray-50 rounded-lg border border-gray-200 relative pt-8 sm:pt-3",e.innerHTML=`
    <button type="button" class="btn-remove-item absolute top-2 right-2 text-gray-400 hover:text-red-500 transition">&times;</button>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Producto</label>
        <select class="select-prod-manual w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white" required>
          <option value="">Selecciona...</option>
          ${r.productos.map(c=>`<option value="${c.id}">${c.titulo}</option>`).join("")}
        </select>
      </div>
      <div>
        <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cantidad</label>
        <input type="number" class="input-qty-manual w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white" min="1" value="1" required />
      </div>
      <div class="sm:col-span-2 vars-manual-container flex flex-wrap gap-2"></div>
    </div>
  `;const t=e.querySelector(".select-prod-manual"),a=e.querySelector(".vars-manual-container");t.addEventListener("change",()=>{const c=t.value,n=r.productos.find(s=>s.id.toString()===c);a.innerHTML="",n&&n.variables&&Object.entries(n.variables).forEach(([s,m])=>{const u=document.createElement("select");u.className="select-var-manual px-2 py-1 border border-gray-300 rounded text-[10px] bg-white",u.setAttribute("data-key",s),u.innerHTML=`<option value="">${s}...</option>`+m.map(o=>`<option value="${o}">${o}</option>`).join(""),a.appendChild(u)})}),e.querySelector(".btn-remove-item")?.addEventListener("click",()=>e.remove()),M.appendChild(e)}function ye(){W&&W.addEventListener("click",()=>{z&&(z.innerHTML='<option value="">Selecciona un cliente</option>'+r.usuarios.map(e=>`<option value="${e.id}">${e.email} (${e.nombre_completo||"Sin nombre"})</option>`).join(""),M&&(M.innerHTML="",Z()),j?.classList.replace("hidden","flex"))}),J&&J.addEventListener("click",()=>j?.classList.replace("flex","hidden")),Q&&Q.addEventListener("click",()=>Z()),document.getElementById("btn-pedidos-prev")?.addEventListener("click",()=>{r.paginaPedidos>0&&(r.paginaPedidos--,I())}),document.getElementById("btn-pedidos-next")?.addEventListener("click",()=>{r.paginaPedidos++,I()}),K&&K.addEventListener("submit",async e=>{e.preventDefault();const t=document.getElementById("btn-save-manual-order");if(!t)return;t.disabled=!0,t.textContent="Guardando...";const a=[];document.querySelectorAll(".item-manual-row").forEach(n=>{const s=n.querySelector(".select-prod-manual").value,m=parseInt(n.querySelector(".input-qty-manual").value),u=r.productos.find(d=>d.id.toString()===s);let o="";n.querySelectorAll(".select-var-manual").forEach(d=>{const l=d.value;l&&(o+=(o?" / ":"")+l)}),u&&a.push({id:u.id,titulo:u.titulo,cantidad:m,variante:o,subtotal:(u.precio||0)*m})});const{error:c}=await R.from("pedidos").insert({cliente_id:z.value,estado:"Recibido",items:a,fecha_pedido:new Date().toISOString()});c?alert("Error al crear cotización: "+c.message):(j?.classList.replace("flex","hidden"),I()),t.disabled=!1,t.textContent="Crear Cotización"}),fe?.addEventListener("click",()=>{r.paginaPedidos=0,I()}),ve?.addEventListener("click",async()=>{const e=ce(),{data:t,error:a}=await e;if(a||!t||t.length===0){alert("No hay cotizaciones para descargar.");return}const c=["ID Cotización","Fecha","Cliente Email","Cliente Nombre","Estado","Productos","Total Unidades","Tracking"],n=t.map(d=>{const l=d.fecha_pedido?new Date(d.fecha_pedido).toLocaleDateString("es-AR"):"",f=d.perfiles||{},i=Array.isArray(d.items)?d.items:[],v=i.map(p=>`${p.titulo} x${p.cantidad}${p.variables?" ("+Object.entries(p.variables).map(([b,y])=>`${b}:${y}`).join(", ")+")":""}`).join("; "),g=i.reduce((p,b)=>p+Number(b.cantidad||0),0);return[d.id,l,f.email||"",f.nombre_completo||"",d.estado||"",v,g,d.tracking||""]}),s=[c,...n].map(d=>d.map(l=>`"${String(l).replace(/"/g,'""')}"`).join(",")).join(`
`),m=new Blob([s],{type:"text/csv;charset=utf-8;"}),u=URL.createObjectURL(m),o=document.createElement("a");o.href=u,o.download=`cotizaciones_${D?.desde||"todas"}_${D?.hasta||"todas"}.csv`,o.click(),URL.revokeObjectURL(u)})}const X=r.supabase,Y=document.getElementById("admin-usuarios-container"),H=document.getElementById("modal-pedidos"),ee=document.getElementById("btn-cerrar-pedidos"),w=document.getElementById("pedidos-cliente-container");async function te(){if(!Y)return;const{data:e,error:t}=await X.from("perfiles").select("*").order("email");t||!e||(r.usuarios=e,Y.innerHTML=e.map(a=>{const c=a.instagram?a.instagram.replace("@",""):null,n=c?`<a href="https://instagram.com/${c}" target="_blank" class="text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1.5 text-xs transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.058-1.69-.072-4.949-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44c-.795 0-1.44-.645-1.44-1.44s.645-1.44 1.44-1.44z"/></svg>
          @${c}
        </a>`:'<span class="text-gray-400 italic text-xs">No vinculado</span>';return`
      <tr class="hover:bg-gray-50 transition border-b border-gray-100">
        <td class="p-4">
          <p class="font-medium text-gray-900 text-sm">${a.email||'<span class="text-red-400 italic">Email no sincronizado</span>'}</p>
          <p class="text-[10px] text-gray-400 font-mono">${a.id}</p>
        </td>
        <td class="p-4">
          <p class="text-sm text-gray-700 font-bold">${a.nombre_completo||'<span class="italic text-gray-400">Sin nombre</span>'}</p>
          ${a.nombre_empresa?`<p class="text-[10px] text-primary font-bold uppercase tracking-tighter mt-0.5">${a.nombre_empresa}</p>`:""}
          <p class="text-xs text-gray-500 mt-1">${a.telefono||"Sin teléfono"}</p>
        </td>
        <td class="p-4">${n}</td>
        <td class="p-4 text-right">
          <button class="btn-pedidos bg-primary-light text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm" 
            data-user-id="${a.id}" 
            data-user-email="${a.email}">
            Ver Pedidos
          </button>
        </td>
      </tr>
    `}).join(""),document.querySelectorAll(".btn-pedidos").forEach(a=>{a.addEventListener("click",async c=>{const n=c.currentTarget,s=n.dataset.userId,m=n.dataset.userEmail;H&&H.classList.replace("hidden","flex"),w&&(w.innerHTML='<p class="text-center py-10 animate-pulse">Consultando pedidos...</p>');const{data:u,error:o}=await X.from("pedidos").select("*").eq("cliente_id",s).order("fecha_pedido",{ascending:!1});if(w){if(o||!u||u.length===0){w.innerHTML=`
          <div class="text-center py-12">
            <p class="text-gray-500 mb-4 italic">No se encontraron pedidos para ${m}</p>
            <div class="inline-block px-3 py-1 bg-gray-100 rounded text-[10px] font-mono text-gray-400 uppercase tracking-widest">ID: ${s}</div>
          </div>
        `;return}w.innerHTML=`
        <div class="space-y-4">
          ${u.map(d=>{const l=new Date(d.fecha_pedido).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}),f=d.items||[];return`
              <div class="border border-gray-200 rounded-xl p-4 hover:border-primary/40 transition-colors bg-gray-50">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span class="text-[10px] font-bold text-primary uppercase tracking-tight">Pedido #${d.id}</span>
                    <p class="text-sm font-bold text-gray-900">${l}</p>
                  </div>
                  <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase ${d.estado==="entregado"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}">
                    ${d.estado||"pendiente"}
                  </span>
                </div>
                <div class="text-xs text-gray-600 space-y-1">
                  ${Array.isArray(f)?f.map(i=>`
                    <div class="flex justify-between border-t border-gray-200 pt-1 mt-1">
                      <span>${i.cantidad}x ${i.titulo} ${i.variante?`(${i.variante})`:""}</span>
                      <span class="font-mono">$${i.subtotal||0}</span>
                    </div>
                  `).join(""):"<p>No hay detalles de items</p>"}
                </div>
              </div>
            `}).join("")}
        </div>`}})}))}function xe(){ee&&(ee.onclick=()=>{H?.classList.replace("flex","hidden")})}function he(){const e={pedidos:{btn:document.getElementById("tab-pedidos"),sec:document.getElementById("section-pedidos")},productos:{btn:document.getElementById("tab-productos"),sec:document.getElementById("section-productos")},usuarios:{btn:document.getElementById("tab-usuarios"),sec:document.getElementById("section-usuarios")}};function t(a){Object.entries(e).forEach(([c,n])=>{!n.btn||!n.sec||(c===a?(n.btn.className="w-full text-left px-4 py-3 rounded-lg bg-primary text-white font-medium transition",n.sec.classList.remove("hidden"),n.sec.classList.add("block"),c==="usuarios"&&te(),c==="pedidos"&&(I(),te())):(n.btn.className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white font-medium transition",n.sec.classList.remove("block"),n.sec.classList.add("hidden")))})}e.pedidos.btn?.addEventListener("click",()=>t("pedidos")),e.productos.btn?.addEventListener("click",()=>t("productos")),e.usuarios.btn?.addEventListener("click",()=>t("usuarios"))}const L=r.supabase,h=document.getElementById("modal-producto"),le=document.getElementById("modal-producto-titulo"),N=document.getElementById("form-producto"),x=document.getElementById("modal-prod-mensaje"),E=document.getElementById("btn-guardar-producto"),C=document.getElementById("prod-id"),O=document.getElementById("prod-titulo"),ue=document.getElementById("prod-desc"),U=document.getElementById("prod-min"),pe=document.getElementById("prod-precio"),$=document.getElementById("prod-fotos"),A=document.getElementById("preview-fotos-container"),q=document.getElementById("variables-container"),_=document.getElementById("admin-productos-container"),ae=document.getElementById("btn-nuevo-producto"),oe=document.getElementById("btn-cerrar-modal"),ne=document.getElementById("btn-add-var"),re=document.getElementById("modal-visor"),se=document.getElementById("img-visor"),ie=document.getElementById("txt-visor");function Ee(e,t){se&&ie&&re&&(se.src=e,ie.textContent=t,re.classList.replace("hidden","flex"))}function B(){if(!A)return;A.innerHTML="";const e=[];document.querySelectorAll(".var-row").forEach(t=>{const c=t.querySelector(".var-values").value.split(",").map(n=>n.trim()).filter(n=>n!=="");e.push(...c)}),r.fotosParaSubir.forEach((t,a)=>{const c=document.createElement("div");c.className="relative group border border-gray-200 rounded-lg p-1 bg-white";let n='<option value="">General (Sin variable)</option>';e.forEach(s=>{n+=`<option value="${s}" ${t.variableAsociada===s?"selected":""}>${s}</option>`}),c.innerHTML=`
      <img src="${t.url}" class="w-full h-24 object-cover rounded" />
      <select data-index="${a}" class="select-var-foto mt-1 w-full text-[10px] p-1 border rounded">
        ${n}
      </select>
      <button type="button" data-index="${a}" class="btn-remove-foto absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg">×</button>
    `,c.querySelector(".select-var-foto")?.addEventListener("change",s=>{const m=s.target;r.fotosParaSubir[parseInt(m.dataset.index)].variableAsociada=m.value}),c.querySelector(".btn-remove-foto")?.addEventListener("click",s=>{const m=s.currentTarget;r.fotosParaSubir.splice(parseInt(m.dataset.index),1),B()}),A.appendChild(c)})}function me(e="",t=[]){if(!q)return;const a=document.createElement("div");a.className="flex gap-2 items-start var-row bg-gray-50 p-2 rounded border border-gray-200",a.innerHTML=`
    <input type="text" class="var-key w-1/3 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm font-medium" placeholder="Ej. Talles" value="${e}" />
    <input type="text" class="var-values flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ej. S, M, L, XL" value="${t.join(", ")}" />
    <button type="button" class="btn-del-var text-gray-400 hover:text-red-500 p-1.5 transition" title="Eliminar variable">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `,a.querySelector(".btn-del-var")?.addEventListener("click",()=>a.remove()),a.querySelector(".var-key")?.addEventListener("input",()=>B()),a.querySelector(".var-values")?.addEventListener("input",()=>B()),q.appendChild(a)}async function S(){const e=r.paginaProductos*r.pageSize,t=e+r.pageSize-1,{data:a,error:c,count:n}=await L.from("productos").select("*",{count:"exact"}).order("id",{ascending:!1}).range(e,t);if(c||(r.productos=a||[],!_))return;r.productos.length>0?(_.innerHTML=r.productos.map(o=>{const d=Array.isArray(o.fotos)?o.fotos:o.fotos?[o.fotos]:[],l=b=>{if(!b)return null;if(typeof b=="string"){if(b.startsWith("{"))try{return JSON.parse(b).url}catch{return null}return b}return b.url},f=o.variables||{};let i="";d.filter(b=>typeof b=="string"?!0:!b.variableAsociada||b.variableAsociada==="").length>0&&(i+=`
          <button class="btn-ver-var px-2 py-1 rounded text-[10px] capitalize transition mb-1 mr-1 bg-primary text-white hover:bg-primary-hover font-bold shadow-sm" 
            data-prod-id="${o.id}" 
            data-var-key="general">
            Principal
          </button>`),Object.entries(f).forEach(([b,y])=>{(Array.isArray(y)?y:[]).forEach(T=>{const F=d.some(V=>typeof V=="object"&&V.variableAsociada===T);i+=`
            <button class="btn-ver-var px-2 py-1 rounded text-[10px] capitalize transition mb-1 mr-1 ${F?"bg-primary text-white hover:bg-primary-hover font-bold shadow-sm":"bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"}" 
              data-prod-id="${o.id}" 
              data-var-key="${T}" 
              ${F?"":"disabled"}>
              ${T}
            </button>`})}),i||(i='<span class="text-gray-400 text-xs italic">Ninguna</span>');const g=l(d[0]);return`
        <tr class="hover:bg-gray-50 transition border-b border-gray-100">
          <td class="p-4">${g?`<img src="${g}" class="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />`:'<div class="w-12 h-12 bg-gray-200 rounded-md border border-gray-300 flex items-center justify-center text-xs text-gray-400">Sin img</div>'}</td>
          <td class="p-4">
            <p class="font-bold text-gray-900">${o.titulo}</p>
            <p class="text-xs text-gray-500 font-mono">ID: #${o.id}</p>
          </td>
          <td class="p-4 flex gap-1 flex-wrap">${i}</td>
          <td class="p-4 text-right space-x-2">
            <button class="text-primary hover:text-primary-hover font-semibold text-sm btn-editar" data-id="${o.id}">Editar</button>
            <button class="text-red-600 hover:text-red-800 font-semibold text-sm btn-eliminar" data-id="${o.id}">Borrar</button>
          </td>
        </tr>
      `}).join(""),document.querySelectorAll(".btn-eliminar").forEach(o=>{o.addEventListener("click",async d=>{const l=d.target,f=l.getAttribute("data-id");confirm("¿Estás seguro de borrar este producto?")&&(l.textContent="Borrando...",await L.from("productos").delete().eq("id",f),S())})}),document.querySelectorAll(".btn-ver-var").forEach(o=>{o.addEventListener("click",d=>{const l=d.currentTarget,f=l.dataset.prodId,i=l.dataset.varKey,v=r.productos.find(p=>p.id.toString()===f),g=p=>typeof p=="string"&&p.startsWith("{")?JSON.parse(p).url:p.url||p;if(v&&v.fotos){const p=v.fotos.find(b=>{const y=typeof b=="string"&&b.startsWith("{")?JSON.parse(b):b;return i==="general"?typeof y=="string"||!y.variableAsociada:typeof y=="object"&&y.variableAsociada===i});if(p){const b=g(p);Ee(b,`${v.titulo} - ${i==="general"?"Principal":i}`)}}})}),document.querySelectorAll(".btn-editar").forEach(o=>{o.addEventListener("click",d=>{const f=d.target.getAttribute("data-id"),i=r.productos.find(v=>v.id.toString()===f);if(i){le.textContent="Editar Producto",C.value=i.id,O.value=i.titulo,ue.value=i.descripcion||"",U.value=i.cantidad_minima,pe.value=i.precio||"",$.value="";const v=Array.isArray(i.fotos)?i.fotos:i.fotos?[i.fotos]:[];r.fotosParaSubir=v.map(g=>{const p=typeof g=="string"&&g.startsWith("{")?JSON.parse(g):g;return typeof p=="string"?{url:p,variableAsociada:""}:{url:p.url,variableAsociada:p.variableAsociada||""}}),B(),q.innerHTML="",i.variables&&Object.entries(i.variables).forEach(([g,p])=>{me(g,p)}),x.textContent="",h.classList.remove("hidden"),h.classList.add("flex")}})})):_.innerHTML='<tr><td colspan="4" class="p-4 text-center text-gray-500 italic">No hay productos.</td></tr>';const s=document.getElementById("info-pag-productos");if(s&&n!==null){const o=Math.ceil(n/r.pageSize);s.textContent=`Página ${r.paginaProductos+1} de ${o||1}`}const m=document.getElementById("btn-prod-prev"),u=document.getElementById("btn-prod-next");m&&(m.disabled=r.paginaProductos===0),u&&(u.disabled=(r.paginaProductos+1)*r.pageSize>=(n||0))}function $e(){$&&$.addEventListener("change",()=>{$.files&&(Array.from($.files).forEach(e=>{r.fotosParaSubir.push({file:e,url:URL.createObjectURL(e),variableAsociada:""})}),B())}),ne&&ne.addEventListener("click",()=>me()),ae&&ae.addEventListener("click",()=>{le.textContent="Agregar Nuevo Producto",N.reset(),C.value="",$.value="",r.fotosParaSubir=[],A.innerHTML="",q.innerHTML="",x.textContent="",h.classList.remove("hidden"),h.classList.add("flex")}),document.getElementById("btn-prod-prev")?.addEventListener("click",()=>{r.paginaProductos>0&&(r.paginaProductos--,S())}),document.getElementById("btn-prod-next")?.addEventListener("click",()=>{r.paginaProductos++,S()}),oe&&oe.addEventListener("click",()=>{h.classList.add("hidden"),h.classList.remove("flex")}),N&&N.addEventListener("submit",async e=>{if(e.preventDefault(),E.disabled=!0,E.textContent="Procesando...",x.textContent="",!O.value.trim()||!U.value){x.textContent="Título y Cantidad Mínima son obligatorios.",E.disabled=!1,E.textContent="Guardar Producto";return}try{let t=[];if(r.fotosParaSubir.length>0){x.textContent="Subiendo imágenes...",x.className="text-sm font-semibold text-center mt-4 h-4 text-blue-500";for(const s of r.fotosParaSubir)if(s.file){const m=s.file.name.split(".").pop(),u=`${Date.now()}-${Math.random().toString(36).substring(2)}.${m}`,{error:o}=await L.storage.from("productos").upload(u,s.file);if(o)throw console.error("Error subiendo:",s.file.name,o),new Error(`Error en imagen ${s.file.name}: ${o.message}`);const{data:{publicUrl:d}}=L.storage.from("productos").getPublicUrl(u);t.push({url:d,variableAsociada:s.variableAsociada})}else t.push({url:s.url,variableAsociada:s.variableAsociada})}x.textContent="Guardando datos...";const a={};document.querySelectorAll(".var-row").forEach(s=>{const m=s.querySelector(".var-key").value.trim(),u=s.querySelector(".var-values").value;if(m!==""&&u.trim()!==""){const o=u.split(",").map(d=>d.trim()).filter(d=>d!=="");o.length>0&&(a[m]=o)}});const c={titulo:O.value.trim(),descripcion:ue.value.trim(),cantidad_minima:parseInt(U.value),precio:parseFloat(pe.value)||0,variables:a,fotos:t};let n;if(C.value===""){const{error:s}=await L.from("productos").insert([c]);n=s}else{const{error:s}=await L.from("productos").update(c).eq("id",C.value);n=s}if(n)throw new Error(n.message);h.classList.add("hidden"),h.classList.remove("flex"),S()}catch(t){x.textContent="Error: "+t.message,x.className="text-sm font-semibold text-center mt-4 h-4 text-red-500"}finally{E.disabled=!1,E.textContent="Guardar Producto"}})}const Le=r.supabase;let k=0;function we(e){const t=document.getElementById("toast-nuevas-cotizaciones");t&&t.remove();const a=document.createElement("div");a.id="toast-nuevas-cotizaciones",a.className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-up cursor-pointer hover:bg-green-700 transition",a.innerHTML=`
    <span class="text-lg">🆕</span>
    <span><strong>${e}</strong> nueva${e>1?"s":""} cotización${e>1?"es":""} recibida${e>1?"s":""}</span>
    <button id="btn-cerrar-toast" class="ml-2 text-white/70 hover:text-white text-lg leading-none">&times;</button>
  `,a.addEventListener("click",c=>{if(c.target.id==="btn-cerrar-toast"){a.remove();return}document.getElementById("tab-pedidos")?.click(),a.remove()}),document.body.appendChild(a),setTimeout(()=>{document.getElementById("toast-nuevas-cotizaciones")&&a.remove()},1e4)}function Ie(e){let t=document.getElementById("badge-nuevas-cotizaciones");if(e===0){t&&t.remove();return}if(!t){const a=document.getElementById("tab-pedidos");if(!a)return;t=document.createElement("span"),t.id="badge-nuevas-cotizaciones",t.className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full",a.appendChild(t)}t.textContent=e}async function de(){const{count:e,error:t}=await Le.from("pedidos").select("*",{count:"exact",head:!0}).eq("estado","no confirmado");t||e===null||(k>0&&e>k&&we(e-k),k=e,Ie(e))}function Se(){de(),setInterval(de,3e4)}document.addEventListener("DOMContentLoaded",async()=>{const{data:{session:e}}=await P.auth.getSession();if(!e){window.location.href="/login";return}const{data:t}=await P.from("perfiles").select("rol").eq("id",e.user.id).single();if(!t||t.rol!=="admin"){window.location.href="/dashboard";return}he(),$e(),ye(),xe(),Se(),S(),document.getElementById("btn-logout")?.addEventListener("click",async()=>{await P.auth.signOut(),window.location.href="/login"});const c=document.getElementById("admin-sidebar"),n=document.getElementById("sidebar-overlay"),s=document.getElementById("btn-toggle-sidebar"),m=document.getElementById("btn-close-sidebar");function u(){c?.classList.remove("-translate-x-full"),n?.classList.remove("hidden")}function o(){c?.classList.add("-translate-x-full"),n?.classList.add("hidden")}s?.addEventListener("click",u),m?.addEventListener("click",o),n?.addEventListener("click",o),document.querySelectorAll("#tab-pedidos, #tab-usuarios, #tab-productos").forEach(d=>{d.addEventListener("click",()=>{window.innerWidth<1024&&o()})})});
