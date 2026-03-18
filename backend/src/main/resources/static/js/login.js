document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn  = document.getElementById('loginBtn');
    const btnText   = document.getElementById('btnText');
    const togglePwd = document.getElementById('togglePwd');
    const eyeIcon   = document.getElementById('eyeIcon');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePwd) {
        togglePwd.addEventListener('click', () => {
            const isHidden = passwordInput.type === 'password';
            passwordInput.type = isHidden ? 'text' : 'password';
            eyeIcon.className = isHidden ? 'ph ph-eye-slash' : 'ph ph-eye';
        });
    }

    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email    = document.getElementById('email').value;
        const password = passwordInput.value;
        
        // Get selected role
        const roleInput = document.querySelector('input[name="userRole"]:checked');
        const role = roleInput ? roleInput.value : 'admin';

        // Show loading state
        loginBtn.disabled = true;
        btnText.textContent = 'Entrando...';

        // Simulate API call (for prototype)
        setTimeout(() => {
            if (email && password.length >= 4) {
                if (role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'student-dashboard.html';
                }
            } else {
                loginBtn.disabled = false;
                btnText.textContent = 'Entrar';
                alert('Informe um e-mail e senha válidos (mínimo 4 caracteres).');
            }
        }, 1200);
    });
});
