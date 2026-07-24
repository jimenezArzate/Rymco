// ==========================================================================
// CONTROLADOR DE RESPALDO REAL DE PROCESOS Y RECUPERACIÓN - EMPRESA RYMCO
// ==========================================================================

const RECUPERACION_STORAGE_KEY = 'rymco_recuperacion_db';

function obtenerKilosRecuperacionActiva() {
    const datosRecuperacionActiva = JSON.parse(localStorage.getItem(RECUPERACION_STORAGE_KEY)) || [];
    return datosRecuperacionActiva.map(item => {
        const producto = (window.tablaGlobalProductos && window.tablaGlobalProductos[item.index]) ? window.tablaGlobalProductos[item.index].producto : 'Producto';
        const valor = (window.tablaGlobalProductos && window.tablaGlobalProductos[item.index]) ? window.tablaGlobalProductos[item.index].valor : 0;
        const piezas = parseFloat(item.qty) || 0;
        return {
            producto,
            piezas,
            kilos: Math.round(valor * piezas),
            seccion: 'Recuperación'
        };
    });
}

function actualizarPanelRecuperacion() {
    const resumenKgEl = document.getElementById('recuperacion-actual-kilos');
    if (!resumenKgEl) return;

    const datosActivos = obtenerKilosRecuperacionActiva();
    const totalKilos = datosActivos.reduce((sum, item) => sum + item.kilos, 0);
    resumenKgEl.textContent = `${Math.round(totalKilos)} kg`;
}

function procesarRespaldoAdmin() {
    const mesSeleccionado = document.getElementById('respaldo-mes').value;
    const semanaSeleccionada = document.getElementById('respaldo-semana').value;

    const datosRecuperacionActiva = obtenerKilosRecuperacionActiva();

    if (datosRecuperacionActiva.length === 0) {
        alert("Atención: No se encontraron datos reales en la tabla operativa de Procesos y Recuperación para transferir.");
        return;
    }

    const idHistorico = `rymco_historial_${mesSeleccionado}_${semanaSeleccionada.replace(/\s+/g, '')}`.toLowerCase();
    let almacenamientoHistoricoAdmin = JSON.parse(localStorage.getItem('rymco_historico_admin_global')) || {};

    almacenamientoHistoricoAdmin[idHistorico] = {
        mes: mesSeleccionado,
        semana: semanaSeleccionada,
        fechaDeCierre: new Date().toLocaleString(),
        registrosGuardados: datosRecuperacionActiva
    };

    localStorage.setItem('rymco_historico_admin_global', JSON.stringify(almacenamientoHistoricoAdmin));

    alert(`Éxito: La tabla de recuperación se ha guardado correctamente con ${datosRecuperacionActiva.length} registros y ${datosRecuperacionActiva.reduce((sum, item) => sum + item.kilos, 0)} kg.`);
    actualizarSelectorDeArchivos();
}

function actualizarSelectorDeArchivos() {
    const selector = document.getElementById('selector-historico-admin');
    if (!selector) return;

    const almacenamientoHistoricoAdmin = JSON.parse(localStorage.getItem('rymco_historico_admin_global')) || {};
    selector.innerHTML = '<option value="">-- Selecciona una semana guardada para revisar --</option>';

    Object.keys(almacenamientoHistoricoAdmin).forEach(clave => {
        const item = almacenamientoHistoricoAdmin[clave];
        const option = document.createElement('option');
        option.value = clave;
        option.textContent = `${item.mes} - ${item.semana} (Cierre: ${item.fechaDeCierre})`;
        selector.appendChild(option);
    });
}

function cargarTablaHistoricaAdmin() {
    const claveArchivo = document.getElementById('selector-historico-admin').value;
    const tbody = document.querySelector('#tabla-archivo-recuperacion tbody');
    if (!tbody) return;

    if (!claveArchivo) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #777;">Selecciona una semana archivada para visualizar el histórico de recuperación.</td></tr>';
        return;
    }

    const almacenamientoHistoricoAdmin = JSON.parse(localStorage.getItem('rymco_historico_admin_global')) || {};
    const archivoSemana = almacenamientoHistoricoAdmin[claveArchivo];

    tbody.innerHTML = '';
    if (archivoSemana && archivoSemana.registrosGuardados.length > 0) {
        archivoSemana.registrosGuardados.forEach(fila => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #eee';
            tr.innerHTML = `
                <td style="padding: 10px; border: 1px solid #dee2e6;">${fila.producto || fila.nombre || 'N/A'}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">${fila.piezas || 0}</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; color: #2e7d32;">${fila.kilos || 0} kg</td>
                <td style="padding: 10px; border: 1px solid #dee2e6; color: #666;">${fila.seccion || 'Recuperación'}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #d32f2f;">El archivo seleccionado no contiene registros válidos.</td></tr>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarSelectorDeArchivos();
    actualizarPanelRecuperacion();
});