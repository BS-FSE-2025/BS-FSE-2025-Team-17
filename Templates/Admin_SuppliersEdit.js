// document.addEventListener('DOMContentLoaded', () => {
//     const supplierTypeSelect = document.getElementById('supplier-type');
//     const loadSuppliersBtn = document.getElementById('load-suppliers-btn');
//     const suppliersTable = document.getElementById('suppliers-table');
//     const tableBody = suppliersTable.querySelector('tbody');

//     // פונקציה לשליפת ספקים מהשרת
//     async function fetchSuppliers(supplierType) {
//         try {
//             const response = await fetch(`/get-${supplierType}`);
//             if (!response.ok) {
//                 throw new Error('שגיאה בהבאת הספקים');
//             }
//             const suppliers = await response.json();
//             populateSuppliersTable(suppliers);
//         } catch (error) {
//             console.error('שגיאה:', error.message);
//             alert('שגיאה בטעינת הספקים: ' + error.message);
//         }
//     }

//     // פונקציה למילוי הטבלה בספקים
//     function populateSuppliersTable(suppliers) {
//         tableBody.innerHTML = ''; // ניקוי הטבלה הקודמת
//         if (suppliers.length === 0) {
//             alert('לא נמצאו ספקים מהסוג שבחרת');
//             suppliersTable.style.display = 'none';
//             return;
//         }

//         suppliers.forEach(supplier => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${supplier.Name}</td>
//                 <td>${supplier.Email || 'לא זמין'}</td>
//                 <td>${supplier.UserName}</td>
//                 <td>${supplier.Password}</td>
//                 <td><button class="delete-btn" data-id="${supplier.id}">מחיקה</button></td>
//             `;
//             tableBody.appendChild(row);
//         });

//         suppliersTable.style.display = 'block'; // הצגת הטבלה
//         addDeleteButtonsEventListeners(); // הוספת מאזינים לכפתורי המחיקה
//     }

//     // פונקציה להוספת מאזינים לכפתורי המחיקה
//     function addDeleteButtonsEventListeners() {
//         const deleteButtons = document.querySelectorAll('.delete-btn');
//         deleteButtons.forEach(button => {
//             button.addEventListener('click', handleDelete);
//         });
//     }

//     // פונקציה למחיקת ספק
//     async function handleDelete(event) {
//         const supplierId = event.target.getAttribute('data-id');
//         if (confirm('האם אתה בטוח שברצונך למחוק את הספק?')) {
//             try {
//                 const response = await fetch(`/delete-user/${supplierId}`, { method: 'DELETE' });
//                 const responseBody = await response.json();

//                 if (response.ok) {
//                     alert('הספק נמחק בהצלחה');
//                     loadSuppliers(); // טען מחדש את רשימת הספקים
//                 } else {
//                     console.error('שגיאה מהשרת:', responseBody.message);
//                     alert('שגיאה במחיקת הספק: ' + responseBody.message);
//                 }
//             } catch (error) {
//                 console.error('שגיאה בביצוע הבקשה:', error.message);
//                 alert('שגיאה במחיקת הספק');
//             }
//         }
//     }

//     // פונקציה לטעינת ספקים לאחר בחירה
//     function loadSuppliers() {
//         const supplierType = supplierTypeSelect.value;
//         if (!supplierType) {
//             alert('אנא בחר סוג ספק');
//             return;
//         }
//         fetchSuppliers(supplierType);
//     }

//     // מאזין לאירוע לחיצה על הכפתור
//     loadSuppliersBtn.addEventListener('click', loadSuppliers);
// });
