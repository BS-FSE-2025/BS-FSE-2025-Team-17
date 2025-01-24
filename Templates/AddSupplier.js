// document.addEventListener("DOMContentLoaded", function () {
//     const supplierTypeSelect = document.getElementById("supplier-type");
//     const dynamicFieldsContainer = document.getElementById("dynamic-fields");

//     // מיפוי של הטבלאות לעמודות שהתקבלו מהמסד
//     const tableColumns = {
//         "Arrival confirmation companies": ["שם", "איזור", "מחיר", "טלפון"],
//         "Bars": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
//         "Bridal clothes": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
//         "DJ": ["שם", "איזור", "עיר", "סגנון מוזיקלי", "מחיר", "טלפון"],
//         "Design": ["שם", "איזור", "עיר", "התמחות", "מחיר", "טלפון"],
//         "Grooms clothes": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
//         "Hall": ["שם", "איזור", "עיר", "מחיר", "מחיר סופי", "טלפון"],
//         "Makeup": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
//         "photos": ["שם", "איזור", "עיר", "מחיר", "טלפון"]
//     };

// const supplierType = document.getElementById("supplier-type").value;
// const inputs = document.querySelectorAll("#dynamic-fields input");
// const fields = {};

// // איסוף הנתונים מהשדות הדינמיים
// inputs.forEach(input => {
//     fields[input.name] = input.value;
// });

// console.log("Collected fields:", fields); // בדיקת הנתונים שנאספו


//     // מאזין לשינוי בבחירת סוג הספק
//     supplierTypeSelect.addEventListener("change", function () {
//         const selectedType = supplierTypeSelect.value;
//         const columns = tableColumns[selectedType];

//         // ניקוי השדות הקודמים
//         dynamicFieldsContainer.innerHTML = "";

//         // יצירת שדות חדשים על בסיס העמודות של הטבלה שנבחרה
//         columns.forEach(column => {
//         const fieldWrapper = document.createElement("div");
//         const label = document.createElement("label");
//         const input = document.createElement("input");

//         label.textContent = column;
//         input.type = "text";
//         input.name = column;

//         fieldWrapper.appendChild(label);
//         fieldWrapper.appendChild(input);
//         dynamicFieldsContainer.appendChild(fieldWrapper);
//         });
//     });
//     });
// document.getElementById("add-supplier-form").addEventListener("submit", function (e) {
//     e.preventDefault(); // מניעת ריענון הדף

//     const supplierType = document.getElementById("supplier-type").value;
//     const inputs = document.querySelectorAll("#dynamic-fields input");
//     const fields = {};

//     // איסוף הנתונים מהשדות הדינמיים
//     inputs.forEach(input => {
//         if (input.value.trim() !== "") { // לבדוק שהשדה לא ריק
//             fields[input.name] = input.value;
//         }
//     });

//     // בדוק אם יש סוג ספק ושדות לפני שליחה
//     if (!supplierType || Object.keys(fields).length === 0) {
//         alert("יש לבחור סוג ספק ולמלא לפחות שדה אחד.");
//         return;
//     }

//     // שליחת הנתונים לשרת
//     fetch('/add-supplier', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             supplier_type: supplierType,
//             fields: fields
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Response from server:", data); // הדפסת תגובת השרת
//         if (data && data.status === "success") {
//             alert("הספק נוסף בהצלחה!");
//             document.getElementById("add-supplier-form").reset(); // איפוס הטופס לאחר הוספה
//             dynamicFieldsContainer.innerHTML = ""; // ניקוי השדות הדינמיים
//         } else {
//             alert("שים לב: " + (data ? data.message : "תגובה לא תקינה מהשרת"));
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//         alert("שגיאה: " + error.message);
//     });
// });


document.addEventListener("DOMContentLoaded", function () {
    const supplierTypeSelect = document.getElementById("supplier-type");
    const dynamicFieldsContainer = document.getElementById("dynamic-fields");

    const tableColumns = {
        "Arrival confirmation companies": ["שם", "איזור", "מחיר", "טלפון"],
        "Bars": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
        "Bridal clothes": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
        "DJ": ["שם", "איזור", "עיר", "סגנון מוזיקלי", "מחיר", "טלפון"],
        "Design": ["שם", "איזור", "עיר", "התמחות", "מחיר", "טלפון"],
        "Grooms clothes": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
        "Hall": ["שם", "איזור", "עיר", "מחיר", "מחיר סופי", "טלפון"],
        "Makeup": ["שם", "איזור", "עיר", "מחיר", "טלפון"],
        "Photos": ["שם", "איזור", "עיר", "מחיר", "טלפון"]
    };

    supplierTypeSelect.addEventListener("change", function () {
        const selectedType = supplierTypeSelect.value;
        const columns = tableColumns[selectedType];

        dynamicFieldsContainer.innerHTML = "";

        columns.forEach(column => {
            const fieldWrapper = document.createElement("div");
            const label = document.createElement("label");
            const input = document.createElement("input");

            label.textContent = column;
            input.type = "text";
            input.name = column.trim();

            fieldWrapper.appendChild(label);
            fieldWrapper.appendChild(input);
            dynamicFieldsContainer.appendChild(fieldWrapper);
        });
    });

    document.getElementById("add-supplier-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const supplierType = supplierTypeSelect.value;
        const inputs = document.querySelectorAll("#dynamic-fields input");
        const fields = {};

        inputs.forEach(input => {
            if (input.value.trim() !== "") {
                fields[input.name] = input.value.trim();
            }
        });

        if (!supplierType || Object.keys(fields).length === 0) {
            alert("יש לבחור סוג ספק ולמלא לפחות שדה אחד.");
            return;
        }

        fetch('/add-supplier', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ supplier_type: supplierType, fields: fields })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
            if (data && data.status === "success") {
                alert("הספק נוסף בהצלחה!");
                document.getElementById("add-supplier-form").reset();
                dynamicFieldsContainer.innerHTML = "";
            } else {
                alert("שים לב: " + (data ? data.message : "תגובה לא תקינה מהשרת"));
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("שגיאה: " + error.message);
        });
    });
});
