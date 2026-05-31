// ==========================================
// SELECCIÓN DE ELEMENTOS DE LA PANTALLA
// ==========================================
const operationDisplay = document.getElementById('operation');
const resultDisplay = document.getElementById('result');
const modeIndicator = document.getElementById('mode-indicator');
const memoryIndicator = document.getElementById('memory-indicator');

// ==========================================
// VARIABLES DE ESTADO GLOBAL
// ==========================================
let currentInput = "";   // Lo que el usuario ve en la pantalla
let jsExpression = "";   // Lo que procesa el motor matemático internamente
let isRadians = false;   // Control de ángulos: false = DEG, true = RAD
let memoryValue = 0;     // Almacenamiento de memoria (M)
let lastResult = 0;      // Almacenamiento para la función Ans

function updateDisplay() {
    resultDisplay.innerText = currentInput === "" ? "0" : currentInput;
}

function toggleMode() {
    isRadians = !isRadians;
    modeIndicator.innerText = isRadians ? "RAD" : "DEG";
}

// ==========================================
// ENTRADAS DE TECLADO (MOUSE)
// ==========================================

function inputNum(num) {
    currentInput += num;
    jsExpression += num;
    updateDisplay();
}

function inputOp(op) {
    let viewOp = op;
    if (op === '**2') viewOp = '²';
    if (op === '**') viewOp = '^';
    if (op === '*') viewOp = '×';
    if (op === '/') viewOp = '÷';
    
    // Tratamiento especial para el Porcentaje funcional
    if (op === '%') {
        currentInput += '%';
        jsExpression += '/100';
        updateDisplay();
        return;
    }
    
    currentInput += viewOp;
    jsExpression += op;
    updateDisplay();
}

function inputScientific(func) {
    let viewFunc = func;
    if (func === 'asin') viewFunc = 'sin⁻¹';
    if (func === 'acos') viewFunc = 'cos⁻¹';
    if (func === 'atan') viewFunc = 'tan⁻¹';
    if (func === 'sqrt') viewFunc = '√';
    if (func === 'cbrt') viewFunc = '³√';
    if (func === 'abs') viewFunc = '|';

    if (func === 'abs') {
        currentInput += "abs(";
    } else {
        currentInput += viewFunc + "(";
    }
    
    jsExpression += `calcFunc('${func}',`;
    updateDisplay();
}

// Constantes y operadores especiales
function inputSpecial(type) {
    if (type === 'pi') {
        currentInput += "π";
        jsExpression += "Math.PI";
    } else if (type === 'e') {
        currentInput += "e";
        jsExpression += "Math.E";
    } else if (type === 'fact') {
        currentInput += "!";
        jsExpression += "factorial";
    }
    updateDisplay();
}

function recallAns() {
    currentInput += "Ans";
    jsExpression += lastResult.toString();
    updateDisplay();
}

// ==========================================
// MOTOR MATEMÁTICO INTEGRADO
// ==========================================

function calcFunc(func, val) {
    let angle = isRadians ? val : val * (Math.PI / 180);

    switch(func) {
        case 'sin': return Math.sin(angle);
        case 'cos': return Math.cos(angle);
        case 'tan': return Math.tan(angle);
        case 'asin': return isRadians ? Math.asin(val) : Math.asin(val) * (180 / Math.PI);
        case 'acos': return isRadians ? Math.acos(val) : Math.acos(val) * (180 / Math.PI);
        case 'atan': return isRadians ? Math.atan(val) : Math.atan(val) * (180 / Math.PI);
        case 'sinh': return Math.sinh(val);
        case 'cosh': return Math.cosh(val);
        case 'tanh': return Math.tanh(val);
        case 'log': return Math.log10(val);
        case 'ln': return Math.log(val);
        case 'sqrt': return Math.sqrt(val);
        case 'cbrt': return Math.cbrt(val);
        case 'abs': return Math.abs(val);
        default: return val;
    }
}

// Factorial de un número (x!)
function getFactorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

// ==========================================
// GESTIÓN DE MEMORIA (MC, MR, M+, M-)
// ==========================================
function memoryClear() {
    memoryValue = 0;
    memoryIndicator.style.visibility = "hidden";
}

function memoryRecall() {
    currentInput += memoryValue.toString();
    jsExpression += memoryValue.toString();
    updateDisplay();
}

function memoryAdd() {
    try {
        let evalCurrent = eval(jsExpression);
        if (isFinite(evalCurrent)) {
            memoryValue += evalCurrent;
            memoryIndicator.style.visibility = "visible";
        }
    } catch (e) { resultDisplay.innerText = "Error"; }
}

function memorySub() {
    try {
        let evalCurrent = eval(jsExpression);
        if (isFinite(evalCurrent)) {
            memoryValue -= evalCurrent;
            memoryIndicator.style.visibility = "visible";
        }
    } catch (e) { resultDisplay.innerText = "Error"; }
}

// ==========================================
// ACCIONES DE EDICIÓN Y LIMPIEZA
// ==========================================
function clearDisplay() {
    currentInput = "";
    jsExpression = "";
    operationDisplay.innerText = "";
    resultDisplay.innerText = "0";
}

function deleteLast() {
    currentInput = currentInput.trimEnd().slice(0, -1);
    jsExpression = jsExpression.trimEnd().slice(0, -1);
    updateDisplay();
}

// ==========================================
// PROCESAR Y CALCULAR RESULTADO (=)
// ==========================================
function calculate() {
    try {
        operationDisplay.innerText = currentInput;

        // Cierre automático de paréntesis huérfanos
        let openParentheses = (jsExpression.match(/\(/g) || []).length;
        let closeParentheses = (jsExpression.match(/\)/g) || []).length;
        while (openParentheses > closeParentheses) {
            jsExpression += ')';
            openParentheses--;
        }

        // Lógica de reemplazo sintáctico para factoriales (!)
        if (jsExpression.includes('factorial')) {
            jsExpression = jsExpression.replace(/(\d+)\s*factorial/g, "getFactorial($1)");
        }

        let finalResult = eval(jsExpression);

        if (isNaN(finalResult) || !isFinite(finalResult)) {
            resultDisplay.innerText = "Error Matemático";
            return;
        }

        // Limitar la precisión para evitar residuos flotantes de JavaScript (ej: 0.1 + 0.2)
        finalResult = parseFloat(finalResult.toFixed(10));

        resultDisplay.innerText = finalResult;
        lastResult = finalResult; 
        currentInput = finalResult.toString();
        jsExpression = finalResult.toString();

    } catch (error) {
        resultDisplay.innerText = "Error de Sintaxis";
        currentInput = "";
        jsExpression = "";
    }
}

// ==========================================
// MENÚS DE MÓDULOS FUTUROS
// ==========================================
function changeSystem() {
    alert("Menú de Configuración de Modos:\n1. COMP (Cálculos Estándar)\n2. CMPLX (Números Complejos)\n3. STAT (Análisis Estadístico)\n4. BASE-N (Sistemas Binario, Hex)\n5. EQN (Ecuaciones Polinómicas)\n6. MATRIX (Operaciones de Matrices)");
}

function openMatrixMenu() {
    alert("Módulo de Matrices:\nPermite instanciar dimensiones de matrices (MatA, MatB), ejecutar multiplicaciones, transpuestas, inversas y determinantes.");
}

function openEquationMenu() {
    alert("Módulo de Ecuaciones:\nSelecciona una plantilla de resolución:\n- Sistemas de ecuaciones lineales de 2, 3 o 4 incógnitas.\n- Ecuaciones cuadráticas o cúbicas.");
}

// ==========================================
// TEMPORIZADOR DE LA PANTALLA DE CARGA
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const calculatorContainer = document.getElementById('calculator-container');

    // Mantiene la bienvenida por 3 segundos antes del fundido de entrada
    setTimeout(() => {
        welcomeScreen.classList.add('fade-out'); 
        calculatorContainer.classList.add('show'); 
    }, 3000); 
});

// ==========================================
// REGISTRO DEL SERVICE WORKER (Para Instalación)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito', reg))
            .catch(err => console.error('Error al registrar el Service Worker', err));
    });
}

// ==========================================
// MAPEO DE TECLADO FÍSICO
// ==========================================
window.addEventListener('keydown', (event) => {
    const key = event.key;

    // Prevenir el scroll involuntario con la barra espaciadora o el borrado
    if (key === ' ' || key === 'Backspace') {
        event.preventDefault();
    }

    // Comprobar si es un número (0-9) o un punto decimal
    if (/[0-9.]/.test(key)) {
        inputNum(key);
    } 
    // Comprobar operadores aritméticos básicos
    else if (key === '+') {
        inputOp('+');
    } else if (key === '-') {
        inputOp('-');
    } else if (key === '*') {
        inputOp('*');
    } else if (key === '/') {
        inputOp('/');
    } else if (key === '%') {
        inputOp('%');
    } else if (key === '(' || key === ')') {
        inputOp(key);
    }
    // Teclas de acción rápida y edición
    else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    }
});