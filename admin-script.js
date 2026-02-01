// ========================================
// API Configuration - Terhubung ke Node.js Server
// ========================================
const API_URL = 'http://localhost:2011/api';

let tempEmail = ''; // Temporary storage untuk email saat reset password

// ========================================
// SHOW/HIDE FORMS
// ========================================

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('verifyOtpForm').style.display = 'none';
    document.getElementById('resetPasswordForm').style.display = 'none';
    hideMessages();
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('verifyOtpForm').style.display = 'none';
    document.getElementById('resetPasswordForm').style.display = 'none';
    hideMessages();
}

function showForgotPassword() {
    alert('⚠️ Fitur Forgot Password menggunakan backend PHP.\n\nUntuk saat ini, silakan hubungi admin untuk reset password.');
    showLogin();
}

function showVerifyOtp() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('verifyOtpForm').style.display = 'block';
    document.getElementById('resetPasswordForm').style.display = 'none';
    hideMessages();
}

function showResetPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('verifyOtpForm').style.display = 'none';
    document.getElementById('resetPasswordForm').style.display = 'block';
    hideMessages();
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => successDiv.style.display = 'none', 5000);
}

function hideMessages() {
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// ========================================
// LOGIN HANDLER
// ========================================

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;

    if (!identifier || !password) {
        showError('Semua field harus diisi!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                identifier: identifier,
                password: password 
            })
        });

        const data = await response.json();

        if (data.success) {
            // Simpan data user ke localStorage
            localStorage.setItem('masjid_user', data.data.nama);
            localStorage.setItem('masjid_user_email', data.data.email);
            localStorage.setItem('masjid_user_id', data.data.id);
            
            showSuccess('Login berhasil! Selamat datang, ' + data.data.nama);
            setTimeout(showDashboard, 1000);
        } else {
            showError(data.message || 'Login gagal!');
        }
    } catch (error) {
        showError('Koneksi ke server gagal! Pastikan server berjalan di port 2011.');
        console.error('Error:', error);
    }
});

// ========================================
// SIGNUP/REGISTER HANDLER
// ========================================

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validasi
    if (!email || !username || !password || !confirmPassword) {
        showError('Semua field harus diisi!');
        return;
    }

    if (password !== confirmPassword) {
        showError('Password tidak cocok!');
        return;
    }

    if (password.length < 6) {
        showError('Password minimal 6 karakter!');
        return;
    }

    if (!email.includes('@')) {
        showError('Format email tidak valid!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nama: username,
                username: username,
                email: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess('Registrasi berhasil! Silakan login.');
            setTimeout(showLogin, 2000);
            // Reset form
            document.getElementById('signupForm').reset();
        } else {
            showError(data.message || 'Registrasi gagal!');
        }
    } catch (error) {
        showError('Koneksi ke server gagal! Pastikan server berjalan di port 2011.');
        console.error('Error:', error);
    }
});

// ========================================
// DASHBOARD FUNCTIONS
// ========================================

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    document.getElementById('currentUser').textContent = localStorage.getItem('masjid_user') || 'Admin';
    
    // Load data dari server
    loadAllData();
}

function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('masjid_user');
        localStorage.removeItem('masjid_user_email');
        localStorage.removeItem('masjid_user_id');
        location.reload();
    }
}

// Check if already logged in
window.addEventListener('load', function() {
    if (localStorage.getItem('masjid_user')) {
        showDashboard();
    }
});

// ========================================
// DATA MANAGEMENT - Terhubung dengan Server
// ========================================

async function loadAllData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            const websiteData = result.data[0]; // Ambil data pertama
            populateFormFields(websiteData);
        } else {
            // Jika belum ada data, gunakan default
            const defaultData = getDefaultData();
            populateFormFields(defaultData);
        }
        
        loadJadwalGrid();
        loadProgramGrid();
        loadPengurusGrid();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Gagal memuat data dari server');
        // Load default data jika error
        const defaultData = getDefaultData();
        populateFormFields(defaultData);
    }
}

function getDefaultData() {
    return {
        hero: {
            title: 'MASJID JAMI BAITURRAHMAN',
            subtitle: 'Pusat Kegiatan Ibadah & Dakwah Umat',
            tagline: 'Makmurkan Masjid dengan Iman dan Amal Shaleh'
        },
        welcomeText: '🕌 Selamat Datang di Masjid Jami Baiturrahman 🕌',
        jadwalSholat: [
            { waktu: 'Subuh', jam: '04:30' },
            { waktu: 'Syuruq', jam: '05:45' },
            { waktu: 'Dhuha', jam: '06:15' },
            { waktu: 'Dzuhur', jam: '12:00' },
            { waktu: 'Ashar', jam: '15:15' },
            { waktu: 'Maghrib', jam: '18:00' },
            { waktu: 'Isya', jam: '19:15' }
        ],
        programs: [
            { icon: '🕌', title: 'Sholat Berjamaah 5 Waktu', description: 'Setiap hari' },
            { icon: '📖', title: 'Kajian Rutin Mingguan', description: 'Setiap Ahad pagi' },
            { icon: '🎓', title: 'TPA/TPQ', description: 'Senin - Jumat sore' },
            { icon: '🤲', title: 'Kajian Tafsir', description: 'Rabu malam' }
        ],
        pengurus: [
            { name: 'H. Ahmad Fauzi', role: 'Ketua Takmir', description: 'Ketua DKM' },
            { name: 'Ustadz Muhammad', role: 'Imam Masjid', description: 'Imam & Khatib' },
            { name: 'H. Abdullah', role: 'Bendahara', description: 'Pengelola Keuangan' }
        ],
        contact: {
            phone: '0821-1638-6662',
            website: 'www.baiturrahman.com',
            address: 'Jl. Rancakole Kp. Bojong Kecamatan Ciparay, Kabupaten Bandung, Provinsi Jawa Barat'
        }
    };
}

function populateFormFields(data) {
    // Hero Section
    if (data.hero) {
        document.getElementById('heroTitle').value = data.hero.title || '';
        document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
        document.getElementById('heroTagline').value = data.hero.tagline || '';
    }
    
    // Welcome Text
    document.getElementById('welcomeText').value = data.welcomeText || '';
    
    // Contact Info
    if (data.contact) {
        document.getElementById('phone').value = data.contact.phone || '';
        document.getElementById('website').value = data.contact.website || '';
        document.getElementById('address').value = data.contact.address || '';
    }
    
    // Store to localStorage for quick access
    localStorage.setItem('websiteData', JSON.stringify(data));
}

function getCurrentData() {
    const stored = localStorage.getItem('websiteData');
    return stored ? JSON.parse(stored) : getDefaultData();
}

// ========================================
// SAVE FUNCTIONS
// ========================================

async function saveDataToServer(data) {
    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [data] }) // Wrap in array
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('✅ Data berhasil disimpan!');
            // Update localStorage
            localStorage.setItem('websiteData', JSON.stringify(data));
            return true;
        } else {
            showError('Gagal menyimpan data: ' + result.message);
            return false;
        }
    } catch (error) {
        console.error('Error saving data:', error);
        showError('Koneksi ke server gagal!');
        return false;
    }
}

async function saveHeroSettings() {
    const data = getCurrentData();
    data.hero = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        tagline: document.getElementById('heroTagline').value
    };
    await saveDataToServer(data);
}

async function saveWelcomeText() {
    const data = getCurrentData();
    data.welcomeText = document.getElementById('welcomeText').value;
    await saveDataToServer(data);
}

async function saveContactInfo() {
    const data = getCurrentData();
    data.contact = {
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        address: document.getElementById('address').value
    };
    await saveDataToServer(data);
}

// ========================================
// JADWAL SHOLAT FUNCTIONS
// ========================================

function loadJadwalGrid() {
    const data = getCurrentData();
    const grid = document.getElementById('jadwalGrid');
    
    if (!data.jadwalSholat || data.jadwalSholat.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Belum ada data jadwal sholat</p>';
        return;
    }
    
    grid.innerHTML = data.jadwalSholat.map((j, i) => `
        <div class="item-card">
            <h4>🕌 ${j.waktu}</h4>
            <p style="font-size: 24px; font-weight: bold; color: #2d7a3e;">${j.jam} WIB</p>
            <div class="item-actions">
                <button class="btn-edit" onclick="editJadwal(${i})">Edit</button>
                <button class="btn-delete" onclick="deleteJadwal(${i})">Hapus</button>
            </div>
        </div>
    `).join('');
}

function openAddJadwal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Tambah Jadwal Sholat';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Waktu Sholat</label>
            <input type="text" id="newJadwalWaktu" placeholder="Contoh: Subuh">
        </div>
        <div class="form-group">
            <label>Jam</label>
            <input type="time" id="newJadwalJam">
        </div>
        <button class="btn btn-primary" onclick="addJadwal()">Simpan</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function addJadwal() {
    const waktu = document.getElementById('newJadwalWaktu').value;
    const jam = document.getElementById('newJadwalJam').value;
    
    if (!waktu || !jam) {
        showError('Semua field harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    if (!data.jadwalSholat) data.jadwalSholat = [];
    
    data.jadwalSholat.push({ waktu, jam });
    
    if (await saveDataToServer(data)) {
        loadJadwalGrid();
        closeModal();
    }
}

function editJadwal(index) {
    const data = getCurrentData();
    const jadwal = data.jadwalSholat[index];
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Edit Jadwal Sholat';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Waktu Sholat</label>
            <input type="text" id="editJadwalWaktu" value="${jadwal.waktu}">
        </div>
        <div class="form-group">
            <label>Jam</label>
            <input type="time" id="editJadwalJam" value="${jadwal.jam}">
        </div>
        <button class="btn btn-primary" onclick="updateJadwal(${index})">Update</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updateJadwal(index) {
    const waktu = document.getElementById('editJadwalWaktu').value;
    const jam = document.getElementById('editJadwalJam').value;
    
    const data = getCurrentData();
    data.jadwalSholat[index] = { waktu, jam };
    
    if (await saveDataToServer(data)) {
        loadJadwalGrid();
        closeModal();
    }
}

async function deleteJadwal(index) {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
    
    const data = getCurrentData();
    data.jadwalSholat.splice(index, 1);
    
    if (await saveDataToServer(data)) {
        loadJadwalGrid();
    }
}

// ========================================
// PROGRAM MASJID FUNCTIONS
// ========================================

function loadProgramGrid() {
    const data = getCurrentData();
    const grid = document.getElementById('programGrid');
    
    if (!data.programs || data.programs.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Belum ada data program</p>';
        return;
    }
    
    grid.innerHTML = data.programs.map((p, i) => `
        <div class="item-card">
            <h4>${p.icon} ${p.title}</h4>
            <p>${p.description || ''}</p>
            <div class="item-actions">
                <button class="btn-edit" onclick="editProgram(${i})">Edit</button>
                <button class="btn-delete" onclick="deleteProgram(${i})">Hapus</button>
            </div>
        </div>
    `).join('');
}

function openAddProgram() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Tambah Program Masjid';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Icon (Emoji)</label>
            <input type="text" id="newProgramIcon" placeholder="Contoh: 🕌" maxlength="2">
        </div>
        <div class="form-group">
            <label>Nama Program</label>
            <input type="text" id="newProgramTitle" placeholder="Contoh: Kajian Rutin">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="newProgramDesc" placeholder="Penjelasan singkat"></textarea>
        </div>
        <button class="btn btn-primary" onclick="addProgram()">Simpan</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function addProgram() {
    const icon = document.getElementById('newProgramIcon').value;
    const title = document.getElementById('newProgramTitle').value;
    const description = document.getElementById('newProgramDesc').value;
    
    if (!title) {
        showError('Nama program harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    if (!data.programs) data.programs = [];
    
    data.programs.push({ icon, title, description });
    
    if (await saveDataToServer(data)) {
        loadProgramGrid();
        closeModal();
    }
}

function editProgram(index) {
    const data = getCurrentData();
    const program = data.programs[index];
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Edit Program Masjid';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Icon (Emoji)</label>
            <input type="text" id="editProgramIcon" value="${program.icon || ''}" maxlength="2">
        </div>
        <div class="form-group">
            <label>Nama Program</label>
            <input type="text" id="editProgramTitle" value="${program.title}">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="editProgramDesc">${program.description || ''}</textarea>
        </div>
        <button class="btn btn-primary" onclick="updateProgram(${index})">Update</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updateProgram(index) {
    const icon = document.getElementById('editProgramIcon').value;
    const title = document.getElementById('editProgramTitle').value;
    const description = document.getElementById('editProgramDesc').value;
    
    const data = getCurrentData();
    data.programs[index] = { icon, title, description };
    
    if (await saveDataToServer(data)) {
        loadProgramGrid();
        closeModal();
    }
}

async function deleteProgram(index) {
    if (!confirm('Yakin ingin menghapus program ini?')) return;
    
    const data = getCurrentData();
    data.programs.splice(index, 1);
    
    if (await saveDataToServer(data)) {
        loadProgramGrid();
    }
}

// ========================================
// PENGURUS MASJID FUNCTIONS
// ========================================

function loadPengurusGrid() {
    const data = getCurrentData();
    const grid = document.getElementById('pengurusGrid');
    
    if (!data.pengurus || data.pengurus.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Belum ada data pengurus</p>';
        return;
    }
    
    grid.innerHTML = data.pengurus.map((p, i) => `
        <div class="item-card">
            <h4>👤 ${p.name}</h4>
            <p><strong>${p.role}</strong></p>
            <p>${p.description || ''}</p>
            <div class="item-actions">
                <button class="btn-edit" onclick="editPengurus(${i})">Edit</button>
                <button class="btn-delete" onclick="deletePengurus(${i})">Hapus</button>
            </div>
        </div>
    `).join('');
}

function openAddPengurus() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Tambah Pengurus Masjid';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Nama</label>
            <input type="text" id="newPengurusName" placeholder="Nama lengkap">
        </div>
        <div class="form-group">
            <label>Jabatan</label>
            <input type="text" id="newPengurusRole" placeholder="Contoh: Ketua Takmir">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="newPengurusDesc" placeholder="Keterangan tambahan"></textarea>
        </div>
        <button class="btn btn-primary" onclick="addPengurus()">Simpan</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function addPengurus() {
    const name = document.getElementById('newPengurusName').value;
    const role = document.getElementById('newPengurusRole').value;
    const description = document.getElementById('newPengurusDesc').value;
    
    if (!name || !role) {
        showError('Nama dan Jabatan harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    if (!data.pengurus) data.pengurus = [];
    
    data.pengurus.push({ name, role, description });
    
    if (await saveDataToServer(data)) {
        loadPengurusGrid();
        closeModal();
    }
}

function editPengurus(index) {
    const data = getCurrentData();
    const pengurus = data.pengurus[index];
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Edit Pengurus Masjid';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Nama</label>
            <input type="text" id="editPengurusName" value="${pengurus.name}">
        </div>
        <div class="form-group">
            <label>Jabatan</label>
            <input type="text" id="editPengurusRole" value="${pengurus.role}">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="editPengurusDesc">${pengurus.description || ''}</textarea>
        </div>
        <button class="btn btn-primary" onclick="updatePengurus(${index})">Update</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updatePengurus(index) {
    const name = document.getElementById('editPengurusName').value;
    const role = document.getElementById('editPengurusRole').value;
    const description = document.getElementById('editPengurusDesc').value;
    
    const data = getCurrentData();
    data.pengurus[index] = { name, role, description };
    
    if (await saveDataToServer(data)) {
        loadPengurusGrid();
        closeModal();
    }
}

async function deletePengurus(index) {
    if (!confirm('Yakin ingin menghapus pengurus ini?')) return;
    
    const data = getCurrentData();
    data.pengurus.splice(index, 1);
    
    if (await saveDataToServer(data)) {
        loadPengurusGrid();
    }
}

// ========================================
// MODAL FUNCTIONS
// ========================================

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});
