// מעבר לתצוגת הרשמה
const switchToRegister = document.getElementById('switch-to-register');
// מעבר לתצוגת התחברות
const switchToLogin = document.getElementById('switch-to-login');
// תצוגות התחברות והרשמה
const loginContainer = document.querySelector('.login-container');
const registerContainer = document.querySelector('.register-container');

// הצגת תצוגת הרשמה
switchToRegister.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});

// הצגת תצוגת התחברות
switchToLogin.addEventListener('click', () => {
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});
