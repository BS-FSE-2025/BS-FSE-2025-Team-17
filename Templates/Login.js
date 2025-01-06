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

document.addEventListener('DOMContentLoaded', async () => {
    const userMenu = document.getElementById('user-menu');
    console.log('User menu element:', userMenu); // בדיקת אלמנט

    try {
        const response = await fetch('/get-session');
        const data = await response.json();
        console.log('Session data from server:', data); // בדיקת המידע שהגיע מהשרת

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
            console.log('User menu updated:', userMenu.innerHTML); // בדיקת תוכן מעודכן
        } else {
            userMenu.innerHTML = `<a href="Templates/Login.html">התחבר/הרשם</a>`;
        }
    } catch (error) {
        console.error('שגיאה בבדיקה אם המשתמש מחובר:', error);
        userMenu.innerHTML = `<a href="Templates/Login.html">התחבר/הרשם</a>`;
    }
});


