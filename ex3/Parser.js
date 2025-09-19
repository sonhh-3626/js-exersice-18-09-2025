class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
    }

    peek() {
        return this.tokens[this.index];
    }

    consume() {
        return this.tokens[this.index++];
    }

    parse() {
        if (!this.tokens || this.tokens.length === 0) return 0;
        return this.parseExpression();
    }

    parseFactor() {
        let result;
        const token = this.peek();

        if (token === '+' || token === '-') {
            this.consume();
            result = this.parseFactor();
            result = token === '+' ? result : -result;
        } else if (!isNaN(parseFloat(token))) {
            result = parseFloat(this.consume());
        } else {
            if (token !== undefined) throw new Error(`Unexpected token: ${token}`);
            return 0;
        }

        while (this.peek() === '%') {
            this.consume();
            result /= 100;
        }

        return result;
    }

    parsePower() {
        let result = this.parseFactor();
        if (this.peek() === '^') {
            this.consume();
            const right = this.parsePower();
            result = Math.pow(result, right);
        }
        return result;
    }

    parseTerm() {
        let result = this.parsePower();
        while (this.peek() === '*' || this.peek() === '/') {
            const operator = this.consume();
            const right = this.parsePower();
            if (operator === '*') {
                result *= right;
            } else {
                if (right === 0) throw new Error("Division by zero");
                result /= right;
            }
        }
        return result;
    }

    parseExpression() {
        let result = this.parseTerm();
        while (this.peek() === '+' || this.peek() === '-') {
            const operator = this.consume();
            const right = this.parseTerm();
            if (operator === '+') {
                result += right;
            } else {
                result -= right;
            }
        }
        return result;
    }
}

export { Parser };
