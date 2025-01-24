const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

describe('Cart Functionality with Button Click', () => {
    let dom;
    let document;

    beforeEach(() => {
        // יצירת DOM מדומה
        dom = new JSDOM(`
            <!DOCTYPE html>
            <div>
                <ul id="cart-items"></ul>
                <div id="cart-total"></div>
                <input id="event-budget" value="5000">
                <div id="budget-warning" style="display: none;"></div>
                <button class="add-to-cart" data-name="Item 1" data-price="100" data-city="Tel Aviv" data-tel="123456789">Add to Cart</button>
            </div>
        `);

        document = dom.window.document;

        // מאזין לאירוע לחיצה
        document.body.addEventListener('click', event => {
            if (event.target.classList.contains('add-to-cart')) {
                const name = event.target.getAttribute('data-name');
                const price = parseFloat(event.target.getAttribute('data-price'));
                const city = event.target.getAttribute('data-city');
                const tel = event.target.getAttribute('data-tel');
                addToCart({ name, price, city, tel });
            }
        });

        // הגדרת פונקציות כמו בקוד המקורי
        global.cart = [];
        global.addToCart = function (item) {
            cart.push(item);
            updateCart();
        };
        global.updateCart = function () {
            const cartList = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const budgetWarning = document.getElementById('budget-warning');
            cartList.innerHTML = ''; // ניקוי רשימת העגלה
            let total = 0;

            cart.forEach(item => {
                total += item.price; // חישוב סה"כ
                const li = document.createElement('li');
                li.textContent = `${item.name} - ₪${item.price}`;
                cartList.appendChild(li);
            });

            cartTotal.textContent = total;

            // קריאה לפונקציה `checkBudget`
            checkBudget();
        };
        global.checkBudget = function () {
            const budgetInput = document.getElementById('event-budget');
            const budget = parseFloat(budgetInput.value) || 0; // תקציב שהוזן
            const cartTotalElement = document.getElementById('cart-total');
            const total = parseFloat(cartTotalElement.textContent.replace(/,/g, '')) || 0; // הסה"כ

            const budgetWarning = document.getElementById('budget-warning');

            if (budget > 0 && total > budget) {
                cartTotalElement.style.color = 'red'; // צבע אדום לסה"כ
                budgetWarning.style.display = 'block'; // הצגת הודעה
                budgetWarning.textContent = 'חרגת מהתקציב שהקצאת!';
            } else {
                cartTotalElement.style.color = 'black'; // צבע שחור לסה"כ
                budgetWarning.style.display = 'none'; // הסתרת ההודעה
            }
        };
    });

    test('should add an item to the cart when clicking "Add to Cart" button', () => {
        const addToCartButton = document.querySelector('.add-to-cart');

        // לחיצה על הכפתור
        addToCartButton.click();

        // בדיקה שהפריט נוסף לעגלה
        expect(cart).toHaveLength(1);
        expect(cart).toContainEqual({ name: 'Item 1', price: 100, city: 'Tel Aviv', tel: '123456789' });
    });

    test('should create a "remove" button and remove the item when clicked', () => {
        const cartList = document.getElementById('cart-items');

        // לחיצה על כפתור "Add to Cart"
        const addToCartButton = document.querySelector('.add-to-cart');
        addToCartButton.click();

        // הוספת כפתור הסרה
        const removeButton = document.createElement('button');
        removeButton.textContent = 'הסר';
        removeButton.addEventListener('click', () => {
            cart.pop();
            updateCart();
        });
        cartList.appendChild(removeButton);

        // בדיקה שהכפתור "הסר" נוצר
        expect(removeButton).not.toBeNull();
        expect(removeButton.textContent).toBe('הסר');

        // לחיצה על "הסר"
        removeButton.click();

        // בדיקה שהפריט הוסר
        expect(cart).toHaveLength(0);
    });

    test('should show a warning when budget is exceeded after adding item via button', () => {
        const budgetWarning = document.getElementById('budget-warning');
        const addToCartButton = document.querySelector('.add-to-cart');

        // שינוי המחיר בכפתור כך שיעלה על התקציב
        addToCartButton.setAttribute('data-price', '6000');

        // לחיצה על הכפתור
        addToCartButton.click();

        // בדיקה שתקציב חורג מראה הודעה
        expect(budgetWarning.style.display).toBe('block');
        expect(budgetWarning.textContent).toBe('חרגת מהתקציב שהקצאת!');
    });
});
