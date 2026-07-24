// ─── Tabla de productos (compartida por los 4 módulos) ───────────────────────
const tablaGlobalProductos = [
    { producto: '3/4" verde', valor: 1.672 },
    { producto: '1/2" verde', valor: 1.262 },
    { producto: '1" Verde', valor: 3.2 },
    { producto: '1 1/4" verde', valor: 4.135 },
    { producto: '1 1/2" verde', valor: 4.91 },
    { producto: '2" verde', valor: 6.24 },
    { producto: '3 1/2" Verde', valor: 15.84 },
    { producto: '4" Verde', valor: 17.83 },
    { producto: '3" verde', valor: 11.93 },
    { producto: '3" Amarilla', valor: 19.267 },
    { producto: '3/4" Amarilla', valor: 2.721 },
    { producto: '1/2" Amarilla', valor: 2.154 },
    { producto: '2" Amarilla', valor: 9.379 },
    { producto: '4" Amarilla', valor: 24.992 },
    { producto: '1" Amarilla', valor: 4.143 },
    { producto: '1 1/4" Amarilla', valor: 5.254 },
    { producto: '1½" Amarilla', valor: 6.2 },
    { producto: '1½" azul', valor: 0.9 },
    { producto: '1/2 PVC Pesado', valor: 0.49 },
    { producto: '3/4" PVC Pesado', valor: 0.61 },
    { producto: '1" PVC Pesado', valor: 0.78 },
    { producto: '2" PVC Pesado', valor: 2.1 },
    { producto: '2 1/2" PVC Pesado', valor: 3.1 },
    { producto: '3" PVC Pesado', valor: 2.15 },
    { producto: '4" PVC Pesado', valor: 5.3 },
    { producto: '1 1/4" PVC Pesado', valor: 1.05 },
    { producto: '1 1/2" PVC Pesado', valor: 1.45 },
    { producto: '1" PVC LIGERO', valor: 0.49 },
    { producto: 'PVC LIGERO 1/2"', valor: 0.24 },
    { producto: '3/4" PVC LIGERO', valor: 0.24 },
    { producto: '1 1/2" PVC LIGERO', valor: 0.32 },
    { producto: '1 1/4" PVC LIGERO', valor: 0.74 },
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

// ─── Helpers para leer datos de producción (Firebase + localStorage) ──────────
async function leerDatosAdmin() {
    let datos = [];
    if (typeof db !== 'undefined') {
        try {
            const snap = await db.collection('registros_produccion').get();
            snap.forEach(doc => datos.push(doc.data()));
        } catch(e) {}
    }
    if (datos.length === 0) {
        datos = JSON.parse(localStorage.getItem('rymco_db_admin')) || [];
    }
    return datos;
}

// ─── Módulo genérico: inyecta tabla + calcula + guarda + carga ─────────────────
function crearModulo({ tbodyId, prefix, materiales, storageKey, firestoreDoc, validProcesos, tabTarget }) {
    const tbody = document.getElementById(tbodyId);

    // Inyectar filas
    if (tbody) {
        materiales.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.producto}</td>
                <td style="text-align:center;">
                    <input type="number" class="qty-input" id="${prefix}-qty-${index}" min="0" value="0" style="width:60px;">
                </td>
                <td class="numeric" id="${prefix}-kg-${index}">0</td>
            `;
            tbody.appendChild(tr);

            const inp = document.getElementById(`${prefix}-qty-${index}`);
            if (inp) inp.addEventListener('input', () => calcFila(index));
        });
    }

    function calcFila(index) {
        const qty = parseFloat(document.getElementById(`${prefix}-qty-${index}`)?.value) || 0;
        const kg  = Math.round(materiales[index].valor * qty);
        const kdEl = document.getElementById(`${prefix}-kg-${index}`);
        if (kdEl) kdEl.innerText = kg;
        calcGlobal();
        guardar();
    }

    function calcGlobal() {
        let totPz = 0, totKg = 0;
        materiales.forEach((item, i) => {
            const qty = parseFloat(document.getElementById(`${prefix}-qty-${i}`)?.value) || 0;
            totPz += qty;
            totKg += item.valor * qty;
        });
        const elQty = document.getElementById(`${prefix}-global-qty`);
        const elTot = document.getElementById(`${prefix}-global-total`);
        if (elQty) elQty.innerText = totPz;
        if (elTot) elTot.innerText = Math.round(totKg);
    }

    async function guardar() {
        const estado = [];
        materiales.forEach((_, i) => {
            const qty = parseFloat(document.getElementById(`${prefix}-qty-${i}`)?.value) || 0;
            if (qty > 0) estado.push({ index: i, qty });
        });
        localStorage.setItem(storageKey, JSON.stringify(estado));
        if (typeof db !== 'undefined') {
            try {
                await db.collection('configuraciones').doc(firestoreDoc).set({
                    estado,
                    ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch(e) {}
        }
        if (window.actualizarDashboardStats) window.actualizarDashboardStats();
        if (prefix === 'historial' && window.actualizarPanelRecuperacion) window.actualizarPanelRecuperacion();
    }

    async function cargar() {
        let estado = null;
        if (typeof db !== 'undefined') {
            try {
                const snap = await db.collection('configuraciones').doc(firestoreDoc).get();
                if (snap.exists) estado = snap.data().estado;
            } catch(e) {}
        }
        if (!estado) estado = JSON.parse(localStorage.getItem(storageKey)) || [];
        estado.forEach(item => {
            const inp = document.getElementById(`${prefix}-qty-${item.index}`);
            if (inp) {
                inp.value = item.qty || 0;
                const kdEl = document.getElementById(`${prefix}-kg-${item.index}`);
                if (kdEl) kdEl.innerText = Math.round(materiales[item.index].valor * item.qty);
            }
        });
        calcGlobal();
        if (window.actualizarDashboardStats) window.actualizarDashboardStats();
        if (prefix === 'historial' && window.actualizarPanelRecuperacion) window.actualizarPanelRecuperacion();
    }

    // Exponer función de transferencia global
    const fnName = `transferirA_${prefix.charAt(0).toUpperCase() + prefix.slice(1)}`;
    window[fnName] = async function() {
        const datos = await leerDatosAdmin();
        if (datos.length === 0) { alert('No hay datos en Registro de Producción.'); return; }

        let transferidos = 0;
        datos.filter(r => validProcesos.includes(r.proceso)).forEach(registro => {
            const idx = materiales.findIndex(m =>
                m.producto.toLowerCase().trim() === (registro.producto || '').toLowerCase().trim()
            );
            if (idx !== -1) {
                const inp = document.getElementById(`${prefix}-qty-${idx}`);
                if (inp) {
                    inp.value = parseFloat(inp.value || 0) + parseInt(registro.piezas || 0);
                    calcFila(idx);
                    transferidos++;
                }
            }
        });

        if (transferidos > 0) {
            alert(`✅ Transferencia exitosa (${transferidos} producto(s) actualizados).`);
            document.querySelector(`.historial-tab-btn[data-tab="${tabTarget}"]`)?.click();
        } else {
            alert('No se encontraron registros que coincidan con el proceso/productos de este módulo.');
        }
    };

    // Inicializar
    cargar();
}

// ─── DOMContentLoaded ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Recuperación → proceso "Selección, Limpieza, Flejado y Empaque"
    // El ID prefix debe coincidir con los IDs del HTML:
    //   inventory-body, historial-qty-N, historial-kg-N, global-qty, global-total
    // Se usa prefix="historial" para Recuperación (IDs heredados)
    crearModulo({
        tbodyId:      'inventory-body',
        prefix:       'historial',
        materiales:   tablaGlobalProductos,
        storageKey:   'rymco_recuperacion_db',
        firestoreDoc: 'estado_recuperacion',
        validProcesos:['Selección, Limpieza, Flejado y Empaque'],
        tabTarget:    'tab-recuperacion'
    });

    // Acondicionamiento → "Preparación y/o Acondicionamiento de venta"
    crearModulo({
        tbodyId:      'acondicionamiento-body',
        prefix:       'acond',
        materiales:   tablaGlobalProductos,
        storageKey:   'rymco_acondicionamiento_db',
        firestoreDoc: 'estado_acondicionamiento',
        validProcesos:['Preparación y/o Acondicionamiento de venta'],
        tabTarget:    'tab-tabla1'
    });

    // Conformado → "Conformado, Rimado y Pintura"
    crearModulo({
        tbodyId:      'conformado-body',
        prefix:       'conformado',
        materiales:   tablaGlobalProductos,
        storageKey:   'rymco_conformado_db',
        firestoreDoc: 'estado_conformado',
        validProcesos:['Conformado, Rimado y Pintura'],
        tabTarget:    'tab-tabla2'
    });

    // Re-Galvanizar → "Selección de tubo para re-galvanizar"
    crearModulo({
        tbodyId:      'regalvanizar-body',
        prefix:       'regalvanizar',
        materiales:   tablaGlobalProductos,
        storageKey:   'rymco_regalvanizar_db',
        firestoreDoc: 'estado_regalvanizar',
        validProcesos:['Selección de tubo para re-galvanizar'],
        tabTarget:    'tab-tabla3'
    });

});