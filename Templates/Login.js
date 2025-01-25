// אלמנטים של תצוגות
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const switchToForgotPassword = document.getElementById('switch-to-forgot-password');
const switchToLoginFromForgot = document.getElementById('switch-to-login-from-forgot');

const loginContainer = document.querySelector('.login-container');
const registerContainer = document.querySelector('.register-container');
const forgotPasswordContainer = document.querySelector('.forgot-password-container');

// מעבר לתצוגת הרשמה
switchToRegister.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});

// מעבר לתצוגת התחברות
switchToLogin.addEventListener('click', () => {
    registerContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// מעבר לתצוגת שחזור סיסמה
switchToForgotPassword.addEventListener('click', () => {
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
});

// חזרה לתצוגת התחברות משחזור סיסמה
switchToLoginFromForgot.addEventListener('click', () => {
    forgotPasswordContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// טיפול בטופס הרשמה
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const Name = document.querySelector('input[name="Name"]').value;
    const UserName = document.querySelector('input[name="UserName"]').value;
    const Email = document.querySelector('input[name="Email"]').value;
    const Password = document.querySelector('input[name="Password"]').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, UserName, Email, Password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('הרשמה בוצעה בהצלחה!');
            location.reload(); // רענון הדף לאחר הרשמה מוצלחת
        } else {
            alert(`שגיאה בהרשמה: ${data.message}`);
        }
    } catch (error) {
        console.error('שגיאה בשליחת הבקשה:', error);
        alert('שגיאה בשרת');
    }
});

document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`הסיסמה שלך היא: ${data.password}`);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('שגיאה בשליחת הבקשה:', error);
        alert('שגיאה בשרת');
    }
});



// בדיקה אם המשתמש מחובר
document.addEventListener('DOMContentLoaded', async () => {
    const userMenu = document.getElementById('user-menu');

    try {
        const response = await fetch('/get-session');
        const data = await response.json();

        if (response.ok && data.username) {
            let adminControl = '';
            if (data.isAdmin) {
                adminControl = `<a href="/admin" style="color:blue; margin-left: 10px;">בקרת אדמין</a>`;
            }

            userMenu.innerHTML = `
                שלום, ${data.username}!
                ${adminControl}
                <a href="/logout" style="color:red; margin-left: 10px;">התנתק</a>
            `;
        } else {
            userMenu.innerHTML = `<a href="Templates/Login.html">התחבר/הרשם</a>`;
        }
    } catch (error) {
        console.error('שגיאה בבדיקה אם המשתמש מחובר:', error);
        userMenu.innerHTML = `<a href="Templates/Login.html">התחבר/הרשם</a>`;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("registration-popup");
    const closePopup = document.getElementById("close-popup");

    // הצגת הפופאפ אם המשתמש הופנה מדף הבית
    if (localStorage.getItem("showRegistrationPopup") === "true") {
        popup.style.display = "block";
        localStorage.removeItem("showRegistrationPopup");
    }

    // סגירת הפופאפ
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });
      // הסתרת הפופאפ כאשר המשתמש מתחיל להקליד בתיבת ההזנה
    const inputFields = document.querySelectorAll('input[name="username"], input[name="password"]');
    inputFields.forEach((input) => {
        input.addEventListener("input", () => {
            popup.style.display = "none";
          });
      });
  });