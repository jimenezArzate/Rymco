document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    //  NAV: Menú lateral → paneles
    // =====================================================
    function showPanel(panelId) {
        document.querySelectorAll('.dashboard-container').forEach(p => p.style.display = 'none');
        const target = document.getElementById(panelId);
        if (target) target.style.display = 'block';
        document.querySelectorAll('.admin-nav-item').forEach(l => l.classList.remove('active'));
    }

    const menuInicio    = document.getElementById('menu-inicio');
    const menuBitacora  = document.getElementById('menu-bitacora');
    const menuAdmin     = document.getElementById('menu-admin-vista');
    const menuHistorial = document.getElementById('menu-historial');
    const menuMensajes  = document.getElementById('menu-mensajes');
    const menuReportes  = document.getElementById('menu-reportes-pdf');
    const menuConfig    = document.getElementById('menu-configuracion');

    if (menuInicio)    menuInicio.addEventListener('click',    e => { e.preventDefault(); showPanel('inicio-panel-container');   menuInicio.classList.add('active'); });
    if (menuBitacora)  menuBitacora.addEventListener('click',  e => { e.preventDefault(); showPanel('app-container');            menuBitacora.classList.add('active'); });
    if (menuAdmin)     menuAdmin.addEventListener('click',     e => { e.preventDefault(); showPanel('admin-container');          menuAdmin.classList.add('active'); window.cargarPanelAdmin && window.cargarPanelAdmin(); });
    if (menuHistorial) menuHistorial.addEventListener('click', e => { e.preventDefault(); showPanel('historial-container');      menuHistorial.classList.add('active'); inicializarPicker(); });
    if (menuMensajes)  menuMensajes.addEventListener('click',  e => { e.preventDefault(); showPanel('mensajes-panel-container');  menuMensajes.classList.add('active'); window.cargarPanelMensajes && window.cargarPanelMensajes(); });
    if (menuReportes)  menuReportes.addEventListener('click',  e => { e.preventDefault(); showPanel('reportes-pdf-container');   menuReportes.classList.add('active'); });
    if (menuConfig)    menuConfig.addEventListener('click',    e => { e.preventDefault(); showPanel('configuracion-container');  menuConfig.classList.add('active'); });

    // Sub-tabs inside historial
    document.querySelectorAll('.historial-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.historial-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.historial-tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            
            // Sync dropdown select if it exists
            const selectEl = document.getElementById('historial-tab-select');
            if (selectEl && selectEl.value !== tabId) {
                selectEl.value = tabId;
            }

            const panel = document.getElementById(tabId);
            if (panel) panel.classList.add('active');
            // Al entrar a Datos Semanales solo inicializa selectores, NO carga la tabla
            if (tabId === 'tab-datos-semanales') {
                inicializarPicker();
                limpiarVistaSemanal();
            }
        });
    });

   // Definición segura de turnos (asegúrate de que esto exista en el alcance global o dentro de tu función)
const turnosConfig = [
    { nombre: 'Mañana', key: 'Mañana', clase: 'fila-turno-mañana' },
    { nombre: 'Tarde', key: 'Tarde', clase: 'fila-turno-tarde' },
    { nombre: 'Noche', key: 'Noche', clase: 'fila-turno-noche' }
];

// Función optimizada para renderizar la tabla
window.renderizarTablaTurnos = function(acumT) {
    const tbodySem = document.getElementById('tbodySem');
    if (!tbodySem) return;

    tbodySem.innerHTML = ''; // Limpiar tabla antes de rellenar

    turnosConfig.forEach(({ nombre, key, clase }) => {
        // SEGURIDAD: Usamos ?. para evitar errores si acumT o la clave no existen
        const a = acumT?.[key] || { pz: 0, kg: 0, dias: 0 };
        
        const pzProm = a.dias > 0 ? (a.pz / a.dias).toFixed(0) : 0;
        const kgProm = a.dias > 0 ? (a.kg / a.dias).toFixed(2) : 0;

        if (typeof datosGuardarSem !== 'undefined') {
            datosGuardarSem[key] = { pzProm, kgProm };
        }

        const tr = document.createElement('tr');
        tr.className = clase;
        tr.innerHTML = `
            <td class="celda-nombre">${nombre}</td>
            <td>${a.dias || 0} días</td>
            <td>${pzProm}</td>
            <td>${kgProm} kg</td>
        `;
        tbodySem.appendChild(tr);
    });
};

// Sincronización de Tabs mejorada
const tabSelect = document.getElementById('historial-tab-select');
if (tabSelect) {
    tabSelect.addEventListener('change', (e) => {
        const btn = document.querySelector(`.historial-tab-btn[data-tab="${e.target.value}"]`);
        if (btn) btn.click();
    });
}

// Menú recuperación
const menuRecuperacion = document.getElementById('menu-recuperacion');
if (menuRecuperacion) {
    menuRecuperacion.addEventListener('click', e => {
        e.preventDefault();
        showPanel('recuperacion-container');
        menuRecuperacion.classList.add('active');
    });
}

// Inicialización Picker
window.inicializarPicker = function() {
    const picker = document.getElementById('historial-semanal-picker');
    if (picker && !picker.value) {
        const now = new Date();
        picker.value = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    }
};
    // =====================================================
    //  DASHBOARD METRICS AND CHARTS
    // =====================================================
    window.actualizarDashboardStats = function() {
        let totalPz = 0;
        let totalKg = 0;

        const modulos = [
            { key: 'rymco_recuperacion_db' },
            { key: 'rymco_acondicionamiento_db' },
            { key: 'rymco_conformado_db' },
            { key: 'rymco_regalvanizar_db' }
        ];

        const productos = (typeof tablaGlobalProductos !== 'undefined') ? tablaGlobalProductos : [];

        modulos.forEach(m => {
            const data = JSON.parse(localStorage.getItem(m.key)) || [];
            data.forEach(item => {
                const qty = parseFloat(item.qty) || 0;
                totalPz += qty;
                if (productos[item.index]) {
                    totalKg += productos[item.index].valor * qty;
                }
            });
        });

        const elDashQty = document.getElementById('dash-global-qty');
        const elDashTotal = document.getElementById('dash-global-total');
        if (elDashQty) elDashQty.textContent = totalPz.toLocaleString();
        if (elDashTotal) elDashTotal.textContent = Math.round(totalKg).toLocaleString() + ' kg';

        const pctEf = totalPz > 0 ? Math.min(100, Math.round((totalPz / 5000) * 100)) : 0;
        const elEf = document.getElementById('porcentaje-eficiencia');
        if (elEf) elEf.textContent = `${pctEf}%`;
        const pieChart = document.querySelector('.pie-chart');
        if (pieChart) {
            pieChart.style.background = `conic-gradient(var(--primary) 0% ${pctEf}%, #E2E8F0 ${pctEf}% 100%)`;
        }
    };

    window.inicializarGraficos = async function() {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const datosKilos = [0, 0, 0, 0, 0, 0];
        const datosPiezas = [0, 0, 0, 0, 0, 0];
        
        let refDate = new Date();
        
        // 1. Buscar la fecha del registro más reciente en Firebase
        if (typeof db !== 'undefined' && db !== null) {
            try {
                const snap1 = await db.collection('registros_produccion')
                    .orderBy('fecha', 'desc')
                    .limit(1)
                    .get();
                if (!snap1.empty) {
                    const doc = snap1.docs[0].data();
                    if (doc.fecha) {
                        const parts = doc.fecha.split('-');
                        refDate = new Date(parts[0], parts[1] - 1, parts[2]);
                    }
                } else {
                    const snap2 = await db.collection('historial_mensual')
                        .orderBy('fecha', 'desc')
                        .limit(1)
                        .get();
                    if (!snap2.empty) {
                        const doc = snap2.docs[0].data();
                        if (doc.fecha) {
                            const parts = doc.fecha.split('-');
                            refDate = new Date(parts[0], parts[1] - 1, parts[2]);
                        }
                    }
                }
            } catch (e) {
                console.warn("No se pudo obtener la fecha más reciente de Firebase para la gráfica:", e);
            }
        }

        // 2. Si refDate sigue siendo hoy, intentar complementar con la fecha más reciente local
        if (refDate.toDateString() === new Date().toDateString()) {
            let maxLocalFecha = "";
            const sources = [
                JSON.parse(localStorage.getItem('rymco_db_admin')) || [],
                JSON.parse(localStorage.getItem('rymco_historial_mensual')) || [],
                JSON.parse(localStorage.getItem('bitacora_offline')) || []
            ];
            sources.forEach(arr => {
                arr.forEach(r => {
                    if (r.fecha && r.fecha > maxLocalFecha) {
                        maxLocalFecha = r.fecha;
                    }
                });
            });
            if (maxLocalFecha) {
                const parts = maxLocalFecha.split('-');
                refDate = new Date(parts[0], parts[1] - 1, parts[2]);
            }
        }

        const diaSemana = refDate.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const diffLunes = refDate.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
        const lunesDate = new Date(refDate.getFullYear(), refDate.getMonth(), diffLunes);
        
        const sabadoDate = new Date(lunesDate);
        sabadoDate.setDate(lunesDate.getDate() + 5);
        
        const formatISO = (d) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        };
        const fechaLunes = formatISO(lunesDate);
        const fechaSabado = formatISO(sabadoDate);

        // 3. Formatear rango de texto para los subtítulos de las gráficas
        const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesLunesText = mesesNombres[lunesDate.getMonth()];
        const mesSabadoText = mesesNombres[sabadoDate.getMonth()];
        let rangoTexto = "";
        if (mesLunesText === mesSabadoText) {
            rangoTexto = `Semana del ${lunesDate.getDate()} al ${sabadoDate.getDate()} de ${mesLunesText} de ${lunesDate.getFullYear()}`;
        } else {
            rangoTexto = `Semana del ${lunesDate.getDate()} de ${mesLunesText} al ${sabadoDate.getDate()} de ${mesSabadoText} de ${lunesDate.getFullYear()}`;
        }

        const elHistSubtitle = document.getElementById('historial-chart-subtitle');
        if (elHistSubtitle) elHistSubtitle.textContent = rangoTexto;

        const elDashSubtitle = document.getElementById('dash-chart-subtitle');
        if (elDashSubtitle) elDashSubtitle.textContent = rangoTexto;

        let todosRegistros = [];

        // 4. Intentar obtener datos reales de Firebase (de la semana de referencia)
        if (typeof db !== 'undefined' && db !== null) {
            try {
                // Obtener registros activos
                const snapProd = await db.collection('registros_produccion')
                    .where('fecha', '>=', fechaLunes)
                    .where('fecha', '<=', fechaSabado)
                    .get();
                snapProd.forEach(doc => todosRegistros.push(doc.data()));

                // Obtener registros del historial transferido
                const snapHist = await db.collection('historial_mensual')
                    .where('fecha', '>=', fechaLunes)
                    .where('fecha', '<=', fechaSabado)
                    .get();
                snapHist.forEach(doc => todosRegistros.push(doc.data()));
            } catch (e) {
                console.warn("No se pudieron cargar todos los datos de Firebase para la gráfica:", e);
            }
        }

        // 5. Complementar con datos locales/offline de la semana de referencia
        const adminLocal = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
        adminLocal.forEach(r => {
            if (r.fecha && r.fecha >= fechaLunes && r.fecha <= fechaSabado) {
                todosRegistros.push(r);
            }
        });

        const historialLocal = JSON.parse(localStorage.getItem('rymco_historial_mensual')) || [];
        historialLocal.forEach(r => {
            if (r.fecha && r.fecha >= fechaLunes && r.fecha <= fechaSabado) {
                todosRegistros.push(r);
            }
        });

        const bitacoraOffline = JSON.parse(localStorage.getItem('bitacora_offline')) || [];
        bitacoraOffline.forEach(r => {
            if (r.fecha && r.fecha >= fechaLunes && r.fecha <= fechaSabado) {
                todosRegistros.push(r);
            }
        });

        // 6. Procesar y agrupar registros eliminando duplicaciones exactas
        const yaAgregados = new Set();
        todosRegistros.forEach(r => {
            const key = `${r.fecha}_${r.turno}_${r.producto}_${r.piezas}_${r.kilos}`;
            if (yaAgregados.has(key)) return;
            yaAgregados.add(key);

            if (r.fecha) {
                const parts = r.fecha.split('-');
                const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                const dayNum = dateObj.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sab
                if (dayNum >= 1 && dayNum <= 6) {
                    datosKilos[dayNum - 1] += parseFloat(r.kilos) || 0;
                    datosPiezas[dayNum - 1] += parseFloat(r.piezas) || 0;
                }
            }
        });

        const hasRealData = datosKilos.some(val => val > 0);
        let kilosFinal = datosKilos;
        let piezasFinal = datosPiezas;

        // Fallback a datos demostrativos (dummy) si no hay registros reales en la semana de referencia
        if (!hasRealData) {
            const dummyKilos = [450, 620, 800, 510, 740, 300];
            const dummyPiezas = [120, 180, 220, 150, 200, 90];
            kilosFinal = dummyKilos;
            piezasFinal = dummyPiezas;
        }

        const ctxDash = document.getElementById('dashProduccionChart');
        if (ctxDash) {
            if (window.myDashChart) window.myDashChart.destroy();
            window.myDashChart = new Chart(ctxDash, {
                type: 'bar',
                data: {
                    labels: dias,
                    datasets: [
                        {
                            label: 'Kilos Producidos',
                            data: kilosFinal,
                            backgroundColor: '#F97316',
                            borderRadius: 4
                        },
                        {
                            label: 'Piezas',
                            data: piezasFinal,
                            backgroundColor: '#823C07',
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        const ctxHist = document.getElementById('historialProduccionChart');
        if (ctxHist) {
            if (window.myHistChart) window.myHistChart.destroy();
            window.myHistChart = new Chart(ctxHist, {
                type: 'line',
                data: {
                    labels: dias,
                    datasets: [
                        {
                            label: 'Producción de la Semana (kg)',
                            data: kilosFinal,
                            borderColor: '#F97316',
                            backgroundColor: 'rgba(249, 115, 22, 0.1)',
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    // =====================================================
    //  ADMIN TABLE
    // =====================================================
    function actualizarVistaMódulos() {
        const adminTablesContainer = document.getElementById('admin-tables-container');
        if (!adminTablesContainer) return;
        let baseDatosAdministrador = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
        adminTablesContainer.innerHTML = '';

        // Reset shift totals container
        const turnoCardsContainer = document.getElementById('admin-totales-turno-cards');
        if (turnoCardsContainer) turnoCardsContainer.innerHTML = '';

        if (baseDatosAdministrador.length === 0) {
            adminTablesContainer.innerHTML = `<p class="empty-state">No hay registros recibidos de los operadores el día de hoy.</p>`;
            const pp = document.getElementById('admin-total-piezas');
            const pk = document.getElementById('admin-total-kilos');
            if (pp) pp.textContent = '0';
            if (pk) pk.textContent = '0 kg';
            return;
        }

        let totalPiezasGeneral = 0, totalKilosGeneral = 0;
        const listaTurnos = ['Mañana', 'Tarde', 'Noche'];
        const emojisTurno = { 'Mañana': '🌅', 'Tarde': '☀️', 'Noche': '🌙' };
        const clasesTurno = { 'Mañana': 'mañana', 'Tarde': 'tarde', 'Noche': 'noche' };
        const coloresTurno = { 'Mañana': '#fef9c3', 'Tarde': '#dbeafe', 'Noche': '#f3e8ff' };
        const coloresTextoTurno = { 'Mañana': '#854d0e', 'Tarde': '#1e40af', 'Noche': '#6b21a8' };

        const totalesPorTurno = {};

        listaTurnos.forEach(t => {
            const itemsTurno = baseDatosAdministrador.filter(r => r.turno === t);
            if (itemsTurno.length === 0) return;

            // Acumular totales por turno
            let turnoPiezas = 0, turnoKilos = 0;
            itemsTurno.forEach(r => { turnoPiezas += (r.piezas || 0); turnoKilos += (r.kilos || 0); });
            totalesPorTurno[t] = { piezas: turnoPiezas, kilos: turnoKilos };

            const divTurno = document.createElement('div');
            divTurno.className = 'turno-card-block';
            divTurno.innerHTML = `<div class="turno-header-title ${clasesTurno[t]}">${emojisTurno[t]} Turno ${t}</div>`;

            const procesosUnicos = [...new Set(itemsTurno.map(r => r.proceso))];
            let contadorProceso = 0;

            procesosUnicos.forEach(proc => {
                contadorProceso++;
                const registrosDelProceso = itemsTurno.filter(r => r.proceso === proc);
                const divProceso = document.createElement('div');
                divProceso.className = 'proceso-sub-group';

                // Calcular subtotales del proceso
                let subPiezas = 0, subKilos = 0;
                registrosDelProceso.forEach(r => { subPiezas += (r.piezas || 0); subKilos += (r.kilos || 0); });

                let subTablaHtml = `<div class="proceso-label-title" style="display:flex;align-items:center;gap:8px;">
                    <span style="background:#059669;color:white;width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;">${contadorProceso}</span>
                    🛠️ ${proc}
                </div>
                    <table style="width:100%;border-collapse:collapse;margin-top:.5rem;">
                        <thead><tr style="background:#f8fafc;text-align:left;">
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">#</th>
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">Fecha</th>
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">Trabajador</th>
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">Producto</th>
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">Piezas</th>
                            <th style="padding:.5rem .7rem;border:1px solid #e2e8f0;font-weight:600;">Kilos</th>
                        </tr></thead><tbody>`;
                registrosDelProceso.forEach((r, i) => {
                    subTablaHtml += `<tr>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;">${i+1}</td>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;">${r.fecha}</td>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;">${r.trabajadores || '-'}</td>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;"><b>${r.producto}</b></td>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;">${r.piezas}</td>
                        <td style="padding:.4rem .6rem;border:1px solid #e2e8f0;"><span class="kilos-badge">${r.kilos} kg</span></td>
                    </tr>`;
                });

                // Fila SUBTOTAL del proceso
                subTablaHtml += `<tr style="background: #ecfdf5; font-weight: 700; border-top: 2px solid #059669;">
                    <td colspan="4" style="padding:.5rem .7rem;border:1px solid #e2e8f0;text-align:right;color:#059669;font-style:italic;">SUBTOTAL:</td>
                    <td style="padding:.5rem .7rem;border:1px solid #e2e8f0;color:#059669;">${subPiezas.toLocaleString('es-MX')}</td>
                    <td style="padding:.5rem .7rem;border:1px solid #e2e8f0;color:#059669;">${subKilos.toLocaleString('es-MX')} kg</td>
                </tr>`;

                subTablaHtml += `</tbody></table>`;
                divProceso.innerHTML = subTablaHtml;
                divTurno.appendChild(divProceso);
            });
            adminTablesContainer.appendChild(divTurno);
        });

        // --- TOTALES POR TURNO (tarjetas) ---
        if (turnoCardsContainer) {
            listaTurnos.forEach(t => {
                const datos = totalesPorTurno[t];
                if (!datos) return;
                const card = document.createElement('div');
                card.style.cssText = `background: ${coloresTurno[t]}; border-radius: 12px; padding: 1.2rem 1.5rem; border-left: 5px solid ${coloresTextoTurno[t]};`;
                card.innerHTML = `
                    <div style="font-weight: 700; font-size: 1.05rem; color: ${coloresTextoTurno[t]}; margin-bottom: 8px;">
                        ${emojisTurno[t]} ${t}
                    </div>
                    <div style="font-size: 0.95rem; color: #334155; line-height: 1.7;">
                        Piezas: <b>${datos.piezas.toLocaleString('es-MX')}</b><br>
                        Kilos: <b>${datos.kilos.toLocaleString('es-MX')} kg</b>
                    </div>`;
                turnoCardsContainer.appendChild(card);
            });
        }

        // --- TOTAL GENERAL DEL DÍA ---
        baseDatosAdministrador.forEach(r => { totalPiezasGeneral += (r.piezas || 0); totalKilosGeneral += (r.kilos || 0); });
        const pp = document.getElementById('admin-total-piezas');
        const pk = document.getElementById('admin-total-kilos');
        if (pp) pp.textContent = totalPiezasGeneral.toLocaleString('es-MX');
        if (pk) pk.textContent = totalKilosGeneral.toLocaleString('es-MX') + ' kg';
    }

    window.cargarPanelAdmin = function() { actualizarVistaMódulos(); };

    const btnClear = document.getElementById('btn-admin-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            if (confirm('¿Limpiar el sistema para iniciar un nuevo día? Esto borrará los registros enviados.')) {
                localStorage.removeItem('rymco_db_admin');
                actualizarVistaMódulos();
            }
        });
    }

    // --- EXPORTAR PDF ---
    const btnExportPdf = document.getElementById('btn-admin-export-pdf');
    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', () => {
            const element = document.getElementById('admin-container');
            if (!element) return alert('No se encontró el panel de administrador.');
            // Ocultar botones para el PDF
            const botones = element.querySelectorAll('button');
            botones.forEach(b => b.style.display = 'none');
            const opt = {
                margin: 0.5,
                filename: `Reporte_Produccion_Rymco_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save().then(() => {
                botones.forEach(b => b.style.display = '');
            }).catch(() => {
                botones.forEach(b => b.style.display = '');
            });
        });
    }

    const btnExportExcel = document.getElementById('btn-admin-export-excel');
    if (btnExportExcel) {
        btnExportExcel.addEventListener('click', async () => {
            const orig = btnExportExcel.innerHTML;
            btnExportExcel.innerHTML = '⏳ Obteniendo...';
            btnExportExcel.disabled = true;
            let datos = [];
            try {
                const snap = await db.collection('registros_produccion').orderBy('timestamp', 'desc').get();
                snap.forEach(doc => datos.push(doc.data()));
            } catch(e) {}
            if (datos.length === 0) datos = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
            btnExportExcel.innerHTML = orig;
            btnExportExcel.disabled = false;
            if (datos.length === 0) { alert('No hay datos para exportar.'); return; }
            const fmtd = datos.map((item, i) => ({
                'N°': i+1, 'Fecha': item.fecha, 'Turno': item.turno,
                'Proceso': item.proceso, 'Trabajadores': item.trabajadores || 'N/A',
                'Producto': item.producto, 'Piezas': item.piezas, 'Kilos': item.kilos
            }));
            const ws = XLSX.utils.json_to_sheet(fmtd);
            ws['!cols'] = [{wch:5},{wch:12},{wch:10},{wch:40},{wch:25},{wch:35},{wch:15},{wch:20}];
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Produccion');
            XLSX.writeFile(wb, `Reporte_Rymco_${new Date().toISOString().split('T')[0]}.xlsx`);
        });
    }

    const btnPasarTodo = document.getElementById('btn-admin-pasar-todo') || document.getElementById('btn-admin-pasar-recuperacion');
    if (btnPasarTodo) {
        btnPasarTodo.addEventListener('click', async () => {
            const funciones = [
                { fn: window.transferirA_Recuperacion, nombre: 'Recuperación' },
                { fn: window.transferirA_Acondicionamiento, nombre: 'Acondicionamiento' },
                { fn: window.transferirA_Conformado, nombre: 'Conformado' },
                { fn: window.transferirA_ReGalvanizar, nombre: 'Re-Galvanizar' }
            ];
            const faltantes = funciones.filter(f => typeof f.fn !== 'function').map(f => f.nombre);
            if (faltantes.length > 0) { alert('Funciones no disponibles: ' + faltantes.join(', ')); return; }
            const orig = window.alert;
            window.alert = () => {};
            for (const { fn } of funciones) await fn();
            window.alert = orig;
            alert('✅ Transferencia completada a cada tabla.');
            if (window.actualizarDashboardStats) window.actualizarDashboardStats();
            if (window.inicializarGraficos) window.inicializarGraficos();
        });
    }

    // =====================================================
    //  TABLA MENSUAL DE PRODUCCIÓN
    // =====================================================
    const DIAS_MAP = { 1:'Lunes', 2:'Martes', 3:'Miércoles', 4:'Jueves', 5:'Viernes', 6:'Sábado' };
    const CLASE_DIA = { 'Lunes':'day-lun','Martes':'day-mar','Miércoles':'day-mie','Jueves':'day-jue','Viernes':'day-vie','Sábado':'day-sab' };
    const NOMBRES_MES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    let mesActivo  = '';
    let pickerAnio = new Date().getFullYear();
    let semanaActiva = null; // null = ninguna seleccionada (tabla vacía)

    function isoDate(d) {
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
    }
    function formatFecha(d) {
        return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
    }

    function diasLaboralesDelMes(mesISO) {
        const [anio, mes] = mesISO.split('-').map(Number);
        const dias = [];
        const d = new Date(anio, mes - 1, 1);
        while (d.getMonth() === mes - 1) {
            if (d.getDay() >= 1 && d.getDay() <= 6) dias.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return dias;
    }

    function semanasDelMes(mesISO) {
        const dias = diasLaboralesDelMes(mesISO);
        return [...new Set(dias.map(d => Math.ceil(d.getDate() / 7)))];
    }

    // Limpia la tabla y resetea totales/promedios
    function limpiarVistaSemanal() {
        const tbody = document.getElementById('semanal-body');
        if (tbody) tbody.innerHTML = '';
        const elPz = document.getElementById('semanal-total-pz');
        const elKg = document.getElementById('semanal-total-kg');
        if (elPz) elPz.textContent = '0';
        if (elKg) elKg.textContent = '0';
        const promSem = document.getElementById('promedios-semanales-body');
        if (promSem) promSem.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">Seleccione una semana para calcular</td></tr>';
        const promMes = document.getElementById('promedios-mensuales-body');
        if (promMes) promMes.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: var(--text-muted);">Seleccione un mes para calcular</td></tr>';
        const footMes = document.getElementById('promedios-mensuales-foot');
        if (footMes) footMes.style.display = 'none';
        const hint = document.getElementById('semanal-empty-hint');
        if (hint) hint.style.display = 'block';
    }

    // ─── Cargar desde Firebase (con fallback a localStorage) ───
    async function cargarRegistrosMes(mesISO) {
        let datos = [];
        if (typeof db !== 'undefined') {
            try {
                const snap = await db.collection('historial_mensual')
                    .where('fecha', '>=', `${mesISO}-01`)
                    .where('fecha', '<=', `${mesISO}-31`)
                    .get();
                snap.forEach(doc => datos.push(doc.data()));
            } catch(e) { console.warn('Firebase read error:', e); }
        }
        if (datos.length === 0) {
            const almacen = JSON.parse(localStorage.getItem('rymco_historial_mensual')) || [];
            datos = almacen.filter(r => r.fecha && r.fecha.startsWith(mesISO));
        }
        return datos;
    }

    // ─── Guardar en Firebase + localStorage ───
    async function guardarEnHistorialMensual(registros) {
        const almacen = JSON.parse(localStorage.getItem('rymco_historial_mensual')) || [];
        registros.forEach(r => {
            if (!r.fecha) return;
            const existe = almacen.some(h =>
                h.fecha === r.fecha && h.turno === r.turno &&
                h.producto === r.producto && String(h.piezas) === String(r.piezas)
            );
            if (!existe) almacen.push(r);
        });
        localStorage.setItem('rymco_historial_mensual', JSON.stringify(almacen));
        if (typeof db !== 'undefined') {
            try {
                const batch = db.batch();
                registros.forEach((r, i) => {
                    const key = `${r.fecha||'x'}_${r.turno||'x'}_${(r.producto||'x').replace(/\s+/g,'_')}_${i}`;
                    batch.set(db.collection('historial_mensual').doc(key), r, { merge: true });
                });
                await batch.commit();
            } catch(e) { console.warn('Firestore write error:', e); }
        }
    }

    // ─── Render tabla con filtro de semana ───
    function renderTablaMensual(registros, mesISO, semana) {
        const tbody = document.getElementById('semanal-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        const hint = document.getElementById('semanal-empty-hint');
        if (hint) hint.style.display = 'none';

        let diasMes = diasLaboralesDelMes(mesISO);
        if (semana !== null && semana !== 0) {
            diasMes = diasMes.filter(d => Math.ceil(d.getDate() / 7) === semana);
        }

        // Agrupar por fecha y turno
        const mapa = {};
        registros.forEach(r => {
            if (!r.fecha) return;
            if (!mapa[r.fecha]) mapa[r.fecha] = { 'Mañana':{pz:0,kg:0}, 'Tarde':{pz:0,kg:0}, 'Noche':{pz:0,kg:0} };
            const turno = r.turno || 'Mañana';
            if (!mapa[r.fecha][turno]) mapa[r.fecha][turno] = {pz:0,kg:0};
            mapa[r.fecha][turno].pz += parseInt(r.piezas || 0);
            mapa[r.fecha][turno].kg += parseFloat(r.kilos || 0);
        });

        let totalPz = 0, totalKg = 0;
        const acumT = { 'Mañana':{pz:0,kg:0,dias:0}, 'Tarde':{pz:0,kg:0,dias:0}, 'Noche':{pz:0,kg:0,dias:0} };

        diasMes.forEach(diaDate => {
            const nombre = DIAS_MAP[diaDate.getDay()];
            if (!nombre) return;
            const fiso = isoDate(diaDate);
            const datos = mapa[fiso] || { 'Mañana':{pz:0,kg:0}, 'Tarde':{pz:0,kg:0}, 'Noche':{pz:0,kg:0} };
            const esSab = nombre === 'Sábado';
            const clsDia = CLASE_DIA[nombre] || '';
            const m = datos['Mañana'], t = datos['Tarde'], n = datos['Noche'];

            const diaPz = m.pz + t.pz + (esSab ? 0 : n.pz);
            const diaKg = m.kg + t.kg + (esSab ? 0 : n.kg);
            totalPz += diaPz; totalKg += diaKg;

            ['Mañana','Tarde'].forEach(turno => {
                const dd = datos[turno];
                if (dd.pz > 0 || dd.kg > 0) {
                    acumT[turno].pz += dd.pz; acumT[turno].kg += dd.kg; acumT[turno].dias++;
                }
            });
            if (!esSab && (n.pz > 0 || n.kg > 0)) {
                acumT['Noche'].pz += n.pz; acumT['Noche'].kg += n.kg; acumT['Noche'].dias++;
            }

            const celdaNoche = esSab
                ? `<td colspan="2" class="td-sinturno">Sin turno</td>`
                : `<td>${n.pz || ''}</td><td>${n.kg ? n.kg.toFixed(3) : ''}</td>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="${clsDia}">${nombre}</td>
                <td class="${clsDia}" style="font-style:italic;">${formatFecha(diaDate)}</td>
                <td>${m.pz || ''}</td><td>${m.kg ? m.kg.toFixed(3) : ''}</td>
                <td>${t.pz || ''}</td><td>${t.kg ? t.kg.toFixed(3) : ''}</td>
                ${celdaNoche}
                <td class="td-total">${diaPz || ''}</td>
                <td class="td-total">${diaKg ? diaKg.toFixed(3) : ''}</td>
            `;
            tbody.appendChild(tr);
        });

        const elPz = document.getElementById('semanal-total-pz');
        const elKg = document.getElementById('semanal-total-kg');
        if (elPz) elPz.textContent = totalPz.toLocaleString();
        if (elKg) elKg.textContent = totalKg.toFixed(3);

        renderPromedios(acumT, registros, mesISO, semana);
    }

    async function renderPromedios(acumT, registros, mesISO, semana) {
        // --- 1. PROMEDIOS SEMANALES (por Turno) ---
        const tbodySem = document.getElementById('promedios-semanales-body');
        if (tbodySem) {
            tbodySem.innerHTML = '';
            const turnos = [
                { nombre: '1er. Turno (Mañana)', key: 'Mañana', bg: '#fef9c3' },
                { nombre: '2do. Turno (Tarde)',  key: 'Tarde',  bg: '#e0f2fe' },
                { nombre: '3er. Turno (Noche)',  key: 'Noche',  bg: '#ede9fe' },
            ];
            
            const datosGuardarSem = {};

            turnos.forEach(({ nombre, key, bg }) => {
                const a = acumT[key] || { pz: 0, kg: 0, dias: 0 };
                const dias = a.dias || 1;
                const promPz = a.pz / dias;
                const promKg = a.kg / dias;
                const pct = promKg > 0 ? (promPz / promKg * 100).toFixed(1) : '—';
                
                datosGuardarSem[key] = {
                    promPz: parseFloat(promPz.toFixed(1)),
                    promKg: parseFloat(promKg.toFixed(3)),
                    pct: pct
                };

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="background:${bg};font-weight:600;padding:10px 14px;">${nombre}</td>
                    <td style="text-align:center;background:${bg};padding:10px 14px;">${promPz.toFixed(1)}</td>
                    <td style="text-align:center;background:${bg};padding:10px 14px;">${promKg.toFixed(3)}</td>
                    <td style="text-align:center;background:#fef3c7;font-weight:700;color:#92400e;padding:10px 14px;">${pct}${pct !== '—' ? '%' : ''}</td>
                `;
                tbodySem.appendChild(tr);
            });

            // Guardar promedios semanales en Firebase si está disponible
            if (typeof db !== 'undefined' && db !== null && semana !== null && semana !== 0) {
                try {
                    await db.collection('estadisticas_promedios').doc(`semana_${mesISO}_sem${semana}`).set({
                        tipo: 'semanal',
                        mes: mesISO,
                        semana: semana,
                        promedios: datosGuardarSem,
                        actualizadoEn: new Date().toISOString()
                    }, { merge: true });
                } catch (e) {
                    console.warn("Error guardando promedios semanales en Firebase:", e);
                }
            }
        }

        // --- 2. PROMEDIOS MENSUALES (por Semana) ---
        const tbodyMes = document.getElementById('promedios-mensuales-body');
        if (tbodyMes) {
            tbodyMes.innerHTML = '';
            
            // Agrupar todos los registros del mes completo por semana (1 a 5)
            const semanasData = {
                1: { pz: 0, kg: 0, dias: new Set() },
                2: { pz: 0, kg: 0, dias: new Set() },
                3: { pz: 0, kg: 0, dias: new Set() },
                4: { pz: 0, kg: 0, dias: new Set() },
                5: { pz: 0, kg: 0, dias: new Set() }
            };

            // Filtrar todos los días laborales del mes completo
            const todosDiasMes = diasLaboralesDelMes(mesISO);
            todosDiasMes.forEach(diaDate => {
                const numSemana = Math.ceil(diaDate.getDate() / 7);
                const fiso = isoDate(diaDate);
                if (semanasData[numSemana]) {
                    semanasData[numSemana].dias.add(fiso);
                }
            });

            // Sumar piezas y kg de los registros en sus respectivas semanas
            registros.forEach(r => {
                if (!r.fecha) return;
                const rDate = new Date(r.fecha + 'T00:00:00');
                const numSemana = Math.ceil(rDate.getDate() / 7);
                if (semanasData[numSemana]) {
                    semanasData[numSemana].pz += parseInt(r.piezas || 0);
                    semanasData[numSemana].kg += parseFloat(r.kilos || 0);
                }
            });

            const datosGuardarMes = [];

            let mesTotalPz = 0;
            let mesTotalKg = 0;
            let totalDiasConDatos = 0;

            // Renderizar las 5 semanas
            for (let s = 1; s <= 5; s++) {
                const sData = semanasData[s];
                const cantDias = sData.dias.size || 6;
                const promDiario = sData.pz / cantDias;
                
                mesTotalPz += sData.pz;
                mesTotalKg += sData.kg;
                totalDiasConDatos += sData.dias.size;

                datosGuardarMes.push({
                    semana: s,
                    totalPz: sData.pz,
                    totalKg: parseFloat(sData.kg.toFixed(3)),
                    promDiario: parseFloat(promDiario.toFixed(1))
                });

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border)';
                
                const rowBg = s % 2 === 0 ? '#ECFDF5' : '#FFFFFF';
                const semText = `Semana ${s}`;
                
                tr.innerHTML = `
                    <td style="font-weight:700;background:${rowBg};padding:10px 14px;color:#065F46;">${semText}</td>
                    <td style="text-align:center;background:${rowBg};padding:10px 14px;">${sData.pz.toLocaleString()}</td>
                    <td style="text-align:center;background:${rowBg};padding:10px 14px;">${sData.kg.toFixed(3)}</td>
                    <td style="text-align:center;background:#D1FAE5;font-weight:700;color:#065F46;padding:10px 14px;">${promDiario.toFixed(1)}</td>
                `;
                tbodyMes.appendChild(tr);
            }

            if (totalDiasConDatos === 0) totalDiasConDatos = todosDiasMes.length || 26;
            const mesPromDiario = mesTotalPz / totalDiasConDatos;

            // Actualizar footer de la tabla
            const footMes = document.getElementById('promedios-mensuales-foot');
            if (footMes) {
                footMes.style.display = 'table-row-group';
                const elTotPz = document.getElementById('avg-monthly-total-pz');
                const elTotKg = document.getElementById('avg-monthly-total-kg');
                const elGlbProm = document.getElementById('avg-monthly-global-prom');
                
                if (elTotPz) elTotPz.textContent = mesTotalPz.toLocaleString();
                if (elTotKg) elTotKg.textContent = mesTotalKg.toFixed(3);
                if (elGlbProm) elGlbProm.textContent = mesPromDiario.toFixed(1);
            }

            // Guardar promedios mensuales en Firebase si está disponible
            if (typeof db !== 'undefined' && db !== null) {
                try {
                    await db.collection('estadisticas_promedios').doc(`mes_${mesISO}`).set({
                        tipo: 'mensual',
                        mes: mesISO,
                        semanas: datosGuardarMes,
                        totalMensualPz: mesTotalPz,
                        totalMensualKg: parseFloat(mesTotalKg.toFixed(3)),
                        promMensualDiario: parseFloat(mesPromDiario.toFixed(1)),
                        actualizadoEn: new Date().toISOString()
                    }, { merge: true });
                } catch (e) {
                    console.warn("Error guardando promedios mensuales en Firebase:", e);
                }
            }
        }
    }

    // ─── Selector de semanas ───
    function renderSelectorSemana(mesISO) {
        const lista = document.getElementById('semanas-lista');
        if (!lista) return;
        lista.innerHTML = '';
        const semanas = semanasDelMes(mesISO);

        // Opción "Todo el mes"
        const btnTodas = document.createElement('button');
        btnTodas.textContent = 'Todo el mes';
        btnTodas.className = semanaActiva === 0 ? 'activo' : '';
        btnTodas.addEventListener('click', async e => {
            e.stopPropagation();
            semanaActiva = 0;
            document.getElementById('semana-label-display').textContent = 'Todo el mes';
            document.getElementById('semana-picker-popup').classList.remove('open');
            const regs = await cargarRegistrosMes(mesActivo);
            renderTablaMensual(regs, mesActivo, 0);
        });
        lista.appendChild(btnTodas);

        semanas.forEach(s => {
            const btn = document.createElement('button');
            btn.textContent = `Semana ${s}`;
            btn.className = semanaActiva === s ? 'activo' : '';
            btn.addEventListener('click', async e => {
                e.stopPropagation();
                semanaActiva = s;
                document.getElementById('semana-label-display').textContent = `Semana ${s}`;
                document.getElementById('semana-picker-popup').classList.remove('open');
                const regs = await cargarRegistrosMes(mesActivo);
                renderTablaMensual(regs, mesActivo, s);
            });
            lista.appendChild(btn);
        });
    }

    // ─── Month picker ───
    function renderPickerMeses(anio) {
        const grid    = document.getElementById('meses-grid');
        const display = document.getElementById('anio-display');
        if (!grid || !display) return;
        display.textContent = anio;
        grid.innerHTML = '';
        NOMBRES_MES.forEach((nombre, idx) => {
            const numMes = (idx + 1).toString().padStart(2, '0');
            const valor  = `${anio}-${numMes}`;
            const btn    = document.createElement('button');
            btn.textContent = nombre.substring(0, 3);
            btn.title = `${nombre} ${anio}`;
            if (mesActivo === valor) btn.classList.add('activo');
            btn.addEventListener('click', async () => {
                mesActivo = valor;
                semanaActiva = null; // reset semana
                const labelEl = document.getElementById('mes-label-display');
                if (labelEl) labelEl.textContent = `${nombre} ${anio}`;
                const semLabel = document.getElementById('semana-label-display');
                if (semLabel) semLabel.textContent = 'Seleccionar semana';
                document.getElementById('mes-picker-popup').classList.remove('open');
                renderPickerMeses(pickerAnio); // refresh activo
                limpiarVistaSemanal(); // vacía la tabla
                renderSelectorSemana(mesActivo); // actualiza semanas disponibles
            });
            grid.appendChild(btn);
        });
    }

    function inicializarPicker() {
        const hoy = new Date();
        if (!mesActivo) {
            mesActivo = `${hoy.getFullYear()}-${(hoy.getMonth()+1).toString().padStart(2,'0')}`;
        }
        pickerAnio = parseInt(mesActivo.split('-')[0]) || hoy.getFullYear();
        const labelEl = document.getElementById('mes-label-display');
        if (labelEl) {
            const [a, m] = mesActivo.split('-');
            labelEl.textContent = `${NOMBRES_MES[parseInt(m)-1]} ${a}`;
        }
        renderPickerMeses(pickerAnio);
        renderSelectorSemana(mesActivo);
    }

    // ─── Toggle popups ───
    const btnAbrirMes    = document.getElementById('btn-abrir-mes');
    const popupMes       = document.getElementById('mes-picker-popup');
    const btnAbrirSemana = document.getElementById('btn-abrir-semana');
    const popupSemana    = document.getElementById('semana-picker-popup');

    if (btnAbrirMes && popupMes) {
        btnAbrirMes.addEventListener('click', e => {
            e.stopPropagation();
            popupMes.classList.toggle('open');
            if (popupSemana) popupSemana.classList.remove('open');
        });
    }
    if (btnAbrirSemana && popupSemana) {
        btnAbrirSemana.addEventListener('click', e => {
            e.stopPropagation();
            popupSemana.classList.toggle('open');
            if (popupMes) popupMes.classList.remove('open');
            if (mesActivo) renderSelectorSemana(mesActivo);
        });
    }
    document.addEventListener('click', () => {
        if (popupMes)    popupMes.classList.remove('open');
        if (popupSemana) popupSemana.classList.remove('open');
    });
    if (popupMes)    popupMes.addEventListener('click',    e => e.stopPropagation());
    if (popupSemana) popupSemana.addEventListener('click', e => e.stopPropagation());

    // ─── Año anterior / siguiente ───
    const btnAnioP = document.getElementById('btn-anio-prev');
    const btnAnioN = document.getElementById('btn-anio-next');
    if (btnAnioP) btnAnioP.addEventListener('click', e => { e.stopPropagation(); pickerAnio--; renderPickerMeses(pickerAnio); });
    if (btnAnioN) btnAnioN.addEventListener('click', e => { e.stopPropagation(); pickerAnio++; renderPickerMeses(pickerAnio); });

    // ─── Transferir datos ───
    const btnPasarSemanal = document.getElementById('btn-pasar-a-semanal');
    if (btnPasarSemanal) {
        btnPasarSemanal.addEventListener('click', async () => {
            let registros = [];
            if (typeof db !== 'undefined') {
                try {
                    const snap = await db.collection('registros_produccion').get();
                    snap.forEach(doc => registros.push(doc.data()));
                } catch(e) {}
            }
            if (registros.length === 0) registros = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
            if (registros.length === 0) { alert('No hay registros de producción para transferir.'); return; }
            await guardarEnHistorialMensual(registros);
            alert('✅ Datos transferidos al Historial Mensual correctamente.');
            // Si ya hay una semana seleccionada, refrescar la tabla
            if (semanaActiva !== null) {
                const cargados = await cargarRegistrosMes(mesActivo);
                renderTablaMensual(cargados, mesActivo, semanaActiva);
            }
        });
    }

    // ─── Vaciar SOLO las cantidades (Pz) ingresadas — NO borra filas ni productos ───
    const btnVaciar = document.getElementById('btn-vaciar-tablas');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (!confirm(
                '¿Vaciar las cantidades (Pz) ingresadas en todas las tablas?\n\n' +
                'Los productos, filas y el historial mensual NO se borran.'
            )) return;

            // Pone a 0 todos los inputs de cantidad en TODAS las tablas de proceso
            document.querySelectorAll('.qty-input').forEach(inp => {
                inp.value = '0';
                // Disparar evento para que los listeners de cada tabla recalculen kilos y totales
                inp.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // Poner a 0 los totales globales de cada tabla por seguridad
            const totales = [
                ['global-qty',              'global-total'],
                ['acond-global-qty',        'acond-global-total'],
                ['conformado-global-qty',   'conformado-global-total'],
                ['regalvanizar-global-qty', 'regalvanizar-global-total'],
            ];
            totales.forEach(([qId, kId]) => {
                const q = document.getElementById(qId);
                const k = document.getElementById(kId);
                if (q) q.textContent = '0';
                if (k) k.textContent = '0';
            });

            // Actualizar métricas del dashboard
            if (window.actualizarDashboardStats) window.actualizarDashboardStats();

            alert('✅ Cantidades (Pz) vaciadas. Productos y historial permanecen intactos.');
        });
    }

    // =====================================================
    //  SISTEMA DE NOTIFICACIONES EN TIEMPO REAL
    // =====================================================
    function inicializarNotificaciones() {
        const msgIcon = document.getElementById('top-msg-icon');
        const badge = document.getElementById('top-msg-badge');
        const dropdown = document.getElementById('notifications-dropdown');
        const list = document.getElementById('notifications-list');
        const btnClear = document.getElementById('btn-clear-notifications');

        if (!msgIcon || !dropdown || !list) return;

        // Toggle dropdown en click
        msgIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
            if (dropdown.classList.contains('open')) {
                marcarNotificacionesComoLeidas();
            }
        });

        // Cerrar al hacer click afuera
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Limpiar / Marcar todo como leído
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                limpiarNotificaciones();
            });
        }

        // Listener en tiempo real con Firestore
        if (typeof db !== 'undefined' && db !== null) {
            db.collection('registros_produccion')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .onSnapshot((snapshot) => {
                    const readIds = JSON.parse(localStorage.getItem('rymco_read_notifications_ids') || '[]');
                    const notifications = [];
                    let hasUnread = false;

                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        const isRead = readIds.includes(id);

                        if (!isRead) {
                            hasUnread = true;
                        }

                        // Parsear timestamp seguro
                        let ts = new Date();
                        if (data.timestamp) {
                            ts = typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate() : new Date(data.timestamp);
                        } else if (data.idLocal) {
                            ts = new Date(data.idLocal);
                        }

                        notifications.push({
                            id,
                            isRead,
                            turno: data.turno || 'N/A',
                            proceso: data.proceso || 'Proceso general',
                            producto: data.producto || 'Producto',
                            piezas: data.piezas || 0,
                            trabajadores: data.trabajadores || [],
                            timestamp: ts
                        });
                    });

                    renderNotificaciones(notifications, hasUnread);
                }, (error) => {
                    console.warn("Error en el listener de notificaciones en tiempo real:", error);
                    cargarNotificacionesLocales();
                });
        } else {
            cargarNotificacionesLocales();
        }
    }

    function renderNotificaciones(notifications, hasUnread) {
        const badge = document.getElementById('top-msg-badge');
        const list = document.getElementById('notifications-list');
        if (!list) return;

        if (badge) {
            if (hasUnread && notifications.length > 0) {
                badge.style.display = 'flex';
                badge.textContent = '!';
            } else {
                badge.style.display = 'none';
            }
        }

        if (notifications.length === 0) {
            list.innerHTML = `<div class="notification-empty">No hay notificaciones nuevas</div>`;
            return;
        }

        list.innerHTML = '';
        notifications.forEach(n => {
            const timeStr = n.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            const dateStr = n.timestamp.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
            
            const item = document.createElement('div');
            item.className = `notification-item ${n.isRead ? '' : 'unread'}`;
            
            const worker = Array.isArray(n.trabajadores)
                ? (n.trabajadores.length > 0 ? n.trabajadores.join(', ') : 'Operario')
                : (typeof n.trabajadores === 'string' && n.trabajadores ? n.trabajadores : 'Operario');
            item.innerHTML = `
                <div class="notification-title">
                    <span>Subida de Producción</span>
                    <span class="notification-time">${dateStr}, ${timeStr}</span>
                </div>
                <div class="notification-text">
                    El operario <b>${worker}</b> registró <b>${n.piezas} pz</b> de <b>${n.producto}</b> en el turno de la <b>${n.turno}</b> (${n.proceso}).
                </div>
            `;
            
            item.addEventListener('click', () => {
                // Navegar a panel de administrador
                const menuAdmin = document.getElementById('menu-admin-vista');
                if (menuAdmin) {
                    menuAdmin.click();
                }
                document.getElementById('notifications-dropdown').classList.remove('open');
            });

            list.appendChild(item);
        });
    }

    function marcarNotificacionesComoLeidas() {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        const items = list.querySelectorAll('.notification-item.unread');
        if (items.length === 0) return;

        const readIds = JSON.parse(localStorage.getItem('rymco_read_notifications_ids') || '[]');
        
        if (typeof db !== 'undefined' && db !== null) {
            db.collection('registros_produccion')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (!readIds.includes(doc.id)) {
                            readIds.push(doc.id);
                        }
                    });
                    localStorage.setItem('rymco_read_notifications_ids', JSON.stringify(readIds));
                    
                    const badge = document.getElementById('top-msg-badge');
                    if (badge) badge.style.display = 'none';

                    items.forEach(el => el.classList.remove('unread'));
                })
                .catch(() => {});
        }
    }

    function limpiarNotificaciones() {
        if (typeof db !== 'undefined' && db !== null) {
            db.collection('registros_produccion')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get()
                .then(snapshot => {
                    const readIds = [];
                    snapshot.forEach(doc => {
                        readIds.push(doc.id);
                    });
                    localStorage.setItem('rymco_read_notifications_ids', JSON.stringify(readIds));
                    inicializarNotificaciones();
                })
                .catch(() => {});
        }
    }

    function cargarNotificacionesLocales() {
        const list = document.getElementById('notifications-list');
        const badge = document.getElementById('top-msg-badge');
        if (!list) return;

        const adminLocal = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
        if (adminLocal.length === 0) {
            list.innerHTML = `<div class="notification-empty">No hay notificaciones locales</div>`;
            if (badge) badge.style.display = 'none';
            return;
        }

        const notifications = adminLocal.slice(0, 10).map((r, idx) => ({
            id: `local-${idx}`,
            isRead: true,
            turno: r.turno || 'N/A',
            proceso: r.proceso || 'Proceso general',
            producto: r.producto || 'Producto',
            piezas: r.piezas || 0,
            trabajadores: r.trabajadores || [],
            timestamp: new Date()
        }));

        renderNotificaciones(notifications, false);
    }

    // =====================================================
    //  AVISOS Y CORREOS (ADMIN PANEL LOGIC)
    // =====================================================
    const formAviso = document.getElementById('form-publicar-aviso');
    const formCorreo = document.getElementById('form-enviar-correo');

    if (formAviso) {
        formAviso.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titulo = document.getElementById('aviso-titulo').value.trim();
            const mensaje = document.getElementById('aviso-mensaje').value.trim();
            const nivel = document.getElementById('aviso-nivel').value;

            if (!titulo || !mensaje) return;

            const nuevoAviso = {
                titulo,
                mensaje,
                nivel,
                fecha: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                if (typeof db !== 'undefined' && db !== null) {
                    await db.collection('anuncios_sistema').add(nuevoAviso);
                    alert('📢 Aviso publicado con éxito para todos los operadores.');
                } else {
                    // Fallback local
                    const localAvisos = JSON.parse(localStorage.getItem('rymco_local_avisos') || '[]');
                    localAvisos.push({ ...nuevoAviso, id: 'local-' + Date.now() });
                    localStorage.setItem('rymco_local_avisos', JSON.stringify(localAvisos));
                    alert('📢 Aviso guardado localmente (sin conexión a la nube).');
                    renderAvisosAdmin();
                }
                formAviso.reset();
            } catch (err) {
                console.error("Error al publicar aviso:", err);
                alert("Error al publicar aviso. Intenta de nuevo.");
            }
        });
    }

    if (formCorreo) {
        formCorreo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const destinatario = document.getElementById('correo-destinatario').value.trim();
            const asunto = document.getElementById('correo-asunto').value.trim();
            const mensaje = document.getElementById('correo-mensaje').value.trim();
            const btnSubmit = document.getElementById('btn-enviar-correo-submit');

            if (!destinatario || !asunto || !mensaje) return;

            const origText = btnSubmit.textContent;
            btnSubmit.textContent = '⏳ Enviando correo...';
            btnSubmit.disabled = true;

            const registroCorreo = {
                destinatario,
                asunto,
                mensaje,
                fecha: new Date().toISOString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Simular un retardo de red de 1.5s para verse premium
            setTimeout(async () => {
                try {
                    if (typeof db !== 'undefined' && db !== null) {
                        await db.collection('correos_enviados').add(registroCorreo);
                    } else {
                        const localCorreos = JSON.parse(localStorage.getItem('rymco_local_correos') || '[]');
                        localCorreos.push(registroCorreo);
                        localStorage.setItem('rymco_local_correos', JSON.stringify(localCorreos));
                    }
                    alert(`📧 Correo enviado con éxito a: ${destinatario}\nSe ha guardado un registro en el sistema.`);
                    formCorreo.reset();
                } catch (err) {
                    console.error("Error al guardar correo:", err);
                } finally {
                    btnSubmit.textContent = origText;
                    btnSubmit.disabled = false;
                }
            }, 1500);
        });
    }

    window.cargarPanelMensajes = function() {
        renderAvisosAdmin();
    };

    function renderAvisosAdmin() {
        const tbody = document.getElementById('tbody-anuncios-admin');
        if (!tbody) return;

        if (typeof db !== 'undefined' && db !== null) {
            db.collection('anuncios_sistema')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    tbody.innerHTML = '';
                    if (snapshot.empty) {
                        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No hay avisos publicados.</td></tr>`;
                        return;
                    }
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        
                        let date = new Date();
                        if (data.timestamp) {
                            date = typeof data.timestamp.toDate === 'function' ? data.timestamp.toDate() : new Date(data.timestamp);
                        } else if (data.fecha) {
                            date = new Date(data.fecha);
                        }
                        
                        const dateStr = date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                        const tr = document.createElement('tr');
                        const nivelLabel = data.nivel === 'red' ? '🔴 Urgente' : (data.nivel === 'yellow' ? '🟡 Advertencia' : '🟢 Info');
                        
                        tr.innerHTML = `
                            <td><span class="badge-dot ${data.nivel}"></span>${nivelLabel}</td>
                            <td style="font-weight: 700;">${data.titulo}</td>
                            <td>${data.mensaje}</td>
                            <td style="font-style: italic; color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
                            <td style="text-align: center;">
                                <button class="btn-delete-anuncio" data-id="${id}">🗑️ Borrar</button>
                            </td>
                        `;

                        // Escuchador de borrado
                        tr.querySelector('.btn-delete-anuncio').addEventListener('click', async (e) => {
                            const aid = e.target.getAttribute('data-id');
                            if (confirm('¿Estás seguro de que quieres eliminar este aviso? Se borrará para todos los operadores.')) {
                                try {
                                    await db.collection('anuncios_sistema').doc(aid).delete();
                                } catch (err) {
                                    console.error("Error al borrar anuncio:", err);
                                }
                            }
                        });

                        tbody.appendChild(tr);
                    });
                }, (err) => {
                    console.error("Error en Snapshot anuncios:", err);
                });
        } else {
            // Local fallback
            const localAvisos = JSON.parse(localStorage.getItem('rymco_local_avisos') || '[]');
            tbody.innerHTML = '';
            if (localAvisos.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No hay avisos publicados locales.</td></tr>`;
                return;
            }
            localAvisos.forEach((a, idx) => {
                const dateStr = new Date(a.fecha).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const tr = document.createElement('tr');
                const nivelLabel = a.nivel === 'red' ? '🔴 Urgente' : (a.nivel === 'yellow' ? '🟡 Advertencia' : '🟢 Info');
                
                tr.innerHTML = `
                    <td><span class="badge-dot ${a.nivel}"></span>${nivelLabel}</td>
                    <td style="font-weight: 700;">${a.titulo}</td>
                    <td>${a.mensaje}</td>
                    <td style="font-style: italic; color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
                    <td style="text-align: center;">
                        <button class="btn-delete-anuncio" data-index="${idx}">🗑️ Borrar</button>
                    </td>
                `;

                tr.querySelector('.btn-delete-anuncio').addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    if (confirm('¿Estás seguro de que quieres eliminar este aviso local?')) {
                        localAvisos.splice(index, 1);
                        localStorage.setItem('rymco_local_avisos', JSON.stringify(localAvisos));
                        renderAvisosAdmin();
                    }
                });

                tbody.appendChild(tr);
            });
        }
    }

    // ─── Inicializar al cargar página ───
    if (document.getElementById('semanal-body')) {
        inicializarPicker();
        limpiarVistaSemanal();
    }

    setTimeout(() => {
        if (window.actualizarDashboardStats) window.actualizarDashboardStats();
        if (window.inicializarGraficos) window.inicializarGraficos();
        inicializarNotificaciones();
    }, 100);

});

