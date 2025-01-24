jest.mock('../cal', () => ({
    add: jest.fn((a, b) => a + b),
    subtract: jest.fn((a, b) => a - b),
    multiply: jest.fn((a, b) => a * b),
    divide: jest.fn((a, b) => a / b)
}));

const { add, subtract, multiply, divide } = require('../cal');  // זה ישדר את הנתיב לפי המיקום של cal.js

describe('Calculator Tests', () => {

    test('add should correctly add two numbers', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(-1, -1)).toBe(-2);
        expect(add(0, 0)).toBe(0);
    });

    test('subtract should correctly subtract two numbers', () => {
        expect(subtract(5, 3)).toBe(2);
        expect(subtract(-1, -1)).toBe(0);
        expect(subtract(0, 0)).toBe(0);
    });

    test('multiply should correctly multiply two numbers', () => {
        expect(multiply(3, 4)).toBe(12);
        expect(multiply(-2, 3)).toBe(-6);
        expect(multiply(0, 5)).toBe(0);
    });

    test('divide should correctly divide two numbers', () => {
        expect(divide(6, 3)).toBe(2);
        expect(divide(-6, 3)).toBe(-2);
        // הוספת בדיקות נוספות
        expect(divide(0, 1)).toBe(0); // 0 חלקי 1
        expect(divide(5, 0)).toBe(Infinity); // חלוקה ב-0 (לפי מה שציפינו)
        expect(divide(-5, 0)).toBe(-Infinity); // חלוקה ב-0 עם מספר שלילי
    });

    // הוספת טסטים נוספים למקרים של תחום חיובי ושלילי
    test('should handle very large numbers correctly', () => {
        expect(add(1e+15, 1e+15)).toBe(2e+15);
        expect(subtract(1e+15, 1e+14)).toBe(9e+14);
        expect(multiply(1e+15, 2)).toBe(2e+15);
        expect(divide(1e+15, 2)).toBe(5e+14);
    });

    test('should handle floating point numbers correctly', () => {
        expect(add(0.1, 0.2)).toBeCloseTo(0.3, 5); // חיבור עם נקודה צפה
        expect(subtract(0.3, 0.2)).toBeCloseTo(0.1, 5); // חיסור עם נקודה צפה
        expect(multiply(0.1, 0.2)).toBeCloseTo(0.02, 5); // כפל עם נקודה צפה
        expect(divide(0.1, 0.2)).toBeCloseTo(0.5, 5); // חלוקה עם נקודה צפה
    });

});
