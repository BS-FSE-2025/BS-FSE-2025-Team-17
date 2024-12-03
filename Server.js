const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// משתמש אדמין מוגדר מראש
const adminUsername = "admin1"; // שם המשתמש של האדמין
const adminPassword = "123456"; // סיסמת האדמין

// מידלוור
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Templates')));
app.use(express.static(__dirname));

// נתיב ראשי
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'Login.html'));
});

// התחברות
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'חסרים פרטי התחברות' });
    }

    if (username === adminUsername && password === adminPassword) {
        // משתמש אדמין
        return res.redirect('/admin');
    }

    // חיבור למסד נתונים
    const db = new sqlite3.Database(path.join(__dirname, 'DataBase', 'Data.db'), sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד נתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    // בדיקת משתמש רגיל
    const query = 'SELECT * FROM Users WHERE userName = ? AND password = ?';
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('שגיאה בבדיקת משתמש:', err.message);
            return res.status(500).json({ message: 'שגיאה בבדיקת משתמש' });
        }

        if (row) {
            // התחברות מוצלחת
            return res.redirect('/user');
        } else {
            // משתמש לא נמצא
            return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
        }
    });

    db.close((err) => {
        if (err) {
            console.error('שגיאה בסגירת מסד נתונים:', err.message);
        }
    });
});

// דף אדמין
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'Admin.html'));
});

// דף משתמש רגיל
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
