async function fetchSuppliers(type, apiEndpoint, containerId) {
    try {
        const response = await fetch(apiEndpoint); // שליחת בקשה לשרת
        if (!response.ok) {
            throw new Error(`שגיאה בשליפת ${type}`);
        }

        const suppliers = await response.json();
        displaySuppliers(suppliers, containerId, type); // הצגת כל הספקים כברירת מחדל

        document.getElementById('search-button').addEventListener('click', () => {
            const selectedRegion = document.querySelector('.form-select').value;
            filterSuppliers(suppliers, selectedRegion, containerId, type); // סינון לפי האזור שנבחר
        });
    } catch (error) {
        console.error('Error:', error.message);
        alert(`שגיאה בטעינת ${type}`);
    }
}

function filterSuppliers(suppliers, region, containerId, type) {
    const filteredSuppliers = suppliers.filter(supplier => {
        if (region === "בחר אזור") {
            return true; // מציג את כל הספקים אם לא נבחר אזור
        }
        return supplier['איזור'] === region; // סינון לפי האזור
    });
    displaySuppliers(filteredSuppliers, containerId, type);
}

function displaySuppliers(suppliers, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // מנקה תוכן קודם

    suppliers.forEach(supplier => {
        const card = document.createElement('div');
        card.className = 'card';

        let additionalDetails = '';
        
        // התאמת הפרטים להצגה לפי סוג הספק
        if (type === 'אולמות') 
        {
            const peopleCountInput = document.getElementById('people-count');
            const peopleCount = parseInt(peopleCountInput.value) || 1;
            const light = 8000;
            // חישוב המחיר הכולל
            const totalPrice = supplier['מחיר'] * peopleCount + light;
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">תאורה והגברה: ${light} ש״ח</p>
                <p class="card-text">מחיר למנה: ${supplier['מחיר']} ש"ח</p>
                <p class="card-text">מחיר כולל: ${totalPrice} ש"ח</p>
                <h6>*המחיר הסופי הוא כולל תאורה והגברה</h6>
            `;
        } 
        else if (type === 'בר שתייה') 
            {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
                `;
            } 
        else if (type === 'חברות אישורי הגעה') 
            {
                additionalDetails = `
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
                `;
            } 
                
        else if (type === 'צלמים') {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
            `;
        } else if (type === 'תקליטנים') {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">סגנון מוזיקלי: ${supplier["סגנון מוזיקלי"]}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
            `;
        } else if (type === 'בגדי חתן' || type === 'בגדי כלה') {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
            `;
            
        } else if (type === 'מאפרת') {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
            `;
            
        }
        else if (type === 'עיצוב') 
            {
                additionalDetails = `
                <p class="card-text">עיר: ${supplier['עיר']}</p>
                <p class="card-text">התמחות: ${supplier['התמחות']}</p>
                <p class="card-text">טלפון: ${supplier['טלפון']}</p>
                <p class="card-text">מחיר: ${supplier['מחיר']} ש"ח</p>
                `;
            } 

            card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${supplier['שם']}</h5>
                ${additionalDetails}
                <button class="btn btn-primary add-to-cart" 
                        data-name="${supplier['שם']}"
                        data-price="${
                            type === 'אולמות' 
                                ? supplier['מחיר'] * (parseInt(document.getElementById('people-count').value)|| 1) + 8000
                                : supplier['מחיר']
                        }"
                        data-city="${supplier['עיר']}"
                        data-tel="${supplier['טלפון']}">
                    בחירה
                </button>
            </div>
        `;
        
container.appendChild(card);

    });
}
document.addEventListener('DOMContentLoaded', () => {
    // קריאה גנרית לכל הספקים
    fetchSuppliers('אולמות', '/get-halls', 'halls-container');
    fetchSuppliers('צלמים', '/get-photographers', 'photos-container');
    fetchSuppliers('תקליטנים', '/get-djs', 'djs-container');
    fetchSuppliers('בגדי חתן', '/get-bridal', 'groom-container');
    fetchSuppliers('בגדי כלה', '/get-grooms', 'bride-container');
    fetchSuppliers('בר שתייה', '/get-bars', 'bar-container');
    fetchSuppliers('עיצוב', '/get-design', 'design-container');
    fetchSuppliers('מאפרת', '/get-makeup', 'makeup-container');
    fetchSuppliers('חברות אישורי הגעה', '/get-Arrival_confirmation_companies', 'confirmation-container');
});