// js/configuracion.js
// ══════════════════════════════════════════════════════════
//  CONFIGURACION DEL SISTEMA - RYMCO S.A.
//  5 modulos funcionales reales
// ══════════════════════════════════════════════════════════

// Busqueda de modulos
document.getElementById("config-search")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    document.querySelectorAll(".config-module-card").forEach(card => {
        const label = (card.getAttribute("data-label") || "") + " " + (card.innerText || "");
        card.style.display = label.toLowerCase().includes(term) ? "flex" : "none";
    });
});

// Helpers de Modal
window.abrirModal = function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = "flex";
    if (id === "modal-empresa")    cargarDatosEmpresa();
    if (id === "modal-operadores") cargarOperadores();
    if (id === "modal-exportar")   inicializarExportador();
    if (id === "modal-vaciar")     inicializarModalVaciar();
};

window.cerrarModal = function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
};

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("cfg-modal-overlay")) {
        e.target.style.display = "none";
    }
});


// ══════════════════════════════════════════════════════════
//  MODULO 1: DATOS DE LA EMPRESA
// ══════════════════════════════════════════════════════════
function cargarDatosEmpresa() {
    if (typeof db !== "undefined" && db !== null) {
        db.collection("config_empresa").doc("datos").get()
            .then(doc => {
                if (doc.exists) rellenarFormEmpresa(doc.data());
                else rellenarFormEmpresa(JSON.parse(localStorage.getItem("rymco_empresa") || "{}"));
            })
            .catch(() => rellenarFormEmpresa(JSON.parse(localStorage.getItem("rymco_empresa") || "{}")));
    } else {
        rellenarFormEmpresa(JSON.parse(localStorage.getItem("rymco_empresa") || "{}"));
    }
}

function rellenarFormEmpresa(data) {
    if (!data) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
    set("emp-nombre",    data.nombre);
    set("emp-rfc",       data.rfc);
    set("emp-telefono",  data.telefono);
    set("emp-direccion", data.direccion);
    set("emp-correo",    data.correo);
}

window.guardarDatosEmpresa = async function() {
    const datos = {
        nombre:    document.getElementById("emp-nombre")?.value.trim()    || "",
        rfc:       document.getElementById("emp-rfc")?.value.trim()       || "",
        telefono:  document.getElementById("emp-telefono")?.value.trim()  || "",
        direccion: document.getElementById("emp-direccion")?.value.trim() || "",
        correo:    document.getElementById("emp-correo")?.value.trim()    || "",
        actualizadoEn: new Date().toISOString()
    };

    localStorage.setItem("rymco_empresa", JSON.stringify(datos));

    if (typeof db !== "undefined" && db !== null) {
        try {
            await db.collection("config_empresa").doc("datos").set(datos);
            mostrarToast("Datos de empresa guardados correctamente.", "ok");
        } catch (err) {
            console.error("Error al guardar en Firestore:", err);
            mostrarToast("Guardado localmente (sin conexion a la nube).", "warn");
        }
    } else {
        mostrarToast("Datos guardados localmente.", "ok");
    }
    cerrarModal("modal-empresa");
};


// ══════════════════════════════════════════════════════════
//  MODULO 2: GESTION DE OPERADORES
// ══════════════════════════════════════════════════════════
function cargarOperadores() {
    const tbody = document.getElementById("tbody-operadores");
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px; color:var(--text-muted);'>Cargando...</td></tr>";

    if (typeof db !== "undefined" && db !== null) {
        db.collection("operadores").orderBy("nombre").onSnapshot(snapshot => {
            tbody.innerHTML = "";
            if (snapshot.empty) {
                tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;'>No hay operadores registrados.</td></tr>";
                return;
            }
            snapshot.forEach(doc => {
                const d = doc.data();
                const activo = d.activo !== false;
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border)";
                tr.innerHTML = `
                    <td style="padding:10px 14px; font-size:0.85rem; font-weight:600;">${d.nombre}</td>
                    <td style="padding:10px 14px; font-size:0.85rem;">${d.turno || "Manana"}</td>
                    <td style="padding:10px 14px;">
                        <span style="display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; background:${activo ? "#DCFCE7" : "#FEE2E2"}; color:${activo ? "#15803D" : "#DC2626"};">
                            ${activo ? "Activo" : "Inactivo"}
                        </span>
                    </td>
                    <td style="padding:10px 14px; text-align:center;">
                        <button onclick="toggleOperador('${doc.id}', ${activo})" style="background:transparent; border:1px solid ${activo ? "#EF4444" : "#22C55E"}; color:${activo ? "#EF4444" : "#22C55E"}; padding:5px 10px; border-radius:6px; font-size:0.73rem; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif;">
                            ${activo ? "Dar de Baja" : "Activar"}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    } else {
        const ops = JSON.parse(localStorage.getItem("rymco_operadores") || "[]");
        tbody.innerHTML = "";
        if (ops.length === 0) {
            tbody.innerHTML = "<tr><td colspan='4' style='text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem;'>No hay operadores locales.</td></tr>";
            return;
        }
        ops.forEach((op, idx) => {
            const activo = op.activo !== false;
            const tr = document.createElement("tr");
            tr.style.borderBottom = "1px solid var(--border)";
            tr.innerHTML = `
                <td style="padding:10px 14px; font-size:0.85rem; font-weight:600;">${op.nombre}</td>
                <td style="padding:10px 14px; font-size:0.85rem;">${op.turno || "Manana"}</td>
                <td style="padding:10px 14px;"><span style="padding:3px 10px; border-radius:20px; font-size:0.75rem; font-weight:700; background:${activo ? "#DCFCE7" : "#FEE2E2"}; color:${activo ? "#15803D" : "#DC2626"};">${activo ? "Activo" : "Inactivo"}</span></td>
                <td style="padding:10px 14px; text-align:center;"><button onclick="toggleOperadorLocal(${idx})" style="background:transparent; border:1px solid ${activo ? "#EF4444" : "#22C55E"}; color:${activo ? "#EF4444" : "#22C55E"}; padding:5px 10px; border-radius:6px; font-size:0.73rem; font-weight:600; cursor:pointer; font-family:'Outfit',sans-serif;">${activo ? "Dar de Baja" : "Activar"}</button></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

window.agregarOperador = async function() {
    const nombre = document.getElementById("op-nombre")?.value.trim();
    const turno  = document.getElementById("op-turno")?.value || "Manana";

    if (!nombre) { mostrarToast("Escribe el nombre del operador.", "warn"); return; }

    const nuevoOp = { nombre, turno, activo: true, creadoEn: new Date().toISOString() };

    if (typeof db !== "undefined" && db !== null) {
        try {
            await db.collection("operadores").add(nuevoOp);
            mostrarToast("Operador " + nombre + " agregado al sistema.", "ok");
            document.getElementById("op-nombre").value = "";
        } catch (err) {
            console.error("Error agregando operador:", err);
            mostrarToast("Error al agregar operador.", "error");
        }
    } else {
        const ops = JSON.parse(localStorage.getItem("rymco_operadores") || "[]");
        ops.push(nuevoOp);
        localStorage.setItem("rymco_operadores", JSON.stringify(ops));
        mostrarToast("Operador " + nombre + " guardado localmente.", "ok");
        document.getElementById("op-nombre").value = "";
        cargarOperadores();
    }
};

window.toggleOperador = async function(docId, isActivo) {
    if (typeof db !== "undefined" && db !== null) {
        try {
            await db.collection("operadores").doc(docId).update({ activo: !isActivo });
            mostrarToast(isActivo ? "Operador dado de baja." : "Operador reactivado.", "ok");
        } catch(err) { console.error("Error actualizando operador:", err); }
    }
};

window.toggleOperadorLocal = function(index) {
    const ops = JSON.parse(localStorage.getItem("rymco_operadores") || "[]");
    if (ops[index] !== undefined) {
        ops[index].activo = !ops[index].activo;
        localStorage.setItem("rymco_operadores", JSON.stringify(ops));
        cargarOperadores();
    }
};


// ══════════════════════════════════════════════════════════
//  MODULO 3: EXPORTAR A CSV
// ══════════════════════════════════════════════════════════
function inicializarExportador() {
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    document.getElementById("export-desde").value = primerDia.toISOString().split("T")[0];
    document.getElementById("export-hasta").value = hoy.toISOString().split("T")[0];

    ["export-tipo","export-desde","export-hasta"].forEach(id => {
        document.getElementById(id)?.addEventListener("change", previsualizarExport);
    });
    previsualizarExport();
}

async function previsualizarExport() {
    const tipo  = document.getElementById("export-tipo")?.value;
    const desde = document.getElementById("export-desde")?.value;
    const hasta = document.getElementById("export-hasta")?.value;
    const preview = document.getElementById("export-preview");
    const counter = document.getElementById("export-count");
    if (!tipo || !desde || !hasta || typeof db === "undefined" || db === null) return;

    try {
        const snap = await db.collection(tipo)
            .where("fecha", ">=", desde)
            .where("fecha", "<=", hasta + "z")
            .get();
        if (preview) preview.style.display = "block";
        if (counter) counter.textContent = snap.size;
    } catch(err) {
        if (preview) preview.style.display = "block";
        if (counter) counter.textContent = "?";
    }
}

window.exportarCSV = async function() {
    const tipo  = document.getElementById("export-tipo")?.value;
    const desde = document.getElementById("export-desde")?.value;
    const hasta = document.getElementById("export-hasta")?.value;
    const btn   = document.getElementById("btn-exportar-csv");

    if (!tipo || !desde || !hasta) {
        mostrarToast("Completa el tipo de datos y el rango de fechas.", "warn");
        return;
    }

    const origText = btn?.textContent;
    if (btn) { btn.textContent = "Generando..."; btn.disabled = true; }

    let rows = [];

    if (typeof db !== "undefined" && db !== null) {
        try {
            const snap = await db.collection(tipo)
                .where("fecha", ">=", desde)
                .where("fecha", "<=", hasta + "z")
                .orderBy("fecha", "asc")
                .get();
            snap.forEach(doc => { rows.push({ id: doc.id, ...doc.data() }); });
        } catch(err) {
            console.error("Error al obtener datos para exportar:", err);
            mostrarToast("Error al obtener datos de Firestore.", "error");
            if (btn) { btn.textContent = origText; btn.disabled = false; }
            return;
        }
    } else {
        rows = JSON.parse(localStorage.getItem("rymco_" + tipo) || "[]");
    }

    if (rows.length === 0) {
        mostrarToast("No hay registros en el rango de fechas seleccionado.", "warn");
        if (btn) { btn.textContent = origText; btn.disabled = false; }
        return;
    }

    const keys = [...new Set(rows.flatMap(r => Object.keys(r)))].filter(k => k !== "timestamp");
    const header = keys.join(",");
    const csvRows = rows.map(row =>
        keys.map(k => {
            const val = row[k];
            if (val === null || val === undefined) return "";
            if (typeof val === "object") return '"' + JSON.stringify(val).replace(/"/g, '""') + '"';
            return '"' + String(val).replace(/"/g, '""') + '"';
        }).join(",")
    );

    const csvContent = "\uFEFF" + [header, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "RYMCO_" + tipo + "_" + desde + "_al_" + hasta + ".csv";
    link.click();
    URL.revokeObjectURL(url);

    mostrarToast("Archivo CSV descargado: " + rows.length + " registros.", "ok");
    if (btn) { btn.textContent = origText; btn.disabled = false; }
    cerrarModal("modal-exportar");
};


// ══════════════════════════════════════════════════════════
//  MODULO 4: CAMBIAR CONTRASENA (Firebase Auth)
// ══════════════════════════════════════════════════════════
window.cambiarContrasena = async function() {
    const actual    = document.getElementById("pwd-actual")?.value;
    const nueva     = document.getElementById("pwd-nueva")?.value;
    const confirmar = document.getElementById("pwd-confirmar")?.value;
    const msgEl     = document.getElementById("pwd-mensaje");
    const btn       = document.getElementById("btn-cambiar-pwd");

    const mostrarMensaje = (texto, tipo) => {
        if (!msgEl) return;
        msgEl.style.display = "block";
        msgEl.textContent   = texto;
        msgEl.style.background = tipo === "error" ? "#FEE2E2" : (tipo === "ok" ? "#DCFCE7" : "#FEF9C3");
        msgEl.style.color      = tipo === "error" ? "#DC2626" : (tipo === "ok" ? "#15803D" : "#92400E");
    };

    if (!actual || !nueva || !confirmar) { mostrarMensaje("Completa todos los campos.", "warn"); return; }
    if (nueva.length < 6) { mostrarMensaje("La nueva contrasena debe tener al menos 6 caracteres.", "warn"); return; }
    if (nueva !== confirmar) { mostrarMensaje("Las contrasenas nuevas no coinciden.", "error"); return; }

    if (typeof firebase === "undefined" || !firebase.auth) {
        mostrarMensaje("Firebase Auth no disponible.", "error");
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) { mostrarMensaje("No hay sesion activa. Recarga la pagina.", "error"); return; }

    const origText = btn?.textContent;
    if (btn) { btn.textContent = "Actualizando..."; btn.disabled = true; }

    try {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, actual);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(nueva);
        mostrarMensaje("Contrasena actualizada exitosamente.", "ok");
        ["pwd-actual","pwd-nueva","pwd-confirmar"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
        setTimeout(() => cerrarModal("modal-password"), 2000);
    } catch(err) {
        console.error("Error al cambiar contrasena:", err);
        if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
            mostrarMensaje("La contrasena actual es incorrecta.", "error");
        } else if (err.code === "auth/too-many-requests") {
            mostrarMensaje("Demasiados intentos. Espera unos minutos.", "warn");
        } else {
            mostrarMensaje("Error: " + err.message, "error");
        }
    } finally {
        if (btn) { btn.textContent = origText; btn.disabled = false; }
    }
};


// ══════════════════════════════════════════════════════════
//  MODULO 5: VACIAR DATOS (confirmacion doble)
// ══════════════════════════════════════════════════════════
function inicializarModalVaciar() {
    const input = document.getElementById("vaciar-confirm-input");
    const btn   = document.getElementById("btn-vaciar-confirm");
    if (!input || !btn) return;

    input.value = "";
    btn.disabled = true;
    btn.style.opacity = "0.4";
    btn.style.cursor  = "not-allowed";

    input.oninput = () => {
        const ok = input.value.trim().toUpperCase() === "VACIAR";
        btn.disabled = !ok;
        btn.style.opacity = ok ? "1" : "0.4";
        btn.style.cursor  = ok ? "pointer" : "not-allowed";
    };
}

window.ejecutarVaciarDatos = function() {
    const input = document.getElementById("vaciar-confirm-input");
    if (!input || input.value.trim().toUpperCase() !== "VACIAR") return;

    const keysABorrar = Object.keys(localStorage).filter(k => k.startsWith("rymco_") || k.startsWith("bitacora_"));
    keysABorrar.forEach(k => localStorage.removeItem(k));

    cerrarModal("modal-vaciar");
    mostrarToast("Todos los datos locales fueron eliminados. Recargando...", "warn");
    setTimeout(() => location.reload(), 2500);
};


// ══════════════════════════════════════════════════════════
//  HELPER: Toast de notificacion
// ══════════════════════════════════════════════════════════
function mostrarToast(mensaje, tipo) {
    tipo = tipo || "ok";
    let toast = document.getElementById("cfg-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cfg-toast";
        toast.style.cssText = "position:fixed; bottom:24px; right:24px; z-index:99999; padding:14px 20px; border-radius:12px; font-family:'Outfit',sans-serif; font-size:0.9rem; font-weight:600; max-width:360px; box-shadow:0 10px 30px rgba(0,0,0,0.2); transition:all 0.3s; opacity:0; transform:translateY(10px);";
        document.body.appendChild(toast);
    }
    const colors = {
        ok:    { bg: "#DCFCE7", color: "#15803D", border: "#86EFAC" },
        error: { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" },
        warn:  { bg: "#FEF9C3", color: "#92400E", border: "#FDE68A" },
    };
    const c = colors[tipo] || colors.ok;
    toast.style.background = c.bg;
    toast.style.color      = c.color;
    toast.style.border     = "1.5px solid " + c.border;
    toast.textContent      = mensaje;
    toast.style.opacity    = "1";
    toast.style.transform  = "translateY(0)";

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity   = "0";
        toast.style.transform = "translateY(10px)";
    }, 3500);
}
