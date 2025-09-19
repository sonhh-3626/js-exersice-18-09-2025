import { Parser } from './Parser.js';

document.addEventListener('DOMContentLoaded', () => {
    const screen = document.querySelector('.screen');
    const buttons = document.querySelector('.buttons');
    let currentExpression = '0';
    const MAX_SCREEN_LENGTH = 13;

    const updateScreen = () => {
        screen.textContent = currentExpression;
    };

    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const key = e.target.dataset.key;
        const lastChar = currentExpression.slice(-1);
        const isOperator = (char) => ['+', '-', '*', '/', '^', '%'].includes(char);
        const isNumber = (char) => !isNaN(parseFloat(char));

        if (currentExpression.length >= MAX_SCREEN_LENGTH && !['C', 'DEL', '='].includes(key)) {
            return;
        }

        if (isNumber(key)) {
            if (currentExpression === '0' || currentExpression === 'Error') {
                currentExpression = key;
            } else {
                currentExpression += key;
            }
        } else if (key === '.') {
            const matches = currentExpression.match(/(\d+\.?\d*)$/);
            if (matches && !matches[0].includes('.')) {
                currentExpression += '.';
            }
        } else if (isOperator(key)) {
            if (isNumber(lastChar)) {
                currentExpression += key;
            } else if (isOperator(lastChar)) {
                currentExpression = currentExpression.slice(0, -1) + key;
            }
        } else if (key === '=') {
            try {
                const tokens = currentExpression.match(/(\d+\.?\d*|[+\-*/^%])/g);
                if (!tokens) throw new Error("Invalid expression");

                const parser = new Parser(tokens);
                let result = parser.parse();
                result = parseFloat(result.toFixed(10));
                currentExpression = String(result);
            } catch (error) {
                console.error(error);
                currentExpression = 'Error';
            }
        } else if (key === 'C') {
            currentExpression = '0';
        } else if (key === 'DEL') {
            if (currentExpression.length > 1 && currentExpression !== 'Error') {
                currentExpression = currentExpression.slice(0, -1);
            } else {
                currentExpression = '0';
            }
        }

        updateScreen();
    });
});
