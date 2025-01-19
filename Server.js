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
// שחזור סיסמה
app.post('/recover-password', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'יש לספק כתובת מייל' });
    }

    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = 'SELECT Password FROM Users WHERE Email = ?';
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error('שגיאה בשליפת הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה בשליפת הנתונים' });
        }

        if (row) {
            // מחזיר את הסיסמה אם המייל נמצא
            return res.status(200).json({ message: 'הסיסמה נמצאה', password: row.Password });
        } else {
            // הודעה אם המייל לא נמצא
            return res.status(404).json({ message: 'המייל לא נמצא במערכת' });
        }
    });

    db.close((err) => {
        if (err) {
            console.error('שגיאה בסגירת מסד הנתונים:', err.message);
        }
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

app.delete('/delete-supplier/:supplierType/:supplierName', (req, res) => {
    const { supplierType, supplierName } = req.params;
    const tableNameMap = {
        halls: "Hall",
        photographers: "photos",
        djs: "DJ",
        bars: "Bars",
        design: "Design",
        bridal: "Bridal clothes",
        grooms: "Grooms clothes",
        arrival_confirmation_companies: "Arrival confirmation companies",
        makeup: "Makeup"
    };

    const tableName = tableNameMap[supplierType];
    if (!tableName) {
        return res.status(400).json({ message: 'סוג ספק לא חוקי' });
    }

    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `DELETE FROM "${tableName}" WHERE "שם" = ?`;
    db.run(query, [supplierName], function (err) {
        if (err) {
            console.error('שגיאה במחיקת הספק:', err.message);
            return res.status(500).json({ message: 'שגיאה במחיקת הספק' });
        }

        if (this.changes > 0) {
            res.status(200).json({ message: 'הספק הוסר בהצלחה' });
        } else {
            res.status(404).json({ message: 'הספק לא נמצא' });
        }
    });

    db.close();
});


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




const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
console.log('Connecting to database at:', dbPath); // הוספת לוג לבדיקה
const db = new sqlite3.Database(dbPath);

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

// הזנת דירוג באתר
app.post('/submitReview', (req, res) => {
    const { name, city, content, stars } = req.body;

    if (!name || !stars) {
        return res.status(400).json({ message: 'נא למלא את השדות החובה: שם ודירוג!' });
    }

    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = `INSERT INTO Reviews (Name, City, Content, Stars) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, city, content, stars], function (err) {
        if (err) {
            console.error('שגיאה בהכנסת הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה בהכנסת הנתונים' });
        }
        res.status(200).json({ message: 'המידע נשמר בהצלחה!', id: this.lastID });
    });

    db.close();
});

// צפייה בפניות יצירת קשר
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
        db.close();
    });

    
});
// צפייה בדירוגים
app.get("/get-reviews", (req, res) => {
    const query = "SELECT Name, City, Content, Stars FROM Reviews";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("שגיאה בשליפת הנתונים:", err.message);
            res.status(500).json({ error: "שגיאה בשליפת הנתונים" });
        } else {
            res.json(rows);
        }
    });
});
// מחיקת פניות ממסד הנתונים
app.delete('/delete-contact/:id', (req, res) => {
    const contactId = req.params.id;

    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
            return res.status(500).json({ message: 'שגיאה במסד הנתונים' });
        }
    });

    const query = 'DELETE FROM Contact WHERE ID = ?';
    db.run(query, [contactId], function (err) {
        if (err) {
            console.error('שגיאה במחיקת הפנייה:', err.message);
            return res.status(500).json({ message: 'שגיאה במחיקת הפנייה' });
        }

        if (this.changes > 0) {
            res.status(200).json({ message: 'הפנייה נמחקה בהצלחה' });
        } else {
            res.status(404).json({ message: 'הפנייה לא נמצאה' });
        }        
        db.close();
    });

});
  
app.use(bodyParser.json());

app.post('/add-supplier', (req, res) => {
    const { supplier_type, fields } = req.body;

    console.log('Received supplier type:', supplier_type);
    console.log('Received fields:', fields);

    // בדיקת תקינות הקלט
    if (!supplier_type || !fields || Object.keys(fields).length === 0) {
        return res.status(400).json({ status: 'שגיאה', message: 'שגיאה' });
    }

    // בניית שאילתת SQL דינמית
    const columns = Object.keys(fields).map(column => `"${column}"`).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    const values = Object.values(fields);
    const query = `INSERT INTO "${supplier_type}" (${columns}) VALUES (${placeholders})`;
    
    console.log('Executing query:', query);
    console.log('With values:', values);

    // חיבור למסד הנתונים והכנסת הנתונים
    const dbPath = path.join(__dirname, 'DataBase', 'Data.db');
    console.log('Connecting to database at:', dbPath);
    const db = new sqlite3.Database(dbPath);

    db.run(query, values, function (err) {
        if (err) {
            console.error('Error inserting supplier:', err.message);
            return res.status(500).json({ status: 'error', message: 'שגיאה בהוספת הספק: ' + err.message });
        }

        res.json({ status: 'success', message: 'הספק נוסף בהצלחה!' });
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