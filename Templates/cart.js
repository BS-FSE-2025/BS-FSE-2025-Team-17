document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartIconButton = document.getElementById('cart-icon-left-button');
    const cartContainer = document.getElementById('cart');
    
    document.getElementById('event-budget').addEventListener('input', checkBudget);


    // האזנה לאירוע לחיצה על כפתור "הוסף לעגלה"
    document.body.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart')) {
            const name = event.target.getAttribute('data-name');
            const price = parseFloat(event.target.getAttribute('data-price'));
            const pricetotal = parseFloat(event.target.getAttribute('data-pricetotal'));
            const city = event.target.getAttribute('data-city'); // שליפת העיר
            const tel = event.target.getAttribute('data-tel');
            // הוספת פריט לעגלה עם המידע על העיר
            addToCart({ name, price: !isNaN(pricetotal) ? pricetotal : price, city,tel });
        }
    });

    // הצגת/הסתרת עגלת הקניות
    cartIconButton.addEventListener('click', () => {
        cartContainer.classList.toggle('hidden');
    });

    // הוספת פריט לעגלה
    function addToCart(item) {
        cart.push(item);
        updateCart();
    }
    function checkBudget() {
        // קבלת הערכים מהתקציב ומהסה"כ
        const budgetInput = document.getElementById('event-budget');
        const budget = parseFloat(budgetInput.value) || 0; // תקציב שהוזן, ברירת מחדל 0
        const cartTotalElement = document.getElementById('cart-total');
        const total = parseFloat(cartTotalElement.textContent.replace(/,/g, '')) || 0; // הסה"כ
    
        // קבלת אלמנט ההודעה
        const budgetWarning = document.getElementById('budget-warning');
    
        // בדיקת חריגה מהתקציב
        if (budget > 0 && total > budget) {
            cartTotalElement.style.color = 'red'; // צבע אדום לסה"כ
            budgetWarning.style.display = 'block'; // הצגת הודעה
            budgetWarning.textContent = 'חרגת מהתקציב שהקצאת!';
        } else {
            cartTotalElement.style.color = 'black'; // צבע שחור לסה"כ
            budgetWarning.style.display = 'none'; // הסתרת ההודעה
        }
    }

    // עדכון עגלת הקניות
    function updateCart() {
        cartList.innerHTML = ''; // נקה את רשימת העגלה
        let total = 0;
    
        cart.forEach(item => {
            total += item.price; // חישוב הסכום הכולל
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - ₪${item.price.toLocaleString('he-IL')}<br>
                עיר: ${item.city}<br>
                טלפון: ${item.tel}
            `;
            
    
            const removeButton = document.createElement('button');
            removeButton.className = 'remove';
            removeButton.textContent = 'הסר';
            removeButton.addEventListener('click', () => {
                removeFromCart(item);
            });
    
            li.appendChild(removeButton);
            cartList.appendChild(li);
        });
    
        cartTotal.textContent = total.toLocaleString('he-IL');
        checkBudget();
    }
    

    // הסרת פריט מהעגלה
    function removeFromCart(item) {
        const index = cart.findIndex(i => i.name === item.name && i.price === item.price);
        if (index > -1) {
            cart.splice(index, 1);
            updateCart();
        }
    }
});


