const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { fireEvent, render, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');
const { JSDOM } = require('jsdom');
const { expect } = require('@jest/globals');

// יצירת mock של fetch
global.fetch = jest.fn();

describe('login.js functionality tests', () => {
  // בדיקות למעברי התצוגות
  it('should switch to the register container when clicking on "switch-to-register"', () => {
    document.body.innerHTML = `
      <div class="login-container" style="display: block;"></div>
      <div class="register-container" style="display: none;"></div>
      <button id="switch-to-register">Switch to Register</button>
    `;
    
    const switchToRegister = document.getElementById('switch-to-register');
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');

    // הגדרת אירוע הקלקה
    switchToRegister.addEventListener('click', () => {
      loginContainer.style.display = 'none';
      registerContainer.style.display = 'block';
    });

    // סימולציה של הקלקה על הכפתור
    fireEvent.click(switchToRegister);

    expect(registerContainer.style.display).toBe('block');
    expect(loginContainer.style.display).toBe('none');
  });

  it('should switch to the login container when clicking on "switch-to-login"', () => {
    document.body.innerHTML = `
      <div class="register-container" style="display: none;"></div>
      <div class="login-container" style="display: none;"></div>
      <button id="switch-to-login">Switch to Login</button>
    `;
    
    const switchToLogin = document.getElementById('switch-to-login');
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');

    // הגדרת אירוע הקלקה
    switchToLogin.addEventListener('click', () => {
      registerContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    });

    // סימולציה של הקלקה על הכפתור
    fireEvent.click(switchToLogin);

    expect(loginContainer.style.display).toBe('block');
    expect(registerContainer.style.display).toBe('none');
  });

  // בדיקות לשליחת טופס הרשמה
  it('should handle registration form submission and display success message', async () => {
    document.body.innerHTML = `
      <form id="register-form">
        <input type="text" name="Name" value="יוסי" />
        <input type="text" name="UserName" value="yossi" />
        <input type="email" name="Email" value="yossi@test.com" />
        <input type="password" name="Password" value="12345" />
        <button type="submit">Submit</button>
      </form>
    `;

    const mockData = { 
      Name: 'יוסי', 
      UserName: 'yossi', 
      Email: 'yossi@test.com', 
      Password: '12345' 
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'הרשמה בוצעה בהצלחה!' })
    });

    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const { Name, UserName, Email, Password } = mockData;

      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name, UserName, Email, Password })
      });

      const data = await response.json();
      expect(data.message).toBe('הרשמה בוצעה בהצלחה!');
    });

    fireEvent.submit(form);

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
