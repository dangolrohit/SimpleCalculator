const display = document.getElementById('display');

const state = {
    current: '0',
    previous: null,
    operator: null,
    waitingForOperand: false,
};

function updateDisplay() {
    let value = state.current;
    if (value.length > 12) {
        const num = parseFloat(value);
        value = num.toPrecision(10).replace(/\.?0+$/, '');
    }
    display.textContent = value;
}

function inputNumber(num) {
    if (state.waitingForOperand) {
        state.current = num;
        state.waitingForOperand = false;
    } else {
        state.current = state.current === '0' ? num : state.current + num;
    }
}

function inputDecimal() {
    if (state.waitingForOperand) {
        state.current = '0.';
        state.waitingForOperand = false;
        return;
    }
    if (!state.current.includes('.')) {
        state.current += '.';
    }
}

function clearAll() {
    state.current = '0';
    state.previous = null;
    state.operator = null;
    state.waitingForOperand = false;
}

function toggleSign() {
    state.current = String(parseFloat(state.current) * -1);
}

function percent() {
    state.current = String(parseFloat(state.current) / 100);
}

function calculate(a, b, op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 0 : a / b;
        default: return b;
    }
}

function handleOperator(nextOp) {
    const value = parseFloat(state.current);

    if (state.previous === null) {
        state.previous = value;
    } else if (state.operator && !state.waitingForOperand) {
        const result = calculate(state.previous, value, state.operator);
        state.current = String(result);
        state.previous = result;
    }

    state.operator = nextOp;
    state.waitingForOperand = true;
}

function handleEquals() {
    if (state.operator === null || state.waitingForOperand) return;
    const value = parseFloat(state.current);
    const result = calculate(state.previous, value, state.operator);
    state.current = String(result);
    state.previous = null;
    state.operator = null;
    state.waitingForOperand = true;
}

document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', () => {
        const { action, value } = button.dataset;
        switch (action) {
            case 'number': inputNumber(value); break;
            case 'decimal': inputDecimal(); break;
            case 'operator': handleOperator(value); break;
            case 'equals': handleEquals(); break;
            case 'clear': clearAll(); break;
            case 'sign': toggleSign(); break;
            case 'percent': percent(); break;
        }
        updateDisplay();
    });
});

document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key >= '0' && key <= '9') inputNumber(key);
    else if (key === '.') inputDecimal();
    else if (key === '+' || key === '-' || key === '*' || key === '/') handleOperator(key);
    else if (key === 'Enter' || key === '=') handleEquals();
    else if (key === 'Escape' || key === 'c' || key === 'C') clearAll();
    else if (key === '%') percent();
    else return;
    e.preventDefault();
    updateDisplay();
});

updateDisplay();
