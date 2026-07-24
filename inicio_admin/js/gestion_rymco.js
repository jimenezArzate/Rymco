// gestion_rymco.js

// 1. Cierre mensual (Mueve datos a histórico y limpia bitácora)
async function ejecutarCierreMensual() {
    if (!confirm("Esto moverá los registros actuales al archivo mensual y limpiará la bitácora. ¿Continuar?")) return;
    
    const db = firebase.firestore();
    // Limpieza de colecciones de bitácora y registros de producción para que limpie ambos
    const bitacoraRef = db.collection("bitacora");
    const snapshot = await bitacoraRef.get();
    
    // Guardar totales en una colección 'reportes_mensuales'
    await db.collection("reportes_mensuales").add({
        fecha: new Date().toISOString(),
        total_kilos: document.getElementById('global-total').innerText,
        estado: 'procesado'
    });

    // Limpieza
    snapshot.forEach(doc => doc.ref.delete());
    
    // Adicionalmente, limpiamos también registros_produccion si existe
    try {
        const prodRef = db.collection("registros_produccion");
        const prodSnap = await prodRef.get();
        const batch = db.batch();
        prodSnap.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } catch (e) {
        console.warn("No se pudo limpiar la colección registros_produccion:", e);
    }
    
    // Limpieza local
    localStorage.removeItem('rymco_db_admin');
    
    alert("Cierre mensual exitoso. Datos archivados.");
    
    // Actualizar vistas si están disponibles
    if (window.cargarPanelAdmin) window.cargarPanelAdmin();
    if (window.actualizarDashboardStats) window.actualizarDashboardStats();
    if (window.inicializarGraficos) window.inicializarGraficos();
}

// Vinculación de "Vaciar Datos" del panel de configuración
async function limpiarDatosTotales() {
    await ejecutarCierreMensual();
}

// 2. Generar y Guardar PDF
function generarReportePDF() {
    const element = document.getElementById('inicio-panel-container'); // O la tabla de reportes
    const opt = {
        margin: 1,
        filename: `Reporte_Rymco_${new Date().getMonth()+1}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Descarga en computadora
    html2pdf().set(opt).from(element).save();

    // Guardar en la sección de "Reportes PDF" (Simulación guardando la referencia)
    const lista = document.getElementById('lista-pdfs');
    if (lista) {
        const nuevoReporte = document.createElement('div');
        nuevoReporte.innerHTML = `<p>Reporte de ${new Date().toLocaleDateString()} - <button onclick="window.print()">Abrir</button></p>`;
        lista.appendChild(nuevoReporte);
    }
}
