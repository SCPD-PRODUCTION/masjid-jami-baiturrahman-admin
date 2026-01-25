const API_URL = "http://localhost:2011/api";

// Fungsi Login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem('admin_name', data.user);
        window.location.href = 'dashboard.html';
    } else {
        alert("Login Gagal! Periksa kembali email dan password.");
    }
}

// Cek Proteksi Halaman Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const user = localStorage.getItem('admin_name');
    if (!user) window.location.href = 'index.html';
    document.getElementById('admin-name').innerText = user;
}

// Fungsi Push ke GitHub Public
async function publishData() {
    const contentData = {
        hero: {
            title: document.getElementById('hero-title').value,
            year: document.getElementById('hero-year').value
        }
    };

    const res = await fetch(`${API_URL}/update-public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentData })
    });

    const result = await res.json();
    if (result.success) {
        alert("Berhasil! Web Public telah diperbarui.");
    } else {
        alert("Gagal memperbarui Web Public.");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}