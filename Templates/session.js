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
                adminControl = `<a href="Admin.html" style="color:blue; margin-left: 10px;">בקרת אדמין</a>`;
            }

            userMenu.innerHTML = `
                שלום, ${data.username}!
                ${adminControl}
                <a href="/logout" style="color:red; margin-left: 10px;">התנתק</a>
            `;
            console.log('User menu updated:', userMenu.innerHTML); // בדיקת תוכן מעודכן
        } else {
            userMenu.innerHTML = `<a href="Login.html">התחבר/הרשם</a>`;
        }
    } catch (error) {
        console.error('שגיאה בבדיקה אם המשתמש מחובר:', error);
        userMenu.innerHTML = `<a href="Login.html">התחבר/הרשם</a>`;
    }
});
