


document.addEventListener('DOMContentLoaded', () => {
    const supplierTypeSelect = document.getElementById('supplier-type');
    const loadSuppliersBtn = document.getElementById('load-suppliers-btn');
    const suppliersTable = document.getElementById('suppliers-table');
    const tableHeader = document.getElementById('table-header');
    const tableBody = suppliersTable.querySelector('tbody');

    const supplierFields = {
        halls: ['שם', 'איזור', 'עיר', 'מחיר'],
        photographers: ['שם', 'איזור', 'עיר', 'מחיר'],
        djs: ['שם', 'איזור', 'עיר', 'סגנון מוזיקלי', 'מחיר'],
        bars: ['שם', 'איזור', 'עיר', 'מחיר'],
        design: ['שם', 'איזור', 'עיר', 'התמחות', 'מחיר'],
        bridal: ['שם', 'איזור', 'עיר', 'מחיר'],
        grooms: ['שם', 'איזור', 'עיר', 'מחיר'],
        arrival_confirmation_companies: ['שם', 'איזור', 'מחיר'],
        makeup: ['שם', 'איזור', 'עיר', 'מחיר'],
    };

    function fetchSuppliers(supplierType) {
        tableBody.innerHTML = '<tr><td colspan="5">טוען נתונים...</td></tr>';

        fetch(`/get-${supplierType}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                // ממיין את הנתונים לפי "איזור"
                data.sort((a, b) => {
                    if (a['איזור'] < b['איזור']) return -1;
                    if (a['איזור'] > b['איזור']) return 1;
                    return 0;
                });
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

        const fields = supplierFields[supplierType];

        // הוספת כותרות לטבלה כולל עמודת "פעולות"
        fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            tableHeader.appendChild(th);
        });
        const actionsTh = document.createElement('th');
        actionsTh.textContent = 'להסרה ממאגר הספקים';
        tableHeader.appendChild(actionsTh);

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

        suppliers.forEach((supplier, index) => {
            const row = document.createElement('tr');

            fields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = supplier[field] || 'לא זמין';
                row.appendChild(td);
            });

            // יצירת כפתור הסרה
            const actionsTd = document.createElement('td');
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', () => removeSupplier(supplierType, supplier['שם'], index));
            actionsTd.appendChild(removeBtn);
            row.appendChild(actionsTd);

            tableBody.appendChild(row);
        });

        suppliersTable.style.display = 'table';
    }

    function removeSupplier(supplierType, supplierName, rowIndex) {
        
        if (!confirm(`האם אתה בטוח שברצונך להסיר את הספק "${supplierName}"?`)) return;
        const encodedSupplierName = encodeURIComponent(supplierName);
        fetch(`/delete-supplier/${supplierType}/${encodedSupplierName}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('שגיאה במחיקת הספק');
                }
                return response.json();
            })
            .then(data => {
                console.log('Supplier removed:', data);
                alert(`הספק "${supplierName}" הוסר בהצלחה.`);
                // הסרת השורה מהטבלה באופן דינמי
                tableBody.deleteRow(rowIndex);
            })
            .catch(error => {
                console.error('Error removing supplier:', error);
                alert('שגיאה בהסרת הספק: ' + error.message);
            });
    }

    loadSuppliersBtn.addEventListener('click', () => {
        const supplierType = supplierTypeSelect.value;
        fetchSuppliers(supplierType);
    });
});
