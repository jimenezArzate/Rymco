const tablaPesos = [
    // 1. VERDE
    { producto: '3/4" verde', valor: 1.672 },
    { producto: '1/2" verde', valor: 1.262 },
    { producto: '1" Verde', valor: 3.2 },
    { producto: '1 1/4" verde', valor: 4.135 },
    { producto: '1 1/2" verde', valor: 4.91 },
    { producto: '2" verde', valor: 6.24 },
    { producto: '3 1/2" Verde', valor: 15.84 },
    { producto: '4" Verde', valor: 17.83 },
    { producto: '3" verde', valor: 11.93 },

    // 2. AMARILLA
    { producto: '3" Amarilla', valor: 19.267 },
    { producto: '3/4" Amarilla', valor: 2.721 },
    { producto: '1/2" Amarilla', valor: 2.154 },
    { producto: '2" Amarilla', valor: 9.379 },
    { producto: '4" Amarilla', valor: 24.992 },
    { producto: '1" Amarilla', valor: 4.143 },
    { producto: '1 1/4" Amarilla', valor: 5.254 },
    { producto: '1½" Amarilla', valor: 6.2 },

    // 3. AZUL
    { producto: '1½" azul', valor: 0.9 },

    // 4. PESADOS (PVC Pesado)
    { producto: '1/2 PVC Pesado', valor: 0.49 },
    { producto: '3/4" PVC Pesado', valor: 0.61 },
    { producto: '1" PVC Pesado', valor: 0.78 },
    { producto: '2" PVC Pesado', valor: 2.1 },
    { producto: '2 1/2" PVC Pesado', valor: 3.1 },
    { producto: '3" PVC Pesado', valor: 2.15 },
    { producto: '4" PVC Pesado', valor: 5.3 },
    { producto: '1 1/4" PVC Pesado', valor: 1.05 },
    { producto: '1 1/2" PVC Pesado', valor: 1.45 },

    // 5. LIGEROS (PVC Ligero)
    { producto: '1" PVC LIGERO', valor: 0.49 },
    { producto: 'PVC LIGERO 1/2"', valor: 0.24 },
    { producto: '3/4" PVC LIGERO', valor: 0.24 },
    { producto: '1 1/2" PVC LIGERO', valor: 0.32 },
    { producto: '1 1/4" PVC LIGERO', valor: 0.74 },

    // 6. RÍGIDOS (rig a...)
    { producto: '2" rig a 3.05', valor: 15.876 },
    { producto: '1" rig a 3.05', valor: 7.303 },
    { producto: '3/4" rig a 3.05', valor: 4.94 },
    { producto: '1 1/2" rig a 3.05', valor: 11.93 },
    { producto: '2" rig a 3.20', valor: 17.34 },
    { producto: '3" rig a 3.20', valor: 36.19 },
    { producto: '4" rig a 3.20', valor: 5.39 },
    { producto: '4" rig a 3.05', valor: 46.72 },
    { producto: '1 1/2" rig a 3.20', valor: 13 },
    { producto: '1" rig a 3.20', valor: 7.85 },
    { producto: '1 1/4" rig a 3.20', valor: 10.98 },
    { producto: '3/4" rig a 3.20', valor: 5.39 },
    { producto: '3" rig a 3.05', valor: 32.98 },

    // 7. TODO LO DEMÁS
    { producto: '1" IMC', valor: 5.47 },
    { producto: '3/4" IMC', valor: 2.5 },
    { producto: '4" IMC', valor: 31.752 },
    { producto: '2 1/2" IMC', valor: 20.004 },
    { producto: '1/2 IMC', valor: 2.85 },
    { producto: '2" imc', valor: 11.6 },
    { producto: '1/2" EMT', valor: 1.36 },
    { producto: '1" EMT', valor: 3.06 },
    { producto: '1 1/4" EMT', valor: 4.55 },
    { producto: '1 1/2" EMT', valor: 5.283 },
    { producto: '2" EMT', valor: 6.71 },
    { producto: '2 1/2" EMT', valor: 9.8 },
    { producto: '3 1/2" EMT', valor: 15.84 },
    { producto: '3/4" EMT', valor: 2.09 },
    { producto: '3" EMT', valor: 11.93 },
    { producto: '4" EMT', valor: 17.83 },
    { producto: '1/2" varilla roscada', valor: 2.389 },
    { producto: '1/4" varilla roscada', valor: 0.5442 },
    { producto: '3/4" PVC GRIS', valor: 0.61 },
    { producto: '1" PVC GRIS TA', valor: 5.3 },
    { producto: '3/4" PVC GRIS TA', valor: 0.78 },
    { producto: '1/2" PVC GRIS TA', valor: 0.61 },
    { producto: '1 1/4" PVC GRIS TA', valor: 0.49 },
    { producto: '1 1/2" PVC GRIS TA', valor: 1.032 },
    { producto: '3/4" PVC C40', valor: 0.998 },
    { producto: '1 1/4" especial', valor: 3.496 },
    { producto: 'TA53 1/2" (CED-40) Galvanizado Ros', valor: 8.1024 },
    { producto: 'TA53 1" (CED-40) Negro Liso', valor: 15.9872 },
    { producto: 'TA53 4" (CED-40) Negro Liso', valor: 102.62 },
    { producto: 'TA53 4" (CED-40) Rojo Ranurado', valor: 102.62 },
    { producto: '1 1/4" ESP. A 2 MTS', valor: 0.61 },
    { producto: '1 1/4" ESP. A 3 MTS', valor: 2.331 },
    { producto: '1 1/4" ESP. A 4 MTS', valor: 4.637 },
    { producto: 'Unicanal sólido 4x4 c.14', valor: 3.059 },
    { producto: 'Unicanal sólido 4x2 c.14', valor: 5.6 },
    { producto: 'Unicanal perforado 4x4 c.16', valor: 4.88 },
    { producto: 'Unicanal perforado 4x2 c.16', valor: 3.059 },
    { producto: 'Unicanal solido 4x2 c.16', valor: 3.059 }
];

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bitacora-form');
    const inputFecha = document.getElementById('fecha');
    const selectTurno = document.getElementById('turno');
    const selectProceso = document.getElementById('proceso');
    const inputProducto = document.getElementById('producto');
    const inputPiezas = document.getElementById('piezas');
    const inputTrabajador = document.getElementById('trabajador');
    const btnAgregarTrabajador = document.getElementById('btn-agregar-trabajador');
    const trabajadoresContainer = document.getElementById('trabajadores-lista-container');
    const trabajadoresTbody = document.getElementById('trabajadores-tbody');
    const btnFinalizarTurno = document.getElementById('btn-finalizar-turno');

    let trabajadoresActivos = {}; // Key: "Turno|Proceso", Value: Array of worker names/IDs
    let registrosTemporalesOperador = [];
    let editandoRegistroId = null;

    if(inputFecha) {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        inputFecha.valueAsDate = ayer;
    }

    if(btnAgregarTrabajador) {
        btnAgregarTrabajador.addEventListener('click', () => {
            agregarTrabajadorActivo();
        });
    }

    if (inputTrabajador) {
        inputTrabajador.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                agregarTrabajadorActivo();
            }
        });
    }

    function agregarTrabajadorActivo() {
        const turno = selectTurno.value;
        const proceso = selectProceso.value;
        if (!turno) {
            alert("Debe seleccionar primero su turno.");
            selectTurno.focus();
            return;
        }
        if (!proceso) {
            alert("Debe seleccionar primero su proceso.");
            selectProceso.focus();
            return;
        }

        const trabVal = inputTrabajador.value.trim();
        if (!trabVal) {
            alert("Por favor ingrese el número del trabajador.");
            inputTrabajador.focus();
            return;
        }
        if (!/^\d+$/.test(trabVal)) {
            alert('El número del trabajador debe contener solo dígitos.');
            inputTrabajador.focus();
            return;
        }
        if (trabVal.length > 5) {
            alert('El número del trabajador no puede tener más de 5 dígitos.');
            inputTrabajador.focus();
            return;
        }

        const key = `${turno}|${proceso}`;
        if (!trabajadoresActivos[key]) {
            trabajadoresActivos[key] = [];
        }

        if (trabajadoresActivos[key].includes(trabVal)) {
            alert("Este trabajador ya está asignado a este turno y proceso.");
            return;
        }

        trabajadoresActivos[key].push(trabVal);
        inputTrabajador.value = '';
        actualizarHistorialPantallaOperador();
    }

    window.eliminarTrabajadorActivo = (turno, proceso, nombre) => {
        const key = `${turno}|${proceso}`;
        if (trabajadoresActivos[key]) {
            trabajadoresActivos[key] = trabajadoresActivos[key].filter(w => w !== nombre);
            if (trabajadoresActivos[key].length === 0) {
                delete trabajadoresActivos[key];
            }
            actualizarHistorialPantallaOperador();
        }
    };

    if (inputProducto) {
        inputProducto.addEventListener("input", function() {
            const val = this.value.toLowerCase();
            let listCont = document.getElementById("autocomplete-list");
            listCont.innerHTML = "";
            if (!val) return;

            const filtrados = tablaPesos.filter(p => 
                p.producto.toLowerCase().includes(val)
            );

            filtrados.forEach(p => {
                const div = document.createElement("DIV");
                div.innerHTML = `<b>${p.producto}</b>`;
                div.addEventListener("click", () => {
                    inputProducto.value = p.producto;
                    inputProducto.dataset.peso = p.valor;
                    listCont.innerHTML = "";
                });
                listCont.appendChild(div);
            });
        });
    }

    // --- REGISTRO DE PRODUCTOS ---
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Haber seleccionado su turno
            if (!selectTurno.value) {
                alert('Debe seleccionar primero su turno.');
                selectTurno.focus();
                return;
            }

            // 2. Haber seleccionado su proceso
            if (!selectProceso.value) {
                alert('Debe seleccionar primero su proceso.');
                selectProceso.focus();
                return;
            }

            // Validaciones de producto y piezas
            if (!inputProducto.value.trim()) {
                alert('Por favor seleccione un producto.');
                inputProducto.focus();
                return;
            }
            if (!inputPiezas.value || parseInt(inputPiezas.value) <= 0) {
                alert('Por favor ingrese un número de piezas válido.');
                inputPiezas.focus();
                return;
            }

            const pesoUnidad = parseFloat(inputProducto.dataset.peso || 1.2);
            const pzas = parseInt(inputPiezas.value);
            const calcKilos = Math.round(pesoUnidad * pzas);

            const nuevoRegistro = {
                id: Date.now() + Math.random().toString(36).substr(2, 4),
                fecha: inputFecha.value,
                turno: selectTurno.value,
                proceso: selectProceso.value,
                producto: inputProducto.value,
                especificacion: document.getElementById('especificacion') ? document.getElementById('especificacion').value : "",
                piezas: pzas,
                kilos: calcKilos
            };

            registrosTemporalesOperador.push(nuevoRegistro);
            actualizarHistorialPantallaOperador();

            // Limpiar solo producto y piezas (mantener turno y proceso)
            inputProducto.value = '';
            inputPiezas.value = '';
            if (document.getElementById('especificacion')) {
                document.getElementById('especificacion').value = '';
            }
            delete inputProducto.dataset.peso;
            inputProducto.focus();
        });
    }

    // --- RENDERIZADO DEL HISTORIAL Y EDICIÓN EN CALIENTE ---
    function actualizarHistorialPantallaOperador() {
        const container = document.getElementById('history-container-operador');
        if(!container) return;

        // Obtener combinaciones únicas de Turno|Proceso
        const combinaciones = new Set();
        registrosTemporalesOperador.forEach(r => {
            combinaciones.add(`${r.turno}|${r.proceso}`);
        });
        Object.keys(trabajadoresActivos).forEach(key => {
            if (trabajadoresActivos[key] && trabajadoresActivos[key].length > 0) {
                combinaciones.add(key);
            }
        });

        if(combinaciones.size === 0) {
            container.innerHTML = `<p class="empty-state">No hay registros capturados en este turno todavía.</p>`;
            return;
        }

        container.innerHTML = "";
        const listaTurnos = ["Mañana", "Tarde", "Noche"];
        const emojisTurno = { "Mañana": "🌅", "Tarde": "☀️", "Noche": "🌙" };
        const clasesTurno = { "Mañana": "mañana", "Tarde": "tarde", "Noche": "noche" };

        listaTurnos.forEach(t => {
            const combinacionesTurno = Array.from(combinaciones).filter(c => c.startsWith(t + "|"));
            if(combinacionesTurno.length === 0) return;

            const divTurno = document.createElement('div');
            divTurno.className = 'turno-card-block';
            divTurno.innerHTML = `<div class="turno-header-title ${clasesTurno[t]}">${emojisTurno[t]} Turno ${t}</div>`;

            combinacionesTurno.forEach(comb => {
                const parts = comb.split('|');
                const proc = parts[1];
                const key = comb;

                const divProceso = document.createElement('div');
                divProceso.className = 'proceso-sub-group';

                const listWorkers = trabajadoresActivos[key] || [];
                let workersHtml = '';
                if (listWorkers.length > 0) {
                    workersHtml = `<div class="trabajadores-badge-list">
                        <span style="font-weight: 600; color: #4b5563; margin-right: 5px;">👷 Trabajadores:</span>`;
                    listWorkers.forEach(w => {
                        workersHtml += `<span class="badge">${w} <span class="remove-worker" onclick="eliminarTrabajadorActivo('${t}', '${proc}', '${w}')">✕</span></span>`;
                    });
                    workersHtml += `</div>`;
                } else {
                    workersHtml = `<div class="trabajadores-badge-list" style="border-color: #fca5a5; background: #fef2f2;">
                        <span style="font-weight: 600; color: #dc2626;">⚠️ Sin trabajadores asignados en este proceso. Agrega al menos uno desde el panel superior.</span>
                    </div>`;
                }

                let subTablaHtml = `<div class="proceso-label-title">🛠️ ${proc}</div>
                    ${workersHtml}
                    <table class="corporate-table">
                        <thead><tr><th>#</th><th>Producto</th><th>Piezas</th><th>Kilos</th><th>Acción</th></tr></thead><tbody>`;

                const registrosDelProceso = registrosTemporalesOperador.filter(r => r.turno === t && r.proceso === proc);

                if (registrosDelProceso.length === 0) {
                    subTablaHtml += `<tr><td colspan="5" style="text-align:center;color:#64748b;font-style:italic;">No hay productos registrados aún en este turno y proceso.</td></tr>`;
                } else {
                    registrosDelProceso.forEach((r, i) => {
                        if (editandoRegistroId === r.id) {
                            let optionsHtml = '';
                            tablaPesos.forEach(p => {
                                const selected = p.producto === r.producto ? 'selected' : '';
                                optionsHtml += `<option value="${p.producto}" ${selected}>${p.producto}</option>`;
                            });

                            subTablaHtml += `<tr style="background-color: #fff7ed;">
                                <td>${i+1}</td>
                                <td>
                                    <div style="display:flex; flex-direction:column; gap:4px;">
                                        <label style="font-size:0.7rem; color:#64748b; font-weight:600;">Producto:</label>
                                        <select id="edit-prod-${r.id}" class="edit-select" style="max-width: 250px;">
                                            ${optionsHtml}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <div style="display:flex; flex-direction:column; gap:4px;">
                                        <label style="font-size:0.7rem; color:#64748b; font-weight:600;">Piezas:</label>
                                        <input type="number" id="edit-piezas-${r.id}" class="edit-input" style="width: 80px;" value="${r.piezas}" min="1">
                                    </div>
                                </td>
                                <td colspan="2">
                                    <div style="display:flex; flex-direction:row; gap:8px; align-items:center;">
                                        <div style="display:flex; flex-direction:column; gap:4px;">
                                            <label style="font-size:0.7rem; color:#64748b; font-weight:600;">Turno:</label>
                                            <select id="edit-turno-${r.id}" class="edit-select">
                                                <option value="Mañana" ${r.turno === 'Mañana' ? 'selected' : ''}>Mañana</option>
                                                <option value="Tarde" ${r.turno === 'Tarde' ? 'selected' : ''}>Tarde</option>
                                                <option value="Noche" ${r.turno === 'Noche' ? 'selected' : ''}>Noche</option>
                                            </select>
                                        </div>
                                        <div style="display:flex; flex-direction:column; gap:4px;">
                                            <label style="font-size:0.7rem; color:#64748b; font-weight:600;">Proceso:</label>
                                            <select id="edit-proceso-${r.id}" class="edit-select" style="max-width: 250px;">
                                                <option value="Selección, Limpieza, Flejado y Empaque" ${r.proceso === 'Selección, Limpieza, Flejado y Empaque' ? 'selected' : ''}>Selección, Limpieza, Flejado y Empaque</option>
                                                <option value="Preparación y/o Acondicionamiento de venta" ${r.proceso === 'Preparación y/o Acondicionamiento de venta' ? 'selected' : ''}>Preparación y/o Acondicionamiento de venta</option>
                                                <option value="Conformado, Rimado y Pintura" ${r.proceso === 'Conformado, Rimado y Pintura' ? 'selected' : ''}>Conformado, Rimado y Pintura</option>
                                                <option value="Selección de tubo para re-galvanizar" ${r.proceso === 'Selección de tubo para re-galvanizar' ? 'selected' : ''}>Selección de tubo para re-galvanizar</option>
                                            </select>
                                        </div>
                                        <div style="margin-top:16px;">
                                            <button class="btn-save-inline" onclick="guardarEdicionRegistro('${r.id}')">✓ Guardar</button>
                                            <button class="btn-cancel-inline" onclick="cancelarEdicionRegistro()">✕</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
                        } else {
                            subTablaHtml += `<tr>
                                <td>${i+1}</td>
                                <td><b>${r.producto}</b></td>
                                <td>${r.piezas}</td>
                                <td>${r.kilos} kg</td>
                                <td>
                                    <span style="color:#0284c7;cursor:pointer;margin-right:15px;font-weight:600;" onclick="comenzarEdicionRegistro('${r.id}')">✏️ Editar</span>
                                    <span style="color:#ef4444;cursor:pointer;font-weight:600;" onclick="eliminarRegistroTemporal('${r.id}')">✕ Eliminar</span>
                                </td>
                            </tr>`;
                        }
                    });
                }
                subTablaHtml += `</tbody></table>`;
                divProceso.innerHTML = subTablaHtml;
                divTurno.appendChild(divProceso);
            });
            container.appendChild(divTurno);
        });
    }

    window.comenzarEdicionRegistro = (id) => {
        editandoRegistroId = id;
        actualizarHistorialPantallaOperador();
    };

    window.cancelarEdicionRegistro = () => {
        editandoRegistroId = null;
        actualizarHistorialPantallaOperador();
    };

    window.guardarEdicionRegistro = (id) => {
        const prodVal = document.getElementById(`edit-prod-${id}`).value;
        const piezasVal = parseInt(document.getElementById(`edit-piezas-${id}`).value);
        const turnoVal = document.getElementById(`edit-turno-${id}`).value;
        const procesoVal = document.getElementById(`edit-proceso-${id}`).value;

        if (!prodVal) return alert("Seleccione un producto.");
        if (isNaN(piezasVal) || piezasVal <= 0) return alert("Ingrese un número de piezas válido.");

        const rIndex = registrosTemporalesOperador.findIndex(r => r.id === id);
        if (rIndex !== -1) {
            const prodObj = tablaPesos.find(p => p.producto === prodVal);
            const peso = prodObj ? prodObj.valor : 1.2;
            
            registrosTemporalesOperador[rIndex].producto = prodVal;
            registrosTemporalesOperador[rIndex].piezas = piezasVal;
            registrosTemporalesOperador[rIndex].turno = turnoVal;
            registrosTemporalesOperador[rIndex].proceso = procesoVal;
            registrosTemporalesOperador[rIndex].kilos = Math.round(peso * piezasVal);
        }

        editandoRegistroId = null;
        actualizarHistorialPantallaOperador();
    };

    window.eliminarRegistroTemporal = (id) => {
        registrosTemporalesOperador = registrosTemporalesOperador.filter(r => r.id !== id);
        actualizarHistorialPantallaOperador();
    };

    // --- ENVIAR DATOS A LA NUBE ---
    if(btnFinalizarTurno) {
        btnFinalizarTurno.addEventListener('click', async () => {
            if(registrosTemporalesOperador.length === 0) return alert("No hay datos para enviar.");
            if(confirm("¿Enviar todos los registros a la base de datos empresarial (Nube)?")) {
                
                const originalText = btnFinalizarTurno.innerHTML;
                btnFinalizarTurno.innerHTML = '⏳ Subiendo a la Nube...';
                btnFinalizarTurno.disabled = true;
                btnFinalizarTurno.style.opacity = '0.7';

                try {
                    const registrosFinales = registrosTemporalesOperador.map(registro => {
                        const key = `${registro.turno}|${registro.proceso}`;
                        const workersList = trabajadoresActivos[key] || [];
                        return {
                            ...registro,
                            trabajadores: workersList.length > 0 ? workersList.join(', ') : 'N/A'
                        };
                    });

                    const promesasGuardado = registrosFinales.map(registro => {
                        return db.collection("registros_produccion").add({
                            ...registro,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    });

                    const timeout = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('TIMEOUT_FIREBASE')), 8000)
                    );

                    await Promise.race([Promise.all(promesasGuardado), timeout]);
                    
                    let dbAdminLocal = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
                    dbAdminLocal = [...dbAdminLocal, ...registrosFinales];
                    localStorage.setItem('rymco_db_admin', JSON.stringify(dbAdminLocal));
                    
                    registrosTemporalesOperador = [];
                    trabajadoresActivos = {};
                    actualizarHistorialPantallaOperador();
                    
                    alert("✅ Datos transmitidos y guardados con éxito en la Nube (Firebase).");
                } catch(error) {
                    console.error("Error guardando en Firestore: ", error);
                    if (error.message === 'TIMEOUT_FIREBASE') {
                        alert("❌ La conexión con la Nube tardó demasiado. Verifica tu conexión a internet o asegúrate de haber creado la base de datos Firestore en tu proyecto.");
                    } else {
                        alert("❌ Error al comunicarse con el servidor en la nube. Revisa los permisos de tu base de datos o asegúrate de no tener un bloqueador de anuncios activo.");
                    }
                } finally {
                    btnFinalizarTurno.innerHTML = originalText;
                    btnFinalizarTurno.disabled = false;
                    btnFinalizarTurno.style.opacity = '1';
                }
            }
        });
    }
});
