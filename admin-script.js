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
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
    document.getElementById('verifyOtpForm').style.display = 'none';
    document.getElementById('resetPasswordForm').style.display = 'none';
    hideMessages();
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
// FORGOT PASSWORD HANDLER - PHP BACKEND
// ========================================

const PHP_BACKEND_URL = 'http://localhost/masjid-backend';

document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;

    if (!email) {
        showError('Email harus diisi!');
        return;
    }

    if (!email.includes('@')) {
        showError('Format email tidak valid!');
        return;
    }

    try {
        const response = await fetch(`${PHP_BACKEND_URL}/backend-forgot-php.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (data.success) {
            tempEmail = email;
            showSuccess(data.message || 'Kode OTP telah dikirim ke email Anda!');
            setTimeout(showVerifyOtp, 2000);
            document.getElementById('forgotPasswordForm').reset();
        } else {
            showError(data.message || 'Gagal mengirim kode OTP!');
        }
    } catch (error) {
        showError('Koneksi ke PHP backend gagal! Pastikan PHP server berjalan.');
        console.error('Error:', error);
    }
});

// ========================================
// VERIFY OTP HANDLER - PHP BACKEND
// ========================================

document.getElementById('verifyOtpForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const otp = document.getElementById('otpCode').value;

    if (!otp) {
        showError('Kode OTP harus diisi!');
        return;
    }

    if (otp.length !== 6) {
        showError('Kode OTP harus 6 digit!');
        return;
    }

    try {
        const response = await fetch(`${PHP_BACKEND_URL}/backend-verify-otp-php.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: tempEmail,
                otp: otp 
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess(data.message || 'Kode OTP valid!');
            setTimeout(showResetPassword, 1500);
            document.getElementById('verifyOtpForm').reset();
        } else {
            showError(data.message || 'Kode OTP tidak valid!');
        }
    } catch (error) {
        showError('Koneksi ke PHP backend gagal!');
        console.error('Error:', error);
    }
});

// ========================================
// RESET PASSWORD HANDLER - PHP BACKEND
// ========================================

document.getElementById('resetPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    if (!newPassword || !confirmPassword) {
        showError('Semua field harus diisi!');
        return;
    }

    if (newPassword !== confirmPassword) {
        showError('Password tidak cocok!');
        return;
    }

    if (newPassword.length < 6) {
        showError('Password minimal 6 karakter!');
        return;
    }

    try {
        const response = await fetch(`${PHP_BACKEND_URL}/backend-reset-pwd-php.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: tempEmail,
                new_password: newPassword 
            })
        });

        const data = await response.json();

        if (data.success) {
            showSuccess(data.message || 'Password berhasil direset! Silakan login.');
            tempEmail = '';
            setTimeout(showLogin, 2000);
            document.getElementById('resetPasswordForm').reset();
        } else {
            showError(data.message || 'Gagal reset password!');
        }
    } catch (error) {
        showError('Koneksi ke PHP backend gagal!');
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

window.addEventListener('load', function() {
    if (localStorage.getItem('masjid_user')) {
        showDashboard();
    }
});

// ========================================
// DATA MANAGEMENT
// ========================================

async function loadAllData() {
    try {
        const response = await fetch(`${API_URL}/data`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
            const websiteData = result.data[0];
            populateFormFields(websiteData);
        } else {
            const defaultData = getDefaultData();
            populateFormFields(defaultData);
        }
        
        loadJadwalGrid();
        loadBannerGrid();
        loadProgramGrid();
        loadPengurusGrid();
        loadArticlesGrid(); // FITUR BARU!
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Gagal memuat data dari server');
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
        banners: [],
        welcomeText: '🕌 Selamat Datang di Masjid Jami Baiturrahman 🕌',
        jadwalSholat: [],
        programs: [],
        pengurus: [],
        contact: {
            phone: '0821-1638-6662',
            website: 'www.baiturrahman.com',
            address: 'Jl. Rancakole Kp. Bojong Kecamatan Ciparay, Kabupaten Bandung'
        }
    };
}

function populateFormFields(data) {
    if (data.hero) {
        document.getElementById('heroTitle').value = data.hero.title || '';
        document.getElementById('heroSubtitle').value = data.hero.subtitle || '';
        document.getElementById('heroTagline').value = data.hero.tagline || '';
    }
    document.getElementById('welcomeText').value = data.welcomeText || '';
    if (data.contact) {
        document.getElementById('phone').value = data.contact.phone || '';
        document.getElementById('website').value = data.contact.website || '';
        document.getElementById('address').value = data.contact.address || '';
    }
    localStorage.setItem('websiteData', JSON.stringify(data));
}

function getCurrentData() {
    const stored = localStorage.getItem('websiteData');
    return stored ? JSON.parse(stored) : getDefaultData();
}

async function saveDataToServer(data) {
    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [data] })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('✅ Data berhasil disimpan!');
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

// SAVE HELPERS
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
// BANNER SLIDER FUNCTIONS (UPDATED - FILE UPLOAD)
// ========================================

function loadBannerGrid() {
    const data = getCurrentData();
    const grid = document.getElementById('bannerGrid');
    
    if (!data.banners || data.banners.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Belum ada banner. Klik tombol Tambah untuk menambahkan banner baru.</p>';
        return;
    }
    
    grid.innerHTML = data.banners.map((banner, i) => `
        <div class="item-card">
            <div style="width: 100%; height: 150px; background: #f5f5f5; border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
                <img src="${banner.image}" alt="${banner.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h4>📷 ${banner.title}</h4>
            <p style="color: #666; font-size: 14px;">${banner.description}</p>
            <div class="item-actions">
                <button class="btn-edit" onclick="editBanner(${i})">Edit</button>
                <button class="btn-delete" onclick="deleteBanner(${i})">Hapus</button>
            </div>
        </div>
    `).join('');
}

// Helper: Convert File to Base64
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function openAddBanner() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Tambah Banner Baru';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Judul Banner</label>
            <input type="text" id="newBannerTitle" placeholder="Contoh: Perpustakaan Islami">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="newBannerDescription" placeholder="Deskripsi singkat tentang banner..." rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>Upload Gambar (Kamera/Galeri)</label>
            <input type="file" id="newBannerFileInput" accept="image/*" onchange="previewImage(this, 'previewNewBanner')">
            <small style="display: block; margin-top: 5px; color: #666;">
                Format: JPG, PNG, JPEG. Ukuran maks disarankan < 1MB.
            </small>
        </div>
        <div style="margin: 10px 0; display:none;" id="previewContainer">
            <p style="margin-bottom:5px; font-size:12px;">Preview:</p>
            <img id="previewNewBanner" src="" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        <button class="btn btn-primary" onclick="addBanner()">Simpan Banner</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

// Fungsi untuk menampilkan preview saat user memilih file
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.src = e.target.result;
            preview.parentElement.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function addBanner() {
    const title = document.getElementById('newBannerTitle').value;
    const description = document.getElementById('newBannerDescription').value;
    const fileInput = document.getElementById('newBannerFileInput');
    
    if (!title || !description) {
        showError('Judul dan Deskripsi harus diisi!');
        return;
    }

    if (fileInput.files.length === 0) {
        showError('Silakan pilih gambar terlebih dahulu!');
        return;
    }

    // Convert gambar ke Base64 string
    try {
        const imageBase64 = await readFileAsDataURL(fileInput.files[0]);
        
        const data = getCurrentData();
        if (!data.banners) data.banners = [];
        
        data.banners.push({ 
            title, 
            description, 
            image: imageBase64 // Simpan string gambar panjang ini
        });
        
        if (await saveDataToServer(data)) {
            loadBannerGrid();
            closeModal();
        }
    } catch (error) {
        console.error(error);
        showError('Gagal memproses gambar. Coba gambar yang lebih kecil.');
    }
}

function editBanner(index) {
    const data = getCurrentData();
    const banner = data.banners[index];
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Edit Banner';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Judul Banner</label>
            <input type="text" id="editBannerTitle" value="${banner.title}">
        </div>
        <div class="form-group">
            <label>Deskripsi</label>
            <textarea id="editBannerDescription" rows="3">${banner.description}</textarea>
        </div>
        <div class="form-group">
            <label>Ganti Gambar (Opsional)</label>
            <input type="file" id="editBannerFileInput" accept="image/*" onchange="previewImage(this, 'previewEditBanner')">
            <small style="color: #666;">Biarkan kosong jika tidak ingin mengubah gambar.</small>
        </div>
        <div style="margin: 10px 0;">
            <p style="margin-bottom:5px; font-size:12px;">Gambar saat ini / Preview:</p>
            <img id="previewEditBanner" src="${banner.image}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; border: 1px solid #ddd;">
        </div>
        <button class="btn btn-primary" onclick="updateBanner(${index})">Update Banner</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updateBanner(index) {
    const title = document.getElementById('editBannerTitle').value;
    const description = document.getElementById('editBannerDescription').value;
    const fileInput = document.getElementById('editBannerFileInput');
    
    if (!title || !description) {
        showError('Judul dan Deskripsi harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    let imageToSave = data.banners[index].image; // Default pakai gambar lama

    // Jika user upload file baru, kita replace
    if (fileInput.files.length > 0) {
        try {
            imageToSave = await readFileAsDataURL(fileInput.files[0]);
        } catch (error) {
            showError('Gagal memproses gambar baru.');
            return;
        }
    }
    
    data.banners[index] = { 
        title, 
        description, 
        image: imageToSave 
    };
    
    if (await saveDataToServer(data)) {
        loadBannerGrid();
        closeModal();
    }
}

async function deleteBanner(index) {
    if (!confirm('Yakin ingin menghapus banner ini?')) return;
    
    const data = getCurrentData();
    data.banners.splice(index, 1);
    
    if (await saveDataToServer(data)) {
        loadBannerGrid();
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
            ${p.photo ? `<img src="${p.photo}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">` : ''}
            <h4>${p.photo ? '' : '👤 '}${p.name}</h4>
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
            <label>Foto Profil</label>
            <input type="file" id="newPengurusPhoto" accept="image/*" onchange="previewPengurusPhoto(this, 'newPengurusPreview')">
            <div id="newPengurusPreview" style="margin-top: 10px;"></div>
        </div>
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
    const photoInput = document.getElementById('newPengurusPhoto');
    
    if (!name || !role) {
        showError('Nama dan Jabatan harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    if (!data.pengurus) data.pengurus = [];
    
    let photoUrl = null;
    
    // Upload foto jika ada
    if (photoInput && photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const base64 = await fileToBase64(file);
        
        try {
            const uploadResponse = await fetch(`${API_URL}/upload-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `pengurus_${Date.now()}`
                })
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
                photoUrl = uploadResult.data.url;
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            showError('Gagal upload foto!');
            return;
        }
    }
    
    data.pengurus.push({ name, role, description, photo: photoUrl });
    
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
            <label>Foto Profil</label>
            <input type="file" id="editPengurusPhoto" accept="image/*" onchange="previewPengurusPhoto(this, 'editPengurusPreview')">
            <div id="editPengurusPreview" style="margin-top: 10px;">
                ${pengurus.photo ? `<img src="${pengurus.photo}" style="max-width: 150px; border-radius: 50%; margin-bottom: 10px;">` : ''}
            </div>
        </div>
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
        <input type="hidden" id="currentPengurusPhoto" value="${pengurus.photo || ''}">
        <button class="btn btn-primary" onclick="updatePengurus(${index})">Update</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updatePengurus(index) {
    const name = document.getElementById('editPengurusName').value;
    const role = document.getElementById('editPengurusRole').value;
    const description = document.getElementById('editPengurusDesc').value;
    const photoInput = document.getElementById('editPengurusPhoto');
    const currentPhoto = document.getElementById('currentPengurusPhoto').value;
    
    let photoUrl = currentPhoto;
    
    // Upload foto baru jika ada
    if (photoInput && photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        const base64 = await fileToBase64(file);
        
        try {
            const uploadResponse = await fetch(`${API_URL}/upload-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `pengurus_${Date.now()}`
                })
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
                photoUrl = uploadResult.data.url;
            }
        } catch (error) {
            console.error('Error uploading photo:', error);
            showError('Gagal upload foto!');
            return;
        }
    }
    
    const data = getCurrentData();
    data.pengurus[index] = { name, role, description, photo: photoUrl };
    
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

document.addEventListener('click', function(e) {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========================================
// HELPER FUNCTIONS - IMAGE UPLOAD
// ========================================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function previewPengurusPhoto(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; border-radius: 50%; object-fit: cover;">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// ========================================
// ARTIKEL MASJID FUNCTIONS - FITUR BARU!
// ========================================

function loadArticlesGrid() {
    const data = getCurrentData();
    const grid = document.getElementById('articlesGrid');
    
    if (!grid) return;
    
    if (!data.articles || data.articles.length === 0) {
        grid.innerHTML = '<p style="color: #666;">Belum ada artikel</p>';
        return;
    }
    
    grid.innerHTML = data.articles.map((article, i) => {
        const dateStr = article.date ? new Date(article.date).toLocaleDateString('id-ID') : '';
        const excerpt = article.description && article.description.length > 100 
            ? article.description.substring(0, 100) + '...' 
            : article.description || '';
        
        return `
            <div class="item-card">
                ${article.image ? `<img src="${article.image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">` : '📰'}
                <h4>${article.title || 'Tanpa Judul'}</h4>
                <p style="font-size: 0.85em; color: #999;">📅 ${dateStr}</p>
                <p>${excerpt}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editArticle(${i})">Edit</button>
                    <button class="btn-delete" onclick="deleteArticle(${i})">Hapus</button>
                </div>
            </div>
        `;
    }).join('');
}

function openAddArticle() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Tambah Artikel Baru';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Upload Gambar</label>
            <input type="file" id="newArticleImage" accept="image/*" onchange="previewArticleImage(this, 'newArticlePreview')">
            <div id="newArticlePreview" style="margin-top: 10px;"></div>
        </div>
        <div class="form-group">
            <label>Judul Artikel</label>
            <input type="text" id="newArticleTitle" placeholder="Judul artikel...">
        </div>
        <div class="form-group">
            <label>Konten Artikel</label>
            <textarea id="newArticleContent" placeholder="Tulis konten artikel lengkap..." rows="10"></textarea>
        </div>
        <button class="btn btn-primary" onclick="addArticle()">Simpan Artikel</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function addArticle() {
    const title = document.getElementById('newArticleTitle').value;
    const content = document.getElementById('newArticleContent').value;
    const imageInput = document.getElementById('newArticleImage');
    
    if (!title || !content) {
        showError('Judul dan konten harus diisi!');
        return;
    }
    
    const data = getCurrentData();
    if (!data.articles) data.articles = [];
    
    let imageUrl = null;
    
    // Upload gambar jika ada
    if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const base64 = await fileToBase64(file);
        
        try {
            const uploadResponse = await fetch(`${API_URL}/upload-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `article_${Date.now()}`
                })
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
                imageUrl = uploadResult.data.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showError('Gagal upload gambar!');
            return;
        }
    }
    
    // Tambah artikel baru
    data.articles.push({
        title: title,
        description: content,
        image: imageUrl,
        date: new Date().toISOString()
    });
    
    if (await saveDataToServer(data)) {
        loadArticlesGrid();
        closeModal();
        showSuccess('Artikel berhasil ditambahkan!');
    }
}

function editArticle(index) {
    const data = getCurrentData();
    const article = data.articles[index];
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = 'Edit Artikel';
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Upload Gambar Baru (opsional)</label>
            <input type="file" id="editArticleImage" accept="image/*" onchange="previewArticleImage(this, 'editArticlePreview')">
            <div id="editArticlePreview" style="margin-top: 10px;">
                ${article.image ? `<img src="${article.image}" style="max-width: 200px; border-radius: 8px;">` : ''}
            </div>
        </div>
        <div class="form-group">
            <label>Judul Artikel</label>
            <input type="text" id="editArticleTitle" value="${article.title || ''}">
        </div>
        <div class="form-group">
            <label>Konten Artikel</label>
            <textarea id="editArticleContent" rows="10">${article.description || ''}</textarea>
        </div>
        <input type="hidden" id="currentArticleImage" value="${article.image || ''}">
        <button class="btn btn-primary" onclick="updateArticle(${index})">Update Artikel</button>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

async function updateArticle(index) {
    const title = document.getElementById('editArticleTitle').value;
    const content = document.getElementById('editArticleContent').value;
    const imageInput = document.getElementById('editArticleImage');
    const currentImage = document.getElementById('currentArticleImage').value;
    
    if (!title || !content) {
        showError('Judul dan konten harus diisi!');
        return;
    }
    
    let imageUrl = currentImage;
    
    // Upload gambar baru jika ada
    if (imageInput && imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        const base64 = await fileToBase64(file);
        
        try {
            const uploadResponse = await fetch(`${API_URL}/upload-image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    filename: `article_${Date.now()}`
                })
            });
            
            const uploadResult = await uploadResponse.json();
            if (uploadResult.success) {
                imageUrl = uploadResult.data.url;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showError('Gagal upload gambar!');
            return;
        }
    }
    
    const data = getCurrentData();
    data.articles[index] = {
        title: title,
        description: content,
        image: imageUrl,
        date: data.articles[index].date || new Date().toISOString()
    };
    
    if (await saveDataToServer(data)) {
        loadArticlesGrid();
        closeModal();
        showSuccess('Artikel berhasil diupdate!');
    }
}

async function deleteArticle(index) {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return;
    
    const data = getCurrentData();
    data.articles.splice(index, 1);
    
    if (await saveDataToServer(data)) {
        loadArticlesGrid();
        showSuccess('Artikel berhasil dihapus!');
    }
}

function previewArticleImage(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; border-radius: 8px;">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}
