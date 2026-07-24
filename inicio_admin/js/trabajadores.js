// js/trabajadores.js
// ══════════════════════════════════════════════════════════
//  GESTIÓN, RENDIMIENTO Y ASISTENCIA DE TRABAJADORES
// ══════════════════════════════════════════════════════════

// ── ROTACIÓN SEMANAL DE TURNOS ────────────────────────────────────
// Ciclo: Mañana → Tarde → Noche → Mañana ...
// La semana de referencia (semana 0) es el lunes 2026-01-05.

const TURNO_ORDEN = ['Mañana', 'Tarde', 'Noche'];
const TURNO_REFERENCIA_FECHA = new Date('2026-01-05T00:00:00'); // Lunes, semana 0

/**
 * Devuelve el turno correspondiente a un trabajador en la semana que contiene `fecha`.
 * @param {string} turnoBase - turno asignado al inicio ('Mañana', 'Tarde' o 'Noche')
 * @param {Date|string} [fecha] - fecha a calcular; por defecto la fecha actual
 * @returns {string} el turno rotado para esa semana
 */
function calcularTurnoSemana(turnoBase, fecha) {
    const baseIdx = TURNO_ORDEN.indexOf(turnoBase);
    if (baseIdx === -1) return turnoBase; // turno desconocido: devolver sin cambio

    const d = fecha ? new Date(fecha) : new Date();
    // Normalizar a inicio del lunes de esa semana
    const diaSemana = d.getDay(); // 0=Dom, 1=Lun ... 6=Sab
    const diasDesdeRef = Math.floor((d - TURNO_REFERENCIA_FECHA) / 86400000);
    const semanasTranscurridas = Math.floor((diasDesdeRef + 1) / 7); // +1 para que el lunes sea día 1 de su semana

    const turnoIdx = ((baseIdx + semanasTranscurridas) % 3 + 3) % 3;
    return TURNO_ORDEN[turnoIdx];
}

/** Retorna el emoji + texto de un turno */
function turnoLabel(turno) {
    if (turno === 'Mañana') return '🌅 Mañana (6:30–14:30)';
    if (turno === 'Tarde')  return '🌇 Tarde (14:30–22:00)';
    if (turno === 'Noche')  return '🌙 Noche (22:00–6:30)';
    return turno;
}

let asistenciaDiaActual = {};

document.addEventListener('DOMContentLoaded', () => {
    const menuTrabajadores = document.getElementById('menu-trabajadores');
    const inputFechaAsistencia = document.getElementById('asistencia-fecha');
    const btnGuardarAsistencia = document.getElementById('btn-guardar-asistencia');
    const selectFiltroTurno = document.getElementById('rend-filtro-turno');

    // 1. Navegación e integración en menú principal
    if (menuTrabajadores) {
        menuTrabajadores.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Ocultar todos los paneles principales
            document.querySelectorAll('.dashboard-container').forEach(p => p.style.display = 'none');
            
            // Mostrar panel de trabajadores
            const target = document.getElementById('trabajadores-panel-container');
            if (target) target.style.display = 'block';
            
            // Quitar clase activa de otros menús y agregar a este
            document.querySelectorAll('.admin-nav-item').forEach(l => l.classList.remove('active'));
            menuTrabajadores.classList.add('active');

            // Cargar datos por defecto de rendimiento y asistencia
            calcularRendimientoTrabajadores();
            cargarAsistenciaFecha();
        });
    }

    // 2. Control de pestañas internas (Rendimiento / Asistencia)
    document.querySelectorAll('.trabajadores-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Alternar estado activo de botones
            document.querySelectorAll('.trabajadores-tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = 'var(--text-muted)';
            });
            btn.classList.add('active');
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            
            // Alternar visibilidad de contenedores
            document.querySelectorAll('.trabajadores-tab-content').forEach(c => c.style.display = 'none');
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.style.display = 'block';

            if (tabId === 'tab-rendimiento') {
                calcularRendimientoTrabajadores();
            } else if (tabId === 'tab-asistencia') {
                cargarAsistenciaFecha();
            } else if (tabId === 'tab-consulta') {
                inicializarConsultaTrabajador();
            }
        });
    });

    // 3. Inicializar fecha de asistencia por defecto a hoy
    if (inputFechaAsistencia) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        inputFechaAsistencia.value = `${yyyy}-${mm}-${dd}`;

        inputFechaAsistencia.addEventListener('change', () => {
            cargarAsistenciaFecha();
        });
    }

    // 4. Botón Guardar Asistencia
    if (btnGuardarAsistencia) {
        btnGuardarAsistencia.addEventListener('click', () => {
            guardarAsistencia();
        });
    }

    // 5. Filtro de Turno en Rendimiento
    if (selectFiltroTurno) {
        selectFiltroTurno.addEventListener('change', () => {
            calcularRendimientoTrabajadores();
        });
    }
});

async function inicializarSemillaTrabajadores() {
    console.log("Inicializando trabajadores semilla...");
    const operariosSemilla = [
        { nombre: "5274 - LIDIA RIOS GADEA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "5517 - GUTIERREZ ORTEGA CLAUDIA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7221 - DE JESUS ROJAS MARIA DE LOURDES", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6348 - JOEL MARTIN ORTEGA ALONSO", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6986 - CLAUDIA LETICIA AMEZCUA TINOCO", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "4920 - JUANA CASTAÑEDA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "2831 - MARIA GUADALUPE JIMENEZ MARTINEZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7085 - ROMERO PEREZ ANGELES LAURA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6958 - LAILA GUADALUPE ISIDRO CRUZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7110 - RAMIREZ OLIVERA IRVIN MOISES", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6645 - JOEL GARCIA REYES", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "8812 - GUADALUPE FLORES CASTAÑEDA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7127 - ISLAS ROJAS JUANA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7126 - GARCIA CRISTOBAL BLANCA AURORA", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7107 - GARCIA ZARATE MARIA ISABEL", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7114 - TAPIA ORTEGA JOSE ANGEL", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7131 - COLIN ORTEGA ALMA ROSA", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6900 - OLMOS ORTEGA SERGIO ARMANDO", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6110 - ALEJANDRA PLATA NAVA", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6959 - LIZA YAZMIN MENDOZA GUZMAN", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7078 - HIDALGO ANTONIO YANET", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7112 - PEREZ FRANCISCO VANESA YAZMIN", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7129 - CERVANTES CASIQUE ALFREDO", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7064 - MARTINEZ MONTES MONSERRAT", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7097 - CASTAÑEDA ALBA MABEL ADRIANA", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6166 - ANA ISABEL ROMANI ROJO", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "5593 - ANGELICA EMILIA CRUZ MUÑOZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7121 - MARTINEZ MONROY SALMA ADELIN", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "5898 - ESPERANZA MEJIA MARTINEZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6574 - REBECA JUAREZ VELEZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7115 - VAZQUEZ GUTIERREZ GUSTAVO", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6952 - ROMERO MARTINEZ MARIA DEL ROSARIO", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6762 - JUANA EDITH JARAMILLO CRUZ", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7104 - DE JESUS VERDE ISAAC", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6821 - CRISTIAN SANCHEZ", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "6943 - SAUL OLIVER MORENO LIRA", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "7038 - DUSTIN ZABDIEL MENDOZA AVILA", turno: "Noche", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "5454 - SERGIO GONZALEZ SANCHEZ", turno: "Tarde", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "4489 - ANGEL CORREA LANDEROS", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() },
        { nombre: "4359 - JOSE ANTONIO GARRIDO FLORES", turno: "Mañana", activo: true, creadoEn: new Date().toISOString() }
    ];

    localStorage.setItem("rymco_operadores", JSON.stringify(operariosSemilla));

    if (typeof db !== "undefined" && db !== null) {
        try {
            const batch = db.batch();
            operariosSemilla.forEach(op => {
                const docRef = db.collection("operadores").doc();
                batch.set(docRef, op);
            });
            await batch.commit();
            console.log("Semilla guardada exitosamente en Firebase.");
        } catch(e) {
            console.warn("Error guardando semilla en Firestore:", e);
        }
    }
}

// Helper: Obtener operadores dados de alta en el sistema
async function obtenerListaOperadores() {
    let lista = [];
    if (typeof db !== "undefined" && db !== null) {
        try {
            const snap = await db.collection("operadores").get();
            snap.forEach(doc => {
                lista.push({ id: doc.id, ...doc.data() });
            });
        } catch(e) {
            console.warn("Error leyendo operadores de Firebase:", e);
        }
    }
    if (lista.length === 0) {
        lista = JSON.parse(localStorage.getItem("rymco_operadores") || "[]");
    }
    if (lista.length === 0) {
        await inicializarSemillaTrabajadores();
        if (typeof db !== "undefined" && db !== null) {
            try {
                const snap = await db.collection("operadores").get();
                snap.forEach(doc => {
                    lista.push({ id: doc.id, ...doc.data() });
                });
            } catch(e) {}
        }
        if (lista.length === 0) {
            lista = JSON.parse(localStorage.getItem("rymco_operadores") || "[]");
        }
    }
    return lista;
}

// Helper: Combina los operadores dados de alta con los IDs de trabajador encontrados en la bitácora
async function obtenerTodosLosTrabajadores() {
    const ops = await obtenerListaOperadores();
    const setTrabajadores = new Set();
    
    // Añadir operadores configurados
    ops.forEach(o => {
        if (o.nombre) setTrabajadores.add(o.nombre.trim());
    });
    
    // Buscar si hay más en la bitácora local e histórica
    let registros = [];
    if (typeof db !== "undefined" && db !== null) {
        try {
            const snap = await db.collection("registros_produccion").get();
            snap.forEach(doc => registros.push(doc.data()));
        } catch(e) { 
            console.warn("Error al leer bitácora de Firebase:", e); 
        }
    }
    const localReg = JSON.parse(localStorage.getItem("rymco_db_admin") || "[]");
    registros = [...registros, ...localReg];
    
    registros.forEach(r => {
        if (r.trabajadores && r.trabajadores !== 'N/A' && typeof r.trabajadores === 'string') {
            r.trabajadores.split(',').forEach(t => {
                const cleanName = t.trim();
                if (cleanName) setTrabajadores.add(cleanName);
            });
        }
    });
    
    const result = [];
    setTrabajadores.forEach(nombre => {
        const opEncontrado = ops.find(o => o.nombre.trim() === nombre);
        result.push({
            nombre: nombre,
            turno: opEncontrado ? opEncontrado.turno : 'Mañana',
            activo: opEncontrado ? opEncontrado.activo !== false : true
        });
    });
    return result;
}

// Cálculo e impresión de Rendimiento desde Bitácora
async function calcularRendimientoTrabajadores() {
    const tbody = document.getElementById('tbody-rendimiento-trabajadores');
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">Calculando rendimiento...</td></tr>`;
    
    let registros = [];
    if (typeof db !== "undefined" && db !== null) {
        try {
            const snap = await db.collection("registros_produccion").get();
            snap.forEach(doc => registros.push(doc.data()));
        } catch(e) { 
            console.warn("Error cargando bitácora:", e); 
        }
    }
    const localReg = JSON.parse(localStorage.getItem("rymco_db_admin") || "[]");
    registros = [...registros, ...localReg];
    
    // Filtrar por turno según dropdown
    const filtroTurno = document.getElementById('rend-filtro-turno')?.value || 'todos';
    if (filtroTurno !== 'todos') {
        registros = registros.filter(r => r.turno === filtroTurno);
    }
    
    const stats = {};
    
    registros.forEach(r => {
        if (r.trabajadores && r.trabajadores !== 'N/A' && typeof r.trabajadores === 'string') {
            r.trabajadores.split(',').forEach(t => {
                const cleanName = t.trim();
                if (!cleanName) return;
                
                if (!stats[cleanName]) {
                    stats[cleanName] = {
                        nombre: cleanName,
                        registrosCount: 0,
                        totalPiezas: 0,
                        totalKilos: 0
                    };
                }
                stats[cleanName].registrosCount++;
                stats[cleanName].totalPiezas += (r.piezas || 0);
                stats[cleanName].totalKilos += (r.kilos || 0);
            });
        }
    });
    
    const statsList = Object.values(stats);
    if (statsList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">No hay registros de producción en el turno seleccionado para medir rendimiento.</td></tr>`;
        return;
    }
    
    // Calcular porcentaje relativo comparado con el operario de mayor producción
    const maxPiezas = Math.max(...statsList.map(s => s.totalPiezas), 1);
    
    tbody.innerHTML = '';
    statsList.sort((a, b) => b.totalPiezas - a.totalPiezas);
    
    statsList.forEach(s => {
        const promPz = Math.round(s.totalPiezas / s.registrosCount);
        const pct = Math.min(Math.round((s.totalPiezas / maxPiezas) * 100), 100);
        
        let barColor = 'linear-gradient(90deg, #3b82f6, #60a5fa)'; // Azul (medio)
        if (pct >= 80) {
            barColor = 'linear-gradient(90deg, #10b981, #34d399)'; // Verde (alto)
        } else if (pct < 40) {
            barColor = 'linear-gradient(90deg, #ef4444, #f87171)'; // Rojo (bajo)
        }
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border)';
        tr.innerHTML = `
            <td style="padding: 12px 16px; font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${s.nombre}</td>
            <td style="padding: 12px 16px; font-size: 0.85rem; text-align: center; color: var(--text-muted);">${s.registrosCount}</td>
            <td style="padding: 12px 16px; font-size: 0.85rem; text-align: center; font-weight: 600;">${s.totalPiezas.toLocaleString()}</td>
            <td style="padding: 12px 16px; font-size: 0.85rem; text-align: center; color: var(--text-muted);">${s.totalKilos.toLocaleString()} kg</td>
            <td style="padding: 12px 16px; font-size: 0.85rem; text-align: center; color: var(--text-muted);">${promPz.toLocaleString()} pz</td>
            <td style="padding: 12px 16px; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                        <div style="width: ${pct}%; height: 100%; background: ${barColor}; border-radius: 4px;"></div>
                    </div>
                    <span style="font-size: 0.75rem; font-weight: 700; width: 35px; text-align: right; color: var(--text-main);">${pct}%</span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

let ultimaFechaCargada = '';

// Carga de Asistencia Diaria
async function cargarAsistenciaFecha(forceReload = false) {
    const inputFecha = document.getElementById('asistencia-fecha');
    if (!inputFecha) return;
    const fechaVal = inputFecha.value;
    if (!fechaVal) return;
    
    const tbody = document.getElementById('tbody-asistencia-trabajadores');
    if (!tbody) return;
    
    // Si la fecha es igual y no forzamos recarga, solo pintamos con el estado en memoria actual
    if (fechaVal === ultimaFechaCargada && !forceReload) {
        renderListaAsistencia(tbody);
        return;
    }
    
    tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">Cargando lista de asistencia...</td></tr>`;
    
    const trabajadores = await obtenerTodosLosTrabajadores();
    if (trabajadores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">No hay operarios registrados en el sistema. Registra operarios en Configuración o ingresa registros en la bitácora.</td></tr>`;
        return;
    }
    
    asistenciaDiaActual = {};
    
    // Intentar cargar desde Firebase
    if (typeof db !== "undefined" && db !== null) {
        try {
            const doc = await db.collection("asistencia").doc(fechaVal).get();
            if (doc.exists && doc.data().asistencias) {
                asistenciaDiaActual = doc.data().asistencias;
            }
        } catch(e) {
            console.warn("Error cargando asistencia de Firebase:", e);
        }
    }
    
    // Si no cargó nada, intentar cargar desde localStorage
    if (Object.keys(asistenciaDiaActual).length === 0) {
        const asistenciasLocales = JSON.parse(localStorage.getItem("rymco_asistencia") || "{}");
        if (asistenciasLocales[fechaVal]) {
            asistenciaDiaActual = asistenciasLocales[fechaVal];
        }
    }
    
    // Rellenar con estado por defecto 'Asistió' para los que no tengan registro
    trabajadores.forEach(t => {
        if (!asistenciaDiaActual[t.nombre]) {
            asistenciaDiaActual[t.nombre] = 'Asistió';
        }
    });
    
    ultimaFechaCargada = fechaVal;
    renderListaAsistencia(tbody, trabajadores);
}

// Pintar la lista de asistencia en el tbody
async function renderListaAsistencia(tbody, trabajadores = null) {
    if (!trabajadores) {
        trabajadores = await obtenerTodosLosTrabajadores();
    }
    tbody.innerHTML = '';
    
    trabajadores.forEach(t => {
        const status = asistenciaDiaActual[t.nombre] || 'Asistió';
        
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border)';

        // Calcular turno rotativo para la fecha actualmente mostrada
        const turnoActual = calcularTurnoSemana(t.turno, ultimaFechaCargada || new Date());
        const turnoSigSemana = calcularTurnoSemana(t.turno, new Date(new Date(ultimaFechaCargada || Date.now()).getTime() + 7 * 86400000));

        tr.innerHTML = `
            <td style="padding: 12px 16px; font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${t.nombre}</td>
            <td style="padding: 12px 16px; font-size: 0.82rem;">
                <div style="font-weight: 700; color: var(--text-main);">${turnoLabel(turnoActual)}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">→ Próx: ${turnoLabel(turnoSigSemana)}</div>
            </td>
            <td style="padding: 12px 16px; text-align: center;">
                <div style="display: inline-flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 8px; border: 1.5px solid var(--border);">
                    <button class="btn-att present" data-status="Asistió" style="padding: 6px 14px; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit;">
                        🟢 Asistió
                    </button>
                    <button class="btn-att absent" data-status="Faltó" style="padding: 6px 14px; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit;">
                        🔴 Faltó
                    </button>
                    <button class="btn-att vac" data-status="VAC" style="padding: 6px 14px; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit;">
                        🏖️ VAC
                    </button>
                </div>
            </td>
        `;
        
        const buttons = tr.querySelectorAll('.btn-att');
        
        const updateButtonHighlights = (activeStatus) => {
            buttons.forEach(btn => {
                const btnStatus = btn.dataset.status;
                if (btnStatus === activeStatus) {
                    if (btnStatus === 'Asistió') {
                        btn.style.background = '#22c55e'; // Verde
                        btn.style.color = '#ffffff';
                        btn.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.2)';
                    } else if (btnStatus === 'Faltó') {
                        btn.style.background = '#ef4444'; // Rojo
                        btn.style.color = '#ffffff';
                        btn.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
                    } else if (btnStatus === 'VAC') {
                        btn.style.background = '#eab308'; // Amarillo/Naranja
                        btn.style.color = '#ffffff';
                        btn.style.boxShadow = '0 2px 4px rgba(234, 179, 8, 0.2)';
                    }
                } else {
                    btn.style.background = 'transparent';
                    btn.style.color = '#64748b';
                    btn.style.boxShadow = 'none';
                }
            });
        };
        
        // Iluminar el botón activo inicial
        updateButtonHighlights(status);
        
        // Agregar manejadores de eventos
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const clickedStatus = btn.dataset.status;
                asistenciaDiaActual[t.nombre] = clickedStatus;
                updateButtonHighlights(clickedStatus);
            });
        });
        
        tbody.appendChild(tr);
    });
}

// Guardar Asistencia en persistencia
async function guardarAsistencia() {
    const inputFecha = document.getElementById('asistencia-fecha');
    if (!inputFecha) return;
    const fechaVal = inputFecha.value;
    if (!fechaVal) return alert('Por favor selecciona una fecha válida.');
    
    const btn = document.getElementById('btn-guardar-asistencia');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Guardando...';
    btn.disabled = true;
    
    // 1. Guardar localmente
    const asistenciasLocales = JSON.parse(localStorage.getItem("rymco_asistencia") || "{}");
    asistenciasLocales[fechaVal] = asistenciaDiaActual;
    localStorage.setItem("rymco_asistencia", JSON.stringify(asistenciasLocales));
    
    // 2. Guardar en Firestore
    if (typeof db !== "undefined" && db !== null) {
        try {
            await db.collection("asistencia").doc(fechaVal).set({
                fecha: fechaVal,
                asistencias: asistenciaDiaActual,
                actualizadoEn: new Date().toISOString()
            });
            alert('✅ Asistencia guardada correctamente.');
        } catch(e) {
            console.error("Error al guardar asistencia en Firebase:", e);
            alert('⚠️ Guardado localmente (error al sincronizar en la Nube).');
        }
    } else {
        alert('✅ Asistencia guardada correctamente (Modo Local).');
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
    
    // Forzar recarga limpia del sistema para reiniciar la vista con los datos guardados
    await cargarAsistenciaFecha(true);
}

// ══════════════════════════════════════════════════════════
//  CONSULTA DE TRABAJADOR — Búsqueda, Perfil y KPIs
// ══════════════════════════════════════════════════════════

let _consultaListaTrabajadores = [];  // caché de la lista para autocomplete
let _consultaAsistencias = {};        // caché de todos los registros de asistencia
let _consultaProduccion = [];         // caché de registros de producción

async function inicializarConsultaTrabajador() {
    const input = document.getElementById('consulta-busqueda');
    if (!input) return;

    // Cargar datos si no están en caché
    if (_consultaListaTrabajadores.length === 0) {
        _consultaListaTrabajadores = await obtenerTodosLosTrabajadores();
    }
    if (Object.keys(_consultaAsistencias).length === 0) {
        await _cargarTodasAsistencias();
    }
    if (_consultaProduccion.length === 0) {
        await _cargarTodaProduccion();
    }

    // Limpiar resultado anterior al entrar
    document.getElementById('consulta-resultado').style.display = 'none';
    document.getElementById('consulta-vacio').style.display = 'block';
    input.value = '';
    document.getElementById('consulta-suggestions').style.display = 'none';

    // Quitar listener previo clonando el nodo
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);

    newInput.addEventListener('input', () => {
        const query = newInput.value.trim().toLowerCase();
        _mostrarSugerencias(query);
    });

    newInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('consulta-suggestions').style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#consulta-suggestions') && !e.target.closest('#consulta-busqueda')) {
            const s = document.getElementById('consulta-suggestions');
            if (s) s.style.display = 'none';
        }
    });
}

function _mostrarSugerencias(query) {
    const suggestionsEl = document.getElementById('consulta-suggestions');
    if (!suggestionsEl) return;

    if (!query || query.length < 1) {
        suggestionsEl.style.display = 'none';
        return;
    }

    const coincidencias = _consultaListaTrabajadores.filter(t =>
        t.nombre.toLowerCase().includes(query)
    ).slice(0, 10);

    if (coincidencias.length === 0) {
        suggestionsEl.innerHTML = `<div style="padding: 12px 16px; color: var(--text-muted); font-size: 0.85rem;">Sin resultados para "${query}"</div>`;
        suggestionsEl.style.display = 'block';
        return;
    }

    suggestionsEl.innerHTML = coincidencias.map(t => `
        <div class="consulta-suggestion-item" data-nombre="${t.nombre}"
             style="padding: 12px 16px; cursor: pointer; font-size: 0.88rem; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; gap: 10px; transition: background 0.15s; background: white;">
            <span style="font-size: 1.1rem;">👷</span>
            <div>
                <div style="font-weight: 600; color: var(--text-main);">${t.nombre}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Turno: ${t.turno}</div>
            </div>
        </div>
    `).join('');

    suggestionsEl.style.display = 'block';

    // Hover styles y click
    suggestionsEl.querySelectorAll('.consulta-suggestion-item').forEach(item => {
        item.addEventListener('mouseenter', () => item.style.background = '#FFF7ED');
        item.addEventListener('mouseleave', () => item.style.background = 'white');
        item.addEventListener('click', () => {
            const nombre = item.dataset.nombre;
            document.getElementById('consulta-busqueda').value = nombre;
            suggestionsEl.style.display = 'none';
            _mostrarPerfilTrabajador(nombre);
        });
    });
}

async function _cargarTodasAsistencias() {
    _consultaAsistencias = {};
    // Intentar Firebase
    if (typeof db !== 'undefined' && db !== null) {
        try {
            const snap = await db.collection('asistencia').get();
            snap.forEach(doc => {
                const d = doc.data();
                if (d.asistencias) _consultaAsistencias[doc.id] = d.asistencias;
            });
            return;
        } catch(e) { console.warn('Error cargando asistencias:', e); }
    }
    // Fallback localStorage
    const local = JSON.parse(localStorage.getItem('rymco_asistencia') || '{}');
    Object.entries(local).forEach(([fecha, asis]) => {
        _consultaAsistencias[fecha] = asis;
    });
}

async function _cargarTodaProduccion() {
    _consultaProduccion = [];
    if (typeof db !== 'undefined' && db !== null) {
        try {
            const snap = await db.collection('registros_produccion').get();
            snap.forEach(doc => _consultaProduccion.push(doc.data()));
        } catch(e) { console.warn('Error cargando producción:', e); }
    }
    const local = JSON.parse(localStorage.getItem('rymco_db_admin') || '[]');
    _consultaProduccion = [..._consultaProduccion, ...local];
}

function _mostrarPerfilTrabajador(nombre) {
    const trabajador = _consultaListaTrabajadores.find(t => t.nombre === nombre);
    if (!trabajador) return;

    // Contar asistencias, faltas y VAC en todas las fechas
    let totalAsistencias = 0;
    let totalFaltas = 0;
    let totalVac = 0;
    const historialRegistros = []; // [{fecha, estado}]

    Object.entries(_consultaAsistencias).forEach(([fecha, asistencias]) => {
        const estado = asistencias[nombre];
        if (estado === undefined) return;
        historialRegistros.push({ fecha, estado });
        if (estado === 'Asistió') totalAsistencias++;
        else if (estado === 'Faltó') totalFaltas++;
        else if (estado === 'VAC') totalVac++;
    });

    // Ordenar historial por fecha DESC
    historialRegistros.sort((a, b) => b.fecha.localeCompare(a.fecha));

    const totalDias = totalAsistencias + totalFaltas + totalVac;
    const pctAsistencia = totalDias > 0 ? Math.round((totalAsistencias / totalDias) * 100) : null;

    // Contar producción
    let totalPiezas = 0;
    let totalKilos = 0;
    _consultaProduccion.forEach(r => {
        if (r.trabajadores && typeof r.trabajadores === 'string') {
            const trabajadoresEnReg = r.trabajadores.split(',').map(t => t.trim());
            if (trabajadoresEnReg.includes(nombre)) {
                totalPiezas += (r.piezas || 0);
                totalKilos += (r.kilos || 0);
            }
        }
    });

    // Estado general del trabajador según % de asistencia
    let estadoBadgeText = '🟢 Excelente';
    let estadoBadgeBg = '#22c55e';
    if (pctAsistencia !== null) {
        if (pctAsistencia < 60)      { estadoBadgeText = '🔴 Crítico'; estadoBadgeBg = '#ef4444'; }
        else if (pctAsistencia < 80) { estadoBadgeText = '🟡 Regular'; estadoBadgeBg = '#f59e0b'; }
        else if (pctAsistencia < 95) { estadoBadgeText = '🔵 Bueno'; estadoBadgeBg = '#3b82f6'; }
    } else {
        estadoBadgeText = '⚪ Sin registros'; estadoBadgeBg = '#94a3b8';
    }

    // Rellenar cabecera
    document.getElementById('perfil-nombre').textContent = nombre;
    document.getElementById('perfil-turno').textContent = `Turno: ${trabajador.turno} · ${totalDias} día(s) registrado(s)`;
    const badge = document.getElementById('perfil-estado-badge');
    badge.textContent = estadoBadgeText;
    badge.style.background = estadoBadgeBg;
    badge.style.color = 'white';

    // Rellenar KPIs
    document.getElementById('kpi-asistencias').textContent = totalAsistencias;
    document.getElementById('kpi-faltas').textContent = totalFaltas;
    document.getElementById('kpi-vacaciones').textContent = totalVac;
    document.getElementById('kpi-pct-asistencia').textContent = pctAsistencia !== null ? `${pctAsistencia}%` : '—%';
    document.getElementById('kpi-produccion').textContent = totalPiezas.toLocaleString();
    document.getElementById('kpi-kilos').textContent = totalKilos.toLocaleString();

    // Rellenar historial de asistencia reciente
    const histEl = document.getElementById('consulta-historial-asistencia');
    if (historialRegistros.length === 0) {
        histEl.innerHTML = `<div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.85rem;">Sin registros de asistencia para este trabajador.</div>`;
    } else {
        histEl.innerHTML = historialRegistros.slice(0, 50).map(r => {
            let icon, bg, color;
            if (r.estado === 'Asistió')     { icon = '✅'; bg = '#f0fdf4'; color = '#15803d'; }
            else if (r.estado === 'Faltó')  { icon = '❌'; bg = '#fef2f2'; color = '#dc2626'; }
            else                            { icon = '🏖️'; bg = '#fefce8'; color = '#a16207'; }
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: ${bg}; border-radius: 8px;">
                    <span style="font-size: 0.82rem; font-weight: 600; color: #475569;">${r.fecha}</span>
                    <span style="font-size: 0.82rem; font-weight: 700; color: ${color};">${icon} ${r.estado}</span>
                </div>
            `;
        }).join('');
    }

    // Mostrar resultado y ocultar estado vacío
    document.getElementById('consulta-vacio').style.display = 'none';
    document.getElementById('consulta-resultado').style.display = 'block';
}
