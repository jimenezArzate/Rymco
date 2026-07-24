// --- CONFIGURACIÓN SEGURA PARA ENTORNOS RESTRINGIDOS ---
(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyCcFuYAGsTLgsJHPlnt0NI9OXOxsCqE8dA",
        authDomain: "rymco-9a16f.firebaseapp.com",
        projectId: "rymco-9a16f",
        storageBucket: "rymco-9a16f.firebasestorage.app",
        messagingSenderId: "382775054886",
        appId: "1:382775054886:web:92883e4dfa459b1c014ce7",
        measurementId: "G-F498TSENVT"
    };

    // PROTECCIÓN: Solo inicializar si firebase existe y no ha sido inicializado
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Definición segura de la base de datos
    window.db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

    if (!window.db) {
        console.warn("Firebase no cargó: Trabajando en modo local (sin nube).");
    }
})();