const { JSDOM } = require("jsdom");
const { expect } = require("chai");
const sqlite3 = require("sqlite3").verbose();

describe("Reviews Form Database Tests", () => {
    let dom;
    let document;
    let db;

    beforeEach(() => {
        const html = `
            <!DOCTYPE html>
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
            </html>
        `;
        dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        document = dom.window.document;

        // חיבור למסד הנתונים
        db = new sqlite3.Database("./DataBase/Data.db", sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("שגיאה בחיבור למסד הנתונים:", err.message);
            }
        });
    });

    afterEach(() => {
        // ניקוי הנתונים מהטבלה לאחר כל בדיקה
        db.run("DELETE FROM Reviews", (err) => {
            if (err) {
                console.error("שגיאה בניקוי הטבלה Reviews:", err.message);
            }
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

                    expect(row).to.not.be.undefined; // וודא שהשורה קיימת
                    expect(row.Name).to.equal("יוסי"); // וודא שהשם תקין

                    done(); // מסמן שהבדיקה הסתיימה
                });
            }
        );
    });

    it("should insert 'content' into the Reviews table", (done) => {
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

                // בדיקת השדה "תוכן"
                db.get("SELECT Content FROM Reviews WHERE Content = ?", ["שירות מעולה!"], (err, row) => {
                    if (err) {
                        console.error("שגיאה בשליפת הנתונים:", err.message);
                        return done(err);
                    }

                    expect(row).to.not.be.undefined; // וודא שהשורה קיימת
                    expect(row.Content).to.equal("שירות מעולה!"); // וודא שהתוכן תקין

                    done(); // מסמן שהבדיקה הסתיימה
                });
            }
        );
    });
});
