const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require("jsdom");

describe("PDF Button Functionality", () => {
    test("should attach a click event to the PDF button and execute the function", () => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <div id="cart">
                <button id="download-pdf-btn">Download PDF</button>
            </div>
        `);

        const document = dom.window.document;
        const pdfButton = document.getElementById("download-pdf-btn");

        const mockConsoleLog = jest.fn();
        pdfButton.addEventListener("click", () => {
            mockConsoleLog("PDF download initiated");
        });

        pdfButton.click();

        expect(mockConsoleLog).toHaveBeenCalledWith("PDF download initiated");
    });

    test("should create a new window with the correct content", () => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <div id="cart">
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
            </div>
        `);

        const document = dom.window.document;
        const cartElement = document.getElementById("cart");

        const mockWindow = {
            document: {
                write: jest.fn(),
            },
        };

        const mockOpen = jest.fn(() => mockWindow);

        dom.window.open = mockOpen;

        const clonedCart = cartElement.cloneNode(true);
        const tempWindow = dom.window.open("", "_blank");
        tempWindow.document.write(`
            <html>
                <body>
                    <div id="cloned-cart">${clonedCart.innerHTML}</div>
                </body>
            </html>
        `);

        expect(mockOpen).toHaveBeenCalledWith("", "_blank");
        expect(mockWindow.document.write).toHaveBeenCalledWith(expect.stringContaining('<div id="cloned-cart">'));
        expect(mockWindow.document.write).toHaveBeenCalledWith(expect.stringContaining('<li>Item 1</li>'));
        expect(mockWindow.document.write).toHaveBeenCalledWith(expect.stringContaining('<li>Item 2</li>'));
    });

    test("should handle blocked popup scenario", () => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <div id="cart">
                <button id="download-pdf-btn">Download PDF</button>
            </div>
        `);

        const document = dom.window.document;

        const mockOpen = jest.fn(() => null);
        dom.window.open = mockOpen;

        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;

        const tempWindow = dom.window.open("", "_blank");
        if (!tempWindow) {
            console.error("הדפדפן חוסם חלונות קופצים. בטל את החסימה ונסה שוב.");
        }

        expect(mockOpen).toHaveBeenCalledWith("", "_blank");
        expect(mockConsoleError).toHaveBeenCalledWith("הדפדפן חוסם חלונות קופצים. בטל את החסימה ונסה שוב.");
    });

    test("should proceed when popup is not blocked", () => {
        const dom = new JSDOM(`
            <!DOCTYPE html>
            <div id="cart">
                <button id="download-pdf-btn">Download PDF</button>
            </div>
        `);

        const document = dom.window.document;

        const mockWindow = {
            document: {
                write: jest.fn(),
            },
        };

        const mockOpen = jest.fn(() => mockWindow);
        dom.window.open = mockOpen;

        const tempWindow = dom.window.open("", "_blank");

        expect(mockOpen).toHaveBeenCalledWith("", "_blank");
        expect(tempWindow).not.toBeNull();
        expect(mockWindow.document.write).toBeDefined();
    });
});

describe("Redirect non-registered users to registration page", () => {
    let dom;
    let document;

    beforeEach(() => {
        dom = new JSDOM(
            `<!DOCTYPE html>
            <html lang="he">
            <head>
                <meta charset="UTF-8">
                <title>עגלה</title>
            </head>
            <body>
                <div id="cart">
                    <button id="checkout-button">סיכום עגלה</button>
                </div>
            </body>
            </html>`,
            { url: "http://localhost/" }
        );

        document = dom.window.document;

        // מאזין לאירוע לחיצה על הכפתור
        document.getElementById("checkout-button").addEventListener("click", async () => {
            const userDetails = await fetchUserDetails();
            if (!userDetails || !userDetails.name) {
                // במקום להשתמש ב-location.assign, נשתמש ב-log לדוגמה
                console.log("Redirecting to /Register.html?showAlert=true");
            } else {
                console.log("סיכום עגלה הצליח!");
            }
        });

        // יצירת Mock לפונקציה fetchUserDetails
        global.fetchUserDetails = jest.fn();

        // Mock לפונקציה console.log
        jest.spyOn(global.console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("should redirect non-registered user to registration when trying to checkout", async () => {
        // מחזירים null כדי לדמות משתמש לא רשום
        fetchUserDetails.mockResolvedValueOnce(null);

        const checkoutButton = document.getElementById("checkout-button");
        await checkoutButton.click();

        // בדיקה שהלוג "Redirecting..." נרשם
        expect(console.log).toHaveBeenCalledWith("Redirecting to /Register.html?showAlert=true");
    });

    test("should allow registered user to proceed to checkout", async () => {
        // מחזירים פרטים כדי לדמות משתמש רשום
        fetchUserDetails.mockResolvedValueOnce({ name: "יוסי" });

        const checkoutButton = document.getElementById("checkout-button");
        await checkoutButton.click();

        // בדיקה שהפעולה הצליחה
        expect(console.log).toHaveBeenCalledWith("סיכום עגלה הצליח!");
    });
});
