//require("../lib/parse-js.js");
//require("../lib/jslint.js");
//require("parsingTools.js");

javaScirpt.wordReplacer = {};

// template design pattern
javaScirpt.wordReplacer.wordReplacerBase = {

    // options for jslint
    lintOptions: {browser: true, multivar: true, for: true, this: true, white: true, devel: true, single: true},

    fixCode: function(code) {

        var idx = 0;

        // number of warnings to loop through
        var topIndex = 1; // this will be set at the first lint

        // times through the outer for loop
        var numberOfLoops = 0;

        // number of times we can loop before it seems like we've exhausted the possibilities and are likely in an infinite loop
        var maxLoops; // this will be set at the first lint

        // whether maxLoops has been set yet
        var maxLoopSet = false;

        // whether we've altered the original code and need to reevaluate (re-lint) for a new set of warnings (and identifier locations)
        var madeAChange;

        // the last changed node
        var changedNode;

        // This outer loop is to "reset" jslint each time we make a change.
        // Not doing so leads to issues when we fix one warning which actually 
        // resolves multiple warnings (like fixing the word "function" that then satisfies
        // away the warning about a bracket instead of semicolon, which we would NOT want to fix
        do {

            // setting jslint at pretty tolerant settings. We can just ignore warnings we don't like, but trying to stop jslint from tripping up on bs and not giving us a tree
            var linted = jslint(code, this.lintOptions);

            if (this.canWeExit(linted)) {
                return code;
            }

            if (!linted.ok && !linted.tree) {
                if (linted.warnings && linted.warnings.length > 0) {
                    throw new javaScirpt.CompileException("Error on line: " + 
                        linted.warnings[linted.warnings.length - 1].line + 
                        ", col: " + 
                        linted.warnings[linted.warnings.length - 1].column);
                }
            }


            madeAChange = false; // reset

            topIndex = linted.warnings.length;

            if (!maxLoopSet) {
                // this assumes that the first lint gives us more warnings than we will get on subsequent ones. Might be worth re-testing and increasing if not
                maxLoops = (topIndex * (topIndex + 1)) / 2;
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
                                newlint.warnings[newIdx].code == results.changedNode.code) {
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

            // FIXME: For now, we're treating all parameters as if they are global, in fact JavaScirpt has no idea about scope
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
        if (node.block && node.block.id != "{") { // check for { to avoid infinite loop
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

javaScirpt.wordReplacer.inherit = function(proto) {
    var F = function() { };
    F.prototype = proto;
    return new F();
}




// PARSE LEVEL WORD REPLACER

javaScirpt.wordReplacer.parseLevel = javaScirpt.wordReplacer.inherit(javaScirpt.wordReplacer.wordReplacerBase);
 
javaScirpt.wordReplacer.parseLevel.canWeExit = function(linted) {
    return linted.ok;
}

 
javaScirpt.wordReplacer.parseLevel.correctText = function(linted, idx, code) {

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
            var doesparse = javaScirpt.parsingTools.testParseJs(currLine);         

            if (!doesparse) {

                // FIXME: this will still fail if there are two misspelled keywords on a line
                var newline = javaScirpt.parsingTools.correctLineForKeywords(currLine);
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
            javaScirpt.parsingTools.testParseJs(code)) { // we make sure it parses first bc this is not an error that should break parsing by a normal parsing engine like parse-js: let's make sure it's the thing it seems to be

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

            if (javaScirpt.parsingTools.testParseJs(newCode)) {
                // make sure we didn't break the code
                code = newCode;
                fixed = true;
            }
            
        }

        // if we haven't fixed it yet, let's just do what jslint tells us to
        // FIXME: this really needs to actually test if we're in a var statement                        
        if (!fixed)
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

javaScirpt.wordReplacer.parseLevel.test = function(code) {
    return javaScirpt.parsingTools.testParseJs(code);
};




// BAD IDENTIFIERS WORD REPLACER

javaScirpt.wordReplacer.badIdentifiers = javaScirpt.wordReplacer.inherit(javaScirpt.wordReplacer.wordReplacerBase);

// preloading global stuff so we don't loop through it every time
javaScirpt.wordReplacer.loadGlobals = function() {
    globals = [];
    if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
        // get what's in scope from the browser
        for (var k in window ) {
            if (k != 'javaScirpt' && k!= 'jslint') { // don't add the framework
                globals[k] = true;
            }
        }
    } else {
        // FIXME: we should add some fake browser stuff here for testing
    }
    return globals;
}

javaScirpt.wordReplacer.badIdentifiers.global_obj = javaScirpt.wordReplacer.loadGlobals();


// no early exit for bad identifiers
javaScirpt.wordReplacer.badIdentifiers.canWeExit = function(linted) { return false; }

javaScirpt.wordReplacer.badIdentifiers.buildIdentifiers = function(relinted) {

    var varlist = [];

    varlist = this.buildLocalIdentifiers(relinted.tree, varlist);

    return Object.assign({}, this.global_obj, varlist);
}

javaScirpt.wordReplacer.badIdentifiers.correctText = function(relinted, idx, code) {
    madeAChange = false;

    var identifiers = this.buildIdentifiers(relinted);

    if (relinted.warnings[idx].code == "undeclared_a") {
        // here we will try swapping for each identifier
        var badIdent = relinted.warnings[idx].a;
        var idList = javaScirpt.wordMatcher.findPotentialMatches(badIdent, identifiers);

        if (idList != null && idList.length > 0) {
            var lineToFix = relinted.lines[relinted.warnings[idx].line];

            var possibleLines = [];

            for(var j = 0; j < idList.length; j++) {
                var newline = this.replaceWord(lineToFix, relinted.warnings[idx], relinted.warnings[idx].a, idList[j])

                if (javaScirpt.parsingTools.testParseJs(newline)) {
                    possibleLines.push({line:newline, score:idList[j].score, place:j});
                }
            }
            var sortedLines = possibleLines.sort(javaScirpt.parsingTools.lineSorter);

            if (!sortedLines || sortedLines.length == 0) {
                // we will do nothing in this case -- it means we did not find an identifier replacement that parses
            } else {
                var returnlines = relinted.lines.slice();
                returnlines[relinted.warnings[idx].line] = sortedLines[0].line;
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
javaScirpt.wordReplacer.badIdentifiers.test = function(code) { return true; };



// BAD IDENTIFIERS WORD REPLACER

javaScirpt.wordReplacer.memberFix = javaScirpt.wordReplacer.inherit(javaScirpt.wordReplacer.wordReplacerBase);

javaScirpt.wordReplacer.memberFix.global_obj = javaScirpt.wordReplacer.loadGlobals();

javaScirpt.wordReplacer.memberFix.canWeExit = function(linted) { }

javaScirpt.wordReplacer.memberFix.test = function(code) { return true; };

// We are not dealing with the warnings this loop, but with the tree itself. We need to allow
// for resetting the tree, since changing names will change string lengths and so locations
javaScirpt.wordReplacer.memberFix.lastCheckedLocation = 0;

javaScirpt.wordReplacer.memberFix.treeWalker = function(node, code, linted, allLocalObjects) {
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

            var repl = javaScirpt.wordMatcher.findPotentialMatches(endOfDot, possibleProps);
            repl = repl.sort(javaScirpt.parsingTools.lineSorter);

            if (repl[0]) {
                linted.lines[node.line] = this.replaceWord(linted.lines[node.line], node.name, endOfDot , repl[0]);
                code = linted.lines.join("\n");
            }
            // FIXME: we need to track the offset for each line (annoying)
        }
    }
    if (node.expression) {
        return this.treeWalker(node.expression, code, linted, allLocalObjects);
    }
    return code;
}
 
javaScirpt.wordReplacer.memberFix.alternateSearch = function(linted, code) {

    var allLocalObjects = this.buildLocalIdentifiers(linted.tree, {});

    code = this.treeWalker(linted.tree, code, linted, allLocalObjects);

    var retObj = {
        madeAChange: false,
        code: code
    };

    return retObj;
}
