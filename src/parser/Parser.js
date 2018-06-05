import _ from "underscore";

const NodeType = {
    EMPTY: 'empty',
    PROGRAM: 'program',
    STATEMENT: 'statement',
    EXPRESSION: 'expression',
    CONSTANT: 'constant',
    IDENTIFIER: 'identifier',
    ASSIGN: 'assign-operator',
    BOOL_OP: 'boolean-operator',
    UNARY_OP: 'unary-operator',
    BINARY_OP: 'binary-operator',
    KEYWORD: 'keyword',
    IF_STMT: 'if-clause',
};

class Node {
    constructor(type, {value, var_type, name, func_args, cond, else_body, pre, post}, ...args) {
        this.type = type;
        this.value = value;
        this.var_type = var_type;
        this.args = func_args;
        this.name = name;
        this.cond = cond;
        this.else = else_body;
        this.pre = pre;
        this.post = post;

        this.children = [];
        args.map((el) => {

            if (_.isArray(el)) {
                el.map((sub_el) => {
                    this.children.push(sub_el);
                });
            } else {
                this.children.push(el);
            }

        });
    }
}

export class Parser {
    constructor(lexer) {
        this.lexer = lexer; // лексер
        this.current = null; // текущий токен лексера
    }

    error(msg) {
        throw new Error(`Parser Error.\nError: ${msg}`);
    }

    /**
     *  Берет следующий токен из лексера
     *  и записывает его в current
     */
    getNextToken() {
        console.log('current: ', this.current);
        this.current = this.lexer.next_token().getCurrent();
    }

    expression() { // Expression
        let n = this.operand();
        while (this.current.isBinaryOperator() || this.current.isBooleanOperator()) {
            let kind = null;
            if (this.current.isBinaryOperator()) {
                kind = NodeType.BINARY_OP;
            } else if (this.current.isBooleanOperator()) {
                kind = NodeType.BOOL_OP;
            }
            const value = this.current.getValue();
            this.getNextToken();
            n = new Node(kind, {value}, n, this.expression())
        }
        return n;
    }

    operand() {
        if (this.current.isNumber()) { // Number (int_lit)
            const n = new Node(NodeType.CONSTANT, {value: this.current.getValue(), var_type: 'int'});
            this.getNextToken();
            return n;
        } else if (this.current.isString()) { // String (string_lit)
            const n = new Node(NodeType.CONSTANT, {value: this.current.getValue(), var_type: 'string'});
            this.getNextToken();
            return n;
        } else if (this.current.isIdentifier()) { // Identifier
            const n = new Node(NodeType.IDENTIFIER, {value: this.current.getValue()});
            this.getNextToken();
            return n;
        } else {    // "(" expr ")"

            if (!this.current.isRoundLeftBrace()) {
                this.error(' "("  expected. ');
            }
            this.getNextToken();

            const n = this.expression();

            if (!this.current.isRoundRightBrace()) {
                this.error(' ")"  expected. ');
            }
            this.getNextToken();

            return n;
        }
    }

    // return array of statements witch are in Block
    block() {
        if (this.current.isCurlyLeftBrace()) {
            this.getNextToken();
            const nodes = [];
            while (!this.current.isCurlyRightBrace()) {
                nodes.push(this.statement());
            }
            this.getNextToken();
            return nodes;
        } else {
            this.error('"{" expected');
        }
    }

    funcDeclaration() {
        let n = null;
        this.getNextToken();

        if (!this.current.isIdentifier()) {
            this.error('func name expected');
        }

        const func_name = this.current.getValue();
        this.getNextToken();

        if (!this.current.isRoundLeftBrace()) {
            this.error('"(" expected');
        }
        this.getNextToken();

        const args = [];

        while (!this.current.isRoundRightBrace()) {
            if (this.current.isIdentifier()) {
                const arg_names = [this.current.getValue()];
                let arg_type = null;

                this.getNextToken();

                if (!this.current.isComma() && !this.current.isType()) {
                    this.error('type of argument expected');
                }

                while (this.current.isComma()) {
                    this.getNextToken();
                    if (this.current.isIdentifier()) {
                        arg_names.push(this.current.getValue());
                        this.getNextToken();
                    } else {
                        this.error('identifier expected');
                    }
                }

                if (this.current.isType()) {
                    arg_type = this.current.getValue();
                } else {
                    this.error('type of arguments expected');
                }

                for (let i = 0; i < arg_names.length; i++) {
                    args.push(new Node(NodeType.IDENTIFIER, {
                        value: arg_names[i],
                        var_type: arg_type
                    }))
                }
                this.getNextToken();
            }
        }
        this.getNextToken();

        const func_body = this.block();

        return new Node(NodeType.KEYWORD, {
            value: 'func',
            name: func_name,
            func_args: args,
        }, func_body);
    }

    constDeclaration() {
        let n = null;
        this.getNextToken();
        if (this.current.isIdentifier()) {
            const value = this.current.getValue();
            let var_type = null;

            this.getNextToken();
            if (this.current.isType()) {
                var_type = this.current.getValue();
                this.getNextToken();
            } else {
                this.error('type of const declaration expected');
            }

            n = new Node(NodeType.IDENTIFIER, {value, var_type});

            if (this.current.isAssign()) {
                const v = this.current.getValue();
                this.getNextToken();
                n = new Node(NodeType.ASSIGN, {value: v}, n, this.expression());
            }

            if (this.current.isEOE()) {
                this.getNextToken();
                return n;
            } else {
                this.error('termination (";") of const declaration expected')
            }
        } else {
            this.error('identifier expected');
        }
    }

    varDeclaration() {
        let n = null;
        this.getNextToken();
        if (this.current.isIdentifier()) {
            const value = this.current.getValue();
            let var_type = null;

            n = new Node(NodeType.IDENTIFIER, {value}); // нет типа

            this.getNextToken();
            if (this.current.isType()) {
                var_type = this.current.getValue();
                this.getNextToken();

                n = new Node(NodeType.IDENTIFIER, {value, var_type});

                if (this.current.isAssign()) {
                    const v = this.current.getValue();
                    this.getNextToken();
                    n = new Node(NodeType.ASSIGN, {value: v}, n, this.expression());
                }

            } else if (this.current.isAssign()) {
                const v = this.current.getValue();
                this.getNextToken();
                n = new Node(NodeType.ASSIGN, {value: v}, n, this.expression());
            }

            if (this.current.isEOE()) {
                this.getNextToken();
                return n;
            } else {
                this.error('termination (";") of const declaration expected')
            }
        } else {
            this.error('identifier expected');
        }
    }

    ifStmt() {
        let n = null;
        this.getNextToken();

        if (!this.current.isRoundLeftBrace()) {
            this.error('"(" expected');
        }
        this.getNextToken();

        const condition = this.expression();

        if (!this.current.isRoundRightBrace()) {
            this.error('")" expected');
        }
        this.getNextToken();

        const body = this.block();
        let else_body = null;

        if (this.current.isElseKeyword()) {
            this.getNextToken();
            else_body = this.block();
        }

        return new Node(NodeType.IF_STMT, {
            cond: condition,
            else_body: else_body,
        }, body)
    }

    forStmt() {
        let n = null;
        this.getNextToken();

        if (!this.current.isRoundLeftBrace()) {
            this.error('"(" expected');
        }
        this.getNextToken();

        const pre = this.simpleStmt();

        if (!this.current.isEOE()) {
            this.error('";" expected');
        }

        const condition = this.expression();

        if (!this.current.isEOE()) {
            this.error('";" expected');
        }

        const post = this.simpleStmt();

        if (!this.current.isRoundRightBrace()) {
            this.error('")" expected');
        }
        this.getNextToken();

        const body = this.block();

        return new Node(NodeType.IF_STMT, {
            pre: pre,
            cond: condition,
            post: post,
        }, body)
    }

    simpleStmt() {
        if (this.current.isEOE()) { // EmptyStmt
            n = new Node(Parser.EMPTY, {});
            this.getNextToken();
        } else { // ExpressionStmt
            n = this.expression();

            if (this.current.isAssign()) { // Assignment
                const value = this.current.getValue();
                this.getNextToken();
                n = new Node(NodeType.ASSIGN, {value}, n, this.expression());
            }

            this.getNextToken();
        }
        return n;
    }

    statement() {
        let n = null;

        if (this.current.isEOE()) { // EmptyStmt
            n = new Node(Parser.EMPTY, {});
            this.getNextToken();
        } else if (this.current.isKeyword()) {

            if (this.current.isConstKeyword()) {
                n = this.constDeclaration();
            } else if (this.current.isVarKeyword()) {
                n = this.varDeclaration();
            } else if (this.current.isIfKeyword()) {
                n = this.ifStmt();
            } else if (this.current.isForKeyword()) {
                n = this.forStmt();
            } else if (this.current.isFuncKeyword()) {
                n = this.funcDeclaration();
            }

        } else if (this.current.isCurlyLeftBrace()) { // Block
            this.getNextToken();
            const nodes = [];
            while (!this.current.isCurlyRightBrace()) {
                nodes.push(this.statement());
            }
            n = new Node(NodeType.STATEMENT, {}, nodes);
            this.getNextToken();
        } else { // ExpressionStmt
            n = this.expression();

            if (this.current.isAssign()) { // Assignment
                const value = this.current.getValue();
                this.getNextToken();
                n = new Node(NodeType.ASSIGN, {value}, n, this.expression());
            }

            if (!this.current.isEOE()) {
                this.error('";" expected');
            }
            this.getNextToken();
        }

        return n;
    }

    parse() {
        this.getNextToken();
        const head = new Node(NodeType.STATEMENT, {}, this.statement());

        if (!this.current.isEOF()) {
            this.error("Invalid statement syntax");
        }

        return head;
    }


}