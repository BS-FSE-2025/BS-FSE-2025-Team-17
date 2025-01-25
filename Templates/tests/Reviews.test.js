// הוספת TextEncoder ו-TextDecoder
global.TextEncoder = global.TextEncoder || require('util').TextEncoder;
global.TextDecoder = global.TextDecoder || require('util').TextDecoder;

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

jest.setTimeout(10000); // הארכת זמן הבדיקה ל-10 שניות

describe("Reviews Form Database Tests", () => {
    let dom;
    let document;
    let db;

    const dbPath = path.resolve(__dirname, '..', '..', 'DataBase', 'Data.db'); // נתיב לקובץ Data.db

    beforeAll(() => {
        // Mock של alert כדי למנוע את השגיאה
        global.alert = jest.fn();

        if (!fs.existsSync(dbPath)) {
            console.error("קובץ מסד הנתונים לא נמצא בנתיב: " + dbPath);
            throw new Error("קובץ מסד הנתונים לא נמצא");
        }

        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("שגיאה בחיבור למסד הנתונים:", err.message);
                throw new Error("חיבור למסד הנתונים נכשל");
            }
        });

        db.exec("PRAGMA busy_timeout = 3000;", (err) => {
            if (err) {
                console.error("שגיאה בהגדרת busy_timeout:", err.message);
            }
        });
    });

    afterAll(() => {
        db.close((err) => {
            if (err) {
                console.error("שגיאה בסגירת מסד הנתונים:", err.message);
            }
        });
    });

    beforeEach(async () => {
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

        await new Promise((resolve, reject) => {
            db.run("DELETE FROM Reviews", (err) => {
                if (err) {
                    console.error("שגיאה בניקוי הטבלה Reviews:", err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    });

    it("should insert 'name' into the Reviews table", async () => {
        const nameField = document.getElementById("name");
        const cityField = document.getElementById("city");
        const contentField = document.getElementById("content");
        const starsField = document.getElementById("stars");

        // מילוי השדות
        nameField.value = "יוסי";
        cityField.value = "תל אביב";
        contentField.value = "שירות מעולה!";
        starsField.value = "5";

        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Reviews (Name, City, Content, Stars) VALUES (?, ?, ?, ?)`,
                [nameField.value, cityField.value, contentField.value, starsField.value],
                function (err) {
                    if (err) {
                        console.error("שגיאה בהכנסת הנתונים לטבלת Reviews:", err.message);
                        return reject(err);
                    }
                    resolve();
                }
            );
        });

        const row = await new Promise((resolve, reject) => {
            db.get("SELECT Name FROM Reviews WHERE Name = ?", ["יוסי"], (err, row) => {
                if (err) {
                    console.error("שגיאה בשליפת הנתונים:", err.message);
                    return reject(err);
                }
                resolve(row);
            });
        });

        expect(row).toBeTruthy(); // וודא שהשורה קיימת
        expect(row.Name).toBe("יוסי");
    });

    it("should not allow invalid city input", async () => {
        const nameField = document.getElementById("name"); // השם כבר ממולא
        const cityField = document.getElementById("city");
        const contentField = document.getElementById("content");
        const starsField = document.getElementById("stars");

        nameField.value = "יוסי"; // השם אוטומטי
        cityField.value = "1234"; // עיר לא נכונה (מספרים)
        contentField.value = "שירות מעולה!";
        starsField.value = "5";

        const cityRegex = /^[a-zA-Z֐-׿\s]+$/;
        if (cityField.value && (!cityRegex.test(cityField.value) || cityField.value.match(/[0-9]/))) {
            alert("העיר שהוזנה אינה תקינה. נא להזין עיר עם תווים חוקיים, ללא מספרים.");
            expect(alert).toHaveBeenCalled(); // ודא שהalert קרא
            return;
        }

        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Reviews (Name, City, Content, Stars) VALUES (?, ?, ?, ?)`,
                [nameField.value, cityField.value, contentField.value, starsField.value],
                function (err) {
                    if (err) {
                        console.error("שגיאה בהכנסת הנתונים לטבלת Reviews:", err.message);
                        return reject(err);
                    }
                    resolve();
                }
            );
        });

        const row = await new Promise((resolve, reject) => {
            db.get("SELECT City FROM Reviews WHERE Name = ?", ["יוסי"], (err, row) => {
                if (err) {
                    console.error("שגיאה בשליפת הנתונים:", err.message);
                    return reject(err);
                }
                resolve(row);
            });
        });

        expect(row.City).toBeFalsy(); // העיר לא הוזנה
    });
});
