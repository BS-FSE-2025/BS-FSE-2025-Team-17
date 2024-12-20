// First Try for data inserting dynamiclly
// // Check for right loading
// document.addEventListener("DOMContentLoaded", function() {
//     const form = document.getElementById("contact_form");

//     form.addEventListener("submit", function(event) {
//         event.preventDefault();

//         // Gets Values
//         const name = document.getElementById("name").value;
//         const phone_number = document.getElementById("phone_number").value;
//         const content = document.getElementById("content").value;

//         // Empty Value is inavalid
//         if (!name || !phone_number || !content) {
//             alert("נא למלא את כל השדות!");
//             return;
//         }

//         // שולח את הנתונים לשרת באמצעות Fetch
//         fetch("/submit", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 name: name,
//                 phone_number: phone_number,
//                 content: content
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             // מציג את התגובה מהשרת
//             if (data.message) {
//                 alert(data.message);
//             } else {
//                 alert("הייתה בעיה בשליחת הנתונים");
//             }
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             alert("שגיאה בשרת. אנא נסה מאוחר יותר.");
//         });
//     });
// });
