const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// משתמש אדמין מוגדר מראש
const adminUsername = "admin1"; // שם משתמש של האדמין
const adminPassword = "123456"; // סיסמת האדמין

// מידלוור
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Templates')));
app.use(express.static(__dirname));

// נתיב ראשי
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});

// התחברות
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'חסרים פרטי התחברות' });
    }

    if (username === adminUsername && password === adminPassword) {
        return res.redirect('/admin');
    }

    // חיבור למסד הנתונים
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
            return res.redirect('/user');
        } else {
            return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
        }
    });

    db.close();
});

// דף אדמין
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'Admin.html'));
});

// דף משתמש רגיל
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});

// פונקציה כללית לשליפת נתונים מטבלה
function fetchFromTable(res, tableName) {
    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(`שגיאה בפתיחת מסד הנתונים: ${err.message}`);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `SELECT * FROM "${tableName}"`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(`שגיאה בשליפת נתונים מטבלה ${tableName}: ${err.message}`);
            return res.status(500).json({ message: `שגיאה בשליפת נתונים מטבלה ${tableName}` });
        }
        console.log(`נתונים מטבלה ${tableName}:`, rows);
        res.json(rows);
    });

    db.close((err) => {
        if (err) {
            console.error(`שגיאה בסגירת מסד נתונים: ${err.message}`);
        }
    });
}

// נתיבים כלליים לשליפת נתונים
app.get('/get-halls', (req, res) => fetchFromTable(res, 'Hall'));
app.get('/get-photographers', (req, res) => fetchFromTable(res, 'photos'));
app.get('/get-djs', (req, res) => fetchFromTable(res, 'DJ'));
app.get('/get-bars', (req, res) => fetchFromTable(res, 'Bars'));
app.get('/get-design', (req, res) => fetchFromTable(res, 'Design'));
app.get('/get-bridal', (req, res) => fetchFromTable(res, 'Bridal clothes'));
app.get('/get-grooms', (req, res) => fetchFromTable(res, 'Grooms clothes'));
app.get('/get-Arrival_confirmation_companies', (req, res) => fetchFromTable(res, 'Arrival confirmation companies'));
app.get('/get-makeup', (req, res) => fetchFromTable(res, 'Makeup')); // מאפרת

// הוספת נתיב POST להזנת נתונים לטבלת Contact // שחר שים לב! מכאן הוספתי בדף הזה
app.post('/submitContact', (req, res) => {
    const { name, contact, information } = req.body;

    // בדיקה אם כל השדות מולאו
    if (!name || !contact || !information) {
        return res.status(400).json({ message: 'יש למלא את כל השדות הנדרשים' });
    }

    // חיבור למסד הנתונים
    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    // הכנסת הנתונים לטבלת Contact
    const query = `INSERT INTO Contact (Name, Contact, Information) VALUES (?, ?, ?)`;
    db.run(query, [name, contact, information], function (err) {
        if (err) {
            console.error('שגיאה בהכנסת הנתונים:', err.message); // מדפיס הודעה ברורה
            return res.status(500).json({ message: 'שגיאה בהכנסת הנתונים' });
        }
        res.status(200).json({ message: 'הנתונים נשמרו בהצלחה', id: this.lastID });
    });
    
    db.close();
});
// שחר שים לב - כאן הפסקתי!



// טיפול בשגיאות
app.use((req, res, next) => {
    res.status(404).send('עמוד לא נמצא');
});

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
