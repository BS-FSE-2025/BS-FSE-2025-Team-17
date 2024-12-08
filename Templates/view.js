async function fetchHalls() {
    try {
        const response = await fetch('/get-halls'); // שליחת בקשה לשרת
        if (!response.ok) {
            throw new Error('Error fetching halls');
        }
        const halls = await response.json(); // קבלת המידע כ-JSON

        const tableBody = document.getElementById('halls-table'); // גוף הטבלה
        tableBody.innerHTML = ''; // מנקה תוכן קודם

        // הוספת השורות לטבלה
        halls.forEach(hall => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${hall['שם']}</td>
                <td>${hall['איזור']}</td>
                <td>${hall['עיר']}</td>
                <td>${hall['מחיר']}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('שגיאה בטעינת האולמות');
    }
}

// קריאה לפונקציה בעת טעינת הדף
document.addEventListener('DOMContentLoaded', fetchHalls);