// document.addEventListener('DOMContentLoaded', () => {
//     async function fetchContacts() {
//         try {
//             const response = await fetch('/get-contacts');
//             if (!response.ok) {
//                 throw new Error('שגיאה בשליפת הנתונים');
//             }
//             const contacts = await response.json();
//             populateContactsTables(contacts);
//         } catch (error) {
//             console.error('שגיאה בשליפת הנתונים:', error.message);
//         }
//     }

//     function populateContactsTables(contacts) {
//         const openTableBody = document.querySelector('#contacts-table tbody');
//         const closedTableBody = document.querySelector('#closed-contacts-table tbody');

//         openTableBody.innerHTML = '';
//         closedTableBody.innerHTML = '';

//         contacts.forEach(contact => {
//             if (contact.Status === 'נסגר') {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${contact.ID}</td>
//                     <td>${contact.Name}</td>
//                     <td>${contact.Email}</td>
//                     <td>${contact.Information}</td>
//                 `;
//                 closedTableBody.appendChild(row);
//             } else {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${contact.ID}</td>
//                     <td>${contact.Name}</td>
//                     <td>${contact.Contact}</td>
//                     <td>${contact.Information}</td>
//                     <td>
//                         <select class="status-select" data-id="${contact.ID}">
//                             <option value="חדש" ${contact.Status === 'חדש' ? 'selected' : ''}>חדש</option>
//                             <option value="בטיפול" ${contact.Status === 'בטיפול' ? 'selected' : ''}>בטיפול</option>
//                             <option value="נסגר" ${contact.Status === 'נסגר' ? 'selected' : ''}>נסגר</option>
//                         </select>
//                     </td>
//                 `;
//                 openTableBody.appendChild(row);
//             }
//         });

//         const statusSelects = document.querySelectorAll('.status-select');
//         statusSelects.forEach(select => {
//             select.addEventListener('change', handleStatusChange);
//         });
//     }

//     async function handleStatusChange(event) {
//         const selectElement = event.target;
//         const contactId = selectElement.getAttribute('data-ID');
//         const newStatus = selectElement.value;

//         try {
//             const response = await fetch(`/update-contact-status/${contactId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ status: newStatus }),
//             });

//             if (!response.ok) {
//                 throw new Error('שגיאה בעדכון הסטטוס');
//             }

//             // רענון הטבלאות לאחר העדכון
//             fetchContacts();
//         } catch (error) {
//             console.error('שגיאה בעדכון הסטטוס:', error.message);
//         }
//     }

//     // שליפת הפניות בעת הטעינה
//     fetchContacts();
// });


