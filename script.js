const API_URL = "http://localhost:2011/api";

// Fungsi Pendaftaran Akun
async function handleRegister() {
    const nama = document.getElementById('reg-nama').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if(!nama || !email || !password) return alert("Semua data harus diisi!");

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, email, password })
        });

        const data = await res.json();
        if (data.success) {
            alert("Akun berhasil dibuat! Silakan login.");
            window.location.href = 'index.html';
        } else {
            alert("Gagal: " + data.message);
        }
    } catch (err) {
        alert("Pastikan Server Node.js Anda sudah dijalankan!");
    }
}

// Fungsi Login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (data.success) {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            alert("Email atau Password salah!");
        }
    } catch (err) {
        alert("Server belum aktif!");
    }
}
