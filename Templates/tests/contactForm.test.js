// הגדרת TextEncoder ו-TextDecoder אם הם לא קיימים כבר
global.TextEncoder = global.TextEncoder || require("util").TextEncoder;
global.TextDecoder = global.TextDecoder || require("util").TextDecoder;

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

describe("Contact Form Database Tests", () => {
    let dom;
    let document;
    let db;

    const dbPath = path.resolve(__dirname, '..', '..', 'DataBase', 'Data.db'); // נתיב לקובץ Data.db

    beforeEach(() => {
        // בדיקה אם הקובץ קיים
        if (!fs.existsSync(dbPath)) {
            console.error("קובץ מסד הנתונים לא נמצא בנתיב: " + dbPath);
            throw new Error("קובץ מסד הנתונים לא נמצא");
        }

        // יצירת דף HTML מדומה
        const html = `
            <!DOCTYPE html>
            <html lang="he">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>יצירת קשר</title>
            </head>
            <body>
                <form id="contact_form">
                    <input type="text" id="name" placeholder="הזן את השם שלך כאן:" required>
                    <input type="tel" id="phone_number" placeholder="הזן את מספר הטלפון/הדוא''ל שלך כאן:" required>
                    <textarea id="content" placeholder="הזן את תוכן הפנייה שלך כאן:" rows="5" required></textarea>
                    <button id="submit">לחץ כאן, ונענה בהקדם האפשרי :)</button>
                </form>
            </body>
            </html>
        `;
        dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        document = dom.window.document;

        // חיבור למסד הנתונים עם זמן המתנה
        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error("שגיאה בחיבור למסד הנתונים:", err.message);
                throw new Error("חיבור למסד הנתונים נכשל");
            }
        });
    });

    afterEach(() => {
        // ניקוי הנתונים מהטבלה לאחר כל בדיקה
        db.serialize(() => {
            db.run("DELETE FROM Contact", (err) => {
                if (err) {
                    console.error("שגיאה בניקוי הטבלה Contact:", err.message);
                }
            });
        });

        // סגירת החיבור למסד הנתונים
        db.close((err) => {
            if (err) {
                console.error("שגיאה בסגירת מסד הנתונים:", err.message);
            }
        });
    });

    it("should insert form data into the Contact table", (done) => {
        const nameField = document.getElementById("name");
        const phoneField = document.getElementById("phone_number");
        const contentField = document.getElementById("content");

        // מילוי השדות
        nameField.value = "יוסי";
        phoneField.value = "0501234567";
        contentField.value = "תוכן ההודעה";

        // דימוי שליחת הטופס
        db.run(
            `INSERT INTO Contact (Name, Contact, Information) VALUES (?, ?, ?)`,
            [nameField.value, phoneField.value, contentField.value],
            function (err) {
                if (err) {
                    console.error("שגיאה בהכנסת הנתונים:", err.message);
                    return done(err);
                }

                // בדיקת הנתונים שנכנסו לטבלה
                db.get("SELECT * FROM Contact WHERE Name = ?", ["יוסי"], (err, row) => {
                    if (err) {
                        console.error("שגיאה בשליפת הנתונים:", err.message);
                        return done(err);
                    }

                    // עדכון הבדיקה כך שיתאים גם למקרה של undefined
                    expect(row).toBeTruthy(); // וודא שהשורה קיימת
                    expect(row.Name).toBe("יוסי");
                    expect(row.Contact).toBe("0501234567");
                    expect(row.Information).toBe("תוכן ההודעה");

                    done(); // מסמן שהבדיקה הסתיימה
                });
            }
        );
    });
});
