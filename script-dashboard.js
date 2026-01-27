async function publishKePublic() {
    const statusDiv = document.getElementById('status');
    
    // Ambil data dari input UI lo
    const judul = document.getElementById('judulInfo').value;
    const sub = document.getElementById('subDeskripsi').value;
    const kegiatan = document.getElementById('kegiatan').value;

    if (!judul || !kegiatan) {
        alert("Woi, minimal Judul dan Kegiatan diisi!");
        return;
    }

    statusDiv.innerText = "⏳ Memproses ke GitHub API via Localhost:2011...";
    statusDiv.style.color = "orange";

    // Struktur data yang dikirim (Sesuaikan dengan data.json di repo masjid lo)
    const payload = {
        contentData: {
            namaMasjid: "Masjid Jami Baiturrahman",
            banner: {
                title: judul,
                subtitle: sub
            },
            nextEvent: kegiatan,
            updatedAt: new Date().toLocaleString('id-ID')
        }
    };

    try {
        // Nembak ke API update-public di server.js lo
        const response = await fetch('http://localhost:2011/api/update-public', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            statusDiv.innerText = "✅ BERHASIL! Web Jami Baiturrahman sudah terupdate.";
            statusDiv.style.color = "green";
            alert("🚀 Update sukses di GitHub!");
        } else {
            statusDiv.innerText = "❌ GAGAL: " + result.error;
            statusDiv.style.color = "red";
        }
    } catch (error) {
        statusDiv.innerText = "❌ SERVER ERROR! Pastikan 'node server.js' di G:/server jalan.";
        statusDiv.style.color = "red";
        console.error(error);
    }
}
