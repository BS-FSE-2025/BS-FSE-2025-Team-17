document.addEventListener('DOMContentLoaded', () => {
    const cartItems = [];
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cart = document.getElementById('cart');
    const cartIconLeftButton = document.getElementById('cart-icon-left-button');
    const exceedWarning = document.getElementById('exceed-warning');
    const checkoutButton = document.getElementById('checkout-button');

    // התקציב מוזן בלשונית אחרת - דוגמה: קלט עם id="budget-input"
    const budgetInput = document.getElementById('budget-input');

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemElement = button.parentElement;
            const name = itemElement.getAttribute('data-name');
            const price = parseFloat(itemElement.getAttribute('data-price'));

            const item = { name, price, id: Date.now() };
            cartItems.push(item);

            updateCartUI();
        });
    });

    if (!cart) {
        console.error('שגיאה: האלמנט של העגלה (id="cart") לא נמצא!');
    }

    if (!cartIconLeftButton) {
        console.error('שגיאה: האלמנט של כפתור אייקון העגלה (id="cart-icon-left-button") לא נמצא!');
    }

    if (cart && cartIconLeftButton) {
        cartIconLeftButton.addEventListener('click', () => {
            cart.classList.toggle('hidden');
            console.log(cart.classList.contains('hidden') ? "העגלה כעת מוסתרת." : "העגלה כעת מוצגת.");
        });
    } else {
        console.error('לא ניתן להפעיל את הפעולה כי אחד האלמנטים חסר.');
    }

    function updateCartUI() {
        cartList.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            total += item.price;

            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - ₪${item.price}`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'הסר';
            removeButton.classList.add('remove');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.id);
            });

            listItem.appendChild(removeButton);
            cartList.appendChild(listItem);
        });

        cartTotal.textContent = total.toFixed(2);

        const budget = parseFloat(budgetInput?.value) || 0;
        if (total > budget) {
            exceedWarning.style.display = 'block';
            cartTotal.style.color = 'red';
            checkoutButton.style.display = 'none';
        } else {
            exceedWarning.style.display = 'none';
            cartTotal.style.color = 'black';
            checkoutButton.style.display = 'block';
        }

        if (cartItems.length === 0) {
            cart.classList.add('hidden');
        } else {
            cart.classList.remove('hidden');
        }
    }

    function removeFromCart(id) {
        const index = cartItems.findIndex(item => item.id === id);
        if (index > -1) {
            cartItems.splice(index, 1);
            updateCartUI();
        }
    }
});

