const API_URL = "http://localhost:2011/api";
let currentEditIndex = null;

// Simulasi Data (Ganti dengan fetch dari data.json nanti)
let programList = [
    { icon: "🏆", title: "Pencapaian Prestasi Akademik" },
    { icon: "🎖️", title: "Penguasaan Tahfidz Minimal 4 Juz" }
];

// 1. Tampilkan Data ke Tabel
function renderPrograms() {
    const tableBody = document.getElementById('programTableBody');
    tableBody.innerHTML = '';

    programList.forEach((prog, index) => {
        tableBody.innerHTML += `
            <tr>
                <td style="font-size: 24px;">${prog.icon}</td>
                <td>${prog.title}</td>
                <td>
                    <button class="btn-edit-sm" onclick="editProgram(${index})">EDIT</button>
                    <button class="btn-delete-sm" onclick="deleteProgram(${index})">HAPUS</button>
                </td>
            </tr>
        `;
    });
}

// 2. Fungsi Hapus
function deleteProgram(index) {
    if(confirm("Apakah Anda yakin ingin menghapus program ini?")) {
        programList.splice(index, 1);
        renderPrograms();
        // Disini panggil API Update ke GitHub/Server
    }
}

// 3. Modal Control
function openProgramModal() {
    document.getElementById('adminModal').classList.add('active');
}

function closeModal() {
    document.getElementById('adminModal').classList.remove('active');
    currentEditIndex = null;
}

// 4. Simpan Data Baru / Edit
function handleSaveProgram() {
    const icon = document.getElementById('prog_icon').value;
    const title = document.getElementById('prog_title').value;

    if(!icon || !title) return alert("Isi semua data!");

    if(currentEditIndex !== null) {
        programList[currentEditIndex] = { icon, title };
    } else {
        programList.push({ icon, title });
    }

    renderPrograms();
    closeModal();
    alert("Berhasil diperbarui!");
}

// Jalankan saat load
renderPrograms();
