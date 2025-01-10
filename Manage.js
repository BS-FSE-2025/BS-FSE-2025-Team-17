// Script for loading users and managing actions
document.addEventListener('DOMContentLoaded', () => {
    // פונקציה לשליפת נתונים משרת
    async function fetchUsers() {
        try {
            const response = await fetch('/get-users');
            if (!response.ok) {
                throw new Error('שגיאה בהבאת המשתמשים');
            }
            const users = await response.json();
            populateUsersTable(users);
        } catch (error) {
            console.error(error.message);
        }
    }

    // פונקציה למילוי הטבלה במידע
    function populateUsersTable(users) {
        const tableBody = document.querySelector('#users-table tbody');
        tableBody.innerHTML = ''; // נקה את התוכן הקודם

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.Name}</td>
                <td>${user.Email}</td>
                <td>${user.UserName}</td>
                <td>${user.Password}
                <td><button class="delete-btn" data-id="${user.id}">מחיקה</button></td>
            `;
            tableBody.appendChild(row);
        });

        // הוספת מאזין לכפתורי המחיקה
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    async function handleDelete(event) {
        const userId = event.target.getAttribute('data-id'); // קבלת ID המשתמש
        console.log('ID למחיקה:', userId); // הדפסת ID למחיקה
    
        if (confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
            try {
                const response = await fetch(`/delete-user/${userId}`, {
                    method: 'DELETE'
                });
    
                const responseBody = await response.json();
    
                if (response.ok) {
                    alert('המשתמש נמחק בהצלחה');
                    fetchUsers();
                } else {
                    console.error('שגיאה מהשרת:', responseBody.message);
                    alert('שגיאה במחיקת המשתמש: ' + responseBody.message);
                }
            } catch (error) {
                console.error('שגיאה בביצוע הבקשה:', error.message);
                alert('שגיאה במחיקת המשתמש');
            }
        }
    }
    


// קריאה ראשונית לטעינת המשתמשים
fetchUsers();

});
