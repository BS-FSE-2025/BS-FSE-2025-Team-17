document.getElementById("checkout-button").addEventListener("click", function () {
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

    // יצירת חלון חדש לעמוד הסיכום
    const tempWindow = window.open("", "_blank");
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
                    background: linear-gradient(135deg, #f9f4ee, #f5ede6);
                    color: #333;
                    line-height: 1.8;
                }

                header {
                    margin-bottom: 40px;
                    padding: 20px;
                    background: #f2d8c2; /* גוון חום בהיר */
                    color: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
                    position: relative;
                    display: flex;
                    align-items: center; 
                    justify-content: center; /* מבטיח מרווח בין הכותרות ללוגו */
                    

                   
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
                    color: #e0bfa1; /* גוון טיפה בהיר יותר */
                }

                .subheader-title {
                    font-size: 24px;
                    font-weight: 300;
                    margin: 0; /* מוודא שאין רווחים מיותרים */
                    word-spacing: 5px; /* רווח בין מילים */
                    letter-spacing: 1px; /* רווח בין אותיות */
                    color: #d9b799; /* גוון טיפה בהיר יותר */
                }

                .logo-wrapper {
                    width: 120px; /* גודל הלוגו */
                    height: 120px;
                    border-radius: 10px;
                    background: #fff; /* רקע לבן ללוגו */
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
                    object-fit: contain; /* שומר על פרופורציות */
                }

                .cart {
                    background: #f0e3d6; /* צבע מקורי של העגלה */
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
                    background: #f9f9f9;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .cart-items-wrapper li:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .cart-items-wrapper li span {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                }

                .cart-total-wrapper {
                    font-size: 22px;
                    font-weight: bold;
                    text-align: center;
                    color: #d4a373;
                    margin-top: 20px;
                }

                .no-pdf {
                    text-align: center;
                    margin-top: 30px;
                }

                #download-pdf-btn {
                    background: linear-gradient(135deg, #b08968, #8d6e4a);
                    color: white;
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
                    background: linear-gradient(135deg, #8d6e4a, #704d32);
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
                    <img src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAASUAAAElCAIAAAAtBWMgAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADg2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4KPHg6eG1wbWV0YSB4bWxuczp4PSdhZG9iZTpuczptZXRhLyc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczpBdHRyaWI9J2h0dHA6Ly9ucy5hdHRyaWJ1dGlvbi5jb20vYWRzLzEuMC8nPgogIDxBdHRyaWI6QWRzPgogICA8cmRmOlNlcT4KICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnPgogICAgIDxBdHRyaWI6Q3JlYXRlZD4yMDI1LTAxLTA5PC9BdHRyaWI6Q3JlYXRlZD4KICAgICA8QXR0cmliOkV4dElkPjNlMjhmYzlmLTEyZDctNDFiNy1hOGQ3LTYxZWI2MzdiZGFmNTwvQXR0cmliOkV4dElkPgogICAgIDxBdHRyaWI6RmJJZD41MjUyNjU5MTQxNzk1ODA8L0F0dHJpYjpGYklkPgogICAgIDxBdHRyaWI6VG91Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5CbGFjayBhbmQgWWVsbG93IFNpbXBsZSAmYW1wOyBDaXJjdWxhciBDaHVyY2ggTG9nbyAtIDE8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/Po78vvkAACAASURBVHic7V13nBTF1m0FBFxAwoIgUSQteck5CZJEQIKASBAQUaJIRkSCEkTJQVABlZwlByWKgIIgIElARHKSzPO59R3mvLlf0TO7zE737M4uff6Y3+xsd1V19T117626dctQDgKM/7oQERHh+a9///339u3bFy9ePHDgwIYNG+bNmzdlypQPP/zw3XffbdOmTcOGDatXr162bNmCBQtmz549Y8aMadOmfeqppxInTpwwYcJkyZKFhoZmypQpR44c+fPnL1asGK6sVq1akyZNOnbs+P77748ZM+arr75asWLFtm3bjh49ev369X/++cdrC9EM/AufXhvpwEYYsd2AeAhILcTXU3Zv3bp15MiRtWvXTp06tV+/fs2bN69YsWKuXLlSp0795JNPPv7440ZgkCBBgpCQENC1ZMmSDRo06Ny584gRI2bPnr1ly5YzZ85gLDC1k/RzuBcIOHyzB1Riph/v3Llz6NChuXPn9u/fv27dus899xzkPgpegRggXqpUqaC1ChQoULp06apVq+LGZs2atWvX7q233uratWuPHj3A1YEaBgwY0K1bN+jDxo0b16hRo0yZMrg3a9asD6UxlCSuKVGiROvWrUeOHLlq1arTp0+bdGBkY4cD/+DwzX9AD5gMRXy/dOkSLMPhw4fDrgsLC0uSJImnoOPH9OnTFy9eHNoGtt+QIUNgRi5duhSGHwzL8+fPw/YDVyMz/6IGmoR7b9y4ATP1t99+27Rp08KFCydOnNi3b9+WLVuCwNCoyZMn9+ThY489BmM1PDz8tddegy26c+dO2Lqez2u11x5tOHyLNiBzkDz9l3PnzkGme/fu/cILLzz99NMQXF2OEyVKBFvu+eef79Sp0+jRo8Grffv2Xb161Xc6gcaUdeIfD7BJvmghXAMWnThxYt26dZMmTerevXu9evWgD1OmTGliILRfzpw5oVrJPRjDeiGO0vMPDt98hYlmkNoffvhh2LBhtWvXDg0N1SUVgpshQwb83qdPn5kzZ/7888/Xrl0zUVQvVghj+4xFhAtC1MgKv3fv3tmzZ8HAjz76qFGjRjly5HjiiSdM3IMxDL03Y8YM2Jym9jvE8x0O3x4C0kD+hF5avHjxG2+8AasM7pbuekEbwIaEJfn9999fuXLFUwpJrWCYBtQVpud/MZTs3r0bJm779u2LFSsGJ1DnHlw+DCWjRo3av3+/3E5Wx/pzBT8cvnkHBUj+hFc2d+7cVq1aZc6cWRe+NGnS1KxZE2oBus7k7YhiiStS6HVaEr8cOnTos88+w7ObhpikSZOWKlVqwIABe/bskbtM/ebABIdvZugMuXv37sqVKyFqsA85o8BPqLK33nprzpw5f/31l35vvHFs+CAmGxgu3MaNG/v161e6dOnEiRNLh+B7pUqVxo4de+rUKd6rXOyNB/1gOxy+/Q/6wIzv+/bt69+/f758+WTyA14ZBvhOnTqtXr365s2bphsjc8/iB0wPiD/37t07ZMgQ6LdEiRIJ8VKlSgX3D4YA/FVeabLGHTh8e0AmQKRZs2ZVrVqV8/gUI9iQb7/99tq1a/U5ukdzctz01Pi+a9cuDEzh4eEJEyaUHsuSJUuPHj1+++035ai7B/FI800XgpMnT2LAzp07twjNk08+WatWrRkzZly+fFm55SbeqzIfYfLT/vOf/2zZsqV79+7Zs2eXDgwJCYG6W7Nmjax8OKx7RPmmv/jt27e3bNkStpAISlhY2MCBAw8ePCjXOzSLDCaL8fr167An69atK7OasMNLlCgxadIkDlvq0WbdI8c3edkYdJcvX16zZk1Za4INWbt27fnz58tMozPb5jvE1GT3YrTq2bNn1qxZdbN8wIABXL7jgsQjyLpHiG/yguGGzZw5s3Tp0hh6KQqZMmWCLbR37165OA7N4wcb9K6DTps8eXKpUqUkeCVdunTvvvvu77//rh5J1j0SfJOXeufOnWnTpsFclEE3Z86co0aNunjxIq90FJpd0HsSpsTatWsbNmwo0aQpU6bs0KEDLfZHinXxnG/iXdy7d+/rr78uWLCgMC08PHzq1Kk3btzglXFCoUnwlw6vzZZVilh/KLaQzfjpp58aN27MtTuumLdq1ero0aPKzbrYbWoMIN7yTd4f3vfChQuLFy8uTCtatCictP/85z8qvgQiBX/79WmVnTt3NmjQgAt31HXw665evaoegfW6+Mk3GdfxaqtUqSJMy5MnzxdffHH37l0VBAOq1xiOKICLx4wZ06dPn969e/fo0aNLly5whMaOHXvixAnlemQpFp/Hjx//8ssvV6xYQVM5akLG2KCj9/m2bdtq166dIEECvprs2bPj1XAQDAa1HCDEN77JG/3zzz/bt28vpkvWrFkhmlywjsWl6shChKMGhe/27duM3pSQF3556qmnoK6Vm3Jc7ILs8prVq1ez3oeWH2PQWbdhwwYMiI+5gNaWLl0av6ggGA0DhPjDN3HQIZejRo1Kly4dBS4kJKRv375XrlxRQfMW0Qy0Z8uWLRMnTnzllVe+/fZbFSUlyAeM/fQ/CxcujBs/++yzjz/++LnnnmPM/uHDh5U75hhf0AP4/Yknnti1a5fStJ/XkqEhwc89e/bocWqBhpiO+FyyZEnJkiVlp0WzZs1EaQfD+7IR8YRv8mJgpcA94zIrPuvUqXPgwAEVs0yT6QEdGAV+++23WbNm9erV6/nnn0+bNi33leGza9euyq2XIiuQFxQpUgTX161bV65fvnw5xRTc44/8HUMMfkyePPnJkydV5Hzj7y1atGBj8uXLxwmkyOZgbNeE8uIw3Hz++eeZMmWSXT94Ilr+8cm8jPN8EyJdu3btnXfekcVriA5GzVgP3hOqVKhQQd9hwCiWTp06TZkyRabFoy4ET0ElULVqVeXmGzjMSI4PPvhAuXQg9SRsafwYGhr6999/R1Y4r1yzZg21iuHais7hKYqxKaCsO3/+/JtvvilTKRg645l5Gbf5JkSCl5IrVy6+JMgfhE9ctZhkGus6deoUbEX5hT+++OKLGLNfe+21zp07cxnqk08+UVGqNVOxQLly5XBjxYoVQZV79+7duXMHjOVTr1y5UmmrGg0aNMCP6BOZHPJaJgrhzC2UG0cBKcfzYowLZGOAIC9r8+bNxYoV48AEO6VVq1bwxlUcWbOJGnGYb6LWMCKKww1Tbd++fSpGRkTTbjdWN2LECOjYZ555hhPceqQFVQ18pIwZM6KpsOKUS+IfKkNyAZjGCRKQJDw8XHKl0MLUr6xUqRKnH/iL183m+ITNRrq+/vrrNHHhGSqPUYCP1qRJE1zQqFGjCxcu6GXa6GXJW8MwMXLkyJQpU7J5eNJ58+apuK/o4iTf5AWvW7eOEf0AxOWzzz4TZyCG26PcMvrRRx+xPXDVPFvCK2vWrIkL8ubNC7Kp6EwPwpIU249KKXv27L179xZuy8xKgQIFcAGUqtfy2YyjR49yVglm6qVLl9KnT4/vffr0UQ/yjbefOXNGpP+bb77xfDQbIe8XLcQjiAXetm1b7qyLu5SLe3zja4a52L17d5G8hg0bcnNxzBiQHGVhXGEMZiigbCD4448/KJdokvKQdX0yI1myZMeOHVO+SQ/LqV27Nm7EELNz506o8ePHjzO0Wk9noFwqFAoWV8IS81o+L2vWrBl7b8WKFfiTFG3evLnpFrYZY5nhCunGJ/xk/i6jHux52+knbcDIlSVLFjYVgxRt9ThqW8YlvsmMP6QN1pSotRkzZuj/DTRMlljmzJnXrl2rNMrRdwLrwD31IOV479y5c3nvnDlzlG+KgoXUq1cPd4EYEhyjHhxi+OXs2bOwOYUYuNizDatWrWIbmjZtyt9r1aqFP8uXL68XJahevTonVPBZpkwZ+R21lyhRAj++/PLLkdmufkPeKSxYuL5scOLEiQcPHiwr43bVFTOIM3wTqRo/fnxISAi7Hn4L57sDN9p5OgyUgCVLlhjuCX04bJAAWcuGucXmjRs3Tj1om7EoqEQoN6/GWxTNwCd8J86C3LlzR0VuKP76669URMOGDVPejEPczlUTGAiLFi1is7t162a4AgM41SRkVq5ZUEYO5MuXL2nSpE8++SQozQJ/+OEHzgm3b99eebOfrb8XKQTDE41eOuoczuJWfHnc4Bv7FD4GBQ5IkSIFLBz9v4GAME2f1eAXOPQ5c+akyNKshbHH9EEXL17kjEjlypVNBcqsIAQXF9SoUSNaLXn11VcNV+iTyYwUsCs2btzIJsHhwXdQ4siRI1zL5gV0MjkniSuholu2bMkVC4xlulrWnVJcPHv27Dx58uA71+iBHj16sBM2bdqkHnwXJr1qBaLo4DXQ+wXQyWvWrFFxyrYMdr5JR0NuGEsBFClS5JdfflGB7GgZU+GgDx06tFixYnryKTaJoobRvU6dOqlTp8b3Z599lhLQrl07ejvcU6drSH6HfOMCeFlRrI+Z2qPfRfJExjc4PIZ7xV/mV6hsgcOHD3MqMkeOHK+88kq2bNl4pYSJbd68WWl9K+t+4Dno17hxY3x///338a8bN25wvgrmPZkpcza4HQPQG2+8IVvdrLwOvRNQ8ocffkh9i86HC63izrxlUPNNOnHs2LGykI0xmzEQgVNrFI7r16+PGTOGO5SBmTNnSqVs1fbt2+nPvPfee3ApGdwIpYG7vv/+ewrxwIED1YMWnSneCjcqH/wQNgk1Tp8+feXKlZE9O8s5dOgQLEkYqxB3uFVQXGgbYyyB+vXr84n4C6h78ODBxYsXv/766/z9q6++Utp0CNQjH7Njx474E5azaGaJbuFqOx9Nt7eBLl26KPteloy/3333nbwaDAGctwx+2zJ4+caXDU8DBGO3Jk+eHNKmAj8JCZ0zadIkUadwFdatW0cHnZCBv1SpUlRrELXz589z/hCAzcMZwkKFCsnAz3tFXZOQI0aMUL65cH4DVcvpH3gK2ISdO3eGchaSy+Q7HWNYj0oLVaEaxziCNit3PAr0OQoEn6nGueapjxrclgE3Fc6k/i/dLfQbbNjp06dZi+GaQ9qzZ48KesoFKd/Ya2fOnOG6LY0fqoKAGuuUA5kKgx21atUqPS2HgOI7fPhwXrlo0SLlcswGDRpEbSBBSdB1SpMDlgNfFFZxtWrVOBfvo/xxZ4MvypCBlD4OTLzm6tWrTGvbpk0baTDcVFqMRYsW5YiDlnPBA4+Ml4IvEHopinfhofjsrVu3Nj0duoixyBbxr3sbsUTYoFVQqiq43blg5BvfGcwYuBbsSrzRc+fOqcCMXro0sPwFCxawXozfykUtWUc23QXLjeGLoKhcAA3A9SL6GPDlPFtOnWP7s/iCKHaF//TTTx9//PGUKVOUu8FLly5lV8CMVO5RhlqlcOHCnGUdP368/IvFcvEAj797926l+V3KtQ4BfThgwAB9FtQ/iLuBBnM+FkqYbmrQUi7o+CbWf4oUKfimMdxKnHggasSLOXv2rEmJwYakxHA/y4ULF+CkwXqE0SiX8ZPLVmnTpuWIQLGDqQMPh+2HkRnZwlQwe/n6TCb6Yf/+/cqlT/AJz1AUOCgn85m8BbY3p16aNWum3G9NFuJhYLNbRo8erewwpMWdowFvuFYdqdiDsG+DiG/ywqZOnSpZsuneBMJhk6n5vn37FixYUOJ62YaVK1fy5TVq1GjixIk0tICFCxcq9zumrEybNo3/+vzzz5U2zYAC4QSuXbtW14pBjogHt5yzN3bs2AEFwqfgI6MTDNdkDz4bNGig3NOS7NI6depQ1eBG9aByw5hluINUhg4dqjSTwcorZuHHjx/noiJbdf36dRWwMdpvBAvfZDQaNmwYuwx2Gjx7FTDbgKLDMBFIgO7W60aRhIzVrFlz48aN+vwkL4Na4/Q6t8nI4wSnPWMRfKg///xT0rlKLKVp6Q/jlHJ3FD9hrCZNmlQUIxxd9aCJbgWs4sqVKzQ3DFestuwqsKUKWxAUfBOydenShZ0FCebGp8B1lsmz1+PixS7iv9KlS7d69WpT8JQ+z8ZlaIyppmVoX+Y2gh9eA+W6devGU5Fl4zyf+uWXX+YgtXXrVvXgwFStWjUOo1w44Qoe+Xbt2rVOnTqBkMqCRyczKLKwkStXLjjYKpgoF/t846tCZ8FPYzdlz56dy9n2zpJHPJjnUJazafebZtJ00wgi8vPPPyu3cMDRh6WkK7oDBw5wYuARQYQ7CwNXCJQ2xcUAt3r16sll/BcsUr7cVq1avfXWW4Zr0VK5rG58wrak3vO6+y5aDeMb6d27N6sDt4NqnSCW+UYCgFfNmzdnB8EED4QZoI+aJlIxRix37tz61kxes2nTJq6SSQqDZcuWcc3txx9/VMHnHsQYTFpID6dGj3333XdKcwROnjzJALc0adKcOXOmc+fOhjt2FNi3bx+jq7NmzeoZ4e1Hwyg5Y8aM4buDEsZAoAK8yOkjYpNvEjsrUZEVKlRg/rZAkA3j8ZtvvkmeUBT4AsaOHcspOCpVExtpIMF2Gj58uEw5ZsuWTV9Vi6/eWtSQp+YnbGn2DzwopZktSlvP5JZ2vAV879GjB8sRj0vcdesNYyEzZszgpE7q1KnXr19vS+EWEWt8kwli2mwA7HtJ+mljRSwNlg9XaTGUciLxX3cqK4yvXCjT15Hkxm3btnFXPwdL2Lq4LIqkOo8y0CHz58+nMvnXnXRQPGQMpuxbeunQckrL20cLwsYuZV1z587ldGiyZMmWLl2qYptyscM3GRGFbC+99JJkHAlEXVCbb7zxhmQXhUstgcKyG7ply5amBvD7K6+8YriCtkaNGsU4vUdToUUL7J/Lly/nz5+fiwfkIdC9e3fDtUqGYYtzJ9A/TJqkGxd65nb/2iBruYxTS5o06UNTDwYascA3WfjivkwAAh3dzAK+1KKzgl8WL14sK2mFChXiLAjw9ttvG66zO0z7yvj6d+3aNXDgQDl18ZH12XyBzEhRpufNm8fepvXIt9yrVy/+Asrxv1xljdo496/bWeby5csZCpM8efLYNSxjmm/sTTwtlQYNCb4GG+XYawYB2UAlUcV4B1wGmDNnjuFaoiUDTbfr8/uOWosuFixY8OKLLzLFECd4GZ6SJ08eSD8XysSGl+Hs0KFDY8aMASdBTtic3N7qn4Sw8JUrV7I66FL4CCqWKBejfBOdIw70Cy+8YD2OzgT24+bNm5s2baqHXylt+RWWIddeDVe82JEjR6j3PHdkKzdXHaZZQYS2e7V///6Ge9Ub5r1sVOU1MDLh4MnJVbT/06ZN++mnn+rTM9GChG5Sy6VPn54Da8xTLkb5RnGn8UYH2pQ0zjokGosxH7qhQkRoSVCYHtxwbWDl7hs95M+BLdA7k/oNxjm9KZk1ESv05s2b3L4NmsHcyJEjR758+YR73Ljgn7TwpS9atIhzY1myZDF5jDGDmOMbH3jIkCGyzkYbw8bUhaziyy+/5Lts27YtAz48hzH+cv36da69Gu64rWeffTay1CAOrIN8ExmAwyypLCkG8jry5s27du1a2D5379795ZdfZCVm+PDhypovN3PmTE41411z73lMUi6G+MZHnT59unS0pK+zqwoyRNI/9uvXT2kv0pM/kuRw4cKFDDHJmDGjJBW1q1UOdLBj//rrL6aOZW9L1NtPP/1EIzMsLEyO+RZDlJSDKXjmzBllTcvBaxC75tKlSyoGKRcTfONDrl69moYBLD1GP9luPXMh1XBv1uJoigESjPK62UxU4uHDh+GXcx+kQ7YYAOT7hx9+kJdCv467BwA4WkrbacH3CHVHXw72i7IQLMI3PmjQINZVrVq1mLRoAs43dtmePXtCQ0MNVyziunXrVGAiSCQoDJ3I5TVJxwAfXUUyjHkuuDkIKDzXVPgn88/CkmRgHRiFdydZ2Pbt20c3gZaLleAsU3A89wrHB7796z70hOnfYDcHKBW2WB2ygN6wYUP4BsyGnTp1au60pw3p2bPODGTMwzOilcNlpUqV/qsd3AOZ4U45DJ2MaB8wYICyxjeZJ5cVYLiUKkamKwPINwn8lfUuph8N0FNFuJNwMHlb4sSJmRw/S5Yscuagw6jgBMkDItGLpk8FTJw4kT5Iu3btqPRg9s+dO1dZliJKAowgRp+D1fpO4sAhgHzjoCUxBK+//roKsMH2rzuDPzOxGq5UjZyDog8ANsIacfy0YIMk3uMscd++fZW2C5FpbKpXr27vhDbLgTAw6xH8HVPAeiAQKL6xsz7//HPKffny5SNLCRyIevfu3UvlljBhQp4uoFw5SLhl+9VXX1WOqxZkoGBw5y60DZyrs2fP3rt378aNG9yiQSnymivNb7C0bdu2MfSkUKFCVK2Bk9KA8I2PsXXrVsaJZs+ePepTbQNRO8ZF7vkH5VavXv3XX39xdTssLMziPmIHgUCEO00gSEV2QeEULVo0TZo0/POxxx6TjR021mtSDE2aNLG9Ch32840dB2WSN29ewxWjKAcIBaIir2BdX3/9NWeQM2TIAM7jS9myZWVhx97GOLAO8ak6derEqUg5RhOvb/HixSowOzPILh5XAjBBeoAcOfv5pu9hMdx5QWyf/ed+jevXr8MlY+S+Cf/VTo3iKmrdunXj+ml98R56vPK4cePgyA0aNAhMu3jx4q1bt/C6bY+2Vdrk9gsvvMCZNtmfbmMthM18YxNHjx5NsnnuKLMO2TvXokULKM+nn356+fLlXmthY3r27ImWvPnmm/qZaQ6CFiYNJkHM9evXBxPkRBR7ySAzbSjfcCXzZlIP24dmO/kmbhsdp/DwcNmdaVcVEtX60ksvGa6YV27C99ov8qoWLFhg+/46BwFFhDslO6Fcue6YhPepp54KRMiE7EanBRvZUcwWYRvf2DJ0CvdKp0qVyuteMutVQLORbKlTp/ZlqPN7E4eD4AGlCMYk5ypTpkwZCJOPtfTr14/W2ZgxY2yvwja+sa0dOnRgW6dOnapsbavsCmePh4aGct+UL3EGjsMWD0ABuHv3LmOd06RJY/s8nOxMr1y5MlnNXHo2yo89fOMzM8214cqPoAKg2VAL+zpFihRBkm7JQUxCsic2bdrUcO0VsD3wXWZreHCx5Diyyz6ygW9syqlTpxgHAF/Tyo6JKKpg3lw4h7Ge9cVBbCHCnUORgbJZs2a1fdso5UoSh/EoSbvKt41vDRs2ZPtszzrGR+Um/CeeeMKW8DkHcReyTMezAfPkycMAPdvz3zCaOWnSpNu3b7erfKt8+692YDTQqVMnu1qml//ZZ5+xfEYYOGR7xCH7TgoXLgypKFasGI8xsDFXgHKFVvLI4nLlytllVVriG6vHYzM+OH/+/PbmI5FkJMw54ZmMxMEji3/dZyAzcqhu3br2OloUs9mzZ3Og//DDD5UdsmeJb6b8Pzwa1y4+sPC9e/cy80/Pnj1tLNxBPIDkfWKMZYcOHVQArEom20+RIoUt61v+841P+/3333MPRfPmza23RsByLly4wCBjFh6I2DkHcRqySM1zAj7++GNl94h/+PDhp59+2nAlDVCW9aeffJOQs9KlS3Ob2fHjx623Rgrnhmuua5csWVJyj1sv3EE8A9k1YcIEw5VkjcF9dlFOjtqhBTd9+nSLhfvJN1b56aefsh2TJ0+22A4d+kbVjBkz8sg8Z83aQWTQ85EEQmAw0FesWNFwHeBocYOcP3yLcB/qxTRylSpV8q9ur5CtNNy6xlRNjtvmIAqItcWjrcqWLWvj5mbK3pYtW+g39erVS1kQSH/4xpHjjTfe4A4lG0M9ZI4kderUKHzUqFF2lewgfoOSc/r0aaggSA50nbLb4GK2omTJklkJ8oo231gN6M6TY23MTcDR6Pr160z442Q9cBAtkF0bNmygIpozZ46yVQ0cO3aMEyf169dX/ipPP/23qlWrchOAjdE0LIQ5WwsXLhzoTBIO4h/IrmHDhkGEwA0bHTm9ZGDt2rXKLzJHj2+sYO7cuayVR57bMoToJT/55JM7d+60q2QHjxTILm4iqVatml1rSLLxslChQii5cuXK+u++Ixp8E6+0ePHihusMADmCMFpVeoJ9dPz48UyZMtm+iuLgkQJl6c8//2TcyUcffaRsVXHffPMNlY1/p41Hg2+mMzdsTExCxtarV89wnQinHDPSgQVQJr/99lsGuG/dulXZIaiycbls2bJ0efw4eMBXvsluP+pTVMZ8t9aJwY6YNGkSNxHGyqlcDuIZKD/vvvsuhKpEiRJ2LQ/IIXJ+qxxf+cZCp0yZwprsOgZAok65vS8QybwcPIIgta5du8Z4wPfff1/ZMYgLY5lJJW/evPDoVHSY7BPfxFlkSknoU1P1fkPfO1ejRg1bynTgQGmnoBmuFHc7duxQdlBO9qxQ8UyYMEFFR0P4xDfudJg6dSrrYOZN61qIJfCs+pQpU+7fv185lqQD+6AHZvg9oxgZmKwyX7580VJxD+ebJOrh3r4yZcrYkvGKt1+8eJF755xQEge2I8J9nCozfYwfP17Zpyc4HwNMmjTJ92Ifzjc9oBHAF2Xt9C29WHq0tp/D4MABoScjyZAhA3ex2GVDValSBcUWKFDA97nDh/BNznDjMVnwPm1JnMoH/vHHHxkUtmHDBuUoNweBAWWV5l+rVq2UfV7ckiVLqIRmzZqlfBPgh/DNlOiO3qF15UawCwKR89yBA4EcLvf4449D3mxJFCsuVbly5aLlHPqk32rUqGG4ziixJT+5nmIobdq0x44dUw7fHAQSFLlOnTrJNLh1UOvwICvfd8lExTdyYOfOndysznPKbRkYYO8WKVJEwm0cS9JBQEGp++OPP7hj05YJdknLxyM+fMxxHBXf2KC33noLxSVPnvzw4cO+lBg19GiS3Llz236ghwMHXqGf3FSqVClb5udYSN++fQ1XmkpfFrQi5ZvkumPkhy270eRIe24KtP2MAQcOIoMkZg4PD4fsffnll8qy7Eny82TJkvloAEbKN5qnTMMC89SWMwmNjgAAIABJREFUKUT9DMTixYs7B7I5iElQpBngHxYWdv36dWXTTHuzZs1orz00UNM732QZgFuty5cvr//uH+TAKtq7TlpyBzEMkWomlbMlfbBp7fuhUu2db7xh06ZNnEL97LPPlOVlAD2ll11BKg4cRAsUwgULFkAIs2TJcvHiRWWHFoGlxsDounXrRl1gVHzjTEloaOjZs2dtada1a9dy5MiBMufNm6cc5eYgxiEyXKFCBcjhyJEjlWU5pB4aMmQIZ02i3lDmhW/CjcyZM9u1Hs1HGjduHAqENneUm4PYgh7CAdfG+okXkoaZsyZDhw5VkRuDXvjGS7/66iuapMuWLVPWxgCTzuXeObuCVBw4iBaEWuXLl5doY4vSyDKZNKVEiRJRLDZEqt+YSzx37tx+bBo3gdXPnz+fW/SsF+jAgRXoW+OKFi1qfS2OdJ05c6bhyqkexXlxZr7xot9//53K0WI2WR3Vq1dHgZ988olylJuDWIVJxdllwV2+fDlDhgzCGq9CbuYbLxo/fjyZum3bNmXNeZP8sHZNvThwYB16si2YcsqmhTgeeQ0jLrIdOma+8YratWtz9431JWm2o127dijwnXfeUc60pIMgAEX6xo0bWbJkgWTu3btXWdMrlGqoSs56fP/998qbqD/AN9Z38uTJFClS4J7evXsra7Yfn+rcuXOpUqVCgbacWOfAgS3Qox/79++v7DApb968yXAOFKu8cecBvvHfDCZ+/PHHYQQqa/RggTx9G/6b3+U4cGA7KNi//vorhDNbtmy3bt1SdswLMl1K8eLFvU7DPMA3fWYyf/78Frdyy408O2vmzJnKmSlxEEygiL744ouQz0WLFilrKk4/8vuJJ57waqP+P9/E9uNpyO+++66yRg/ZPsfUEc7WGwfBBor3jBkzIKKNGjVSdgRRgUGhoaESn2li0P/zjeycN28eHT7r57KyJtrHHTt2tFiaAwe2gwy5cOHCU089lSRJktOnTys7KFe/fv3IHCgz37jnHOroypUrVuqWLHq5c+c2LJzf48BBQEErrHXr1pDSKVOmKGs2nb6clipVKs/Vr//xTUKu4Lbh0oYNGyo7fMf169cbrpN07DpswIEDe6HP4/OsGCuQORimIJk/f756UM0Y+nW//PJL4sSJcd3YsWOVNaLr2rJnz57KUW4OghKyEPfMM8889thjR44cURbm5MWsy5cvHyS/W7duyivfSK1Ro0bhIhiyFlOLy951LiZu3rxZOXxzEKygZHbo0AGyOmbMGGWHpuFetmLFiplWBR7Qb02bNmW+WIthJaxj48aNKC1HjhyOMekgmEFxXbFiBcS1Vq1ayr7YZaguU5YtQ2nq6LnnnsNFbdu2VXYsc/fr1w+ldenSRTnKzUEQQ0zK9OnTw586c+aMsjxTePLkyZCQEMj/559/rjSFeZ9vJufNYhJlyRJRtGhRlPbtt98qh28OghukQIsWLazvz6T8Q+B57HanTp2UJv+GFD1x4kSui+/Zs0dZ0G+88cCBAygtXbp0zjK3g+AHKTBt2jQIbZs2bZQdscsdO3ZEaSVLlmRRpIChHoz7yp49u8XDV9n0yZMno7RmzZpZbLoDBzEA2fb52GOPZcqUyeKWaP28xOTJk+vL6IasvPFg7iZNmig7Nry1atXKlnUFBw5iAJJQh07Qrl27lGUTb9++fVyF0yMz/8e3P//8E0SUhP4WjVcMD1mzZkVp8AmttNuBgxgD+dC9e3fI7aeffqrsYAGz0XGzD0sz9FwOwNKlS5WF6Q1S66effqJp6qwEOIgroMzPnTsXovvyyy8rOwIpGzVqZIrWMkg75hhPlizZiRMnlAWNxNKY9876uoIDBzEG8uHUqVMJEyYMDQ29ceOGsuzCQbMxvYJsbfuffgM3mI3LokYiu9q0aYPSJk6cqBznzUEcgaxj8aQ02GjKsuLhKdwhISGgMav43/objwtu0KCBsrzS95///CcsLAyl7dy500qLHTiIYejz+Bb3ClDs9+zZwxOzV61axfLv8+3SpUvcY/ree+9Zr+PkyZMJEiSARrbl/BEHDmIMlHwwzfqOTYo9KMAMeZIG8j7ffv7550SJEuHX6dOnKwt80zNFW49Dc+AghqHP9hUvXtxK1n25q3LlyiitQ4cOSvTb4sWLOTlp8Shx/eACnj3nOG8O4hAkkBLmXtKkSWH3KQs6gzxq37496FCtWjX+eJ9vY8aMoVf3+++/K8vLfNwqa8sRVg4cxCSEWpUqVYIMR5GW3BdQ+IcPH878Xwzbus+3Xr164aeMGTPevHlTWVagZcqUQWnr1q1TTpiyg7gGfZ+0KbTfv6J41hy05fHjxxX5xtNQS5UqpQdWRhe869atW6GhoY8//rhFVenAQaxAX0Du0aOHsjx9uG/fPk5Rrl69WpFv1J4Wc5ZIxCfIljp1aiuq0oGD2AKV0oYNG8CImjVrKsvLY3///Xe6dOlQ2vjx4/Gncffu3Vy5cuHvzp07KwsWIG/87rvvrM/tOHAQW6DaOHHiBMT4ueees5LymHdBPXIBvU+fPvjTuHTpEpP7M1KZmRT8ANUuTF4U1bRpU+UYkw7iIHS36IknnrB4wLeev7lVq1b4fv9kEO4asJhvnDcOGDDAFBDtwEEcglCrdOnS1k+Y0XeWMv3r/UgTLr7BZlWWdwa89tprKGrq1KkqrvENHf2PN0Q9tuGpo3vXf13wrNqXnsc1XqsT4AI0KbrjcdRlsliWHK1i4yj4mM2bN7d+qAAp8P7770saLoPndEPF7du3T/lLZdNq+ooVK6y0Mr7C1LfoH7wAEzdslOl/XbCrtEAXGzwgSeBuySSHRaNv7NixzC1y48YNY/To0dz1/ddffylrriGkJ0+ePNZjq2MYbPyRI0cGDhwIJ/ZDN/B98ODBhw4dUt66RWJ/MHrpdwFDhgwxJbKOcEG5jpydM2dO586da9WqVaJECXjSFSpUqF+/fq9evRYuXPj333/rF5uAlzdu3Dg0yVSdtPbjjz+eMmXKsmXLDh8+TEefpUX2IiTGb8SIEUOHDvUsU4CSp02btn79evozXjsk3oAkIS/gHynLS3A8RTVZsmSQivsxyvgjffr0Vjb8yGFzKVOmTJQokfVzD2IScqxJpkyZ0BWPPfYYDWwum7z55pvKm67mXfXq1TNcBy/zlscff5zTs/q2Joo7uhc8fOaZZ/QqBPwlc+bMw4YN8zyITOKMePCK5+0mJE6cOH/+/F26dPnhhx/0Nnh9hFOnTiVNmtSXYnEBGtCkSZOtW7eyzLjyiqMFsovHSsH1UpYn7bmZG7zYv3+/wUSw+fLlsz71yb16cXHxjf3CwHAIa0IXGMOdJk0az4SEkkEQ14Bs+NRv0VMA8spjx44VK1aMIgvgSjCT3x93Ab/wT8OVlNcULcCqb9++zSwVUp2OBG7oDMGfUKSRmRt6Kg1U7bVYKZlDiQwr3bt3t37WdHBCX4KzeLQ3+3zXrl3svc2bNxuNGzfGt/Lly/MK/4qWckldjhBx6E2IQDPtu8gWxVc2U8j1fCXvvPOOqEG5uEqVKnKZbFBiHguSSnQFrifxdAXC0sLDw8W21Jtn0sBSjkBK4++8EiMI1KbysFSFb576zVSs0Fh+x/dXX301Jt5NjEM/9xQ2P3+0wguMtkmSJEFpS5YsuT9NabiX0v2GfhpOuXLlrDQxtsBHYA4zkVp+KVSokD6CiCdmMg75ZeXKlVKabnMKLQ0Py830J6/84IMPTOV45ZtXUHnKdz5F69atTbnso+CbV+gXsJGDBg1SccdR9xF8HBhreN6cOXNaUeMR7vPlmIzr/nbvsmXLGpYPd+SLXLRoEYqqXbu2laJiC2ww/C7mBdQVBT4XL16s3I+p70qUgZ9fuMYiGXbxed+E8FAdhisNKOchnn/+edMFrPq5556TRKBe+cZP/AIfo50LLVq0qFq1atq0aflfk67DF1yjPMxUE994V+7cueFotG3bFreg/AYNGjAowjS4QIxM+fHjAdgtV69ehV2QLl06K+lYZUaK+7nvywzFi4vfFrce8FxWmhlx8QWQIdOnTzc8TMo6deooTfTxyQwUujVoPHisJPukd+/ehofNCZ9KVzUtW7Y0HvQb6RNKFkSvfGNREuMnDbt48eIXX3yBgdnUPF7PjKB67Sa+sant27c3XQZemYxtXcXFrbXWqCEhJiAJ7EDdsPevKLy4bNmyGS7H5H7WOsPy7nE9qhrjopWiYhES8MaknxQsEe7du3crd7wbeKXTjKJsUuz8UrduXcNjAnP27NnKpUtZGkSZIT6iPXi97AeJgm88IhCcRIfr5i6GZ4wRhoeihgzJEWdR8O3111/nw3K1jW9TQiOieOp4AD7LvXv3YGLgGWENKmt8Q1EFChRAXw0ePNh4+umnDfeRiH6PUpSbjz76CEVhRLdSVOxCXzAxDeSM5+aTNmnSRGcRoe+ONwUAmPg2b948pXURyhw1alSfPn3ee++9/i4MGDCgR48eknDpoXzTgYvZBozQ3Ivo9UEkXsQr35hDXwZNsYtSp05tPGh5hoeHmx45rkNWUAoXLowH/OOPP5S1OBD0D9wHFHX/LHtalgxetsg3ZlJ4//33rRQVu5C+LlGihEnFYWA6d+4c/nvo0CFdQCn3nhPH/I7h3/Bw83isAleiRS89tFU+8o0gB7Zv364/Aj8zZMgA7afcMuQ732BZefKtWLFiVrZNBiHkQSgDVnZyisXBWZL7yZufeuopw3JmLp1v+FQW9hnEOihkUEGGhxc3evRo5Y704S9iAfIMV/2tsDO7du1qeJucfPPNN3VDBRfTvNSjFj3X33znmzTGtCLPe7lCyBb6wjd+Wbp0qeFh9DZu3FjFTXc9MgjfypUrhwe0csKwFFWxYkXDdRaiwVPhBg4cqCyQxHa+0dqxF75oEuWRGIKU4ycGvGvXrvFUSv5CmfOa/poySk/PNK1CkU2XLh3Ees6cOadPn5Z7vUYn+sc30mnSpEk630gn2iCMcHgo3zgZs23bNrr6pjEoHh/JQl/g4MGDyjLfOAv99ttvG/TULZKEN953Bw1jxIgRVooKBujLG/pMPcYmDOeirMRI++GHH1TkARycMkmUKJHnpD+RIkUKvA94v3y1yoO6VvQb2qYbk2x8y5YtVST6jZ/PPPNM9erV0aqqVatWq1ataNGilBPTkJE+fXofTwMNkLUZ0GK5NG0ljl9Qo0YNwxUdZjAEaejQocomvsH1V9YGPJQ2cuTIVq1atWvXrq0dQDkYsDt27Mjg44f2nbzFChUqeGonwUMNKpYDiaS7/Lgbegk6CZMkSQLzzzMtlBW+wf3gsbX6XVze8Oq/RQYJNyPI248//lj5PBcNdXrXVgRuTGeH16pVy7DpjCcW9frrr98PWzbc0Qy22JNW9onzzS1fvvyhrz+60Md1X/qOLVm2bJmpJaYFX4hv1GnbZaYBHrI+2WCKdQQJ9TlMTl+ZCoku33jXH3/84Tm7w1W7KPgmgZ2EKQyNQ0bz5s3VwzRMhHvjCAa7PHnyFChQIL99yJcvH3daBkjLQbfjMX/99Vdl2Z7EazKo3zg/SYM+1v03PtVvv/2WLVs2jMqw3560CRhWQDlOeERrbbBKlSqGx9S//OLL4r4sRsNPg7ENJ5A2hbBLF3ThIXeC6FN//um3/fv3szr9LuaGYj9Exjev4x1/xPUQGF+iZP91BxDqOtYWiEetrzraAimqfPnyqMJHmyjqopiS6/7JBAwCtJgBQecbAw4s6vrLly/Dbv7VPuzdu/fkyZPRagPFceXKlZ6Cwj8hx1wE98VAlWtQLB5t7NixEHqJvfJUoRBQtFlFf/3N1H6Tiqae79Kli3K/oyjsSc9WYXSGqPg+hSCzr4HQb0Ag9JtpPQCDhY8PG1lRsh5wP8CdkSY2rr9ZXFoIKrC/aAzoKo7ffQmCI9NkgpQRG1LyxYsXp02bxt0Dnt5R3759lW/xJV7xj3YEmSmgbMKECSoSvlFv1K5du3PnzoZHeErKlCkZMOnH+40r/puswTLU0Zb1blL3fnBf7ty58a1r167KQhAWnxzGEop69913lR18i7AbfrRBn9MXmeMnbFS/Z64iXAlLpFXnz5/XI8iMB70suSxafItwBwFyx72+6g21TJ/Eqz1JZr799tv4F2UjslDS6D5ydHsptooVnYyuQ59Yz3uAosLDww2Xj2AwskuPT/UDZNfEiRMNjyD0OA0RdFoB+lqcbDuKGps2bZo7d+6iRYsWuoAv+JOWLYnERTDuJjbtAzKFbkSLb/9ox9aaioUvwWu8zpeQby1atFAecW1yjcUsOkGOCHfQY/bs2dEbtsRPwvQ1GD/JkZX96zdJ+HZnzpyJopo0aWKlqKAC++vOnTuea9witVG/CZMtSmn+8MMPlXu5mVL7/fff6wLNikqXLq1PBkTBN9HhtFrZ+atWrTI5ZiwWhGe9EZHHK3O927P9LCFfvnxWouaDHGIawLuGF83YNyt8w4tjqMD9szs4CWPL/jee/BafAsYj3JviPPlWsWJF/RpPsE+g7Q33YrfsQytSpIgkKeFl/fr108WaX2T1Igq+1ahRw2vVkyZN4h5HU/iVHIwkLY+ab9u2bdNtUSmH06fxUsWxWy5dugSywV+1fogNxiauAtyP9WH0AzdK+g19f3fZsmX1yuI0rPCNOn/atGnGg3MtFFx0+86dO2GrnDhxAurONF3OiiQDr1e+iVmLEo4dO3b06NEDBw6sW7cOg6jJG5QGZMiQ4bffflMPLjNEwTe65TzBzBSBmSxZMlsCL4IQfKJDhw7hMeHCWUkOwrtOnTrFqMk5c+YYPNu+ZMmS+jvwr4l79uxBUTly5LCSeiioYIVvEe4ZSJLE0wuCZD/11FOUdR28smDBgrBjVeTzJUIkWWMEafWFaZNGQl2wWtXD9nfrfKOo/fHHH+nTp/dUcRZz6QQt2D9Q7L68ZV+K0o/IMRjtHhYWdldL4RZdRLjXc2E4pUiRwkpqvaCCFb4pt9qfPHmy4RG6ZUp3ZfqObvTcTedj/hK9IglbyZw5M5PY6RbgQ/kmqaDvb0x+UEuznfAgVLyzKvk43377rWGTn7Vp0yZ2744dOwxO4tuSfxIlwN7FC+P8m+/roUELi3yT/zKrgh4M5ZUn/FeSJEm4AdykiHzkGzmm1wKhYUZQzzzq6mF8kx4w2ajxeOKEWp1pNSzmPdD3McH6OHz4sEEHA+Y4+l1Z4xvMfR5tFXVIoSD4TX+Zn3z22WdNfKtQoYJ+zUMLgTOWMWPGKNjC3wsXLgxLRnmLV75161Zk6WK9Aix68cUXmVIlwluW5Sj4xnwKFBd9vDeZsoY7UiL4X6XvoNc6cuRIwx1XbDGfOfP6wO6Du25w1wn6zpYk5AzxXLJkiYpyVJD5a/j6wRyJIqM7aAChTJ06NRQ4PmHvcRrWR7BX4cuNHTv2hRdeCA0N1XegorSnn34a7tDXX3/NbFCmtyD6LW/evPDTUqVKldIb0qZNmz179rJly7Zu3XrChAkMBFGRJ0Lmj3/99VeGDBmSJ0/OYpnCuVOnTspDwTZp0gTNTpMmDavD9bgL98azFF2UW24UZiCORb7xCG+MlTdv3jQ2btzIt64nTvQD7O62bdsaD9uDyCtRUc+ePYsUKRIn0vTCarqq4cqVKzS/fYcuu5cvX969ezc0z/Lly9esWbNnz55r167Jf6OYgDE1wwT8FzrQpBh9sTJQu+npuFxhAvQ8/qVfiRvxLBwj4g3Y/8y2ZMv5OMwLXKxYMZRjHDhwgMlfv/jiC2WZytC/KKpXr15ei5LlpuPHj3PHKwbI8+fPq6Dnmy3g40dBJ7smHv51nZJle5c+Iu9IuUzKsLAww/LmN7ELDNcKEL4bGKUYpT548GBlmW/0Br3O6shYO2/ePNZouObN4tbhHnYhQotjftSePZghi91QQjDdoc+VtUkN5d61zJBUQ4IpIzsIxkfIqgVUVvXq1WU1jxFGZCPs1/tbgNxud4MGDRh87QicgyAB5fbgwYNwUytVqmQl1Z8pGJApFAzlTuHkX9y3Z3OvX78O30Yvh9/hpfDgcPqO33zzjZWKHDgIHKAe4Axb9Esp9hcuXEiRIgVk/ssvv1Tk2/00Xa5TKeydukBzjx07tmbNmsmTJ6MKZhMICQmBioO+Vi4rOZ4tlTpwIJCgKy6crFu3TpFvXGpIlSoVaWCdbyxBQnWp07h4lTNnzoULF547dy6YlwEcPJqw16+hLpk/f77himHgqsl9vjG3acKECe06B5hcup9N1r1+mjhxYj1pBzQsjOP33nsPpJepcAcOYgWeU1Y+piqNGmQB3DbOC3KJ5T7fduzYQZU3Z84cZUc4HEtYsmRJgwYNUN/XX3+9a9euH3/8EQQrWrSoTjzg2WefdWZNHMQWZIfh2bNn9+7de/z4cQYSKzvmMvB5PweeYTz//PP88T7f4NLxdC9OoQTU0kPhO3fuHDBgQPHixSWFqMWldgcO/AMpsXr16mrVqoECISEhyZIlCwsLe+edd6ykMVcajZkUvUOHDsol4YbSzu+wuMvb6/OAYNTO/7qPNSJIvEGDBsGjmzhxooovKYYcxBWQErT3dDzmPkpy1qxZylqmoL///ptbmZgYFxJu6HFY0DkxcLaQiXi3b9+2sqrowIEfoAR+/vnnskDVvHnzLl26NGrUiGHlDCpev3698svykp1v9J6WLVvGcgxqlVGjRuHX1KlTX7x4UcWU6JuI58BBzEC2AmfNmhViX79+fV3soZRGjBjBbBRFixb1TwPpBwkmTZpUrFOD/7i/89QFnqsUOBqYYgi9HgfjwEFAoZ/AXqBAAWYE4uZaiTrkJhrjwWM0o1sF9z1my5ZNDgE3ZBMUCc2M3wFypXRq6YvdUQTFO3BgOyhsMB0h8CNHjlQPpgOnNEJWeSCZlfNnatasaTx4XJkhAdFMRAlHTgVmLxPLPHr06KBBg9COIkWK4HnatWvHpBoO3xzEDCQXAU/SZkZ6mdXjNdQEjPVlHH+0cjlLFXQF9RN/789Pkgmvvvqq4UrVZiUhURTAM4BpTz75pOGxQxmss5J1zIED30Fp3759O+MumGVMR4Q7CS+XzsaMGaOiqd9Yxa5du7isrW+/NqQs5uKFVWn76jOL6tChg0R14TkLFiyYN29eSSkFn1W/2IGDAEGX9iRJkkDgoWPefPPNadOmgXuy2A16MLx+zZo1Kpr+G6tgnihTppL/12+S2XPevHnRrSAKsJz7mfdcSJMmzfDhw0+dOsUjF37++Wce1QOMGzfOxnodOPAKSvv9o9g8jhkD/XLnzg1Db8KECVBKTzzxREhIiB/7oXVztGjRorrBaMg3WHRZsmQxXKd4KJumTFgynpDng6RMmVI/elemX4sVK2a4kj1JxkXrVTtwEAWuXbu2cePGESNGNG7c+NlnnzWdlmy44+zllAjfZZJXgj6FCxc2XGcsKk2LGPpFnLGpWrVqdOuIDHLkHzNA8ZQ5GMdSMt1Q5h6DduXciaPiHMQkbt269dNPP02cOLF169YFChTgFAPj7N955x3ll/P222+/UeYnTZqkl/A/vvFv5qJMnTr1uXPnlB1801OpGe4tQDqd2LgjR47wIU2Nc+AgQOCeAM8sL1AGoMrMmTO7dOlSsGBBPxLa6mdFgXKm5GX/4xtL3Lx5s70HDpnOT/N0PeW8WSZY92MuyIGDaIHHPpp+JPdMy2By0lC0wFtatmzp6bwpkz15/fp1rhh0795d2SH3rPvkyZNcTDedEi4Tr8wypIeZWazXgQNPiObJnDkzJwW5tO0pb5LIPbqQTKHMWdKtWzf1oDwbpkvpwpUoUcKuwGWWUKtWLcO16+748ePKzUMxJpm9GFS/fPmyLZU6cGCCCBXnw+E6Ke3sIbtAkf7xxx851b9gwQIVGd90uzNJkiQHDhxQdgSasLLly5dTg+XPnx9eHDzUO3funDp1aty4cRKO/dFHHylHuTkIDGQNmvPkZ86c4e87duyYPHkyM4kI/A4wJIl4kH2qVKnOnj2rHtQf/883ibeiK/Xpp58qW1cFmCAa/mHChAmzZcsWFhbGvEUcCerWrRsDW4EcPLKgdPE0qObNmyu3X/Pmm28a7gzFvAZelX9ib0o4yePXTTDbk3L1iy++qGyVfhQ1YMAALmvoB8+Dfl26dNHjuZzwZQf2QtyqHDlyQORWrVrF36HWuB9UgnjBtFKlSlWuXNmPKCvTZLvXQGdD/4P/GzRoELWhvZmP2Zqff/4Ziq5ixYpFixZ94YUX+vXrpx+T6Uu+ewcOogtJqMPx/d1332Wicp44z5hhCt53331nuM6m/Ouvv1Q0hZ/0gYvElQD9KFnBA3yTUE7GuXz++efK1tl5qRtfoM3lYThHJP+F63jixAnl2JYObAJFq1mzZrKQDTsLFhzDnhhIyEWCt99+23AfDxTdqQSK60svvRRFYIrheQMqzps3L+555ZVXlN17c/TpV37X90Hs2bOHWSs7d+6snLkTB7Zi/fr1rVq14tkV9GXkYGRYmPfu3bt27ZpuXkZL/CLch3sx9daQIUOUN11lmP5mHeA37kmXLt2FCxdUwPSMbO5G+Zs3b27YsKGEsUGhO0nyHNgLytL58+enTZtWrVo1HgslKFSoECTQcB156cfUHanFhChQnpGlcvXON1ixHABg4KrABHzwYVDdihUr4MhxpGGlYWFhY8aMuX79unL45sAmeEZv7d+///3338+fP7/sxqSpGZlqemj5+ISNihLCw8Mj20Rq5pts9+ahOQ0aNPB6m0WwwF27dpUvX5404zMXK1YMDJdkD/ZW6uARhOg0ffjWXRiYkWvXrm3Tpg0tSVhYXuc5oobMTHIt7b333lORMNbMN/XgLGUg7Do2DiZysmTJSLbHH3+8cuXKS5YskQNDnFPRHNgCSlHjxo2fe+45emX6QbO6h3bp0qXx48f379/fjwkL0x4kLSUsAAAgAElEQVTWKE5p9MI3Xvfrr7/SwEUjlH0mJZ8fgwrMZSpxWNLoCM/1AGdtwIFFUH62bt1K6yljxoxel7gsJomTReOyZcvq29m8wgvfBGACZzalRL/bJOCIsnHjRoaVtG7dmr/rzyxMw5do5Wlx4EAHJZbHG1J5cKI/MnZZ2RCwc+dOxnJMnjxZRa6fvPNNT8CQIEECJqW0RduwZK4zgnLc7i2N01l37Nix9u3bg/P2nkrn4BGBjOx0i3LlykX3DMRQDwqzJMCzUtG7775ruNKFRL1Q7p1vspiA+w3LRw17Nm7FihU0JvFFuXNR6qtwr7/+evLkyWkGcNndWYtzEC3oyq1Xr16bNm2iyNWuXVs9yIdbt275bUaxnGvXrjFVMyMzo6BupPYk72nVqhVKyZAhg10LcTJfxOx/TMsV4QYUaYMGDbgKR7JlypSJp2Q5vpwD38HRef369YYrQxanHCFspJwkqKNQdezYsVSpUnpcoe+gafbll1/6uIEzUr7xnu+//56Olo2ZDvhIPI0RAKU3bNgAC9O0ClegQIEpU6Y4q3AO/AZUGQSpa9eu/HPv3r2cEg8PD2dmKqUl1/HjaA4Ry8qVKxu+5W6NlG9yD5fIypQpY9esCUu4cuUK03KBz3r6V3wvXbr07NmzGc8mawOOfnPgIyS/Iz23Y8eOKbeq6NmzJ8WMB0QB7du3x5+NGjVS0Zdtmf+knmAcZtQ6Kar5ST1EBTTw7+ACr+CDnTlzBua18C1x4sQ1atSARyfRNPo2cOVoOQe+QWI2pk6dOnbsWKXt8IIjw2QCcGfwHXYmY0pAThV9Y5KCyrPcMmbM6IvPFRXfRBExL2Xjxo39aFPUheNzx44dEydOnDZt2q+//ir/EqbJYiDMzpMnTz70eRw4iEwl8Hcei2O4koswJat/cfmUwxMnTnBOkVbrQ7VRVHyT+9EyzqX+/PPPfrQsihabyKPbjfxy7949qH7GXLdr187G2h3Eb3Cw1gUswp19mAffJEqUiLbVjz/+qPxVbv369aNpFkVMiY6H8I3379mzByUagTk9x3NXjqi1Xbt2sWvE5uTOXGdtwEFkuHPnzvTp05l4yjMqkJKzZs0aw51BuWnTpspf5QaLNFOmTNEKM34I36QpMCbpfZryV9oL0W83b97EyCE7JtKnT88poAIFCly7dk05VqUDD5BL8NkgJwULFuR8o+dMGyXntddeo16KbOOML3UNGzaMUxu+z236yjc4lPQsPVPq2QUZjb777jseRsdpnypVqhw8eBAMRCdK8LWj4hzokDkSmfSG8MAB4WkbuvXEL1CDQ4YM6dOnj4r+2B3hPvciZ86cqKt69eq+3/twvkkFUJqGaxPqqVOn/GilL1VcuXLlrbfeIs34yR7h8j/zoqdNm9audOsO4hMoD7///jttMa4bZ86cedasWbzAFMOl/M1MxXn78ePHm1bPfbnXJ76xoZs2bSIHmCbZXg2D0hYtWpQ9e3Y+AxQ9J0VpGZNvUHGMSvEjq7uDRwTkz4IFCzjvT9a99NJLR48eVQ8G6Pq35yvCfXYpc46UL18+WuvSPvFNimM0WoYMGfQj5CxCjyvlpAjKhypbt24ducdlRGD16tUk/BdffKGcYwYceIPsart8+XLHjh3pBHHq4ZNPPmH+fCtyy8LHjBnDYhls6PvQ7yvfJM8CBww9P6ZFyMMz+gY2N7PSwrDk+JQ0aVJ0XPfu3VOnTm24Nr3v2bNHOQsDDiKH6C4YZTymlHJbunRp7g/wj3K8C0zm8QDFixfXTzL0Bb7yTQplhobQ0FAYytGq6aEl//rrr1Br/OXgwYNMmgmysaeky9q3b29XvQ7iASLzwWRm8vbt20OGDJFkAtH1uHTo05LA3Llzo1tONPjG1m/ZsoVGHXROdCuLGuw1WolUboyThu6GhYn+ypQp06BBg6ybBA7iDfQ1W68XiMO2f//+F154ARKVLVs2/yb8eD2ML84sVKpUydQGXxANvin3U7Vo0QL1hYSE+Lim7iMiXBmU8OXw4cM8WiBfvnzMHXTt2rXjx4/DSVUO0xy4ILOR9erV4xpaFEO//Gv06NGcbPNDaFlI3759qQk8DzP0Bf7w7cCBA/A+UWWTJk2UrX4UWy/KjTMl+l5Ax2dzoLQ0W1WrVjVcufeZuNHrlGOEBr9rFMlnaCFIrvwa+qPHN+WmRK9evWzfNKDcTzVgwAAUniNHDj2UxFFrDgSy4swUO3TsMUzfunVLPSiNQjOhqH+CRMl85ZVXGAjmX8il8oNvbO65c+dgB6PuChUqRLeEhxYODy1XrlxgnXIW2RxEAvH2+/fvL+G1JUuW5FZuig35AK9n+/btysKQzdJWr15Ns6tNmzbKX1Mr2nyT6mEKs/opU6You1Xcrl27AhHF4iA+QWYgv/32WwZCAKlTp9bXxG7evFm8eHH8vmHDBuWXlAqxS5UqZbg2zh13ndHrn2T6wzeJQCtatCgnfHhaZKxzI8JJFPvogRQCB3hQMG3Lbt26caaNxynCN+GJS35Pk4wdO5Z85jmkfmsXf/gm9a1du5aNYAIvGyczouvdmi52plXiJSJLzCpbJXv06CGLbLVq1frwww8N175NJnT0gyQs+ffff3/mmWdQFFTcQzOURA0/+SZN4WZyDCr2TpxEC3x4jGdbtmxZv349t7U7lItP0Mdfr8ls5McFCxaEhoYa7jz5hvucUf8kU58mAaBg/C6K8J9vfP7Tp09z4qRMmTKxkphV/L2CBQvy3I906dINHjzYyRIbbxDhzob61ltvwVUTsnlONpIJR44c4TZlw9/tpHpp8+fPZ1EPzS3pC/znmzRIku/xIJ+YVHF8+D/++IPbbGlIcFR79dVXHbLFA8jUP92zBAkSgEtff/21HKJk8tgpfnfv3n3jjTfy5s178eJF5dewK/Pw3OQGe9LKNInAEt+k+po1azLixDNZdEBBY5pmOjdHbN26deDAgcz+AC0Xk41xEAjw9YE89MQkdWJYWNjo0aMvXbokl5l2lMLAYVYFKwturBeAUlF26BKrfGOzdu/ezQisChUq+HE2pB+gQU+jkSE2eBk7duzgf5lMNn369M7O1LgOkw2VNm3aDBkyiC2TMWPGfv36ce5ReZz6YrFSmQ58+eWXlU0Dt1W+KXfjePgVMGjQIBV4rYJKb926xVqWLl3KqplGAoBly1+44cBZNI+7kOgQLn/BOd+0aRNkTGfdU0891a5dO+7Ssj62soQLFy7kyZOHliS3wgQL35S7iYy/TpIkCYw6FTApl20KBQsWPHjwIGuncc8MmcqVET4Q4WYOYgV8fXPnzuUYygw6sFwwxOfPn188dhg4DRo0WLVqlcWNyBSwli1bsroZM2Yo+0TIHr6xiZB+DD9oYtGiRW/evKkCY8ixrtatW6MijEC0JeTAHZ5heefOHZAf7rJu3FqMWHUQM/CMWDCpuGTJkklqYBoyj7thuPaAWtlHQoHheWmG3TmOlV18U+6GfvbZZ2wod8fZblVKJ1apUoXWPI87Vu7TIevWrcs/z549K9qPv9y7d4/v0mFd0CKysyJMKu7111/Hn+PGjeOfQ4cOxYBbrFixQoUKWcn0wXoPHz5MYzVHjhxRH+bmB2zjm3I3l2m8gK+//loFwJZjgR06dEAV0GBkkXLvug0JCWFmGL1esRDatm2rR7I6CB5I3pElS5bUq1fPNLUoKq506dKG61jDPn36MAMA49qVK+Dh6tWrygI9dLcoQYIEq1evVnYLsP18g4GXOXNmKp/9+/cru4Wbpf3www9MBcN0lPiRp3uhm+BPK20xlP01cuRIjgLVq1dnfhTHqQseiE4bPXo0T4fC+1IPviN+nzdvnhiQ+NKzZ0/levt83VaMF5YPcaKc9O/fXwVgXLaTb8rd6KVLl0p6Fm5JsteEYy988MEH7BrUwshpwxU8feXKFalRjlPllg22CnaC3/uXHNgOyTLSrl07vsT27dvz3D+vGSOp4gztPAnr0kU5WbRoESc8K1euHKBlLZv5ptx9NHjwYHaKjWcR62BHDBw4UD+iEUMjD5iU43Xw+dtvv9Ec56BVsWJFziDzKAKHcrELvkc4XTxmMEmSJHKClGfqK1OAFb04629Q9m5zU0/69OkDl7Tffr4pdx+9/PLL7JepU6eqAFCO3bF9+/auXbs2bty4S5cu+gqMxAFx+5Ph2v+LX2Di08MECSUHqL0Nc+AjJPYVIs4JfbpM//zzD5PZwDfR+SbfGR6JQXbjxo3KmmhFuPO3lihRgmWCzxbLjAIB5NuFCxe4PJI8eXK/N0T4UpHXX/gumzdvTrK99NJLPIVHubIP5cuXDz/27t07EK1y4CPEAOFuFwD+m3KbiH379g0JCWEMgx6jjM+FCxfSSOFKr5URk/dCVbIBjAEMnEgEhG/K3WK4SYzzypIlC491tV2ZiK+sR4uzdtn+hM+3335baWwsV64cfqxdu7Z6kLSOrothsMOhpuQsJHgEd+/eZSZvw72/0xSlhT+rV68Od0tZe2WUk48++oh1WdlM4CMCxTflfhgeR8xZjZhJaMd6Fy9eTKcOYySnvOrUqcPFukmTJrFJzZo1U5rDbX2Oy0HU0Oc29G7H5+TJk/lSMmfOXLhwYXxJmTLl7NmzlUfOH+L27dt+J/8hWO8333xDOYHfAe9DBVg+A8g35R4q+vTpw67kwa0BFeh/3ecPM9LFcEV2r1y5kgn88GN4eDg1nuHOs8vwn8uXL1esWBH2jIygAWrho4kI7Yzo69evc+RVmr7CJzxwsUcKFCiwe/dupQ2CeEGml2KdbJs2bWLeZTjzTDQU6PceWL4JtaCpKeI9evRQgTyuUbkiS+g3Gu5YO+ViIG1IDmb4HDp0qNKWWZnhD3j++edl3sVhnS2QmUbYirAy4K1lzJixcePGMg0Y4c7Jw7VmoH79+sq1p4ZvZ9q0aZkyZeLKqvWXwjJROxeKYf5Y37jtIwLLN6XN/5QtW5ZdOX78eBWwExuVy2mEKYKKatasyVr4ee/ePSi0nj17vv/++7t27VIa2bZv354oUSJZoIMJ+t577znpnG0BX8rRo0dlvtpwRxhny5bt5MmTSttHc/r06Vy5cvGafv36Kddb6969O0dJHgZokW+8/cKFC7RaDfdxSzEzbRZwvin3E546dYpbZSHZ9HQDRzkoKAyQ3JArg6tnFKz8yO0FhmszUfv27fkdJs2KFSuUQzl/EeHOJjpq1CiOgPjs27fvwoULGewKwIZUbkmQObbkyZPTBpk4cWKTJk0oMx9++KFdTYKfVqFCBXnjKgbnqGOCb8r9PDt37mS/p0iRYsuWLSowz2kKujM1g9A9dUl1BkuSl0EN8jS9GJiwiq8QExG9yu6FrUgfSbnUC490KlmypL6uzTcyffp0w30msOGKlly8eLGy/CIi3Pu+X3rpJTZJIlQsPWp0EEN8U1rIDB1iWPCM3w8Q5R6qlMTO4cwKbMi9e/cq13isXCcb9+/f/9ChQ+pB3jqzl76DPdypUydduO+5oNw5OCQ/t2ktp3fv3ryrUKFC3H1jUU7EnHnttddYMnRszCeVijm+KXeXff311ww1fvbZZ/Xs0zEMSkOjRo04lD755JMjR45kFhrPPfmecyfObMpDwd67du2aTF/RPleuiFYu0gwbNkx5ZPznl1q1alWvXp1nSNhCNnwRZyFfvnzcaxPDLzFG+abcHTdt2jR6wLFFOVG27H3Yt9S6JUqUYChMhJb4Sd4W3v3PP/+8fft2uPWeK0KPJqIOF2Y/L1u2jP1cuHBhuPFw4Ug2mJTMn2VK5MoCr169akuwu4yM77zzDpsBqYutUL6Y5ptyv4MJEybw4dHpnjvWAgq+v8uXLzNBBcdd+GxMqgfoG5/4So4cOYKh8ZlnnkmcODF8d3ihVatWpVPxyFqYPj41O7BZs2boWPQeD4Um8Gfp0qXnzJnj9QxNW2IPZApaNtrgJdpioPqHWOCbcj/qqFGj2AW5c+fmXGLMdIFptGOYOYCxtmXLlvDguRkkQjsOgqd+STI2+d6iRYtAbDiKK7hz5w4GHUbqRdYD7EO8XwYlA0WKFEE/06BgN+KXWbNm3b17197myRuEK86q06ZNy5SNsRU0Gzt8U+7XMHToUHZEWFgYg60C3REsf82aNaw3Q4YMtOM5xP7zzz8M6pEW4vVwetpwbYuaPHkyxuN+/frxUFnDHRRmkjaTgRQPoD8Rv8yfPz9z5sxwxRkIEsXzss8ljA6mgXLlUGzSpAlZx+W48uXLM5+kLYOXpxkJ1Rq4WXEfEWt8U+43JIn0QDkGHAS0O1jp8uXLOS0JR6JHjx7coop6PYWGJ2ga7sgYKeH8+fOy8ZFhfvF1n4Fpela5n7RNmzYUYt/TqjLrDABvgrf89NNPjRo1SpAgAf61bds2uwYpsUV5Po7hWlQI0CaVaCE2+abcsjtlyhTOWMKDigF1L2FfkBiu8OTKlcvkjEl8HYdeaDb+FwoQ/+I88o4dO9jsGjVqSMm8fenSpatWraLOjAfAU6N/fvjhB6UlquBKNLqOdmDUfBNjgfsAYFZIenBg//79ElFpHbLOJlP/GFt55GKsj4mxzDfl7gKY75yzwjgk0xWBc4qEGOvXry9UqBDfir5nh0HMPNlYNJgpsSH+5MppihQpmKmGUgX5Y1ASeOi5SVm5eRtULp8eBiBg47///nsaz6Ghodxvxn7gAhpHIuWDfmNpct68JC2OLADIP7C0mzdv1q1blxVhEIcWVUFANhUMfFPujoCNx81yiRMnljNTA0o5eTeDBg2Covvkk0+U+4XpJhP8t8gOW8Uva9euhQvHQ7AoiOAw1SYPnvV8zUHFtCgg0U+cXTRRjhkQZE+Tj6Vdv369YMGChmshWwxRuzqEXQ0nUAzX/PnzczonGMimgoRvSrPf0qZNy56Cm0vxDejEgywfHTp06M6dO6b2ME8zRoGoD3A1WaFdu3blI2AEUQ++aT7L3r17R4wYAXeCfmNkDYuBGRdZV1y5cmX//v3btm0bWUo52VQFAwSOFn4hbejW+pjSWAbWbt262Z4RmIWfPHmyWLFibGqlSpV4gESQkE0FD9+Uu1N++eWXZ599lv1Vp04dSmSgJc+zfAqQTKnNnTtXuecwldv6knt1o1GMyWzZsnmKVISW4RCeIew0ezOKep3ykTUoT/AxOWXFqULJL+h5+6hRozh9//TTT69bt46rlzzN0GIKcetgC+FhyiIq3EtTtFAwIIj4pty9BuNN8tsVLlw4BiYtlTcXC59Qa0ytgbGcWSu9XqY3HoJIofRMTCaxNYYr4J0PSF1hkgkQe/HixRs2bKAd6wdAgFu3bt24cUPGCK9mG3lChQwzHi1PkiSJ10PF+OfMmTM54QHDkv42HG8VzbcTYesx6zIczJs3T1ZuoD9tWS63HcHFN+V+rzDBZcsGRlPZDhiT3ceWyKI8hnPIFvy0ixcvjhkz5tNPP5VlcV7Pt85Nyp7GJC8DfzgAS8ZSSInXy7jv+I033lA+j9CgVt++fZs3b16rVq3ixYtnz54ddRUoUAAu1oIFC7xSgiU3btzYcC2NcBSQyVjTxZLMk5s8OKxYz9hjBcIo2OfsT3zi7agYlxYfEXR8U9osnyyewNThLlUbx0VfwLo6d+5M8QJSu0BRw2iK8V5vlRiTMIlNxqSeByphwoRNmzZlzAonacQek3lzHhnJHZYPtdZYC2qk96vHwcifNWvWNJ2GJ1+Yk7NKlSoyL8IkkJ4UFbNNMmrB8fN6ZQyAlUKHy1k2eCMyfgUh2VRw8k1pk4egmaQb6dChA62jmBxN+dq++uqr3Llz60KMcbRGjRoHDhxQmkkTmTFpCmqBAvnzzz+ZUsU032AK8DWxMepGoltKlixpuLKhoYSffvppz549S5YsefHFF1lauXLlOCcUoQVbyxgBhwfOJKOu0qVLd+TIEeWtq7n2CO3NMu1KuhpdsKN+/fVXcT1y5szJbfvBMzviiSDlm9KEGMYkE99SUk+fPq1itk8pTHCHIGSDBg3q2bMnrJcdO3Z4Om9iTHLjyX+1nNjw3YsUKUJtw6giSrZpSyupNXXqVJYTXe+Ia2JQPqJdWbucizt8+HBTwy5fvkxNS9sVAxyvbNCggYp8Igesg6VquLIR2xiE5QtkLJ49ezYtW8O1mfX8+fMquMmmgplvBLvv2LFjkv4EPgmlOSZtS6/jt75hR0VuTPIRQFTR0soV6ctp60qVKrE0iYpQ7rBSqNANGzYo32SILWRERYoUKTgq4UcSGG4n/cZ8+fLJJst/3Xm8OfPBEyrwO/Q2mzpnzhyvtbPMgQMH8jL6SzEzRcnGoKs5x0Nr4u233455w8c/BDvflLsTIaD0owzXIThwbNjFMazo/nHD68wkl7l1Y5KN/+WXXzh1Bm1w4sQJ3sX8ObCCdBtP15Ogge8HDFHcu3XrZriy8KNGuZGfdHJCQkLEUJRms1cnT57MciRlaPbs2b0egM4C0bZEiRLBm+WNgZZ1sXcOHjwogy+6SGoPTofNhDjAN6UNxt98842YEPDyZeNc7PY15UCGA09jkhoDbISAwqps06bNjBkzaPvBi2Nsivhg+HzllVcMV3Ydbsf05elMipFpwNkG/ovqCG2Qf5GicpYnKm3VqhXUIK6B3mBoKMcOr1xCsTD12cJAQ+iEsYB+r+FaKwp+h82EuME3gt2KYZVHKxiu4HS8ABXb2Q0oCvv27YPWrVu3riTSY4O/+uortjZdunT6bkvaQhBuprvUR2jmC8uWLRtXbH3hG8kzZcoUT1NQjwUFi+R8PP7OcyrJLmln/fr1c+TIwUY+1KYN6GAn3XjlyhVOn7Lf3nrrLfZz8NuQOuIS35T7rUMKu3fvziPdDFfkK6M0Yl3R6TDlI0qcOPH27duvXr26fPnyDz/8sFGjRnJKlqzURbgTyDE7WKlSpbyGO3uFKUPEuHHjlJtp/FedOnV0144x08ptgkLxoknjx4/ftm0bY3oWL17MogoVKhRZKs4YiPthFd999x2TKXI4WLBggf7fOIQ4xjelqTKYbbLpE7LLkKtYVHSmsCk2Y/PmzbVq1QoNDe3Vq5f8yMvkNGpxnCQ+mMtoPIucjtZDTSZegOqoqXjKLkw+aQaXVZi3mPOWuu0KIWZmHp1UGNTg9U2bNk0/wjJmIJ156dIl2LR4KFlFZIrYoBpbfUfc4xvBl3H27Fke5sbFaHyXPDBBNfJBP8ikCFrOmR4mdTbcIYvgG9t84sQJBpe0bdtW+eyc8N6DBw/yVOuuXbuyTGDZsmUcmOD5cGeKbrsyzTusR1gNsWuWC+SRZ82aJUMqGj9hwgR9BiguIq7yTWlCAwcpY8aM8laGDx8ugaqxPgSa1gwIfsfIDYckefLkErRFOdu6dauEBb/wwgvNmzfv0qULnjHqiljmxYsXOZ1QuHBhaKfGjRuHhYWxtJQpU8o6ilyPUeD555+HBp4+fbrXMqVVMQPprsOHD9MAZpRWtWrVJIw21t+pFcRhvinN6oCia9WqFbUcXk94eDi9/CAZsKMArMc///yT3/ks69evT5UqVUhICFcX+Fm9evWoy5GQLsYGyLEktBWhKr3Gi+BPjk2xDnlTsAUGDx7MnZCGK0Rr9OjRuh0epxG3+UbIoLhq1SpGXUHOIKavvfaa6TiIoEJk0euwAOFKHT9+/Mcff/z222+//PJLGJzinUZdJu7t3LkzVGLfvn0/+eSTGTNmbNy4URYVIuuEKDbsxAAitKO6Fy5cKG8Qn1C8ckxUnFZrgvjAN6W9s+vXrw8YMED2ZYSGhn788cdiXgYh61SMzEMEp7zqG3P27t0LdokBmTdvXmaUUXHZW/NEPOEbIYw6dOhQ3bp1dfNy6dKl4moHoeR5BR+HC2W+yxyFmDMlXrefBgnEE4M53a1bN07z0M8cOnQoA+Li0MvyEfGKb+pB02jZsmX58uWT2cvnn38exhX/FbS6Lt5D12kwdGGMwAYh0xImTAhLWLLHxssXFN/4RsjbunXr1oQJE7JlyyZvFHqP+5f1NSgHMQCdaX///TfsfIZQ0wapWrUqt7rH75cSP/lGyNu9evUqTBTJp504ceKXX34Zuk5m6uPxCw4G6EzDuxg7diwPf6OrVqhQoUWLFsU5a98/xGe+EfIK//rrr969e0v+rwQJEsDChM2p7/WM3y875kG7PcKdDGbIkCG0NeQ8YVgfjAR4RCz8+M839eD4Cu8crGNMI/264sWLf/bZZ8wDpx6ZFx9osMPZ58ePH+/Zs6e+MJgnT55x48ZJBNmj0+GPBN8InXXQdf369dMlIEuWLH379tWPenHUnR/QRyt82bp1a+vWrfX8QkWKFPniiy/kUKFHh2nEI8Q3Qmfd2bNnhw8fTl9CUgA1adJET/0fwwFNcRSmFXMoLpCqQoUKkvYvYcKE+HP+/Ply1Fu8d9W84pHjG2GaK5s6dWp4eLiwDt4FnHhQkeEpshPUIZ4JpJnQBt93797dq1cvOmnszFSpUrVs2XLLli0SRPKo6TQdjyjfCF1cMO4uWrSoYcOGuvEDWXnllVdmz57NlDiEQzwTzfDl4MGDw4YNK1OmjH6KIpy0oUOHypj1iDONeKT5JtBD5k+cODFy5MgSJUpwIxlF55lnnmnVqtXixYvp4hOxG3YY8zANNHj833//fcyYMVWqVGHGIbHJ69WrN2/ePDppypmC0uDw7f+hRz/9888/MIE6duzI/VcSbo8/QTxoPGZf83pvfEKEx9FZeMwDBw58/PHHVatWZZwqOwfDU8mSJTFUgYRysTPnZILDNzM8Xf9Zs2bVrVtXYqBlVz+MzylTphw9elRnGm+P03qPHDMNH7dv396xYwfsw3LlykmsI5cxn3vuuc6dO2/btk1WMh81ze87HL5FCpMVBF6NHTsWxJMVcyIkJKRs2bL9+vVbv369nP0tiHAfiRrMw3xkY8Tdu3f37NkzfvpXIRMAAAMISURBVPz4V199NWfOnHpOIdAsd+7coNmaNWsYW0wE+ZPGOhy+PRwmGTp37tzcuXPfeOONXLly6SIIsypr1qwvv/zye++9t2DBAphVXs8TpmTH4my4bCDwNIDxr8uXL2/atGn06NEwm8PCwiSZPIE/8+bN+84772Bw0Y/Lczw0H+HwzVd4ejIQuB9//HH48OEvvfSSBGfqeq9gwYLQDIMHD54/f/7Bgwdl/sBrySSAHpbhdztlMpB7eaLQOfjXlStXdu3a9cUXX3Tt2rVy5cpPP/00d5TrqgzjSJMmTcaNG7d7926e1i23OzSLFhy++QNPOYNa+Pbbb6HZwD1Ip0lkDVcmYPg5tWrV6tixI7THsmXLwMAbN27EmLyiIgwQFy5c+OWXX+bNmzdkyJCWLVuWKVMGI4WupYkkSZLkyJGjfv36cNig7kyH2Ts08xsO3yzBU+kp1x5z6D24Pe3atStdunSaNGkYnuvJwCxZslSqVAk6sHfv3tAec+bMWbt27c6dO2GLXrp0CeXcvn37P//5T2TaSSxDXAPbFfrz2rVrf/755969e0GSpUuXTp8+Heq3W7duTZs2he7KkydP6tSpedKVCTAUs2XL9uKLL/bp02fWrFn79+835TXx+qQOoguHb7aBxptJIvEj/L3vvvtuzJgxcPkqVqwIjsHUNB3RpiNRokTJkiUDS3ElnKVixYqBkzUfRI0aNapVq4bfy5cvX6pUqeLFi4eHh4NOsAZTpEgB7RRF+YYrgCZVqlS4BTz84IMP4I7u27dPn/YgOI/iqDIb4fAtIPA6pa5cRh1ssyNHjqxatWrixIm9evVq0aIFyAPRz5Ahg+TksgWwEsFbMLBAgQIgZ/Pmzbt37z5ixIiZM2eC/2fOnOG5Ap7NduYYAweHbzGByOYDCQg3rMG///77xIkT27dvX7JkyeTJkwcPHgx6tG/fvlmzZnXq1KlSpUplDfizevXqtWvXrlu3bsOGDZs0aQI6tW3bFtYg03KtWLFix44dsEuvXr0Kty0Ki9QhWEzi/wBxxADxob3fMQAAAABJRU5ErkJggg==" alt="לוגו">
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
                    // שחזור סגנונות מקוריים
                    downloadButton.style.display = "block"; // הצגת הכפתור מחדש
                    downloadButton.parentElement.style.textAlign = originalParentTextAlign || "center"; // החזרת יישור מרכזי להורה
                    downloadButton.style.margin = originalMargin || "0 auto"; // החזרת מרכז הכפתור
                });
            });



            </script>
        </body>
        </html>
    `);
});