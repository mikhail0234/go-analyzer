import $ from "jquery";
import {Tokenizer} from "./lexan/Lexan";
import {Parser} from "./parser/Parser";
import {TokenType} from "./lexan/Token";

const $input = $("#code-input");
const input = document.getElementById('code-input');
const doc = input.ownerDocument.defaultView;

const $compile_button = $('button#compile');

window.onload = () => {
    $input.focus();

    $input.on('input', (e) => {
        // console.log(e.target.innerText);
    });

    $input.on('keydown', (e) => {
        if (e.keyCode === 9) {
            e.preventDefault();

            // now insert four non-breaking spaces for the tab key
            const sel = doc.getSelection();
            const range = sel.getRangeAt(0);

            const tabNode = document.createTextNode("    ");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });

    $input.on("paste", function (e) {
        e.preventDefault();
        const text = e.originalEvent.clipboardData.getData("text");
        document.execCommand("insertText", false, text);
    });

    $compile_button.on('click', (e) => {
        console.log('Compiling');
        e.target.disable = true;
        const code = input.innerText;

        console.log('----code----');
        console.log(code);
        // let char_codes = '';
        // for (let i = 0; i < code.length; i++) {
        //     char_codes += code.charCodeAt(i);
        // }
        // console.log(char_codes);
        console.log('------------');

        const t = new Tokenizer(code, {verbosity: false});
        const tokens = [];

        let token = null;

        do {
            token = t.next_token().getCurrent();
            tokens.push(token);
        } while (!token.isEOF());

        console.log(tokens);

        const parser = new Parser(new Tokenizer(code, {verbosity: false}));
        const tree = parser.parse();

        console.log(tree);

        console.log('serialized:');
        console.log(JSON.stringify(tree, null, 4));

        e.target.disable = false;
        e.stopPropagation();
    });
};