// Global variables
let currentUser = null;
let map = null;
let currentStream = null;
let storedFaces = {};
let loginPhoto = null;
let registrationPhoto = null;
let currentLanguage = 'ar'; // Default language


// Go to correct page based on chosen role
function selectRole(role) {

    if (role === "student") {
        // صفحة تسجيل/دخول الطالب
        showScreen("welcome-screen");   // الطالب يذهب لنفس welcome لكن سنغير نصوصه لاحقاً لو أردت
    }

    if (role === "driver") {
        // صفحة السائق الحالية
        showScreen("welcome-screen");
    }

    // يمكنك تخزين الدور في localStorage لاستخدامه لاحقاً
    localStorage.setItem("userRole", role);
}

// Language translations
const translations = {
    ar: {
        // Welcome screen
        'welcome-title': 'وُصُـول',
        'welcome-subtitle': 'نظام النقل الجامعي الذكي',
        'login-btn': 'تسجيل الدخول',
        'register-btn': 'التسجيل',
        // Registration form
        'register-title': 'تسجيل السائق',
        'full-name': 'الاسم الكامل',
        'national-id': 'رقم الهوية',
        'truck-number': 'رقم الحافلة',
        'cargo-type': 'الحي ',
        'select-cargo': 'اختر الحي ',
        'general-cargo': 'المنسك ',
        'gas': 'المحالة',
        'refrigerated': 'الروضة',
        'live-animals': ' الموظفين',
        'containers': 'الخالدية',
        'driver-photo': 'صورة السائق',
        'start-camera': 'تشغيل الكاميرا',
        'capture-photo': 'التقاط صورة',
        'register': 'تسجيل',
        // Messages
        'photo-captured': 'تم التقاط الصورة!',
        'capture-before-register': 'التقط صورة قبل التسجيل.',
        'registration-success': 'تم التسجيل بنجاح!',
        'camera-error': 'خطأ في تشغيل الكاميرا.',
        'models-error': 'خطأ في تحميل النماذج.',
        'face-api-error': 'مكتبة اكتشاف الوجه غير موجودة.'
    },
    en: {
        // Welcome screen
        'welcome-title': 'Truck Driver Permit System',
        'welcome-subtitle': 'Secure travel permit requests for professional drivers',
        'login-btn': 'Login',
        'register-btn': 'Register',
        // Registration form
        'register-title': 'Driver Registration',
        'full-name': 'Full Name',
        'national-id': 'National ID',
        'truck-number': 'Truck Number',
        'cargo-type': 'Cargo Type',
        'select-cargo': 'Select cargo type',
        'general-cargo': 'General Cargo',
        'gas': 'Gas',
        'refrigerated': 'Refrigerated',
        'live-animals': 'Live Animals',
        'containers': 'Containers',
        'driver-photo': 'Driver Photo',
        'start-camera': 'Start Camera',
        'capture-photo': 'Capture Photo',
        'register': 'Register',
        // Messages
        'photo-captured': 'Photo captured!',
        'capture-before-register': 'Capture a photo before registering.',
        'registration-success': 'Registration successful!',
        'camera-error': 'Error starting camera.',
        'models-error': 'Error loading models.',
        'face-api-error': 'Face detection library not found.'
    },
    ur: {
        // Welcome screen
        'welcome-title': 'ٹرک ڈرائیور پرمٹ سسٹم',
        'welcome-subtitle': 'پیشہ ور ڈرائیوروں کے لیے محفوظ سفر کی اجازت کی درخواستیں',
        'login-btn': 'لاگ ان',
        'register-btn': 'رجسٹر',
        // Registration form
        'register-title': 'ڈرائیور رجسٹریشن',
        'full-name': 'پورا نام',
        'national-id': 'قومی شناختی کارڈ',
        'truck-number': 'ٹرک نمبر',
        'cargo-type': 'کارگو کی قسم',
        'select-cargo': 'کارگو کی قسم منتخب کریں',
        'general-cargo': 'عام کارگو',
        'gas': 'گیس',
        'refrigerated': 'ریفریجریٹڈ',
        'live-animals': 'زندہ جانور',
        'containers': 'کنٹینرز',
        'driver-photo': 'ڈرائیور کی تصویر',
        'start-camera': 'کیمرا شروع کریں',
        'capture-photo': 'تصویر کھینچیں',
        'register': 'رجسٹر',
        // Messages
        'photo-captured': 'تصویر کھینچی گئی!',
        'capture-before-register': 'رجسٹر کرنے سے پہلے تصویر کھینچیں۔',
        'registration-success': 'رجسٹریشن کامیاب!',
        'camera-error': 'کیمرا شروع کرنے میں خرابی۔',
        'models-error': 'ماڈلز لوڈ کرنے میں خرابی۔',
        'face-api-error': 'چہرہ شناخت کی لائبریری نہیں ملی۔'
    },
    bn: {
        // Welcome screen
        'welcome-title': 'ট্রাক ড্রাইভার পারমিট সিস্টেম',
        'welcome-subtitle': 'পেশাদার ড্রাইভারদের জন্য নিরাপদ ভ্রমণ পারমিট অনুরোধ',
        'login-btn': 'লগইন',
        'register-btn': 'নিবন্ধন',
        // Registration form
        'register-title': 'ড্রাইভার নিবন্ধন',
        'full-name': 'পূর্ণ নাম',
        'national-id': 'জাতীয় পরিচয়পত্র',
        'truck-number': 'ট্রাক নম্বর',
        'cargo-type': 'মালামালের ধরন',
        'select-cargo': 'মালামালের ধরন নির্বাচন করুন',
        'general-cargo': 'সাধারণ মালামাল',
        'gas': 'গ্যাস',
        'refrigerated': 'রেফ্রিজারেটেড',
        'live-animals': 'জীবন্ত প্রাণী',
        'containers': 'কন্টেইনার',
        'driver-photo': 'ড্রাইভারের ছবি',
        'start-camera': 'ক্যামেরা শুরু করুন',
        'capture-photo': 'ছবি তুলুন',
        'register': 'নিবন্ধন',
        // Messages
        'photo-captured': 'ছবি তোলা হয়েছে!',
        'capture-before-register': 'নিবন্ধনের আগে ছবি তুলুন।',
        'registration-success': 'নিবন্ধন সফল!',
        'camera-error': 'ক্যামেরা শুরু করতে ত্রুটি।',
        'models-error': 'মডেল লোড করতে ত্রুটি।',
        'face-api-error': 'মুখ সনাক্তকরণ লাইব্রেরি পাওয়া যায়নি।'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeApp();
    }, 1000);

    loadStoredData();
    setupEventListeners();
    updateLanguageUI();
    updateWelcomeScreenLanguage();
});

// Update language UI
function updateLanguageUI() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-lang') === currentLanguage) {
            item.classList.add('active');
        }
    });
}

// Toggle language dropdown
function toggleLanguageDropdown() {
    const dropdownMenu = document.getElementById('language-dropdown-menu');
    dropdownMenu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.custom-dropdown');
    const dropdownMenu = document.getElementById('language-dropdown-menu');
    
    if (dropdown && !dropdown.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});

// Change language function
function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguageUI();
    updateWelcomeScreenLanguage();
    updateRegisterFormLanguage();
    
    // Close dropdown after selection
    const dropdownMenu = document.getElementById('language-dropdown-menu');
    dropdownMenu.classList.remove('show');
}

// Update welcome screen language
function updateWelcomeScreenLanguage() {
    const lang = translations[currentLanguage];
    if (!lang) return;

    // Update welcome screen elements
    const welcomeTitle = document.getElementById('welcome-title');
    if (welcomeTitle) welcomeTitle.textContent = lang['welcome-title'];

    const welcomeSubtitle = document.getElementById('welcome-subtitle');
    if (welcomeSubtitle) welcomeSubtitle.textContent = lang['welcome-subtitle'];

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.textContent = lang['login-btn'];

    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) registerBtn.textContent = lang['register-btn'];

    // Update direction for different languages
    const welcomeScreen = document.getElementById('welcome-screen');
    if (currentLanguage === 'en') {
        welcomeScreen.style.direction = 'ltr';
        welcomeScreen.style.textAlign = 'left';
        // Update language dropdown position for English
        const languageDropdown = document.querySelector('.language-dropdown');
        if (languageDropdown) {
            languageDropdown.style.right = 'auto';
            languageDropdown.style.left = '20px';
        }
    } else {
        welcomeScreen.style.direction = 'rtl';
        welcomeScreen.style.textAlign = 'right';
        // Reset language dropdown position for RTL languages
        const languageDropdown = document.querySelector('.language-dropdown');
        if (languageDropdown) {
            languageDropdown.style.left = 'auto';
            languageDropdown.style.right = '20px';
        }
    }
}

// Update register form language
function updateRegisterFormLanguage() {
    const lang = translations[currentLanguage];
    if (!lang) return;

    // Update form labels and text
    const registerTitle = document.querySelector('#register-screen h2');
    if (registerTitle) registerTitle.textContent = lang['register-title'];

    const fullNameLabel = document.querySelector('#register-screen label[for="reg-name"]');
    if (fullNameLabel) fullNameLabel.textContent = lang['full-name'];

    const nationalIdLabel = document.querySelector('#register-screen label[for="reg-national-id"]');
    if (nationalIdLabel) nationalIdLabel.textContent = lang['national-id'];

    const truckNumberLabel = document.querySelector('#register-screen label[for="reg-truck-number"]');
    if (truckNumberLabel) truckNumberLabel.textContent = lang['truck-number'];

    const cargoTypeLabel = document.querySelector('#register-screen label[for="reg-cargo-type"]');
    if (cargoTypeLabel) cargoTypeLabel.textContent = lang['cargo-type'];

    const driverPhotoLabel = document.querySelector('#register-screen .form-group:last-child label');
    if (driverPhotoLabel) driverPhotoLabel.textContent = lang['driver-photo'];

    // Update select options
    const cargoSelect = document.getElementById('reg-cargo-type');
    if (cargoSelect) {
        cargoSelect.options[0].text = lang['select-cargo'];
        cargoSelect.options[1].text = lang['general-cargo'];
        cargoSelect.options[2].text = lang['gas'];
        cargoSelect.options[3].text = lang['refrigerated'];
        cargoSelect.options[4].text = lang['live-animals'];
        cargoSelect.options[5].text = lang['containers'];
    }

    // Update buttons
    const startCameraBtn = document.querySelector('#register-screen .photo-controls .btn-secondary');
    if (startCameraBtn) startCameraBtn.textContent = lang['start-camera'];

    const capturePhotoBtn = document.querySelector('#register-screen .photo-controls .btn-primary');
    if (capturePhotoBtn) capturePhotoBtn.textContent = lang['capture-photo'];

    const registerBtn = document.querySelector('#register-screen .btn-full');
    if (registerBtn) registerBtn.textContent = lang['register'];

    // Update direction for different languages
    const registerScreen = document.getElementById('register-screen');
    if (currentLanguage === 'en') {
        registerScreen.style.direction = 'ltr';
        registerScreen.style.textAlign = 'left';
    } else {
        registerScreen.style.direction = 'rtl';
        registerScreen.style.textAlign = 'right';
    }
}

// Initialize face-api.js
async function initializeApp() {
    try {
        if (typeof faceapi === 'undefined') {
            console.error('Face API not loaded.');
            showMessage(translations[currentLanguage]['face-api-error'], 'error');
            return;
        }

        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        console.log('✅ تم تحميل نماذج Face API');
    } catch (error) {
        console.error('Error loading models:', error);
        showMessage(translations[currentLanguage]['models-error'], 'error');
    }
}

// Load stored data from localStorage
function loadStoredData() {
    try {
        const storedUsers = localStorage.getItem('truckDrivers');
        if (storedUsers) storedFaces = JSON.parse(storedUsers);
    } catch (error) {
        console.error('Error loading stored data:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('register-form').addEventListener('submit', handleRegistration);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('permit-form').addEventListener('submit', handlePermitRequest);
    document.getElementById('permit-date').min = new Date().toISOString().split('T')[0];
}

// Face verification
async function verifyFace() {
    const statusElement = document.getElementById('verification-status');
    const nationalId = document.getElementById('login-national-id').value;

    if (!statusElement) return;
    if (!nationalId) {
        showMessage('أدخل رقم الهوية الوطنية.', 'error');
        return;
    }

    const currentPhoto = loginPhoto || window.loginPhoto;
    if (!currentPhoto) {
        showMessage('التقط صورة أولاً.', 'error');
        return;
    }

    if (!storedFaces[nationalId]) {
        statusElement.innerHTML = '✗ المستخدم غير موجود';
        statusElement.className = 'verification-status error';
        return;
    }

    try {
        statusElement.innerHTML = '<span class="loading"></span> جاري التحقق...';
        statusElement.className = 'verification-status processing';

        const storedImg = new Image();
        storedImg.src = storedFaces[nationalId].photo;

        const currentImg = new Image();
        currentImg.src = currentPhoto;

        await Promise.all([
            new Promise((res) => storedImg.onload = () => res()),
            new Promise((res) => currentImg.onload = () => res())
        ]);

        const storedDetection = await faceapi
            .detectSingleFace(storedImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        const currentDetection = await faceapi
            .detectSingleFace(currentImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

        if (!storedDetection || !currentDetection) {
            statusElement.innerHTML = '✗ لم يتم اكتشاف وجه.';
            statusElement.className = 'verification-status error';
            return;
        }

        const similarity = calculateFaceSimilarity(storedDetection, currentDetection);
        console.log('Similarity score:', similarity);

        if (similarity > 0.4) {
            statusElement.innerHTML = '✓ تم التحقق!';
            statusElement.className = 'verification-status success';
            window.faceVerified = true;
        } else {
            statusElement.innerHTML = '✗ فشل التحقق.';
            statusElement.className = 'verification-status error';
            window.faceVerified = false;
        }
    } catch (error) {
        console.error('Verification error:', error);
        statusElement.innerHTML = '✗ خطأ في التحقق.';
        statusElement.className = 'verification-status error';
    }
}

// Calculate face similarity
function calculateFaceSimilarity(d1, d2) {
    const l1 = d1.landmarks.positions;
    const l2 = d2.landmarks.positions;
    const n = Math.min(l1.length, l2.length);
    let total = 0;
    for (let i = 0; i < n; i++) {
        const dx = l1[i].x - l2[i].x;
        const dy = l1[i].y - l2[i].y;
        total += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.max(0, 1 - (total / n / 100));
}

// Capture photo
async function capturePhoto(type) {
    const video = document.getElementById(`${type}-video`);
    const canvas = document.getElementById(`${type}-canvas`);
    const preview = document.getElementById(`${type}-photo-preview`);
    const photoCapture = document.getElementById(`${type}-photo-capture`);
    
    if (!video || !canvas || !preview || !photoCapture) return;
    if (!currentStream) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    preview.innerHTML = `<img src="${photoData}" alt="الصورة الملتقطة">`;

    if (type === 'reg') registrationPhoto = photoData;
    else if (type === 'login') loginPhoto = photoData;

    // Ensure photo capture div remains visible
    photoCapture.style.display = 'block';
    
    // Automatically stop the camera after taking a picture
    stopCamera();
    
    showMessage(translations[currentLanguage]['photo-captured'], 'success');
}

// Start camera
async function startCamera(type) {
    stopCamera();
    const video = document.getElementById(`${type}-video`);
    const photoCapture = document.getElementById(`${type}-photo-capture`);
    
    if (!video || !photoCapture) return;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        currentStream = stream;
        video.style.display = 'block';
        
        // Ensure photo capture div remains visible
        photoCapture.style.display = 'block';
        
        await new Promise((res) => video.onloadedmetadata = () => { video.play(); res(); });
    } catch (error) {
        console.error('Error starting camera:', error);
        showMessage(translations[currentLanguage]['camera-error'], 'error');
    }
}

// Stop camera
function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    document.querySelectorAll('video').forEach(v => v.style.display = 'none');
}

// Registration
async function handleRegistration(e) {
    e.preventDefault();
    const userData = {
        name: document.getElementById('reg-name').value,
        nationalId: document.getElementById('reg-national-id').value,
        truckNumber: document.getElementById('reg-truck-number').value,
        cargoType: document.getElementById('reg-cargo-type').value,
        photo: registrationPhoto
    };

    if (!userData.photo) {
        showMessage(translations[currentLanguage]['capture-before-register'], 'error');
        return;
    }

    storedFaces[userData.nationalId] = userData;
    localStorage.setItem('truckDrivers', JSON.stringify(storedFaces));
    showMessage(translations[currentLanguage]['registration-success'], 'success');
    e.target.reset();
    document.getElementById('reg-photo-preview').innerHTML = '';
    showScreen('login-screen');
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    const nationalId = document.getElementById('login-national-id').value;

    if (!window.faceVerified) {
        showMessage('تحقق من الوجه أولاً.', 'error');
        return;
    }

    if (!storedFaces[nationalId]) {
        showMessage('المستخدم غير موجود.', 'error');
        return;
    }

    currentUser = storedFaces[nationalId];
    updateDashboard();
    showScreen('dashboard-screen');
    e.target.reset();
    loginPhoto = null;
    window.faceVerified = false;
}

// Dashboard update
function updateDashboard() {
    if (!currentUser) return;
    document.getElementById('driver-photo').src = currentUser.photo;
    document.getElementById('driver-name').textContent = currentUser.name;
    document.getElementById('driver-national-id').textContent = `الهوية: ${currentUser.nationalId}`;
    document.getElementById('driver-truck-number').textContent = `الشاحنة: ${currentUser.truckNumber}`;
    document.getElementById('driver-cargo-type').textContent = `الشحنة: ${currentUser.cargoType}`;
}

// Permit request
function handlePermitRequest(e) {
    e.preventDefault();
    const permitData = {
        id: Date.now().toString(),
        date: document.getElementById('permit-date').value,
        timeSlot: document.getElementById('permit-time').value,
        route: document.getElementById('permit-route').value,
        purpose: document.getElementById('permit-purpose').value,
        status: 'pending',
        driverId: currentUser.nationalId,
        driverName: currentUser.name,
        timestamp: new Date().toISOString()
    };

    const permits = JSON.parse(localStorage.getItem('permits') || '[]');
    permits.push(permitData);
    localStorage.setItem('permits', JSON.stringify(permits));

    showMessage('تم إرسال طلب التصريح!', 'success');
    e.target.reset();
    showScreen('map-screen');
}

// Show messages
function showMessage(message, type = 'success') {
    const existing = document.querySelectorAll('.message');
    existing.forEach(el => el.remove());

    const el = document.createElement('div');
    el.className = `message ${type}`;
    el.textContent = message;

    const screen = document.querySelector('.screen.active');
    screen.insertBefore(el, screen.firstChild);

    setTimeout(() => {
        if (el.parentNode) el.remove();
    }, 5000);
}

// Switch screens
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    stopCamera();
    
    // Update language when showing register screen
    if (id === 'register-screen') {
        updateLanguageUI();
        updateRegisterFormLanguage();
    }
}

// Logout function
function logout() {
    currentUser = null;
    loginPhoto = null;
    registrationPhoto = null;
    window.faceVerified = false;
    showScreen('welcome-screen');
    showMessage('تم تسجيل الخروج بنجاح', 'success');
}

localStorage.clear(); // يحذف كل البيانات السابقة عند تحميل الصفحة
