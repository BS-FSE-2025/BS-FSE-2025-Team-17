// הוספת TextEncoder ו-TextDecoder באופן גלובלי
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

const { JSDOM } = require('jsdom');

describe('PDF Button Functionality', () => {
    test('should attach a click event to the PDF button and execute the function', () => {
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

    test('should create a new window with the correct content', () => {
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
});
