let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (token) showAppUI();

    document.getElementById('btn-login').addEventListener('click', () => handleAuth('/api/v1/users/login'));
    document.getElementById('btn-signup').addEventListener('click', () => handleAuth('/api/v1/users/signup'));
    document.getElementById('comment-form').addEventListener('submit', sendComment);
});

async function handleAuth(endpoint) {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();
    if (data.status === 'success') {
        token = data.token;
        localStorage.setItem('token', token);
        showAppUI();
    } else {
        alert(data.message);
    }
}

function showAppUI() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('materials-section').classList.remove('hidden');
    document.getElementById('comments-section').classList.remove('hidden');
    loadComments();
}

async function loadComments() {
    const res = await fetch('/api/v1/comments');
    const data = await res.json();
    const list = document.getElementById('comments-list');
    list.innerHTML = data.data.comments.map(c => `
        <div class="comment-item">
            <strong>${c.usuario ? c.usuario.nombre : 'Usuario'}:</strong>
            <p>${c.mensaje}</p>
        </div>
    `).join('');
}

async function sendComment(e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje').value;

    const res = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mensaje })
    });

    if (res.ok) {
        document.getElementById('mensaje').value = '';
        loadComments();
    }
}

async function buyMaterial(materialName, amount) {
    const res = await fetch('/api/v1/payments/checkout-session', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ materialName, amount })
    });

    const data = await res.json();
    if (data.status === 'success') {
        window.location.href = data.session.url;
    } else {
        alert('Error al iniciar el pago: ' + data.message);
    }
}