let currentInput = '';
let currentOperation = null;
let previousValue = null;

function openCalculator() {
    document.getElementById('calculator-modal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeCalculator() {
    document.getElementById('calculator-modal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    clearDisplay();
}

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function setOperation(operation) {
    if (currentInput === '') return;
    previousValue = parseFloat(currentInput);
    currentOperation = operation;
    currentInput = '';
}

function calculate() {
    if (currentOperation === null || currentInput === '') return;
    const currentValue = parseFloat(currentInput);
    let result;

    switch (currentOperation) {
        case '+':
            result = previousValue + currentValue;
            break;
        case '-':
            result = previousValue - currentValue;
            break;
        case '*':
            result = previousValue * currentValue;
            break;
        case '/':
             // טיפול במצב של חלוקה ב-0
             if (currentValue === 0) {
                alert('לא ניתן לחלק ב-0');
                clearDisplay();
                return;
            }
            result = previousValue / currentValue;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    currentOperation = null;
    previousValue = null;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    currentOperation = null;
    previousValue = null;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('calc-display').value = currentInput;
}

module.exports = {
    appendNumber,
    setOperation,
    calculate,
    clearDisplay,
    updateDisplay
};

