// Initialize Local Database if it doesn't exist
if (!localStorage.getItem('ht_users')) localStorage.setItem('ht_users', JSON.stringify([]));
if (!localStorage.getItem('ht_tests')) localStorage.setItem('ht_tests', JSON.stringify([]));

let currentUser = null;

// Switch between Login, Register, and Forgot Password pages
function switchAuthPage(pageId) {
    document.querySelectorAll('.auth-container').forEach(el => el.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    document.querySelectorAll('form').forEach(f => f.reset());
    document.querySelectorAll('.error-msg, .success-msg').forEach(el => el.style.display = 'none');
}

// 1. REGISTER
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('register-error');

    let users = JSON.parse(localStorage.getItem('ht_users'));
    
    if (users.find(u => u.email === email)) {
        errorEl.textContent = "Email already exists. Please login.";
        errorEl.style.display = 'block';
        return;
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    localStorage.setItem('ht_users', JSON.stringify(users));

    switchAuthPage('login-page');
    document.getElementById('login-success').textContent = "Account created successfully! Please sign in.";
    document.getElementById('login-success').style.display = 'block';
});

// 2. LOGIN
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    let users = JSON.parse(localStorage.getItem('ht_users'));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('ht_session', JSON.stringify(user));
        loadDashboard(); // Function defined in app.js
    } else {
        errorEl.textContent = "Invalid email or password.";
        errorEl.style.display = 'block';
    }
});

// 3. FORGOT PASSWORD
document.getElementById('forgot-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    const successEl = document.getElementById('forgot-success');
    const errorEl = document.getElementById('forgot-error');

    let users = JSON.parse(localStorage.getItem('ht_users'));
    if (users.find(u => u.email === email)) {
        successEl.textContent = "Simulated Reset Link Sent! Check your email.";
        successEl.style.display = 'block';
        errorEl.style.display = 'none';
    } else {
        errorEl.textContent = "No account found with that email.";
        errorEl.style.display = 'block';
        successEl.style.display = 'none';
    }
});

// 4. LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('ht_session');
    currentUser = null;
    document.getElementById('dashboard-page').classList.add('hidden');
    switchAuthPage('login-page');
});

// 5. AUTO LOGIN ON REFRESH
window.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('ht_session');
    if (session) {
        currentUser = JSON.parse(session);
        loadDashboard(); // Function defined in app.js
    }
});