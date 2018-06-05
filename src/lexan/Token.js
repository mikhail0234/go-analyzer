import {BRACES, KEYWORDS, PREDECLARED} from "./Symbols";

export const TokenType = {
    NUMBER: 'number',
    BINARY_OP: 'binary-operator',
    UNARY_OP: 'unary-operator',
    BOOL_OP: 'boolean-operator',
    ASSIGN_OP: 'assign-operator',
    KEYWORD: 'keyword',
    IDENTIFIER: 'identifier',
    STRING: 'string',
    BRACE: 'brace',
    POINT: 'point',
    COMMA: 'comma',
    EOL: 'eoe', // end of expression
    EOF: 'eof', // end of file
};

export class Token {
    constructor(type, value = null, reserved = false) {
        this.type = type;      // тип токена
        this.value = value;      // значение токена
        this.reserved = reserved;   // зарезирвированный языком
    }

    getValue() {
        return this.value;
    }

    /*
    *  Проверки типа
    *
    NUMBER: 'number',
    BINARY_OP: 'binary-operator',
    UNARY_OP: 'unary-operator',
    BOOL_OP: 'boolean-operator',
    ASSIGN_OP: 'assign-operator',
    KEYWORD: 'keyword',
    IDENTIFIER: 'identifier',
    STRING: 'string',
    BRACE: 'brace',
    POINT: 'point',
    COMMA: 'comma',
    EOL: 'eoe', // end of expression
    EOF: 'eof', // end of file
    *
    * */

    isNumber() {
        return this.type === TokenType.NUMBER;
    }

    isString() {
        return this.type === TokenType.STRING;
    }

    isIdentifier() {
        return this.type === TokenType.IDENTIFIER;
    }

    isKeyword() {
        return this.type === TokenType.KEYWORD;
    }

    isConstKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.CONST;
    }

    isVarKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.VAR;
    }

    isFuncKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.FUNC;
    }

    isIfKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.IF;
    }

    isForKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.FOR;
    }

    isElseKeyword() {
        return this.isKeyword() && this.value === KEYWORDS.ELSE;
    }

    isType() {
        return this.isIdentifier() && PREDECLARED.TYPES.includes(this.value);
    }

    isNil() {
        return this.isIdentifier() && this.value === PREDECLARED.ZERO;
    }

    isConstant() {
        return this.isIdentifier() && PREDECLARED.CONSTANTS.includes(this.value);
    }

    isBinaryOperator() {
        return this.type === TokenType.BINARY_OP;
    }

    isBooleanOperator() {
        return this.type === TokenType.BOOL_OP;
    }

    isUnaryOperator() {
        return this.type === TokenType.UNARY_OP;
    }

    isEOE() {
        return this.type === TokenType.EOL;
    }

    isEOF() {
        return this.type === TokenType.EOF;
    }

    isComma() {
        return this.type === TokenType.COMMA;
    }

    isAssign() {
        return this.type === TokenType.ASSIGN_OP;
    }

    isBrace() {
        return this.type === TokenType.BRACE;
    }

    isCurlyLeftBrace() {
        return this.isBrace() && this.value === BRACES.BRACE_CURLY_START;
    }

    isCurlyRightBrace() {
        return this.isBrace() && this.value === BRACES.BRACE_CURLY_END;
    }

    isRoundLeftBrace() {
        return this.isBrace() && this.value === BRACES.BRACE_ROUND_START;
    }

    isRoundRightBrace() {
        return this.isBrace() && this.value === BRACES.BRACE_ROUND_END;
    }
}