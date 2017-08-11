/*
FatFingerJS

https://github.com/rottytooth/FatFingerJS
http://esoteric.codes
http://danieltemkin.com


*/



var fatfinger = {};

fatfinger.CompileException = function(message) {
   this.message = message;
};

// globals that JsLint doesn't like for whatever reason
fatfinger.JslintGlobalList = ["window","browser"];

fatfinger.JslintBlindSpot = function(text) {
    // these are for globals that jslint doesn't like (such as window)
    if (fatfinger.JslintGlobalList.indexOf(text) > -1) {
        return true;
    }
    return false;
}

// from parse-js.js (uglify)
fatfinger.array_to_hash = function(a) {
    var ret = {};
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
};

//FIXME: can we replace these with something es6-friendly, perhaps from esprima?
fatfinger.Keywords = fatfinger.array_to_hash([
    "break",
    "case",
    "catch",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "new",
    "return",
    "switch",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
]);

fatfinger.Keywords_Atom = fatfinger.array_to_hash([
    "false",
    "null",
    "true",
    "undefined"
]);
;// jslint.js
// 2017-04-10
// Copyright (c) 2015 Douglas Crockford  (www.JSLint.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// The Software shall be used for Good, not Evil.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// jslint(source, option_object, global_array) is a function that takes 3
// arguments. The second two arguments are optional.

//      source          A text to analyze, a string or an array of strings.
//      option_object   An object whose keys correspond to option names.
//      global_array    An array of strings containing global variables that
//                      the file is allowed readonly access.

// jslint returns an object containing its results. The object contains a lot
// of valuable information. It can be used to generate reports. The object
// contains:

//      directives: an array of directive comment tokens.
//      edition: the version of JSLint that did the analysis.
//      exports: the names exported from the module.
//      froms: an array of strings representing each of the imports.
//      functions: an array of objects that represent all of the functions
//              declared in the file.
//      global: an object representing the global object. Its .context property
//              is an object containing a property for each global variable.
//      id: "(JSLint)"
//      json: true if the file is a JSON text.
//      lines: an array of strings, the source.
//      module: true if an import or export statement was used.
//      ok: true if no warnings were generated. This is what you want.
//      option: the option argument.
//      property: a property object.
//      stop: true if JSLint was unable to finish. You don't want this.
//      tokens: an array of objects representing the tokens in the file.
//      tree: the token objects arranged in a tree.
//      warnings: an array of warning objects. A warning object can contain:
//          name: "JSLintError"
//          column: A column number in the file.
//          line: A line number in the file.
//          code: A warning code string.
//          message: The warning message string.
//          a: Exhibit A.
//          b: Exhibit B.
//          c: Exhibit C.
//          d: Exhibit D.

// jslint works in several phases. In any of these phases, errors might be
// found. Sometimes JSLint is able to recover from an error and continue
// parsing. In some cases, it cannot and will stop early. If that should happen,
// repair your code and try again.

// Phases:

//      1. If the source is a single string, split it into an array of strings.
//      2. Turn the source into an array of tokens.
//      3. Furcate the tokens into a parse tree.
//      4. Walk the tree, traversing all of the nodes of the tree. It is a
//          recursive traversal. Each node may be processed on the way down
//          (preaction) and on the way up (postaction).
//      5. Check the whitespace between the tokens.

// jslint can also examine JSON text. It decides that a file is JSON text if
// the first token is "[" or "{". Processing of JSON text is much simpler than
// the processing of JavaScript programs. Only the first three phases are
// required.

// WARNING: JSLint will hurt your feelings.

/*jslint bitwise*/

/*property
    a, and, arity, assign, b, bad_assignment_a, bad_directive_a, bad_get,
    bad_module_name_a, bad_option_a, bad_property_a, bad_set, bitwise, block,
    body, browser, c, calls, catch, charAt, charCodeAt, closer, closure, code,
    column, complex, concat, constant, context, couch, create, d, dead,
    default, devel, directive, directives, disrupt, dot, duplicate_a, edition,
    ellipsis, else, empty_block, es6, escape_mega, eval, every, expected_a,
    expected_a_at_b_c, expected_a_b, expected_a_b_from_c_d,
    expected_a_before_b, expected_digits_after_a, expected_four_digits,
    expected_identifier_a, expected_line_break_a_b, expected_regexp_factor_a,
    expected_space_a_b, expected_statements_a, expected_string_a,
    expected_type_string_a, exports, expression, extra, finally, flag, for,
    forEach, free, from, froms, fud, fudge, function, function_in_loop,
    functions, g, global, i, id, identifier, import, inc, indexOf, infix_in,
    init, initial, isArray, isNaN, join, json, keys, label, label_a, lbp, led,
    length, level, line, lines, live, loop, m, margin, match, maxerr, maxlen,
    message, misplaced_a, misplaced_directive_a, missing_browser, missing_m,
    module, multivar, naked_block, name, names, nested_comment, new, node,
    not_label_a, nr, nud, number_isNaN, ok, open, option, out_of_scope_a,
    parameters, pop, property, push, qmark, quote, redefinition_a_b, replace,
    required_a_optional_b, reserved_a, right, role, search, signature, single,
    slice, some, sort, split, statement, stop, strict, subscript_a, switch,
    test, this, thru, toString, todo_comment, tokens, too_long, too_many,
    too_many_digits, tree, try, type, u, unclosed_comment, unclosed_mega,
    unclosed_string, undeclared_a, unexpected_a, unexpected_a_after_b,
    unexpected_a_before_b, unexpected_at_top_level_a, unexpected_char_a,
    unexpected_comment, unexpected_directive_a, unexpected_expression_a,
    unexpected_label_a, unexpected_parens, unexpected_space_a_b,
    unexpected_statement_a, unexpected_trailing_space, unexpected_typeof_a,
    uninitialized_a, unreachable_a, unregistered_property_a, unsafe, unused_a,
    use_double, use_spaces, use_strict, used, value, var_loop, var_switch,
    variable, warning, warnings, weird_condition_a, weird_expression_a,
    weird_loop, weird_relation_a, white, wrap_assignment, wrap_condition,
    wrap_immediate, wrap_parameter, wrap_regexp, wrap_unary, wrapped, writable,
    y
*/

var jslint = (function JSLint() {
    "use strict";

    function empty() {

// The empty function produces a new empty object that inherits nothing. This is
// much better than {} because confusions around accidental method names like
// "constructor" are completely avoided.

        return Object.create(null);
    }

    function populate(object, array, value) {

// Augment an object by taking property names from an array of strings.

        array.forEach(function (name) {
            object[name] = value;
        });
    }

    var allowed_option = {

// These are the options that are recognized in the option object or that may
// appear in a /*jslint*/ directive. Most options will have a boolean value,
// usually true. Some options will also predefine some number of global
// variables.

        bitwise: true,
        browser: [
            "Audio",
            "clearInterval",
            "clearTimeout",
            "document",
            "event",
            "FileReader",
            "FormData",
            "history",
            "Image",
            "localStorage",
            "location",
            "name",
            "navigator",
            "Option",
            "screen",
            "sessionStorage",
            "setInterval",
            "setTimeout",
            "Storage",
            "XMLHttpRequest"
        ],
        couch: [
            "emit", "getRow", "isArray", "log", "provides", "registerType",
            "require", "send", "start", "sum", "toJSON"
        ],
        devel: [
            "alert", "confirm", "console", "prompt"
        ],
        es6: [
            "ArrayBuffer", "DataView", "Float32Array", "Float64Array",
            "Generator", "GeneratorFunction", "Int8Array", "Int16Array",
            "Int32Array", "Intl", "Map", "Promise", "Proxy", "Reflect",
            "Set", "Symbol", "System", "Uint8Array", "Uint8ClampedArray",
            "Uint16Array", "Uint32Array", "WeakMap", "WeakSet"
        ],
        eval: true,
        for: true,
        fudge: true,
        maxerr: 10000,
        maxlen: 10000,
        multivar: true,
        node: [
            "Buffer", "clearImmediate", "clearInterval", "clearTimeout",
            "console", "exports", "global", "module", "process", "querystring",
            "require", "setImmediate", "setInterval", "setTimeout",
            "__dirname", "__filename"
        ],
        single: true,
        this: true,
        white: true
    };

    var spaceop = {

// This is the set of infix operators that require a space on each side.

        "!=": true,
        "!==": true,
        "%": true,
        "%=": true,
        "&": true,
        "&=": true,
        "&&": true,
        "*": true,
        "*=": true,
        "+=": true,
        "-=": true,
        "/": true,
        "/=": true,
        "<": true,
        "<=": true,
        "<<": true,
        "<<=": true,
        "=": true,
        "==": true,
        "===": true,
        "=>": true,
        ">": true,
        ">=": true,
        ">>": true,
        ">>=": true,
        ">>>": true,
        ">>>=": true,
        "^": true,
        "^=": true,
        "|": true,
        "|=": true,
        "||": true
    };

    var bitwiseop = {

// These are the bitwise operators.

        "~": true,
        "^": true,
        "^=": true,
        "&": true,
        "&=": true,
        "|": true,
        "|=": true,
        "<<": true,
        "<<=": true,
        ">>": true,
        ">>=": true,
        ">>>": true,
        ">>>=": true
    };

    var opener = {

// The open and close pairs.

        "(": ")",       // paren
        "[": "]",       // bracket
        "{": "}",       // brace
        "${": "}"       // mega
    };

    var relationop = {

// The relational operators.

        "!=": true,
        "!==": true,
        "==": true,
        "===": true,
        "<": true,
        "<=": true,
        ">": true,
        ">=": true
    };

    var standard = [

// These are the globals that are provided by the ES5 language standard.

        "Array", "Boolean", "Date", "decodeURI", "decodeURIComponent",
        "encodeURI", "encodeURIComponent", "Error", "EvalError", "isFinite",
        "JSON", "Math", "Number", "Object", "parseInt", "parseFloat",
        "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError",
        "TypeError", "URIError"
    ];

    var bundle = {

// The bundle contains the raw text messages that are generated by jslint. It
// seems that they are all error messages and warnings. There are no "Atta
// boy!" or "You are so awesome!" messages. There is no positive reinforcement
// or encouragement. This relentless negativity can undermine self-esteem and
// wound the inner child. But if you accept it as sound advice rather than as
// personal criticism, it can make your programs better.

        and: "The '&&' subexpression should be wrapped in parens.",
        bad_assignment_a: "Bad assignment to '{a}'.",
        bad_directive_a: "Bad directive '{a}'.",
        bad_get: "A get function takes no parameters.",
        bad_module_name_a: "Bad module name '{a}'.",
        bad_option_a: "Bad option '{a}'.",
        bad_property_a: "Bad property name '{a}'.",
        bad_set: "A set function takes one parameter.",
        duplicate_a: "Duplicate '{a}'.",
        empty_block: "Empty block.",
        es6: "Unexpected ES6 feature '{a}'.",
        escape_mega: "Unexpected escapement in mega literal.",
        expected_a: "Expected '{a}'.",
        expected_a_at_b_c: "Expected '{a}' at column {b}, not column {c}.",
        expected_a_b: "Expected '{a}' and instead saw '{b}'.",
        expected_a_b_from_c_d: "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
        expected_a_before_b: "Expected '{a}' before '{b}'.",
        expected_digits_after_a: "Expected digits after '{a}'.",
        expected_four_digits: "Expected four digits after '\\u'.",
        expected_identifier_a: "Expected an identifier and instead saw '{a}'.",
        expected_line_break_a_b: "Expected a line break between '{a}' and '{b}'.",
        expected_regexp_factor_a: "Expected a regexp factor and instead saw '{a}'.",
        expected_space_a_b: "Expected one space between '{a}' and '{b}'.",
        expected_statements_a: "Expected statements before '{a}'.",
        expected_string_a: "Expected a string and instead saw '{a}'.",
        expected_type_string_a: "Expected a type string and instead saw '{a}'.",
        function_in_loop: "Don't make functions within a loop.",
        infix_in: "Unexpected 'in'. Compare with undefined, or use the hasOwnProperty method instead.",
        isNaN: "Use the isNaN function to compare with NaN.",
        label_a: "'{a}' is a statement label.",
        misplaced_a: "Place '{a}' at the outermost level.",
        misplaced_directive_a: "Place the '/*{a}*/' directive before the first statement.",
        missing_browser: "/*global*/ requires the Assume a browser option.",
        missing_m: "Expected 'm' flag on a multiline regular expression.",
        naked_block: "Naked block.",
        nested_comment: "Nested comment.",
        not_label_a: "'{a}' is not a label.",
        number_isNaN: "Use Number.isNaN function to compare with NaN.",
        out_of_scope_a: "'{a}' is out of scope.",
        redefinition_a_b: "Redefinition of '{a}' from line {b}.",
        required_a_optional_b: "Required parameter '{a}' after optional parameter '{b}'.",
        reserved_a: "Reserved name '{a}'.",
        subscript_a: "['{a}'] is better written in dot notation.",
        todo_comment: "Unexpected TODO comment.",
        too_long: "Line too long.",
        too_many: "Too many warnings.",
        too_many_digits: "Too many digits.",
        unclosed_comment: "Unclosed comment.",
        unclosed_mega: "Unclosed mega literal.",
        unclosed_string: "Unclosed string.",
        undeclared_a: "Undeclared '{a}'.",
        unexpected_a: "Unexpected '{a}'.",
        unexpected_a_after_b: "Unexpected '{a}' after '{b}'.",
        unexpected_a_before_b: "Unexpected '{a}' before '{b}'.",
        unexpected_at_top_level_a: "Expected '{a}' to be in a function.",
        unexpected_char_a: "Unexpected character '{a}'.",
        unexpected_comment: "Unexpected comment.",
        unexpected_directive_a: "When using modules, don't use directive '/*{a}'.",
        unexpected_expression_a: "Unexpected expression '{a}' in statement position.",
        unexpected_label_a: "Unexpected label '{a}'.",
        unexpected_parens: "Don't wrap function literals in parens.",
        unexpected_space_a_b: "Unexpected space between '{a}' and '{b}'.",
        unexpected_statement_a: "Unexpected statement '{a}' in expression position.",
        unexpected_trailing_space: "Unexpected trailing space.",
        unexpected_typeof_a: "Unexpected 'typeof'. Use '===' to compare directly with {a}.",
        uninitialized_a: "Uninitialized '{a}'.",
        unreachable_a: "Unreachable '{a}'.",
        unregistered_property_a: "Unregistered property name '{a}'.",
        unsafe: "Unsafe character '{a}'.",
        unused_a: "Unused '{a}'.",
        use_double: "Use double quotes, not single quotes.",
        use_spaces: "Use spaces, not tabs.",
        use_strict: "This function needs a \"use strict\" pragma.",
        var_loop: "Don't declare variables in a loop.",
        var_switch: "Don't declare variables in a switch.",
        weird_condition_a: "Weird condition '{a}'.",
        weird_expression_a: "Weird expression '{a}'.",
        weird_loop: "Weird loop.",
        weird_relation_a: "Weird relation '{a}'.",
        wrap_assignment: "Don't wrap assignment statements in parens.",
        wrap_condition: "Wrap the condition in parens.",
        wrap_immediate: "Wrap an immediate function invocation in " +
                "parentheses to assist the reader in understanding that the " +
                "expression is the result of a function, and not the " +
                "function itself.",
        wrap_parameter: "Wrap the parameter in parens.",
        wrap_regexp: "Wrap this regexp in parens to avoid confusion.",
        wrap_unary: "Wrap the unary expression in parens."
    };

// Regular expression literals:

// supplant {variables}
    var rx_supplant = /\{([^{}]*)\}/g;
// carriage return, carriage return linefeed, or linefeed
    var rx_crlf = /\n|\r\n?/;
// unsafe characters that are silently deleted by one or more browsers
    var rx_unsafe = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/;
// identifier
    var rx_identifier = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/;
    var rx_module = /^[a-zA-Z0-9_$:.@\-\/]+$/;
    var rx_bad_property = /^_|\$|Sync\$|_$/;
// star slash
    var rx_star_slash = /\*\//;
// slash star
    var rx_slash_star = /\/\*/;
// slash star or ending slash
    var rx_slash_star_or_slash = /\/\*|\/$/;
// uncompleted work comment
    var rx_todo = /\b(?:todo|TO\s?DO|HACK)\b/;
// tab
    var rx_tab = /\t/g;
// directive
    var rx_directive = /^(jslint|property|global)\s+(.*)$/;
    var rx_directive_part = /^([a-zA-Z$_][a-zA-Z0-9$_]*)\s*(?::\s*(true|false|[0-9]+)\s*)?(?:,\s*)?(.*)$/;
// token (sorry it is so long)
    var rx_token = /^((\s+)|([a-zA-Z_$][a-zA-Z0-9_$]*)|[(){}\[\]?,:;'"~`]|=(?:==?|>)?|\.+|\/[=*\/]?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|[\^%]=?|&[&=]?|\|[|=]?|>{1,3}=?|<<?=?|!={0,2}|(0|[1-9][0-9]*))(.*)$/;
    var rx_digits = /^([0-9]+)(.*)$/;
    var rx_hexs = /^([0-9a-fA-F]+)(.*)$/;
    var rx_octals = /^([0-7]+)(.*)$/;
    var rx_bits = /^([01]+)(.*)$/;
// mega
    var rx_mega = /[`\\]|\$\{/;
// indentation
    var rx_colons = /^(.*)\?([:.]*)$/;
    var rx_dot = /\.$/;
// JSON number
    var rx_JSON_number = /^-?\d+(?:\.\d*)?(?:e[\-+]?\d+)?$/i;
// initial cap
    var rx_cap = /^[A-Z]/;

    function is_letter(string) {
        return (string >= "a" && string <= "z\uffff") ||
                (string >= "A" && string <= "Z\uffff");
    }

    function supplant(string, object) {
        return string.replace(rx_supplant, function (found, filling) {
            var replacement = object[filling];
            return (replacement !== undefined)
                ? replacement
                : found;
        });
    }

    var anon = "anonymous"; // The guessed name for anonymous functions.
    var blockage;           // The current block.
    var block_stack;        // The stack of blocks.
    var declared_globals;   // The object containing the global declarations.
    var directives;         // The directive comments.
    var directive_mode;     // true if directives are still allowed.
    var early_stop;         // true if JSLint cannot finish.
    var exports;            // The exported names and values.
    var froms;              // The array collecting all import-from strings.
    var fudge;              // true if the natural numbers start with 1.
    var functionage;        // The current function.
    var functions;          // The array containing all of the functions.
    var global;             // The global object; the outermost context.
    var json_mode;          // true if parsing JSON.
    var lines;              // The array containing source lines.
    var module_mode;        // true if import or export was used.
    var next_token;         // The next token to be examined in the parse.
    var option;             // The options parameter.
    var property;           // The object containing the tallied property names.
    var mega_mode;          // true if currently parsing a megastring literal.
    var stack;              // The stack of functions.
    var syntax;             // The object containing the parser.
    var token;              // The current token being examined in the parse.
    var token_nr;           // The number of the next token.
    var tokens;             // The array of tokens.
    var tenure;             // The predefined property registry.
    var tree;               // The abstract parse tree.
    var var_mode;           // true if using var; false if using let.
    var warnings;           // The array collecting all generated warnings.

// Error reportage functions:

    function artifact(the_token) {

// Return a string representing an artifact.

        if (the_token === undefined) {
            the_token = next_token;
        }
        return (the_token.id === "(string)" || the_token.id === "(number)")
            ? String(the_token.value)
            : the_token.id;
    }

    function artifact_line(the_token) {

// Return the fudged line number of an artifact.

        if (the_token === undefined) {
            the_token = next_token;
        }
        return the_token.line + fudge;
    }

    function artifact_column(the_token) {

// Return the fudged column number of an artifact.

        if (the_token === undefined) {
            the_token = next_token;
        }
        return the_token.from + fudge;
    }

    function warn_at(code, line, column, a, b, c, d) {

// Report an error at some line and column of the program. The warning object
// resembles an exception.

        var warning = {         // ~~
            name: "JSLintError",
            column: column,
            line: line,
            code: code
        };
        if (a !== undefined) {
            warning.a = a;
        }
        if (b !== undefined) {
            warning.b = b;
        }
        if (c !== undefined) {
            warning.c = c;
        }
        if (d !== undefined) {
            warning.d = d;
        }
        warning.message = supplant(bundle[code] || code, warning);
        warnings.push(warning);
        return (
            typeof option.maxerr === "number" &&
            warnings.length === option.maxerr
        )   ? stop_at("too_many", line, column)
            : warning;
    }

    function stop_at(code, line, column, a, b, c, d) {

// Same as warn_at, except that it stops the analysis.

        throw warn_at(code, line, column, a, b, c, d);
    }

    function warn(code, the_token, a, b, c, d) {

// Same as warn_at, except the warning will be associated with a specific token.
// If there is already a warning on this token, suppress the new one. It is
// likely that the first warning will be the most meaningful.

        if (the_token === undefined) {
            the_token = next_token;
        }
        if (the_token.warning === undefined) {
            the_token.warning = warn_at(
                code,
                the_token.line,
                the_token.from,
                a || artifact(the_token),
                b,
                c,
                d
            );
            return the_token.warning;
        }
    }

    function stop(code, the_token, a, b, c, d) {

// Similar to warn and stop_at. If the token already had a warning, that
// warning will be replaced with this new one. It is likely that the stopping
// warning will be the more meaningful.

        if (the_token === undefined) {
            the_token = next_token;
        }
        delete the_token.warning;
        throw warn(code, the_token, a, b, c, d);
    }

// Tokenize:

    function tokenize(source) {

// tokenize takes a source and produces from it an array of token objects.
// JavaScript is notoriously difficult to tokenize because of the horrible
// interactions between automatic semicolon insertion, regular expression
// literals, and now megastring literals. JSLint benefits from eliminating
// automatic semicolon insertion and nested megastring literals, which allows
// full tokenization to precede parsing.

// If the source is not an array, then it is split into lines at the
// carriage return/linefeed.

        lines = (Array.isArray(source))
            ? source
            : source.split(rx_crlf);
        tokens = [];

        var char;                   // a popular character
        var column = 0;             // the column number of the next character
        var first;                  // the first token
        var from;                   // the starting column number of the token
        var line = -1;              // the line number of the next character
        var nr = 0;                 // the next token number
        var previous = global;      // the previous token including comments
        var prior = global;         // the previous token excluding comments
        var mega_from;              // the starting column of megastring
        var mega_line;              // the starting line of megastring
        var snippet;                // a piece of string
        var source_line;            // the current line source string

        function next_line() {

// Put the next line of source in source_line. If the line contains tabs,
// replace them with spaces and give a warning. Also warn if the line contains
// unsafe characters or is too damn long.

            var at;
            column = 0;
            line += 1;
            source_line = lines[line];
            if (source_line !== undefined) {
                at = source_line.search(rx_tab);
                if (at >= 0) {
                    if (!option.white) {
                        warn_at("use_spaces", line, at + 1);
                    }
                    source_line = source_line.replace(rx_tab, " ");
                }
                at = source_line.search(rx_unsafe);
                if (at >= 0) {
                    warn_at(
                        "unsafe",
                        line,
                        column + at,
                        "U+" + source_line.charCodeAt(at).toString(16)
                    );
                }
                if (option.maxlen && option.maxlen < source_line.length) {
                    warn_at("too_long", line, source_line.length);
                } else if (!option.white && source_line.slice(-1) === " ") {
                    warn_at(
                        "unexpected_trailing_space",
                        line,
                        source_line.length - 1
                    );
                }
            }
            return source_line;
        }

// Most tokens, including the identifiers, operators, and punctuators, can be
// found with a regular expression. Regular expressions cannot correctly match
// regular expression literals, so we will match those the hard way. String
// literals and number literals can be matched by regular expressions, but they
// don't provide good warnings. The functions snip, next_char, prev_char,
// some_digits, and escape help in the parsing of literals.

        function snip() {

// Remove the last character from snippet.

            snippet = snippet.slice(0, -1);
        }

        function next_char(match) {

// Get the next character from the source line. Remove it from the source_line,
// and append it to the snippet. Optionally check that the previous character
// matched an expected value.

            if (match !== undefined && char !== match) {
                return stop_at(
                    (char === "")
                        ? "expected_a"
                        : "expected_a_b",
                    line,
                    column - 1,
                    match,
                    char
                );
            }
            if (source_line) {
                char = source_line.charAt(0);
                source_line = source_line.slice(1);
                snippet += char;
            } else {
                char = "";
                snippet += " ";
            }
            column += 1;
            return char;
        }

        function back_char() {

// Back up one character by moving a character from the end of the snippet to
// the front of the source_line.

            if (snippet) {
                char = snippet.slice(-1);
                source_line = char + source_line;
                column -= 1;
                snip();
            } else {
                char = "";
            }
            return char;
        }

        function some_digits(rx, quiet) {
            var result = source_line.match(rx);
            if (result) {
                char = result[1];
                column += char.length;
                source_line = result[2];
                snippet += char;
            } else {
                char = "";
                if (!quiet) {
                    warn_at(
                        "expected_digits_after_a",
                        line,
                        column,
                        snippet
                    );
                }
            }
            return char.length;
        }

        function escape(extra) {
            switch (next_char("\\")) {
            case "\\":
            case "/":
            case "b":
            case "f":
            case "n":
            case "r":
            case "t":
                break;
            case "u":
                if (next_char("u") === "{") {
                    if (json_mode) {
                        warn_at("unexpected_a", line, column - 1, char);
                    }
                    if (some_digits(rx_hexs) > 5) {
                        warn_at("too_many_digits", line, column - 1);
                    }
                    if (!option.es6) {
                        warn_at("es6", line, column, "u{");
                    }
                    if (next_char() !== "}") {
                        stop_at("expected_a_before_b", line, column, "}", char);
                    }
                    next_char();
                    return;
                }
                back_char();
                if (some_digits(rx_hexs, true) < 4) {
                    warn_at("expected_four_digits", line, column - 1);
                }
                break;
            case "":
                return stop_at("unclosed_string", line, column);
            default:
                if (!extra || extra.indexOf(char) < 0) {
                    warn_at(
                        "unexpected_a_before_b",
                        line,
                        column - 2,
                        "\\",
                        char
                    );
                }
            }
            next_char();
        }

        function make(id, value, identifier) {

// Make the token object and append it to the tokens list.

            var the_token = {
                from: from,
                id: id,
                identifier: !!identifier,
                line: line,
                nr: nr,
                thru: column
            };
            tokens[nr] = the_token;
            nr += 1;

// Directives must appear before the first statement.

            if (id !== "(comment)" && id !== ";") {
                directive_mode = false;
            }

// If the token is to have a value, give it one.

            if (value !== undefined) {
                the_token.value = value;
            }

// If this token is an identifier that touches a preceding number, or
// a "/", comment, or regular expression literal that touches a preceding
// comment or regular expression literal, then give a missing space warning.
// This warning is not suppressed by option.white.

            if (
                previous.line === line &&
                previous.thru === from &&
                (
                    (id === "(comment)" || id === "(regexp)" || id === "/") &&
                    (
                        previous.id === "(comment)" ||
                        previous.id === "(regexp)"
                    )
                )
            ) {
                warn(
                    "expected_space_a_b",
                    the_token,
                    artifact(previous),
                    artifact(the_token)
                );
            }
            if (previous.id === "." && id === "(number)") {
                warn("expected_a_before_b", previous, "0", ".");
            }
            if (prior.id === "." && the_token.identifier) {
                the_token.dot = true;
            }

// The previous token is used to detect adjacency problems.

            previous = the_token;

// The prior token is a previous token that was not a comment. The prior token
// is used to disambiguate "/", which can mean division or regular expression
// literal.

            if (previous.id !== "(comment)") {
                prior = previous;
            }
            return the_token;
        }

        function parse_directive(the_comment, body) {

// JSLint recognizes three directives that can be encoded in comments. This
// function processes one item, and calls itself recursively to process the
// next one.

            var result = body.match(rx_directive_part);
            if (result) {
                var allowed;
                var name = result[1];
                var value = result[2];
                switch (the_comment.directive) {
                case "jslint":
                    allowed = allowed_option[name];
                    switch (typeof allowed) {
                    case "boolean":
                    case "object":
                        switch (value) {
                        case "true":
                        case "":
                        case undefined:
                            option[name] = true;
                            if (Array.isArray(allowed)) {
                                populate(declared_globals, allowed, false);
                            }
                            break;
                        case "false":
                            option[name] = false;
                            break;
                        default:
                            warn(
                                "bad_option_a",
                                the_comment,
                                name + ":" + value
                            );
                        }
                        break;
                    case "number":
                        if (isFinite(+value)) {
                            option[name] = +value;
                        } else {
                            warn(
                                "bad_option_a",
                                the_comment,
                                name + ":" + value
                            );
                        }
                        break;
                    default:
                        warn("bad_option_a", the_comment, name);
                    }
                    break;
                case "property":
                    if (tenure === undefined) {
                        tenure = empty();
                    }
                    tenure[name] = true;
                    break;
                case "global":
                    if (value) {
                        warn("bad_option_a", the_comment, name + ":" + value);
                    }
                    declared_globals[name] = false;
                    module_mode = the_comment;
                    break;
                }
                return parse_directive(the_comment, result[3]);
            }
            if (body) {
                return stop("bad_directive_a", the_comment, body);
            }
        }

        function comment(snippet) {

// Make a comment object. Comments are not allowed in JSON text. Comments can
// include directives and notices of incompletion.

            var the_comment = make("(comment)", snippet);
            if (Array.isArray(snippet)) {
                snippet = snippet.join(" ");
            }
            if (!option.devel && rx_todo.test(snippet)) {
                warn("todo_comment", the_comment);
            }
            var result = snippet.match(rx_directive);
            if (result) {
                if (!directive_mode) {
                    warn_at("misplaced_directive_a", line, from, result[1]);
                } else {
                    the_comment.directive = result[1];
                    parse_directive(the_comment, result[2]);
                }
                directives.push(the_comment);
            }
            return the_comment;
        }

        function regexp() {

// Parse a regular expression literal.

            var multi_mode = false;
            var result;
            var value;

            function quantifier() {

// Match an optional quantifier.

                switch (char) {
                case "?":
                case "*":
                case "+":
                    next_char();
                    break;
                case "{":
                    if (some_digits(rx_digits, true) === 0) {
                        warn_at("expected_a", line, column, "0");
                    }
                    if (next_char() === ",") {
                        some_digits(rx_digits, true);
                        next_char();
                    }
                    next_char("}");
                    break;
                default:
                    return;
                }
                if (char === "?") {
                    next_char("?");
                }
            }

            function subklass() {

// Match a character in a character class.

                switch (char) {
                case "\\":
                    escape("BbDdSsWw-[]^");
                    return true;
                case "[":
                case "]":
                case "/":
                case "^":
                case "-":
                case "":
                    return false;
                case "`":
                    if (mega_mode) {
                        warn_at("unexpected_a", line, column, "`");
                    }
                    next_char();
                    return true;
                case " ":
                    warn_at("expected_a_before_b", line, column, "\\", " ");
                    next_char();
                    return true;
                default:
                    next_char();
                    return true;
                }
            }

            function ranges() {

// Match a range of subclasses.

                if (subklass()) {
                    if (char === "-") {
                        next_char("-");
                        if (!subklass()) {
                            return stop_at(
                                "unexpected_a",
                                line,
                                column - 1,
                                "-"
                            );
                        }
                    }
                    return ranges();
                }
            }

            function klass() {

// Match a class.

                next_char("[");
                if (char === "^") {
                    next_char("^");
                }
                (function classy() {
                    ranges();
                    if (char !== "]" && char !== "") {
                        warn_at(
                            "expected_a_before_b",
                            line,
                            column,
                            "\\",
                            char
                        );
                        next_char();
                        return classy();
                    }
                }());
                next_char("]");
            }

            function choice() {

                function group() {

// Match a group that starts with left paren.

                    next_char("(");
                    if (char === "?") {
                        next_char("?");
                        switch (char) {
                        case ":":
                        case "=":
                        case "!":
                            next_char();
                            break;
                        default:
                            next_char(":");
                        }
                    } else if (char === ":") {
                        warn_at("expected_a_before_b", line, column, "?", ":");
                    }
                    choice();
                    next_char(")");
                }

                function factor() {
                    switch (char) {
                    case "[":
                        klass();
                        return true;
                    case "\\":
                        escape("BbDdSsWw^${}[]():=!.-|*+?");
                        return true;
                    case "(":
                        group();
                        return true;
                    case "?":
                    case "+":
                    case "*":
                    case "}":
                    case "{":
                        warn_at("expected_a_before_b", line, column - 1, "\\", char);
                        break;
                    case "/":
                    case "|":
                    case "]":
                    case ")":
                    case "":
                        return false;
                    case "`":
                        if (mega_mode) {
                            warn_at("unexpected_a", line, column - 1, "`");
                        }
                        break;
                    case " ":
                        warn_at(
                            "expected_a_b",
                            line,
                            column - 1,
                            "\\s",
                            " "
                        );
                        break;
                    case "$":
                        if (source_line.charAt(0) !== "/") {
                            multi_mode = true;
                        }
                        break;
                    case "^":
                        if (snippet !== "^") {
                            multi_mode = true;
                        }
                        break;
                    }
                    next_char();
                    return true;
                }

                function sequence(follow) {
                    if (factor()) {
                        quantifier();
                        return sequence(true);
                    }
                    if (!follow) {
                        warn_at("expected_regexp_factor_a", line, column, char);
                    }
                }

// Match a choice (a sequence that can be followed by | and another choice).

                sequence();
                if (char === "|") {
                    next_char("|");
                    return choice();
                }
            }

// Scan the regexp literal. Give a warning if the first character is = because
// /= looks like a division assignment operator.

            snippet = "";
            next_char();
            if (char === "=") {
                warn_at("expected_a_before_b", line, column, "\\", "=");
            }
            choice();

// Make sure there is a closing slash.

            snip();
            value = snippet;
            next_char("/");

// Process dangling flag letters.

            var allowed = {
                g: true,
                i: true,
                m: true,
                u: 6,
                y: 6
            };
            var flag = empty();
            (function make_flag() {
                if (is_letter(char)) {
                    switch (allowed[char]) {
                    case true:
                        break;
                    case 6:
                        if (!option.es6) {
                            warn_at("es6", line, column, char);
                        }
                        break;
                    default:
                        warn_at("unexpected_a", line, column, char);
                    }
                    allowed[char] = false;
                    flag[char] = true;
                    next_char();
                    return make_flag();
                }
            }());
            back_char();
            if (char === "/" || char === "*") {
                return stop_at("unexpected_a", line, from, char);
            }
            result = make("(regexp)", char);
            result.flag = flag;
            result.value = value;
            if (multi_mode && !flag.m) {
                warn_at("missing_m", line, column);
            }
            return result;
        }

        function string(quote) {

// Make a string token.

            var the_token;
            snippet = "";
            next_char();

            return (function next() {
                switch (char) {
                case quote:
                    snip();
                    the_token = make("(string)", snippet);
                    the_token.quote = quote;
                    return the_token;
                case "\\":
                    escape(quote);
                    break;
                case "":
                    return stop_at("unclosed_string", line, column);
                case "`":
                    if (mega_mode) {
                        warn_at("unexpected_a", line, column, "`");
                    }
                    next_char("`");
                    break;
                default:
                    next_char();
                }
                return next();
            }());
        }

        function frack() {
            if (char === ".") {
                some_digits(rx_digits);
                next_char();
            }
            if (char === "E" || char === "e") {
                next_char();
                if (char !== "+" && char !== "-") {
                    back_char();
                }
                some_digits(rx_digits);
                next_char();
            }
        }

        function number() {
            if (snippet === "0") {
                switch (next_char()) {
                case ".":
                    frack();
                    break;
                case "b":
                    some_digits(rx_bits);
                    next_char();
                    break;
                case "o":
                    some_digits(rx_octals);
                    next_char();
                    break;
                case "x":
                    some_digits(rx_hexs);
                    next_char();
                    break;
                }
            } else {
                next_char();
                frack();
            }

// If the next character after a number is a digit or letter, then something
// unexpected is going on.

            if (
                (char >= "0" && char <= "9") ||
                (char >= "a" && char <= "z") ||
                (char >= "A" && char <= "Z")
            ) {
                return stop_at(
                    "unexpected_a_after_b",
                    line,
                    column - 1,
                    snippet.slice(-1),
                    snippet.slice(0, -1)
                );
            }
            back_char();
            return make("(number)", snippet);
        }

        function lex() {
            var array;
            var i = 0;
            var j = 0;
            var last;
            var result;
            var the_token;
            if (!source_line) {
                source_line = next_line();
                from = 0;
                return (source_line === undefined)
                    ? (mega_mode)
                        ? stop_at("unclosed_mega", mega_line, mega_from)
                        : make("(end)")
                    : lex();
            }
            from = column;
            result = source_line.match(rx_token);

// result[1] token
// result[2] whitespace
// result[3] identifier
// result[4] number
// result[5] rest

            if (!result) {
                return stop_at(
                    "unexpected_char_a",
                    line,
                    column,
                    source_line.charAt(0)
                );
            }

            snippet = result[1];
            column += snippet.length;
            source_line = result[5];

// Whitespace was matched. Call lex again to get more.

            if (result[2]) {
                return lex();
            }

// The token is an identifier.

            if (result[3]) {
                return make(snippet, undefined, true);
            }

// The token is a number.

            if (result[4]) {
                return number(snippet);
            }

// The token is something miscellaneous.

            switch (snippet) {

// The token is a single or double quote string.

            case "\"":
                return string(snippet);

            case "'":
                if (!option.single) {
                    warn_at("use_double", line, column);
                }
                return string(snippet);

// The token is a megastring. We don't allow any kind of mega nesting.

            case "`":
                if (mega_mode) {
                    return stop_at("expected_a_b", line, column, "}", "`");
                }
                snippet = "";
                mega_from = from;
                mega_line = line;
                mega_mode = true;

// Parsing a mega literal is tricky. First make a ` token.

                make("`");
                from += 1;

// Then loop, building up a string, possibly from many lines, until seeing
// the end of file, a closing `, or a ${ indicting an expression within the
// string.

                (function part() {
                    var at = source_line.search(rx_mega);

// If neither ` nor ${ is seen, then the whole line joins the snippet.

                    if (at < 0) {
                        snippet += source_line + "\n";
                        return (next_line() === undefined)
                            ? stop_at("unclosed_mega", mega_line, mega_from)
                            : part();
                    }

// if either ` or ${ was found, then the preceding joins the snippet to become
// a string token.

                    snippet += source_line.slice(0, at);
                    column += at;
                    source_line = source_line.slice(at);
                    if (source_line.charAt(0) === "\\") {
                        stop_at("escape_mega", line, at);
                    }
                    make("(string)", snippet).quote = "`";
                    snippet = "";

// If ${, then make tokens that will become part of an expression until
// a } token is made.

                    if (source_line.charAt(0) === "$") {
                        column += 2;
                        make("${");
                        source_line = source_line.slice(2);
                        (function expr() {
                            var id = lex().id;
                            if (id === "{") {
                                return stop_at(
                                    "expected_a_b",
                                    line,
                                    column,
                                    "}",
                                    "{"
                                );
                            }
                            if (id !== "}") {
                                return expr();
                            }
                        }());
                        return part();
                    }
                }());
                source_line = source_line.slice(1);
                column += 1;
                mega_mode = false;
                return make("`");

// The token is a // comment.

            case "//":
                snippet = source_line;
                source_line = "";
                the_token = comment(snippet);
                if (mega_mode) {
                    warn("unexpected_comment", the_token, "`");
                }
                return the_token;

// The token is a /* comment.

            case "/*":
                array = [];
                if (source_line.charAt(0) === "/") {
                    warn_at("unexpected_a", line, column + i, "/");
                }
                (function next() {
                    if (source_line > "") {
                        i = source_line.search(rx_star_slash);
                        if (i >= 0) {
                            return;
                        }
                        j = source_line.search(rx_slash_star);
                        if (j >= 0) {
                            warn_at("nested_comment", line, column + j);
                        }
                    }
                    array.push(source_line);
                    source_line = next_line();
                    if (source_line === undefined) {
                        return stop_at("unclosed_comment", line, column);
                    }
                    return next();
                }());
                snippet = source_line.slice(0, i);
                j = snippet.search(rx_slash_star_or_slash);
                if (j >= 0) {
                    warn_at("nested_comment", line, column + j);
                }
                array.push(snippet);
                column += i + 2;
                source_line = source_line.slice(i + 2);
                return comment(array);

// The token is a slash.

            case "/":

// The / can be a division operator or the beginning of a regular expression
// literal. It is not possible to know which without doing a complete parse.
// We want to complete the tokenization before we begin to parse, so we will
// estimate. This estimator can fail in some cases. For example, it cannot
// know if "}" is ending a block or ending an object literal, so it can
// behave incorrectly in that case; it is not meaningful to divide an
// object, so it is likely that we can get away with it. We avoided the worst
// cases by eliminating automatic semicolon insertion.

                if (prior.identifier) {
                    if (!prior.dot) {
                        switch (prior.id) {
                        case "return":
                            return regexp();
                        case "(begin)":
                        case "case":
                        case "delete":
                        case "in":
                        case "instanceof":
                        case "new":
                        case "typeof":
                        case "void":
                        case "yield":
                            the_token = regexp();
                            return stop("unexpected_a", the_token);
                        }
                    }
                } else {
                    last = prior.id.charAt(prior.id.length - 1);
                    if ("(,=:?[".indexOf(last) >= 0) {
                        return regexp();
                    }
                    if ("!&|{};~+-*%/^<>".indexOf(last) >= 0) {
                        the_token = regexp();
                        warn("wrap_regexp", the_token);
                        return the_token;
                    }
                }
                if (source_line.charAt(0) === "/") {
                    column += 1;
                    source_line = source_line.slice(1);
                    snippet = "/=";
                    warn_at("unexpected_a", line, column, "/=");
                }
                break;
            }
            return make(snippet);
        }

        first = lex();
        json_mode = first.id === "{" || first.id === "[";

// This is the only loop in JSLint. It will turn into a recursive call to lex
// when ES6 has been finished and widely deployed and adopted.

        while (true) {
            if (lex().id === "(end)") {
                break;
            }
        }
    }

// Parsing:

// Parsing weaves the tokens into an abstract syntax tree. During that process,
// a token may be given any of these properties:

//      arity       string
//      label       identifier
//      name        identifier
//      expression  expressions
//      block       statements
//      else        statements (else, default, catch)

// Specialized tokens may have additional properties.

    function survey(name) {
        var id = name.id;

// Tally the property name. If it is a string, only tally strings that conform
// to the identifier rules.

        if (id === "(string)") {
            id = name.value;
            if (!rx_identifier.test(id)) {
                return id;
            }
        } else if (id === "`") {
            if (name.value.length === 1) {
                id = name.value[0].value;
                if (!rx_identifier.test(id)) {
                    return id;
                }
            }
        } else if (!name.identifier) {
            return stop("expected_identifier_a", name);
        }

// If we have seen this name before, increment its count.

        if (typeof property[id] === "number") {
            property[id] += 1;

// If this is the first time seeing this property name, and if there is a
// tenure list, then it must be on the list. Otherwise, it must conform to
// the rules for good property names.

        } else {
            if (tenure !== undefined) {
                if (tenure[id] !== true) {
                    warn("unregistered_property_a", name);
                }
            } else {
                if (name.identifier && rx_bad_property.test(id)) {
                    warn("bad_property_a", name);
                }
            }
            property[id] = 1;
        }
        return id;
    }

    function dispense() {

// Deliver the next token, skipping the comments.

        var cadet = tokens[token_nr];
        token_nr += 1;
        if (cadet.id === "(comment)") {
            if (json_mode) {
                warn("unexpected_a", cadet);
            }
            return dispense();
        } else {
            return cadet;
        }
    }

    function lookahead() {

// Look ahead one token without advancing.

        var old_token_nr = token_nr;
        var cadet = dispense(true);
        token_nr = old_token_nr;
        return cadet;
    }

    function advance(id, match) {

// Produce the next token.

// Attempt to give helpful names to anonymous functions.

        if (token.identifier && token.id !== "function") {
            anon = token.id;
        } else if (token.id === "(string)" && rx_identifier.test(token.value)) {
            anon = token.value;
        }

// Attempt to match next_token with an expected id.

        if (id !== undefined && next_token.id !== id) {
            return (match === undefined)
                ? stop("expected_a_b", next_token, id, artifact())
                : stop(
                    "expected_a_b_from_c_d",
                    next_token,
                    id,
                    artifact(match),
                    artifact_line(match),
                    artifact(next_token)
                );
        }

// Promote the tokens, skipping comments.

        token = next_token;
        next_token = dispense();
        if (next_token.id === "(end)") {
            token_nr -= 1;
        }
    }

// Parsing of JSON is simple:

    function json_value() {
        var negative;

        function json_object() {
            var brace = next_token;
            var object = empty();
            var properties = [];
            brace.expression = properties;
            advance("{");
            if (next_token.id !== "}") {
                (function next() {
                    var name;
                    var value;
                    if (next_token.quote !== "\"") {
                        warn("unexpected_a", next_token, next_token.quote);
                    }
                    name = next_token;
                    advance("(string)");
                    if (object[token.value] !== undefined) {
                        warn("duplicate_a", token);
                    } else if (token.value === "__proto__") {
                        warn("bad_property_a", token);
                    } else {
                        object[token.value] = token;
                    }
                    advance(":");
                    value = json_value();
                    value.label = name;
                    properties.push(value);
                    if (next_token.id === ",") {
                        advance(",");
                        return next();
                    }
                }());
            }
            advance("}", brace);
            return brace;
        }

        function json_array() {
            var bracket = next_token;
            var elements = [];
            bracket.expression = elements;
            advance("[");
            if (next_token.id !== "]") {
                (function next() {
                    elements.push(json_value());
                    if (next_token.id === ",") {
                        advance(",");
                        return next();
                    }
                }());
            }
            advance("]", bracket);
            return bracket;
        }

        switch (next_token.id) {
        case "{":
            return json_object();
        case "[":
            return json_array();
        case "true":
        case "false":
        case "null":
            advance();
            return token;
        case "(number)":
            if (!rx_JSON_number.test(next_token.value)) {
                warn("unexpected_a");
            }
            advance();
            return token;
        case "(string)":
            if (next_token.quote !== "\"") {
                warn("unexpected_a", next_token, next_token.quote);
            }
            advance();
            return token;
        case "-":
            negative = next_token;
            negative.arity = "unary";
            advance("-");
            advance("(number)");
            negative.expression = token;
            return negative;
        default:
            stop("unexpected_a");
        }
    }

// Now we parse JavaScript.

    function enroll(name, role, readonly) {

// Enroll a name into the current function context. The role can be exception,
// function, label, parameter, or variable. We look for variable redefinition
// because it causes confusion.

        var id = name.id;

// Reserved words may not be enrolled.

        if (syntax[id] !== undefined && id !== "ignore") {
            warn("reserved_a", name);
        } else {

// Has the name been enrolled in this context?

            var earlier = functionage.context[id];
            if (earlier) {
                warn(
                    "redefinition_a_b",
                    name,
                    name.id,
                    earlier.line + fudge
                );

// Has the name been enrolled in an outer context?

            } else {
                stack.forEach(function (value) {
                    var item = value.context[id];
                    if (item !== undefined) {
                        earlier = item;
                    }
                });
                if (earlier) {
                    if (id === "ignore") {
                        if (earlier.role === "variable") {
                            warn("unexpected_a", name);
                        }
                    } else {
                        if ((
                            role !== "exception" ||
                            earlier.role !== "exception"
                        ) && role !== "parameter") {
                            warn(
                                "redefinition_a_b",
                                name,
                                name.id,
                                earlier.line + fudge
                            );
                        }
                    }
                }

// Enroll it.

                functionage.context[id] = name;
                name.dead = true;
                name.function = functionage;
                name.init = false;
                name.role = role;
                name.used = 0;
                name.writable = !readonly;
            }
        }
    }

    function expression(rbp, initial) {

// This is the heart of the Pratt parser. I retained Pratt's nomenclature.
// They are elements of the parsing method called Top Down Operator Precedence.

// nud     Null denotation
// led     Left denotation
// lbp     Left binding power
// rbp     Right binding power

// It processes a nud (variable, constant, prefix operator). It will then
// process leds (infix operators) until the bind powers cause it to stop. It
// returns the expression's parse tree.

        var left;
        var the_symbol;

// Statements will have already advanced, so advance now only if the token is
// not the first of a statement,

        if (!initial) {
            advance();
        }
        the_symbol = syntax[token.id];
        if (the_symbol !== undefined && the_symbol.nud !== undefined) {
            left = the_symbol.nud();
        } else if (token.identifier) {
            left = token;
            left.arity = "variable";
        } else {
            return stop("unexpected_a", token);
        }
        (function right() {
            the_symbol = syntax[next_token.id];
            if (
                the_symbol !== undefined &&
                the_symbol.led !== undefined &&
                rbp < the_symbol.lbp
            ) {
                advance();
                left = the_symbol.led(left);
                return right();
            }
        }());
        return left;
    }

    function condition() {

// Parse the condition part of a do, if, while.

        var the_paren = next_token;
        var the_value;
        the_paren.free = true;
        advance("(");
        the_value = expression(0);
        advance(")");
        if (the_value.wrapped === true) {
            warn("unexpected_a", the_paren);
        }
        switch (the_value.id) {
        case "?":
        case "~":
        case "&":
        case "|":
        case "^":
        case "<<":
        case ">>":
        case ">>>":
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
        case "typeof":
        case "(number)":
        case "(string)":
            warn("unexpected_a", the_value);
            break;
        }
        return the_value;
    }

    function is_weird(thing) {
        return (
            thing.id === "(regexp)" ||
            thing.id === "{" ||
            thing.id === "=>" ||
            thing.id === "function" ||
            (thing.id === "[" && thing.arity === "unary")
        );
    }

    function are_similar(a, b) {
        if (a === b) {
            return true;
        }
        if (Array.isArray(a)) {
            return (
                Array.isArray(b) &&
                a.length === b.length &&
                a.every(function (value, index) {
                    return are_similar(value, b[index]);
                })
            );
        }
        if (Array.isArray(b)) {
            return false;
        }
        if (a.id === "(number)" && b.id === "(number)") {
            return a.value === b.value;
        }
        var a_string;
        var b_string;
        if (a.id === "(string)") {
            a_string = a.value;
        } else if (a.id === "`" && a.constant) {
            a_string = a.value[0];
        }
        if (b.id === "(string)") {
            b_string = b.value;
        } else if (b.id === "`" && b.constant) {
            b_string = b.value[0];
        }
        if (typeof a_string === "string") {
            return a_string === b_string;
        }
        if (is_weird(a) || is_weird(b)) {
            return false;
        }
        if (a.arity === b.arity && a.id === b.id) {
            if (a.id === ".") {
                return are_similar(a.expression, b.expression) &&
                        are_similar(a.name, b.name);
            }
            switch (a.arity) {
            case "unary":
                return are_similar(a.expression, b.expression);
            case "binary":
                return (
                    a.id !== "(" &&
                    are_similar(a.expression[0], b.expression[0]) &&
                    are_similar(a.expression[1], b.expression[1])
                );
            case "ternary":
                return (
                    are_similar(a.expression[0], b.expression[0]) &&
                    are_similar(a.expression[1], b.expression[1]) &&
                    are_similar(a.expression[2], b.expression[2])
                );
            case "function":
            case "regexp":
                return false;
            default:
                return true;
            }
        }
        return false;
    }

    function semicolon() {

// Try to match a semicolon.

        if (next_token.id === ";") {
            advance(";");
        } else {
            warn_at(
                "expected_a_b",
                token.line,
                token.thru,
                ";",
                artifact(next_token)
            );
        }
        anon = "anonymous";
    }

    function statement() {

// Parse a statement. Any statement may have a label, but only four statements
// have use for one. A statement can be one of the standard statements, or
// an assignment expression, or an invocation expression.

        var first;
        var the_label;
        var the_statement;
        var the_symbol;
        advance();
        if (token.identifier && next_token.id === ":") {
            the_label = token;
            if (the_label.id === "ignore") {
                warn("unexpected_a", the_label);
            }
            advance(":");
            switch (next_token.id) {
            case "do":
            case "for":
            case "switch":
            case "while":
                enroll(the_label, "label", true);
                the_label.init = true;
                the_label.dead = false;
                the_statement = statement();
                the_statement.label = the_label;
                the_statement.statement = true;
                return the_statement;
            default:
                advance();
                warn("unexpected_label_a", the_label);
            }
        }

// Parse the statement.

        first = token;
        first.statement = true;
        the_symbol = syntax[first.id];
        if (the_symbol !== undefined && the_symbol.fud !== undefined) {
            the_symbol.disrupt = false;
            the_symbol.statement = true;
            the_statement = the_symbol.fud();
        } else {

// It is an expression statement.

            the_statement = expression(0, true);
            if (the_statement.wrapped && the_statement.id !== "(") {
                warn("unexpected_a", first);
            }
            semicolon();
        }
        if (the_label !== undefined) {
            the_label.dead = true;
        }
        return the_statement;
    }

    function statements() {

// Parse a list of statements. Give a warning if an unreachable statement
// follows a disruptive statement.

        var array = [];
        (function next(disrupt) {
            var a_statement;
            switch (next_token.id) {
            case "}":
            case "case":
            case "default":
            case "else":
            case "(end)":
                break;
            default:
                a_statement = statement();
                array.push(a_statement);
                if (disrupt) {
                    warn("unreachable_a", a_statement);
                }
                return next(a_statement.disrupt);
            }
        }(false));
        return array;
    }

    function not_top_level(thing) {

// Some features should not be at the outermost level.

        if (functionage === global) {
            warn("unexpected_at_top_level_a", thing);
        }
    }

    function top_level_only(the_thing) {

// Some features must be at the most outermost level.

        if (blockage !== global) {
            warn("misplaced_a", the_thing);
        }
    }

    function block(special) {

// Parse a block, a sequence of statements wrapped in braces.
//  special "body"      The block is a function body.
//          "ignore"    No warning on an empty block.
//          "naked"     No advance.
//          undefined   An ordinary block.

        var stmts;
        var the_block;
        if (special !== "naked") {
            advance("{");
        }
        the_block = token;
        the_block.arity = "statement";
        the_block.body = special === "body";

// All top level function bodies should include the "use strict" pragma unless
// the whole file is strict or the file is a module or the function parameters
// use es6 syntax.

        if (
            special === "body" &&
            stack.length === 1 &&
            next_token.value === "use strict"
        ) {
            the_block.strict = next_token;
            next_token.statement = true;
            advance("(string)");
            advance(";");
        }
        stmts = statements();
        the_block.block = stmts;
        if (stmts.length === 0) {
            if (!option.devel && special !== "ignore") {
                warn("empty_block", the_block);
            }
            the_block.disrupt = false;
        } else {
            the_block.disrupt = stmts[stmts.length - 1].disrupt;
        }
        advance("}");
        return the_block;
    }

    function mutation_check(the_thing) {

// The only expressions that may be assigned to are
//      e.b
//      e[b]
//      v

        if (
            the_thing.id !== "." &&
            the_thing.arity !== "variable" &&
            (the_thing.id !== "[" || the_thing.arity !== "binary")
        ) {
            warn("bad_assignment_a", the_thing);
            return false;
        }
        return true;
    }

    function left_check(left, right) {

// Warn if the left is not one of these:
//      e.b
//      e[b]
//      e()
//      identifier

        var id = left.id;
        if (
            !left.identifier &&
            (
                left.arity !== "binary" ||
                (id !== "." && id !== "(" && id !== "[")
            )
        ) {
            warn("unexpected_a", right);
            return false;
        }
        return true;
    }

// These functions are used to specify the grammar of our language:

    function symbol(id, bp) {

// Make a symbol if it does not already exist in the language's syntax.

        var the_symbol = syntax[id];
        if (the_symbol === undefined) {
            the_symbol = empty();
            the_symbol.id = id;
            the_symbol.lbp = bp || 0;
            syntax[id] = the_symbol;
        }
        return the_symbol;
    }

    function assignment(id) {

// Make an assignment operator. The one true assignment is different because
// its left side, when it is a variable, is not treated as an expression.
// That case is special because that is when a variable gets initialized. The
// other assignment operators can modify, but they cannot initialize.

        var the_symbol = symbol(id, 20);
        the_symbol.led = function (left) {
            var the_token = token;
            var right;
            the_token.arity = "assignment";
            right = expression(20 - 1);
            if (id === "=" && left.arity === "variable") {
                the_token.names = left;
                the_token.expression = right;
            } else {
                the_token.expression = [left, right];
            }
            switch (right.arity) {
            case "assignment":
            case "pre":
            case "post":
                warn("unexpected_a", right);
                break;
            }
            if (
                option.es6 &&
                left.arity === "unary" &&
                (left.id === "[" || left.id === "{")
            ) {
                warn("expected_a_before_b", left, "const", left.id);
            } else {
                mutation_check(left);
            }
            return the_token;
        };
        return the_symbol;
    }

    function constant(id, type, value) {

// Make a constant symbol.

        var the_symbol = symbol(id);
        the_symbol.constant = true;
        the_symbol.nud = (typeof value === "function")
            ? value
            : function () {
                token.constant = true;
                if (value !== undefined) {
                    token.value = value;
                }
                return token;
            };
        the_symbol.type = type;
        the_symbol.value = value;
        return the_symbol;
    }

    function infix(id, bp, f) {

// Make an infix operator.

        var the_symbol = symbol(id, bp);
        the_symbol.led = function (left) {
            var the_token = token;
            the_token.arity = "binary";
            if (f !== undefined) {
                return f(left);
            }
            the_token.expression = [left, expression(bp)];
            return the_token;
        };
        return the_symbol;
    }

    function post(id) {

// Make one of the post operators.

        var the_symbol = symbol(id, 150);
        the_symbol.led = function (left) {
            token.expression = left;
            token.arity = "post";
            mutation_check(token.expression);
            return token;
        };
        return the_symbol;
    }

    function pre(id) {

// Make one of the pre operators.

        var the_symbol = symbol(id);
        the_symbol.nud = function () {
            var the_token = token;
            the_token.arity = "pre";
            the_token.expression = expression(150);
            mutation_check(the_token.expression);
            return the_token;
        };
        return the_symbol;
    }

    function prefix(id, f) {

// Make a prefix operator.

        var the_symbol = symbol(id);
        the_symbol.nud = function () {
            var the_token = token;
            the_token.arity = "unary";
            if (typeof f === "function") {
                return f();
            }
            the_token.expression = expression(150);
            return the_token;
        };
        return the_symbol;
    }

    function stmt(id, f) {

// Make a statement.

        var the_symbol = symbol(id);
        the_symbol.fud = function () {
            token.arity = "statement";
            return f();
        };
        return the_symbol;
    }

    function ternary(id1, id2) {

// Make a ternary operator.

        var the_symbol = symbol(id1, 30);
        the_symbol.led = function (left) {
            var the_token = token;
            var second = expression(20);
            advance(id2);
            token.arity = "ternary";
            the_token.arity = "ternary";
            the_token.expression = [left, second, expression(10)];
            return the_token;
        };
        return the_symbol;
    }

// Begin defining the language.

    syntax = empty();

    symbol("}");
    symbol(")");
    symbol("]");
    symbol(",");
    symbol(";");
    symbol(":");
    symbol("*/");
    symbol("await");
    symbol("case");
    symbol("catch");
    symbol("class");
    symbol("default");
    symbol("else");
    symbol("enum");
    symbol("finally");
    symbol("implements");
    symbol("interface");
    symbol("package");
    symbol("private");
    symbol("protected");
    symbol("public");
    symbol("static");
    symbol("super");
    symbol("void");
    symbol("yield");

    constant("(number)", "number");
    constant("(regexp)", "regexp");
    constant("(string)", "string");
    constant("arguments", "object", function () {
        if (option.es6) {
            warn("unexpected_a", token);
        }
        return token;
    });
    constant("eval", "function", function () {
        if (!option.eval) {
            warn("unexpected_a", token);
        } else if (next_token.id !== "(") {
            warn("expected_a_before_b", next_token, "(", artifact());
        }
        return token;
    });
    constant("false", "boolean", false);
    constant("Function", "function", function () {
        if (!option.eval) {
            warn("unexpected_a", token);
        } else if (next_token.id !== "(") {
            warn("expected_a_before_b", next_token, "(", artifact());
        }
        return token;
    });
    constant("ignore", "undefined", function () {
        warn("unexpected_a", token);
        return token;
    });
    constant("Infinity", "number", Infinity);
    constant("isNaN", "function", function () {
        if (option.es6) {
            warn("expected_a_b", token, "Number.isNaN", "isNaN");
        }
        return token;
    });
    constant("NaN", "number", NaN);
    constant("null", "null", null);
    constant("this", "object", function () {
        if (!option.this) {
            warn("unexpected_a", token);
        }
        return token;
    });
    constant("true", "boolean", true);
    constant("undefined", "undefined");

    assignment("=");
    assignment("+=");
    assignment("-=");
    assignment("*=");
    assignment("/=");
    assignment("%=");
    assignment("&=");
    assignment("|=");
    assignment("^=");
    assignment("<<=");
    assignment(">>=");
    assignment(">>>=");

    infix("||", 40);
    infix("&&", 50);
    infix("|", 70);
    infix("^", 80);
    infix("&", 90);
    infix("==", 100);
    infix("===", 100);
    infix("!=", 100);
    infix("!==", 100);
    infix("<", 110);
    infix(">", 110);
    infix("<=", 110);
    infix(">=", 110);
    infix("in", 110);
    infix("instanceof", 110);
    infix("<<", 120);
    infix(">>", 120);
    infix(">>>", 120);
    infix("+", 130);
    infix("-", 130);
    infix("*", 140);
    infix("/", 140);
    infix("%", 140);
    infix("(", 160, function (left) {
        var the_paren = token;
        var the_argument;
        if (left.id !== "function") {
            left_check(left, the_paren);
        }
        if (functionage.arity === "statement" && left.identifier) {
            functionage.name.calls[left.id] = left;
        }
        the_paren.expression = [left];
        if (next_token.id !== ")") {
            (function next() {
                var ellipsis;
                if (next_token.id === "...") {
                    if (!option.es6) {
                        warn("es6");
                    }
                    ellipsis = true;
                    advance("...");
                }
                the_argument = expression(10);
                if (ellipsis) {
                    the_argument.ellipsis = true;
                }
                the_paren.expression.push(the_argument);
                if (next_token.id === ",") {
                    advance(",");
                    return next();
                }
            }());
        }
        advance(")", the_paren);
        if (the_paren.expression.length === 2) {
            the_paren.free = true;
            if (the_argument.wrapped === true) {
                warn("unexpected_a", the_paren);
            }
            if (the_argument.id === "(") {
                the_argument.wrapped = true;
            }
        } else {
            the_paren.free = false;
        }
        return the_paren;
    });
    infix(".", 170, function (left) {
        var the_token = token;
        var name = next_token;
        if (
            (left.id !== "(string)" || name.id !== "indexOf") &&
            (left.id !== "[" || (
                name.id !== "concat" && name.id !== "forEach"
            )) &&
            (left.id !== "+" || name.id !== "slice") &&
            (left.id !== "(regexp)" || (
                name.id !== "exec" && name.id !== "test"
            ))
        ) {
            left_check(left, the_token);
        }
        if (!name.identifier) {
            stop("expected_identifier_a");
        }
        advance();
        survey(name);

// The property name is not an expression.

        the_token.name = name;
        the_token.expression = left;
        return the_token;
    });
    infix("[", 170, function (left) {
        var the_token = token;
        var the_subscript = expression(0);
        if (the_subscript.id === "(string)" || the_subscript.id === "`") {
            var name = survey(the_subscript);
            if (rx_identifier.test(name)) {
                warn("subscript_a", the_subscript, name);
            }
        }
        left_check(left, the_token);
        the_token.expression = [left, the_subscript];
        advance("]");
        return the_token;
    });
    infix("=>", 170, function (left) {
        return stop("wrap_parameter", left);
    });

    function do_tick() {
        var the_tick = token;
        if (!option.es6) {
            warn("es6", the_tick);
        }
        the_tick.value = [];
        the_tick.expression = [];
        if (next_token.id !== "`") {
            (function part() {
                advance("(string)");
                the_tick.value.push(token);
                if (next_token.id === "${") {
                    advance("${");
                    the_tick.expression.push(expression(0));
                    advance("}");
                    return part();
                }
            }());
        }
        advance("`");
        return the_tick;
    }

    infix("`", 160, function (left) {
        var the_tick = do_tick();
        left_check(left, the_tick);
        the_tick.expression = [left].concat(the_tick.expression);
        return the_tick;
    });

    post("++");
    post("--");
    pre("++");
    pre("--");

    prefix("+");
    prefix("-");
    prefix("~");
    prefix("!");
    prefix("!!");
    prefix("[", function () {
        var the_token = token;
        the_token.expression = [];
        if (next_token.id !== "]") {
            (function next() {
                var element;
                var ellipsis = false;
                if (next_token.id === "...") {
                    ellipsis = true;
                    if (!option.es6) {
                        warn("es6");
                    }
                    advance("...");
                }
                element = expression(10);
                if (ellipsis) {
                    element.ellipsis = true;
                }
                the_token.expression.push(element);
                if (next_token.id === ",") {
                    advance(",");
                    return next();
                }
            }());
        }
        advance("]");
        return the_token;
    });
    prefix("/=", function () {
        stop("expected_a_b", token, "/\\=", "/=");
    });
    prefix("=>", function () {
        return stop("expected_a_before_b", token, "()", "=>");
    });
    prefix("new", function () {
        var the_new = token;
        var right = expression(160);
        if (next_token.id !== "(") {
            warn("expected_a_before_b", next_token, "()", artifact(next_token));
        }
        the_new.expression = right;
        return the_new;
    });
    prefix("typeof");
    prefix("void", function () {
        var the_void = token;
        warn("unexpected_a", the_void);
        the_void.expression = expression(0);
        return the_void;
    });

    function parameter_list() {
        var complex = false;
        var list = [];
        var optional;
        var signature = ["("];
        if (next_token.id !== ")" && next_token.id !== "(end)") {
            (function parameter() {
                var ellipsis = false;
                var param;
                if (next_token.id === "{") {
                    complex = true;
                    if (!option.es6) {
                        warn("es6");
                    } else if (optional !== undefined) {
                        warn(
                            "required_a_optional_b",
                            next_token,
                            next_token.id,
                            optional.id
                        );
                    }
                    param = next_token;
                    param.names = [];
                    advance("{");
                    signature.push("{");
                    (function subparameter() {
                        var subparam = next_token;
                        if (!subparam.identifier) {
                            return stop("expected_identifier_a");
                        }
                        survey(subparam);
                        advance();
                        signature.push(subparam.id);
                        if (next_token.id === ":") {
                            advance(":");
                            advance();
                            token.label = subparam;
                            subparam = token;
                            if (!subparam.identifier) {
                                return stop("expected_identifier_a");
                            }
                        }
                        param.names.push(subparam);
                        if (next_token.id === ",") {
                            advance(",");
                            signature.push(", ");
                            return subparameter();
                        }
                    }());
                    list.push(param);
                    advance("}");
                    signature.push("}");
                    if (next_token.id === ",") {
                        advance(",");
                        signature.push(", ");
                        return parameter();
                    }
                } else if (next_token.id === "[") {
                    complex = true;
                    if (!option.es6) {
                        warn("es6");
                    } else if (optional !== undefined) {
                        warn(
                            "required_a_optional_b",
                            next_token,
                            next_token.id,
                            optional.id
                        );
                    }
                    param = next_token;
                    param.names = [];
                    advance("[");
                    signature.push("[]");
                    (function subparameter() {
                        var subparam = next_token;
                        if (!subparam.identifier) {
                            return stop("expected_identifier_a");
                        }
                        advance();
                        param.names.push(subparam);
                        if (next_token.id === ",") {
                            advance(",");
                            return subparameter();
                        }
                    }());
                    list.push(param);
                    advance("]");
                    if (next_token.id === ",") {
                        advance(",");
                        signature.push(", ");
                        return parameter();
                    }
                } else {
                    if (next_token.id === "...") {
                        complex = true;
                        if (!option.es6) {
                            warn("es6");
                        }
                        ellipsis = true;
                        signature.push("...");
                        advance("...");
                        if (optional !== undefined) {
                            warn(
                                "required_a_optional_b",
                                next_token,
                                next_token.id,
                                optional.id
                            );
                        }
                    }
                    if (!next_token.identifier) {
                        return stop("expected_identifier_a");
                    }
                    param = next_token;
                    list.push(param);
                    advance();
                    signature.push(param.id);
                    if (ellipsis) {
                        param.ellipsis = true;
                    } else {
                        if (next_token.id === "=") {
                            complex = true;
                            optional = param;
                            if (!option.es6) {
                                stop("unexpected_statement_a");
                            }
                            advance("=");
                            param.expression = expression(0);
                        } else {
                            if (optional !== undefined) {
                                warn("required_a_optional_b", param, param.id, optional.id);
                            }
                        }
                        if (next_token.id === ",") {
                            advance(",");
                            signature.push(", ");
                            return parameter();
                        }
                    }
                }
            }());
        }
        advance(")");
        signature.push(")");
        return [list, signature.join(""), complex];
    }

    function do_function(the_function) {
        var name;
        if (the_function === undefined) {
            the_function = token;

// A function statement must have a name that will be in the parent's scope.

            if (the_function.arity === "statement") {
                if (!next_token.identifier) {
                    return stop("expected_identifier_a", next_token);
                }
                name = next_token;
                enroll(name, "variable", true);
                the_function.name = name;
                name.init = true;
                name.calls = empty();
                advance();
            } else if (name === undefined) {

// A function expression may have an optional name.

                if (next_token.identifier) {
                    name = next_token;
                    the_function.name = name;
                    advance();
                } else {
                    the_function.name = anon;
                }
            }
        } else {
            name = the_function.name;
        }
        the_function.level = functionage.level + 1;
        if (mega_mode) {
            warn("unexpected_a", the_function);
        }

// Don't make functions in loops. It is inefficient, and it can lead to scoping
// errors.

        if (functionage.loop > 0) {
            warn("function_in_loop", the_function);
        }

// Give the function properties for storing its names and for observing the
// depth of loops and switches.

        the_function.context = empty();
        the_function.finally = 0;
        the_function.loop = 0;
        the_function.switch = 0;
        the_function.try = 0;

// Push the current function context and establish a new one.

        stack.push(functionage);
        functions.push(the_function);
        functionage = the_function;
        if (the_function.arity !== "statement" && typeof name === "object") {
            enroll(name, "function", true);
            name.dead = false;
            name.init = true;
            name.used = 1;
        }

// Parse the parameter list.

        advance("(");
        token.free = false;
        token.arity = "function";
        var pl = parameter_list();
        functionage.parameters = pl[0];
        functionage.signature = pl[1];
        functionage.complex = pl[2];
        functionage.parameters.forEach(function enroll_parameter(name) {
            if (name.identifier) {
                enroll(name, "parameter", false);
            } else {
                name.names.forEach(enroll_parameter);
            }
        });

// The function's body is a block.

        the_function.block = block("body");
        if (
            the_function.arity === "statement" &&
            next_token.line === token.line
        ) {
            return stop("unexpected_a", next_token);
        }
        if (next_token.id === "." || next_token.id === "[") {
            warn("unexpected_a");
        }

// Restore the previous context.

        functionage = stack.pop();
        return the_function;
    }

    prefix("function", do_function);

    function fart(pl) {
        if (next_token.id === ";") {
            stop("wrap_assignment", token);
        }
        advance("=>");
        var the_fart = token;
        the_fart.arity = "binary";
        the_fart.name = "=>";
        the_fart.level = functionage.level + 1;
        functions.push(the_fart);
        if (functionage.loop > 0) {
            warn("function_in_loop", the_fart);
        }

// Give the function properties storing its names and for observing the depth
// of loops and switches.

        the_fart.context = empty();
        the_fart.finally = 0;
        the_fart.loop = 0;
        the_fart.switch = 0;
        the_fart.try = 0;

// Push the current function context and establish a new one.

        stack.push(functionage);
        functionage = the_fart;
        the_fart.parameters = pl[0];
        the_fart.signature = pl[1];
        the_fart.complex = true;
        the_fart.parameters.forEach(function (name) {
            enroll(name, "parameter", true);
        });
        if (!option.es6) {
            warn("es6", the_fart);
        }
        if (next_token.id === "{") {
            warn("expected_a_b", the_fart, "function", "=>");
            the_fart.block = block("body");
        } else {
            the_fart.expression = expression(0);
        }
        functionage = stack.pop();
        return the_fart;
    }

    prefix("(", function () {
        var the_paren = token;
        var the_value;
        var cadet = lookahead().id;

// We can distinguish between a parameter list for => and a wrapped expression
// with one token of lookahead.

        if (
            next_token.id === ")" ||
            next_token.id === "..." ||
            (next_token.identifier && (cadet === "," || cadet === "="))
        ) {
            the_paren.free = false;
            return fart(parameter_list());
        }
        the_paren.free = true;
        the_value = expression(0);
        if (the_value.wrapped === true) {
            warn("unexpected_a", the_paren);
        }
        the_value.wrapped = true;
        advance(")", the_paren);
        if (next_token.id === "=>") {
            if (the_value.arity !== "variable") {
                if (the_value.id === "{" || the_value.id === "[") {
                    warn("expected_a_before_b", the_paren, "function", "(");
                    return stop("expected_a_b", next_token, "{", "=>");
                }
                return stop("expected_identifier_a", the_value);
            }
            the_paren.expression = [the_value];
            return fart([the_paren.expression, "(" + the_value.id + ")"]);
        }
        return the_value;
    });
    prefix("`", do_tick);
    prefix("{", function () {
        var the_brace = token;
        var seen = empty();
        the_brace.expression = [];
        if (next_token.id !== "}") {
            (function member() {
                var extra;
                var id;
                var name = next_token;
                var value;
                advance();
                if (
                    (name.id === "get" || name.id === "set") &&
                    next_token.identifier
                ) {
                    extra = name.id + " " + next_token.id;
                    name = next_token;
                    advance();
                    id = survey(name);
                    if (seen[extra] === true || seen[id] === true) {
                        warn("duplicate_a", name);
                    }
                    seen[id] = false;
                    seen[extra] = true;
                } else {
                    id = survey(name);
                    if (typeof seen[id] === "boolean") {
                        warn("duplicate_a", name);
                    }
                    seen[id] = true;
                }
                if (name.identifier) {
                    switch (next_token.id) {
                    case "}":
                    case ",":
                        if (!option.es6) {
                            warn("es6");
                        }
                        if (typeof extra === "string") {
                            advance("(");
                        }
                        value = expression(Infinity, true);
                        break;
                    case "(":
                        if (!option.es6 && typeof extra !== "string") {
                            warn("es6");
                        }
                        value = do_function({
                            arity: "unary",
                            from: name.from,
                            id: "function",
                            line: name.line,
                            name: (typeof extra === "string")
                                ? extra
                                : id,
                            thru: name.from
                        });
                        break;
                    default:
                        if (typeof extra === "string") {
                            advance("(");
                        }
                        advance(":");
                        value = expression(0);
                    }
                    value.label = name;
                    if (typeof extra === "string") {
                        value.extra = extra;
                    }
                    the_brace.expression.push(value);
                } else {
                    advance(":");
                    value = expression(0);
                    value.label = name;
                    the_brace.expression.push(value);
                }
                if (next_token.id === ",") {
                    advance(",");
                    return member();
                }
            }());
        }
        advance("}");
        return the_brace;
    });

    stmt(";", function () {
        warn("unexpected_a", token);
        return token;
    });
    stmt("{", function () {
        warn("naked_block", token);
        return block("naked");
    });
    stmt("break", function () {
        var the_break = token;
        var the_label;
        if (
            (functionage.loop < 1 && functionage.switch < 1) ||
            functionage.finally > 0
        ) {
            warn("unexpected_a", the_break);
        }
        the_break.disrupt = true;
        if (next_token.identifier && token.line === next_token.line) {
            the_label = functionage.context[next_token.id];
            if (
                the_label === undefined ||
                the_label.role !== "label" ||
                the_label.dead
            ) {
                warn((the_label !== undefined && the_label.dead)
                    ? "out_of_scope_a"
                    : "not_label_a");
            } else {
                the_label.used += 1;
            }
            the_break.label = next_token;
            advance();
        }
        advance(";");
        return the_break;
    });

    function do_var() {
        var the_statement = token;
        var is_const = the_statement.id === "const";
        the_statement.names = [];

// A program may use var or let, but not both, and let and const require
// option.es6.

        if (is_const) {
            if (!option.es6) {
                warn("es6", the_statement);
            }
        } else if (var_mode === undefined) {
            var_mode = the_statement.id;
            if (!option.es6 && var_mode !== "var") {
                warn("es6", the_statement);
            }
        } else if (the_statement.id !== var_mode) {
            warn(
                "expected_a_b",
                the_statement,
                var_mode,
                the_statement.id
            );
        }

// We don't expect to see variables created in switch statements.

        if (functionage.switch > 0) {
            warn("var_switch", the_statement);
        }
        if (functionage.loop > 0 && the_statement.id === "var") {
            warn("var_loop", the_statement);
        }
        (function next() {
            if (next_token.id === "{" && the_statement.id !== "var") {
                var the_brace = next_token;
                the_brace.names = [];
                advance("{");
                (function pair() {
                    if (!next_token.identifier) {
                        return stop("expected_identifier_a", next_token);
                    }
                    var name = next_token;
                    survey(name);
                    advance();
                    if (next_token.id === ":") {
                        advance(":");
                        if (!next_token.identifier) {
                            return stop("expected_identifier_a", next_token);
                        }
                        next_token.label = name;
                        the_brace.names.push(next_token);
                        enroll(next_token, "variable", is_const);
                        advance();
                    } else {
                        the_brace.names.push(name);
                        enroll(name, "variable", is_const);
                    }
                    if (next_token.id === ",") {
                        advance(",");
                        return pair();
                    }
                }());
                advance("}");
                advance("=");
                the_brace.expression = expression(0);
                the_statement.names.push(the_brace);
            } else if (next_token.id === "[" && the_statement.id !== "var") {
                var the_bracket = next_token;
                the_bracket.names = [];
                advance("[");
                (function element() {
                    var ellipsis;
                    if (next_token.id === "...") {
                        ellipsis = true;
                        advance("...");
                    }
                    if (!next_token.identifier) {
                        return stop("expected_identifier_a", next_token);
                    }
                    var name = next_token;
                    advance();
                    the_bracket.names.push(name);
                    enroll(name, "variable", the_statement.id === "const");
                    if (ellipsis) {
                        name.ellipsis = true;
                    } else if (next_token.id === ",") {
                        advance(",");
                        return element();
                    }
                }());
                advance("]");
                advance("=");
                the_bracket.expression = expression(0);
                the_statement.names.push(the_bracket);
            } else if (next_token.identifier) {
                var name = next_token;
                advance();
                if (name.id === "ignore") {
                    warn("unexpected_a", name);
                }
                enroll(name, "variable", is_const);
                if (next_token.id === "=" || is_const) {
                    advance("=");
                    name.expression = expression(0);
                    name.init = true;
                }
                the_statement.names.push(name);
            } else {
                return stop("expected_identifier_a", next_token);
            }
            if (next_token.id === ",") {
                if (!option.multivar) {
                    warn("expected_a_b", next_token, ";", ",");
                }
                advance(",");
                return next();
            }
        }());
        the_statement.open =
                the_statement.names.length > 1 &&
                the_statement.line !== the_statement.names[1].line;
        semicolon();
        return the_statement;
    }

    stmt("const", do_var);
    stmt("continue", function () {
        var the_continue = token;
        if (functionage.loop < 1 || functionage.finally > 0) {
            warn("unexpected_a", the_continue);
        }
        not_top_level(the_continue);
        the_continue.disrupt = true;
        warn("unexpected_a", the_continue);
        advance(";");
        return the_continue;
    });
    stmt("debugger", function () {
        var the_debug = token;
        if (!option.devel) {
            warn("unexpected_a", the_debug);
        }
        semicolon();
        return the_debug;
    });
    stmt("delete", function () {
        var the_token = token;
        var the_value = expression(0);
        if (
            (the_value.id !== "." && the_value.id !== "[") ||
            the_value.arity !== "binary"
        ) {
            stop("expected_a_b", the_value, ".", artifact(the_value));
        }
        the_token.expression = the_value;
        semicolon();
        return the_token;
    });
    stmt("do", function () {
        var the_do = token;
        not_top_level(the_do);
        functionage.loop += 1;
        the_do.block = block();
        advance("while");
        the_do.expression = condition();
        semicolon();
        if (the_do.block.disrupt === true) {
            warn("weird_loop", the_do);
        }
        functionage.loop -= 1;
        return the_do;
    });
    stmt("export", function () {
        var the_export = token;
        var the_id;
        var the_name;
        var the_thing;

        function export_id() {
            if (!next_token.identifier) {
                stop("expected_identifier_a");
            }
            the_id = next_token.id;
            the_name = global.context[the_id];
            if (the_name === undefined) {
                warn("unexpected_a");
            } else {
                the_name.used += 1;
                if (exports[the_id] !== undefined) {
                    warn("duplicate_a");
                }
                exports[the_id] = the_name;
            }
            advance();
            the_export.expression.push(the_thing);
        }

        if (!option.es6) {
            warn("es6", the_export);
        }
        the_export.expression = [];
        if (next_token.id === "default") {
            if (exports.default !== undefined) {
                warn("duplicate_a");
            }
            advance("default");
            the_thing = expression();
            if (the_thing.id !== "function") {
                semicolon();
            }
            exports.default = the_thing;
            the_export.expression.push(the_thing);
        } else {
            switch (next_token.id) {
            case "function":
                the_thing = statement();
                the_name = the_thing.name;
                the_id = the_name.id;
                the_name.used += 1;
                if (exports[the_id] !== undefined) {
                    warn("duplicate_a", the_name);
                }
                exports[the_id] = the_thing;
                the_export.expression.push(the_thing);
                the_thing.statement = false;
                the_thing.arity = "unary";
                break;
            case "var":
            case "let":
            case "const":
                warn("unexpected_a");
                break;
            case "{":
                advance("{");
                (function loop() {
                    export_id();
                    if (next_token.id === ",") {
                        advance(",");
                        return loop();
                    }
                }());
                advance("}");
                semicolon();
                break;
            default:
                export_id();
                if (the_name.writable !== true) {
                    warn("unexpected_a", token);
                }
                semicolon();
            }
        }
        module_mode = true;
        return the_export;
    });
    stmt("for", function () {
        var first;
        var the_for = token;
        if (!option.for) {
            warn("unexpected_a", the_for);
        }
        not_top_level(the_for);
        functionage.loop += 1;
        advance("(");
        token.free = true;
        if (next_token.id === ";") {
            return stop("expected_a_b", the_for, "while (", "for (;");
        }
        if (
            next_token.id === "var" ||
            next_token.id === "let" ||
            next_token.id === "const"
        ) {
            return stop("unexpected_a");
        }
        first = expression(0);
        if (first.id === "in") {
            if (first.expression[0].arity !== "variable") {
                warn("bad_assignment_a", first.expression[0]);
            }
            the_for.name = first.expression[0];
            the_for.expression = first.expression[1];
            warn("expected_a_b", the_for, "Object.keys", "for in");
        } else {
            the_for.initial = first;
            advance(";");
            the_for.expression = expression(0);
            advance(";");
            the_for.inc = expression(0);
            if (the_for.inc.id === "++") {
                warn("expected_a_b", the_for.inc, "+= 1", "++");
            }
        }
        advance(")");
        the_for.block = block();
        if (the_for.block.disrupt === true) {
            warn("weird_loop", the_for);
        }
        functionage.loop -= 1;
        return the_for;
    });
    stmt("function", do_function);
    stmt("if", function () {
        var the_else;
        var the_if = token;
        the_if.expression = condition();
        the_if.block = block();
        if (next_token.id === "else") {
            advance("else");
            the_else = token;
            the_if.else = (next_token.id === "if")
                ? statement()
                : block();
            if (the_if.block.disrupt === true) {
                if (the_if.else.disrupt === true) {
                    the_if.disrupt = true;
                } else {
                    warn("unexpected_a", the_else);
                }
            }
        }
        return the_if;
    });
    stmt("import", function () {
        var the_import = token;
        var name;
        if (!option.es6) {
            warn("es6", the_import);
        } else if (typeof module_mode === "object") {
            warn("unexpected_directive_a", module_mode, module_mode.directive);
        }
        module_mode = true;
        if (next_token.identifier) {
            name = next_token;
            advance();
            if (name.id === "ignore") {
                warn("unexpected_a", name);
            }
            enroll(name, "variable", true);
            the_import.name = name;
        } else {
            var names = [];
            advance("{");
            if (next_token.id !== "}") {
                while (true) {
                    if (!next_token.identifier) {
                        stop("expected_identifier_a");
                    }
                    name = next_token;
                    advance();
                    if (name.id === "ignore") {
                        warn("unexpected_a", name);
                    }
                    enroll(name, "variable", true);
                    names.push(name);
                    if (next_token.id !== ",") {
                        break;
                    }
                    advance(",");
                }
            }
            advance("}");
            the_import.name = names;
        }
        advance("from");
        advance("(string)");
        the_import.import = token;
        if (!rx_module.test(token.value)) {
            warn("bad_module_name_a", token);
        }
        froms.push(token.value);
        semicolon();
        return the_import;
    });
    stmt("let", do_var);
    stmt("return", function () {
        var the_return = token;
        not_top_level(the_return);
        if (functionage.finally > 0) {
            warn("unexpected_a", the_return);
        }
        the_return.disrupt = true;
        if (next_token.id !== ";" && the_return.line === next_token.line) {
            the_return.expression = expression(10);
        }
        advance(";");
        return the_return;
    });
    stmt("switch", function () {
        var dups = [];
        var last;
        var stmts;
        var the_cases = [];
        var the_disrupt = true;
        var the_switch = token;
        not_top_level(the_switch);
        if (functionage.finally > 0) {
            warn("unexpected_a", the_switch);
        }
        functionage.switch += 1;
        advance("(");
        token.free = true;
        the_switch.expression = expression(0);
        the_switch.block = the_cases;
        advance(")");
        advance("{");
        (function major() {
            var the_case = next_token;
            the_case.arity = "statement";
            the_case.expression = [];
            (function minor() {
                advance("case");
                token.switch = true;
                var exp = expression(0);
                if (dups.some(function (thing) {
                    return are_similar(thing, exp);
                })) {
                    warn("unexpected_a", exp);
                }
                dups.push(exp);
                the_case.expression.push(exp);
                advance(":");
                if (next_token.id === "case") {
                    return minor();
                }
            }());
            stmts = statements();
            if (stmts.length < 1) {
                warn("expected_statements_a");
                return;
            }
            the_case.block = stmts;
            the_cases.push(the_case);
            last = stmts[stmts.length - 1];
            if (last.disrupt) {
                if (last.id === "break" && last.label === undefined) {
                    the_disrupt = false;
                }
            } else {
                warn(
                    "expected_a_before_b",
                    next_token,
                    "break;",
                    artifact(next_token)
                );
            }
            if (next_token.id === "case") {
                return major();
            }
        }());
        dups = undefined;
        if (next_token.id === "default") {
            var the_default = next_token;
            advance("default");
            token.switch = true;
            advance(":");
            the_switch.else = statements();
            if (the_switch.else.length < 1) {
                warn("unexpected_a", the_default);
                the_disrupt = false;
            } else {
                var the_last = the_switch.else[the_switch.else.length - 1];
                if (the_last.id === "break" && the_last.label === undefined) {
                    warn("unexpected_a", the_last);
                    the_last.disrupt = false;
                }
                the_disrupt = the_disrupt && the_last.disrupt;
            }
        } else {
            the_disrupt = false;
        }
        advance("}", the_switch);
        functionage.switch -= 1;
        the_switch.disrupt = the_disrupt;
        return the_switch;
    });
    stmt("throw", function () {
        var the_throw = token;
        the_throw.disrupt = true;
        the_throw.expression = expression(10);
        semicolon();
        return the_throw;
    });
    stmt("try", function () {
        var the_catch;
        var the_disrupt;
        var the_try = token;
        if (functionage.try > 0) {
            warn("unexpected_a", the_try);
        }
        functionage.try += 1;
        the_try.block = block();
        the_disrupt = the_try.block.disrupt;
        if (next_token.id === "catch") {
            var ignored = "ignore";
            the_catch = next_token;
            the_try.catch = the_catch;
            advance("catch");
            advance("(");
            if (!next_token.identifier) {
                return stop("expected_identifier_a", next_token);
            }
            if (next_token.id !== "ignore") {
                ignored = undefined;
                the_catch.name = next_token;
                enroll(next_token, "exception", true);
            }
            advance();
            advance(")");
            the_catch.block = block(ignored);
            if (the_catch.block.disrupt !== true) {
                the_disrupt = false;
            }
        } else {
            warn(
                "expected_a_before_b",
                next_token,
                "catch",
                artifact(next_token)
            );

        }
        if (next_token.id === "finally") {
            functionage.finally += 1;
            advance("finally");
            the_try.else = block();
            the_disrupt = the_try.else.disrupt;
            functionage.finally -= 1;
        }
        the_try.disrupt = the_disrupt;
        functionage.try -= 1;
        return the_try;
    });
    stmt("var", do_var);
    stmt("while", function () {
        var the_while = token;
        not_top_level(the_while);
        functionage.loop += 1;
        the_while.expression = condition();
        the_while.block = block();
        if (the_while.block.disrupt === true) {
            warn("weird_loop", the_while);
        }
        functionage.loop -= 1;
        return the_while;
    });
    stmt("with", function () {
        stop("unexpected_a", token);
    });

    ternary("?", ":");

// Ambulation of the parse tree.

    function action(when) {

// Produce a function that will register task functions that will be called as
// the tree is traversed.

        return function (arity, id, task) {
            var a_set = when[arity];
            var i_set;

// The id parameter is optional. If excluded, the task will be applied to all
// ids.

            if (typeof id !== "string") {
                task = id;
                id = "(all)";
            }

// If this arity has no registrations yet, then create a set object to hold
// them.

            if (a_set === undefined) {
                a_set = empty();
                when[arity] = a_set;
            }

// If this id has no registrations yet, then create a set array to hold them.

            i_set = a_set[id];
            if (i_set === undefined) {
                i_set = [];
                a_set[id] = i_set;
            }

// Register the task with the arity and the id.

            i_set.push(task);
        };
    }

    function amble(when) {

// Produce a function that will act on the tasks registered by an action
// function while walking the tree.

        return function (the_token) {

// Given a task set that was built by an action function, run all of the
// relevant tasks on the token.

            var a_set = when[the_token.arity];
            var i_set;

// If there are tasks associated with the token's arity...

            if (a_set !== undefined) {

// If there are tasks associated with the token's id...

                i_set = a_set[the_token.id];
                if (i_set !== undefined) {
                    i_set.forEach(function (task) {
                        return task(the_token);
                    });
                }

// If there are tasks for all ids.

                i_set = a_set["(all)"];
                if (i_set !== undefined) {
                    i_set.forEach(function (task) {
                        return task(the_token);
                    });
                }
            }
        };
    }

    var posts = empty();
    var pres = empty();
    var preaction = action(pres);
    var postaction = action(posts);
    var preamble = amble(pres);
    var postamble = amble(posts);

    function walk_expression(thing) {
        if (thing) {
            if (Array.isArray(thing)) {
                thing.forEach(walk_expression);
            } else {
                preamble(thing);
                walk_expression(thing.expression);
                if (thing.id === "function") {
                    walk_statement(thing.block);
                }
                switch (thing.arity) {
                case "post":
                case "pre":
                    warn("unexpected_a", thing);
                    break;
                case "statement":
                case "assignment":
                    warn("unexpected_statement_a", thing);
                    break;
                }
                postamble(thing);
            }
        }
    }

    function walk_statement(thing) {
        if (thing) {
            if (Array.isArray(thing)) {
                thing.forEach(walk_statement);
            } else {
                preamble(thing);
                walk_expression(thing.expression);
                switch (thing.arity) {
                case "statement":
                case "assignment":
                    break;
                case "binary":
                    if (thing.id !== "(") {
                        warn("unexpected_expression_a", thing);
                    }
                    break;
                default:
                    warn((
                        thing.id === "(string)" &&
                        thing.value === "use strict"
                    )
                        ? "unexpected_a"
                        : "unexpected_expression_a", thing);
                }
                walk_statement(thing.block);
                walk_statement(thing.else);
                postamble(thing);
            }
        }
    }

    function lookup(thing) {
        if (thing.arity === "variable") {

// Look up the variable in the current context.

            var the_variable = functionage.context[thing.id];

// If it isn't local, search all the other contexts. If there are name
// collisions, take the most recent.

            if (the_variable === undefined) {
                stack.forEach(function (outer) {
                    var a_variable = outer.context[thing.id];
                    if (
                        a_variable !== undefined &&
                        a_variable.role !== "label"
                    ) {
                        the_variable = a_variable;
                    }
                });

// If it isn't in any of those either, perhaps it is a predefined global.
// If so, add it to the global context.

                if (the_variable === undefined) {
                    if (declared_globals[thing.id] === undefined) {
                        warn("undeclared_a", thing);
                        return;
                    }
                    the_variable = {
                        dead: false,
                        function: global,
                        id: thing.id,
                        init: true,
                        role: "variable",
                        used: 0,
                        writable: false
                    };
                    global.context[thing.id] = the_variable;
                }
                the_variable.closure = true;
                functionage.context[thing.id] = the_variable;
            } else if (the_variable.role === "label") {
                warn("label_a", thing);
            }
            if (the_variable.dead) {
                warn("out_of_scope_a", thing);
            }
            return the_variable;
        }
    }

    function subactivate(name) {
        name.init = true;
        name.dead = false;
        blockage.live.push(name);
    }

    function preaction_function(thing) {
        if (thing.arity === "statement" && blockage.body !== true) {
            warn("unexpected_a", thing);
        }
        if (thing.level === 1) {
            if (
                module_mode === true ||
                global.strict !== undefined ||
                thing.complex
            ) {
                if (thing.id !== "=>" && thing.block.strict !== undefined) {
                    warn("unexpected_a", thing.block.strict);
                }
            } else {
                if (thing.block.strict === undefined) {
                    warn("use_strict", thing);
                }
            }
        }
        stack.push(functionage);
        block_stack.push(blockage);
        functionage = thing;
        blockage = thing;
        thing.live = [];
        if (typeof thing.name === "object") {
            thing.name.dead = false;
            thing.name.init = true;
        }
        switch (thing.extra) {
        case "get":
            if (thing.parameters.length !== 0) {
                warn("bad_get", thing);
            }
            break;
        case "set":
            if (thing.parameters.length !== 1) {
                warn("bad_set", thing);
            }
            break;
        }
        thing.parameters.forEach(function (name) {
            walk_expression(name.expression);
            if (name.id === "{" || name.id === "[") {
                name.names.forEach(subactivate);
            } else {
                name.dead = false;
                name.init = true;
            }
        });
    }

    function bitwise_check(thing) {
        if (!option.bitwise && bitwiseop[thing.id] === true) {
            warn("unexpected_a", thing);
        }
        if (
            thing.id !== "(" &&
            thing.id !== "&&" &&
            thing.id !== "||" &&
            thing.id !== "=" &&
            Array.isArray(thing.expression) &&
            thing.expression.length === 2 && (
                relationop[thing.expression[0].id] === true ||
                relationop[thing.expression[1].id] === true
            )
        ) {
            warn("unexpected_a", thing);
        }
    }

    function pop_block() {
        blockage.live.forEach(function (name) {
            name.dead = true;
        });
        delete blockage.live;
        blockage = block_stack.pop();
    }

    function activate(name) {
        if (name.expression !== undefined) {
            walk_expression(name.expression);
            if (name.id === "{" || name.id === "[") {
                name.names.forEach(subactivate);
            } else {
                name.init = true;
            }
        }
        name.dead = false;
        blockage.live.push(name);
    }

    function action_var(thing) {
        thing.names.forEach(activate);
    }

    preaction("assignment", bitwise_check);
    preaction("binary", bitwise_check);
    preaction("binary", function (thing) {
        if (relationop[thing.id] === true) {
            var left = thing.expression[0];
            var right = thing.expression[1];
            if (left.id === "NaN" || right.id === "NaN") {
                if (option.es6) {
                    warn("number_isNaN", thing);
                } else {
                    warn("isNaN", thing);
                }
            } else if (left.id === "typeof") {
                if (right.id !== "(string)") {
                    if (right.id !== "typeof") {
                        warn("expected_string_a", right);
                    }
                } else {
                    var value = right.value;
                    if (value === "symbol") {
                        if (!option.es6) {
                            warn("es6", right, value);
                        }
                    } else if (value === "null" || value === "undefined") {
                        warn("unexpected_typeof_a", right, value);
                    } else if (
                        value !== "boolean" &&
                        value !== "function" &&
                        value !== "number" &&
                        value !== "object" &&
                        value !== "string"
                    ) {
                        warn("expected_type_string_a", right, value);
                    }
                }
            }
        }
    });
    preaction("binary", "==", function (thing) {
        warn("expected_a_b", thing, "===", "==");
    });
    preaction("binary", "!=", function (thing) {
        warn("expected_a_b", thing, "!==", "!=");
    });
    preaction("binary", "=>", preaction_function);
    preaction("binary", "||", function (thing) {
        thing.expression.forEach(function (thang) {
            if (thang.id === "&&" && !thang.wrapped) {
                warn("and", thang);
            }
        });
    });
    preaction("binary", "(", function (thing) {
        var left = thing.expression[0];
        if (
            left.identifier &&
            functionage.context[left.id] === undefined &&
            typeof functionage.name === "object"
        ) {
            var parent = functionage.name.function;
            if (parent) {
                var left_variable = parent.context[left.id];
                if (
                    left_variable !== undefined &&
                    left_variable.dead &&
                    left_variable.function === parent &&
                    left_variable.calls !== undefined &&
                    left_variable.calls[functionage.name.id] !== undefined
                ) {
                    left_variable.dead = false;
                }
            }
        }
    });
    preaction("binary", "in", function (thing) {
        warn("infix_in", thing);
    });
    preaction("binary", "instanceof", function (thing) {
        warn("unexpected_a", thing);
    });
    preaction("binary", ".", function (thing) {
        if (thing.expression.new) {
            thing.new = true;
        }
    });
    preaction("statement", "{", function (thing) {
        block_stack.push(blockage);
        blockage = thing;
        thing.live = [];
    });
    preaction("statement", "for", function (thing) {
        if (thing.name !== undefined) {
            var the_variable = lookup(thing.name);
            if (the_variable !== undefined) {
                the_variable.init = true;
                if (!the_variable.writable) {
                    warn("bad_assignment_a", thing.name);
                }
            }
        }
        walk_statement(thing.initial);
    });
    preaction("statement", "function", preaction_function);
    preaction("unary", "~", bitwise_check);
    preaction("unary", "function", preaction_function);
    preaction("variable", function (thing) {
        var the_variable = lookup(thing);
        if (the_variable !== undefined) {
            thing.variable = the_variable;
            the_variable.used += 1;
        }
    });

    function init_variable(name) {
        var the_variable = lookup(name);
        if (the_variable !== undefined) {
            if (the_variable.writable) {
                the_variable.init = true;
                return;
            }
        }
        warn("bad_assignment_a", name);
    }

    postaction("assignment", function (thing) {

// Assignment using = sets the init property of a variable. No other assignment
// operator can do this. A = token keeps that variable (or array of variables
// in case of destructuring) in its name property.

        var lvalue = thing.expression[0];
        if (thing.id === "=") {
            if (thing.names !== undefined) {
                if (Array.isArray(thing.names)) {
                    thing.names.forEach(init_variable);
                } else {
                    init_variable(thing.names);
                }
            } else {
                if (
                    lvalue.id === "." &&
                    thing.expression[1].id === "undefined"
                ) {
                    warn(
                        "expected_a_b",
                        lvalue.expression,
                        "delete",
                        "undefined"
                    );
                }
            }
        } else {
            if (lvalue.arity === "variable") {
                if (!lvalue.variable || lvalue.variable.writable !== true) {
                    warn("bad_assignment_a", lvalue);
                }
            }
            var right = syntax[thing.expression[1].id];
            if (
                right !== undefined &&
                (
                    right.id === "function" ||
                    right.id === "=>" ||
                    (
                        right.constant &&
                        right.id !== "(number)" &&
                        (right.id !== "(string)" || thing.id !== "+=")
                    )
                )
            ) {
                warn("unexpected_a", thing.expression[1]);
            }
        }
    });

    function postaction_function(thing) {
        delete functionage.finally;
        delete functionage.loop;
        delete functionage.switch;
        delete functionage.try;
        functionage = stack.pop();
        if (thing.wrapped) {
            warn("unexpected_parens", thing);
        }
        return pop_block();
    }

    postaction("binary", function (thing) {
        var right;
        if (relationop[thing.id]) {
            if (
                is_weird(thing.expression[0]) ||
                is_weird(thing.expression[1]) ||
                are_similar(thing.expression[0], thing.expression[1]) ||
                (
                    thing.expression[0].constant === true &&
                    thing.expression[1].constant === true
                )
            ) {
                warn("weird_relation_a", thing);
            }
        }
        switch (thing.id) {
        case "=>":
        case "(":
        case "[":
            break;
        case ".":
            if (thing.expression.id === "RegExp") {
                warn("weird_expression_a", thing);
            }
            break;
        default:
            right = thing.expression[1];
            if (
                (thing.id === "+" || thing.id === "-") &&
                right.id === thing.id &&
                right.arity === "unary" &&
                !right.wrapped
            ) {
                warn("wrap_unary", right);
            }
            if (
                thing.expression[0].constant === true &&
                right.constant === true
            ) {
                thing.constant = true;
            }
        }
    });
    postaction("binary", "&&", function (thing) {
        if (
            is_weird(thing.expression[0]) ||
            are_similar(thing.expression[0], thing.expression[1]) ||
            thing.expression[0].constant === true ||
            thing.expression[1].constant === true
        ) {
            warn("weird_condition_a", thing);
        }
    });
    postaction("binary", "||", function (thing) {
        if (
            is_weird(thing.expression[0]) ||
            are_similar(thing.expression[0], thing.expression[1]) ||
            thing.expression[0].constant === true
        ) {
            warn("weird_condition_a", thing);
        }
    });
    postaction("binary", "=>", postaction_function);
    postaction("binary", "(", function (thing) {
        var left = thing.expression[0];
        var the_new;
        var arg;
        if (left.id === "new") {
            the_new = left;
            left = left.expression;
        }
        if (left.id === "function") {
            if (!thing.wrapped) {
                warn("wrap_immediate", thing);
            }
        } else if (left.identifier) {
            if (the_new !== undefined) {
                if (
                    left.id.charAt(0) > "Z" ||
                    left.id === "Boolean" ||
                    left.id === "Number" ||
                    left.id === "String" ||
                    (left.id === "Symbol" && option.es6)
                ) {
                    warn("unexpected_a", the_new);
                } else if (left.id === "Function") {
                    if (!option.eval) {
                        warn("unexpected_a", left, "new Function");
                    }
                } else if (left.id === "Array") {
                    arg = thing.expression;
                    if (arg.length !== 2 || (
                        (
                            arg[1].id !== "(number)" ||
                            +arg[1].value !== (arg[1].value | 0)
                        ) &&
                        arg[1].arity !== "binary"
                    )) {
                        warn("expected_a_b", left, "[]", "new Array");
                    }
                } else if (left.id === "Object") {
                    warn(
                        "expected_a_b",
                        left,
                        "Object.create(null)",
                        "new Object"
                    );
                }
            } else {
                if (
                    left.id.charAt(0) >= "A" &&
                    left.id.charAt(0) <= "Z" &&
                    left.id !== "Boolean" &&
                    left.id !== "Number" &&
                    left.id !== "String" &&
                    left.id !== "Symbol"
                ) {
                    warn(
                        "expected_a_before_b",
                        left,
                        "new",
                        artifact(left)
                    );
                }
            }
        } else if (left.id === ".") {
            var cack = the_new !== undefined;
            if (left.expression.id === "Date" && left.name.id === "UTC") {
                cack = !cack;
            }
            if (rx_cap.test(left.name.id) !== cack) {
                if (the_new !== undefined) {
                    warn("unexpected_a", the_new);
                } else {
                    warn(
                        "expected_a_before_b",
                        left.expression,
                        "new",
                        left.name.id
                    );
                }
            }
            if (left.name.id === "getTime") {
                var l1 = left.expression;
                if (l1.id === "(") {
                    var l2 = l1.expression;
                    if (l2.length === 1) {
                        var l3 = l2[0];
                        if (l3.id === "new" && l3.expression.id === "Date") {
                            warn(
                                "expected_a_b",
                                l3,
                                "Date.now()",
                                "new Date().getTime()"
                            );
                        }
                    }
                }
            }
        }
    });
    postaction("binary", "[", function (thing) {
        if (thing.expression[0].id === "RegExp") {
            warn("weird_expression_a", thing);
        }
        if (is_weird(thing.expression[1])) {
            warn("weird_expression_a", thing.expression[1]);
        }
    });
    postaction("statement", "{", pop_block);
    postaction("statement", "const", action_var);
    postaction("statement", "export", top_level_only);
    postaction("statement", "for", function (thing) {
        walk_statement(thing.inc);
    });
    postaction("statement", "function", postaction_function);
    postaction("statement", "import", function (the_thing) {
        var name = the_thing.name;
        if (Array.isArray(name)) {
            name.forEach(function (name) {
                name.dead = false;
                name.init = true;
                blockage.live.push(name);
            });
        } else {
            name.dead = false;
            name.init = true;
            blockage.live.push(name);
        }
        return top_level_only(the_thing);
    });
    postaction("statement", "let", action_var);
    postaction("statement", "try", function (thing) {
        if (thing.catch !== undefined) {
            var the_name = thing.catch.name;
            if (the_name !== undefined) {
                var the_variable = functionage.context[the_name.id];
                the_variable.dead = false;
                the_variable.init = true;
            }
            walk_statement(thing.catch.block);
        }
    });
    postaction("statement", "var", action_var);
    postaction("ternary", function (thing) {
        if (
            is_weird(thing.expression[0]) ||
            thing.expression[0].constant === true ||
            are_similar(thing.expression[1], thing.expression[2])
        ) {
            warn("unexpected_a", thing);
        } else if (are_similar(thing.expression[0], thing.expression[1])) {
            warn("expected_a_b", thing, "||", "?");
        } else if (are_similar(thing.expression[0], thing.expression[2])) {
            warn("expected_a_b", thing, "&&", "?");
        } else if (
            thing.expression[1].id === "true" &&
            thing.expression[2].id === "false"
        ) {
            warn("expected_a_b", thing, "!!", "?");
        } else if (
            thing.expression[1].id === "false" &&
            thing.expression[2].id === "true"
        ) {
            warn("expected_a_b", thing, "!", "?");
        } else if (thing.expression[0].wrapped !== true && (
            thing.expression[0].id === "||" ||
            thing.expression[0].id === "&&"
        )) {
            warn("wrap_condition", thing.expression[0]);
        }
    });
    postaction("unary", function (thing) {
        switch (thing.id) {
        case "[":
        case "{":
        case "function":
        case "new":
            break;
        case "`":
            if (thing.expression.every(function (thing) {
                return thing.constant;
            })) {
                thing.constant = true;
            }
            break;
        case "!":
            if (thing.expression.constant === true) {
                warn("unexpected_a", thing);
            }
            break;
        default:
            if (thing.expression.constant === true) {
                thing.constant = true;
            }
        }
    });
    postaction("unary", "function", postaction_function);
    postaction("unary", "+", function (thing) {
        var right = thing.expression;
        if (right.id === "(" && right.expression[0].id === "new") {
            warn("unexpected_a_before_b", thing, "+", "new");
        } else if (right.constant || right.id === "{" || right.id === "[") {
            warn("unexpected_a", thing, "+");
        }
    });

    function delve(the_function) {
        Object.keys(the_function.context).forEach(function (id) {
            if (id !== "ignore") {
                var name = the_function.context[id];
                if (name.function === the_function) {
                    if (name.used === 0 && (
                        name.role !== "function" ||
                        name.function.arity !== "unary"
                    )) {
                        warn("unused_a", name);
                    } else if (!name.init) {
                        warn("uninitialized_a", name);
                    }
                }
            }
        });
    }

    function uninitialized_and_unused() {

// Delve into the functions looking for variables that were not initialized
// or used. If the file imports or exports, then its global object is also
// delved.

        if (module_mode === true || option.node) {
            delve(global);
        }
        functions.forEach(delve);
    }

// Go through the token list, looking at usage of whitespace.

    function whitage() {
        var closer = "(end)";
        var free = false;
        var left = global;
        var margin = 0;
        var nr_comments_skipped = 0;
        var open = true;
        var qmark = "";
        var result;
        var right;

        function expected_at(at) {
            warn(
                "expected_a_at_b_c",
                right,
                artifact(right),
                fudge + at,
                artifact_column(right)
            );
        }

        function at_margin(fit) {
            var at = margin + fit;
            if (right.from !== at) {
                return expected_at(at);
            }
        }

        function no_space_only() {
            if (
                left.id !== "(global)" &&
                left.nr + 1 === right.nr && (
                    left.line !== right.line ||
                    left.thru !== right.from
                )
            ) {
                warn(
                    "unexpected_space_a_b",
                    right,
                    artifact(left),
                    artifact(right)
                );
            }
        }

        function no_space() {
            if (left.line === right.line) {
                if (left.thru !== right.from && nr_comments_skipped === 0) {
                    warn(
                        "unexpected_space_a_b",
                        right,
                        artifact(left),
                        artifact(right)
                    );
                }
            } else {
                if (open) {
                    var at = (free)
                        ? margin
                        : margin + 8;
                    if (right.from < at) {
                        expected_at(at);
                    }
                } else {
                    if (right.from !== margin + 8) {
                        expected_at(margin + 8);
                    }
                }
            }
        }

        function one_space_only() {
            if (left.line !== right.line || left.thru + 1 !== right.from) {
                warn(
                    "expected_space_a_b",
                    right,
                    artifact(left),
                    artifact(right)
                );
            }
        }

        function one_space() {
            if (left.line === right.line) {
                if (left.thru + 1 !== right.from && nr_comments_skipped === 0) {
                    warn(
                        "expected_space_a_b",
                        right,
                        artifact(left),
                        artifact(right)
                    );
                }
            } else {
                if (free) {
                    if (right.from < margin) {
                        expected_at(margin);
                    }
                } else {
                    var mislaid = stack[stack.length - 1].right;
                    if (!open && mislaid !== undefined) {
                        warn(
                            "expected_a_at_b_c",
                            mislaid,
                            artifact(mislaid.id),
                            margin + 4 + fudge,
                            mislaid.from + fudge
                        );
                    } else if (right.from !== margin + 8) {
                        expected_at(margin + 8);
                    }
                }
            }
        }

        function unqmark() {

// Undo the effects of dangling nested ternary operators.

            var level = qmark.length;
            if (level > 0) {
                margin -= level * 4;
            }
            qmark = "";
        }

        stack = [];
        tokens.forEach(function (the_token) {
            right = the_token;
            if (right.id === "(comment)" || right.id === "(end)") {
                nr_comments_skipped += 1;
            } else {

// If left is an opener and right is not the closer, then push the previous
// state. If the token following the opener is on the next line, then this is
// an open form. If the tokens are on the same line, then it is a closed form.
// Open form is more readable, with each item (statement, argument, parameter,
// etc) starting on its own line. Closed form is more compact. Statement blocks
// are always in open form.

                var new_closer = opener[left.id];
                if (typeof new_closer === "string") {
                    if (new_closer !== right.id) {
                        stack.push({
                            closer: closer,
                            free: free,
                            margin: margin,
                            open: open,
                            qmark: qmark,
                            right: right
                        });
                        qmark = "";
                        closer = new_closer;
                        if (left.line !== right.line) {
                            free = closer === ")" && left.free;
                            open = true;
                            margin += 4;
                            if (right.role === "label") {
                                if (right.from !== 0) {
                                    expected_at(0);
                                }
                            } else if (right.switch) {
                                unqmark();
                                at_margin(-4);
                            } else {
                                at_margin(0);
                            }
                        } else {
                            if (right.statement || right.role === "label") {
                                warn(
                                    "expected_line_break_a_b",
                                    right,
                                    artifact(left),
                                    artifact(right)
                                );
                            }
                            free = false;
                            open = false;
                            no_space_only();
                        }
                    } else {

// If left and right are opener and closer, then the placement of right depends
// on the openness. Illegal pairs (like {]) have already been detected.

                        if (left.line === right.line) {
                            no_space();
                        } else {
                            at_margin(0);
                        }
                    }
                } else {

// If right is a closer, then pop the previous state.

                    if (right.id === closer) {
                        var previous = stack.pop();
                        margin = previous.margin;
                        if (open && right.id !== ";") {
                            at_margin(0);
                        } else {
                            no_space_only();
                        }
                        closer = previous.closer;
                        free = previous.free;
                        open = previous.open;
                        qmark = previous.qmark;
                    } else {

// Left is not an opener, and right is not a closer. The nature of left and
// right will determine the space between them.

// If left is , or ; or right is a statement then if open, right must go at the
// margin, or if closed, a space between.


                        if (right.switch) {
                            unqmark();
                            at_margin(-4);
                        } else if (right.role === "label") {
                            if (right.from !== 0) {
                                expected_at(0);
                            }
                        } else if (left.id === ",") {
                            unqmark();
                            if (!open || (
                                (free || closer === "]") &&
                                left.line === right.line
                            )) {
                                one_space();
                            } else {
                                at_margin(0);
                            }

// If right is a ternary operator, line it up on the margin. Use qmark to
// deal with nested ternary operators.

                        } else if (right.arity === "ternary") {
                            if (right.id === "?") {
                                margin += 4;
                                qmark += "?";
                            } else {
                                result = qmark.match(rx_colons);
                                qmark = result[1] + ":";
                                margin -= 4 * result[2].length;
                            }
                            at_margin(0);
                        } else if (
                            right.arity === "binary" &&
                            right.id === "(" &&
                            free
                        ) {
                            no_space();
                        } else if (
                            left.id === "." ||
                            left.id === "..." ||
                            right.id === "," ||
                            right.id === ";" ||
                            right.id === ":" ||
                            (right.arity === "binary" && (
                                right.id === "(" ||
                                right.id === "["
                            )) ||
                            (
                                right.arity === "function" &&
                                left.id !== "function"
                            )
                        ) {
                            no_space_only();
                        } else if (right.id === ".") {
                            if (left.line === right.line) {
                                no_space();
                            } else {
                                if (!rx_dot.test(qmark)) {
                                    qmark += ".";
                                    margin += 4;
                                }
                                at_margin(0);
                            }
                        } else if (left.id === ";") {
                            unqmark();
                            if (open) {
                                at_margin(0);
                            } else {
                                one_space();
                            }
                        } else if (
                            left.arity === "ternary" ||
                            left.id === "case" ||
                            left.id === "catch" ||
                            left.id === "else" ||
                            left.id === "finally" ||
                            left.id === "while" ||
                            right.id === "catch" ||
                            right.id === "else" ||
                            right.id === "finally" ||
                            (right.id === "while" && !right.statement) ||
                            (left.id === ")" && right.id === "{")
                        ) {
                            one_space_only();
                        } else if (right.statement === true) {
                            if (open) {
                                at_margin(0);
                            } else {
                                one_space();
                            }
                        } else if (
                            left.id === "var" ||
                            left.id === "const" ||
                            left.id === "let"
                        ) {
                            stack.push({
                                closer: closer,
                                free: free,
                                margin: margin,
                                open: open,
                                qmark: qmark
                            });
                            closer = ";";
                            free = false;
                            open = left.open;
                            qmark = "";
                            if (open) {
                                margin = margin + 4;
                                at_margin(0);
                            } else {
                                one_space_only();
                            }
                        } else if (

// There is a space between left and right.

                            spaceop[left.id] === true ||
                            spaceop[right.id] === true ||
                            (
                                left.arity === "binary" &&
                                (left.id === "+" || left.id === "-")
                            ) ||
                            (
                                right.arity === "binary" &&
                                (right.id === "+" || right.id === "-")
                            ) ||
                            left.id === "function" ||
                            left.id === ":" ||
                            (
                                (
                                    left.identifier ||
                                    left.id === "(string)" ||
                                    left.id === "(number)"
                                ) &&
                                (
                                    right.identifier ||
                                    right.id === "(string)" ||
                                    right.id === "(number)"
                                )
                            ) ||
                            (left.arity === "statement" && right.id !== ";")
                        ) {
                            one_space();
                        } else if (left.arity === "unary" && left.id !== "`") {
                            no_space_only();
                        }
                    }
                }
                nr_comments_skipped = 0;
                delete left.calls;
                delete left.dead;
                delete left.free;
                delete left.init;
                delete left.open;
                delete left.used;
                left = right;
            }
        });
    }

// The jslint function itself.

    return function (source, option_object, global_array) {
        try {
            warnings = [];
            option = Object.assign(empty(), option_object);
            anon = "anonymous";
            block_stack = [];
            declared_globals = empty();
            directive_mode = true;
            directives = [];
            early_stop = true;
            exports = empty();
            froms = [];
            fudge = (option.fudge)
                ? 1
                : 0;
            functions = [];
            global = {
                id: "(global)",
                body: true,
                context: empty(),
                from: 0,
                level: 0,
                line: 0,
                live: [],
                loop: 0,
                switch: 0,
                thru: 0
            };
            blockage = global;
            functionage = global;
            json_mode = false;
            mega_mode = false;
            module_mode = false;
            next_token = global;
            property = empty();
            stack = [];
            tenure = undefined;
            token = global;
            token_nr = 0;
            var_mode = undefined;
            populate(declared_globals, standard, false);
            if (global_array !== undefined) {
                populate(declared_globals, global_array, false);
            }
            Object.keys(option).forEach(function (name) {
                if (option[name] === true) {
                    var allowed = allowed_option[name];
                    if (Array.isArray(allowed)) {
                        populate(declared_globals, allowed, false);
                    }
                }
            });
            tokenize(source);
            advance();
            if (json_mode) {
                tree = json_value();
                advance("(end)");
            } else {

// Because browsers encourage combining of script files, the first token might
// be a semicolon to defend against a missing semicolon in the preceding file.

                if (option.browser) {
                    if (next_token.id === ";") {
                        advance(";");
                    }
                } else {

// If we are not in a browser, then the file form of strict pragma may be used.

                    if (
                        next_token.value === "use strict"
                    ) {
                        global.strict = next_token;
                        advance("(string)");
                        advance(";");
                    }
                }
                tree = statements();
                advance("(end)");
                functionage = global;
                walk_statement(tree);
                if (module_mode && global.strict !== undefined) {
                    warn("unexpected_a", global.strict);
                }
                uninitialized_and_unused();
                if (!option.white) {
                    whitage();
                }
            }
            if (!option.browser) {
                directives.forEach(function (comment) {
                    if (comment.directive === "global") {
                        warn("missing_browser", comment);
                    }
                });
            }
            early_stop = false;
        } catch (e) {
            if (e.name !== "JSLintError") {
                warnings.push(e);
            }
        }
        return {
            directives: directives,
            edition: "2017-04-10",
            exports: exports,
            froms: froms,
            functions: functions,
            global: global,
            id: "(JSLint)",
            json: json_mode,
            lines: lines,
            module: module_mode === true,
            ok: warnings.length === 0 && !early_stop,
            option: option,
            property: property,
            stop: early_stop,
            tokens: tokens,
            tree: tree,
            warnings: warnings.sort(function (a, b) {
                return a.line - b.line || a.column - b.column;
            })
        };
    };
}());

/*node module.exports = jslint;*/;(function webpackUniversalModuleDefinition(root, factory) {
/* istanbul ignore next */
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
/* istanbul ignore next */
	else if(typeof exports === 'object')
		exports["esprima"] = factory();
	else
		root["esprima"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/* istanbul ignore if */
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*
	  Copyright JS Foundation and other contributors, https://js.foundation/

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	var comment_handler_1 = __webpack_require__(1);
	var jsx_parser_1 = __webpack_require__(3);
	var parser_1 = __webpack_require__(8);
	var tokenizer_1 = __webpack_require__(15);
	function parse(code, options, delegate) {
	    var commentHandler = null;
	    var proxyDelegate = function (node, metadata) {
	        if (delegate) {
	            delegate(node, metadata);
	        }
	        if (commentHandler) {
	            commentHandler.visit(node, metadata);
	        }
	    };
	    var parserDelegate = (typeof delegate === 'function') ? proxyDelegate : null;
	    var collectComment = false;
	    if (options) {
	        collectComment = (typeof options.comment === 'boolean' && options.comment);
	        var attachComment = (typeof options.attachComment === 'boolean' && options.attachComment);
	        if (collectComment || attachComment) {
	            commentHandler = new comment_handler_1.CommentHandler();
	            commentHandler.attach = attachComment;
	            options.comment = true;
	            parserDelegate = proxyDelegate;
	        }
	    }
	    var isModule = false;
	    if (options && typeof options.sourceType === 'string') {
	        isModule = (options.sourceType === 'module');
	    }
	    var parser;
	    if (options && typeof options.jsx === 'boolean' && options.jsx) {
	        parser = new jsx_parser_1.JSXParser(code, options, parserDelegate);
	    }
	    else {
	        parser = new parser_1.Parser(code, options, parserDelegate);
	    }
	    var program = isModule ? parser.parseModule() : parser.parseScript();
	    var ast = program;
	    if (collectComment && commentHandler) {
	        ast.comments = commentHandler.comments;
	    }
	    if (parser.config.tokens) {
	        ast.tokens = parser.tokens;
	    }
	    if (parser.config.tolerant) {
	        ast.errors = parser.errorHandler.errors;
	    }
	    return ast;
	}
	exports.parse = parse;
	function parseModule(code, options, delegate) {
	    var parsingOptions = options || {};
	    parsingOptions.sourceType = 'module';
	    return parse(code, parsingOptions, delegate);
	}
	exports.parseModule = parseModule;
	function parseScript(code, options, delegate) {
	    var parsingOptions = options || {};
	    parsingOptions.sourceType = 'script';
	    return parse(code, parsingOptions, delegate);
	}
	exports.parseScript = parseScript;
	function tokenize(code, options, delegate) {
	    var tokenizer = new tokenizer_1.Tokenizer(code, options);
	    var tokens;
	    tokens = [];
	    try {
	        while (true) {
	            var token = tokenizer.getNextToken();
	            if (!token) {
	                break;
	            }
	            if (delegate) {
	                token = delegate(token);
	            }
	            tokens.push(token);
	        }
	    }
	    catch (e) {
	        tokenizer.errorHandler.tolerate(e);
	    }
	    if (tokenizer.errorHandler.tolerant) {
	        tokens.errors = tokenizer.errors();
	    }
	    return tokens;
	}
	exports.tokenize = tokenize;
	var syntax_1 = __webpack_require__(2);
	exports.Syntax = syntax_1.Syntax;
	// Sync with *.json manifests.
	exports.version = '4.0.0';


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var syntax_1 = __webpack_require__(2);
	var CommentHandler = (function () {
	    function CommentHandler() {
	        this.attach = false;
	        this.comments = [];
	        this.stack = [];
	        this.leading = [];
	        this.trailing = [];
	    }
	    CommentHandler.prototype.insertInnerComments = function (node, metadata) {
	        //  innnerComments for properties empty block
	        //  `function a() {/** comments **\/}`
	        if (node.type === syntax_1.Syntax.BlockStatement && node.body.length === 0) {
	            var innerComments = [];
	            for (var i = this.leading.length - 1; i >= 0; --i) {
	                var entry = this.leading[i];
	                if (metadata.end.offset >= entry.start) {
	                    innerComments.unshift(entry.comment);
	                    this.leading.splice(i, 1);
	                    this.trailing.splice(i, 1);
	                }
	            }
	            if (innerComments.length) {
	                node.innerComments = innerComments;
	            }
	        }
	    };
	    CommentHandler.prototype.findTrailingComments = function (metadata) {
	        var trailingComments = [];
	        if (this.trailing.length > 0) {
	            for (var i = this.trailing.length - 1; i >= 0; --i) {
	                var entry_1 = this.trailing[i];
	                if (entry_1.start >= metadata.end.offset) {
	                    trailingComments.unshift(entry_1.comment);
	                }
	            }
	            this.trailing.length = 0;
	            return trailingComments;
	        }
	        var entry = this.stack[this.stack.length - 1];
	        if (entry && entry.node.trailingComments) {
	            var firstComment = entry.node.trailingComments[0];
	            if (firstComment && firstComment.range[0] >= metadata.end.offset) {
	                trailingComments = entry.node.trailingComments;
	                delete entry.node.trailingComments;
	            }
	        }
	        return trailingComments;
	    };
	    CommentHandler.prototype.findLeadingComments = function (metadata) {
	        var leadingComments = [];
	        var target;
	        while (this.stack.length > 0) {
	            var entry = this.stack[this.stack.length - 1];
	            if (entry && entry.start >= metadata.start.offset) {
	                target = entry.node;
	                this.stack.pop();
	            }
	            else {
	                break;
	            }
	        }
	        if (target) {
	            var count = target.leadingComments ? target.leadingComments.length : 0;
	            for (var i = count - 1; i >= 0; --i) {
	                var comment = target.leadingComments[i];
	                if (comment.range[1] <= metadata.start.offset) {
	                    leadingComments.unshift(comment);
	                    target.leadingComments.splice(i, 1);
	                }
	            }
	            if (target.leadingComments && target.leadingComments.length === 0) {
	                delete target.leadingComments;
	            }
	            return leadingComments;
	        }
	        for (var i = this.leading.length - 1; i >= 0; --i) {
	            var entry = this.leading[i];
	            if (entry.start <= metadata.start.offset) {
	                leadingComments.unshift(entry.comment);
	                this.leading.splice(i, 1);
	            }
	        }
	        return leadingComments;
	    };
	    CommentHandler.prototype.visitNode = function (node, metadata) {
	        if (node.type === syntax_1.Syntax.Program && node.body.length > 0) {
	            return;
	        }
	        this.insertInnerComments(node, metadata);
	        var trailingComments = this.findTrailingComments(metadata);
	        var leadingComments = this.findLeadingComments(metadata);
	        if (leadingComments.length > 0) {
	            node.leadingComments = leadingComments;
	        }
	        if (trailingComments.length > 0) {
	            node.trailingComments = trailingComments;
	        }
	        this.stack.push({
	            node: node,
	            start: metadata.start.offset
	        });
	    };
	    CommentHandler.prototype.visitComment = function (node, metadata) {
	        var type = (node.type[0] === 'L') ? 'Line' : 'Block';
	        var comment = {
	            type: type,
	            value: node.value
	        };
	        if (node.range) {
	            comment.range = node.range;
	        }
	        if (node.loc) {
	            comment.loc = node.loc;
	        }
	        this.comments.push(comment);
	        if (this.attach) {
	            var entry = {
	                comment: {
	                    type: type,
	                    value: node.value,
	                    range: [metadata.start.offset, metadata.end.offset]
	                },
	                start: metadata.start.offset
	            };
	            if (node.loc) {
	                entry.comment.loc = node.loc;
	            }
	            node.type = type;
	            this.leading.push(entry);
	            this.trailing.push(entry);
	        }
	    };
	    CommentHandler.prototype.visit = function (node, metadata) {
	        if (node.type === 'LineComment') {
	            this.visitComment(node, metadata);
	        }
	        else if (node.type === 'BlockComment') {
	            this.visitComment(node, metadata);
	        }
	        else if (this.attach) {
	            this.visitNode(node, metadata);
	        }
	    };
	    return CommentHandler;
	}());
	exports.CommentHandler = CommentHandler;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Syntax = {
	    AssignmentExpression: 'AssignmentExpression',
	    AssignmentPattern: 'AssignmentPattern',
	    ArrayExpression: 'ArrayExpression',
	    ArrayPattern: 'ArrayPattern',
	    ArrowFunctionExpression: 'ArrowFunctionExpression',
	    AwaitExpression: 'AwaitExpression',
	    BlockStatement: 'BlockStatement',
	    BinaryExpression: 'BinaryExpression',
	    BreakStatement: 'BreakStatement',
	    CallExpression: 'CallExpression',
	    CatchClause: 'CatchClause',
	    ClassBody: 'ClassBody',
	    ClassDeclaration: 'ClassDeclaration',
	    ClassExpression: 'ClassExpression',
	    ConditionalExpression: 'ConditionalExpression',
	    ContinueStatement: 'ContinueStatement',
	    DoWhileStatement: 'DoWhileStatement',
	    DebuggerStatement: 'DebuggerStatement',
	    EmptyStatement: 'EmptyStatement',
	    ExportAllDeclaration: 'ExportAllDeclaration',
	    ExportDefaultDeclaration: 'ExportDefaultDeclaration',
	    ExportNamedDeclaration: 'ExportNamedDeclaration',
	    ExportSpecifier: 'ExportSpecifier',
	    ExpressionStatement: 'ExpressionStatement',
	    ForStatement: 'ForStatement',
	    ForOfStatement: 'ForOfStatement',
	    ForInStatement: 'ForInStatement',
	    FunctionDeclaration: 'FunctionDeclaration',
	    FunctionExpression: 'FunctionExpression',
	    Identifier: 'Identifier',
	    IfStatement: 'IfStatement',
	    ImportDeclaration: 'ImportDeclaration',
	    ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	    ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	    ImportSpecifier: 'ImportSpecifier',
	    Literal: 'Literal',
	    LabeledStatement: 'LabeledStatement',
	    LogicalExpression: 'LogicalExpression',
	    MemberExpression: 'MemberExpression',
	    MetaProperty: 'MetaProperty',
	    MethodDefinition: 'MethodDefinition',
	    NewExpression: 'NewExpression',
	    ObjectExpression: 'ObjectExpression',
	    ObjectPattern: 'ObjectPattern',
	    Program: 'Program',
	    Property: 'Property',
	    RestElement: 'RestElement',
	    ReturnStatement: 'ReturnStatement',
	    SequenceExpression: 'SequenceExpression',
	    SpreadElement: 'SpreadElement',
	    Super: 'Super',
	    SwitchCase: 'SwitchCase',
	    SwitchStatement: 'SwitchStatement',
	    TaggedTemplateExpression: 'TaggedTemplateExpression',
	    TemplateElement: 'TemplateElement',
	    TemplateLiteral: 'TemplateLiteral',
	    ThisExpression: 'ThisExpression',
	    ThrowStatement: 'ThrowStatement',
	    TryStatement: 'TryStatement',
	    UnaryExpression: 'UnaryExpression',
	    UpdateExpression: 'UpdateExpression',
	    VariableDeclaration: 'VariableDeclaration',
	    VariableDeclarator: 'VariableDeclarator',
	    WhileStatement: 'WhileStatement',
	    WithStatement: 'WithStatement',
	    YieldExpression: 'YieldExpression'
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
/* istanbul ignore next */
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = Object.setPrototypeOf ||
	        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var character_1 = __webpack_require__(4);
	var JSXNode = __webpack_require__(5);
	var jsx_syntax_1 = __webpack_require__(6);
	var Node = __webpack_require__(7);
	var parser_1 = __webpack_require__(8);
	var token_1 = __webpack_require__(13);
	var xhtml_entities_1 = __webpack_require__(14);
	token_1.TokenName[100 /* Identifier */] = 'JSXIdentifier';
	token_1.TokenName[101 /* Text */] = 'JSXText';
	// Fully qualified element name, e.g. <svg:path> returns "svg:path"
	function getQualifiedElementName(elementName) {
	    var qualifiedName;
	    switch (elementName.type) {
	        case jsx_syntax_1.JSXSyntax.JSXIdentifier:
	            var id = elementName;
	            qualifiedName = id.name;
	            break;
	        case jsx_syntax_1.JSXSyntax.JSXNamespacedName:
	            var ns = elementName;
	            qualifiedName = getQualifiedElementName(ns.namespace) + ':' +
	                getQualifiedElementName(ns.name);
	            break;
	        case jsx_syntax_1.JSXSyntax.JSXMemberExpression:
	            var expr = elementName;
	            qualifiedName = getQualifiedElementName(expr.object) + '.' +
	                getQualifiedElementName(expr.property);
	            break;
	        /* istanbul ignore next */
	        default:
	            break;
	    }
	    return qualifiedName;
	}
	var JSXParser = (function (_super) {
	    __extends(JSXParser, _super);
	    function JSXParser(code, options, delegate) {
	        return _super.call(this, code, options, delegate) || this;
	    }
	    JSXParser.prototype.parsePrimaryExpression = function () {
	        return this.match('<') ? this.parseJSXRoot() : _super.prototype.parsePrimaryExpression.call(this);
	    };
	    JSXParser.prototype.startJSX = function () {
	        // Unwind the scanner before the lookahead token.
	        this.scanner.index = this.startMarker.index;
	        this.scanner.lineNumber = this.startMarker.line;
	        this.scanner.lineStart = this.startMarker.index - this.startMarker.column;
	    };
	    JSXParser.prototype.finishJSX = function () {
	        // Prime the next lookahead.
	        this.nextToken();
	    };
	    JSXParser.prototype.reenterJSX = function () {
	        this.startJSX();
	        this.expectJSX('}');
	        // Pop the closing '}' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	    };
	    JSXParser.prototype.createJSXNode = function () {
	        this.collectComments();
	        return {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    };
	    JSXParser.prototype.createJSXChildNode = function () {
	        return {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    };
	    JSXParser.prototype.scanXHTMLEntity = function (quote) {
	        var result = '&';
	        var valid = true;
	        var terminated = false;
	        var numeric = false;
	        var hex = false;
	        while (!this.scanner.eof() && valid && !terminated) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === quote) {
	                break;
	            }
	            terminated = (ch === ';');
	            result += ch;
	            ++this.scanner.index;
	            if (!terminated) {
	                switch (result.length) {
	                    case 2:
	                        // e.g. '&#123;'
	                        numeric = (ch === '#');
	                        break;
	                    case 3:
	                        if (numeric) {
	                            // e.g. '&#x41;'
	                            hex = (ch === 'x');
	                            valid = hex || character_1.Character.isDecimalDigit(ch.charCodeAt(0));
	                            numeric = numeric && !hex;
	                        }
	                        break;
	                    default:
	                        valid = valid && !(numeric && !character_1.Character.isDecimalDigit(ch.charCodeAt(0)));
	                        valid = valid && !(hex && !character_1.Character.isHexDigit(ch.charCodeAt(0)));
	                        break;
	                }
	            }
	        }
	        if (valid && terminated && result.length > 2) {
	            // e.g. '&#x41;' becomes just '#x41'
	            var str = result.substr(1, result.length - 2);
	            if (numeric && str.length > 1) {
	                result = String.fromCharCode(parseInt(str.substr(1), 10));
	            }
	            else if (hex && str.length > 2) {
	                result = String.fromCharCode(parseInt('0' + str.substr(1), 16));
	            }
	            else if (!numeric && !hex && xhtml_entities_1.XHTMLEntities[str]) {
	                result = xhtml_entities_1.XHTMLEntities[str];
	            }
	        }
	        return result;
	    };
	    // Scan the next JSX token. This replaces Scanner#lex when in JSX mode.
	    JSXParser.prototype.lexJSX = function () {
	        var cp = this.scanner.source.charCodeAt(this.scanner.index);
	        // < > / : = { }
	        if (cp === 60 || cp === 62 || cp === 47 || cp === 58 || cp === 61 || cp === 123 || cp === 125) {
	            var value = this.scanner.source[this.scanner.index++];
	            return {
	                type: 7 /* Punctuator */,
	                value: value,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: this.scanner.index - 1,
	                end: this.scanner.index
	            };
	        }
	        // " '
	        if (cp === 34 || cp === 39) {
	            var start = this.scanner.index;
	            var quote = this.scanner.source[this.scanner.index++];
	            var str = '';
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source[this.scanner.index++];
	                if (ch === quote) {
	                    break;
	                }
	                else if (ch === '&') {
	                    str += this.scanXHTMLEntity(quote);
	                }
	                else {
	                    str += ch;
	                }
	            }
	            return {
	                type: 8 /* StringLiteral */,
	                value: str,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // ... or .
	        if (cp === 46) {
	            var n1 = this.scanner.source.charCodeAt(this.scanner.index + 1);
	            var n2 = this.scanner.source.charCodeAt(this.scanner.index + 2);
	            var value = (n1 === 46 && n2 === 46) ? '...' : '.';
	            var start = this.scanner.index;
	            this.scanner.index += value.length;
	            return {
	                type: 7 /* Punctuator */,
	                value: value,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        // `
	        if (cp === 96) {
	            // Only placeholder, since it will be rescanned as a real assignment expression.
	            return {
	                type: 10 /* Template */,
	                value: '',
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: this.scanner.index,
	                end: this.scanner.index
	            };
	        }
	        // Identifer can not contain backslash (char code 92).
	        if (character_1.Character.isIdentifierStart(cp) && (cp !== 92)) {
	            var start = this.scanner.index;
	            ++this.scanner.index;
	            while (!this.scanner.eof()) {
	                var ch = this.scanner.source.charCodeAt(this.scanner.index);
	                if (character_1.Character.isIdentifierPart(ch) && (ch !== 92)) {
	                    ++this.scanner.index;
	                }
	                else if (ch === 45) {
	                    // Hyphen (char code 45) can be part of an identifier.
	                    ++this.scanner.index;
	                }
	                else {
	                    break;
	                }
	            }
	            var id = this.scanner.source.slice(start, this.scanner.index);
	            return {
	                type: 100 /* Identifier */,
	                value: id,
	                lineNumber: this.scanner.lineNumber,
	                lineStart: this.scanner.lineStart,
	                start: start,
	                end: this.scanner.index
	            };
	        }
	        return this.scanner.lex();
	    };
	    JSXParser.prototype.nextJSXToken = function () {
	        this.collectComments();
	        this.startMarker.index = this.scanner.index;
	        this.startMarker.line = this.scanner.lineNumber;
	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        var token = this.lexJSX();
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        if (this.config.tokens) {
	            this.tokens.push(this.convertToken(token));
	        }
	        return token;
	    };
	    JSXParser.prototype.nextJSXText = function () {
	        this.startMarker.index = this.scanner.index;
	        this.startMarker.line = this.scanner.lineNumber;
	        this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        var start = this.scanner.index;
	        var text = '';
	        while (!this.scanner.eof()) {
	            var ch = this.scanner.source[this.scanner.index];
	            if (ch === '{' || ch === '<') {
	                break;
	            }
	            ++this.scanner.index;
	            text += ch;
	            if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                ++this.scanner.lineNumber;
	                if (ch === '\r' && this.scanner.source[this.scanner.index] === '\n') {
	                    ++this.scanner.index;
	                }
	                this.scanner.lineStart = this.scanner.index;
	            }
	        }
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        var token = {
	            type: 101 /* Text */,
	            value: text,
	            lineNumber: this.scanner.lineNumber,
	            lineStart: this.scanner.lineStart,
	            start: start,
	            end: this.scanner.index
	        };
	        if ((text.length > 0) && this.config.tokens) {
	            this.tokens.push(this.convertToken(token));
	        }
	        return token;
	    };
	    JSXParser.prototype.peekJSXToken = function () {
	        var state = this.scanner.saveState();
	        this.scanner.scanComments();
	        var next = this.lexJSX();
	        this.scanner.restoreState(state);
	        return next;
	    };
	    // Expect the next JSX token to match the specified punctuator.
	    // If not, an exception will be thrown.
	    JSXParser.prototype.expectJSX = function (value) {
	        var token = this.nextJSXToken();
	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Return true if the next JSX token matches the specified punctuator.
	    JSXParser.prototype.matchJSX = function (value) {
	        var next = this.peekJSXToken();
	        return next.type === 7 /* Punctuator */ && next.value === value;
	    };
	    JSXParser.prototype.parseJSXIdentifier = function () {
	        var node = this.createJSXNode();
	        var token = this.nextJSXToken();
	        if (token.type !== 100 /* Identifier */) {
	            this.throwUnexpectedToken(token);
	        }
	        return this.finalize(node, new JSXNode.JSXIdentifier(token.value));
	    };
	    JSXParser.prototype.parseJSXElementName = function () {
	        var node = this.createJSXNode();
	        var elementName = this.parseJSXIdentifier();
	        if (this.matchJSX(':')) {
	            var namespace = elementName;
	            this.expectJSX(':');
	            var name_1 = this.parseJSXIdentifier();
	            elementName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_1));
	        }
	        else if (this.matchJSX('.')) {
	            while (this.matchJSX('.')) {
	                var object = elementName;
	                this.expectJSX('.');
	                var property = this.parseJSXIdentifier();
	                elementName = this.finalize(node, new JSXNode.JSXMemberExpression(object, property));
	            }
	        }
	        return elementName;
	    };
	    JSXParser.prototype.parseJSXAttributeName = function () {
	        var node = this.createJSXNode();
	        var attributeName;
	        var identifier = this.parseJSXIdentifier();
	        if (this.matchJSX(':')) {
	            var namespace = identifier;
	            this.expectJSX(':');
	            var name_2 = this.parseJSXIdentifier();
	            attributeName = this.finalize(node, new JSXNode.JSXNamespacedName(namespace, name_2));
	        }
	        else {
	            attributeName = identifier;
	        }
	        return attributeName;
	    };
	    JSXParser.prototype.parseJSXStringLiteralAttribute = function () {
	        var node = this.createJSXNode();
	        var token = this.nextJSXToken();
	        if (token.type !== 8 /* StringLiteral */) {
	            this.throwUnexpectedToken(token);
	        }
	        var raw = this.getTokenRaw(token);
	        return this.finalize(node, new Node.Literal(token.value, raw));
	    };
	    JSXParser.prototype.parseJSXExpressionAttribute = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        this.finishJSX();
	        if (this.match('}')) {
	            this.tolerateError('JSX attributes must only be assigned a non-empty expression');
	        }
	        var expression = this.parseAssignmentExpression();
	        this.reenterJSX();
	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
	    };
	    JSXParser.prototype.parseJSXAttributeValue = function () {
	        return this.matchJSX('{') ? this.parseJSXExpressionAttribute() :
	            this.matchJSX('<') ? this.parseJSXElement() : this.parseJSXStringLiteralAttribute();
	    };
	    JSXParser.prototype.parseJSXNameValueAttribute = function () {
	        var node = this.createJSXNode();
	        var name = this.parseJSXAttributeName();
	        var value = null;
	        if (this.matchJSX('=')) {
	            this.expectJSX('=');
	            value = this.parseJSXAttributeValue();
	        }
	        return this.finalize(node, new JSXNode.JSXAttribute(name, value));
	    };
	    JSXParser.prototype.parseJSXSpreadAttribute = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        this.expectJSX('...');
	        this.finishJSX();
	        var argument = this.parseAssignmentExpression();
	        this.reenterJSX();
	        return this.finalize(node, new JSXNode.JSXSpreadAttribute(argument));
	    };
	    JSXParser.prototype.parseJSXAttributes = function () {
	        var attributes = [];
	        while (!this.matchJSX('/') && !this.matchJSX('>')) {
	            var attribute = this.matchJSX('{') ? this.parseJSXSpreadAttribute() :
	                this.parseJSXNameValueAttribute();
	            attributes.push(attribute);
	        }
	        return attributes;
	    };
	    JSXParser.prototype.parseJSXOpeningElement = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('<');
	        var name = this.parseJSXElementName();
	        var attributes = this.parseJSXAttributes();
	        var selfClosing = this.matchJSX('/');
	        if (selfClosing) {
	            this.expectJSX('/');
	        }
	        this.expectJSX('>');
	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
	    };
	    JSXParser.prototype.parseJSXBoundaryElement = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('<');
	        if (this.matchJSX('/')) {
	            this.expectJSX('/');
	            var name_3 = this.parseJSXElementName();
	            this.expectJSX('>');
	            return this.finalize(node, new JSXNode.JSXClosingElement(name_3));
	        }
	        var name = this.parseJSXElementName();
	        var attributes = this.parseJSXAttributes();
	        var selfClosing = this.matchJSX('/');
	        if (selfClosing) {
	            this.expectJSX('/');
	        }
	        this.expectJSX('>');
	        return this.finalize(node, new JSXNode.JSXOpeningElement(name, selfClosing, attributes));
	    };
	    JSXParser.prototype.parseJSXEmptyExpression = function () {
	        var node = this.createJSXChildNode();
	        this.collectComments();
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        return this.finalize(node, new JSXNode.JSXEmptyExpression());
	    };
	    JSXParser.prototype.parseJSXExpressionContainer = function () {
	        var node = this.createJSXNode();
	        this.expectJSX('{');
	        var expression;
	        if (this.matchJSX('}')) {
	            expression = this.parseJSXEmptyExpression();
	            this.expectJSX('}');
	        }
	        else {
	            this.finishJSX();
	            expression = this.parseAssignmentExpression();
	            this.reenterJSX();
	        }
	        return this.finalize(node, new JSXNode.JSXExpressionContainer(expression));
	    };
	    JSXParser.prototype.parseJSXChildren = function () {
	        var children = [];
	        while (!this.scanner.eof()) {
	            var node = this.createJSXChildNode();
	            var token = this.nextJSXText();
	            if (token.start < token.end) {
	                var raw = this.getTokenRaw(token);
	                var child = this.finalize(node, new JSXNode.JSXText(token.value, raw));
	                children.push(child);
	            }
	            if (this.scanner.source[this.scanner.index] === '{') {
	                var container = this.parseJSXExpressionContainer();
	                children.push(container);
	            }
	            else {
	                break;
	            }
	        }
	        return children;
	    };
	    JSXParser.prototype.parseComplexJSXElement = function (el) {
	        var stack = [];
	        while (!this.scanner.eof()) {
	            el.children = el.children.concat(this.parseJSXChildren());
	            var node = this.createJSXChildNode();
	            var element = this.parseJSXBoundaryElement();
	            if (element.type === jsx_syntax_1.JSXSyntax.JSXOpeningElement) {
	                var opening = element;
	                if (opening.selfClosing) {
	                    var child = this.finalize(node, new JSXNode.JSXElement(opening, [], null));
	                    el.children.push(child);
	                }
	                else {
	                    stack.push(el);
	                    el = { node: node, opening: opening, closing: null, children: [] };
	                }
	            }
	            if (element.type === jsx_syntax_1.JSXSyntax.JSXClosingElement) {
	                el.closing = element;
	                var open_1 = getQualifiedElementName(el.opening.name);
	                var close_1 = getQualifiedElementName(el.closing.name);
	                if (open_1 !== close_1) {
	                    this.tolerateError('Expected corresponding JSX closing tag for %0', open_1);
	                }
	                if (stack.length > 0) {
	                    var child = this.finalize(el.node, new JSXNode.JSXElement(el.opening, el.children, el.closing));
	                    el = stack[stack.length - 1];
	                    el.children.push(child);
	                    stack.pop();
	                }
	                else {
	                    break;
	                }
	            }
	        }
	        return el;
	    };
	    JSXParser.prototype.parseJSXElement = function () {
	        var node = this.createJSXNode();
	        var opening = this.parseJSXOpeningElement();
	        var children = [];
	        var closing = null;
	        if (!opening.selfClosing) {
	            var el = this.parseComplexJSXElement({ node: node, opening: opening, closing: closing, children: children });
	            children = el.children;
	            closing = el.closing;
	        }
	        return this.finalize(node, new JSXNode.JSXElement(opening, children, closing));
	    };
	    JSXParser.prototype.parseJSXRoot = function () {
	        // Pop the opening '<' added from the lookahead.
	        if (this.config.tokens) {
	            this.tokens.pop();
	        }
	        this.startJSX();
	        var element = this.parseJSXElement();
	        this.finishJSX();
	        return element;
	    };
	    JSXParser.prototype.isStartOfExpression = function () {
	        return _super.prototype.isStartOfExpression.call(this) || this.match('<');
	    };
	    return JSXParser;
	}(parser_1.Parser));
	exports.JSXParser = JSXParser;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// See also tools/generate-unicode-regex.js.
	var Regex = {
	    // Unicode v8.0.0 NonAsciiIdentifierStart:
	    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
	    // Unicode v8.0.0 NonAsciiIdentifierPart:
	    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
	};
	exports.Character = {
	    /* tslint:disable:no-bitwise */
	    fromCodePoint: function (cp) {
	        return (cp < 0x10000) ? String.fromCharCode(cp) :
	            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
	                String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
	    },
	    // https://tc39.github.io/ecma262/#sec-white-space
	    isWhiteSpace: function (cp) {
	        return (cp === 0x20) || (cp === 0x09) || (cp === 0x0B) || (cp === 0x0C) || (cp === 0xA0) ||
	            (cp >= 0x1680 && [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(cp) >= 0);
	    },
	    // https://tc39.github.io/ecma262/#sec-line-terminators
	    isLineTerminator: function (cp) {
	        return (cp === 0x0A) || (cp === 0x0D) || (cp === 0x2028) || (cp === 0x2029);
	    },
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    isIdentifierStart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5F) ||
	            (cp >= 0x41 && cp <= 0x5A) ||
	            (cp >= 0x61 && cp <= 0x7A) ||
	            (cp === 0x5C) ||
	            ((cp >= 0x80) && Regex.NonAsciiIdentifierStart.test(exports.Character.fromCodePoint(cp)));
	    },
	    isIdentifierPart: function (cp) {
	        return (cp === 0x24) || (cp === 0x5F) ||
	            (cp >= 0x41 && cp <= 0x5A) ||
	            (cp >= 0x61 && cp <= 0x7A) ||
	            (cp >= 0x30 && cp <= 0x39) ||
	            (cp === 0x5C) ||
	            ((cp >= 0x80) && Regex.NonAsciiIdentifierPart.test(exports.Character.fromCodePoint(cp)));
	    },
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    isDecimalDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39); // 0..9
	    },
	    isHexDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x39) ||
	            (cp >= 0x41 && cp <= 0x46) ||
	            (cp >= 0x61 && cp <= 0x66); // a..f
	    },
	    isOctalDigit: function (cp) {
	        return (cp >= 0x30 && cp <= 0x37); // 0..7
	    }
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var jsx_syntax_1 = __webpack_require__(6);
	/* tslint:disable:max-classes-per-file */
	var JSXClosingElement = (function () {
	    function JSXClosingElement(name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXClosingElement;
	        this.name = name;
	    }
	    return JSXClosingElement;
	}());
	exports.JSXClosingElement = JSXClosingElement;
	var JSXElement = (function () {
	    function JSXElement(openingElement, children, closingElement) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXElement;
	        this.openingElement = openingElement;
	        this.children = children;
	        this.closingElement = closingElement;
	    }
	    return JSXElement;
	}());
	exports.JSXElement = JSXElement;
	var JSXEmptyExpression = (function () {
	    function JSXEmptyExpression() {
	        this.type = jsx_syntax_1.JSXSyntax.JSXEmptyExpression;
	    }
	    return JSXEmptyExpression;
	}());
	exports.JSXEmptyExpression = JSXEmptyExpression;
	var JSXExpressionContainer = (function () {
	    function JSXExpressionContainer(expression) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXExpressionContainer;
	        this.expression = expression;
	    }
	    return JSXExpressionContainer;
	}());
	exports.JSXExpressionContainer = JSXExpressionContainer;
	var JSXIdentifier = (function () {
	    function JSXIdentifier(name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXIdentifier;
	        this.name = name;
	    }
	    return JSXIdentifier;
	}());
	exports.JSXIdentifier = JSXIdentifier;
	var JSXMemberExpression = (function () {
	    function JSXMemberExpression(object, property) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXMemberExpression;
	        this.object = object;
	        this.property = property;
	    }
	    return JSXMemberExpression;
	}());
	exports.JSXMemberExpression = JSXMemberExpression;
	var JSXAttribute = (function () {
	    function JSXAttribute(name, value) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXAttribute;
	        this.name = name;
	        this.value = value;
	    }
	    return JSXAttribute;
	}());
	exports.JSXAttribute = JSXAttribute;
	var JSXNamespacedName = (function () {
	    function JSXNamespacedName(namespace, name) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXNamespacedName;
	        this.namespace = namespace;
	        this.name = name;
	    }
	    return JSXNamespacedName;
	}());
	exports.JSXNamespacedName = JSXNamespacedName;
	var JSXOpeningElement = (function () {
	    function JSXOpeningElement(name, selfClosing, attributes) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXOpeningElement;
	        this.name = name;
	        this.selfClosing = selfClosing;
	        this.attributes = attributes;
	    }
	    return JSXOpeningElement;
	}());
	exports.JSXOpeningElement = JSXOpeningElement;
	var JSXSpreadAttribute = (function () {
	    function JSXSpreadAttribute(argument) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXSpreadAttribute;
	        this.argument = argument;
	    }
	    return JSXSpreadAttribute;
	}());
	exports.JSXSpreadAttribute = JSXSpreadAttribute;
	var JSXText = (function () {
	    function JSXText(value, raw) {
	        this.type = jsx_syntax_1.JSXSyntax.JSXText;
	        this.value = value;
	        this.raw = raw;
	    }
	    return JSXText;
	}());
	exports.JSXText = JSXText;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JSXSyntax = {
	    JSXAttribute: 'JSXAttribute',
	    JSXClosingElement: 'JSXClosingElement',
	    JSXElement: 'JSXElement',
	    JSXEmptyExpression: 'JSXEmptyExpression',
	    JSXExpressionContainer: 'JSXExpressionContainer',
	    JSXIdentifier: 'JSXIdentifier',
	    JSXMemberExpression: 'JSXMemberExpression',
	    JSXNamespacedName: 'JSXNamespacedName',
	    JSXOpeningElement: 'JSXOpeningElement',
	    JSXSpreadAttribute: 'JSXSpreadAttribute',
	    JSXText: 'JSXText'
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var syntax_1 = __webpack_require__(2);
	/* tslint:disable:max-classes-per-file */
	var ArrayExpression = (function () {
	    function ArrayExpression(elements) {
	        this.type = syntax_1.Syntax.ArrayExpression;
	        this.elements = elements;
	    }
	    return ArrayExpression;
	}());
	exports.ArrayExpression = ArrayExpression;
	var ArrayPattern = (function () {
	    function ArrayPattern(elements) {
	        this.type = syntax_1.Syntax.ArrayPattern;
	        this.elements = elements;
	    }
	    return ArrayPattern;
	}());
	exports.ArrayPattern = ArrayPattern;
	var ArrowFunctionExpression = (function () {
	    function ArrowFunctionExpression(params, body, expression) {
	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = false;
	    }
	    return ArrowFunctionExpression;
	}());
	exports.ArrowFunctionExpression = ArrowFunctionExpression;
	var AssignmentExpression = (function () {
	    function AssignmentExpression(operator, left, right) {
	        this.type = syntax_1.Syntax.AssignmentExpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return AssignmentExpression;
	}());
	exports.AssignmentExpression = AssignmentExpression;
	var AssignmentPattern = (function () {
	    function AssignmentPattern(left, right) {
	        this.type = syntax_1.Syntax.AssignmentPattern;
	        this.left = left;
	        this.right = right;
	    }
	    return AssignmentPattern;
	}());
	exports.AssignmentPattern = AssignmentPattern;
	var AsyncArrowFunctionExpression = (function () {
	    function AsyncArrowFunctionExpression(params, body, expression) {
	        this.type = syntax_1.Syntax.ArrowFunctionExpression;
	        this.id = null;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = expression;
	        this.async = true;
	    }
	    return AsyncArrowFunctionExpression;
	}());
	exports.AsyncArrowFunctionExpression = AsyncArrowFunctionExpression;
	var AsyncFunctionDeclaration = (function () {
	    function AsyncFunctionDeclaration(id, params, body) {
	        this.type = syntax_1.Syntax.FunctionDeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return AsyncFunctionDeclaration;
	}());
	exports.AsyncFunctionDeclaration = AsyncFunctionDeclaration;
	var AsyncFunctionExpression = (function () {
	    function AsyncFunctionExpression(id, params, body) {
	        this.type = syntax_1.Syntax.FunctionExpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = false;
	        this.expression = false;
	        this.async = true;
	    }
	    return AsyncFunctionExpression;
	}());
	exports.AsyncFunctionExpression = AsyncFunctionExpression;
	var AwaitExpression = (function () {
	    function AwaitExpression(argument) {
	        this.type = syntax_1.Syntax.AwaitExpression;
	        this.argument = argument;
	    }
	    return AwaitExpression;
	}());
	exports.AwaitExpression = AwaitExpression;
	var BinaryExpression = (function () {
	    function BinaryExpression(operator, left, right) {
	        var logical = (operator === '||' || operator === '&&');
	        this.type = logical ? syntax_1.Syntax.LogicalExpression : syntax_1.Syntax.BinaryExpression;
	        this.operator = operator;
	        this.left = left;
	        this.right = right;
	    }
	    return BinaryExpression;
	}());
	exports.BinaryExpression = BinaryExpression;
	var BlockStatement = (function () {
	    function BlockStatement(body) {
	        this.type = syntax_1.Syntax.BlockStatement;
	        this.body = body;
	    }
	    return BlockStatement;
	}());
	exports.BlockStatement = BlockStatement;
	var BreakStatement = (function () {
	    function BreakStatement(label) {
	        this.type = syntax_1.Syntax.BreakStatement;
	        this.label = label;
	    }
	    return BreakStatement;
	}());
	exports.BreakStatement = BreakStatement;
	var CallExpression = (function () {
	    function CallExpression(callee, args) {
	        this.type = syntax_1.Syntax.CallExpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return CallExpression;
	}());
	exports.CallExpression = CallExpression;
	var CatchClause = (function () {
	    function CatchClause(param, body) {
	        this.type = syntax_1.Syntax.CatchClause;
	        this.param = param;
	        this.body = body;
	    }
	    return CatchClause;
	}());
	exports.CatchClause = CatchClause;
	var ClassBody = (function () {
	    function ClassBody(body) {
	        this.type = syntax_1.Syntax.ClassBody;
	        this.body = body;
	    }
	    return ClassBody;
	}());
	exports.ClassBody = ClassBody;
	var ClassDeclaration = (function () {
	    function ClassDeclaration(id, superClass, body) {
	        this.type = syntax_1.Syntax.ClassDeclaration;
	        this.id = id;
	        this.superClass = superClass;
	        this.body = body;
	    }
	    return ClassDeclaration;
	}());
	exports.ClassDeclaration = ClassDeclaration;
	var ClassExpression = (function () {
	    function ClassExpression(id, superClass, body) {
	        this.type = syntax_1.Syntax.ClassExpression;
	        this.id = id;
	        this.superClass = superClass;
	        this.body = body;
	    }
	    return ClassExpression;
	}());
	exports.ClassExpression = ClassExpression;
	var ComputedMemberExpression = (function () {
	    function ComputedMemberExpression(object, property) {
	        this.type = syntax_1.Syntax.MemberExpression;
	        this.computed = true;
	        this.object = object;
	        this.property = property;
	    }
	    return ComputedMemberExpression;
	}());
	exports.ComputedMemberExpression = ComputedMemberExpression;
	var ConditionalExpression = (function () {
	    function ConditionalExpression(test, consequent, alternate) {
	        this.type = syntax_1.Syntax.ConditionalExpression;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return ConditionalExpression;
	}());
	exports.ConditionalExpression = ConditionalExpression;
	var ContinueStatement = (function () {
	    function ContinueStatement(label) {
	        this.type = syntax_1.Syntax.ContinueStatement;
	        this.label = label;
	    }
	    return ContinueStatement;
	}());
	exports.ContinueStatement = ContinueStatement;
	var DebuggerStatement = (function () {
	    function DebuggerStatement() {
	        this.type = syntax_1.Syntax.DebuggerStatement;
	    }
	    return DebuggerStatement;
	}());
	exports.DebuggerStatement = DebuggerStatement;
	var Directive = (function () {
	    function Directive(expression, directive) {
	        this.type = syntax_1.Syntax.ExpressionStatement;
	        this.expression = expression;
	        this.directive = directive;
	    }
	    return Directive;
	}());
	exports.Directive = Directive;
	var DoWhileStatement = (function () {
	    function DoWhileStatement(body, test) {
	        this.type = syntax_1.Syntax.DoWhileStatement;
	        this.body = body;
	        this.test = test;
	    }
	    return DoWhileStatement;
	}());
	exports.DoWhileStatement = DoWhileStatement;
	var EmptyStatement = (function () {
	    function EmptyStatement() {
	        this.type = syntax_1.Syntax.EmptyStatement;
	    }
	    return EmptyStatement;
	}());
	exports.EmptyStatement = EmptyStatement;
	var ExportAllDeclaration = (function () {
	    function ExportAllDeclaration(source) {
	        this.type = syntax_1.Syntax.ExportAllDeclaration;
	        this.source = source;
	    }
	    return ExportAllDeclaration;
	}());
	exports.ExportAllDeclaration = ExportAllDeclaration;
	var ExportDefaultDeclaration = (function () {
	    function ExportDefaultDeclaration(declaration) {
	        this.type = syntax_1.Syntax.ExportDefaultDeclaration;
	        this.declaration = declaration;
	    }
	    return ExportDefaultDeclaration;
	}());
	exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
	var ExportNamedDeclaration = (function () {
	    function ExportNamedDeclaration(declaration, specifiers, source) {
	        this.type = syntax_1.Syntax.ExportNamedDeclaration;
	        this.declaration = declaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return ExportNamedDeclaration;
	}());
	exports.ExportNamedDeclaration = ExportNamedDeclaration;
	var ExportSpecifier = (function () {
	    function ExportSpecifier(local, exported) {
	        this.type = syntax_1.Syntax.ExportSpecifier;
	        this.exported = exported;
	        this.local = local;
	    }
	    return ExportSpecifier;
	}());
	exports.ExportSpecifier = ExportSpecifier;
	var ExpressionStatement = (function () {
	    function ExpressionStatement(expression) {
	        this.type = syntax_1.Syntax.ExpressionStatement;
	        this.expression = expression;
	    }
	    return ExpressionStatement;
	}());
	exports.ExpressionStatement = ExpressionStatement;
	var ForInStatement = (function () {
	    function ForInStatement(left, right, body) {
	        this.type = syntax_1.Syntax.ForInStatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	        this.each = false;
	    }
	    return ForInStatement;
	}());
	exports.ForInStatement = ForInStatement;
	var ForOfStatement = (function () {
	    function ForOfStatement(left, right, body) {
	        this.type = syntax_1.Syntax.ForOfStatement;
	        this.left = left;
	        this.right = right;
	        this.body = body;
	    }
	    return ForOfStatement;
	}());
	exports.ForOfStatement = ForOfStatement;
	var ForStatement = (function () {
	    function ForStatement(init, test, update, body) {
	        this.type = syntax_1.Syntax.ForStatement;
	        this.init = init;
	        this.test = test;
	        this.update = update;
	        this.body = body;
	    }
	    return ForStatement;
	}());
	exports.ForStatement = ForStatement;
	var FunctionDeclaration = (function () {
	    function FunctionDeclaration(id, params, body, generator) {
	        this.type = syntax_1.Syntax.FunctionDeclaration;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return FunctionDeclaration;
	}());
	exports.FunctionDeclaration = FunctionDeclaration;
	var FunctionExpression = (function () {
	    function FunctionExpression(id, params, body, generator) {
	        this.type = syntax_1.Syntax.FunctionExpression;
	        this.id = id;
	        this.params = params;
	        this.body = body;
	        this.generator = generator;
	        this.expression = false;
	        this.async = false;
	    }
	    return FunctionExpression;
	}());
	exports.FunctionExpression = FunctionExpression;
	var Identifier = (function () {
	    function Identifier(name) {
	        this.type = syntax_1.Syntax.Identifier;
	        this.name = name;
	    }
	    return Identifier;
	}());
	exports.Identifier = Identifier;
	var IfStatement = (function () {
	    function IfStatement(test, consequent, alternate) {
	        this.type = syntax_1.Syntax.IfStatement;
	        this.test = test;
	        this.consequent = consequent;
	        this.alternate = alternate;
	    }
	    return IfStatement;
	}());
	exports.IfStatement = IfStatement;
	var ImportDeclaration = (function () {
	    function ImportDeclaration(specifiers, source) {
	        this.type = syntax_1.Syntax.ImportDeclaration;
	        this.specifiers = specifiers;
	        this.source = source;
	    }
	    return ImportDeclaration;
	}());
	exports.ImportDeclaration = ImportDeclaration;
	var ImportDefaultSpecifier = (function () {
	    function ImportDefaultSpecifier(local) {
	        this.type = syntax_1.Syntax.ImportDefaultSpecifier;
	        this.local = local;
	    }
	    return ImportDefaultSpecifier;
	}());
	exports.ImportDefaultSpecifier = ImportDefaultSpecifier;
	var ImportNamespaceSpecifier = (function () {
	    function ImportNamespaceSpecifier(local) {
	        this.type = syntax_1.Syntax.ImportNamespaceSpecifier;
	        this.local = local;
	    }
	    return ImportNamespaceSpecifier;
	}());
	exports.ImportNamespaceSpecifier = ImportNamespaceSpecifier;
	var ImportSpecifier = (function () {
	    function ImportSpecifier(local, imported) {
	        this.type = syntax_1.Syntax.ImportSpecifier;
	        this.local = local;
	        this.imported = imported;
	    }
	    return ImportSpecifier;
	}());
	exports.ImportSpecifier = ImportSpecifier;
	var LabeledStatement = (function () {
	    function LabeledStatement(label, body) {
	        this.type = syntax_1.Syntax.LabeledStatement;
	        this.label = label;
	        this.body = body;
	    }
	    return LabeledStatement;
	}());
	exports.LabeledStatement = LabeledStatement;
	var Literal = (function () {
	    function Literal(value, raw) {
	        this.type = syntax_1.Syntax.Literal;
	        this.value = value;
	        this.raw = raw;
	    }
	    return Literal;
	}());
	exports.Literal = Literal;
	var MetaProperty = (function () {
	    function MetaProperty(meta, property) {
	        this.type = syntax_1.Syntax.MetaProperty;
	        this.meta = meta;
	        this.property = property;
	    }
	    return MetaProperty;
	}());
	exports.MetaProperty = MetaProperty;
	var MethodDefinition = (function () {
	    function MethodDefinition(key, computed, value, kind, isStatic) {
	        this.type = syntax_1.Syntax.MethodDefinition;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.static = isStatic;
	    }
	    return MethodDefinition;
	}());
	exports.MethodDefinition = MethodDefinition;
	var Module = (function () {
	    function Module(body) {
	        this.type = syntax_1.Syntax.Program;
	        this.body = body;
	        this.sourceType = 'module';
	    }
	    return Module;
	}());
	exports.Module = Module;
	var NewExpression = (function () {
	    function NewExpression(callee, args) {
	        this.type = syntax_1.Syntax.NewExpression;
	        this.callee = callee;
	        this.arguments = args;
	    }
	    return NewExpression;
	}());
	exports.NewExpression = NewExpression;
	var ObjectExpression = (function () {
	    function ObjectExpression(properties) {
	        this.type = syntax_1.Syntax.ObjectExpression;
	        this.properties = properties;
	    }
	    return ObjectExpression;
	}());
	exports.ObjectExpression = ObjectExpression;
	var ObjectPattern = (function () {
	    function ObjectPattern(properties) {
	        this.type = syntax_1.Syntax.ObjectPattern;
	        this.properties = properties;
	    }
	    return ObjectPattern;
	}());
	exports.ObjectPattern = ObjectPattern;
	var Property = (function () {
	    function Property(kind, key, computed, value, method, shorthand) {
	        this.type = syntax_1.Syntax.Property;
	        this.key = key;
	        this.computed = computed;
	        this.value = value;
	        this.kind = kind;
	        this.method = method;
	        this.shorthand = shorthand;
	    }
	    return Property;
	}());
	exports.Property = Property;
	var RegexLiteral = (function () {
	    function RegexLiteral(value, raw, pattern, flags) {
	        this.type = syntax_1.Syntax.Literal;
	        this.value = value;
	        this.raw = raw;
	        this.regex = { pattern: pattern, flags: flags };
	    }
	    return RegexLiteral;
	}());
	exports.RegexLiteral = RegexLiteral;
	var RestElement = (function () {
	    function RestElement(argument) {
	        this.type = syntax_1.Syntax.RestElement;
	        this.argument = argument;
	    }
	    return RestElement;
	}());
	exports.RestElement = RestElement;
	var ReturnStatement = (function () {
	    function ReturnStatement(argument) {
	        this.type = syntax_1.Syntax.ReturnStatement;
	        this.argument = argument;
	    }
	    return ReturnStatement;
	}());
	exports.ReturnStatement = ReturnStatement;
	var Script = (function () {
	    function Script(body) {
	        this.type = syntax_1.Syntax.Program;
	        this.body = body;
	        this.sourceType = 'script';
	    }
	    return Script;
	}());
	exports.Script = Script;
	var SequenceExpression = (function () {
	    function SequenceExpression(expressions) {
	        this.type = syntax_1.Syntax.SequenceExpression;
	        this.expressions = expressions;
	    }
	    return SequenceExpression;
	}());
	exports.SequenceExpression = SequenceExpression;
	var SpreadElement = (function () {
	    function SpreadElement(argument) {
	        this.type = syntax_1.Syntax.SpreadElement;
	        this.argument = argument;
	    }
	    return SpreadElement;
	}());
	exports.SpreadElement = SpreadElement;
	var StaticMemberExpression = (function () {
	    function StaticMemberExpression(object, property) {
	        this.type = syntax_1.Syntax.MemberExpression;
	        this.computed = false;
	        this.object = object;
	        this.property = property;
	    }
	    return StaticMemberExpression;
	}());
	exports.StaticMemberExpression = StaticMemberExpression;
	var Super = (function () {
	    function Super() {
	        this.type = syntax_1.Syntax.Super;
	    }
	    return Super;
	}());
	exports.Super = Super;
	var SwitchCase = (function () {
	    function SwitchCase(test, consequent) {
	        this.type = syntax_1.Syntax.SwitchCase;
	        this.test = test;
	        this.consequent = consequent;
	    }
	    return SwitchCase;
	}());
	exports.SwitchCase = SwitchCase;
	var SwitchStatement = (function () {
	    function SwitchStatement(discriminant, cases) {
	        this.type = syntax_1.Syntax.SwitchStatement;
	        this.discriminant = discriminant;
	        this.cases = cases;
	    }
	    return SwitchStatement;
	}());
	exports.SwitchStatement = SwitchStatement;
	var TaggedTemplateExpression = (function () {
	    function TaggedTemplateExpression(tag, quasi) {
	        this.type = syntax_1.Syntax.TaggedTemplateExpression;
	        this.tag = tag;
	        this.quasi = quasi;
	    }
	    return TaggedTemplateExpression;
	}());
	exports.TaggedTemplateExpression = TaggedTemplateExpression;
	var TemplateElement = (function () {
	    function TemplateElement(value, tail) {
	        this.type = syntax_1.Syntax.TemplateElement;
	        this.value = value;
	        this.tail = tail;
	    }
	    return TemplateElement;
	}());
	exports.TemplateElement = TemplateElement;
	var TemplateLiteral = (function () {
	    function TemplateLiteral(quasis, expressions) {
	        this.type = syntax_1.Syntax.TemplateLiteral;
	        this.quasis = quasis;
	        this.expressions = expressions;
	    }
	    return TemplateLiteral;
	}());
	exports.TemplateLiteral = TemplateLiteral;
	var ThisExpression = (function () {
	    function ThisExpression() {
	        this.type = syntax_1.Syntax.ThisExpression;
	    }
	    return ThisExpression;
	}());
	exports.ThisExpression = ThisExpression;
	var ThrowStatement = (function () {
	    function ThrowStatement(argument) {
	        this.type = syntax_1.Syntax.ThrowStatement;
	        this.argument = argument;
	    }
	    return ThrowStatement;
	}());
	exports.ThrowStatement = ThrowStatement;
	var TryStatement = (function () {
	    function TryStatement(block, handler, finalizer) {
	        this.type = syntax_1.Syntax.TryStatement;
	        this.block = block;
	        this.handler = handler;
	        this.finalizer = finalizer;
	    }
	    return TryStatement;
	}());
	exports.TryStatement = TryStatement;
	var UnaryExpression = (function () {
	    function UnaryExpression(operator, argument) {
	        this.type = syntax_1.Syntax.UnaryExpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = true;
	    }
	    return UnaryExpression;
	}());
	exports.UnaryExpression = UnaryExpression;
	var UpdateExpression = (function () {
	    function UpdateExpression(operator, argument, prefix) {
	        this.type = syntax_1.Syntax.UpdateExpression;
	        this.operator = operator;
	        this.argument = argument;
	        this.prefix = prefix;
	    }
	    return UpdateExpression;
	}());
	exports.UpdateExpression = UpdateExpression;
	var VariableDeclaration = (function () {
	    function VariableDeclaration(declarations, kind) {
	        this.type = syntax_1.Syntax.VariableDeclaration;
	        this.declarations = declarations;
	        this.kind = kind;
	    }
	    return VariableDeclaration;
	}());
	exports.VariableDeclaration = VariableDeclaration;
	var VariableDeclarator = (function () {
	    function VariableDeclarator(id, init) {
	        this.type = syntax_1.Syntax.VariableDeclarator;
	        this.id = id;
	        this.init = init;
	    }
	    return VariableDeclarator;
	}());
	exports.VariableDeclarator = VariableDeclarator;
	var WhileStatement = (function () {
	    function WhileStatement(test, body) {
	        this.type = syntax_1.Syntax.WhileStatement;
	        this.test = test;
	        this.body = body;
	    }
	    return WhileStatement;
	}());
	exports.WhileStatement = WhileStatement;
	var WithStatement = (function () {
	    function WithStatement(object, body) {
	        this.type = syntax_1.Syntax.WithStatement;
	        this.object = object;
	        this.body = body;
	    }
	    return WithStatement;
	}());
	exports.WithStatement = WithStatement;
	var YieldExpression = (function () {
	    function YieldExpression(argument, delegate) {
	        this.type = syntax_1.Syntax.YieldExpression;
	        this.argument = argument;
	        this.delegate = delegate;
	    }
	    return YieldExpression;
	}());
	exports.YieldExpression = YieldExpression;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var assert_1 = __webpack_require__(9);
	var error_handler_1 = __webpack_require__(10);
	var messages_1 = __webpack_require__(11);
	var Node = __webpack_require__(7);
	var scanner_1 = __webpack_require__(12);
	var syntax_1 = __webpack_require__(2);
	var token_1 = __webpack_require__(13);
	var ArrowParameterPlaceHolder = 'ArrowParameterPlaceHolder';
	var Parser = (function () {
	    function Parser(code, options, delegate) {
	        if (options === void 0) { options = {}; }
	        this.config = {
	            range: (typeof options.range === 'boolean') && options.range,
	            loc: (typeof options.loc === 'boolean') && options.loc,
	            source: null,
	            tokens: (typeof options.tokens === 'boolean') && options.tokens,
	            comment: (typeof options.comment === 'boolean') && options.comment,
	            tolerant: (typeof options.tolerant === 'boolean') && options.tolerant
	        };
	        if (this.config.loc && options.source && options.source !== null) {
	            this.config.source = String(options.source);
	        }
	        this.delegate = delegate;
	        this.errorHandler = new error_handler_1.ErrorHandler();
	        this.errorHandler.tolerant = this.config.tolerant;
	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
	        this.scanner.trackComment = this.config.comment;
	        this.operatorPrecedence = {
	            ')': 0,
	            ';': 0,
	            ',': 0,
	            '=': 0,
	            ']': 0,
	            '||': 1,
	            '&&': 2,
	            '|': 3,
	            '^': 4,
	            '&': 5,
	            '==': 6,
	            '!=': 6,
	            '===': 6,
	            '!==': 6,
	            '<': 7,
	            '>': 7,
	            '<=': 7,
	            '>=': 7,
	            '<<': 8,
	            '>>': 8,
	            '>>>': 8,
	            '+': 9,
	            '-': 9,
	            '*': 11,
	            '/': 11,
	            '%': 11
	        };
	        this.lookahead = {
	            type: 2 /* EOF */,
	            value: '',
	            lineNumber: this.scanner.lineNumber,
	            lineStart: 0,
	            start: 0,
	            end: 0
	        };
	        this.hasLineTerminator = false;
	        this.context = {
	            isModule: false,
	            await: false,
	            allowIn: true,
	            allowStrictDirective: true,
	            allowYield: true,
	            firstCoverInitializedNameError: null,
	            isAssignmentTarget: false,
	            isBindingElement: false,
	            inFunctionBody: false,
	            inIteration: false,
	            inSwitch: false,
	            labelSet: {},
	            strict: false
	        };
	        this.tokens = [];
	        this.startMarker = {
	            index: 0,
	            line: this.scanner.lineNumber,
	            column: 0
	        };
	        this.lastMarker = {
	            index: 0,
	            line: this.scanner.lineNumber,
	            column: 0
	        };
	        this.nextToken();
	        this.lastMarker = {
	            index: this.scanner.index,
	            line: this.scanner.lineNumber,
	            column: this.scanner.index - this.scanner.lineStart
	        };
	    }
	    Parser.prototype.throwError = function (messageFormat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = Array.prototype.slice.call(arguments, 1);
	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastMarker.index;
	        var line = this.lastMarker.line;
	        var column = this.lastMarker.column + 1;
	        throw this.errorHandler.createError(index, line, column, msg);
	    };
	    Parser.prototype.tolerateError = function (messageFormat) {
	        var values = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            values[_i - 1] = arguments[_i];
	        }
	        var args = Array.prototype.slice.call(arguments, 1);
	        var msg = messageFormat.replace(/%(\d)/g, function (whole, idx) {
	            assert_1.assert(idx < args.length, 'Message reference must be in range');
	            return args[idx];
	        });
	        var index = this.lastMarker.index;
	        var line = this.scanner.lineNumber;
	        var column = this.lastMarker.column + 1;
	        this.errorHandler.tolerateError(index, line, column, msg);
	    };
	    // Throw an exception because of the token.
	    Parser.prototype.unexpectedTokenError = function (token, message) {
	        var msg = message || messages_1.Messages.UnexpectedToken;
	        var value;
	        if (token) {
	            if (!message) {
	                msg = (token.type === 2 /* EOF */) ? messages_1.Messages.UnexpectedEOS :
	                    (token.type === 3 /* Identifier */) ? messages_1.Messages.UnexpectedIdentifier :
	                        (token.type === 6 /* NumericLiteral */) ? messages_1.Messages.UnexpectedNumber :
	                            (token.type === 8 /* StringLiteral */) ? messages_1.Messages.UnexpectedString :
	                                (token.type === 10 /* Template */) ? messages_1.Messages.UnexpectedTemplate :
	                                    messages_1.Messages.UnexpectedToken;
	                if (token.type === 4 /* Keyword */) {
	                    if (this.scanner.isFutureReservedWord(token.value)) {
	                        msg = messages_1.Messages.UnexpectedReserved;
	                    }
	                    else if (this.context.strict && this.scanner.isStrictModeReservedWord(token.value)) {
	                        msg = messages_1.Messages.StrictReservedWord;
	                    }
	                }
	            }
	            value = token.value;
	        }
	        else {
	            value = 'ILLEGAL';
	        }
	        msg = msg.replace('%0', value);
	        if (token && typeof token.lineNumber === 'number') {
	            var index = token.start;
	            var line = token.lineNumber;
	            var lastMarkerLineStart = this.lastMarker.index - this.lastMarker.column;
	            var column = token.start - lastMarkerLineStart + 1;
	            return this.errorHandler.createError(index, line, column, msg);
	        }
	        else {
	            var index = this.lastMarker.index;
	            var line = this.lastMarker.line;
	            var column = this.lastMarker.column + 1;
	            return this.errorHandler.createError(index, line, column, msg);
	        }
	    };
	    Parser.prototype.throwUnexpectedToken = function (token, message) {
	        throw this.unexpectedTokenError(token, message);
	    };
	    Parser.prototype.tolerateUnexpectedToken = function (token, message) {
	        this.errorHandler.tolerate(this.unexpectedTokenError(token, message));
	    };
	    Parser.prototype.collectComments = function () {
	        if (!this.config.comment) {
	            this.scanner.scanComments();
	        }
	        else {
	            var comments = this.scanner.scanComments();
	            if (comments.length > 0 && this.delegate) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var node = void 0;
	                    node = {
	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
	                        value: this.scanner.source.slice(e.slice[0], e.slice[1])
	                    };
	                    if (this.config.range) {
	                        node.range = e.range;
	                    }
	                    if (this.config.loc) {
	                        node.loc = e.loc;
	                    }
	                    var metadata = {
	                        start: {
	                            line: e.loc.start.line,
	                            column: e.loc.start.column,
	                            offset: e.range[0]
	                        },
	                        end: {
	                            line: e.loc.end.line,
	                            column: e.loc.end.column,
	                            offset: e.range[1]
	                        }
	                    };
	                    this.delegate(node, metadata);
	                }
	            }
	        }
	    };
	    // From internal representation to an external structure
	    Parser.prototype.getTokenRaw = function (token) {
	        return this.scanner.source.slice(token.start, token.end);
	    };
	    Parser.prototype.convertToken = function (token) {
	        var t = {
	            type: token_1.TokenName[token.type],
	            value: this.getTokenRaw(token)
	        };
	        if (this.config.range) {
	            t.range = [token.start, token.end];
	        }
	        if (this.config.loc) {
	            t.loc = {
	                start: {
	                    line: this.startMarker.line,
	                    column: this.startMarker.column
	                },
	                end: {
	                    line: this.scanner.lineNumber,
	                    column: this.scanner.index - this.scanner.lineStart
	                }
	            };
	        }
	        if (token.type === 9 /* RegularExpression */) {
	            var pattern = token.pattern;
	            var flags = token.flags;
	            t.regex = { pattern: pattern, flags: flags };
	        }
	        return t;
	    };
	    Parser.prototype.nextToken = function () {
	        var token = this.lookahead;
	        this.lastMarker.index = this.scanner.index;
	        this.lastMarker.line = this.scanner.lineNumber;
	        this.lastMarker.column = this.scanner.index - this.scanner.lineStart;
	        this.collectComments();
	        if (this.scanner.index !== this.startMarker.index) {
	            this.startMarker.index = this.scanner.index;
	            this.startMarker.line = this.scanner.lineNumber;
	            this.startMarker.column = this.scanner.index - this.scanner.lineStart;
	        }
	        var next = this.scanner.lex();
	        this.hasLineTerminator = (token.lineNumber !== next.lineNumber);
	        if (next && this.context.strict && next.type === 3 /* Identifier */) {
	            if (this.scanner.isStrictModeReservedWord(next.value)) {
	                next.type = 4 /* Keyword */;
	            }
	        }
	        this.lookahead = next;
	        if (this.config.tokens && next.type !== 2 /* EOF */) {
	            this.tokens.push(this.convertToken(next));
	        }
	        return token;
	    };
	    Parser.prototype.nextRegexToken = function () {
	        this.collectComments();
	        var token = this.scanner.scanRegExp();
	        if (this.config.tokens) {
	            // Pop the previous token, '/' or '/='
	            // This is added from the lookahead token.
	            this.tokens.pop();
	            this.tokens.push(this.convertToken(token));
	        }
	        // Prime the next lookahead.
	        this.lookahead = token;
	        this.nextToken();
	        return token;
	    };
	    Parser.prototype.createNode = function () {
	        return {
	            index: this.startMarker.index,
	            line: this.startMarker.line,
	            column: this.startMarker.column
	        };
	    };
	    Parser.prototype.startNode = function (token) {
	        return {
	            index: token.start,
	            line: token.lineNumber,
	            column: token.start - token.lineStart
	        };
	    };
	    Parser.prototype.finalize = function (marker, node) {
	        if (this.config.range) {
	            node.range = [marker.index, this.lastMarker.index];
	        }
	        if (this.config.loc) {
	            node.loc = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                },
	                end: {
	                    line: this.lastMarker.line,
	                    column: this.lastMarker.column
	                }
	            };
	            if (this.config.source) {
	                node.loc.source = this.config.source;
	            }
	        }
	        if (this.delegate) {
	            var metadata = {
	                start: {
	                    line: marker.line,
	                    column: marker.column,
	                    offset: marker.index
	                },
	                end: {
	                    line: this.lastMarker.line,
	                    column: this.lastMarker.column,
	                    offset: this.lastMarker.index
	                }
	            };
	            this.delegate(node, metadata);
	        }
	        return node;
	    };
	    // Expect the next token to match the specified punctuator.
	    // If not, an exception will be thrown.
	    Parser.prototype.expect = function (value) {
	        var token = this.nextToken();
	        if (token.type !== 7 /* Punctuator */ || token.value !== value) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Quietly expect a comma when in tolerant mode, otherwise delegates to expect().
	    Parser.prototype.expectCommaSeparator = function () {
	        if (this.config.tolerant) {
	            var token = this.lookahead;
	            if (token.type === 7 /* Punctuator */ && token.value === ',') {
	                this.nextToken();
	            }
	            else if (token.type === 7 /* Punctuator */ && token.value === ';') {
	                this.nextToken();
	                this.tolerateUnexpectedToken(token);
	            }
	            else {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.UnexpectedToken);
	            }
	        }
	        else {
	            this.expect(',');
	        }
	    };
	    // Expect the next token to match the specified keyword.
	    // If not, an exception will be thrown.
	    Parser.prototype.expectKeyword = function (keyword) {
	        var token = this.nextToken();
	        if (token.type !== 4 /* Keyword */ || token.value !== keyword) {
	            this.throwUnexpectedToken(token);
	        }
	    };
	    // Return true if the next token matches the specified punctuator.
	    Parser.prototype.match = function (value) {
	        return this.lookahead.type === 7 /* Punctuator */ && this.lookahead.value === value;
	    };
	    // Return true if the next token matches the specified keyword
	    Parser.prototype.matchKeyword = function (keyword) {
	        return this.lookahead.type === 4 /* Keyword */ && this.lookahead.value === keyword;
	    };
	    // Return true if the next token matches the specified contextual keyword
	    // (where an identifier is sometimes a keyword depending on the context)
	    Parser.prototype.matchContextualKeyword = function (keyword) {
	        return this.lookahead.type === 3 /* Identifier */ && this.lookahead.value === keyword;
	    };
	    // Return true if the next token is an assignment operator
	    Parser.prototype.matchAssign = function () {
	        if (this.lookahead.type !== 7 /* Punctuator */) {
	            return false;
	        }
	        var op = this.lookahead.value;
	        return op === '=' ||
	            op === '*=' ||
	            op === '**=' ||
	            op === '/=' ||
	            op === '%=' ||
	            op === '+=' ||
	            op === '-=' ||
	            op === '<<=' ||
	            op === '>>=' ||
	            op === '>>>=' ||
	            op === '&=' ||
	            op === '^=' ||
	            op === '|=';
	    };
	    // Cover grammar support.
	    //
	    // When an assignment expression position starts with an left parenthesis, the determination of the type
	    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
	    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
	    //
	    // There are three productions that can be parsed in a parentheses pair that needs to be determined
	    // after the outermost pair is closed. They are:
	    //
	    //   1. AssignmentExpression
	    //   2. BindingElements
	    //   3. AssignmentTargets
	    //
	    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
	    // binding element or assignment target.
	    //
	    // The three productions have the relationship:
	    //
	    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
	    //
	    // with a single exception that CoverInitializedName when used directly in an Expression, generates
	    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
	    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
	    //
	    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
	    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
	    // the CoverInitializedName check is conducted.
	    //
	    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
	    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
	    // pattern. The CoverInitializedName check is deferred.
	    Parser.prototype.isolateCoverGrammar = function (parseFunction) {
	        var previousIsBindingElement = this.context.isBindingElement;
	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
	        this.context.isBindingElement = true;
	        this.context.isAssignmentTarget = true;
	        this.context.firstCoverInitializedNameError = null;
	        var result = parseFunction.call(this);
	        if (this.context.firstCoverInitializedNameError !== null) {
	            this.throwUnexpectedToken(this.context.firstCoverInitializedNameError);
	        }
	        this.context.isBindingElement = previousIsBindingElement;
	        this.context.isAssignmentTarget = previousIsAssignmentTarget;
	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError;
	        return result;
	    };
	    Parser.prototype.inheritCoverGrammar = function (parseFunction) {
	        var previousIsBindingElement = this.context.isBindingElement;
	        var previousIsAssignmentTarget = this.context.isAssignmentTarget;
	        var previousFirstCoverInitializedNameError = this.context.firstCoverInitializedNameError;
	        this.context.isBindingElement = true;
	        this.context.isAssignmentTarget = true;
	        this.context.firstCoverInitializedNameError = null;
	        var result = parseFunction.call(this);
	        this.context.isBindingElement = this.context.isBindingElement && previousIsBindingElement;
	        this.context.isAssignmentTarget = this.context.isAssignmentTarget && previousIsAssignmentTarget;
	        this.context.firstCoverInitializedNameError = previousFirstCoverInitializedNameError || this.context.firstCoverInitializedNameError;
	        return result;
	    };
	    Parser.prototype.consumeSemicolon = function () {
	        if (this.match(';')) {
	            this.nextToken();
	        }
	        else if (!this.hasLineTerminator) {
	            if (this.lookahead.type !== 2 /* EOF */ && !this.match('}')) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            this.lastMarker.index = this.startMarker.index;
	            this.lastMarker.line = this.startMarker.line;
	            this.lastMarker.column = this.startMarker.column;
	        }
	    };
	    // https://tc39.github.io/ecma262/#sec-primary-expression
	    Parser.prototype.parsePrimaryExpression = function () {
	        var node = this.createNode();
	        var expr;
	        var token, raw;
	        switch (this.lookahead.type) {
	            case 3 /* Identifier */:
	                if ((this.context.isModule || this.context.await) && this.lookahead.value === 'await') {
	                    this.tolerateUnexpectedToken(this.lookahead);
	                }
	                expr = this.matchAsyncFunction() ? this.parseFunctionExpression() : this.finalize(node, new Node.Identifier(this.nextToken().value));
	                break;
	            case 6 /* NumericLiteral */:
	            case 8 /* StringLiteral */:
	                if (this.context.strict && this.lookahead.octal) {
	                    this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.StrictOctalLiteral);
	                }
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(token.value, raw));
	                break;
	            case 1 /* BooleanLiteral */:
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(token.value === 'true', raw));
	                break;
	            case 5 /* NullLiteral */:
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                token = this.nextToken();
	                raw = this.getTokenRaw(token);
	                expr = this.finalize(node, new Node.Literal(null, raw));
	                break;
	            case 10 /* Template */:
	                expr = this.parseTemplateLiteral();
	                break;
	            case 7 /* Punctuator */:
	                switch (this.lookahead.value) {
	                    case '(':
	                        this.context.isBindingElement = false;
	                        expr = this.inheritCoverGrammar(this.parseGroupExpression);
	                        break;
	                    case '[':
	                        expr = this.inheritCoverGrammar(this.parseArrayInitializer);
	                        break;
	                    case '{':
	                        expr = this.inheritCoverGrammar(this.parseObjectInitializer);
	                        break;
	                    case '/':
	                    case '/=':
	                        this.context.isAssignmentTarget = false;
	                        this.context.isBindingElement = false;
	                        this.scanner.index = this.startMarker.index;
	                        token = this.nextRegexToken();
	                        raw = this.getTokenRaw(token);
	                        expr = this.finalize(node, new Node.RegexLiteral(token.regex, raw, token.pattern, token.flags));
	                        break;
	                    default:
	                        expr = this.throwUnexpectedToken(this.nextToken());
	                }
	                break;
	            case 4 /* Keyword */:
	                if (!this.context.strict && this.context.allowYield && this.matchKeyword('yield')) {
	                    expr = this.parseIdentifierName();
	                }
	                else if (!this.context.strict && this.matchKeyword('let')) {
	                    expr = this.finalize(node, new Node.Identifier(this.nextToken().value));
	                }
	                else {
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    if (this.matchKeyword('function')) {
	                        expr = this.parseFunctionExpression();
	                    }
	                    else if (this.matchKeyword('this')) {
	                        this.nextToken();
	                        expr = this.finalize(node, new Node.ThisExpression());
	                    }
	                    else if (this.matchKeyword('class')) {
	                        expr = this.parseClassExpression();
	                    }
	                    else {
	                        expr = this.throwUnexpectedToken(this.nextToken());
	                    }
	                }
	                break;
	            default:
	                expr = this.throwUnexpectedToken(this.nextToken());
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-array-initializer
	    Parser.prototype.parseSpreadElement = function () {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.inheritCoverGrammar(this.parseAssignmentExpression);
	        return this.finalize(node, new Node.SpreadElement(arg));
	    };
	    Parser.prototype.parseArrayInitializer = function () {
	        var node = this.createNode();
	        var elements = [];
	        this.expect('[');
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nextToken();
	                elements.push(null);
	            }
	            else if (this.match('...')) {
	                var element = this.parseSpreadElement();
	                if (!this.match(']')) {
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    this.expect(',');
	                }
	                elements.push(element);
	            }
	            else {
	                elements.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new Node.ArrayExpression(elements));
	    };
	    // https://tc39.github.io/ecma262/#sec-object-initializer
	    Parser.prototype.parsePropertyMethod = function (params) {
	        this.context.isAssignmentTarget = false;
	        this.context.isBindingElement = false;
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = params.simple;
	        var body = this.isolateCoverGrammar(this.parseFunctionSourceElements);
	        if (this.context.strict && params.firstRestricted) {
	            this.tolerateUnexpectedToken(params.firstRestricted, params.message);
	        }
	        if (this.context.strict && params.stricted) {
	            this.tolerateUnexpectedToken(params.stricted, params.message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        return body;
	    };
	    Parser.prototype.parsePropertyMethodFunction = function () {
	        var isGenerator = false;
	        var node = this.createNode();
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var params = this.parseFormalParameters();
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
	    };
	    Parser.prototype.parsePropertyMethodAsyncFunction = function () {
	        var node = this.createNode();
	        var previousAllowYield = this.context.allowYield;
	        var previousAwait = this.context.await;
	        this.context.allowYield = false;
	        this.context.await = true;
	        var params = this.parseFormalParameters();
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        this.context.await = previousAwait;
	        return this.finalize(node, new Node.AsyncFunctionExpression(null, params.params, method));
	    };
	    Parser.prototype.parseObjectPropertyKey = function () {
	        var node = this.createNode();
	        var token = this.nextToken();
	        var key;
	        switch (token.type) {
	            case 8 /* StringLiteral */:
	            case 6 /* NumericLiteral */:
	                if (this.context.strict && token.octal) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictOctalLiteral);
	                }
	                var raw = this.getTokenRaw(token);
	                key = this.finalize(node, new Node.Literal(token.value, raw));
	                break;
	            case 3 /* Identifier */:
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 4 /* Keyword */:
	                key = this.finalize(node, new Node.Identifier(token.value));
	                break;
	            case 7 /* Punctuator */:
	                if (token.value === '[') {
	                    key = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    this.expect(']');
	                }
	                else {
	                    key = this.throwUnexpectedToken(token);
	                }
	                break;
	            default:
	                key = this.throwUnexpectedToken(token);
	        }
	        return key;
	    };
	    Parser.prototype.isPropertyKey = function (key, value) {
	        return (key.type === syntax_1.Syntax.Identifier && key.name === value) ||
	            (key.type === syntax_1.Syntax.Literal && key.value === value);
	    };
	    Parser.prototype.parseObjectProperty = function (hasProto) {
	        var node = this.createNode();
	        var token = this.lookahead;
	        var kind;
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var shorthand = false;
	        var isAsync = false;
	        if (token.type === 3 /* Identifier */) {
	            var id = token.value;
	            this.nextToken();
	            computed = this.match('[');
	            isAsync = !this.hasLineTerminator && (id === 'async') &&
	                !this.match(':') && !this.match('(') && !this.match('*');
	            key = isAsync ? this.parseObjectPropertyKey() : this.finalize(node, new Node.Identifier(id));
	        }
	        else if (this.match('*')) {
	            this.nextToken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	        }
	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
	        if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'get' && lookaheadPropertyKey) {
	            kind = 'get';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            this.context.allowYield = false;
	            value = this.parseGetterMethod();
	        }
	        else if (token.type === 3 /* Identifier */ && !isAsync && token.value === 'set' && lookaheadPropertyKey) {
	            kind = 'set';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseSetterMethod();
	        }
	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseGeneratorMethod();
	            method = true;
	        }
	        else {
	            if (!key) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            kind = 'init';
	            if (this.match(':') && !isAsync) {
	                if (!computed && this.isPropertyKey(key, '__proto__')) {
	                    if (hasProto.value) {
	                        this.tolerateError(messages_1.Messages.DuplicateProtoProperty);
	                    }
	                    hasProto.value = true;
	                }
	                this.nextToken();
	                value = this.inheritCoverGrammar(this.parseAssignmentExpression);
	            }
	            else if (this.match('(')) {
	                value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
	                method = true;
	            }
	            else if (token.type === 3 /* Identifier */) {
	                var id = this.finalize(node, new Node.Identifier(token.value));
	                if (this.match('=')) {
	                    this.context.firstCoverInitializedNameError = this.lookahead;
	                    this.nextToken();
	                    shorthand = true;
	                    var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    value = this.finalize(node, new Node.AssignmentPattern(id, init));
	                }
	                else {
	                    shorthand = true;
	                    value = id;
	                }
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	        }
	        return this.finalize(node, new Node.Property(kind, key, computed, value, method, shorthand));
	    };
	    Parser.prototype.parseObjectInitializer = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var properties = [];
	        var hasProto = { value: false };
	        while (!this.match('}')) {
	            properties.push(this.parseObjectProperty(hasProto));
	            if (!this.match('}')) {
	                this.expectCommaSeparator();
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.ObjectExpression(properties));
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literals
	    Parser.prototype.parseTemplateHead = function () {
	        assert_1.assert(this.lookahead.head, 'Template literal must start with a template head');
	        var node = this.createNode();
	        var token = this.nextToken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    Parser.prototype.parseTemplateElement = function () {
	        if (this.lookahead.type !== 10 /* Template */) {
	            this.throwUnexpectedToken();
	        }
	        var node = this.createNode();
	        var token = this.nextToken();
	        var raw = token.value;
	        var cooked = token.cooked;
	        return this.finalize(node, new Node.TemplateElement({ raw: raw, cooked: cooked }, token.tail));
	    };
	    Parser.prototype.parseTemplateLiteral = function () {
	        var node = this.createNode();
	        var expressions = [];
	        var quasis = [];
	        var quasi = this.parseTemplateHead();
	        quasis.push(quasi);
	        while (!quasi.tail) {
	            expressions.push(this.parseExpression());
	            quasi = this.parseTemplateElement();
	            quasis.push(quasi);
	        }
	        return this.finalize(node, new Node.TemplateLiteral(quasis, expressions));
	    };
	    // https://tc39.github.io/ecma262/#sec-grouping-operator
	    Parser.prototype.reinterpretExpressionAsPattern = function (expr) {
	        switch (expr.type) {
	            case syntax_1.Syntax.Identifier:
	            case syntax_1.Syntax.MemberExpression:
	            case syntax_1.Syntax.RestElement:
	            case syntax_1.Syntax.AssignmentPattern:
	                break;
	            case syntax_1.Syntax.SpreadElement:
	                expr.type = syntax_1.Syntax.RestElement;
	                this.reinterpretExpressionAsPattern(expr.argument);
	                break;
	            case syntax_1.Syntax.ArrayExpression:
	                expr.type = syntax_1.Syntax.ArrayPattern;
	                for (var i = 0; i < expr.elements.length; i++) {
	                    if (expr.elements[i] !== null) {
	                        this.reinterpretExpressionAsPattern(expr.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.Syntax.ObjectExpression:
	                expr.type = syntax_1.Syntax.ObjectPattern;
	                for (var i = 0; i < expr.properties.length; i++) {
	                    this.reinterpretExpressionAsPattern(expr.properties[i].value);
	                }
	                break;
	            case syntax_1.Syntax.AssignmentExpression:
	                expr.type = syntax_1.Syntax.AssignmentPattern;
	                delete expr.operator;
	                this.reinterpretExpressionAsPattern(expr.left);
	                break;
	            default:
	                // Allow other node type for tolerant parsing.
	                break;
	        }
	    };
	    Parser.prototype.parseGroupExpression = function () {
	        var expr;
	        this.expect('(');
	        if (this.match(')')) {
	            this.nextToken();
	            if (!this.match('=>')) {
	                this.expect('=>');
	            }
	            expr = {
	                type: ArrowParameterPlaceHolder,
	                params: [],
	                async: false
	            };
	        }
	        else {
	            var startToken = this.lookahead;
	            var params = [];
	            if (this.match('...')) {
	                expr = this.parseRestElement(params);
	                this.expect(')');
	                if (!this.match('=>')) {
	                    this.expect('=>');
	                }
	                expr = {
	                    type: ArrowParameterPlaceHolder,
	                    params: [expr],
	                    async: false
	                };
	            }
	            else {
	                var arrow = false;
	                this.context.isBindingElement = true;
	                expr = this.inheritCoverGrammar(this.parseAssignmentExpression);
	                if (this.match(',')) {
	                    var expressions = [];
	                    this.context.isAssignmentTarget = false;
	                    expressions.push(expr);
	                    while (this.lookahead.type !== 2 /* EOF */) {
	                        if (!this.match(',')) {
	                            break;
	                        }
	                        this.nextToken();
	                        if (this.match(')')) {
	                            this.nextToken();
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretExpressionAsPattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else if (this.match('...')) {
	                            if (!this.context.isBindingElement) {
	                                this.throwUnexpectedToken(this.lookahead);
	                            }
	                            expressions.push(this.parseRestElement(params));
	                            this.expect(')');
	                            if (!this.match('=>')) {
	                                this.expect('=>');
	                            }
	                            this.context.isBindingElement = false;
	                            for (var i = 0; i < expressions.length; i++) {
	                                this.reinterpretExpressionAsPattern(expressions[i]);
	                            }
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: expressions,
	                                async: false
	                            };
	                        }
	                        else {
	                            expressions.push(this.inheritCoverGrammar(this.parseAssignmentExpression));
	                        }
	                        if (arrow) {
	                            break;
	                        }
	                    }
	                    if (!arrow) {
	                        expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
	                    }
	                }
	                if (!arrow) {
	                    this.expect(')');
	                    if (this.match('=>')) {
	                        if (expr.type === syntax_1.Syntax.Identifier && expr.name === 'yield') {
	                            arrow = true;
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: [expr],
	                                async: false
	                            };
	                        }
	                        if (!arrow) {
	                            if (!this.context.isBindingElement) {
	                                this.throwUnexpectedToken(this.lookahead);
	                            }
	                            if (expr.type === syntax_1.Syntax.SequenceExpression) {
	                                for (var i = 0; i < expr.expressions.length; i++) {
	                                    this.reinterpretExpressionAsPattern(expr.expressions[i]);
	                                }
	                            }
	                            else {
	                                this.reinterpretExpressionAsPattern(expr);
	                            }
	                            var parameters = (expr.type === syntax_1.Syntax.SequenceExpression ? expr.expressions : [expr]);
	                            expr = {
	                                type: ArrowParameterPlaceHolder,
	                                params: parameters,
	                                async: false
	                            };
	                        }
	                    }
	                    this.context.isBindingElement = false;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-left-hand-side-expressions
	    Parser.prototype.parseArguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parseSpreadElement() :
	                    this.isolateCoverGrammar(this.parseAssignmentExpression);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectCommaSeparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    Parser.prototype.isIdentifierName = function (token) {
	        return token.type === 3 /* Identifier */ ||
	            token.type === 4 /* Keyword */ ||
	            token.type === 1 /* BooleanLiteral */ ||
	            token.type === 5 /* NullLiteral */;
	    };
	    Parser.prototype.parseIdentifierName = function () {
	        var node = this.createNode();
	        var token = this.nextToken();
	        if (!this.isIdentifierName(token)) {
	            this.throwUnexpectedToken(token);
	        }
	        return this.finalize(node, new Node.Identifier(token.value));
	    };
	    Parser.prototype.parseNewExpression = function () {
	        var node = this.createNode();
	        var id = this.parseIdentifierName();
	        assert_1.assert(id.name === 'new', 'New expression must start with `new`');
	        var expr;
	        if (this.match('.')) {
	            this.nextToken();
	            if (this.lookahead.type === 3 /* Identifier */ && this.context.inFunctionBody && this.lookahead.value === 'target') {
	                var property = this.parseIdentifierName();
	                expr = new Node.MetaProperty(id, property);
	            }
	            else {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	        }
	        else {
	            var callee = this.isolateCoverGrammar(this.parseLeftHandSideExpression);
	            var args = this.match('(') ? this.parseArguments() : [];
	            expr = new Node.NewExpression(callee, args);
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        return this.finalize(node, expr);
	    };
	    Parser.prototype.parseAsyncArgument = function () {
	        var arg = this.parseAssignmentExpression();
	        this.context.firstCoverInitializedNameError = null;
	        return arg;
	    };
	    Parser.prototype.parseAsyncArguments = function () {
	        this.expect('(');
	        var args = [];
	        if (!this.match(')')) {
	            while (true) {
	                var expr = this.match('...') ? this.parseSpreadElement() :
	                    this.isolateCoverGrammar(this.parseAsyncArgument);
	                args.push(expr);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expectCommaSeparator();
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return args;
	    };
	    Parser.prototype.parseLeftHandSideExpressionAllowCall = function () {
	        var startToken = this.lookahead;
	        var maybeAsync = this.matchContextualKeyword('async');
	        var previousAllowIn = this.context.allowIn;
	        this.context.allowIn = true;
	        var expr;
	        if (this.matchKeyword('super') && this.context.inFunctionBody) {
	            expr = this.createNode();
	            this.nextToken();
	            expr = this.finalize(expr, new Node.Super());
	            if (!this.match('(') && !this.match('.') && !this.match('[')) {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	        }
	        else {
	            expr = this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
	        }
	        while (true) {
	            if (this.match('.')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('.');
	                var property = this.parseIdentifierName();
	                expr = this.finalize(this.startNode(startToken), new Node.StaticMemberExpression(expr, property));
	            }
	            else if (this.match('(')) {
	                var asyncArrow = maybeAsync && (startToken.lineNumber === this.lookahead.lineNumber);
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = false;
	                var args = asyncArrow ? this.parseAsyncArguments() : this.parseArguments();
	                expr = this.finalize(this.startNode(startToken), new Node.CallExpression(expr, args));
	                if (asyncArrow && this.match('=>')) {
	                    for (var i = 0; i < args.length; ++i) {
	                        this.reinterpretExpressionAsPattern(args[i]);
	                    }
	                    expr = {
	                        type: ArrowParameterPlaceHolder,
	                        params: args,
	                        async: true
	                    };
	                }
	            }
	            else if (this.match('[')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('[');
	                var property = this.isolateCoverGrammar(this.parseExpression);
	                this.expect(']');
	                expr = this.finalize(this.startNode(startToken), new Node.ComputedMemberExpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
	                var quasi = this.parseTemplateLiteral();
	                expr = this.finalize(this.startNode(startToken), new Node.TaggedTemplateExpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        this.context.allowIn = previousAllowIn;
	        return expr;
	    };
	    Parser.prototype.parseSuper = function () {
	        var node = this.createNode();
	        this.expectKeyword('super');
	        if (!this.match('[') && !this.match('.')) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        return this.finalize(node, new Node.Super());
	    };
	    Parser.prototype.parseLeftHandSideExpression = function () {
	        assert_1.assert(this.context.allowIn, 'callee of new expression always allow in keyword.');
	        var node = this.startNode(this.lookahead);
	        var expr = (this.matchKeyword('super') && this.context.inFunctionBody) ? this.parseSuper() :
	            this.inheritCoverGrammar(this.matchKeyword('new') ? this.parseNewExpression : this.parsePrimaryExpression);
	        while (true) {
	            if (this.match('[')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('[');
	                var property = this.isolateCoverGrammar(this.parseExpression);
	                this.expect(']');
	                expr = this.finalize(node, new Node.ComputedMemberExpression(expr, property));
	            }
	            else if (this.match('.')) {
	                this.context.isBindingElement = false;
	                this.context.isAssignmentTarget = true;
	                this.expect('.');
	                var property = this.parseIdentifierName();
	                expr = this.finalize(node, new Node.StaticMemberExpression(expr, property));
	            }
	            else if (this.lookahead.type === 10 /* Template */ && this.lookahead.head) {
	                var quasi = this.parseTemplateLiteral();
	                expr = this.finalize(node, new Node.TaggedTemplateExpression(expr, quasi));
	            }
	            else {
	                break;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-update-expressions
	    Parser.prototype.parseUpdateExpression = function () {
	        var expr;
	        var startToken = this.lookahead;
	        if (this.match('++') || this.match('--')) {
	            var node = this.startNode(startToken);
	            var token = this.nextToken();
	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	            if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
	                this.tolerateError(messages_1.Messages.StrictLHSPrefix);
	            }
	            if (!this.context.isAssignmentTarget) {
	                this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	            }
	            var prefix = true;
	            expr = this.finalize(node, new Node.UpdateExpression(token.value, expr, prefix));
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        else {
	            expr = this.inheritCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	            if (!this.hasLineTerminator && this.lookahead.type === 7 /* Punctuator */) {
	                if (this.match('++') || this.match('--')) {
	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier && this.scanner.isRestrictedWord(expr.name)) {
	                        this.tolerateError(messages_1.Messages.StrictLHSPostfix);
	                    }
	                    if (!this.context.isAssignmentTarget) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	                    }
	                    this.context.isAssignmentTarget = false;
	                    this.context.isBindingElement = false;
	                    var operator = this.nextToken().value;
	                    var prefix = false;
	                    expr = this.finalize(this.startNode(startToken), new Node.UpdateExpression(operator, expr, prefix));
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-unary-operators
	    Parser.prototype.parseAwaitExpression = function () {
	        var node = this.createNode();
	        this.nextToken();
	        var argument = this.parseUnaryExpression();
	        return this.finalize(node, new Node.AwaitExpression(argument));
	    };
	    Parser.prototype.parseUnaryExpression = function () {
	        var expr;
	        if (this.match('+') || this.match('-') || this.match('~') || this.match('!') ||
	            this.matchKeyword('delete') || this.matchKeyword('void') || this.matchKeyword('typeof')) {
	            var node = this.startNode(this.lookahead);
	            var token = this.nextToken();
	            expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	            expr = this.finalize(node, new Node.UnaryExpression(token.value, expr));
	            if (this.context.strict && expr.operator === 'delete' && expr.argument.type === syntax_1.Syntax.Identifier) {
	                this.tolerateError(messages_1.Messages.StrictDelete);
	            }
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        else if (this.context.await && this.matchContextualKeyword('await')) {
	            expr = this.parseAwaitExpression();
	        }
	        else {
	            expr = this.parseUpdateExpression();
	        }
	        return expr;
	    };
	    Parser.prototype.parseExponentiationExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseUnaryExpression);
	        if (expr.type !== syntax_1.Syntax.UnaryExpression && this.match('**')) {
	            this.nextToken();
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	            var left = expr;
	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
	            expr = this.finalize(this.startNode(startToken), new Node.BinaryExpression('**', left, right));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-exp-operator
	    // https://tc39.github.io/ecma262/#sec-multiplicative-operators
	    // https://tc39.github.io/ecma262/#sec-additive-operators
	    // https://tc39.github.io/ecma262/#sec-bitwise-shift-operators
	    // https://tc39.github.io/ecma262/#sec-relational-operators
	    // https://tc39.github.io/ecma262/#sec-equality-operators
	    // https://tc39.github.io/ecma262/#sec-binary-bitwise-operators
	    // https://tc39.github.io/ecma262/#sec-binary-logical-operators
	    Parser.prototype.binaryPrecedence = function (token) {
	        var op = token.value;
	        var precedence;
	        if (token.type === 7 /* Punctuator */) {
	            precedence = this.operatorPrecedence[op] || 0;
	        }
	        else if (token.type === 4 /* Keyword */) {
	            precedence = (op === 'instanceof' || (this.context.allowIn && op === 'in')) ? 7 : 0;
	        }
	        else {
	            precedence = 0;
	        }
	        return precedence;
	    };
	    Parser.prototype.parseBinaryExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseExponentiationExpression);
	        var token = this.lookahead;
	        var prec = this.binaryPrecedence(token);
	        if (prec > 0) {
	            this.nextToken();
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	            var markers = [startToken, this.lookahead];
	            var left = expr;
	            var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
	            var stack = [left, token.value, right];
	            var precedences = [prec];
	            while (true) {
	                prec = this.binaryPrecedence(this.lookahead);
	                if (prec <= 0) {
	                    break;
	                }
	                // Reduce: make a binary expression from the three topmost entries.
	                while ((stack.length > 2) && (prec <= precedences[precedences.length - 1])) {
	                    right = stack.pop();
	                    var operator = stack.pop();
	                    precedences.pop();
	                    left = stack.pop();
	                    markers.pop();
	                    var node = this.startNode(markers[markers.length - 1]);
	                    stack.push(this.finalize(node, new Node.BinaryExpression(operator, left, right)));
	                }
	                // Shift.
	                stack.push(this.nextToken().value);
	                precedences.push(prec);
	                markers.push(this.lookahead);
	                stack.push(this.isolateCoverGrammar(this.parseExponentiationExpression));
	            }
	            // Final reduce to clean-up the stack.
	            var i = stack.length - 1;
	            expr = stack[i];
	            markers.pop();
	            while (i > 1) {
	                var node = this.startNode(markers.pop());
	                var operator = stack[i - 1];
	                expr = this.finalize(node, new Node.BinaryExpression(operator, stack[i - 2], expr));
	                i -= 2;
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-conditional-operator
	    Parser.prototype.parseConditionalExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.inheritCoverGrammar(this.parseBinaryExpression);
	        if (this.match('?')) {
	            this.nextToken();
	            var previousAllowIn = this.context.allowIn;
	            this.context.allowIn = true;
	            var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            this.context.allowIn = previousAllowIn;
	            this.expect(':');
	            var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            expr = this.finalize(this.startNode(startToken), new Node.ConditionalExpression(expr, consequent, alternate));
	            this.context.isAssignmentTarget = false;
	            this.context.isBindingElement = false;
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-assignment-operators
	    Parser.prototype.checkPatternParam = function (options, param) {
	        switch (param.type) {
	            case syntax_1.Syntax.Identifier:
	                this.validateParam(options, param, param.name);
	                break;
	            case syntax_1.Syntax.RestElement:
	                this.checkPatternParam(options, param.argument);
	                break;
	            case syntax_1.Syntax.AssignmentPattern:
	                this.checkPatternParam(options, param.left);
	                break;
	            case syntax_1.Syntax.ArrayPattern:
	                for (var i = 0; i < param.elements.length; i++) {
	                    if (param.elements[i] !== null) {
	                        this.checkPatternParam(options, param.elements[i]);
	                    }
	                }
	                break;
	            case syntax_1.Syntax.ObjectPattern:
	                for (var i = 0; i < param.properties.length; i++) {
	                    this.checkPatternParam(options, param.properties[i].value);
	                }
	                break;
	            default:
	                break;
	        }
	        options.simple = options.simple && (param instanceof Node.Identifier);
	    };
	    Parser.prototype.reinterpretAsCoverFormalsList = function (expr) {
	        var params = [expr];
	        var options;
	        var asyncArrow = false;
	        switch (expr.type) {
	            case syntax_1.Syntax.Identifier:
	                break;
	            case ArrowParameterPlaceHolder:
	                params = expr.params;
	                asyncArrow = expr.async;
	                break;
	            default:
	                return null;
	        }
	        options = {
	            simple: true,
	            paramSet: {}
	        };
	        for (var i = 0; i < params.length; ++i) {
	            var param = params[i];
	            if (param.type === syntax_1.Syntax.AssignmentPattern) {
	                if (param.right.type === syntax_1.Syntax.YieldExpression) {
	                    if (param.right.argument) {
	                        this.throwUnexpectedToken(this.lookahead);
	                    }
	                    param.right.type = syntax_1.Syntax.Identifier;
	                    param.right.name = 'yield';
	                    delete param.right.argument;
	                    delete param.right.delegate;
	                }
	            }
	            else if (asyncArrow && param.type === syntax_1.Syntax.Identifier && param.name === 'await') {
	                this.throwUnexpectedToken(this.lookahead);
	            }
	            this.checkPatternParam(options, param);
	            params[i] = param;
	        }
	        if (this.context.strict || !this.context.allowYield) {
	            for (var i = 0; i < params.length; ++i) {
	                var param = params[i];
	                if (param.type === syntax_1.Syntax.YieldExpression) {
	                    this.throwUnexpectedToken(this.lookahead);
	                }
	            }
	        }
	        if (options.message === messages_1.Messages.StrictParamDupe) {
	            var token = this.context.strict ? options.stricted : options.firstRestricted;
	            this.throwUnexpectedToken(token, options.message);
	        }
	        return {
	            simple: options.simple,
	            params: params,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    };
	    Parser.prototype.parseAssignmentExpression = function () {
	        var expr;
	        if (!this.context.allowYield && this.matchKeyword('yield')) {
	            expr = this.parseYieldExpression();
	        }
	        else {
	            var startToken = this.lookahead;
	            var token = startToken;
	            expr = this.parseConditionalExpression();
	            if (token.type === 3 /* Identifier */ && (token.lineNumber === this.lookahead.lineNumber) && token.value === 'async') {
	                if (this.lookahead.type === 3 /* Identifier */ || this.matchKeyword('yield')) {
	                    var arg = this.parsePrimaryExpression();
	                    this.reinterpretExpressionAsPattern(arg);
	                    expr = {
	                        type: ArrowParameterPlaceHolder,
	                        params: [arg],
	                        async: true
	                    };
	                }
	            }
	            if (expr.type === ArrowParameterPlaceHolder || this.match('=>')) {
	                // https://tc39.github.io/ecma262/#sec-arrow-function-definitions
	                this.context.isAssignmentTarget = false;
	                this.context.isBindingElement = false;
	                var isAsync = expr.async;
	                var list = this.reinterpretAsCoverFormalsList(expr);
	                if (list) {
	                    if (this.hasLineTerminator) {
	                        this.tolerateUnexpectedToken(this.lookahead);
	                    }
	                    this.context.firstCoverInitializedNameError = null;
	                    var previousStrict = this.context.strict;
	                    var previousAllowStrictDirective = this.context.allowStrictDirective;
	                    this.context.allowStrictDirective = list.simple;
	                    var previousAllowYield = this.context.allowYield;
	                    var previousAwait = this.context.await;
	                    this.context.allowYield = true;
	                    this.context.await = isAsync;
	                    var node = this.startNode(startToken);
	                    this.expect('=>');
	                    var body = void 0;
	                    if (this.match('{')) {
	                        var previousAllowIn = this.context.allowIn;
	                        this.context.allowIn = true;
	                        body = this.parseFunctionSourceElements();
	                        this.context.allowIn = previousAllowIn;
	                    }
	                    else {
	                        body = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    }
	                    var expression = body.type !== syntax_1.Syntax.BlockStatement;
	                    if (this.context.strict && list.firstRestricted) {
	                        this.throwUnexpectedToken(list.firstRestricted, list.message);
	                    }
	                    if (this.context.strict && list.stricted) {
	                        this.tolerateUnexpectedToken(list.stricted, list.message);
	                    }
	                    expr = isAsync ? this.finalize(node, new Node.AsyncArrowFunctionExpression(list.params, body, expression)) :
	                        this.finalize(node, new Node.ArrowFunctionExpression(list.params, body, expression));
	                    this.context.strict = previousStrict;
	                    this.context.allowStrictDirective = previousAllowStrictDirective;
	                    this.context.allowYield = previousAllowYield;
	                    this.context.await = previousAwait;
	                }
	            }
	            else {
	                if (this.matchAssign()) {
	                    if (!this.context.isAssignmentTarget) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInAssignment);
	                    }
	                    if (this.context.strict && expr.type === syntax_1.Syntax.Identifier) {
	                        var id = expr;
	                        if (this.scanner.isRestrictedWord(id.name)) {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictLHSAssignment);
	                        }
	                        if (this.scanner.isStrictModeReservedWord(id.name)) {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	                        }
	                    }
	                    if (!this.match('=')) {
	                        this.context.isAssignmentTarget = false;
	                        this.context.isBindingElement = false;
	                    }
	                    else {
	                        this.reinterpretExpressionAsPattern(expr);
	                    }
	                    token = this.nextToken();
	                    var operator = token.value;
	                    var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                    expr = this.finalize(this.startNode(startToken), new Node.AssignmentExpression(operator, expr, right));
	                    this.context.firstCoverInitializedNameError = null;
	                }
	            }
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-comma-operator
	    Parser.prototype.parseExpression = function () {
	        var startToken = this.lookahead;
	        var expr = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        if (this.match(',')) {
	            var expressions = [];
	            expressions.push(expr);
	            while (this.lookahead.type !== 2 /* EOF */) {
	                if (!this.match(',')) {
	                    break;
	                }
	                this.nextToken();
	                expressions.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
	            }
	            expr = this.finalize(this.startNode(startToken), new Node.SequenceExpression(expressions));
	        }
	        return expr;
	    };
	    // https://tc39.github.io/ecma262/#sec-block
	    Parser.prototype.parseStatementListItem = function () {
	        var statement;
	        this.context.isAssignmentTarget = true;
	        this.context.isBindingElement = true;
	        if (this.lookahead.type === 4 /* Keyword */) {
	            switch (this.lookahead.value) {
	                case 'export':
	                    if (!this.context.isModule) {
	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalExportDeclaration);
	                    }
	                    statement = this.parseExportDeclaration();
	                    break;
	                case 'import':
	                    if (!this.context.isModule) {
	                        this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.IllegalImportDeclaration);
	                    }
	                    statement = this.parseImportDeclaration();
	                    break;
	                case 'const':
	                    statement = this.parseLexicalDeclaration({ inFor: false });
	                    break;
	                case 'function':
	                    statement = this.parseFunctionDeclaration();
	                    break;
	                case 'class':
	                    statement = this.parseClassDeclaration();
	                    break;
	                case 'let':
	                    statement = this.isLexicalDeclaration() ? this.parseLexicalDeclaration({ inFor: false }) : this.parseStatement();
	                    break;
	                default:
	                    statement = this.parseStatement();
	                    break;
	            }
	        }
	        else {
	            statement = this.parseStatement();
	        }
	        return statement;
	    };
	    Parser.prototype.parseBlock = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var block = [];
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            block.push(this.parseStatementListItem());
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.BlockStatement(block));
	    };
	    // https://tc39.github.io/ecma262/#sec-let-and-const-declarations
	    Parser.prototype.parseLexicalBinding = function (kind, options) {
	        var node = this.createNode();
	        var params = [];
	        var id = this.parsePattern(params, kind);
	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(id.name)) {
	                this.tolerateError(messages_1.Messages.StrictVarName);
	            }
	        }
	        var init = null;
	        if (kind === 'const') {
	            if (!this.matchKeyword('in') && !this.matchContextualKeyword('of')) {
	                if (this.match('=')) {
	                    this.nextToken();
	                    init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	                }
	                else {
	                    this.throwError(messages_1.Messages.DeclarationMissingInitializer, 'const');
	                }
	            }
	        }
	        else if ((!options.inFor && id.type !== syntax_1.Syntax.Identifier) || this.match('=')) {
	            this.expect('=');
	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        }
	        return this.finalize(node, new Node.VariableDeclarator(id, init));
	    };
	    Parser.prototype.parseBindingList = function (kind, options) {
	        var list = [this.parseLexicalBinding(kind, options)];
	        while (this.match(',')) {
	            this.nextToken();
	            list.push(this.parseLexicalBinding(kind, options));
	        }
	        return list;
	    };
	    Parser.prototype.isLexicalDeclaration = function () {
	        var state = this.scanner.saveState();
	        this.scanner.scanComments();
	        var next = this.scanner.lex();
	        this.scanner.restoreState(state);
	        return (next.type === 3 /* Identifier */) ||
	            (next.type === 7 /* Punctuator */ && next.value === '[') ||
	            (next.type === 7 /* Punctuator */ && next.value === '{') ||
	            (next.type === 4 /* Keyword */ && next.value === 'let') ||
	            (next.type === 4 /* Keyword */ && next.value === 'yield');
	    };
	    Parser.prototype.parseLexicalDeclaration = function (options) {
	        var node = this.createNode();
	        var kind = this.nextToken().value;
	        assert_1.assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');
	        var declarations = this.parseBindingList(kind, options);
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.VariableDeclaration(declarations, kind));
	    };
	    // https://tc39.github.io/ecma262/#sec-destructuring-binding-patterns
	    Parser.prototype.parseBindingRestElement = function (params, kind) {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.parsePattern(params, kind);
	        return this.finalize(node, new Node.RestElement(arg));
	    };
	    Parser.prototype.parseArrayPattern = function (params, kind) {
	        var node = this.createNode();
	        this.expect('[');
	        var elements = [];
	        while (!this.match(']')) {
	            if (this.match(',')) {
	                this.nextToken();
	                elements.push(null);
	            }
	            else {
	                if (this.match('...')) {
	                    elements.push(this.parseBindingRestElement(params, kind));
	                    break;
	                }
	                else {
	                    elements.push(this.parsePatternWithDefault(params, kind));
	                }
	                if (!this.match(']')) {
	                    this.expect(',');
	                }
	            }
	        }
	        this.expect(']');
	        return this.finalize(node, new Node.ArrayPattern(elements));
	    };
	    Parser.prototype.parsePropertyPattern = function (params, kind) {
	        var node = this.createNode();
	        var computed = false;
	        var shorthand = false;
	        var method = false;
	        var key;
	        var value;
	        if (this.lookahead.type === 3 /* Identifier */) {
	            var keyToken = this.lookahead;
	            key = this.parseVariableIdentifier();
	            var init = this.finalize(node, new Node.Identifier(keyToken.value));
	            if (this.match('=')) {
	                params.push(keyToken);
	                shorthand = true;
	                this.nextToken();
	                var expr = this.parseAssignmentExpression();
	                value = this.finalize(this.startNode(keyToken), new Node.AssignmentPattern(init, expr));
	            }
	            else if (!this.match(':')) {
	                params.push(keyToken);
	                shorthand = true;
	                value = init;
	            }
	            else {
	                this.expect(':');
	                value = this.parsePatternWithDefault(params, kind);
	            }
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            this.expect(':');
	            value = this.parsePatternWithDefault(params, kind);
	        }
	        return this.finalize(node, new Node.Property('init', key, computed, value, method, shorthand));
	    };
	    Parser.prototype.parseObjectPattern = function (params, kind) {
	        var node = this.createNode();
	        var properties = [];
	        this.expect('{');
	        while (!this.match('}')) {
	            properties.push(this.parsePropertyPattern(params, kind));
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return this.finalize(node, new Node.ObjectPattern(properties));
	    };
	    Parser.prototype.parsePattern = function (params, kind) {
	        var pattern;
	        if (this.match('[')) {
	            pattern = this.parseArrayPattern(params, kind);
	        }
	        else if (this.match('{')) {
	            pattern = this.parseObjectPattern(params, kind);
	        }
	        else {
	            if (this.matchKeyword('let') && (kind === 'const' || kind === 'let')) {
	                this.tolerateUnexpectedToken(this.lookahead, messages_1.Messages.LetInLexicalBinding);
	            }
	            params.push(this.lookahead);
	            pattern = this.parseVariableIdentifier(kind);
	        }
	        return pattern;
	    };
	    Parser.prototype.parsePatternWithDefault = function (params, kind) {
	        var startToken = this.lookahead;
	        var pattern = this.parsePattern(params, kind);
	        if (this.match('=')) {
	            this.nextToken();
	            var previousAllowYield = this.context.allowYield;
	            this.context.allowYield = true;
	            var right = this.isolateCoverGrammar(this.parseAssignmentExpression);
	            this.context.allowYield = previousAllowYield;
	            pattern = this.finalize(this.startNode(startToken), new Node.AssignmentPattern(pattern, right));
	        }
	        return pattern;
	    };
	    // https://tc39.github.io/ecma262/#sec-variable-statement
	    Parser.prototype.parseVariableIdentifier = function (kind) {
	        var node = this.createNode();
	        var token = this.nextToken();
	        if (token.type === 4 /* Keyword */ && token.value === 'yield') {
	            if (this.context.strict) {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	            }
	            else if (!this.context.allowYield) {
	                this.throwUnexpectedToken(token);
	            }
	        }
	        else if (token.type !== 3 /* Identifier */) {
	            if (this.context.strict && token.type === 4 /* Keyword */ && this.scanner.isStrictModeReservedWord(token.value)) {
	                this.tolerateUnexpectedToken(token, messages_1.Messages.StrictReservedWord);
	            }
	            else {
	                if (this.context.strict || token.value !== 'let' || kind !== 'var') {
	                    this.throwUnexpectedToken(token);
	                }
	            }
	        }
	        else if ((this.context.isModule || this.context.await) && token.type === 3 /* Identifier */ && token.value === 'await') {
	            this.tolerateUnexpectedToken(token);
	        }
	        return this.finalize(node, new Node.Identifier(token.value));
	    };
	    Parser.prototype.parseVariableDeclaration = function (options) {
	        var node = this.createNode();
	        var params = [];
	        var id = this.parsePattern(params, 'var');
	        if (this.context.strict && id.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(id.name)) {
	                this.tolerateError(messages_1.Messages.StrictVarName);
	            }
	        }
	        var init = null;
	        if (this.match('=')) {
	            this.nextToken();
	            init = this.isolateCoverGrammar(this.parseAssignmentExpression);
	        }
	        else if (id.type !== syntax_1.Syntax.Identifier && !options.inFor) {
	            this.expect('=');
	        }
	        return this.finalize(node, new Node.VariableDeclarator(id, init));
	    };
	    Parser.prototype.parseVariableDeclarationList = function (options) {
	        var opt = { inFor: options.inFor };
	        var list = [];
	        list.push(this.parseVariableDeclaration(opt));
	        while (this.match(',')) {
	            this.nextToken();
	            list.push(this.parseVariableDeclaration(opt));
	        }
	        return list;
	    };
	    Parser.prototype.parseVariableStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('var');
	        var declarations = this.parseVariableDeclarationList({ inFor: false });
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.VariableDeclaration(declarations, 'var'));
	    };
	    // https://tc39.github.io/ecma262/#sec-empty-statement
	    Parser.prototype.parseEmptyStatement = function () {
	        var node = this.createNode();
	        this.expect(';');
	        return this.finalize(node, new Node.EmptyStatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-expression-statement
	    Parser.prototype.parseExpressionStatement = function () {
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ExpressionStatement(expr));
	    };
	    // https://tc39.github.io/ecma262/#sec-if-statement
	    Parser.prototype.parseIfClause = function () {
	        if (this.context.strict && this.matchKeyword('function')) {
	            this.tolerateError(messages_1.Messages.StrictFunction);
	        }
	        return this.parseStatement();
	    };
	    Parser.prototype.parseIfStatement = function () {
	        var node = this.createNode();
	        var consequent;
	        var alternate = null;
	        this.expectKeyword('if');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            consequent = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            consequent = this.parseIfClause();
	            if (this.matchKeyword('else')) {
	                this.nextToken();
	                alternate = this.parseIfClause();
	            }
	        }
	        return this.finalize(node, new Node.IfStatement(test, consequent, alternate));
	    };
	    // https://tc39.github.io/ecma262/#sec-do-while-statement
	    Parser.prototype.parseDoWhileStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('do');
	        var previousInIteration = this.context.inIteration;
	        this.context.inIteration = true;
	        var body = this.parseStatement();
	        this.context.inIteration = previousInIteration;
	        this.expectKeyword('while');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	        }
	        else {
	            this.expect(')');
	            if (this.match(';')) {
	                this.nextToken();
	            }
	        }
	        return this.finalize(node, new Node.DoWhileStatement(body, test));
	    };
	    // https://tc39.github.io/ecma262/#sec-while-statement
	    Parser.prototype.parseWhileStatement = function () {
	        var node = this.createNode();
	        var body;
	        this.expectKeyword('while');
	        this.expect('(');
	        var test = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            var previousInIteration = this.context.inIteration;
	            this.context.inIteration = true;
	            body = this.parseStatement();
	            this.context.inIteration = previousInIteration;
	        }
	        return this.finalize(node, new Node.WhileStatement(test, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-for-statement
	    // https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements
	    Parser.prototype.parseForStatement = function () {
	        var init = null;
	        var test = null;
	        var update = null;
	        var forIn = true;
	        var left, right;
	        var node = this.createNode();
	        this.expectKeyword('for');
	        this.expect('(');
	        if (this.match(';')) {
	            this.nextToken();
	        }
	        else {
	            if (this.matchKeyword('var')) {
	                init = this.createNode();
	                this.nextToken();
	                var previousAllowIn = this.context.allowIn;
	                this.context.allowIn = false;
	                var declarations = this.parseVariableDeclarationList({ inFor: true });
	                this.context.allowIn = previousAllowIn;
	                if (declarations.length === 1 && this.matchKeyword('in')) {
	                    var decl = declarations[0];
	                    if (decl.init && (decl.id.type === syntax_1.Syntax.ArrayPattern || decl.id.type === syntax_1.Syntax.ObjectPattern || this.context.strict)) {
	                        this.tolerateError(messages_1.Messages.ForInOfLoopInitializer, 'for-in');
	                    }
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                }
	                else {
	                    init = this.finalize(init, new Node.VariableDeclaration(declarations, 'var'));
	                    this.expect(';');
	                }
	            }
	            else if (this.matchKeyword('const') || this.matchKeyword('let')) {
	                init = this.createNode();
	                var kind = this.nextToken().value;
	                if (!this.context.strict && this.lookahead.value === 'in') {
	                    init = this.finalize(init, new Node.Identifier(kind));
	                    this.nextToken();
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else {
	                    var previousAllowIn = this.context.allowIn;
	                    this.context.allowIn = false;
	                    var declarations = this.parseBindingList(kind, { inFor: true });
	                    this.context.allowIn = previousAllowIn;
	                    if (declarations.length === 1 && declarations[0].init === null && this.matchKeyword('in')) {
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                        this.nextToken();
	                        left = init;
	                        right = this.parseExpression();
	                        init = null;
	                    }
	                    else if (declarations.length === 1 && declarations[0].init === null && this.matchContextualKeyword('of')) {
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                        this.nextToken();
	                        left = init;
	                        right = this.parseAssignmentExpression();
	                        init = null;
	                        forIn = false;
	                    }
	                    else {
	                        this.consumeSemicolon();
	                        init = this.finalize(init, new Node.VariableDeclaration(declarations, kind));
	                    }
	                }
	            }
	            else {
	                var initStartToken = this.lookahead;
	                var previousAllowIn = this.context.allowIn;
	                this.context.allowIn = false;
	                init = this.inheritCoverGrammar(this.parseAssignmentExpression);
	                this.context.allowIn = previousAllowIn;
	                if (this.matchKeyword('in')) {
	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInForIn);
	                    }
	                    this.nextToken();
	                    this.reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = this.parseExpression();
	                    init = null;
	                }
	                else if (this.matchContextualKeyword('of')) {
	                    if (!this.context.isAssignmentTarget || init.type === syntax_1.Syntax.AssignmentExpression) {
	                        this.tolerateError(messages_1.Messages.InvalidLHSInForLoop);
	                    }
	                    this.nextToken();
	                    this.reinterpretExpressionAsPattern(init);
	                    left = init;
	                    right = this.parseAssignmentExpression();
	                    init = null;
	                    forIn = false;
	                }
	                else {
	                    if (this.match(',')) {
	                        var initSeq = [init];
	                        while (this.match(',')) {
	                            this.nextToken();
	                            initSeq.push(this.isolateCoverGrammar(this.parseAssignmentExpression));
	                        }
	                        init = this.finalize(this.startNode(initStartToken), new Node.SequenceExpression(initSeq));
	                    }
	                    this.expect(';');
	                }
	            }
	        }
	        if (typeof left === 'undefined') {
	            if (!this.match(';')) {
	                test = this.parseExpression();
	            }
	            this.expect(';');
	            if (!this.match(')')) {
	                update = this.parseExpression();
	            }
	        }
	        var body;
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            var previousInIteration = this.context.inIteration;
	            this.context.inIteration = true;
	            body = this.isolateCoverGrammar(this.parseStatement);
	            this.context.inIteration = previousInIteration;
	        }
	        return (typeof left === 'undefined') ?
	            this.finalize(node, new Node.ForStatement(init, test, update, body)) :
	            forIn ? this.finalize(node, new Node.ForInStatement(left, right, body)) :
	                this.finalize(node, new Node.ForOfStatement(left, right, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-continue-statement
	    Parser.prototype.parseContinueStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('continue');
	        var label = null;
	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
	            var id = this.parseVariableIdentifier();
	            label = id;
	            var key = '$' + id.name;
	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
	            }
	        }
	        this.consumeSemicolon();
	        if (label === null && !this.context.inIteration) {
	            this.throwError(messages_1.Messages.IllegalContinue);
	        }
	        return this.finalize(node, new Node.ContinueStatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-break-statement
	    Parser.prototype.parseBreakStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('break');
	        var label = null;
	        if (this.lookahead.type === 3 /* Identifier */ && !this.hasLineTerminator) {
	            var id = this.parseVariableIdentifier();
	            var key = '$' + id.name;
	            if (!Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.UnknownLabel, id.name);
	            }
	            label = id;
	        }
	        this.consumeSemicolon();
	        if (label === null && !this.context.inIteration && !this.context.inSwitch) {
	            this.throwError(messages_1.Messages.IllegalBreak);
	        }
	        return this.finalize(node, new Node.BreakStatement(label));
	    };
	    // https://tc39.github.io/ecma262/#sec-return-statement
	    Parser.prototype.parseReturnStatement = function () {
	        if (!this.context.inFunctionBody) {
	            this.tolerateError(messages_1.Messages.IllegalReturn);
	        }
	        var node = this.createNode();
	        this.expectKeyword('return');
	        var hasArgument = !this.match(';') && !this.match('}') &&
	            !this.hasLineTerminator && this.lookahead.type !== 2 /* EOF */;
	        var argument = hasArgument ? this.parseExpression() : null;
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ReturnStatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-with-statement
	    Parser.prototype.parseWithStatement = function () {
	        if (this.context.strict) {
	            this.tolerateError(messages_1.Messages.StrictModeWith);
	        }
	        var node = this.createNode();
	        var body;
	        this.expectKeyword('with');
	        this.expect('(');
	        var object = this.parseExpression();
	        if (!this.match(')') && this.config.tolerant) {
	            this.tolerateUnexpectedToken(this.nextToken());
	            body = this.finalize(this.createNode(), new Node.EmptyStatement());
	        }
	        else {
	            this.expect(')');
	            body = this.parseStatement();
	        }
	        return this.finalize(node, new Node.WithStatement(object, body));
	    };
	    // https://tc39.github.io/ecma262/#sec-switch-statement
	    Parser.prototype.parseSwitchCase = function () {
	        var node = this.createNode();
	        var test;
	        if (this.matchKeyword('default')) {
	            this.nextToken();
	            test = null;
	        }
	        else {
	            this.expectKeyword('case');
	            test = this.parseExpression();
	        }
	        this.expect(':');
	        var consequent = [];
	        while (true) {
	            if (this.match('}') || this.matchKeyword('default') || this.matchKeyword('case')) {
	                break;
	            }
	            consequent.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.SwitchCase(test, consequent));
	    };
	    Parser.prototype.parseSwitchStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('switch');
	        this.expect('(');
	        var discriminant = this.parseExpression();
	        this.expect(')');
	        var previousInSwitch = this.context.inSwitch;
	        this.context.inSwitch = true;
	        var cases = [];
	        var defaultFound = false;
	        this.expect('{');
	        while (true) {
	            if (this.match('}')) {
	                break;
	            }
	            var clause = this.parseSwitchCase();
	            if (clause.test === null) {
	                if (defaultFound) {
	                    this.throwError(messages_1.Messages.MultipleDefaultsInSwitch);
	                }
	                defaultFound = true;
	            }
	            cases.push(clause);
	        }
	        this.expect('}');
	        this.context.inSwitch = previousInSwitch;
	        return this.finalize(node, new Node.SwitchStatement(discriminant, cases));
	    };
	    // https://tc39.github.io/ecma262/#sec-labelled-statements
	    Parser.prototype.parseLabelledStatement = function () {
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        var statement;
	        if ((expr.type === syntax_1.Syntax.Identifier) && this.match(':')) {
	            this.nextToken();
	            var id = expr;
	            var key = '$' + id.name;
	            if (Object.prototype.hasOwnProperty.call(this.context.labelSet, key)) {
	                this.throwError(messages_1.Messages.Redeclaration, 'Label', id.name);
	            }
	            this.context.labelSet[key] = true;
	            var body = void 0;
	            if (this.matchKeyword('class')) {
	                this.tolerateUnexpectedToken(this.lookahead);
	                body = this.parseClassDeclaration();
	            }
	            else if (this.matchKeyword('function')) {
	                var token = this.lookahead;
	                var declaration = this.parseFunctionDeclaration();
	                if (this.context.strict) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunction);
	                }
	                else if (declaration.generator) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.GeneratorInLegacyContext);
	                }
	                body = declaration;
	            }
	            else {
	                body = this.parseStatement();
	            }
	            delete this.context.labelSet[key];
	            statement = new Node.LabeledStatement(id, body);
	        }
	        else {
	            this.consumeSemicolon();
	            statement = new Node.ExpressionStatement(expr);
	        }
	        return this.finalize(node, statement);
	    };
	    // https://tc39.github.io/ecma262/#sec-throw-statement
	    Parser.prototype.parseThrowStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('throw');
	        if (this.hasLineTerminator) {
	            this.throwError(messages_1.Messages.NewlineAfterThrow);
	        }
	        var argument = this.parseExpression();
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ThrowStatement(argument));
	    };
	    // https://tc39.github.io/ecma262/#sec-try-statement
	    Parser.prototype.parseCatchClause = function () {
	        var node = this.createNode();
	        this.expectKeyword('catch');
	        this.expect('(');
	        if (this.match(')')) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        var params = [];
	        var param = this.parsePattern(params);
	        var paramMap = {};
	        for (var i = 0; i < params.length; i++) {
	            var key = '$' + params[i].value;
	            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
	                this.tolerateError(messages_1.Messages.DuplicateBinding, params[i].value);
	            }
	            paramMap[key] = true;
	        }
	        if (this.context.strict && param.type === syntax_1.Syntax.Identifier) {
	            if (this.scanner.isRestrictedWord(param.name)) {
	                this.tolerateError(messages_1.Messages.StrictCatchVariable);
	            }
	        }
	        this.expect(')');
	        var body = this.parseBlock();
	        return this.finalize(node, new Node.CatchClause(param, body));
	    };
	    Parser.prototype.parseFinallyClause = function () {
	        this.expectKeyword('finally');
	        return this.parseBlock();
	    };
	    Parser.prototype.parseTryStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('try');
	        var block = this.parseBlock();
	        var handler = this.matchKeyword('catch') ? this.parseCatchClause() : null;
	        var finalizer = this.matchKeyword('finally') ? this.parseFinallyClause() : null;
	        if (!handler && !finalizer) {
	            this.throwError(messages_1.Messages.NoCatchOrFinally);
	        }
	        return this.finalize(node, new Node.TryStatement(block, handler, finalizer));
	    };
	    // https://tc39.github.io/ecma262/#sec-debugger-statement
	    Parser.prototype.parseDebuggerStatement = function () {
	        var node = this.createNode();
	        this.expectKeyword('debugger');
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.DebuggerStatement());
	    };
	    // https://tc39.github.io/ecma262/#sec-ecmascript-language-statements-and-declarations
	    Parser.prototype.parseStatement = function () {
	        var statement;
	        switch (this.lookahead.type) {
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 6 /* NumericLiteral */:
	            case 8 /* StringLiteral */:
	            case 10 /* Template */:
	            case 9 /* RegularExpression */:
	                statement = this.parseExpressionStatement();
	                break;
	            case 7 /* Punctuator */:
	                var value = this.lookahead.value;
	                if (value === '{') {
	                    statement = this.parseBlock();
	                }
	                else if (value === '(') {
	                    statement = this.parseExpressionStatement();
	                }
	                else if (value === ';') {
	                    statement = this.parseEmptyStatement();
	                }
	                else {
	                    statement = this.parseExpressionStatement();
	                }
	                break;
	            case 3 /* Identifier */:
	                statement = this.matchAsyncFunction() ? this.parseFunctionDeclaration() : this.parseLabelledStatement();
	                break;
	            case 4 /* Keyword */:
	                switch (this.lookahead.value) {
	                    case 'break':
	                        statement = this.parseBreakStatement();
	                        break;
	                    case 'continue':
	                        statement = this.parseContinueStatement();
	                        break;
	                    case 'debugger':
	                        statement = this.parseDebuggerStatement();
	                        break;
	                    case 'do':
	                        statement = this.parseDoWhileStatement();
	                        break;
	                    case 'for':
	                        statement = this.parseForStatement();
	                        break;
	                    case 'function':
	                        statement = this.parseFunctionDeclaration();
	                        break;
	                    case 'if':
	                        statement = this.parseIfStatement();
	                        break;
	                    case 'return':
	                        statement = this.parseReturnStatement();
	                        break;
	                    case 'switch':
	                        statement = this.parseSwitchStatement();
	                        break;
	                    case 'throw':
	                        statement = this.parseThrowStatement();
	                        break;
	                    case 'try':
	                        statement = this.parseTryStatement();
	                        break;
	                    case 'var':
	                        statement = this.parseVariableStatement();
	                        break;
	                    case 'while':
	                        statement = this.parseWhileStatement();
	                        break;
	                    case 'with':
	                        statement = this.parseWithStatement();
	                        break;
	                    default:
	                        statement = this.parseExpressionStatement();
	                        break;
	                }
	                break;
	            default:
	                statement = this.throwUnexpectedToken(this.lookahead);
	        }
	        return statement;
	    };
	    // https://tc39.github.io/ecma262/#sec-function-definitions
	    Parser.prototype.parseFunctionSourceElements = function () {
	        var node = this.createNode();
	        this.expect('{');
	        var body = this.parseDirectivePrologues();
	        var previousLabelSet = this.context.labelSet;
	        var previousInIteration = this.context.inIteration;
	        var previousInSwitch = this.context.inSwitch;
	        var previousInFunctionBody = this.context.inFunctionBody;
	        this.context.labelSet = {};
	        this.context.inIteration = false;
	        this.context.inSwitch = false;
	        this.context.inFunctionBody = true;
	        while (this.lookahead.type !== 2 /* EOF */) {
	            if (this.match('}')) {
	                break;
	            }
	            body.push(this.parseStatementListItem());
	        }
	        this.expect('}');
	        this.context.labelSet = previousLabelSet;
	        this.context.inIteration = previousInIteration;
	        this.context.inSwitch = previousInSwitch;
	        this.context.inFunctionBody = previousInFunctionBody;
	        return this.finalize(node, new Node.BlockStatement(body));
	    };
	    Parser.prototype.validateParam = function (options, param, name) {
	        var key = '$' + name;
	        if (this.context.strict) {
	            if (this.scanner.isRestrictedWord(name)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamName;
	            }
	            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamDupe;
	            }
	        }
	        else if (!options.firstRestricted) {
	            if (this.scanner.isRestrictedWord(name)) {
	                options.firstRestricted = param;
	                options.message = messages_1.Messages.StrictParamName;
	            }
	            else if (this.scanner.isStrictModeReservedWord(name)) {
	                options.firstRestricted = param;
	                options.message = messages_1.Messages.StrictReservedWord;
	            }
	            else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
	                options.stricted = param;
	                options.message = messages_1.Messages.StrictParamDupe;
	            }
	        }
	        /* istanbul ignore next */
	        if (typeof Object.defineProperty === 'function') {
	            Object.defineProperty(options.paramSet, key, { value: true, enumerable: true, writable: true, configurable: true });
	        }
	        else {
	            options.paramSet[key] = true;
	        }
	    };
	    Parser.prototype.parseRestElement = function (params) {
	        var node = this.createNode();
	        this.expect('...');
	        var arg = this.parsePattern(params);
	        if (this.match('=')) {
	            this.throwError(messages_1.Messages.DefaultRestParameter);
	        }
	        if (!this.match(')')) {
	            this.throwError(messages_1.Messages.ParameterAfterRestParameter);
	        }
	        return this.finalize(node, new Node.RestElement(arg));
	    };
	    Parser.prototype.parseFormalParameter = function (options) {
	        var params = [];
	        var param = this.match('...') ? this.parseRestElement(params) : this.parsePatternWithDefault(params);
	        for (var i = 0; i < params.length; i++) {
	            this.validateParam(options, params[i], params[i].value);
	        }
	        options.simple = options.simple && (param instanceof Node.Identifier);
	        options.params.push(param);
	    };
	    Parser.prototype.parseFormalParameters = function (firstRestricted) {
	        var options;
	        options = {
	            simple: true,
	            params: [],
	            firstRestricted: firstRestricted
	        };
	        this.expect('(');
	        if (!this.match(')')) {
	            options.paramSet = {};
	            while (this.lookahead.type !== 2 /* EOF */) {
	                this.parseFormalParameter(options);
	                if (this.match(')')) {
	                    break;
	                }
	                this.expect(',');
	                if (this.match(')')) {
	                    break;
	                }
	            }
	        }
	        this.expect(')');
	        return {
	            simple: options.simple,
	            params: options.params,
	            stricted: options.stricted,
	            firstRestricted: options.firstRestricted,
	            message: options.message
	        };
	    };
	    Parser.prototype.matchAsyncFunction = function () {
	        var match = this.matchContextualKeyword('async');
	        if (match) {
	            var state = this.scanner.saveState();
	            this.scanner.scanComments();
	            var next = this.scanner.lex();
	            this.scanner.restoreState(state);
	            match = (state.lineNumber === next.lineNumber) && (next.type === 4 /* Keyword */) && (next.value === 'function');
	        }
	        return match;
	    };
	    Parser.prototype.parseFunctionDeclaration = function (identifierIsOptional) {
	        var node = this.createNode();
	        var isAsync = this.matchContextualKeyword('async');
	        if (isAsync) {
	            this.nextToken();
	        }
	        this.expectKeyword('function');
	        var isGenerator = isAsync ? false : this.match('*');
	        if (isGenerator) {
	            this.nextToken();
	        }
	        var message;
	        var id = null;
	        var firstRestricted = null;
	        if (!identifierIsOptional || !this.match('(')) {
	            var token = this.lookahead;
	            id = this.parseVariableIdentifier();
	            if (this.context.strict) {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
	                }
	            }
	            else {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictFunctionName;
	                }
	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictReservedWord;
	                }
	            }
	        }
	        var previousAllowAwait = this.context.await;
	        var previousAllowYield = this.context.allowYield;
	        this.context.await = isAsync;
	        this.context.allowYield = !isGenerator;
	        var formalParameters = this.parseFormalParameters(firstRestricted);
	        var params = formalParameters.params;
	        var stricted = formalParameters.stricted;
	        firstRestricted = formalParameters.firstRestricted;
	        if (formalParameters.message) {
	            message = formalParameters.message;
	        }
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = formalParameters.simple;
	        var body = this.parseFunctionSourceElements();
	        if (this.context.strict && firstRestricted) {
	            this.throwUnexpectedToken(firstRestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateUnexpectedToken(stricted, message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        this.context.await = previousAllowAwait;
	        this.context.allowYield = previousAllowYield;
	        return isAsync ? this.finalize(node, new Node.AsyncFunctionDeclaration(id, params, body)) :
	            this.finalize(node, new Node.FunctionDeclaration(id, params, body, isGenerator));
	    };
	    Parser.prototype.parseFunctionExpression = function () {
	        var node = this.createNode();
	        var isAsync = this.matchContextualKeyword('async');
	        if (isAsync) {
	            this.nextToken();
	        }
	        this.expectKeyword('function');
	        var isGenerator = isAsync ? false : this.match('*');
	        if (isGenerator) {
	            this.nextToken();
	        }
	        var message;
	        var id = null;
	        var firstRestricted;
	        var previousAllowAwait = this.context.await;
	        var previousAllowYield = this.context.allowYield;
	        this.context.await = isAsync;
	        this.context.allowYield = !isGenerator;
	        if (!this.match('(')) {
	            var token = this.lookahead;
	            id = (!this.context.strict && !isGenerator && this.matchKeyword('yield')) ? this.parseIdentifierName() : this.parseVariableIdentifier();
	            if (this.context.strict) {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.StrictFunctionName);
	                }
	            }
	            else {
	                if (this.scanner.isRestrictedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictFunctionName;
	                }
	                else if (this.scanner.isStrictModeReservedWord(token.value)) {
	                    firstRestricted = token;
	                    message = messages_1.Messages.StrictReservedWord;
	                }
	            }
	        }
	        var formalParameters = this.parseFormalParameters(firstRestricted);
	        var params = formalParameters.params;
	        var stricted = formalParameters.stricted;
	        firstRestricted = formalParameters.firstRestricted;
	        if (formalParameters.message) {
	            message = formalParameters.message;
	        }
	        var previousStrict = this.context.strict;
	        var previousAllowStrictDirective = this.context.allowStrictDirective;
	        this.context.allowStrictDirective = formalParameters.simple;
	        var body = this.parseFunctionSourceElements();
	        if (this.context.strict && firstRestricted) {
	            this.throwUnexpectedToken(firstRestricted, message);
	        }
	        if (this.context.strict && stricted) {
	            this.tolerateUnexpectedToken(stricted, message);
	        }
	        this.context.strict = previousStrict;
	        this.context.allowStrictDirective = previousAllowStrictDirective;
	        this.context.await = previousAllowAwait;
	        this.context.allowYield = previousAllowYield;
	        return isAsync ? this.finalize(node, new Node.AsyncFunctionExpression(id, params, body)) :
	            this.finalize(node, new Node.FunctionExpression(id, params, body, isGenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive
	    Parser.prototype.parseDirective = function () {
	        var token = this.lookahead;
	        var node = this.createNode();
	        var expr = this.parseExpression();
	        var directive = (expr.type === syntax_1.Syntax.Literal) ? this.getTokenRaw(token).slice(1, -1) : null;
	        this.consumeSemicolon();
	        return this.finalize(node, directive ? new Node.Directive(expr, directive) : new Node.ExpressionStatement(expr));
	    };
	    Parser.prototype.parseDirectivePrologues = function () {
	        var firstRestricted = null;
	        var body = [];
	        while (true) {
	            var token = this.lookahead;
	            if (token.type !== 8 /* StringLiteral */) {
	                break;
	            }
	            var statement = this.parseDirective();
	            body.push(statement);
	            var directive = statement.directive;
	            if (typeof directive !== 'string') {
	                break;
	            }
	            if (directive === 'use strict') {
	                this.context.strict = true;
	                if (firstRestricted) {
	                    this.tolerateUnexpectedToken(firstRestricted, messages_1.Messages.StrictOctalLiteral);
	                }
	                if (!this.context.allowStrictDirective) {
	                    this.tolerateUnexpectedToken(token, messages_1.Messages.IllegalLanguageModeDirective);
	                }
	            }
	            else {
	                if (!firstRestricted && token.octal) {
	                    firstRestricted = token;
	                }
	            }
	        }
	        return body;
	    };
	    // https://tc39.github.io/ecma262/#sec-method-definitions
	    Parser.prototype.qualifiedPropertyName = function (token) {
	        switch (token.type) {
	            case 3 /* Identifier */:
	            case 8 /* StringLiteral */:
	            case 1 /* BooleanLiteral */:
	            case 5 /* NullLiteral */:
	            case 6 /* NumericLiteral */:
	            case 4 /* Keyword */:
	                return true;
	            case 7 /* Punctuator */:
	                return token.value === '[';
	            default:
	                break;
	        }
	        return false;
	    };
	    Parser.prototype.parseGetterMethod = function () {
	        var node = this.createNode();
	        var isGenerator = false;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var formalParameters = this.parseFormalParameters();
	        if (formalParameters.params.length > 0) {
	            this.tolerateError(messages_1.Messages.BadGetterArity);
	        }
	        var method = this.parsePropertyMethod(formalParameters);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
	    };
	    Parser.prototype.parseSetterMethod = function () {
	        var node = this.createNode();
	        var isGenerator = false;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = false;
	        var formalParameters = this.parseFormalParameters();
	        if (formalParameters.params.length !== 1) {
	            this.tolerateError(messages_1.Messages.BadSetterArity);
	        }
	        else if (formalParameters.params[0] instanceof Node.RestElement) {
	            this.tolerateError(messages_1.Messages.BadSetterRestParameter);
	        }
	        var method = this.parsePropertyMethod(formalParameters);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, formalParameters.params, method, isGenerator));
	    };
	    Parser.prototype.parseGeneratorMethod = function () {
	        var node = this.createNode();
	        var isGenerator = true;
	        var previousAllowYield = this.context.allowYield;
	        this.context.allowYield = true;
	        var params = this.parseFormalParameters();
	        this.context.allowYield = false;
	        var method = this.parsePropertyMethod(params);
	        this.context.allowYield = previousAllowYield;
	        return this.finalize(node, new Node.FunctionExpression(null, params.params, method, isGenerator));
	    };
	    // https://tc39.github.io/ecma262/#sec-generator-function-definitions
	    Parser.prototype.isStartOfExpression = function () {
	        var start = true;
	        var value = this.lookahead.value;
	        switch (this.lookahead.type) {
	            case 7 /* Punctuator */:
	                start = (value === '[') || (value === '(') || (value === '{') ||
	                    (value === '+') || (value === '-') ||
	                    (value === '!') || (value === '~') ||
	                    (value === '++') || (value === '--') ||
	                    (value === '/') || (value === '/='); // regular expression literal
	                break;
	            case 4 /* Keyword */:
	                start = (value === 'class') || (value === 'delete') ||
	                    (value === 'function') || (value === 'let') || (value === 'new') ||
	                    (value === 'super') || (value === 'this') || (value === 'typeof') ||
	                    (value === 'void') || (value === 'yield');
	                break;
	            default:
	                break;
	        }
	        return start;
	    };
	    Parser.prototype.parseYieldExpression = function () {
	        var node = this.createNode();
	        this.expectKeyword('yield');
	        var argument = null;
	        var delegate = false;
	        if (!this.hasLineTerminator) {
	            var previousAllowYield = this.context.allowYield;
	            this.context.allowYield = false;
	            delegate = this.match('*');
	            if (delegate) {
	                this.nextToken();
	                argument = this.parseAssignmentExpression();
	            }
	            else if (this.isStartOfExpression()) {
	                argument = this.parseAssignmentExpression();
	            }
	            this.context.allowYield = previousAllowYield;
	        }
	        return this.finalize(node, new Node.YieldExpression(argument, delegate));
	    };
	    // https://tc39.github.io/ecma262/#sec-class-definitions
	    Parser.prototype.parseClassElement = function (hasConstructor) {
	        var token = this.lookahead;
	        var node = this.createNode();
	        var kind = '';
	        var key = null;
	        var value = null;
	        var computed = false;
	        var method = false;
	        var isStatic = false;
	        var isAsync = false;
	        if (this.match('*')) {
	            this.nextToken();
	        }
	        else {
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            var id = key;
	            if (id.name === 'static' && (this.qualifiedPropertyName(this.lookahead) || this.match('*'))) {
	                token = this.lookahead;
	                isStatic = true;
	                computed = this.match('[');
	                if (this.match('*')) {
	                    this.nextToken();
	                }
	                else {
	                    key = this.parseObjectPropertyKey();
	                }
	            }
	            if ((token.type === 3 /* Identifier */) && !this.hasLineTerminator && (token.value === 'async')) {
	                var punctuator = this.lookahead.value;
	                if (punctuator !== ':' && punctuator !== '(' && punctuator !== '*') {
	                    isAsync = true;
	                    token = this.lookahead;
	                    key = this.parseObjectPropertyKey();
	                    if (token.type === 3 /* Identifier */) {
	                        if (token.value === 'get' || token.value === 'set') {
	                            this.tolerateUnexpectedToken(token);
	                        }
	                        else if (token.value === 'constructor') {
	                            this.tolerateUnexpectedToken(token, messages_1.Messages.ConstructorIsAsync);
	                        }
	                    }
	                }
	            }
	        }
	        var lookaheadPropertyKey = this.qualifiedPropertyName(this.lookahead);
	        if (token.type === 3 /* Identifier */) {
	            if (token.value === 'get' && lookaheadPropertyKey) {
	                kind = 'get';
	                computed = this.match('[');
	                key = this.parseObjectPropertyKey();
	                this.context.allowYield = false;
	                value = this.parseGetterMethod();
	            }
	            else if (token.value === 'set' && lookaheadPropertyKey) {
	                kind = 'set';
	                computed = this.match('[');
	                key = this.parseObjectPropertyKey();
	                value = this.parseSetterMethod();
	            }
	        }
	        else if (token.type === 7 /* Punctuator */ && token.value === '*' && lookaheadPropertyKey) {
	            kind = 'init';
	            computed = this.match('[');
	            key = this.parseObjectPropertyKey();
	            value = this.parseGeneratorMethod();
	            method = true;
	        }
	        if (!kind && key && this.match('(')) {
	            kind = 'init';
	            value = isAsync ? this.parsePropertyMethodAsyncFunction() : this.parsePropertyMethodFunction();
	            method = true;
	        }
	        if (!kind) {
	            this.throwUnexpectedToken(this.lookahead);
	        }
	        if (kind === 'init') {
	            kind = 'method';
	        }
	        if (!computed) {
	            if (isStatic && this.isPropertyKey(key, 'prototype')) {
	                this.throwUnexpectedToken(token, messages_1.Messages.StaticPrototype);
	            }
	            if (!isStatic && this.isPropertyKey(key, 'constructor')) {
	                if (kind !== 'method' || !method || (value && value.generator)) {
	                    this.throwUnexpectedToken(token, messages_1.Messages.ConstructorSpecialMethod);
	                }
	                if (hasConstructor.value) {
	                    this.throwUnexpectedToken(token, messages_1.Messages.DuplicateConstructor);
	                }
	                else {
	                    hasConstructor.value = true;
	                }
	                kind = 'constructor';
	            }
	        }
	        return this.finalize(node, new Node.MethodDefinition(key, computed, value, kind, isStatic));
	    };
	    Parser.prototype.parseClassElementList = function () {
	        var body = [];
	        var hasConstructor = { value: false };
	        this.expect('{');
	        while (!this.match('}')) {
	            if (this.match(';')) {
	                this.nextToken();
	            }
	            else {
	                body.push(this.parseClassElement(hasConstructor));
	            }
	        }
	        this.expect('}');
	        return body;
	    };
	    Parser.prototype.parseClassBody = function () {
	        var node = this.createNode();
	        var elementList = this.parseClassElementList();
	        return this.finalize(node, new Node.ClassBody(elementList));
	    };
	    Parser.prototype.parseClassDeclaration = function (identifierIsOptional) {
	        var node = this.createNode();
	        var previousStrict = this.context.strict;
	        this.context.strict = true;
	        this.expectKeyword('class');
	        var id = (identifierIsOptional && (this.lookahead.type !== 3 /* Identifier */)) ? null : this.parseVariableIdentifier();
	        var superClass = null;
	        if (this.matchKeyword('extends')) {
	            this.nextToken();
	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	        }
	        var classBody = this.parseClassBody();
	        this.context.strict = previousStrict;
	        return this.finalize(node, new Node.ClassDeclaration(id, superClass, classBody));
	    };
	    Parser.prototype.parseClassExpression = function () {
	        var node = this.createNode();
	        var previousStrict = this.context.strict;
	        this.context.strict = true;
	        this.expectKeyword('class');
	        var id = (this.lookahead.type === 3 /* Identifier */) ? this.parseVariableIdentifier() : null;
	        var superClass = null;
	        if (this.matchKeyword('extends')) {
	            this.nextToken();
	            superClass = this.isolateCoverGrammar(this.parseLeftHandSideExpressionAllowCall);
	        }
	        var classBody = this.parseClassBody();
	        this.context.strict = previousStrict;
	        return this.finalize(node, new Node.ClassExpression(id, superClass, classBody));
	    };
	    // https://tc39.github.io/ecma262/#sec-scripts
	    // https://tc39.github.io/ecma262/#sec-modules
	    Parser.prototype.parseModule = function () {
	        this.context.strict = true;
	        this.context.isModule = true;
	        var node = this.createNode();
	        var body = this.parseDirectivePrologues();
	        while (this.lookahead.type !== 2 /* EOF */) {
	            body.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.Module(body));
	    };
	    Parser.prototype.parseScript = function () {
	        var node = this.createNode();
	        var body = this.parseDirectivePrologues();
	        while (this.lookahead.type !== 2 /* EOF */) {
	            body.push(this.parseStatementListItem());
	        }
	        return this.finalize(node, new Node.Script(body));
	    };
	    // https://tc39.github.io/ecma262/#sec-imports
	    Parser.prototype.parseModuleSpecifier = function () {
	        var node = this.createNode();
	        if (this.lookahead.type !== 8 /* StringLiteral */) {
	            this.throwError(messages_1.Messages.InvalidModuleSpecifier);
	        }
	        var token = this.nextToken();
	        var raw = this.getTokenRaw(token);
	        return this.finalize(node, new Node.Literal(token.value, raw));
	    };
	    // import {<foo as bar>} ...;
	    Parser.prototype.parseImportSpecifier = function () {
	        var node = this.createNode();
	        var imported;
	        var local;
	        if (this.lookahead.type === 3 /* Identifier */) {
	            imported = this.parseVariableIdentifier();
	            local = imported;
	            if (this.matchContextualKeyword('as')) {
	                this.nextToken();
	                local = this.parseVariableIdentifier();
	            }
	        }
	        else {
	            imported = this.parseIdentifierName();
	            local = imported;
	            if (this.matchContextualKeyword('as')) {
	                this.nextToken();
	                local = this.parseVariableIdentifier();
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	        }
	        return this.finalize(node, new Node.ImportSpecifier(local, imported));
	    };
	    // {foo, bar as bas}
	    Parser.prototype.parseNamedImports = function () {
	        this.expect('{');
	        var specifiers = [];
	        while (!this.match('}')) {
	            specifiers.push(this.parseImportSpecifier());
	            if (!this.match('}')) {
	                this.expect(',');
	            }
	        }
	        this.expect('}');
	        return specifiers;
	    };
	    // import <foo> ...;
	    Parser.prototype.parseImportDefaultSpecifier = function () {
	        var node = this.createNode();
	        var local = this.parseIdentifierName();
	        return this.finalize(node, new Node.ImportDefaultSpecifier(local));
	    };
	    // import <* as foo> ...;
	    Parser.prototype.parseImportNamespaceSpecifier = function () {
	        var node = this.createNode();
	        this.expect('*');
	        if (!this.matchContextualKeyword('as')) {
	            this.throwError(messages_1.Messages.NoAsAfterImportNamespace);
	        }
	        this.nextToken();
	        var local = this.parseIdentifierName();
	        return this.finalize(node, new Node.ImportNamespaceSpecifier(local));
	    };
	    Parser.prototype.parseImportDeclaration = function () {
	        if (this.context.inFunctionBody) {
	            this.throwError(messages_1.Messages.IllegalImportDeclaration);
	        }
	        var node = this.createNode();
	        this.expectKeyword('import');
	        var src;
	        var specifiers = [];
	        if (this.lookahead.type === 8 /* StringLiteral */) {
	            // import 'foo';
	            src = this.parseModuleSpecifier();
	        }
	        else {
	            if (this.match('{')) {
	                // import {bar}
	                specifiers = specifiers.concat(this.parseNamedImports());
	            }
	            else if (this.match('*')) {
	                // import * as foo
	                specifiers.push(this.parseImportNamespaceSpecifier());
	            }
	            else if (this.isIdentifierName(this.lookahead) && !this.matchKeyword('default')) {
	                // import foo
	                specifiers.push(this.parseImportDefaultSpecifier());
	                if (this.match(',')) {
	                    this.nextToken();
	                    if (this.match('*')) {
	                        // import foo, * as foo
	                        specifiers.push(this.parseImportNamespaceSpecifier());
	                    }
	                    else if (this.match('{')) {
	                        // import foo, {bar}
	                        specifiers = specifiers.concat(this.parseNamedImports());
	                    }
	                    else {
	                        this.throwUnexpectedToken(this.lookahead);
	                    }
	                }
	            }
	            else {
	                this.throwUnexpectedToken(this.nextToken());
	            }
	            if (!this.matchContextualKeyword('from')) {
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            this.nextToken();
	            src = this.parseModuleSpecifier();
	        }
	        this.consumeSemicolon();
	        return this.finalize(node, new Node.ImportDeclaration(specifiers, src));
	    };
	    // https://tc39.github.io/ecma262/#sec-exports
	    Parser.prototype.parseExportSpecifier = function () {
	        var node = this.createNode();
	        var local = this.parseIdentifierName();
	        var exported = local;
	        if (this.matchContextualKeyword('as')) {
	            this.nextToken();
	            exported = this.parseIdentifierName();
	        }
	        return this.finalize(node, new Node.ExportSpecifier(local, exported));
	    };
	    Parser.prototype.parseExportDeclaration = function () {
	        if (this.context.inFunctionBody) {
	            this.throwError(messages_1.Messages.IllegalExportDeclaration);
	        }
	        var node = this.createNode();
	        this.expectKeyword('export');
	        var exportDeclaration;
	        if (this.matchKeyword('default')) {
	            // export default ...
	            this.nextToken();
	            if (this.matchKeyword('function')) {
	                // export default function foo () {}
	                // export default function () {}
	                var declaration = this.parseFunctionDeclaration(true);
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else if (this.matchKeyword('class')) {
	                // export default class foo {}
	                var declaration = this.parseClassDeclaration(true);
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else if (this.matchContextualKeyword('async')) {
	                // export default async function f () {}
	                // export default async function () {}
	                // export default async x => x
	                var declaration = this.matchAsyncFunction() ? this.parseFunctionDeclaration(true) : this.parseAssignmentExpression();
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	            else {
	                if (this.matchContextualKeyword('from')) {
	                    this.throwError(messages_1.Messages.UnexpectedToken, this.lookahead.value);
	                }
	                // export default {};
	                // export default [];
	                // export default (1 + 2);
	                var declaration = this.match('{') ? this.parseObjectInitializer() :
	                    this.match('[') ? this.parseArrayInitializer() : this.parseAssignmentExpression();
	                this.consumeSemicolon();
	                exportDeclaration = this.finalize(node, new Node.ExportDefaultDeclaration(declaration));
	            }
	        }
	        else if (this.match('*')) {
	            // export * from 'foo';
	            this.nextToken();
	            if (!this.matchContextualKeyword('from')) {
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            this.nextToken();
	            var src = this.parseModuleSpecifier();
	            this.consumeSemicolon();
	            exportDeclaration = this.finalize(node, new Node.ExportAllDeclaration(src));
	        }
	        else if (this.lookahead.type === 4 /* Keyword */) {
	            // export var f = 1;
	            var declaration = void 0;
	            switch (this.lookahead.value) {
	                case 'let':
	                case 'const':
	                    declaration = this.parseLexicalDeclaration({ inFor: false });
	                    break;
	                case 'var':
	                case 'class':
	                case 'function':
	                    declaration = this.parseStatementListItem();
	                    break;
	                default:
	                    this.throwUnexpectedToken(this.lookahead);
	            }
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
	        }
	        else if (this.matchAsyncFunction()) {
	            var declaration = this.parseFunctionDeclaration();
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(declaration, [], null));
	        }
	        else {
	            var specifiers = [];
	            var source = null;
	            var isExportFromIdentifier = false;
	            this.expect('{');
	            while (!this.match('}')) {
	                isExportFromIdentifier = isExportFromIdentifier || this.matchKeyword('default');
	                specifiers.push(this.parseExportSpecifier());
	                if (!this.match('}')) {
	                    this.expect(',');
	                }
	            }
	            this.expect('}');
	            if (this.matchContextualKeyword('from')) {
	                // export {default} from 'foo';
	                // export {foo} from 'foo';
	                this.nextToken();
	                source = this.parseModuleSpecifier();
	                this.consumeSemicolon();
	            }
	            else if (isExportFromIdentifier) {
	                // export {default}; // missing fromClause
	                var message = this.lookahead.value ? messages_1.Messages.UnexpectedToken : messages_1.Messages.MissingFromClause;
	                this.throwError(message, this.lookahead.value);
	            }
	            else {
	                // export {foo};
	                this.consumeSemicolon();
	            }
	            exportDeclaration = this.finalize(node, new Node.ExportNamedDeclaration(null, specifiers, source));
	        }
	        return exportDeclaration;
	    };
	    return Parser;
	}());
	exports.Parser = Parser;


/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	// Ensure the condition is true, otherwise throw an error.
	// This is only to have a better contract semantic, i.e. another safety net
	// to catch a logic error. The condition shall be fulfilled in normal case.
	// Do NOT use this to enforce a certain condition on any user input.
	Object.defineProperty(exports, "__esModule", { value: true });
	function assert(condition, message) {
	    /* istanbul ignore if */
	    if (!condition) {
	        throw new Error('ASSERT: ' + message);
	    }
	}
	exports.assert = assert;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	/* tslint:disable:max-classes-per-file */
	Object.defineProperty(exports, "__esModule", { value: true });
	var ErrorHandler = (function () {
	    function ErrorHandler() {
	        this.errors = [];
	        this.tolerant = false;
	    }
	    ErrorHandler.prototype.recordError = function (error) {
	        this.errors.push(error);
	    };
	    ErrorHandler.prototype.tolerate = function (error) {
	        if (this.tolerant) {
	            this.recordError(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    ErrorHandler.prototype.constructError = function (msg, column) {
	        var error = new Error(msg);
	        try {
	            throw error;
	        }
	        catch (base) {
	            /* istanbul ignore else */
	            if (Object.create && Object.defineProperty) {
	                error = Object.create(base);
	                Object.defineProperty(error, 'column', { value: column });
	            }
	        }
	        /* istanbul ignore next */
	        return error;
	    };
	    ErrorHandler.prototype.createError = function (index, line, col, description) {
	        var msg = 'Line ' + line + ': ' + description;
	        var error = this.constructError(msg, col);
	        error.index = index;
	        error.lineNumber = line;
	        error.description = description;
	        return error;
	    };
	    ErrorHandler.prototype.throwError = function (index, line, col, description) {
	        throw this.createError(index, line, col, description);
	    };
	    ErrorHandler.prototype.tolerateError = function (index, line, col, description) {
	        var error = this.createError(index, line, col, description);
	        if (this.tolerant) {
	            this.recordError(error);
	        }
	        else {
	            throw error;
	        }
	    };
	    return ErrorHandler;
	}());
	exports.ErrorHandler = ErrorHandler;


/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	// Error messages should be identical to V8.
	exports.Messages = {
	    BadGetterArity: 'Getter must not have any formal parameters',
	    BadSetterArity: 'Setter must have exactly one formal parameter',
	    BadSetterRestParameter: 'Setter function argument must not be a rest parameter',
	    ConstructorIsAsync: 'Class constructor may not be an async method',
	    ConstructorSpecialMethod: 'Class constructor may not be an accessor',
	    DeclarationMissingInitializer: 'Missing initializer in %0 declaration',
	    DefaultRestParameter: 'Unexpected token =',
	    DuplicateBinding: 'Duplicate binding %0',
	    DuplicateConstructor: 'A class may only have one constructor',
	    DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
	    ForInOfLoopInitializer: '%0 loop variable declaration may not have an initializer',
	    GeneratorInLegacyContext: 'Generator declarations are not allowed in legacy contexts',
	    IllegalBreak: 'Illegal break statement',
	    IllegalContinue: 'Illegal continue statement',
	    IllegalExportDeclaration: 'Unexpected token',
	    IllegalImportDeclaration: 'Unexpected token',
	    IllegalLanguageModeDirective: 'Illegal \'use strict\' directive in function with non-simple parameter list',
	    IllegalReturn: 'Illegal return statement',
	    InvalidEscapedReservedWord: 'Keyword must not contain escaped characters',
	    InvalidHexEscapeSequence: 'Invalid hexadecimal escape sequence',
	    InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
	    InvalidLHSInForIn: 'Invalid left-hand side in for-in',
	    InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
	    InvalidModuleSpecifier: 'Unexpected token',
	    InvalidRegExp: 'Invalid regular expression',
	    LetInLexicalBinding: 'let is disallowed as a lexically bound name',
	    MissingFromClause: 'Unexpected token',
	    MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	    NewlineAfterThrow: 'Illegal newline after throw',
	    NoAsAfterImportNamespace: 'Unexpected token',
	    NoCatchOrFinally: 'Missing catch or finally after try',
	    ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
	    Redeclaration: '%0 \'%1\' has already been declared',
	    StaticPrototype: 'Classes may not have static property named prototype',
	    StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
	    StrictDelete: 'Delete of an unqualified identifier in strict mode.',
	    StrictFunction: 'In strict mode code, functions can only be declared at top level or inside a block',
	    StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
	    StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
	    StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	    StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	    StrictModeWith: 'Strict mode code may not include a with statement',
	    StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
	    StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	    StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
	    StrictReservedWord: 'Use of future reserved word in strict mode',
	    StrictVarName: 'Variable name may not be eval or arguments in strict mode',
	    TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
	    UnexpectedEOS: 'Unexpected end of input',
	    UnexpectedIdentifier: 'Unexpected identifier',
	    UnexpectedNumber: 'Unexpected number',
	    UnexpectedReserved: 'Unexpected reserved word',
	    UnexpectedString: 'Unexpected string',
	    UnexpectedTemplate: 'Unexpected quasi %0',
	    UnexpectedToken: 'Unexpected token %0',
	    UnexpectedTokenIllegal: 'Unexpected token ILLEGAL',
	    UnknownLabel: 'Undefined label \'%0\'',
	    UnterminatedRegExp: 'Invalid regular expression: missing /'
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var assert_1 = __webpack_require__(9);
	var character_1 = __webpack_require__(4);
	var messages_1 = __webpack_require__(11);
	function hexValue(ch) {
	    return '0123456789abcdef'.indexOf(ch.toLowerCase());
	}
	function octalValue(ch) {
	    return '01234567'.indexOf(ch);
	}
	var Scanner = (function () {
	    function Scanner(code, handler) {
	        this.source = code;
	        this.errorHandler = handler;
	        this.trackComment = false;
	        this.length = code.length;
	        this.index = 0;
	        this.lineNumber = (code.length > 0) ? 1 : 0;
	        this.lineStart = 0;
	        this.curlyStack = [];
	    }
	    Scanner.prototype.saveState = function () {
	        return {
	            index: this.index,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart
	        };
	    };
	    Scanner.prototype.restoreState = function (state) {
	        this.index = state.index;
	        this.lineNumber = state.lineNumber;
	        this.lineStart = state.lineStart;
	    };
	    Scanner.prototype.eof = function () {
	        return this.index >= this.length;
	    };
	    Scanner.prototype.throwUnexpectedToken = function (message) {
	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
	        return this.errorHandler.throwError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
	    };
	    Scanner.prototype.tolerateUnexpectedToken = function (message) {
	        if (message === void 0) { message = messages_1.Messages.UnexpectedTokenIllegal; }
	        this.errorHandler.tolerateError(this.index, this.lineNumber, this.index - this.lineStart + 1, message);
	    };
	    // https://tc39.github.io/ecma262/#sec-comments
	    Scanner.prototype.skipSingleLineComment = function (offset) {
	        var comments = [];
	        var start, loc;
	        if (this.trackComment) {
	            comments = [];
	            start = this.index - offset;
	            loc = {
	                start: {
	                    line: this.lineNumber,
	                    column: this.index - this.lineStart - offset
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            ++this.index;
	            if (character_1.Character.isLineTerminator(ch)) {
	                if (this.trackComment) {
	                    loc.end = {
	                        line: this.lineNumber,
	                        column: this.index - this.lineStart - 1
	                    };
	                    var entry = {
	                        multiLine: false,
	                        slice: [start + offset, this.index - 1],
	                        range: [start, this.index - 1],
	                        loc: loc
	                    };
	                    comments.push(entry);
	                }
	                if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                this.lineStart = this.index;
	                return comments;
	            }
	        }
	        if (this.trackComment) {
	            loc.end = {
	                line: this.lineNumber,
	                column: this.index - this.lineStart
	            };
	            var entry = {
	                multiLine: false,
	                slice: [start + offset, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        return comments;
	    };
	    Scanner.prototype.skipMultiLineComment = function () {
	        var comments = [];
	        var start, loc;
	        if (this.trackComment) {
	            comments = [];
	            start = this.index - 2;
	            loc = {
	                start: {
	                    line: this.lineNumber,
	                    column: this.index - this.lineStart - 2
	                },
	                end: {}
	            };
	        }
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (character_1.Character.isLineTerminator(ch)) {
	                if (ch === 0x0D && this.source.charCodeAt(this.index + 1) === 0x0A) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                ++this.index;
	                this.lineStart = this.index;
	            }
	            else if (ch === 0x2A) {
	                // Block comment ends with '*/'.
	                if (this.source.charCodeAt(this.index + 1) === 0x2F) {
	                    this.index += 2;
	                    if (this.trackComment) {
	                        loc.end = {
	                            line: this.lineNumber,
	                            column: this.index - this.lineStart
	                        };
	                        var entry = {
	                            multiLine: true,
	                            slice: [start + 2, this.index - 2],
	                            range: [start, this.index],
	                            loc: loc
	                        };
	                        comments.push(entry);
	                    }
	                    return comments;
	                }
	                ++this.index;
	            }
	            else {
	                ++this.index;
	            }
	        }
	        // Ran off the end of the file - the whole thing is a comment
	        if (this.trackComment) {
	            loc.end = {
	                line: this.lineNumber,
	                column: this.index - this.lineStart
	            };
	            var entry = {
	                multiLine: true,
	                slice: [start + 2, this.index],
	                range: [start, this.index],
	                loc: loc
	            };
	            comments.push(entry);
	        }
	        this.tolerateUnexpectedToken();
	        return comments;
	    };
	    Scanner.prototype.scanComments = function () {
	        var comments;
	        if (this.trackComment) {
	            comments = [];
	        }
	        var start = (this.index === 0);
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (character_1.Character.isWhiteSpace(ch)) {
	                ++this.index;
	            }
	            else if (character_1.Character.isLineTerminator(ch)) {
	                ++this.index;
	                if (ch === 0x0D && this.source.charCodeAt(this.index) === 0x0A) {
	                    ++this.index;
	                }
	                ++this.lineNumber;
	                this.lineStart = this.index;
	                start = true;
	            }
	            else if (ch === 0x2F) {
	                ch = this.source.charCodeAt(this.index + 1);
	                if (ch === 0x2F) {
	                    this.index += 2;
	                    var comment = this.skipSingleLineComment(2);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                    start = true;
	                }
	                else if (ch === 0x2A) {
	                    this.index += 2;
	                    var comment = this.skipMultiLineComment();
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (start && ch === 0x2D) {
	                // U+003E is '>'
	                if ((this.source.charCodeAt(this.index + 1) === 0x2D) && (this.source.charCodeAt(this.index + 2) === 0x3E)) {
	                    // '-->' is a single-line comment
	                    this.index += 3;
	                    var comment = this.skipSingleLineComment(3);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else if (ch === 0x3C) {
	                if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
	                    this.index += 4; // `<!--`
	                    var comment = this.skipSingleLineComment(4);
	                    if (this.trackComment) {
	                        comments = comments.concat(comment);
	                    }
	                }
	                else {
	                    break;
	                }
	            }
	            else {
	                break;
	            }
	        }
	        return comments;
	    };
	    // https://tc39.github.io/ecma262/#sec-future-reserved-words
	    Scanner.prototype.isFutureReservedWord = function (id) {
	        switch (id) {
	            case 'enum':
	            case 'export':
	            case 'import':
	            case 'super':
	                return true;
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.isStrictModeReservedWord = function (id) {
	        switch (id) {
	            case 'implements':
	            case 'interface':
	            case 'package':
	            case 'private':
	            case 'protected':
	            case 'public':
	            case 'static':
	            case 'yield':
	            case 'let':
	                return true;
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.isRestrictedWord = function (id) {
	        return id === 'eval' || id === 'arguments';
	    };
	    // https://tc39.github.io/ecma262/#sec-keywords
	    Scanner.prototype.isKeyword = function (id) {
	        switch (id.length) {
	            case 2:
	                return (id === 'if') || (id === 'in') || (id === 'do');
	            case 3:
	                return (id === 'var') || (id === 'for') || (id === 'new') ||
	                    (id === 'try') || (id === 'let');
	            case 4:
	                return (id === 'this') || (id === 'else') || (id === 'case') ||
	                    (id === 'void') || (id === 'with') || (id === 'enum');
	            case 5:
	                return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                    (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                    (id === 'class') || (id === 'super');
	            case 6:
	                return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                    (id === 'switch') || (id === 'export') || (id === 'import');
	            case 7:
	                return (id === 'default') || (id === 'finally') || (id === 'extends');
	            case 8:
	                return (id === 'function') || (id === 'continue') || (id === 'debugger');
	            case 10:
	                return (id === 'instanceof');
	            default:
	                return false;
	        }
	    };
	    Scanner.prototype.codePointAt = function (i) {
	        var cp = this.source.charCodeAt(i);
	        if (cp >= 0xD800 && cp <= 0xDBFF) {
	            var second = this.source.charCodeAt(i + 1);
	            if (second >= 0xDC00 && second <= 0xDFFF) {
	                var first = cp;
	                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
	            }
	        }
	        return cp;
	    };
	    Scanner.prototype.scanHexEscape = function (prefix) {
	        var len = (prefix === 'u') ? 4 : 2;
	        var code = 0;
	        for (var i = 0; i < len; ++i) {
	            if (!this.eof() && character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
	                code = code * 16 + hexValue(this.source[this.index++]);
	            }
	            else {
	                return null;
	            }
	        }
	        return String.fromCharCode(code);
	    };
	    Scanner.prototype.scanUnicodeCodePointEscape = function () {
	        var ch = this.source[this.index];
	        var code = 0;
	        // At least, one hex digit is required.
	        if (ch === '}') {
	            this.throwUnexpectedToken();
	        }
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            if (!character_1.Character.isHexDigit(ch.charCodeAt(0))) {
	                break;
	            }
	            code = code * 16 + hexValue(ch);
	        }
	        if (code > 0x10FFFF || ch !== '}') {
	            this.throwUnexpectedToken();
	        }
	        return character_1.Character.fromCodePoint(code);
	    };
	    Scanner.prototype.getIdentifier = function () {
	        var start = this.index++;
	        while (!this.eof()) {
	            var ch = this.source.charCodeAt(this.index);
	            if (ch === 0x5C) {
	                // Blackslash (U+005C) marks Unicode escape sequence.
	                this.index = start;
	                return this.getComplexIdentifier();
	            }
	            else if (ch >= 0xD800 && ch < 0xDFFF) {
	                // Need to handle surrogate pairs.
	                this.index = start;
	                return this.getComplexIdentifier();
	            }
	            if (character_1.Character.isIdentifierPart(ch)) {
	                ++this.index;
	            }
	            else {
	                break;
	            }
	        }
	        return this.source.slice(start, this.index);
	    };
	    Scanner.prototype.getComplexIdentifier = function () {
	        var cp = this.codePointAt(this.index);
	        var id = character_1.Character.fromCodePoint(cp);
	        this.index += id.length;
	        // '\u' (U+005C, U+0075) denotes an escaped character.
	        var ch;
	        if (cp === 0x5C) {
	            if (this.source.charCodeAt(this.index) !== 0x75) {
	                this.throwUnexpectedToken();
	            }
	            ++this.index;
	            if (this.source[this.index] === '{') {
	                ++this.index;
	                ch = this.scanUnicodeCodePointEscape();
	            }
	            else {
	                ch = this.scanHexEscape('u');
	                if (ch === null || ch === '\\' || !character_1.Character.isIdentifierStart(ch.charCodeAt(0))) {
	                    this.throwUnexpectedToken();
	                }
	            }
	            id = ch;
	        }
	        while (!this.eof()) {
	            cp = this.codePointAt(this.index);
	            if (!character_1.Character.isIdentifierPart(cp)) {
	                break;
	            }
	            ch = character_1.Character.fromCodePoint(cp);
	            id += ch;
	            this.index += ch.length;
	            // '\u' (U+005C, U+0075) denotes an escaped character.
	            if (cp === 0x5C) {
	                id = id.substr(0, id.length - 1);
	                if (this.source.charCodeAt(this.index) !== 0x75) {
	                    this.throwUnexpectedToken();
	                }
	                ++this.index;
	                if (this.source[this.index] === '{') {
	                    ++this.index;
	                    ch = this.scanUnicodeCodePointEscape();
	                }
	                else {
	                    ch = this.scanHexEscape('u');
	                    if (ch === null || ch === '\\' || !character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
	                        this.throwUnexpectedToken();
	                    }
	                }
	                id += ch;
	            }
	        }
	        return id;
	    };
	    Scanner.prototype.octalToDecimal = function (ch) {
	        // \0 is not octal escape sequence
	        var octal = (ch !== '0');
	        var code = octalValue(ch);
	        if (!this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	            octal = true;
	            code = code * 8 + octalValue(this.source[this.index++]);
	            // 3 digits are only allowed when string starts
	            // with 0, 1, 2, 3
	            if ('0123'.indexOf(ch) >= 0 && !this.eof() && character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	                code = code * 8 + octalValue(this.source[this.index++]);
	            }
	        }
	        return {
	            code: code,
	            octal: octal
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-names-and-keywords
	    Scanner.prototype.scanIdentifier = function () {
	        var type;
	        var start = this.index;
	        // Backslash (U+005C) starts an escaped character.
	        var id = (this.source.charCodeAt(start) === 0x5C) ? this.getComplexIdentifier() : this.getIdentifier();
	        // There is no keyword or literal with only one character.
	        // Thus, it must be an identifier.
	        if (id.length === 1) {
	            type = 3 /* Identifier */;
	        }
	        else if (this.isKeyword(id)) {
	            type = 4 /* Keyword */;
	        }
	        else if (id === 'null') {
	            type = 5 /* NullLiteral */;
	        }
	        else if (id === 'true' || id === 'false') {
	            type = 1 /* BooleanLiteral */;
	        }
	        else {
	            type = 3 /* Identifier */;
	        }
	        if (type !== 3 /* Identifier */ && (start + id.length !== this.index)) {
	            var restore = this.index;
	            this.index = start;
	            this.tolerateUnexpectedToken(messages_1.Messages.InvalidEscapedReservedWord);
	            this.index = restore;
	        }
	        return {
	            type: type,
	            value: id,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-punctuators
	    Scanner.prototype.scanPunctuator = function () {
	        var start = this.index;
	        // Check for most common single-character punctuators.
	        var str = this.source[this.index];
	        switch (str) {
	            case '(':
	            case '{':
	                if (str === '{') {
	                    this.curlyStack.push('{');
	                }
	                ++this.index;
	                break;
	            case '.':
	                ++this.index;
	                if (this.source[this.index] === '.' && this.source[this.index + 1] === '.') {
	                    // Spread operator: ...
	                    this.index += 2;
	                    str = '...';
	                }
	                break;
	            case '}':
	                ++this.index;
	                this.curlyStack.pop();
	                break;
	            case ')':
	            case ';':
	            case ',':
	            case '[':
	            case ']':
	            case ':':
	            case '?':
	            case '~':
	                ++this.index;
	                break;
	            default:
	                // 4-character punctuator.
	                str = this.source.substr(this.index, 4);
	                if (str === '>>>=') {
	                    this.index += 4;
	                }
	                else {
	                    // 3-character punctuators.
	                    str = str.substr(0, 3);
	                    if (str === '===' || str === '!==' || str === '>>>' ||
	                        str === '<<=' || str === '>>=' || str === '**=') {
	                        this.index += 3;
	                    }
	                    else {
	                        // 2-character punctuators.
	                        str = str.substr(0, 2);
	                        if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
	                            str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
	                            str === '++' || str === '--' || str === '<<' || str === '>>' ||
	                            str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
	                            str === '<=' || str === '>=' || str === '=>' || str === '**') {
	                            this.index += 2;
	                        }
	                        else {
	                            // 1-character punctuators.
	                            str = this.source[this.index];
	                            if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
	                                ++this.index;
	                            }
	                        }
	                    }
	                }
	        }
	        if (this.index === start) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 7 /* Punctuator */,
	            value: str,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-numeric-literals
	    Scanner.prototype.scanHexLiteral = function (start) {
	        var num = '';
	        while (!this.eof()) {
	            if (!character_1.Character.isHexDigit(this.source.charCodeAt(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            this.throwUnexpectedToken();
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt('0x' + num, 16),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.scanBinaryLiteral = function (start) {
	        var num = '';
	        var ch;
	        while (!this.eof()) {
	            ch = this.source[this.index];
	            if (ch !== '0' && ch !== '1') {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (num.length === 0) {
	            // only 0b or 0B
	            this.throwUnexpectedToken();
	        }
	        if (!this.eof()) {
	            ch = this.source.charCodeAt(this.index);
	            /* istanbul ignore else */
	            if (character_1.Character.isIdentifierStart(ch) || character_1.Character.isDecimalDigit(ch)) {
	                this.throwUnexpectedToken();
	            }
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt(num, 2),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.scanOctalLiteral = function (prefix, start) {
	        var num = '';
	        var octal = false;
	        if (character_1.Character.isOctalDigit(prefix.charCodeAt(0))) {
	            octal = true;
	            num = '0' + this.source[this.index++];
	        }
	        else {
	            ++this.index;
	        }
	        while (!this.eof()) {
	            if (!character_1.Character.isOctalDigit(this.source.charCodeAt(this.index))) {
	                break;
	            }
	            num += this.source[this.index++];
	        }
	        if (!octal && num.length === 0) {
	            // only 0o or 0O
	            this.throwUnexpectedToken();
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index)) || character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseInt(num, 8),
	            octal: octal,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.isImplicitOctalLiteral = function () {
	        // Implicit octal, unless there is a non-octal digit.
	        // (Annex B.1.1 on Numeric Literals)
	        for (var i = this.index + 1; i < this.length; ++i) {
	            var ch = this.source[i];
	            if (ch === '8' || ch === '9') {
	                return false;
	            }
	            if (!character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                return true;
	            }
	        }
	        return true;
	    };
	    Scanner.prototype.scanNumericLiteral = function () {
	        var start = this.index;
	        var ch = this.source[start];
	        assert_1.assert(character_1.Character.isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'), 'Numeric literal must start with a decimal digit or a decimal point');
	        var num = '';
	        if (ch !== '.') {
	            num = this.source[this.index++];
	            ch = this.source[this.index];
	            // Hex number starts with '0x'.
	            // Octal number starts with '0'.
	            // Octal number in ES6 starts with '0o'.
	            // Binary number in ES6 starts with '0b'.
	            if (num === '0') {
	                if (ch === 'x' || ch === 'X') {
	                    ++this.index;
	                    return this.scanHexLiteral(start);
	                }
	                if (ch === 'b' || ch === 'B') {
	                    ++this.index;
	                    return this.scanBinaryLiteral(start);
	                }
	                if (ch === 'o' || ch === 'O') {
	                    return this.scanOctalLiteral(ch, start);
	                }
	                if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                    if (this.isImplicitOctalLiteral()) {
	                        return this.scanOctalLiteral(ch, start);
	                    }
	                }
	            }
	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === '.') {
	            num += this.source[this.index++];
	            while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                num += this.source[this.index++];
	            }
	            ch = this.source[this.index];
	        }
	        if (ch === 'e' || ch === 'E') {
	            num += this.source[this.index++];
	            ch = this.source[this.index];
	            if (ch === '+' || ch === '-') {
	                num += this.source[this.index++];
	            }
	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                while (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                    num += this.source[this.index++];
	                }
	            }
	            else {
	                this.throwUnexpectedToken();
	            }
	        }
	        if (character_1.Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 6 /* NumericLiteral */,
	            value: parseFloat(num),
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-string-literals
	    Scanner.prototype.scanStringLiteral = function () {
	        var start = this.index;
	        var quote = this.source[start];
	        assert_1.assert((quote === '\'' || quote === '"'), 'String literal must starts with a quote');
	        ++this.index;
	        var octal = false;
	        var str = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === quote) {
	                quote = '';
	                break;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!ch || !character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                str += this.scanUnicodeCodePointEscape();
	                            }
	                            else {
	                                var unescaped_1 = this.scanHexEscape(ch);
	                                if (unescaped_1 === null) {
	                                    this.throwUnexpectedToken();
	                                }
	                                str += unescaped_1;
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanHexEscape(ch);
	                            if (unescaped === null) {
	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
	                            }
	                            str += unescaped;
	                            break;
	                        case 'n':
	                            str += '\n';
	                            break;
	                        case 'r':
	                            str += '\r';
	                            break;
	                        case 't':
	                            str += '\t';
	                            break;
	                        case 'b':
	                            str += '\b';
	                            break;
	                        case 'f':
	                            str += '\f';
	                            break;
	                        case 'v':
	                            str += '\x0B';
	                            break;
	                        case '8':
	                        case '9':
	                            str += ch;
	                            this.tolerateUnexpectedToken();
	                            break;
	                        default:
	                            if (ch && character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                                var octToDec = this.octalToDecimal(ch);
	                                octal = octToDec.octal || octal;
	                                str += String.fromCharCode(octToDec.code);
	                            }
	                            else {
	                                str += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.lineNumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.lineStart = this.index;
	                }
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                break;
	            }
	            else {
	                str += ch;
	            }
	        }
	        if (quote !== '') {
	            this.index = start;
	            this.throwUnexpectedToken();
	        }
	        return {
	            type: 8 /* StringLiteral */,
	            value: str,
	            octal: octal,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-template-literal-lexical-components
	    Scanner.prototype.scanTemplate = function () {
	        var cooked = '';
	        var terminated = false;
	        var start = this.index;
	        var head = (this.source[start] === '`');
	        var tail = false;
	        var rawOffset = 2;
	        ++this.index;
	        while (!this.eof()) {
	            var ch = this.source[this.index++];
	            if (ch === '`') {
	                rawOffset = 1;
	                tail = true;
	                terminated = true;
	                break;
	            }
	            else if (ch === '$') {
	                if (this.source[this.index] === '{') {
	                    this.curlyStack.push('${');
	                    ++this.index;
	                    terminated = true;
	                    break;
	                }
	                cooked += ch;
	            }
	            else if (ch === '\\') {
	                ch = this.source[this.index++];
	                if (!character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    switch (ch) {
	                        case 'n':
	                            cooked += '\n';
	                            break;
	                        case 'r':
	                            cooked += '\r';
	                            break;
	                        case 't':
	                            cooked += '\t';
	                            break;
	                        case 'u':
	                            if (this.source[this.index] === '{') {
	                                ++this.index;
	                                cooked += this.scanUnicodeCodePointEscape();
	                            }
	                            else {
	                                var restore = this.index;
	                                var unescaped_2 = this.scanHexEscape(ch);
	                                if (unescaped_2 !== null) {
	                                    cooked += unescaped_2;
	                                }
	                                else {
	                                    this.index = restore;
	                                    cooked += ch;
	                                }
	                            }
	                            break;
	                        case 'x':
	                            var unescaped = this.scanHexEscape(ch);
	                            if (unescaped === null) {
	                                this.throwUnexpectedToken(messages_1.Messages.InvalidHexEscapeSequence);
	                            }
	                            cooked += unescaped;
	                            break;
	                        case 'b':
	                            cooked += '\b';
	                            break;
	                        case 'f':
	                            cooked += '\f';
	                            break;
	                        case 'v':
	                            cooked += '\v';
	                            break;
	                        default:
	                            if (ch === '0') {
	                                if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
	                                    // Illegal: \01 \02 and so on
	                                    this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
	                                }
	                                cooked += '\0';
	                            }
	                            else if (character_1.Character.isOctalDigit(ch.charCodeAt(0))) {
	                                // Illegal: \1 \2
	                                this.throwUnexpectedToken(messages_1.Messages.TemplateOctalLiteral);
	                            }
	                            else {
	                                cooked += ch;
	                            }
	                            break;
	                    }
	                }
	                else {
	                    ++this.lineNumber;
	                    if (ch === '\r' && this.source[this.index] === '\n') {
	                        ++this.index;
	                    }
	                    this.lineStart = this.index;
	                }
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                ++this.lineNumber;
	                if (ch === '\r' && this.source[this.index] === '\n') {
	                    ++this.index;
	                }
	                this.lineStart = this.index;
	                cooked += '\n';
	            }
	            else {
	                cooked += ch;
	            }
	        }
	        if (!terminated) {
	            this.throwUnexpectedToken();
	        }
	        if (!head) {
	            this.curlyStack.pop();
	        }
	        return {
	            type: 10 /* Template */,
	            value: this.source.slice(start + 1, this.index - rawOffset),
	            cooked: cooked,
	            head: head,
	            tail: tail,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	    Scanner.prototype.testRegExp = function (pattern, flags) {
	        // The BMP character to use as a replacement for astral symbols when
	        // translating an ES6 "u"-flagged pattern to an ES5-compatible
	        // approximation.
	        // Note: replacing with '\uFFFF' enables false positives in unlikely
	        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
	        // pattern that would not be detected by this substitution.
	        var astralSubstitute = '\uFFFF';
	        var tmp = pattern;
	        var self = this;
	        if (flags.indexOf('u') >= 0) {
	            tmp = tmp
	                .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
	                var codePoint = parseInt($1 || $2, 16);
	                if (codePoint > 0x10FFFF) {
	                    self.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
	                }
	                if (codePoint <= 0xFFFF) {
	                    return String.fromCharCode(codePoint);
	                }
	                return astralSubstitute;
	            })
	                .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, astralSubstitute);
	        }
	        // First, detect invalid regular expressions.
	        try {
	            RegExp(tmp);
	        }
	        catch (e) {
	            this.throwUnexpectedToken(messages_1.Messages.InvalidRegExp);
	        }
	        // Return a regular expression object for this pattern-flag pair, or
	        // `null` in case the current environment doesn't support the flags it
	        // uses.
	        try {
	            return new RegExp(pattern, flags);
	        }
	        catch (exception) {
	            /* istanbul ignore next */
	            return null;
	        }
	    };
	    Scanner.prototype.scanRegExpBody = function () {
	        var ch = this.source[this.index];
	        assert_1.assert(ch === '/', 'Regular expression literal must start with a slash');
	        var str = this.source[this.index++];
	        var classMarker = false;
	        var terminated = false;
	        while (!this.eof()) {
	            ch = this.source[this.index++];
	            str += ch;
	            if (ch === '\\') {
	                ch = this.source[this.index++];
	                // https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals
	                if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                    this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	                }
	                str += ch;
	            }
	            else if (character_1.Character.isLineTerminator(ch.charCodeAt(0))) {
	                this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	            }
	            else if (classMarker) {
	                if (ch === ']') {
	                    classMarker = false;
	                }
	            }
	            else {
	                if (ch === '/') {
	                    terminated = true;
	                    break;
	                }
	                else if (ch === '[') {
	                    classMarker = true;
	                }
	            }
	        }
	        if (!terminated) {
	            this.throwUnexpectedToken(messages_1.Messages.UnterminatedRegExp);
	        }
	        // Exclude leading and trailing slash.
	        return str.substr(1, str.length - 2);
	    };
	    Scanner.prototype.scanRegExpFlags = function () {
	        var str = '';
	        var flags = '';
	        while (!this.eof()) {
	            var ch = this.source[this.index];
	            if (!character_1.Character.isIdentifierPart(ch.charCodeAt(0))) {
	                break;
	            }
	            ++this.index;
	            if (ch === '\\' && !this.eof()) {
	                ch = this.source[this.index];
	                if (ch === 'u') {
	                    ++this.index;
	                    var restore = this.index;
	                    var char = this.scanHexEscape('u');
	                    if (char !== null) {
	                        flags += char;
	                        for (str += '\\u'; restore < this.index; ++restore) {
	                            str += this.source[restore];
	                        }
	                    }
	                    else {
	                        this.index = restore;
	                        flags += 'u';
	                        str += '\\u';
	                    }
	                    this.tolerateUnexpectedToken();
	                }
	                else {
	                    str += '\\';
	                    this.tolerateUnexpectedToken();
	                }
	            }
	            else {
	                flags += ch;
	                str += ch;
	            }
	        }
	        return flags;
	    };
	    Scanner.prototype.scanRegExp = function () {
	        var start = this.index;
	        var pattern = this.scanRegExpBody();
	        var flags = this.scanRegExpFlags();
	        var value = this.testRegExp(pattern, flags);
	        return {
	            type: 9 /* RegularExpression */,
	            value: '',
	            pattern: pattern,
	            flags: flags,
	            regex: value,
	            lineNumber: this.lineNumber,
	            lineStart: this.lineStart,
	            start: start,
	            end: this.index
	        };
	    };
	    Scanner.prototype.lex = function () {
	        if (this.eof()) {
	            return {
	                type: 2 /* EOF */,
	                value: '',
	                lineNumber: this.lineNumber,
	                lineStart: this.lineStart,
	                start: this.index,
	                end: this.index
	            };
	        }
	        var cp = this.source.charCodeAt(this.index);
	        if (character_1.Character.isIdentifierStart(cp)) {
	            return this.scanIdentifier();
	        }
	        // Very common: ( and ) and ;
	        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
	            return this.scanPunctuator();
	        }
	        // String literal starts with single quote (U+0027) or double quote (U+0022).
	        if (cp === 0x27 || cp === 0x22) {
	            return this.scanStringLiteral();
	        }
	        // Dot (.) U+002E can also start a floating-point number, hence the need
	        // to check the next character.
	        if (cp === 0x2E) {
	            if (character_1.Character.isDecimalDigit(this.source.charCodeAt(this.index + 1))) {
	                return this.scanNumericLiteral();
	            }
	            return this.scanPunctuator();
	        }
	        if (character_1.Character.isDecimalDigit(cp)) {
	            return this.scanNumericLiteral();
	        }
	        // Template literals start with ` (U+0060) for template head
	        // or } (U+007D) for template middle or template tail.
	        if (cp === 0x60 || (cp === 0x7D && this.curlyStack[this.curlyStack.length - 1] === '${')) {
	            return this.scanTemplate();
	        }
	        // Possible identifier start in a surrogate pair.
	        if (cp >= 0xD800 && cp < 0xDFFF) {
	            if (character_1.Character.isIdentifierStart(this.codePointAt(this.index))) {
	                return this.scanIdentifier();
	            }
	        }
	        return this.scanPunctuator();
	    };
	    return Scanner;
	}());
	exports.Scanner = Scanner;


/***/ },
/* 13 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TokenName = {};
	exports.TokenName[1 /* BooleanLiteral */] = 'Boolean';
	exports.TokenName[2 /* EOF */] = '<end>';
	exports.TokenName[3 /* Identifier */] = 'Identifier';
	exports.TokenName[4 /* Keyword */] = 'Keyword';
	exports.TokenName[5 /* NullLiteral */] = 'Null';
	exports.TokenName[6 /* NumericLiteral */] = 'Numeric';
	exports.TokenName[7 /* Punctuator */] = 'Punctuator';
	exports.TokenName[8 /* StringLiteral */] = 'String';
	exports.TokenName[9 /* RegularExpression */] = 'RegularExpression';
	exports.TokenName[10 /* Template */] = 'Template';


/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";
	// Generated by generate-xhtml-entities.js. DO NOT MODIFY!
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.XHTMLEntities = {
	    quot: '\u0022',
	    amp: '\u0026',
	    apos: '\u0027',
	    gt: '\u003E',
	    nbsp: '\u00A0',
	    iexcl: '\u00A1',
	    cent: '\u00A2',
	    pound: '\u00A3',
	    curren: '\u00A4',
	    yen: '\u00A5',
	    brvbar: '\u00A6',
	    sect: '\u00A7',
	    uml: '\u00A8',
	    copy: '\u00A9',
	    ordf: '\u00AA',
	    laquo: '\u00AB',
	    not: '\u00AC',
	    shy: '\u00AD',
	    reg: '\u00AE',
	    macr: '\u00AF',
	    deg: '\u00B0',
	    plusmn: '\u00B1',
	    sup2: '\u00B2',
	    sup3: '\u00B3',
	    acute: '\u00B4',
	    micro: '\u00B5',
	    para: '\u00B6',
	    middot: '\u00B7',
	    cedil: '\u00B8',
	    sup1: '\u00B9',
	    ordm: '\u00BA',
	    raquo: '\u00BB',
	    frac14: '\u00BC',
	    frac12: '\u00BD',
	    frac34: '\u00BE',
	    iquest: '\u00BF',
	    Agrave: '\u00C0',
	    Aacute: '\u00C1',
	    Acirc: '\u00C2',
	    Atilde: '\u00C3',
	    Auml: '\u00C4',
	    Aring: '\u00C5',
	    AElig: '\u00C6',
	    Ccedil: '\u00C7',
	    Egrave: '\u00C8',
	    Eacute: '\u00C9',
	    Ecirc: '\u00CA',
	    Euml: '\u00CB',
	    Igrave: '\u00CC',
	    Iacute: '\u00CD',
	    Icirc: '\u00CE',
	    Iuml: '\u00CF',
	    ETH: '\u00D0',
	    Ntilde: '\u00D1',
	    Ograve: '\u00D2',
	    Oacute: '\u00D3',
	    Ocirc: '\u00D4',
	    Otilde: '\u00D5',
	    Ouml: '\u00D6',
	    times: '\u00D7',
	    Oslash: '\u00D8',
	    Ugrave: '\u00D9',
	    Uacute: '\u00DA',
	    Ucirc: '\u00DB',
	    Uuml: '\u00DC',
	    Yacute: '\u00DD',
	    THORN: '\u00DE',
	    szlig: '\u00DF',
	    agrave: '\u00E0',
	    aacute: '\u00E1',
	    acirc: '\u00E2',
	    atilde: '\u00E3',
	    auml: '\u00E4',
	    aring: '\u00E5',
	    aelig: '\u00E6',
	    ccedil: '\u00E7',
	    egrave: '\u00E8',
	    eacute: '\u00E9',
	    ecirc: '\u00EA',
	    euml: '\u00EB',
	    igrave: '\u00EC',
	    iacute: '\u00ED',
	    icirc: '\u00EE',
	    iuml: '\u00EF',
	    eth: '\u00F0',
	    ntilde: '\u00F1',
	    ograve: '\u00F2',
	    oacute: '\u00F3',
	    ocirc: '\u00F4',
	    otilde: '\u00F5',
	    ouml: '\u00F6',
	    divide: '\u00F7',
	    oslash: '\u00F8',
	    ugrave: '\u00F9',
	    uacute: '\u00FA',
	    ucirc: '\u00FB',
	    uuml: '\u00FC',
	    yacute: '\u00FD',
	    thorn: '\u00FE',
	    yuml: '\u00FF',
	    OElig: '\u0152',
	    oelig: '\u0153',
	    Scaron: '\u0160',
	    scaron: '\u0161',
	    Yuml: '\u0178',
	    fnof: '\u0192',
	    circ: '\u02C6',
	    tilde: '\u02DC',
	    Alpha: '\u0391',
	    Beta: '\u0392',
	    Gamma: '\u0393',
	    Delta: '\u0394',
	    Epsilon: '\u0395',
	    Zeta: '\u0396',
	    Eta: '\u0397',
	    Theta: '\u0398',
	    Iota: '\u0399',
	    Kappa: '\u039A',
	    Lambda: '\u039B',
	    Mu: '\u039C',
	    Nu: '\u039D',
	    Xi: '\u039E',
	    Omicron: '\u039F',
	    Pi: '\u03A0',
	    Rho: '\u03A1',
	    Sigma: '\u03A3',
	    Tau: '\u03A4',
	    Upsilon: '\u03A5',
	    Phi: '\u03A6',
	    Chi: '\u03A7',
	    Psi: '\u03A8',
	    Omega: '\u03A9',
	    alpha: '\u03B1',
	    beta: '\u03B2',
	    gamma: '\u03B3',
	    delta: '\u03B4',
	    epsilon: '\u03B5',
	    zeta: '\u03B6',
	    eta: '\u03B7',
	    theta: '\u03B8',
	    iota: '\u03B9',
	    kappa: '\u03BA',
	    lambda: '\u03BB',
	    mu: '\u03BC',
	    nu: '\u03BD',
	    xi: '\u03BE',
	    omicron: '\u03BF',
	    pi: '\u03C0',
	    rho: '\u03C1',
	    sigmaf: '\u03C2',
	    sigma: '\u03C3',
	    tau: '\u03C4',
	    upsilon: '\u03C5',
	    phi: '\u03C6',
	    chi: '\u03C7',
	    psi: '\u03C8',
	    omega: '\u03C9',
	    thetasym: '\u03D1',
	    upsih: '\u03D2',
	    piv: '\u03D6',
	    ensp: '\u2002',
	    emsp: '\u2003',
	    thinsp: '\u2009',
	    zwnj: '\u200C',
	    zwj: '\u200D',
	    lrm: '\u200E',
	    rlm: '\u200F',
	    ndash: '\u2013',
	    mdash: '\u2014',
	    lsquo: '\u2018',
	    rsquo: '\u2019',
	    sbquo: '\u201A',
	    ldquo: '\u201C',
	    rdquo: '\u201D',
	    bdquo: '\u201E',
	    dagger: '\u2020',
	    Dagger: '\u2021',
	    bull: '\u2022',
	    hellip: '\u2026',
	    permil: '\u2030',
	    prime: '\u2032',
	    Prime: '\u2033',
	    lsaquo: '\u2039',
	    rsaquo: '\u203A',
	    oline: '\u203E',
	    frasl: '\u2044',
	    euro: '\u20AC',
	    image: '\u2111',
	    weierp: '\u2118',
	    real: '\u211C',
	    trade: '\u2122',
	    alefsym: '\u2135',
	    larr: '\u2190',
	    uarr: '\u2191',
	    rarr: '\u2192',
	    darr: '\u2193',
	    harr: '\u2194',
	    crarr: '\u21B5',
	    lArr: '\u21D0',
	    uArr: '\u21D1',
	    rArr: '\u21D2',
	    dArr: '\u21D3',
	    hArr: '\u21D4',
	    forall: '\u2200',
	    part: '\u2202',
	    exist: '\u2203',
	    empty: '\u2205',
	    nabla: '\u2207',
	    isin: '\u2208',
	    notin: '\u2209',
	    ni: '\u220B',
	    prod: '\u220F',
	    sum: '\u2211',
	    minus: '\u2212',
	    lowast: '\u2217',
	    radic: '\u221A',
	    prop: '\u221D',
	    infin: '\u221E',
	    ang: '\u2220',
	    and: '\u2227',
	    or: '\u2228',
	    cap: '\u2229',
	    cup: '\u222A',
	    int: '\u222B',
	    there4: '\u2234',
	    sim: '\u223C',
	    cong: '\u2245',
	    asymp: '\u2248',
	    ne: '\u2260',
	    equiv: '\u2261',
	    le: '\u2264',
	    ge: '\u2265',
	    sub: '\u2282',
	    sup: '\u2283',
	    nsub: '\u2284',
	    sube: '\u2286',
	    supe: '\u2287',
	    oplus: '\u2295',
	    otimes: '\u2297',
	    perp: '\u22A5',
	    sdot: '\u22C5',
	    lceil: '\u2308',
	    rceil: '\u2309',
	    lfloor: '\u230A',
	    rfloor: '\u230B',
	    loz: '\u25CA',
	    spades: '\u2660',
	    clubs: '\u2663',
	    hearts: '\u2665',
	    diams: '\u2666',
	    lang: '\u27E8',
	    rang: '\u27E9'
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var error_handler_1 = __webpack_require__(10);
	var scanner_1 = __webpack_require__(12);
	var token_1 = __webpack_require__(13);
	var Reader = (function () {
	    function Reader() {
	        this.values = [];
	        this.curly = this.paren = -1;
	    }
	    // A function following one of those tokens is an expression.
	    Reader.prototype.beforeFunctionExpression = function (t) {
	        return ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
	            'return', 'case', 'delete', 'throw', 'void',
	            // assignment operators
	            '=', '+=', '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=',
	            '&=', '|=', '^=', ',',
	            // binary/unary operators
	            '+', '-', '*', '**', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
	            '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
	            '<=', '<', '>', '!=', '!=='].indexOf(t) >= 0;
	    };
	    // Determine if forward slash (/) is an operator or part of a regular expression
	    // https://github.com/mozilla/sweet.js/wiki/design
	    Reader.prototype.isRegexStart = function () {
	        var previous = this.values[this.values.length - 1];
	        var regex = (previous !== null);
	        switch (previous) {
	            case 'this':
	            case ']':
	                regex = false;
	                break;
	            case ')':
	                var keyword = this.values[this.paren - 1];
	                regex = (keyword === 'if' || keyword === 'while' || keyword === 'for' || keyword === 'with');
	                break;
	            case '}':
	                // Dividing a function by anything makes little sense,
	                // but we have to check for that.
	                regex = false;
	                if (this.values[this.curly - 3] === 'function') {
	                    // Anonymous function, e.g. function(){} /42
	                    var check = this.values[this.curly - 4];
	                    regex = check ? !this.beforeFunctionExpression(check) : false;
	                }
	                else if (this.values[this.curly - 4] === 'function') {
	                    // Named function, e.g. function f(){} /42/
	                    var check = this.values[this.curly - 5];
	                    regex = check ? !this.beforeFunctionExpression(check) : true;
	                }
	                break;
	            default:
	                break;
	        }
	        return regex;
	    };
	    Reader.prototype.push = function (token) {
	        if (token.type === 7 /* Punctuator */ || token.type === 4 /* Keyword */) {
	            if (token.value === '{') {
	                this.curly = this.values.length;
	            }
	            else if (token.value === '(') {
	                this.paren = this.values.length;
	            }
	            this.values.push(token.value);
	        }
	        else {
	            this.values.push(null);
	        }
	    };
	    return Reader;
	}());
	var Tokenizer = (function () {
	    function Tokenizer(code, config) {
	        this.errorHandler = new error_handler_1.ErrorHandler();
	        this.errorHandler.tolerant = config ? (typeof config.tolerant === 'boolean' && config.tolerant) : false;
	        this.scanner = new scanner_1.Scanner(code, this.errorHandler);
	        this.scanner.trackComment = config ? (typeof config.comment === 'boolean' && config.comment) : false;
	        this.trackRange = config ? (typeof config.range === 'boolean' && config.range) : false;
	        this.trackLoc = config ? (typeof config.loc === 'boolean' && config.loc) : false;
	        this.buffer = [];
	        this.reader = new Reader();
	    }
	    Tokenizer.prototype.errors = function () {
	        return this.errorHandler.errors;
	    };
	    Tokenizer.prototype.getNextToken = function () {
	        if (this.buffer.length === 0) {
	            var comments = this.scanner.scanComments();
	            if (this.scanner.trackComment) {
	                for (var i = 0; i < comments.length; ++i) {
	                    var e = comments[i];
	                    var value = this.scanner.source.slice(e.slice[0], e.slice[1]);
	                    var comment = {
	                        type: e.multiLine ? 'BlockComment' : 'LineComment',
	                        value: value
	                    };
	                    if (this.trackRange) {
	                        comment.range = e.range;
	                    }
	                    if (this.trackLoc) {
	                        comment.loc = e.loc;
	                    }
	                    this.buffer.push(comment);
	                }
	            }
	            if (!this.scanner.eof()) {
	                var loc = void 0;
	                if (this.trackLoc) {
	                    loc = {
	                        start: {
	                            line: this.scanner.lineNumber,
	                            column: this.scanner.index - this.scanner.lineStart
	                        },
	                        end: {}
	                    };
	                }
	                var startRegex = (this.scanner.source[this.scanner.index] === '/') && this.reader.isRegexStart();
	                var token = startRegex ? this.scanner.scanRegExp() : this.scanner.lex();
	                this.reader.push(token);
	                var entry = {
	                    type: token_1.TokenName[token.type],
	                    value: this.scanner.source.slice(token.start, token.end)
	                };
	                if (this.trackRange) {
	                    entry.range = [token.start, token.end];
	                }
	                if (this.trackLoc) {
	                    loc.end = {
	                        line: this.scanner.lineNumber,
	                        column: this.scanner.index - this.scanner.lineStart
	                    };
	                    entry.loc = loc;
	                }
	                if (token.type === 9 /* RegularExpression */) {
	                    var pattern = token.pattern;
	                    var flags = token.flags;
	                    entry.regex = { pattern: pattern, flags: flags };
	                }
	                this.buffer.push(entry);
	            }
	        }
	        return this.buffer.shift();
	    };
	    return Tokenizer;
	}());
	exports.Tokenizer = Tokenizer;


/***/ }
/******/ ])
});
;
;
fatfinger.parsingTools = 
(function(){

        if (typeof esprima == "undefined") {
            console.log("created esprima");
            esprima = require('esprima');
        }

        var testParseJs = function(code) {
            try {
                ast = esprima.parse(code);
            } 
            catch(err) {
                return false;
            }
            return true;
        };

        var lineSorter = function(a,b) {
            if (a.score == b.score) {
                return (a.place > b.place) ? -1 : 1;
            }
            else {
                return (a.score < b.score) ? -1 : 1;
            }
        };


        var correctLineForKeywords = function(line) {

            var words = esprima.tokenize(line, { loc: true });

            var possibleLines = [];

            // try swapping in our replacement keywords until we get something that parses
            for(var locIdx = words.length - 1; locIdx >= 0; locIdx--) { // locIdx = location in the string (by word)
                if (words[locIdx].type != "Identifier") { continue; }

                var wordReplaceList = fatfinger.wordMatcher.findPotentialMatches(words[locIdx].value);

                for (var replaceIdx = 0; replaceIdx < wordReplaceList.length; replaceIdx++) // replaceIdx = which replacement word to use
                {
                    var newline = line.substring(0, words[locIdx].loc.start.column);
                    newline += wordReplaceList[replaceIdx].word;
                    newline += line.substring(words[locIdx].loc.end.column, words[locIdx].length);
                    // console.debug(newline); (for debug)

                    score = wordReplaceList[replaceIdx].score;

                    if (this.testParseJs(newline)) {
                        possibleLines.push({line:newline, score:wordReplaceList[replaceIdx].score, place:locIdx});
                    }
                }
            }

            var sortedLines = possibleLines.sort(this.lineSorter);

            if (sortedLines.length == 0) {
                return null;
            } // we have not found a match

            return sortedLines[0].line; // just return the best one
        };

    return {"testParseJs" : testParseJs,
            "lineSorter" : lineSorter,
            "correctLineForKeywords" : correctLineForKeywords
    };
})(fatfinger);
;fatfinger.wordMatcher = 
(function() {

    function findPotentialMatches(orig, dictionary) {
        var dict = [];

        if (!dictionary) {
            
            // against keywords
            addToList(dict, orig, fatfinger.Keywords);
            addToList(dict, orig, fatfinger.Keywords_Atom);

            // missing objects from scope
            dict["window"] = true;
            dict["Math"] = true;

            //    addToList(dict, orig, OPERATORS);
            //    addToList(dict, orig, OPERATOR_CHARS);
        } else {
            addToList(dict, orig, dictionary);
        }

        return dict;
    }

/*
PRIVATE FUNCTIONS
*/

    function addToList(dict, orig, tokenlist) {
        Object.keys(tokenlist).forEach(function(word) {
            dict.push({ word: word, score: distance(orig, word)});
        });    
        return dict;
    }

    /*
    Calculates Damerau-Levenshtein Distance https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
    Implementation from https://gist.github.com/IceCreamYou/8396172
    */
    function distance(source, target) {
        if (!source) return target ? target.length : 0;
        else if (!target) return source.length;

        var m = source.length, n = target.length, INF = m+n, score = new Array(m+2), sd = {};
        for (var i = 0; i < m+2; i++) score[i] = new Array(n+2);
        score[0][0] = INF;
        for (var i = 0; i <= m; i++) {
            score[i+1][1] = i;
            score[i+1][0] = INF;
            sd[source[i]] = 0;
        }
        for (var j = 0; j <= n; j++) {
            score[1][j+1] = j;
            score[0][j+1] = INF;
            sd[target[j]] = 0;
        }

        for (var i = 1; i <= m; i++) {
            var DB = 0;
            for (var j = 1; j <= n; j++) {
                var i1 = sd[target[j-1]],
                    j1 = DB;
                if (source[i-1] === target[j-1]) {
                    score[i+1][j+1] = score[i][j];
                    DB = j;
                }
                else {
                    score[i+1][j+1] = Math.min(score[i][j], Math.min(score[i+1][j], score[i][j+1])) + 1;
                }
                score[i+1][j+1] = Math.min(score[i+1][j+1], score[i1] ? score[i1][j1] + (i-i1-1) + 1 + (j-j1-1) : Infinity);
            }
            sd[source[i-1]] = i;
        }
        return score[m+1][n+1];
    }

    return {"findPotentialMatches" : findPotentialMatches};
})(fatfinger);
;fatfinger.wordReplacer = {};

// template design pattern
fatfinger.wordReplacer.wordReplacerBase = {

    // options for jslint
    lintOptions: {browser: true, multivar: true, for: true, this: true, white: true, devel: true, single: true, es6: true},

    fixCode: function(code) {

        var idx = 0;

        // number of warnings to loop through
        var topIndex = 1; // this will be set at the first lint

        // times through the outer for loop
        var numberOfLoops = 0;

        // number of times we can loop before it seems like we've exhausted the possibilities and are likely in an infinite loop
        var maxLoops; // this will be set at the first lint

        // whether we've altered the original code and need to reevaluate (re-lint) for a new set of warnings (and identifier locations)
        var madeAChange;

        // the last changed node
        var changedNode;

        // This outer loop is to "reset" jslint each time we make a change.
        // Not doing so leads to issues when we fix one warning which actually 
        // resolves multiple warnings (like fixing the word "function" that then satisfies
        // away the warning about a bracket instead of semicolon, which we would NOT want to fix
        do {

            // reset jslint; sometimes it hangs onto previous tree if page hasn't been reloaded
            var clear = jslint("");

            // setting jslint at pretty tolerant settings. We can just ignore warnings we don't like, but trying to stop jslint from tripping up on bs and not giving us a tree
            var linted = jslint(code, this.lintOptions);

            if (this.canWeExit(linted)) {
                return code;
            }

            if (!linted.ok && !linted.tree) {
                if (linted.warnings && linted.warnings.length > 0) {
                    throw new fatfinger.CompileException("Error on line: " + 
                        linted.warnings[linted.warnings.length - 1].line + 
                        ", col: " + 
                        linted.warnings[linted.warnings.length - 1].column);
                }
            }


            madeAChange = false; // reset

            topIndex = linted.warnings.length;

            var tempMax = (topIndex * (topIndex + 1)) / 2;
            if (!maxLoops || tempMax > maxLoops) {
                maxLoops = tempMax;
            }

            // get to the real business
            // if we're not using the jslint warnings, call the alternate search
            if (this.alternateSearch) { 
                var results = this.alternateSearch(linted, code);
                madeAChange = results.madeAChange;
                code = results.code;
            } else {
                for(idx = 0; idx < linted.warnings.length && madeAChange === false; idx++) {

                    var results = this.correctText(linted, idx, code);
                    madeAChange = results.madeAChange;
                    
                    var oldcode = code;
                    code = results.code;

                    if (madeAChange && results.changedNode) {
                        // test result
                        var newlint = jslint(code, this.lintOptions);
                        var notfixed = false;
                        for(var newIdx = 0; newIdx < newlint.warnings.length; newIdx++) {
                            if (
                                newlint.warnings[newIdx].column == results.changedNode.column &&
                                newlint.warnings[newIdx].line == results.changedNode.line &&
                                newlint.warnings[newIdx].code == results.changedNode.code &&
                                (!newlint.warnings[newIdx].a || !fatfinger.JslintBlindSpot(newlint.warnings[newIdx].a))) {
                                    // we have not actually fixed the problem, as the same warning is in the new lint (same code, same starting place)
                                    notfixed = true;
                            }
                        }
                        if (notfixed) {
                            code = oldcode;
                            madeAChange = false;
                            // let's just stick with what we had before and go to the next warning
                        }
                    }
                }
            }
            numberOfLoops++;

        } while (idx < topIndex && numberOfLoops < maxLoops);


        if (!this.test(code)) {
            return null;
        }

        return code;

    },

    replaceWord(lineToFix, warning, oldWord, newWord) {

        var start = 0;

        if (warning.column) start = warning.column;
        if (warning.from) start = warning.from;

        return lineToFix.substr(0, start) +
            newWord.word +
            lineToFix.substring(start + oldWord.length,
            lineToFix.length);
    },

    buildLocalIdentifiers(node, varlist) {
        // FIXME: there no scope and it doesn't even know if a var has been declared yet or not.
        // Perhaps capture line numbers where things are declared and use the tree (since at this stage we can generate one) to help with 
        // scope? However, public/private is tricky in js and there are cases where you can refer to things that are not yet declared

        if (node.id == "const" || node.id == "var"  || node.id == "function") {
            if (node.names) {
                for(var j = 0; j < node.names.length; j++) {
                    if (node.names[j].role == "variable" || node.names[j].role == "parameter") {
                        varlist[node.names[j].id] = true;
                    }
                    if (node.names[j].expression) {
                        varlist = Object.assign({}, varlist, this.buildLocalIdentifiers(node.names[j].expression, varlist));
                    }
                }
            } else if (node.name && node.name.id) { // this is primarily for functions
                varlist[node.name.id] = true;
            } else if (node.name && typeof node.name == "string") {
                varlist[node.name] = true;
            }

            // FIXME: For now, we're treating all parameters as if they are global, in fact fatfinger has no idea about scope
            if (node.parameters) {
                for(var k = 0; k < node.parameters.length; k++) {
                    varlist[node.parameters[k].id] = true;
                }
            }
        }

        if (Array.isArray(node)) {
            for (var i = 0; i < node.length; i++) {
                varlist = Object.assign({}, varlist, this.buildLocalIdentifiers(node[i], varlist));
            }
        }
        if (node.block) { 
            varlist = Object.assign({}, varlist, this.buildLocalIdentifiers(node.block, varlist));
        }

        // FIXME: this should be reorganized. It's not clear we always want to look at context or if this may lead to infinite loops with the weird tree jslint gives us
        if (node.context) { // this is if we're in a function; we get the local context for params and vars
            Object.keys(node.context).forEach(function(word) {
                if (!varlist[word]) {
                    varlist[word] = true;
                }
            });   
        }
        if (node.expression) {
            varlist = Object.assign({}, varlist, this.buildLocalIdentifiers(node.expression, varlist));
        }
        if (node.label && node.label.id) {
            varlist[node.label.id] = true;
        }
        return varlist;
    }

}

fatfinger.wordReplacer.inherit = function(proto) {
    var F = function() { };
    F.prototype = proto;
    return new F();
}




// PARSE LEVEL WORD REPLACER

fatfinger.wordReplacer.parseLevel = fatfinger.wordReplacer.inherit(fatfinger.wordReplacer.wordReplacerBase);
 
fatfinger.wordReplacer.parseLevel.canWeExit = function(linted) {
    return linted.ok;
}

 
fatfinger.wordReplacer.parseLevel.correctText = function(linted, idx, code) {

    var warning = linted.warnings[idx];

    var madeAChange = false;

    if (warning.code == "expected_a_b") {
        var fixed = false;

        // jslint thinks there should be a ; 
        // there are a few things this could be: 
        // 1. a keyword that looks to jslint like a name bc it's misspelled
        // 2. a command that requires parantheses or brackets that are missing
        // 3. it's really missing a ;
        if (warning.message.includes("Expected ';'")) {

            var currLine = linted.lines[warning.line];

            // if we think it needs brackets, give it brackets for the test
            // FIXME: This perhaps can be combined with the other "addAndRemoveBrackets" below in "bad identifiers" section
            var addAndRemoveBrackets = (warning.a == ';' && 
                (warning.b == '{' || // jslint sees a bracket and thinks it shouldn't be there 
                currLine.trim().charAt(currLine.trim().length - 1) == "{" || // our current line ends with a bracket
                (warning.line < linted.lines.length - 2 && // our next line starts with a bracket
                    linted.lines[warning.line + 1].substring(0,1) == "{")));

            var addedBrackets = "}";

            if (addAndRemoveBrackets) {
                if (!currLine.includes("{")) {
                    addedBrackets = "{ }"
                }
                currLine += addedBrackets;
            }

            // make sure it is actually failing to parse before we try to make it parse
            // the brute way (using the keyword type difference thing)
            var doesparse = fatfinger.parsingTools.testParseJs(currLine);         

            if (!doesparse) {

                // FIXME: this will still fail if there are two misspelled keywords on a line
                var newline = fatfinger.parsingTools.correctLineForKeywords(currLine);
                if (newline != null) {
                    fixed = true;

                    if (addAndRemoveBrackets) { 
                        newline = newline.substring(0, newline.length - addedBrackets.length);
                    }

                    linted.lines[warning.line] = newline;
                    code = linted.lines.join("\n");                            
                }
            }                        
        }

        // oh god here's another stupid thing because it's fatal for jslint: add brackets around single statements
        if (warning.message.includes("Expected '{'") &&
            fatfinger.parsingTools.testParseJs(code)) { // we make sure it parses first bc this is not an error that should break parsing by a normal parsing engine like parse-js: let's make sure it's the thing it seems to be

            // jslint warning won't tell us actual char location, so we have to find line this way
            var howManyNewlines = 0;
            var charidx = 0;
            for (charidx = 0; howManyNewlines < warning.line; charidx++) {
                if (code[charidx] == "\n") {
                    howManyNewlines++;
                }
            }

            charidx += warning.column;

            var newCode = code.substring(0, charidx);

            newCode += " {\n";

            for ( ; code[charidx] != ";"; charidx++) {
                newCode += code[charidx];
            }

            newCode += code[charidx];
            charidx++;

            newCode += "\n}"

            newCode += code.substring(charidx, code.length);

            if (fatfinger.parsingTools.testParseJs(newCode)) {
                // make sure we didn't break the code
                code = newCode;
                fixed = true;
            }
            
        }

        // if we haven't fixed it yet, let's just do what jslint tells us to
        // This was fixed a while ago to ONLY do that in the case that the code is not parsing
        if (!fixed && !fatfinger.parsingTools.testParseJs(code))
        {
            var line = linted.lines[warning.line];
            line = line.substr(0, warning.column) +
                linted.warnings[idx].a +
                line.substring(warning.column + warning.b.length,
                    line.length);
            linted.lines[warning.line] = line;
            code = linted.lines.join("\n");
        }

        madeAChange = true;
    }

    var retObj = {
        madeAChange: madeAChange,
        code: code
    };

    return retObj;
}

fatfinger.wordReplacer.parseLevel.test = function(code) {
    return fatfinger.parsingTools.testParseJs(code);
};




// BAD IDENTIFIERS WORD REPLACER

fatfinger.wordReplacer.badIdentifiers = fatfinger.wordReplacer.inherit(fatfinger.wordReplacer.wordReplacerBase);

// preloading global stuff so we don't loop through it every time
fatfinger.wordReplacer.loadGlobals = function() {
    globals = [];
    if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
        // get what's in scope from the browser
        for (var k in window ) {
            if (k != 'fatfinger' && k!= 'jslint' && k!='esprima') { // don't add the framework
                globals[k] = true;
            }
        }
        // sometimes console doesn't show up -- for a number of reasons -- but we always want it
        globals["console"] = true
    } else {
        // FIXME: we should add some fake browser stuff here for testing
    }
    return globals;
}

fatfinger.wordReplacer.badIdentifiers.global_obj = fatfinger.wordReplacer.loadGlobals();


// no early exit for bad identifiers
fatfinger.wordReplacer.badIdentifiers.canWeExit = function(linted) { return false; }

fatfinger.wordReplacer.badIdentifiers.buildIdentifiers = function(relinted) {

    var varlist = [];

    varlist = this.buildLocalIdentifiers(relinted.tree, varlist);

    return Object.assign({}, this.global_obj, varlist);
}

fatfinger.wordReplacer.badIdentifiers.correctText = function(relinted, idx, code) {
    madeAChange = false;

    var identifiers = this.buildIdentifiers(relinted);

    if (relinted.warnings[idx].code == "undeclared_a") {
        // here we will try swapping for each identifier
        var badIdent = relinted.warnings[idx].a;
        var idList = fatfinger.wordMatcher.findPotentialMatches(badIdent, identifiers);

        if (idList != null && idList.length > 0) {
            var currLine = relinted.lines[relinted.warnings[idx].line].trimRight();

            var possibleLines = [];

            var addAndRemoveBrackets = (currLine.trim().charAt(currLine.trim().length - 1) == "{" || // our current line ends with a bracket
                (relinted.warnings[idx].line < relinted.lines.length - 2 && // our next line starts with a bracket
                    relinted.lines[relinted.warnings[idx].line + 1].substring(0,1) == "{"));
            
            var addedBrackets = "}";

            if (addAndRemoveBrackets) {
                if (!currLine.includes("{")) {
                    addedBrackets = "{ }"
                }
                currLine += addedBrackets;
            }

            for(var j = 0; j < idList.length; j++) {
                var newline = this.replaceWord(currLine, relinted.warnings[idx], relinted.warnings[idx].a, idList[j])

                if (fatfinger.parsingTools.testParseJs(newline)) {
                    possibleLines.push({line:newline, score:idList[j].score, place:j});
                }
            }
            var sortedLines = possibleLines.sort(fatfinger.parsingTools.lineSorter);

            if (!sortedLines || sortedLines.length == 0) {
                // we will do nothing in this case -- it means we did not find an identifier replacement that parses
            } else {
                var returnlines = relinted.lines.slice();

                var lineToAdd = sortedLines[0].line;

                if (addAndRemoveBrackets) { 
                    lineToAdd = lineToAdd.substring(0, newline.length - addedBrackets.length);
                }
                returnlines[relinted.warnings[idx].line] = lineToAdd;
                code = returnlines.join("\n");
                madeAChange = true;
            }
        }
    }

    var retObj = {
        madeAChange: madeAChange,
        changedNode: relinted.warnings[idx],
        code: code
    };

    return retObj;

}

// always return the code, no final test
fatfinger.wordReplacer.badIdentifiers.test = function(code) { return true; };



// BAD IDENTIFIERS WORD REPLACER

fatfinger.wordReplacer.memberFix = fatfinger.wordReplacer.inherit(fatfinger.wordReplacer.wordReplacerBase);

fatfinger.wordReplacer.memberFix.global_obj = fatfinger.wordReplacer.loadGlobals();

fatfinger.wordReplacer.memberFix.canWeExit = function(linted) { }

fatfinger.wordReplacer.memberFix.test = function(code) { return true; };

// We are not dealing with the warnings this loop, but with the tree itself. We need to allow
// for resetting the tree, since changing names will change string lengths and so locations
fatfinger.wordReplacer.memberFix.lastCheckedLocation = 0;

fatfinger.wordReplacer.memberFix.treeWalker = function(node, code, linted, allLocalObjects) {
    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            code = this.treeWalker(node[i], code, linted, allLocalObjects);
        }
    }
    if (node.id && node.id == ".") {
        // we're in a dot expression
        var frontOfDot = false;
        var endOfDot = false;

        if (node.expression && node.expression.id) {
            frontOfDot = node.expression.id;
        }
        if (node.name && node.name.id) {
            endOfDot = node.name.id;
        }
        if (frontOfDot && endOfDot) {
            // for members, when they hit this method
            // allLocalObjects = this.buildLocalIdentifiers(linted.tree, {}, frontOfDot);

            var obj;
            var possibleProps = {};

            // assume it's a local obj first
            if (allLocalObjects[frontOfDot]) {
                possibleProps = allLocalObjects
            }
            // only if not in node, try to get it as a built-in obj
            if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
                obj = window[frontOfDot];
                for (var prop in obj) {
                    possibleProps[prop] = true;
                }
            }

            var repl = fatfinger.wordMatcher.findPotentialMatches(endOfDot, possibleProps);
            repl = repl.sort(fatfinger.parsingTools.lineSorter);

            if (repl[0]) {
                linted.lines[node.line] = this.replaceWord(linted.lines[node.line], node.name, endOfDot , repl[0]);
                code = linted.lines.join("\n");
            }
            // FIXME: we need to track the offset for each line (annoying)
        }
    }
    if (node.expression) {
        code = this.treeWalker(node.expression, code, linted, allLocalObjects);
    }
    if (node.else) {
        code = this.treeWalker(node.else, code, linted, allLocalObjects);
    }
    if (node.block) {
        code = this.treeWalker(node.block, code, linted, allLocalObjects);
    }
    return code;
}
 
fatfinger.wordReplacer.memberFix.alternateSearch = function(linted, code) {

    var allLocalObjects = this.buildLocalIdentifiers(linted.tree, {});

    code = this.treeWalker(linted.tree, code, linted, allLocalObjects);

    var retObj = {
        madeAChange: false,
        code: code
    };

    return retObj;
}
;

fatfinger.run = function(code) {

    try 
    {
        code = addBracketsToEnd(code);

        code = cleanUpForVars(code);

        code = reorderLinebreaks(code);

        var prevCode = code;

        // if it doesn't parse, fix that first
        code = fatfinger.wordReplacer.parseLevel.fixCode(code);

        if (code == null) {
            var retObj = {
                succeeded: false,
                error: code,
                text: prevCode
            };
            return retObj;
        }
        
        // look for variables and objects we don't recognize
        code = fatfinger.wordReplacer.badIdentifiers.fixCode(code);

        // if there are obj members we don't recognize, see if we can guess what they should be
        code = fatfinger.wordReplacer.memberFix.fixCode(code);
    }
    catch(e) {
        var retObj;
        if (e instanceof fatfinger.CompileException) {
            retObj = {
                succeeded: false,
                error: e.message,
                text: ""
            };
        };
        retObj = {
            succeeded: false
        };
        return retObj;
    }


    var retObj = {
        succeeded: true,
        text: code
    };
    return retObj;
}


// additional private functions
function addBracketsToEnd(code) {
    var bracketCount = 0;

    var opens = (code.match(/{/g) || []).length;
    var closes = (code.match(/}/g) || []).length;

    for (var idx = 0; idx < opens - closes; idx++) {
        code += "\n}";            
    }
    return code;
}

// Usually jslint errors can be ignored, but it sure throws a fucking fit over using for(var ... 
// to the point that it prevents jslint from finishing and giving me a tree
function cleanUpForVars(code) {
    var forex = /for\s*\(\s*var/;

    while ((match = forex.exec(code)) != null) {
        // console.log("match found at " + match.index);

        var varstmt = /(var\s+[^;]*)\s*;/.exec(code.substring(match.index, code.length));
        var remain = /var\s+([^;]*)\s*;/.exec(code.substring(match.index, code.length));

        code = code.substring(0, match.index) + 
            varstmt[0] + 
            "\nfor(" + 
            code.substring(match.index + remain.index + 3, code.length); // the 3 is for the length of "var" -- we already swallowed any leading whitespace

    }

    return code;
}

// put linebreaks at the places jslint is most likely to give us expected errors (before braces)
function reorderLinebreaks(code) {
    var re = /\n\s*{/;
    var check;
    while((check = re.exec(code)) !== null) {
        code = code.substring(0, check.index) + " {\n" + code.substring(check.index + check[0].length, code.length);
    }
    return code;
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = fatfinger;
;
fatfinger.inlineScriptRunner =
(function() {

    function findFatFingerBlocks() {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('script');
        var good_re = /text\/j*/i
        var dont_match = /text\/javascript/i
        
        for (var i = 0, n = allElements.length; i < n; i++)
        {
            if (allElements[i].getAttribute('type') !== null && 
                good_re.test(allElements[i].getAttribute('type')) &&
                !dont_match.test(allElements[i].getAttribute('type')) 
               ) {
                // Element exists with attribute. Add to array.
                matchingElements.push(allElements[i].text);
            }
        }
        return matchingElements;
    }

    function run() {
                
        var js_blocks = findFatFingerBlocks();

        var js = "";

        if (js_blocks.constructor === Array) {
            for (var idx = 0; idx < js_blocks.length; idx++) {

                var result = fatfinger.run(js_blocks[idx]); 

                if (result.succeeded) {
                    js += result.text;
                }
            }
        }

        eval(js);
    }
    
    return {"run" : run};
})(fatfinger);

// if we're in a browser, activate the script runner
if (typeof document !== 'undefined')
    document.addEventListener('DOMContentLoaded', fatfinger.inlineScriptRunner.run, false);
