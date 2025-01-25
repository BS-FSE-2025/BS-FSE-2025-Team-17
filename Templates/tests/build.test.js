global.TextEncoder = global.TextEncoder || require("util").TextEncoder;
global.TextDecoder = global.TextDecoder || require("util").TextDecoder;

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

jest.setTimeout(10000); // הארכת זמן הבדיקה ל-10 שניות

describe("Contact Form Database Tests", () => {
    let dom;
    let document;
    let db;

    const dbPath = path.resolve(__dirname, '..', '..', 'DataBase', 'Data.db');

    beforeAll(() => {
        if (!fs.existsSync(dbPath)) {
            console.error("קובץ מסד הנתונים לא נמצא בנתיב: " + dbPath);
            throw new Error("קובץ מסד הנתונים לא נמצא");
        }

        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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

        await new Promise((resolve, reject) => {
            db.run("DELETE FROM Contact", (err) => {
                if (err) {
                    console.error("שגיאה בניקוי הטבלה Contact:", err.message);
                    return reject(err);
                }
                resolve();
            });
        });
    });

    it("should insert form data into the Contact table", async () => {
        const nameField = document.getElementById("name");
        const phoneField = document.getElementById("phone_number");
        const contentField = document.getElementById("content");

        nameField.value = "יוסי";
        phoneField.value = "0501234567";
        contentField.value = "תוכן ההודעה";

        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Contact (Name, Contact, Information) VALUES (?, ?, ?)`,
                [nameField.value, phoneField.value, contentField.value],
                function (err) {
                    if (err) {
                        console.error("שגיאה בהכנסת הנתונים:", err.message);
                        return reject(err);
                    }
                    resolve();
                }
            );
        });

        const row = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM Contact WHERE Name = ?", ["יוסי"], (err, row) => {
                if (err) {
                    console.error("שגיאה בשליפת הנתונים:", err.message);
                    return reject(err);
                }
                resolve(row);
            });
        });

        expect(row).toBeTruthy();
        expect(row.Name).toBe("יוסי");
        expect(row.Contact).toBe("0501234567");
        expect(row.Information).toBe("תוכן ההודעה");
    });
});

describe("filterSuppliers Tests", () => {
    function mockDisplaySuppliers(suppliers, containerId, type) {
        return { suppliers, containerId, type };
    }

    const suppliersMock = [
        { "שם": "ספק 1", "איזור": "צפון", "מחיר": 500 },
        { "שם": "ספק 2", "איזור": "מרכז", "מחיר": 700 },
        { "שם": "ספק 3", "איזור": "דרום", "מחיר": 600 }
    ];

    it("should return all suppliers when region is 'בחר אזור'", () => {
        const region = "בחר אזור";
        const filteredSuppliers = suppliersMock.filter(supplier => {
            if (region === "בחר אזור") {
                return true;
            }
            return supplier["איזור"] === region;
        });

        expect(filteredSuppliers.length).toBe(3);
    });

    it("should return only suppliers from the 'צפון' region", () => {
        const region = "צפון";
        const filteredSuppliers = suppliersMock.filter(supplier => supplier["איזור"] === region);

        expect(filteredSuppliers.length).toBe(1);
        expect(filteredSuppliers[0]["איזור"]).toBe("צפון");
    });

    it("should return an empty array when no suppliers match the 'אילת' region", () => {
        const region = "אילת";
        const filteredSuppliers = suppliersMock.filter(supplier => supplier["איזור"] === region);

        expect(filteredSuppliers.length).toBe(0);
    });
});
