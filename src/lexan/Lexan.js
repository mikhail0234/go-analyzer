import _ from "underscore";
import {Token, TokenType} from "./Token";
import {BRACES} from "./Symbols";

const SPACE = ' ';
const ASSIGN_OPERATOR = '=';
const AMPERSAND = '&';
const VERTICAL_BAR = '|';
const EXCLAMATION = '!';
const QUOTES = ['"', '\''];
const BACKSLASH = '\\';
const NEWLINE = '\n';
const TAB = ['\t', String.fromCharCode(9)];
const SEMICOLON = ';';
const POINT = '.';
const COMMA = ',';

const BRACES_ARRAY = _.values(BRACES);

const BINARY_OPERATOR = {
    MULTIPLY: '*',
    DIVISION: '/',
    PLUS: '+',
    MINUS: '-'
};
const BINARY_OPERATOR_ARRAY = _.values(BINARY_OPERATOR);

const UNARY_OPERATOR = {
    INCREMENT: '++',
    DECREMENT: '--'
};

// const BOOL_OPERATOR = {
//     LESS_THAN: '<',
//     MORE_THAN: '>',
//     EQUAL: '==',
//     NOT_EQUAL: '!=',
//     MORE_THAN_EQUAL: '>=',
//     LESS_THAN_EQUAL: '<=',
//     AND: '&&',
//     OR: '||'
// };

const BOOL_OPERATOR = {
    EQUAL: '==',
    UNEQUAL: '!=',
    STRICT_INEQUALITY: ['>', '<'],
    NON_STRICT_INEQUALITY: ['>=', '<='],
    AND: '&&',
    OR: '||'
};

const KEYWORDS = [
    'break', 'default', 'func', 'interface', 'select', 'case', 'defer', 'go', 'map', 'struct', 'chan', 'else', 'goto',
    'package', 'switch', 'const', 'fallthrough', 'if', 'range', 'type', 'continue', 'for', 'import', 'return', 'var'
];

const LETTERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '_'
];

const SIGNS = [
    '[', '\\', ']', '^', '`', ':', ';', '<', '>', '=', '@', '?', '!', '"', '\'', '#', '$', '%', '&',
    ')', '(', '*', '+', '.', ',', '-', '/', '{', '}', '|', '~'
];

const DIGITS = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

function isKeyword(str) {
    return KEYWORDS.includes(str);
}

function isStrictEqualityOperator(str) {
    return BOOL_OPERATOR.STRICT_INEQUALITY.includes(str);
}

function isBinaryOperator(str) {
    return BINARY_OPERATOR_ARRAY.includes(str);
}

function isDigit(char) {
    return DIGITS.includes(char);
}

function isLetter(char) {
    return LETTERS.includes(char);
}

function isSign(char) {
    return SIGNS.includes(char);
}

function isSpace(char) {
    return char === SPACE;
}

function isAssign(char) {
    return char === ASSIGN_OPERATOR;
}

function isAmpersand(char) {
    return char === AMPERSAND;
}

function isVerticalBar(char) {
    return char === VERTICAL_BAR;
}

function isExclamation(char) {
    return char === EXCLAMATION;
}

function isQuote(char) {
    return QUOTES.includes(char);
}

function isBackSlash(char) {
    return char === BACKSLASH;
}

function isUndefined(char) {
    return char === undefined;
}

function isNewLine(char) {
    return char === NEWLINE;
}

function isTab(char) {
    return TAB.includes(char);
}

function isBrace(char) {
    return BRACES_ARRAY.includes(char);
}

function isSemicolon(char) {
    return char === SEMICOLON;
}

function isComma(char) {
    return char === COMMA;
}

function isPoint(char) {
    return char === POINT;
}

function isPlus(char) {
    return char === BINARY_OPERATOR.PLUS;
}

function isMinus(char) {
    return char === BINARY_OPERATOR.MINUS;
}

function* getChar(str) {
    const len = str.length;
    for (let i = 0; i < len; i++) {
        yield str[i];
    }
}

const TokenizerError = {
    INVALID_IDENTIFIER_NAME: 'Identifiers must start with letter.',
    INVALID_AND_OPERATOR: 'Expected another symbol \'&\' after first one.',
    INVALID_OR_OPERATOR: 'Expected another symbol \'|\' after first one.',
    INVALID_NON_EQUAL_OPERATOR: 'Expected symbol \'=\' after \'!\', assuming unequal sign.',
    INVALID_SYMBOL: 'Unexpected symbol.',
    INVALID_STRING_LITERAL: "Expected string literal.",
};

// TODO: унифицировать и структурировать ошибки
// TODO: научиться считать строки и символ в строке в котором произошла ошибка

export class Tokenizer {
    constructor(str, {verbosity}) {
        this.str = str;
        this.chars = getChar(this.str);
        this.ch = "";
        this.getc();

        this.type = null; // тип текущего токена
        this.value = null; // значение текущего токена (если есть)

        this.verbosity = verbosity;

        this.current = null;
    }

    error(msg) {
        throw new Error(`Tokenizer Error. Current symbol: '${this.ch}'\nError: ${msg}`);
    }

    getc() {
        this.ch = this.chars.next().value;
    }

    // return current token
    getCurrent() {
        return this.current;
    }

    clear() {
        this.type = null;
        this.value = null;
    }

    processSign(type, next = null, err = null) {
        this.type = type;
        let sign = this.ch;
        this.getc();
        if (next && next(this.ch)) {
            sign += this.ch;
            this.getc();
        } else if (err) {
            this.error(err);
        }
        this.value = sign;
    }

    processString() {
        this.type = TokenType.STRING;
        const quote = this.ch;
        let str = '';
        this.getc();

        while (!(this.ch === quote)) {
            if (isUndefined(this.ch)) {
                this.error(TokenizerError.INVALID_STRING_LITERAL);
            }
            str += this.ch;
            this.getc();
        }
        this.value = str;
        this.getc();
    }

    processAssign() {
        this.type = TokenType.ASSIGN_OP;
        let sign = this.ch;
        this.getc();
        if (isAssign(this.ch)) {
            this.type = TokenType.BOOL_OP;
            sign += this.ch;
            this.getc();
        }
        this.value = sign;
    }

    processDigit() {
        this.type = TokenType.NUMBER;
        let val = 0;
        while (isDigit(this.ch)) {
            val = val * 10 + parseInt(this.ch);
            this.getc();
        }
        if (isLetter(this.ch)) {
            this.error(TokenizerError.INVALID_IDENTIFIER_NAME);
        }
        this.value = val;
    }

    processIdentifier() {
        let id = '';
        while (isLetter(this.ch) || isDigit(this.ch)) {
            id = id + this.ch;
            this.getc();

            if (isKeyword(id)) {
                this.type = TokenType.KEYWORD;
            } else {
                this.type = TokenType.IDENTIFIER;
            }
            this.value = id;
        }
    }

    processBinaryOperator() {
        this.type = TokenType.BINARY_OP;
        let sign = this.ch;
        this.getc();
        if ((isPlus(this.ch) || isMinus(this.ch)) && this.ch === sign) {
            this.type = TokenType.UNARY_OP;
            sign += this.ch;
            this.getc();
        }
        this.value = sign;
    }

    next_token() {
        this.verbosity && console.log('--- Getting new token ---');
        this.clear();

        while (this.type === null) {
            this.verbosity && console.log(`Current char: |${this.ch}| (${!isUndefined(this.ch) ? this.ch.charCodeAt(0) : ''})`);

            if (isUndefined(this.ch)) { // конец файла
                this.type = TokenType.EOF;
            } else if (isSpace(this.ch) || isNewLine(this.ch) || isTab(this.ch)) { // пробел или новая строка
                this.getc();
            } else if (isSign(this.ch)) { // один из символов
                if (isBinaryOperator(this.ch)) {
                    this.processBinaryOperator();
                } else if (isStrictEqualityOperator(this.ch)) {
                    this.processSign(TokenType.BOOL_OP, isAssign)
                } else if (isAmpersand(this.ch)) {
                    this.processSign(TokenType.BOOL_OP, isAmpersand, TokenizerError.INVALID_AND_OPERATOR);
                } else if (isVerticalBar(this.ch)) {
                    this.processSign(TokenType.BOOL_OP, isVerticalBar, TokenizerError.INVALID_OR_OPERATOR);
                } else if (isExclamation(this.ch)) {
                    this.processSign(TokenType.BOOL_OP, isAssign, TokenizerError.INVALID_NON_EQUAL_OPERATOR);
                } else if (isAssign(this.ch)) { // присваивание или сравнение
                    this.processAssign();
                } else if (isQuote(this.ch)) { // строка
                    this.processString();
                } else if (isBrace(this.ch)) {
                    this.processSign(TokenType.BRACE);
                } else if (isSemicolon(this.ch)) {
                    this.processSign(TokenType.EOL);
                } else if (isPoint(this.ch)) {
                    this.processSign(TokenType.POINT);
                } else if (isComma(this.ch)) {
                    this.processSign(TokenType.COMMA);
                } else {
                    this.error(TokenizerError.INVALID_SYMBOL);
                }
            } else if (isDigit(this.ch)) { // число
                this.processDigit();
            } else if (isLetter(this.ch)) { // идетификатор (ключевое слово или переменная)
                this.processIdentifier();
            }
        }
        this.current = new Token(this.type, this.value, this.type === TokenType.KEYWORD);
        return this;
    }
}