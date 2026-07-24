// 1. VISIBILIDAD DE CONTRASEÑA INTERACTIVA
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');

togglePasswordBtn.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Ocultar';
    } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Mostrar';
    }
    passwordInput.focus(); 
});

// 2. DETECCIÓN Y REDIRECCIÓN AUTOMÁTICA DE ROLES
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.style.display = 'none';

    // SI INICIA COMO ADMINISTRADOR
    if (username === 'admin') {
        if (password === 'admin123') {
            window.location.href = 'inicio_admin/bienvenidoadmin.html';
        } else {
            showError('La contraseña del Administrador es incorrecta.');
        }
    
    // SI INICIA COMO USUARIO
    } else if (username === 'usuario') {
        if (password === 'user123') {
            window.location.href = 'inicio_usuario/bienvenidouser.html';
        } else {
            showError('La contraseña del Usuario es incorrecta.');
        }
    } else {
        showError('Este miembro o correo no se encuentra registrado.');
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}