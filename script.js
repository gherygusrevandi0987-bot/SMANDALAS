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

    const viewAccessLogBtn = document.getElementById('viewAccessLogBtn');
    const accessLogModal = document.getElementById('accessLogModal');
    const closeAccessLogModalBtn = accessLogModal.querySelector('.close-button');
    const accessLogContent = document.getElementById('accessLogContent');
    const clearAccessLogBtn = document.getElementById('clearAccessLogBtn');

    // Elemen untuk teks animasi sambutan (BARU)
    const welcomeAnimationText = document.getElementById('welcomeAnimationText');
    const defaultWelcomeText = document.querySelector('.default-welcome-text');


    let isLoggedIn = false;
    let currentUserType = null;

    const validUsers = {
        student: { 'siswa1': 'kelasips' },
        teacher: { 'Manda': 'MANDA123' },
        admin:   { 'Ghery': 'GHERY0987' }
    };

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

      
