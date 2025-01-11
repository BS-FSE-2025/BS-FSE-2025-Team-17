const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

const adminUsername = "admin1"; // שם משתמש של האדמין
const adminPassword = "123456"; // סיסמת האדמין

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Templates')));
app.use(express.static(__dirname));
app.use(session({
    secret: 'yourSecretKey', // מפתח סודי להצפנה
    resave: false,
    saveUninitialized: true
}));

// נתיב ראשי
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});
//הרשמה
app.post('/register', (req, res) => {
    const { Name, UserName, Email, Password } = req.body;

    if (!Name || !UserName || !Email || !Password) {
        return res.status(400).json({ message: 'יש למלא את כל השדות הנדרשים' });
    }

    const db = new sqlite3.Database('./DataBase/Data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = 'INSERT INTO Users (Name, UserName, Email, Password) VALUES (?, ?, ?, ?)';
    db.run(query, [Name, UserName, Email, Password], function (err) {
        if (err) {
            console.error('שגיאה בהוספת המשתמש:', err.message);
            return res.status(500).json({ message: 'שגיאה בהוספת המשתמש' });
        }
        res.status(200).json({ message: 'הרשמה בוצעה בהצלחה', id: this.lastID });
    });

    db.close();
});

// התחברות
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'חסרים פרטי התחברות' });
    }

    if (username === adminUsername && password === adminPassword) {
        req.session.username = username;
        req.session.isAdmin = true; // הגדרת המשתמש כאדמין
        return res.redirect('/admin');
    }

    const db = new sqlite3.Database('./DataBase/Data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `SELECT * FROM Users WHERE UserName = ? AND Password = ?`;
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('שגיאה בבדיקת משתמש:', err.message);
            return res.status(500).json({ message: 'שגיאה בבדיקת משתמש' });
        }

        if (row) {
            req.session.username = row.Name; // שמירת השם המלא
            req.session.isAdmin = false; // המשתמש אינו אדמין
            res.redirect('/user');
        } else {
            res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
        }
    });

    db.close((err) => {
        if (err) {
            console.error('שגיאה בסגירת מסד הנתונים:', err.message);
        }
    });
});



app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('שגיאה בניתוק:', err.message);
            return res.status(500).json({ message: 'שגיאה בניתוק' });
        }
        res.redirect('/out'); // חזרה לדף הבית לאחר התנתקות
    });
});
app.get('/get-session', (req, res) => {
    if (req.session.username) {
        res.json({
            username: req.session.username,
            isAdmin: req.session.isAdmin || false, // ודא שהמאפיין נשלח
        });
    } else {
        res.json({ username: null, isAdmin: false });
    }
});

// דף אדמין
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'Admin.html'));
});

// דף משתמש רגיל
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});
app.get('/out', (req, res) => {
    res.sendFile(path.join(__dirname, 'Templates', 'HomePage.html'));
});



// פונקציה עבור כל טבלה לשליפת נתונים מטבלה
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


// תיקון בנתיב המחיקה למחיקת משתמש לפי ID
app.delete('/delete-user/:id', (req, res) => {
    const userId = req.params.id; // קבלת מזהה המשתמש
    console.log('מחיקת משתמש עם מזהה:', userId);

    const db = new sqlite3.Database('./DataBase/Data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `DELETE FROM Users WHERE id = ?`; // משתמש ב-ID למחיקה
    db.run(query, [userId], function (err) {
        if (err) {
            console.error('שגיאה במחיקת המשתמש:', err.message);
            return res.status(500).json({ message: 'שגיאה במחיקת המשתמש' });
        }

        if (this.changes > 0) {
            res.status(200).json({ message: 'המשתמש נמחק בהצלחה' });
        } else {
            res.status(404).json({ message: 'המשתמש לא נמצא' });
        }
    });

    db.close();
});


app.get('/get-users', (req, res) => fetchFromTable(res, 'Users'));
app.get('/get-halls', (req, res) => fetchFromTable(res, 'Hall'));
app.get('/get-photographers', (req, res) => fetchFromTable(res, 'photos'));
app.get('/get-djs', (req, res) => fetchFromTable(res, 'DJ'));
app.get('/get-bars', (req, res) => fetchFromTable(res, 'Bars'));
app.get('/get-design', (req, res) => fetchFromTable(res, 'Design'));
app.get('/get-bridal', (req, res) => fetchFromTable(res, 'Bridal clothes'));
app.get('/get-grooms', (req, res) => fetchFromTable(res, 'Grooms clothes'));
app.get('/get-Arrival_confirmation_companies', (req, res) => fetchFromTable(res, 'Arrival confirmation companies'));
app.get('/get-makeup', (req, res) => fetchFromTable(res, 'Makeup')); // מאפרת

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
app.post('/add-supplier', (req, res) => {
    const { שם, איזור, עיר, מחיר, התמחות, 'סגנון מוזיקלי': style } = req.body;
    // פה תוכל להוסיף שדות מותאמים לכל סוג ספק בהתאם לשדות שהגדרת
});

//contact 
app.get('/get-contacts', (req, res) => {
    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = 'SELECT ID, Name, Contact, Information, Status FROM Contact';
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('שגיאה בשליפת נתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה בשליפת נתונים' });
        }
        res.json(rows);
    });

    db.close();
});


// טיפול בשגיאות
app.use((req, res, next) => {
    res.status(404).send('עמוד לא נמצא');
});
app.put('/update-contact-status/:ID', (req, res) => {
    const { ID } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'סטטוס חסר' });
    }

    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `UPDATE Contact SET Status = ? WHERE ID = ?`;
    db.run(query, [status, id], function (err) {
        if (err) {
            console.error('שגיאה בעדכון הסטטוס:', err.message);
            return res.status(500).json({ message: 'שגיאה בעדכון הסטטוס' });
        }

        res.status(200).json({ message: 'הסטטוס עודכן בהצלחה' });
    });

    db.close();
});
app.put('/update-contact-status/:id', (req, res) => {
    const contactId = req.params.id;
    const newStatus = req.body.status;

    const db = new sqlite3.Database('./DataBase/Data.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `UPDATE Contact SET Status = ? WHERE id = ?`;
    db.run(query, [newStatus, contactId], function (err) {
        if (err) {
            console.error('שגיאה בעדכון הסטטוס:', err.message);
            return res.status(500).json({ message: 'שגיאה בעדכון הסטטוס' });
        }

        if (this.changes > 0) {
            res.status(200).json({ message: 'הסטטוס עודכן בהצלחה' });
        } else {
            res.status(404).json({ message: 'הפנייה לא נמצאה' });
        }
    });

    db.close();
});
// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});