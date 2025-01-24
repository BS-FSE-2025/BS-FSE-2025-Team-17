// הוספת TextEncoder ו-TextDecoder
global.TextEncoder = global.TextEncoder || require('util').TextEncoder;
global.TextDecoder = global.TextDecoder || require('util').TextDecoder;

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

describe("Reviews Form Database Tests", () => {
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
        const html = `<!DOCTYPE html>
        <html lang="he">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>דרגו אותנו</title>
        </head>
        <body>
            <form id="contact_form">
                <div id="contact-fields">
                    <label for="name">שם:</label>
                    <input type="text" id="name" placeholder="הזן את שמך:" required>
        
                    <label for="city">עיר:</label>
                    <input type="text" id="city" placeholder="הזן את שם העיר שלך:">
        
                    <label for="content">מה דעתך?</label>
                    <textarea id="content" placeholder="ספרו לנו מה אתם חושבים עלינו :)" required></textarea>
        
                    <label for="stars">דירוג (1-5):</label>
                    <input type="number" id="stars" min="1" max="5" placeholder="הזן דירוג:" required>
                </div>
                <button type="submit" id="submitReview">שלח דירוג</button>
            </form>
        </body>
        </html>`;

        dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        document = dom.window.document;

        // חיבור למסד הנתונים
        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("שגיאה בחיבור למסד הנתונים:", err.message);
                throw new Error("חיבור למסד הנתונים נכשל");
            }
        });
    });

    afterEach(() => {
        // ניקוי הנתונים מהטבלה לאחר כל בדיקה
        db.serialize(() => {
            db.run("DELETE FROM Reviews", (err) => {
                if (err) {
                    console.error("שגיאה בניקוי הטבלה Reviews:", err.message);
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

    it("should insert 'name' into the Reviews table", (done) => {
        const nameField = document.getElementById("name");
        const cityField = document.getElementById("city");
        const contentField = document.getElementById("content");
        const starsField = document.getElementById("stars");

        // מילוי השדות
        nameField.value = "יוסי";
        cityField.value = "תל אביב";
        contentField.value = "שירות מעולה!";
        starsField.value = "5";

        // דימוי שליחת טופס
        db.run(
            `INSERT INTO Reviews (Name, City, Content, Stars) VALUES (?, ?, ?, ?)`,
            [nameField.value, cityField.value, contentField.value, starsField.value],
            function (err) {
                if (err) {
                    console.error("שגיאה בהכנסת הנתונים לטבלת Reviews:", err.message);
                    return done(err);
                }

                // בדיקת השדה "שם"
                db.get("SELECT Name FROM Reviews WHERE Name = ?", ["יוסי"], (err, row) => {
                    if (err) {
                        console.error("שגיאה בשליפת הנתונים:", err.message);
                        return done(err);
                    }

                    expect(row).toBeTruthy(); // וודא שהשורה קיימת
                    expect(row.Name).toBe("יוסי");

                    done(); // מסמן שהבדיקה הסתיימה
                });
            }
        );
    });
});
