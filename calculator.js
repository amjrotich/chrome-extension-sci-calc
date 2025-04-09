// calculator.js
document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('.btn-calc');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const backspaceButton = document.getElementById('backspace');
    
    let currentInput = '0';
    let calculationHistory = [];
    
    // Update the display
    function updateDisplay() {
        display.textContent = currentInput;
    }
    
    // Update history section
    function updateHistory() {
        history.innerHTML = '';
        const recentHistory = calculationHistory.slice(-3); // Keep just the last 3 entries
        
        recentHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.textContent = `${item.expression} = ${item.result}`;
            history.appendChild(historyItem);
        });
    }
    
    // Handle number and operation buttons
    buttons.forEach(button => {
        if (!button.id) { // Skip buttons with IDs (equals, clear, backspace)
            button.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                
                // Reset display if previous result was an error
                if (currentInput === 'Error') {
                    currentInput = '0';
                }
                
                // Handle special functions
                if (['sin', 'cos', 'tan', 'sqrt', 'log'].includes(value)) {
                    if (currentInput === '0') {
                        currentInput = `${value}(`;
                    } else {
                        currentInput += `${value}(`;
                    }
                } 
                // Power function
                else if (value === 'pow') {
                    currentInput += '^';
                }
                // Regular input
                else {
                    if (currentInput === '0' && value !== '.') {
                        currentInput = value;
                    } else {
                        currentInput += value;
                    }
                }
                
                updateDisplay();
            });
        }
    });
    
    // Custom expression evaluator (no eval)
    function evaluateExpression(expression) {
        try {
            // Tokenize the expression
            const tokens = tokenize(expression);
            
            // Parse and evaluate
            const result = parseExpression(tokens);
            
            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Invalid result");
            }
            
            return {
                success: true,
                result: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Tokenize the expression
    function tokenize(expression) {
        // Replace functions and operators
        expression = expression
            .replace(/sin\(/g, 'sin(')
            .replace(/cos\(/g, 'cos(')
            .replace(/tan\(/g, 'tan(')
            .replace(/sqrt\(/g, 'sqrt(')
            .replace(/log\(/g, 'log(')
            .replace(/\^/g, '^')
            .replace(/×/g, '*');
        
        const tokens = [];
        let i = 0;
        
        while (i < expression.length) {
            const char = expression[i];
            
            // Handle numbers (including decimals)
            if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(expression[i+1]))) {
                let num = char;
                let j = i + 1;
                
                while (j < expression.length && (/[0-9]/.test(expression[j]) || expression[j] === '.')) {
                    num += expression[j];
                    j++;
                }
                
                tokens.push({ type: 'number', value: parseFloat(num) });
                i = j;
                continue;
            }
            
            // Handle operators and parentheses
            if (['+', '-', '*', '/', '^', '(', ')'].includes(char)) {
                tokens.push({ type: 'operator', value: char });
                i++;
                continue;
            }
            
            // Handle functions
            if (/[a-z]/.test(char)) {
                const functionNames = ['sin', 'cos', 'tan', 'sqrt', 'log'];
                const potentialFunction = expression.substring(i, i + 4); // longest function name is 4 chars
                
                for (const funcName of functionNames) {
                    if (potentialFunction.startsWith(funcName)) {
                        tokens.push({ type: 'function', value: funcName });
                        i += funcName.length;
                        break;
                    }
                }
                continue;
            }
            
            // Skip whitespace
            if (/\s/.test(char)) {
                i++;
                continue;
            }
            
            // Unknown character
            throw new Error(`Unknown character: ${char}`);
        }
        
        return tokens;
    }
    
    // Parse and evaluate expression
    function parseExpression(tokens) {
        if (tokens.length === 0) return 0;
        
        let currentPos = 0;
        
        function parseAdd() {
            let left = parseMultiply();
            
            while (currentPos < tokens.length) {
                const token = tokens[currentPos];
                
                if (token.type === 'operator' && (token.value === '+' || token.value === '-')) {
                    currentPos++;
                    const right = parseMultiply();
                    
                    if (token.value === '+') {
                        left += right;
                    } else {
                        left -= right;
                    }
                } else {
                    break;
                }
            }
            
            return left;
        }
        
        function parseMultiply() {
            let left = parsePower();
            
            while (currentPos < tokens.length) {
                const token = tokens[currentPos];
                
                if (token.type === 'operator' && (token.value === '*' || token.value === '/')) {
                    currentPos++;
                    const right = parsePower();
                    
                    if (token.value === '*') {
                        left *= right;
                    } else {
                        if (right === 0) throw new Error("Division by zero");
                        left /= right;
                    }
                } else {
                    break;
                }
            }
            
            return left;
        }
        
        function parsePower() {
            let left = parseFactor();
            
            if (currentPos < tokens.length && tokens[currentPos].type === 'operator' && tokens[currentPos].value === '^') {
                currentPos++;
                const right = parsePower(); // right associative
                return Math.pow(left, right);
            }
            
            return left;
        }
        
        function parseFactor() {
            const token = tokens[currentPos];
            
            // Handle numbers
            if (token.type === 'number') {
                currentPos++;
                return token.value;
            }
            
            // Handle functions
            if (token.type === 'function') {
                const funcName = token.value;
                currentPos++;
                
                // Expect opening parenthesis
                if (currentPos >= tokens.length || tokens[currentPos].type !== 'operator' || tokens[currentPos].value !== '(') {
                    throw new Error(`Expected '(' after ${funcName}`);
                }
                
                currentPos++; // Skip the opening parenthesis
                const arg = parseAdd(); // Parse the argument
                
                // Expect closing parenthesis
                if (currentPos >= tokens.length || tokens[currentPos].type !== 'operator' || tokens[currentPos].value !== ')') {
                    throw new Error(`Expected ')' after ${funcName} argument`);
                }
                
                currentPos++; // Skip the closing parenthesis
                
                // Apply the function
                switch (funcName) {
                    case 'sin': return Math.sin(arg);
                    case 'cos': return Math.cos(arg);
                    case 'tan': return Math.tan(arg);
                    case 'sqrt':
                        if (arg < 0) throw new Error("Cannot calculate square root of negative number");
                        return Math.sqrt(arg);
                    case 'log':
                        if (arg <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
                        return Math.log10(arg);
                    default:
                        throw new Error(`Unknown function: ${funcName}`);
                }
            }
            
            // Handle parentheses
            if (token.type === 'operator' && token.value === '(') {
                currentPos++;
                const result = parseAdd();
                
                // Expect closing parenthesis
                if (currentPos >= tokens.length || tokens[currentPos].type !== 'operator' || tokens[currentPos].value !== ')') {
                    throw new Error("Unmatched opening parenthesis");
                }
                
                currentPos++;
                return result;
            }
            
            // Handle unary minus
            if (token.type === 'operator' && token.value === '-') {
                currentPos++;
                return -parseFactor();
            }
            
            throw new Error("Unexpected token");
        }
        
        return parseAdd();
    }
    
    // Equals button handler
    equalsButton.addEventListener('click', function() {
        if (currentInput === 'Error') {
            currentInput = '0';
            updateDisplay();
            return;
        }
        
        // Save the original expression for history
        const originalExpression = currentInput;
        
        // Evaluate the expression
        const evaluation = evaluateExpression(currentInput);
        
        if (evaluation.success) {
            // Format number to prevent extremely long decimals
            let formattedResult;
            if (Number.isInteger(evaluation.result)) {
                formattedResult = evaluation.result;
            } else {
                // Limit to 10 decimal places
                formattedResult = parseFloat(evaluation.result.toFixed(10));
                // Remove trailing zeros
                formattedResult = String(formattedResult).replace(/\.?0+$/, "");
            }
            
            // Save to history
            calculationHistory.push({
                expression: originalExpression,
                result: formattedResult
            });
            
            // Update display and history
            currentInput = String(formattedResult);
            updateDisplay();
            updateHistory();
        } else {
            currentInput = 'Error';
            updateDisplay();
            console.error("Calculation error:", evaluation.error);
        }
    });
    
    // Clear button handler
    clearButton.addEventListener('click', function() {
        currentInput = '0';
        updateDisplay();
    });
    
    // Backspace button handler
    backspaceButton.addEventListener('click', function() {
        if (currentInput === 'Error') {
            currentInput = '0';
        } else if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    });
    
    // Initialize display
    updateDisplay();
});