let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    if (token) showAppUI();

    // Eventos de Autenticación
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) btnLogin.addEventListener('click', () => handleAuth('/api/v1/users/login'));

    const btnSignup = document.getElementById('btn-signup');
    if (btnSignup) btnSignup.addEventListener('click', () => handleAuth('/api/v1/users/signup'));

    // Listener para el formulario de comentarios
    const commentForm = document.getElementById('comment-form');
    if (commentForm) commentForm.addEventListener('submit', sendComment);

    // Listener para el formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', sendContactForm);
});

async function handleAuth(endpoint) {
    const nombre = document.getElementById('nombre')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

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
    document.getElementById('auth-section')?.classList.add('hidden');
    document.getElementById('materials-section')?.classList.remove('hidden');
    document.getElementById('comments-section')?.classList.remove('hidden');
    loadComments();
}

async function loadComments() {
    const res = await fetch('/api/v1/comments');
    const data = await res.json();
    const list = document.getElementById('comments-list');
    if (list && data.data?.comments) {
        list.innerHTML = data.data.comments.map(c => `
            <div class="comment-item">
                <strong>${c.usuario ? c.usuario.nombre : 'Usuario'}:</strong>
                <p>${c.mensaje}</p>
            </div>
        `).join('');
    }
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

// Expuesta globalmente en window para que el onclick del HTML la encuentre
window.buyMaterial = async function(materialName, amount) {
    if (!token) {
        alert('Debes iniciar sesión para inscribirte a un curso.');
        return;
    }

    try {
        const res = await fetch('/api/v1/payments/checkout-session', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ materialName, amount })
        });

        const data = await res.json();

        if (res.ok && data.status === 'success') {
            window.location.href = data.session.url;
        } else {
            alert('Error al iniciar el pago: ' + (data.message || 'Error del servidor'));
        }
    } catch (error) {
        console.error('Error en la petición de pago:', error);
        alert('No se pudo conectar con el servidor de pagos.');
    }
};

async function sendContactForm(e) {
    e.preventDefault();
    const responseDiv = document.getElementById('contact-response');

    const data = {
        nombre: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        mensaje: document.getElementById('contact-message').value
    };

    try {
        const res = await fetch('/api/v1/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok && result.status === 'success') {
            responseDiv.textContent = '¡Gracias por tu mensaje! Guardado correctamente.';
            responseDiv.style.color = '#16a34a';
            responseDiv.classList.remove('hidden');
            document.getElementById('contact-form').reset();
        } else {
            throw new Error(result.message || 'Error al enviar el mensaje');
        }
    } catch (err) {
        responseDiv.textContent = 'Hubo un problema al enviar tu mensaje.';
        responseDiv.style.color = '#dc2626';
        responseDiv.classList.remove('hidden');
    }
}