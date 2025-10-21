document.addEventListener('DOMContentLoaded', function() {
    const authWrapper = document.getElementById('authWrapper');
    const websiteContent = document.getElementById('websiteContent');
    const loginFormCard = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const loginFormActual = document.getElementById('loginFormActual');
    const loginButton = document.getElementById('loginButton');
    const loadingText = document.getElementById('loadingText');
    
    const createAnnouncementBtn = document.getElementById('createAnnouncementBtn');
    const announcementModal = document.getElementById('announcementModal');
    const closeAnnouncementModalBtn = announcementModal.querySelector('.close-button');
    const newAnnouncementForm = document.getElementById('newAnnouncementForm');
    const announcementsList = document.getElementById('announcementsList');

    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const uploadPhotoModal = document.getElementById('uploadPhotoModal');
    const closeUploadPhotoModalBtn = uploadPhotoModal.querySelector('.close-button');
    const newPhotoUploadForm = document.getElementById('newPhotoUploadForm');
    const galleryGrid = document.getElementById('galleryGrid');

    const backgroundMusic = document.getElementById('backgroundMusic');

    const createStudentAccountBtn = document.getElementById('createStudentAccountBtn');
    const createStudentAccountModal = document.getElementById('createStudentAccountModal');
    const closeCreateStudentAccountModalBtn = createStudentAccountModal.querySelector('.close-button');
    const newStudentAccountForm = document.getElementById('newStudentAccountForm');

    // Elemen untuk pembuatan akun Wali Kelas (BARU)
    const createTeacherAccountBtn = document.getElementById('createTeacherAccountBtn');
    const createTeacherAccountModal = document.getElementById('createTeacherAccountModal');
    const closeCreateTeacherAccountModalBtn = createTeacherAccountModal.querySelector('.close-button');
    const newTeacherAccountForm = document.getElementById('newTeacherAccountForm');

    // Elemen untuk pengaturan tampilan website (BARU)
    const customizeWebsiteBtn = document.getElementById('customizeWebsiteBtn');
    const customizeWebsiteModal = document.getElementById('customizeWebsiteModal');
    const closeCustomizeWebsiteModalBtn = customizeWebsiteModal.querySelector('.close-button');
    const backgroundColorInput = document.getElementById('backgroundColor');
    const applyBackgroundColorBtn = document.getElementById('applyBackgroundColor');
    const backgroundImageInput = document.getElementById('backgroundImage');
    const applyBackgroundImageBtn = document.getElementById('applyBackgroundImage');
    const resetBackgroundBtn = document.getElementById('resetBackground');
    const musicSourceSelect = document.getElementById('musicSourceSelect');
    const uploadMusicFileInput = document.getElementById('uploadMusicFile');
    const applyMusicChangesBtn = document.getElementById('applyMusicChanges');
    const toggleMuteMusicBtn = document.getElementById('toggleMuteMusic');


    const viewAccessLogBtn = document.getElementById('viewAccessLogBtn');
    const accessLogModal = document.getElementById('accessLogModal');
    const closeAccessLogModalBtn = accessLogModal.querySelector('.close-button');
    const accessLogContent = document.getElementById('accessLogContent');
    const clearAccessLogBtn = document.getElementById('clearAccessLogBtn');

    const welcomeAnimationText = document.getElementById('welcomeAnimationText');
    const defaultWelcomeText = document.querySelector('.default-welcome-text');


    let isLoggedIn = false;
    let currentUserType = null;

    const validUsers = {
        student: { 'siswa1': 'kelasips' }, // Objek untuk menyimpan banyak akun siswa
        teacher: { 'Manda': 'MANDA123' },
        admin:   { 'Ghery': 'GHERY0987' }
    };

    // Fungsi untuk menyimpan pengaturan ke localStorage (BARU)
    function saveSettings() {
        const settings = {
            backgroundColor: document.body.style.backgroundColor,
            backgroundImage: document.body.style.backgroundImage,
            musicSrc: backgroundMusic ? backgroundMusic.src : 'none'
        };
        localStorage.setItem('websiteSettings', JSON.stringify(settings));
    }

    // Fungsi untuk memuat pengaturan dari localStorage (BARU)
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('websiteSettings'));
        if (settings) {
            if (settings.backgroundColor) {
                document.body.style.backgroundColor = settings.backgroundColor;
            }
            if (settings.backgroundImage) {
                document.body.style.backgroundImage = settings.backgroundImage;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
            }
            if (backgroundMusic && settings.musicSrc && settings.musicSrc !== 'none') {
                 // Check if the current src is different to avoid unnecessary reload
                if (backgroundMusic.src !== settings.musicSrc) {
                    backgroundMusic.src = settings.musicSrc;
                    backgroundMusic.load(); // Load the new source
                    // Attempt to play if already logged in, but will be handled by showWebsiteContent
                }
            } else if (backgroundMusic && settings.musicSrc === 'none') {
                backgroundMusic.pause();
                backgroundMusic.src = '';
            }
        }
    }


    function logAccess(username, userType, status) {
        const timestamp = new Date().toLocaleString('id-ID');
        const logEntry = { timestamp, username, userType, status };
        let logs = JSON.parse(localStorage.getItem('accessLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('accessLogs', JSON.stringify(logs));
    }

    function displayAccessLogs() {
        const logs = JSON.parse(localStorage.getItem('accessLogs')) || [];
        if (logs.length === 0) {
            accessLogContent.innerHTML = '<p>Belum ada aktivitas login.</p>';
            return;
        }
        accessLogContent.innerHTML = logs.map(log => 
            `<p><strong>[${log.timestamp}]</strong> User: ${log.username} (${log.userType}) - Status: ${log.status}</p>`
        ).join('');
    }

    function showAuthScreen() {
        authWrapper.style.display = 'flex';
        websiteContent.style.display = 'none';
        websiteContent.classList.remove('fade-in');
        isLoggedIn = false;
        currentUserType = null;
        createAnnouncementBtn.style.display = 'none';
        uploadPhotoBtn.style.display = 'none';
        createStudentAccountBtn.style.display = 'none';
        createTeacherAccountBtn.style.display = 'none'; // Sembunyikan tombol
        customizeWebsiteBtn.style.display = 'none'; // Sembunyikan tombol
        viewAccessLogBtn.style.display = 'none';

        welcomeAnimationText.style.display = 'none';
        defaultWelcomeText.classList.remove('hidden');

        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    }

    function showWebsiteContent() {
        authWrapper.style.display = 'none';
        websiteContent.style.display = 'block';
        websiteContent.classList.add('fade-in');

        defaultWelcomeText.classList.add('hidden');
        welcomeAnimationText.style.display = 'block';
        welcomeAnimationText.style.animation = 'none';
        welcomeAnimationText.offsetHeight; /* trigger reflow */
        welcomeAnimationText.style.animation = '';

        if (currentUserType === 'admin' || currentUserType === 'teacher') {
            createAnnouncementBtn.style.display = 'inline-flex';
            uploadPhotoBtn.style.display = 'inline-flex';
        } else {
            createAnnouncementBtn.style.display = 'none';
            uploadPhotoBtn.style.display = 'none';
        }

        // Tampilkan tombol admin
        if (currentUserType === 'admin') {
            createStudentAccountBtn.style.display = 'inline-flex';
            createTeacherAccountBtn.style.display = 'inline-flex'; // Tampilkan tombol
            customizeWebsiteBtn.style.display = 'inline-flex'; // Tampilkan tombol
            viewAccessLogBtn.style.display = 'inline-flex';
        } else {
            createStudentAccountBtn.style.display = 'none';
            createTeacherAccountBtn.style.display = 'none'; // Sembunyikan tombol
            customizeWebsiteBtn.style.display = 'none'; // Sembunyikan tombol
            viewAccessLogBtn.style.display = 'none';
        }

        if (backgroundMusic) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {}).catch(error => {
                    console.log("Autoplay dicegah. Pengguna perlu berinteraksi untuk memutar musik.", error);
                });
            }
        }
    }

    // Panggil loadSettings saat DOMContentLoaded (sebelum showAuthScreen)
    loadSettings();
    showAuthScreen();


    loginFormActual.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const selectedUserType = document.querySelector('input[name="userType"]:checked').value;

        loadingText.style.display = 'block';
        loadingText.classList.add('visible');
        loginButton.disabled = true;

        setTimeout(() => {
            loadingText.style.display = 'none';
            loadingText.classList.remove('visible');
            loginButton.disabled = false;

            let isAuthenticated = false;
            if (selectedUserType === 'student') {
                isAuthenticated = validUsers.student[username] === password;
            } else if (selectedUserType === 'teacher') {
                isAuthenticated = validUsers.teacher[username] === password;
            } else if (selectedUserType === 'admin') {
                isAuthenticated = validUsers.admin[username] === password;
            }
            
            if (isAuthenticated) {
                alert(`Login Berhasil sebagai ${selectedUserType.replace('student', 'Anggota Kelas').replace('teacher', 'Wali Kelas').replace('admin', 'Peluncur Website')}! Selamat datang!`);
                isLoggedIn = true;
                currentUserType = selectedUserType;
                showWebsiteContent();
                logAccess(username, selectedUserType, 'Berhasil');
            } else {
                alert('Username atau password salah, atau tipe pengguna tidak sesuai.');
                logAccess(username, selectedUserType, 'Gagal');
            }
            this.reset();
            document.getElementById('userTypeStudent').checked = true;
        }, 1500);
    });

    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Anda telah logout.');
        showAuthScreen();
        loginFormCard.style.display = 'block';
    });

    createAnnouncementBtn.addEventListener('click', function() {
        announcementModal.style.display = 'block';
    });

    closeAnnouncementModalBtn.addEventListener('click', function() {
        announcementModal.style.display = 'none';
        newAnnouncementForm.reset();
    });

    window.addEventListener('click', function(event) {
        if (event.target == announcementModal) {
            announcementModal.style.display = 'none';
            newAnnouncementForm.reset();
        }
        if (event.target == uploadPhotoModal) {
            uploadPhotoModal.style.display = 'none';
            newPhotoUploadForm.reset();
        }
        if (event.target == createStudentAccountModal) {
            createStudentAccountModal.style.display = 'none';
            newStudentAccountForm.reset();
        }
        if (event.target == createTeacherAccountModal) { // Tambahkan ini
            createTeacherAccountModal.style.display = 'none';
            newTeacherAccountForm.reset();
        }
        if (event.target == customizeWebsiteModal) { // Tambahkan ini
            customizeWebsiteModal.style.display = 'none';
        }
        if (event.target == accessLogModal) {
            accessLogModal.style.display = 'none';
        }
    });

    newAnnouncementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('announcementTitle').value;
        const content = document.getElementById('announcementContent').value;
        
        if (!title || !content) {
            alert('Judul dan isi pengumuman tidak boleh kosong!');
            return;
        }

        const today = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('id-ID', options);

        const newAnnouncementCard = document.createElement('div');
        newAnnouncementCard.classList.add('card');
        newAnnouncementCard.innerHTML = `
            <h4>${title}</h4>
            <p>${content}</p>
            <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        `;

        announcementsList.prepend(newAnnouncementCard);

        alert('Pengumuman berhasil ditambahkan!');
        announcementModal.style.display = 'none';
        newAnnouncementForm.reset();
    });

    uploadPhotoBtn.addEventListener('click', function() {
        uploadPhotoModal.style.display = 'block';
    });

    closeUploadPhotoModalBtn.addEventListener('click', function() {
        uploadPhotoModal.style.display = 'none';
        newPhotoUploadForm.reset();
    });

    newPhotoUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const photoFile = document.getElementById('photoFile').files[0];
        const photoCaption = document.getElementById('photoCaption').value;

        if (!photoFile || !photoCaption) {
            alert('Silakan pilih file foto dan isi keterangan foto!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;

            const newGalleryItem = document.createElement('div');
            newGalleryItem.classList.add('gallery-item');
            newGalleryItem.innerHTML = `
                <img src="${imageUrl}" alt="${photoCaption}">
                <p>${photoCaption}</p>
            `;
            galleryGrid.prepend(newGalleryItem);

            alert('Foto berhasil diupload!');
            uploadPhotoModal.style.display = 'none';
            newPhotoUploadForm.reset();
        };
        reader.readAsDataURL(photoFile);
    });

    createStudentAccountBtn.addEventListener('click', function() {
        createStudentAccountModal.style.display = 'block';
    });

    closeCreateStudentAccountModalBtn.addEventListener('click', function() {
        createStudentAccountModal.style.display = 'none';
        newStudentAccountForm.reset();
    });

    newStudentAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newStudentUsername = document.getElementById('newStudentUsername').value;
        const newStudentPassword = document.getElementById('newStudentPassword').value;
        const confirmNewStudentPassword = document.getElementById('confirmNewStudentPassword').value;

        if (!newStudentUsername || !newStudentPassword || !confirmNewStudentPassword) {
            alert('Semua field harus diisi!');
            return;
        }

        if (newStudentPassword !== confirmNewStudentPassword) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }

        if (validUsers.student[newStudentUsername]) {
            alert(`Username '${newStudentUsername}' sudah digunakan. Silakan pilih username lain.`);
            return;
        }

        validUsers.student[newStudentUsername] = newStudentPassword;
        console.log("Akun siswa baru dibuat:", newStudentUsername, newStudentPassword);
        console.log("Daftar siswa terbaru:", validUsers.student);

        alert(`Akun anggota kelas '${newStudentUsername}' berhasil dibuat!`);
        createStudentAccountModal.style.display = 'none';
        newStudentAccountForm.reset();
    });

    // --- Logika untuk Fitur Buat Akun Wali Kelas (BARU) ---
    createTeacherAccountBtn.addEventListener('click', function() {
        createTeacherAccountModal.style.display = 'block';
    });

    closeCreateTeacherAccountModalBtn.addEventListener('click', function() {
        createTeacherAccountModal.style.display = 'none';
        newTeacherAccountForm.reset();
    });

    newTeacherAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newTeacherUsername = document.getElementById('newTeacherUsername').value;
        const newTeacherPassword = document.getElementById('newTeacherPassword').value;
        const confirmNewTeacherPassword = document.getElementById('confirmNewTeacherPassword').value;

        if (!newTeacherUsername || !newTeacherPassword || !confirmNewTeacherPassword) {
            alert('Semua field harus diisi!');
            return;
        }

        if (newTeacherPassword !== confirmNewTeacherPassword) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }

        if (validUsers.teacher[newTeacherUsername]) {
            alert(`Username '${newTeacherUsername}' sudah digunakan. Silakan pilih username lain.`);
            return;
        }

        validUsers.teacher[newTeacherUsername] = newTeacherPassword;
        console.log("Akun wali kelas baru dibuat:", newTeacherUsername, newTeacherPassword);
        console.log("Daftar wali kelas terbaru:", validUsers.teacher);

        alert(`Akun wali kelas '${newTeacherUsername}' berhasil dibuat!`);
        createTeacherAccountModal.style.display = 'none';
        newTeacherAccountForm.reset();
    });


    // --- Logika untuk Fitur Pengaturan Tampilan Website (BARU) ---
    customizeWebsiteBtn.addEventListener('click', function() {
        // Update color picker dengan warna body saat ini
        backgroundColorInput.value = rgbToHex(document.body.style.backgroundColor) || '#f9f9f9';
        // Set nilai select musik saat ini
        if (backgroundMusic && backgroundMusic.src) {
            const currentSrc = backgroundMusic.src.split('/').pop(); // Ambil nama file saja
            const option = musicSourceSelect.querySelector(`option[value="${currentSrc}"]`);
            if (option) {
                musicSourceSelect.value = currentSrc;
            } else if (backgroundMusic.src && backgroundMusic.src !== 'none') {
                // Jika src tidak ada di daftar opsi, mungkin dari upload, tampilkan sebagai "Lagu Upload"
                // Atau biarkan "Lagu Default" terpilih jika ada, atau "Tidak Ada Musik"
                musicSourceSelect.value = 'none'; // Default ke none jika tidak dikenali
            } else {
                 musicSourceSelect.value = 'none';
            }
        } else {
            musicSourceSelect.value = 'none';
        }

        customizeWebsiteModal.style.display = 'block';
    });

    closeCustomizeWebsiteModalBtn.addEventListener('click', function() {
        customizeWebsiteModal.style.display = 'none';
    });

    // Terapkan Warna Latar Belakang
    applyBackgroundColorBtn.addEventListener('click', function() {
        document.body.style.backgroundColor = backgroundColorInput.value;
        document.body.style.backgroundImage = 'none'; // Hapus gambar latar jika ada
        saveSettings();
        alert('Warna latar belakang berhasil diterapkan!');
    });

    // Terapkan Gambar Latar Belakang
    applyBackgroundImageBtn.addEventListener('click', function() {
        const file = backgroundImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.body.style.backgroundImage = `url(${event.target.result})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
                document.body.style.backgroundColor = ''; // Hapus warna solid jika ada
                saveSettings();
                alert('Gambar latar belakang berhasil diterapkan!');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Pilih file gambar terlebih dahulu!');
        }
    });

    // Reset Latar Belakang
    resetBackgroundBtn.addEventListener('click', function() {
        document.body.style.backgroundColor = ''; // Reset ke default CSS
        document.body.style.backgroundImage = 'none'; // Hapus gambar
        saveSettings();
        alert('Latar belakang telah direset!');
    });

    // Terapkan Perubahan Musik
    applyMusicChangesBtn.addEventListener('click', function() {
        const selectedMusic = musicSourceSelect.value;
        const uploadedFile = uploadMusicFileInput.files[0];

        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                if (backgroundMusic) {
                    backgroundMusic.src = event.target.result;
                    backgroundMusic.load();
                    backgroundMusic.play();
                    backgroundMusic.muted = false; // Asumsi jika upload, user ingin mendengarkan
                    saveSettings();
                    alert('Musik baru dari file Anda berhasil diterapkan!');
                }
            };
            reader.readAsDataURL(uploadedFile);
        } else if (selectedMusic !== 'none') {
            if (backgroundMusic) {
                backgroundMusic.src = selectedMusic;
                backgroundMusic.load();
                backgroundMusic.play();
                backgroundMusic.muted = false; // Asumsi jika dipilih, user ingin mendengarkan
                saveSettings();
                alert('Musik berhasil diubah!');
            }
        } else { // 'none' dipilih
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.src = ''; // Hapus sumber musik
                saveSettings();
                alert('Musik latar dimatikan.');
            }
        }
    });

    toggleMuteMusicBtn.addEventListener('click', function() {
        if (backgroundMusic) {
            backgroundMusic.muted = !backgroundMusic.muted;
            if (!backgroundMusic.paused && !backgroundMusic.muted) {
                backgroundMusic.play(); // Pastikan play jika di-unmute
            } else if (!backgroundMusic.muted) { // Jika unmuted dan paused
                 backgroundMusic.play();
            }
            alert(`Musik sekarang ${backgroundMusic.muted ? 'di-mute' : 'aktif'}.`);
        }
    });

    // Helper function to convert RGB to Hex for color picker display
    function rgbToHex(rgb) {
        if (!rgb || rgb.startsWith('url')) return ''; // No RGB or is an image
        const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!rgbMatch) return '';
        const hex = num => ('0' + parseInt(num).toString(16)).slice(-2);
        return "#" + hex(rgbMatch[1]) + hex(rgbMatch[2]) + hex(rgbMatch[3]);
    }


    viewAccessLogBtn.addEventListener('click', function() {
        displayAccessLogs();
        accessLogModal.style.display = 'block';
    });

    closeAccessLogModalBtn.addEventListener('click', function() {
        accessLogModal.style.display = 'none';
    });

    clearAccessLogBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus semua log akses?')) {
            localStorage.removeItem('accessLogs');
            displayAccessLogs();
            alert('Log akses telah dibersihkan.');
        }
    });
});

        websiteContent.classList.remove('fade-in');
        isLoggedIn = false;
        currentUserType = null;
        createAnnouncementBtn.style.display = 'none';
        uploadPhotoBtn.style.display = 'none';
        createStudentAccountBtn.style.display = 'none';
        viewAccessLogBtn.style.display = 'none';

        // Sembunyikan teks animasi dan tampilkan teks default
        welcomeAnimationText.style.display = 'none';
        defaultWelcomeText.classList.remove('hidden');

        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    }

    function showWebsiteContent() {
        authWrapper.style.display = 'none';
        websiteContent.style.display = 'block';
        websiteContent.classList.add('fade-in');

        // Tampilkan teks animasi dan sembunyikan teks default
        defaultWelcomeText.classList.add('hidden'); // Sembunyikan teks selamat datang default
        welcomeAnimationText.style.display = 'block'; // Tampilkan teks animasi
        // Reset animasi agar bisa diputar ulang setiap kali login
        welcomeAnimationText.style.animation = 'none';
        welcomeAnimationText.offsetHeight; /* trigger reflow */
        welcomeAnimationText.style.animation = '';


        if (currentUserType === 'admin' || currentUserType === 'teacher') {
            createAnnouncementBtn.style.display = 'inline-flex';
            uploadPhotoBtn.style.display = 'inline-flex';
        } else {
            createAnnouncementBtn.style.display = 'none';
            uploadPhotoBtn.style.display = 'none';
        }

        if (currentUserType === 'admin') {
            createStudentAccountBtn.style.display = 'inline-flex';
            viewAccessLogBtn.style.display = 'inline-flex';
        } else {
            createStudentAccountBtn.style.display = 'none';
            viewAccessLogBtn.style.display = 'none';
        }

        if (backgroundMusic) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {}).catch(error => {
                    console.log("Autoplay dicegah. Pengguna perlu berinteraksi untuk memutar musik.", error);
                });
            }
        }
    }

    showAuthScreen();

    loginFormActual.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const selectedUserType = document.querySelector('input[name="userType"]:checked').value;

        loadingText.style.display = 'block';
        loadingText.classList.add('visible');
        loginButton.disabled = true;

        setTimeout(() => {
            loadingText.style.display = 'none';
            loadingText.classList.remove('visible');
            loginButton.disabled = false;

            let isAuthenticated = false;
            if (selectedUserType === 'student') {
                isAuthenticated = validUsers.student[username] === password;
            } else if (selectedUserType === 'teacher') {
                isAuthenticated = validUsers.teacher[username] === password;
            } else if (selectedUserType === 'admin') {
                isAuthenticated = validUsers.admin[username] === password;
            }
            
            if (isAuthenticated) {
                alert(`Login Berhasil sebagai ${selectedUserType.replace('student', 'Anggota Kelas').replace('teacher', 'Wali Kelas').replace('admin', 'Peluncur Website')}! Selamat datang!`);
                isLoggedIn = true;
                currentUserType = selectedUserType;
                showWebsiteContent();
                logAccess(username, selectedUserType, 'Berhasil');
            } else {
                alert('Username atau password salah, atau tipe pengguna tidak sesuai.');
                logAccess(username, selectedUserType, 'Gagal');
            }
            this.reset();
            document.getElementById('userTypeStudent').checked = true;
        }, 1500);
    });

    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Anda telah logout.');
        showAuthScreen();
        loginFormCard.style.display = 'block';
    });

    createAnnouncementBtn.addEventListener('click', function() {
        announcementModal.style.display = 'block';
    });

    closeAnnouncementModalBtn.addEventListener('click', function() {
        announcementModal.style.display = 'none';
        newAnnouncementForm.reset();
    });

    window.addEventListener('click', function(event) {
        if (event.target == announcementModal) {
            announcementModal.style.display = 'none';
            newAnnouncementForm.reset();
        }
        if (event.target == uploadPhotoModal) {
            uploadPhotoModal.style.display = 'none';
            newPhotoUploadForm.reset();
        }
        if (event.target == createStudentAccountModal) {
            createStudentAccountModal.style.display = 'none';
            newStudentAccountForm.reset();
        }
        if (event.target == accessLogModal) {
            accessLogModal.style.display = 'none';
        }
    });

    newAnnouncementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('announcementTitle').value;
        const content = document.getElementById('announcementContent').value;
        
        if (!title || !content) {
            alert('Judul dan isi pengumuman tidak boleh kosong!');
            return;
        }

        const today = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('id-ID', options);

        const newAnnouncementCard = document.createElement('div');
        newAnnouncementCard.classList.add('card');
        newAnnouncementCard.innerHTML = `
            <h4>${title}</h4>
            <p>${content}</p>
            <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        `;

        announcementsList.prepend(newAnnouncementCard);

        alert('Pengumuman berhasil ditambahkan!');
        announcementModal.style.display = 'none';
        newAnnouncementForm.reset();
    });

    uploadPhotoBtn.addEventListener('click', function() {
        uploadPhotoModal.style.display = 'block';
    });

    closeUploadPhotoModalBtn.addEventListener('click', function() {
        uploadPhotoModal.style.display = 'none';
        newPhotoUploadForm.reset();
    });

    newPhotoUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const photoFile = document.getElementById('photoFile').files[0];
        const photoCaption = document.getElementById('photoCaption').value;

        if (!photoFile || !photoCaption) {
            alert('Silakan pilih file foto dan isi keterangan foto!');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const imageUrl = event.target.result;

            const newGalleryItem = document.createElement('div');
            newGalleryItem.classList.add('gallery-item');
            newGalleryItem.innerHTML = `
                <img src="${imageUrl}" alt="${photoCaption}">
                <p>${photoCaption}</p>
            `;
            galleryGrid.prepend(newGalleryItem);

            alert('Foto berhasil diupload!');
            uploadPhotoModal.style.display = 'none';
            newPhotoUploadForm.reset();
        };
        reader.readAsDataURL(photoFile);
    });

    createStudentAccountBtn.addEventListener('click', function() {
        createStudentAccountModal.style.display = 'block';
    });

    closeCreateStudentAccountModalBtn.addEventListener('click', function() {
        createStudentAccountModal.style.display = 'none';
        newStudentAccountForm.reset();
    });

    newStudentAccountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newStudentUsername = document.getElementById('newStudentUsername').value;
        const newStudentPassword = document.getElementById('newStudentPassword').value;
        const confirmNewStudentPassword = document.getElementById('confirmNewStudentPassword').value;

        if (!newStudentUsername || !newStudentPassword || !confirmNewStudentPassword) {
            alert('Semua field harus diisi!');
            return;
        }

        if (newStudentPassword !== confirmNewStudentPassword) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }

        if (validUsers.student[newStudentUsername]) {
            alert(`Username '${newStudentUsername}' sudah digunakan. Silakan pilih username lain.`);
            return;
        }

        validUsers.student[newStudentUsername] = newStudentPassword;
        console.log("Akun siswa baru dibuat:", newStudentUsername, newStudentPassword);
        console.log("Daftar siswa terbaru:", validUsers.student);

        alert(`Akun anggota kelas '${newStudentUsername}' berhasil dibuat!`);
        createStudentAccountModal.style.display = 'none';
        newStudentAccountForm.reset();
    });

    viewAccessLogBtn.addEventListener('click', function() {
        displayAccessLogs();
        accessLogModal.style.display = 'block';
    });

    closeAccessLogModalBtn.addEventListener('click', function() {
        accessLogModal.style.display = 'none';
    });

    clearAccessLogBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin menghapus semua log akses?')) {
            localStorage.removeItem('accessLogs');
            displayAccessLogs();
            alert('Log akses telah dibersihkan.');
        }
    });
});

      
