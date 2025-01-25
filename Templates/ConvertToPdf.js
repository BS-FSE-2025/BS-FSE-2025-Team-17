document.getElementById("checkout-button").addEventListener("click", async function () {
    // פונקציה לשליפת פרטי המשתמש
    async function fetchUserDetails() {
        try {
            const response = await fetch("/getUserDetails", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken") || ""}`,
                    "Content-Type": "application/json"
                }
            });


                    if (response.ok) {
                        return await response.json();
                    } else {
                        return null;
                    }
                } catch (error) {
                    return null;
                }
            }

            const userDetails = await fetchUserDetails();

        

            // עדכון שם המשתמש עם רווח בלתי נשבר
            if (userDetails.name) {
                userDetails.name = userDetails.name.replace(/(\S+)\s(\S+)/g, "$1\u00A0$2");
            }

            const cartElement = document.getElementById("cart");

            // שכפול תוכן העגלה להסרת כפתורים שאינם נחוצים
            const clonedCart = cartElement.cloneNode(true);
            clonedCart.querySelectorAll("button").forEach(button => button.remove());

            // הסרת כותרת "האירוע שלך" מהעותק של העגלה
            const eventTitle = clonedCart.querySelector("h2");
            if (eventTitle) {
                eventTitle.remove();
            }

            // הסרת כותרת "סה\"כ" מהעותק של העגלה
            const totalTitle = clonedCart.querySelector(".cart-total-wrapper");
            if (totalTitle) {
                totalTitle.remove();
            }

            // טיפול בערים עם שתי מילים (הוספת רווח בלתי נשבר)
            // clonedCart.querySelectorAll(".cart-items-wrapper li").forEach(item => {
                // const cityMatch = item.textContent.match(/עיר - (.+)/);
                // if (cityMatch && cityMatch[1]) {
            //         const city = cityMatch[1];
            //         const updatedCity = city.replace(/(\S+)\s(\S+)/g, "$1\u00A0$2");
            //         item.textContent = item.textContent.replace(city, updatedCity);
            //     }
            // });

            // הוספת פרטי המשתמש לעמוד הסיכום
            const userDetailsElement = document.createElement("div");
            userDetailsElement.className = "user-details";
            userDetailsElement.innerHTML = `
                <p>לכבוד - ${userDetails.name || ""}</p>
            `;
            clonedCart.insertBefore(userDetailsElement, clonedCart.firstChild);

            // יצירת חלון חדש לעמוד הסיכום
            const tempWindow = window.open("", "_blank");
            if (!tempWindow) {
                console.error("הדפדפן חוסם חלונות קופצים. בטל את החסימה ונסה שוב.");
                return;
            }
            console.log("חלון סיכום נפתח:", tempWindow);

            tempWindow.document.write(`
                <!DOCTYPE html>
                <html lang="he">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>סיכום עגלה</title>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
            <style>
                   body {
                    font-family: 'David Libre', Tahoma, Geneva, Verdana, sans-serif;
                    direction: rtl;
                    margin: 0;
                    padding: 20px;
                    background: #FAF3E0; 
                    color: #333333;
                    line-height: 1.8;
                }

                header {
                   margin-bottom: 40px;
                    padding: 20px;
                    background:rgb(200, 170, 140);; 
                    color: #ffffff;;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 5px solid rgb(180, 160, 140);

                   
                }

                .header-title-wrapper {
                    text-align: center; /* הכותרות מיושרות למרכז */
                    margin-right: 0;
                }

                .header-title {
                    font-size:36px;
                    font-weight: bold;
                    margin: 0;
                    margin-bottom: 10px; /* מרווח בין הכותרת הראשית לתת הכותרת */
                    word-spacing: 5px; /* רווח בין מילים */
                    letter-spacing: 1px; /* רווח בין אותיות */
                    color:#333333;
                }

                .subheader-title {
                    font-size: 24px;
                    font-weight: 300;
                    margin: 0; /* מוודא שאין רווחים מיותרים */
                    word-spacing: 5px; /* רווח בין מילים */
                    letter-spacing: 1px; /* רווח בין אותיות */
                    color:#333333;
                }

                .logo-wrapper {
                    width: 120px; 
                    height: 120px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff; 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    position: absolute;
                    right: 30px; /* ריווח בין הלוגו למסגרת הימנית */
                    top: 50%;
                    transform: translateY(-50%); /* ממקם את הלוגו במרכז אנכי */
                                
                   
                }

                .logo-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain; 
                    border-radius: 50%;
                }

                .cart {
                    background:#F2E8D5; 
                    padding: 30px;
                    border: 1px solid #D1B58F; /* מסגרת בצבע זהב-חול */
                    border-radius: 15px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    margin-top: 20px;
                }

                .cart-items-wrapper ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .cart-items-wrapper li {
                    padding: 15px;
                    margin-bottom: 15px;
                    background: #FAF7F2;  
                    border: 1px solid #A78C6D;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .cart-items-wrapper li:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .cart-items-wrapper li span {
                    font-size: 18px;
                    font-weight: bold;
                    color: #8C6E4F;
                }

                .cart-total-wrapper {
                    font-size: 22px;
                    font-weight: bold;
                    text-align: center;
                    color: #333333; /* אפור כהה */

                    margin-top: 20px;
                }

                .no-pdf {
                    text-align: center;
                    margin-top: 30px;
                }

                #download-pdf-btn {
                    background: #D1B58F;
                    color: #000000;
                    padding: 12px 30px;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    display: inline-block
                    margin: 0 auto; /* מרכז את הכפתור */
                }

                #download-pdf-btn:hover {
                    background: #c9a273;
                    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
                    transform: scale(1.05);
                }

                @media print {
                    .no-pdf {
                        display: none;
                    }

                    #download-pdf-btn {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <header>
                <div class="logo-wrapper">
                    <img src="12.png" alt="לוגו">
                </div>
                <div class="header-title-wrapper">
                    <div class="header-title">סיכום האירוע</div>
                    <div class="subheader-title">פרטי העגלה</div>
                </div>
            </header>
            <div class="cart">
                <div class="cart-items-wrapper">
                    ${clonedCart.innerHTML}
                </div>
                <div class="cart-total-wrapper">
                    <p>סה"כ ₪: <span>${document.getElementById("cart-total").textContent}</span></p>
                </div>
                <div class="no-pdf">
                    <button id="download-pdf-btn">הורד PDF</button>
                </div>
            </div>
            <script>
               document.getElementById("download-pdf-btn").addEventListener("click", function () {
                const downloadButton = document.getElementById("download-pdf-btn");

                // שמירת הסגנונות המקוריים
                const originalParentTextAlign = downloadButton.parentElement.style.textAlign || "";
                const originalMargin = downloadButton.style.margin || "";

                // הסתרת הכפתור
                downloadButton.style.display = "none";
                

                // מניפולציה על טקסט הערים בלבד
                const cartItems = document.querySelectorAll(".cart-items-wrapper li");
                cartItems.forEach(item => {
                    const cityTextMatch = item.textContent.match(/עיר - (.+)/); // שליפת ערך העיר
                    if (cityTextMatch && cityTextMatch[1]) {
                        const city = cityTextMatch[1];
                        const updatedCity = city.replace(/(\S+)\s(\S+)/g, "$1\u00A0$2"); // הוספת רווח בלתי נשבר
                        item.textContent = item.textContent.replace(city, updatedCity);
                    }
                });

                // יצירת PDF
                const element = document.body;
                const options = {
                    margin: 0.5,
                    filename: 'האירוע שלך.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 1 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };

               html2pdf().from(element).set(options).save().finally(function () {
                // הפניה לדף ביקורות (או פעולה אחרת שתרצי לבצע לאחר יצירת ה-PDF)
                    window.location.href = "Reviews.html";
});
                });
            </script>
        </body>
        </html>
    `);
});