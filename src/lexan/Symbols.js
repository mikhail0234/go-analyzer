export const BRACES = {
    BRACE_CURLY_START: '{',
    BRACE_CURLY_END: '}',
    BRACE_ROUND_START: '(',
    BRACE_ROUND_END: ')',
    BRACKET_SQUARE_START: '[',
    BRACKET_SQUARE_END: ']'
};

export const PREDECLARED = {
    TYPES: [
        'bool', 'int', 'string'
    ],
    CONSTANTS: ['true', 'false', 'iota'],
    ZERO: 'nil'
};

export const KEYWORDS = {
    BREAK: 'break',
    DEFAULT: 'default',
    FUNC: 'func',
    INTERFACE: 'interface',
    SELECT: 'select',
    CASE: 'case',
    DEFER: 'defer',
    GO: 'go',
    MAP: 'map',
    STRUCT: 'struct',
    CHAN: 'chan',
    ELSE: 'else',
    GOTO: 'goto',
    PACKAGE: 'package',
    SWITCH: 'switch',
    CONST: 'const',
    FALLTHROUGH: 'fallthrough',
    IF: 'if',
    RANGE: 'range',
    TYPE: 'type',
    CONTINUE: 'continue',
    FOR: 'for',
    IMPORT: 'import',
    RETURN: 'return',
    VAR: 'var'
};