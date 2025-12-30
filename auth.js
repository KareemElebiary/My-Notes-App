function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
        error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
        warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 2L2 20h20L12 2z"/><path d="M12 9v4M12 17h.01"/></svg>'
    };

    toast.innerHTML = `
        ${icons[type]}
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Login Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = 'Logging In...';
        btn.classList.add('disabled');

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            // Allow for non-JSON responses to be caught (e.g. PHP warnings)
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error('Server response was not JSON:', text);
                throw new Error('Server error occurred.');
            }

            if (data.success) {
                showToast('Login successful!', 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } else {
                showToast(data.message || 'Login failed', 'error');
                btn.innerHTML = originalText;
                btn.classList.remove('disabled');
            }
        } catch (error) {
            showToast(error.message || 'An error occurred', 'error');
            console.error(error);
            btn.innerHTML = originalText;
            btn.classList.remove('disabled');
        }
    });
}

// Signup Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        const btn = signupForm.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Creating Account...';
        btn.classList.add('disabled');

        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error('Server response was not JSON:', text);
                throw new Error('Server error occurred.');
            }

            if (data.success) {
                showToast('Account created! Redirecting...', 'success');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                showToast(data.message || 'Signup failed', 'error');
                btn.innerHTML = originalText;
                btn.classList.remove('disabled');
            }
        } catch (error) {
            showToast(error.message || 'An error occurred', 'error');
            console.error(error);
            btn.innerHTML = originalText;
            btn.classList.remove('disabled');
        }
    });
}
