document.addEventListener('DOMContentLoaded', () => {
    const supplierTypeSelect = document.getElementById('supplier-type');
    const loadSuppliersBtn = document.getElementById('load-suppliers-btn');
    const suppliersTable = document.getElementById('suppliers-table');
    const tableHeader = document.getElementById('table-header');
    const tableBody = suppliersTable.querySelector('tbody');
    const addSupplierForm = document.getElementById('add-supplier-form');
    const supplierForm = document.getElementById('supplier-form');
    const addSupplierBtn = document.getElementById('add-supplier-btn');


    
    // הגדרת שדות לכל סוג ספק
    const supplierFields = {
        halls: ['שם', 'איזור', 'עיר', 'מחיר'],
        photographers: ['שם', 'איזור', 'עיר', 'מחיר'],
        djs: ['שם', 'איזור', 'עיר', 'מחיר', 'סגנון מוזיקלי'],
        bars: ['שם', 'איזור', 'עיר', 'מחיר'],
        design: ['שם', 'איזור', 'עיר', 'התמחות', 'מחיר'],
        bridal: ['שם', 'איזור', 'עיר', 'מחיר'],
        grooms: ['שם', 'איזור', 'עיר', 'מחיר'],
        arrival_confirmation_companies: ['שם', 'איזור', 'מחיר'],
        makeup: ['שם', 'איזור', 'עיר', 'מחיר'],
    };

    function fetchSuppliers(supplierType) {
        // הצגת אינדיקציה שהנתונים נטענים
        tableBody.innerHTML = '<tr><td colspan="5">טוען נתונים...</td></tr>';
        
        fetch(`/get-${supplierType}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data); // לוג של הנתונים שהתקבלו
                populateTable(supplierType, data);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
                tableBody.innerHTML = `<tr><td colspan="5">שגיאה בטעינת הנתונים: ${error.message}</td></tr>`;
            });
    }

    function populateTable(supplierType, suppliers) {
        tableHeader.innerHTML = '';
        tableBody.innerHTML = '';
        addSupplierForm.style.display = 'none';

        const fields = supplierFields[supplierType];

        // הוספת עמודות כותרת
        fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            tableHeader.appendChild(th);
        });

        // הוספת עמודת מחיקה
        const deleteHeaderTh = document.createElement('th');
        deleteHeaderTh.textContent = 'מחיקה';
        deleteHeaderTh.style.width = '80px';
        tableHeader.appendChild(deleteHeaderTh);

        // בדיקה אם יש נתונים
        if (!suppliers || suppliers.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = fields.length + 1;
            emptyCell.textContent = 'אין ספקים להצגה';
            emptyCell.style.textAlign = 'center';
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
            return;
        }

        // הוספת שורות לספקים
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            
            // הוספת שדות המידע
            fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = supplier[field.toLowerCase()] || 'לא זמין';
                row.appendChild(td);
            });
            
            // הוספת כפתור מחיקה
            const deleteTd = document.createElement('td');
            deleteTd.style.textAlign = 'center';
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.style.backgroundColor = 'transparent';
            deleteBtn.style.border = 'none';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '16px';
            deleteBtn.title = 'מחק ספק';
            
            deleteBtn.addEventListener('click', () => {
                if (confirm('האם אתה בטוח שברצונך למחוק ספק זה?')) {
                    deleteSupplier(supplierType, supplier.id);
                }
            });
            
            deleteTd.appendChild(deleteBtn);
            row.appendChild(deleteTd);
            
            tableBody.appendChild(row);
        });

        suppliersTable.style.display = 'table';
    }

    function deleteSupplier(supplierType, supplierId) {
        fetch(`/delete-${supplierType}/${supplierId}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchSuppliers(supplierType);
        })
        .catch(error => {
            console.error('שגיאה במחיקת הספק:', error);
            alert('אירעה שגיאה במחיקת הספק');
        });
    }

    // האזנה לאירועים
    loadSuppliersBtn.addEventListener('click', () => {
        const supplierType = supplierTypeSelect.value;
        console.log('Loading suppliers for type:', supplierType); // לוג של סוג הספק שנבחר
        suppliersTable.style.display = 'table';
        fetchSuppliers(supplierType);
    });

    addSupplierBtn.addEventListener('click', addSupplier);
});