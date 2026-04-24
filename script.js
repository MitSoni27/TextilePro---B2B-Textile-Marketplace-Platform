// Initialize Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 800,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'fade',
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-overlay');

function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobileMenu);

document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

function toggleTheme() {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') body.classList.add('dark-theme');

// Auth Modal
const authModal = document.getElementById('authModal');
const navLoginBtn = document.getElementById('navLoginBtn');
const navRegisterBtn = document.getElementById('navRegisterBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
const heroRegisterBtn = document.getElementById('heroRegisterBtn');
const closeAuth = document.getElementById('closeAuth');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');

function openModal(type) {
    if (authModal) {
        authModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        authTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === type) tab.classList.add('active');
        });
        
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${type}Form`) form.classList.add('active');
        });
        
        resetRecaptcha();
    }
}

function closeModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (navLoginBtn) navLoginBtn.addEventListener('click', () => openModal('login'));
if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openModal('register'));
if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => openModal('login'));
if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', () => openModal('register'));
if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => openModal('register'));
if (closeAuth) closeAuth.addEventListener('click', closeModal);

if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });
}

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${tabId}Form`) form.classList.add('active');
        });
        resetRecaptcha();
    });
});

// Switch between forms
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('register');
    });
}

if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
    });
}

// Profile Image Upload
const profileImage = document.getElementById('profileImage');
const profilePreview = document.getElementById('profilePreview');
const fileNameSpan = document.getElementById('fileName');

if (profileImage) {
    profileImage.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showNotification('File size should be less than 2MB', 'error');
                this.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                if (profilePreview) {
                    profilePreview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                }
            };
            reader.readAsDataURL(file);
            if (fileNameSpan) fileNameSpan.textContent = file.name;
        }
    });
}

// Recaptcha
let recaptchaVerified = false;
const recaptchaBox = document.getElementById('recaptchaBox');
const recaptchaCheckbox = document.getElementById('recaptchaCheckbox');

function resetRecaptcha() {
    recaptchaVerified = false;
    if (recaptchaCheckbox) {
        recaptchaCheckbox.classList.remove('checked');
        recaptchaCheckbox.innerHTML = '';
    }
}

if (recaptchaBox) {
    recaptchaBox.addEventListener('click', () => {
        if (!recaptchaVerified) {
            if (recaptchaCheckbox) recaptchaCheckbox.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            setTimeout(() => {
                recaptchaVerified = true;
                if (recaptchaCheckbox) {
                    recaptchaCheckbox.innerHTML = '<i class="fas fa-check"></i>';
                    recaptchaCheckbox.classList.add('checked');
                }
                showNotification('Verification successful!', 'success');
            }, 1500);
        } else {
            recaptchaVerified = false;
            if (recaptchaCheckbox) {
                recaptchaCheckbox.innerHTML = '';
                recaptchaCheckbox.classList.remove('checked');
            }
        }
    });
}

// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            closeModal();
            if (navLoginBtn) navLoginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            if (navRegisterBtn) navRegisterBtn.style.display = 'none';
            if (mobileLoginBtn) mobileLoginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
            loginForm.reset();
        }, 2000);
    });
}

// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!recaptchaVerified) {
            showNotification('Please verify that you are not a robot', 'error');
            return;
        }
        
        const businessName = document.getElementById('businessName')?.value;
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (!businessName || !password || !confirmPassword) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        if (!document.getElementById('terms')?.checked) {
            showNotification('Please accept Terms of Service', 'error');
            return;
        }
        
        showNotification(`Registration successful! Welcome ${businessName}!`, 'success');
        setTimeout(() => {
            closeModal();
            if (navLoginBtn) navLoginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            if (navRegisterBtn) navRegisterBtn.style.display = 'none';
            if (mobileLoginBtn) mobileLoginBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
            registerForm.reset();
            resetRecaptcha();
            if (profilePreview) profilePreview.innerHTML = '<i class="fas fa-user-tie"></i>';
            if (fileNameSpan) fileNameSpan.textContent = 'No file chosen';
        }, 3000);
    });
}

// Notification Function
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#0f766e' : type === 'error' ? '#dc2626' : '#d97706';
    
    notification.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;">✕</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 14px;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 280px;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Cart functionality
let cartCount = 0;
const cartCountSpan = document.querySelector('.cart-count');

document.querySelectorAll('.quote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (navLoginBtn && navLoginBtn.innerHTML.includes('Login')) {
            showNotification('Please login to request quotes', 'info');
            openModal('login');
            return;
        }
        cartCount++;
        if (cartCountSpan) cartCountSpan.textContent = cartCount;
        showNotification('Inquiry added to cart!', 'success');
    });
});

// Forgot password
const forgotPassword = document.getElementById('forgotPassword');
if (forgotPassword) {
    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your registered business email:');
        if (email) showNotification(`Reset link sent to ${email}`, 'info');
    });
}

// Newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        if (email) showNotification('Subscribed successfully!', 'success');
        newsletterForm.reset();
    });
}

// Smooth scroll for anchor links (FIXED - No lag)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href && href !== '#' && href !== '#home' && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add animation style
if (!document.querySelector('#notification-style')) {
    const style = document.createElement('style');
    style.id = 'notification-style';
    style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
    document.head.appendChild(style);
}

console.log('TextilePro Loaded Successfully!');