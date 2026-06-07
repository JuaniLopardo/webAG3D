import { adminState } from './state.js';

const supabase = adminState.supabase;

const modal = document.getElementById('modal-producto');
const modalTitulo = document.getElementById('modal-producto-titulo');
const formProducto = document.getElementById('form-producto');
const mensajeModal = document.getElementById('modal-prod-mensaje');
const btnGuardar = document.getElementById('btn-guardar-producto');

const inputId = document.getElementById('prod-id');
const inputTitulo = document.getElementById('prod-titulo');
const inputDesc = document.getElementById('prod-desc');
const inputMin = document.getElementById('prod-min');
const inputPrecio = document.getElementById('prod-precio');
const inputFotos = document.getElementById('prod-fotos');
const previewContainer = document.getElementById('preview-fotos-container');
const variablesContainer = document.getElementById('variables-container');
const productosContainer = document.getElementById('admin-productos-container');

const btnNuevo = document.getElementById('btn-nuevo-producto');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnAddVar = document.getElementById('btn-add-var');

const visorModal = document.getElementById('modal-visor');
const visorImg = document.getElementById('img-visor');
const visorTxt = document.getElementById('txt-visor');

export function abrirVisor(url, titulo) {
  if (visorImg && visorTxt && visorModal) {
    visorImg.src = url;
    visorTxt.textContent = titulo;
    visorModal.classList.replace('hidden', 'flex');
  }
}

export function renderizarPreviews() {
  if (!previewContainer) return;
  previewContainer.innerHTML = '';
  
  const allOptions = [];
  document.querySelectorAll('.var-row').forEach(row => {
    const valuesStr = row.querySelector('.var-values').value;
    const vals = valuesStr.split(',').map(s => s.trim()).filter(s => s !== '');
    allOptions.push(...vals);
  });
  
  adminState.fotosParaSubir.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'relative group border border-gray-200 rounded-lg p-1 bg-white';
    
    let options = `<option value="">General (Sin variable)</option>`;
    allOptions.forEach(opt => {
      options += `<option value="${opt}" ${item.variableAsociada === opt ? 'selected' : ''}>${opt}</option>`;
    });

    div.innerHTML = `
      <img src="${item.url}" class="w-full h-24 object-cover rounded" />
      <select data-index="${index}" class="select-var-foto mt-1 w-full text-[10px] p-1 border rounded">
        ${options}
      </select>
      <button type="button" data-index="${index}" class="btn-remove-foto absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg">×</button>
    `;
    
    div.querySelector('.select-var-foto')?.addEventListener('change', (e) => {
      const target = e.target;
      adminState.fotosParaSubir[parseInt(target.dataset.index)].variableAsociada = target.value;
    });

    div.querySelector('.btn-remove-foto')?.addEventListener('click', (e) => {
      const target = e.currentTarget;
      adminState.fotosParaSubir.splice(parseInt(target.dataset.index), 1);
      renderizarPreviews();
    });

    previewContainer.appendChild(div);
  });
}

export function crearFilaDeVariable(clave = '', valores = []) {
  if (!variablesContainer) return;
  const row = document.createElement('div');
  row.className = 'flex gap-2 items-start var-row bg-gray-50 p-2 rounded border border-gray-200';
  row.innerHTML = `
    <input type="text" class="var-key w-1/3 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm font-medium" placeholder="Ej. Talles" value="${clave}" />
    <input type="text" class="var-values flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ej. S, M, L, XL" value="${valores.join(', ')}" />
    <button type="button" class="btn-del-var text-gray-400 hover:text-red-500 p-1.5 transition" title="Eliminar variable">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;
  row.querySelector('.btn-del-var')?.addEventListener('click', () => row.remove());
  row.querySelector('.var-key')?.addEventListener('input', () => renderizarPreviews());
  row.querySelector('.var-values')?.addEventListener('input', () => renderizarPreviews());
  variablesContainer.appendChild(row);
}

export async function cargarProductos() {
  const from = adminState.paginaProductos * adminState.pageSize;
  const to = from + adminState.pageSize - 1;

  const { data: productos, error, count } = await supabase
    .from('productos')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .range(from, to);

  if (error) return;
  adminState.productos = productos || [];

  if (!productosContainer) return;
  
  if (adminState.productos.length > 0) {
    productosContainer.innerHTML = adminState.productos.map(prod => {
      const fotosArray = Array.isArray(prod.fotos) ? prod.fotos : (prod.fotos ? [prod.fotos] : []);
      
      const getUrlSafe = (f) => {
        if (!f) return null;
        if (typeof f === 'string') {
          if (f.startsWith('{')) {
            try { return JSON.parse(f).url; } catch { return null; }
          }
          return f;
        }
        return f.url;
      };

      const variables = prod.variables || {};
      let textoVariables = '';

      const fotosGenerales = fotosArray.filter((f) => {
        if (typeof f === 'string') return true;
        return !f.variableAsociada || f.variableAsociada === '';
      });

      if (fotosGenerales.length > 0) {
        textoVariables += `
          <button class="btn-ver-var px-2 py-1 rounded text-[10px] capitalize transition mb-1 mr-1 bg-primary text-white hover:bg-primary-hover font-bold shadow-sm" 
            data-prod-id="${prod.id}" 
            data-var-key="general">
            Principal
          </button>`;
      }

      Object.entries(variables).forEach(([key, values]) => {
        const vals = Array.isArray(values) ? values : [];
        vals.forEach(v => {
          const tieneFoto = fotosArray.some((f) => 
            typeof f === 'object' && f.variableAsociada === v
          );
          textoVariables += `
            <button class="btn-ver-var px-2 py-1 rounded text-[10px] capitalize transition mb-1 mr-1 ${tieneFoto ? 'bg-primary text-white hover:bg-primary-hover font-bold shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}" 
              data-prod-id="${prod.id}" 
              data-var-key="${v}" 
              ${!tieneFoto ? 'disabled' : ''}>
              ${v}
            </button>`;
        });
      });

      if (!textoVariables) textoVariables = '<span class="text-gray-400 text-xs italic">Ninguna</span>';
      
      const miniaturaUrl = getUrlSafe(fotosArray[0]);
      const miniatura = miniaturaUrl 
        ? `<img src="${miniaturaUrl}" class="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />` 
        : `<div class="w-12 h-12 bg-gray-200 rounded-md border border-gray-300 flex items-center justify-center text-xs text-gray-400">Sin img</div>`;

      return `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100">
          <td class="p-4">${miniatura}</td>
          <td class="p-4">
            <p class="font-bold text-gray-900">${prod.titulo}</p>
            <p class="text-xs text-gray-500 font-mono">ID: #${prod.id}</p>
          </td>
          <td class="p-4 flex gap-1 flex-wrap">${textoVariables}</td>
          <td class="p-4 text-right space-x-2">
            <button class="text-primary hover:text-primary-hover font-semibold text-sm btn-editar" data-id="${prod.id}">Editar</button>
            <button class="text-red-600 hover:text-red-800 font-semibold text-sm btn-eliminar" data-id="${prod.id}">Borrar</button>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');
        if (confirm(`¿Estás seguro de borrar este producto?`)) {
          target.textContent = 'Borrando...';
          await supabase.from('productos').delete().eq('id', id);
          cargarProductos();
        }
      });
    });

    document.querySelectorAll('.btn-ver-var').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const prodId = target.dataset.prodId;
        const varKey = target.dataset.varKey;
        const prod = adminState.productos.find(p => p.id.toString() === prodId);
        const getUrlSafe = (f) => (typeof f === 'string' && f.startsWith('{')) ? JSON.parse(f).url : (f.url || f);
        
        if (prod && prod.fotos) {
          const foto = prod.fotos.find((f) => {
            const data = typeof f === 'string' && f.startsWith('{') ? JSON.parse(f) : f;
            if (varKey === 'general') {
              return typeof data === 'string' || !data.variableAsociada;
            }
            return typeof data === 'object' && data.variableAsociada === varKey;
          });

          if (foto) {
            const urlFinal = getUrlSafe(foto);
            abrirVisor(urlFinal, `${prod.titulo} - ${varKey === 'general' ? 'Principal' : varKey}`);
          }
        }
      });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');
        const productoAEditar = adminState.productos.find(p => p.id.toString() === id);
        
        if (productoAEditar) {
          modalTitulo.textContent = 'Editar Producto';
          inputId.value = productoAEditar.id;
          inputTitulo.value = productoAEditar.titulo;
          inputDesc.value = productoAEditar.descripcion || '';
          inputMin.value = productoAEditar.cantidad_minima;
          inputPrecio.value = productoAEditar.precio || '';
          inputFotos.value = '';
          
          const fotosEdit = Array.isArray(productoAEditar.fotos) ? productoAEditar.fotos : (productoAEditar.fotos ? [productoAEditar.fotos] : []);

          adminState.fotosParaSubir = fotosEdit.map((f) => {
            const data = (typeof f === 'string' && f.startsWith('{')) ? JSON.parse(f) : f;
            return typeof data === 'string' 
              ? { url: data, variableAsociada: '' } 
              : { url: data.url, variableAsociada: data.variableAsociada || '' };
          });
          renderizarPreviews();
          
          variablesContainer.innerHTML = '';
          if (productoAEditar.variables) {
            Object.entries(productoAEditar.variables).forEach(([clave, valores]) => {
              crearFilaDeVariable(clave, valores);
            });
          }
          
          mensajeModal.textContent = '';
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
      });
    });
  } else {
    productosContainer.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-gray-500 italic">No hay productos.</td></tr>`;
  }

  // Actualizar info de paginación en la UI
  const infoPag = document.getElementById('info-pag-productos');
  if (infoPag && count !== null) {
    const totalPaginas = Math.ceil(count / adminState.pageSize);
    infoPag.textContent = `Página ${adminState.paginaProductos + 1} de ${totalPaginas || 1}`;
  }
  
  const btnPrev = document.getElementById('btn-prod-prev');
  const btnNext = document.getElementById('btn-prod-next');
  if (btnPrev) btnPrev.disabled = adminState.paginaProductos === 0;
  if (btnNext) btnNext.disabled = (adminState.paginaProductos + 1) * adminState.pageSize >= (count || 0);
}

export function initProductos() {
  if (inputFotos) {
    inputFotos.addEventListener('change', () => {
      if (!inputFotos.files) return;
      Array.from(inputFotos.files).forEach(file => {
        adminState.fotosParaSubir.push({ file, url: URL.createObjectURL(file), variableAsociada: '' });
      });
      renderizarPreviews();
    });
  }

  if (btnAddVar) {
    btnAddVar.addEventListener('click', () => crearFilaDeVariable());
  }

  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
      modalTitulo.textContent = 'Agregar Nuevo Producto';
      formProducto.reset();
      inputId.value = ''; 
      inputFotos.value = '';
      adminState.fotosParaSubir = [];
      previewContainer.innerHTML = '';
      variablesContainer.innerHTML = '';
      mensajeModal.textContent = '';
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  }

  // Listeners para paginación
  document.getElementById('btn-prod-prev')?.addEventListener('click', () => {
    if (adminState.paginaProductos > 0) {
      adminState.paginaProductos--;
      cargarProductos();
    }
  });
  document.getElementById('btn-prod-next')?.addEventListener('click', () => {
    adminState.paginaProductos++;
    cargarProductos();
  });

  if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  if (formProducto) {
    formProducto.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      btnGuardar.disabled = true;
      btnGuardar.textContent = 'Procesando...';
      mensajeModal.textContent = '';

      // Validación básica de seguridad/calidad
      if (!inputTitulo.value.trim() || !inputMin.value) {
        mensajeModal.textContent = 'Título y Cantidad Mínima son obligatorios.';
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Producto';
        return;
      }

      try {
        let fotosFinales = [];
        
        if (adminState.fotosParaSubir.length > 0) {
          mensajeModal.textContent = 'Subiendo imágenes...';
          mensajeModal.className = 'text-sm font-semibold text-center mt-4 h-4 text-blue-500';
          
          for (const item of adminState.fotosParaSubir) {
            if (item.file) {
              const extension = item.file.name.split('.').pop();
              const nombreUnico = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
              
              const { error: errorSubida } = await supabase.storage.from('productos').upload(nombreUnico, item.file);
              if (errorSubida) {
                console.error('Error subiendo:', item.file.name, errorSubida);
                throw new Error(`Error en imagen ${item.file.name}: ${errorSubida.message}`);
              }
              
              const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(nombreUnico);
              fotosFinales.push({ 
                url: publicUrl, 
                variableAsociada: item.variableAsociada 
              });
            } else {
              fotosFinales.push({ 
                url: item.url, 
                variableAsociada: item.variableAsociada 
              });
            }
          }
        }
        
        mensajeModal.textContent = 'Guardando datos...';

        const objetoVariables = {};
        document.querySelectorAll('.var-row').forEach(row => {
          const clave = row.querySelector('.var-key').value.trim();
          const textoValores = row.querySelector('.var-values').value;
          if (clave !== '' && textoValores.trim() !== '') {
            const arrayValores = textoValores.split(',').map(s => s.trim()).filter(s => s !== '');
            if (arrayValores.length > 0) objetoVariables[clave] = arrayValores;
          }
        });

        const datosDelProducto = {
          titulo: inputTitulo.value.trim(),
          descripcion: inputDesc.value.trim(),
          cantidad_minima: parseInt(inputMin.value),
          precio: parseFloat(inputPrecio.value) || 0,
          variables: objetoVariables,
          fotos: fotosFinales
        };

        let errorDeSupabase;
        if (inputId.value === '') {
          const { error } = await supabase.from('productos').insert([datosDelProducto]);
          errorDeSupabase = error;
        } else {
          const { error } = await supabase.from('productos').update(datosDelProducto).eq('id', inputId.value);
          errorDeSupabase = error;
        }

        if (errorDeSupabase) throw new Error(errorDeSupabase.message);

        modal.classList.add('hidden');
        modal.classList.remove('flex');
        cargarProductos();

      } catch (error) {
        mensajeModal.textContent = 'Error: ' + error.message;
        mensajeModal.className = 'text-sm font-semibold text-center mt-4 h-4 text-red-500';
      } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar Producto';
      }
    });
  }
}
