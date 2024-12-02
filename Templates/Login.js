const loginFields = document.getElementById('login-fields');
const registerFields = document.getElementById('register-fields');
const switchMode = document.getElementById('switch-mode');
const registerLink = document.getElementById('register-link');
const pageTitle = document.getElementById('page-title');

// מעבר בין התחברות להרשמה
switchMode.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginFields.style.display === 'none') {
        loginFields.style.display = 'block';
        registerFields.style.display = 'none';
        pageTitle.textContent = 'התחברות';
        switchMode.innerHTML = 'אין לך חשבון? <a href="#" id="register-link">הרשם כאן</a>';
    } else {
        loginFields.style.display = 'none';
        registerFields.style.display = 'block';
        pageTitle.textContent = 'הרשמה';
        switchMode.innerHTML = 'כבר יש לך חשבון? <a href="#" id="login-link">התחבר כאן</a>';
    }
});
