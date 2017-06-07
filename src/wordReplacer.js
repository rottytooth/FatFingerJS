//require("../lib/parse-js.js");
//require("../lib/jslint.js");
//require("parsingTools.js");

var wordReplacer = 
(function() {

    var wordReplacerBase = {

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

            // This outer loop is to "reset" jslint each time we make a change.
            // Not doing so leads to issues when we fix one warning which actually 
            // resolves multiple warnings (like fixing the word "function" that then satisfies
            // away the warning about a bracket instead of semicolon, which we would NOT want to fix
            do {

                var linted = jslint(code, {browser: true});

                if (this.canWeExit(linted)) {
                    return code;
                }

                madeAChange = false; // reset

                topIndex = linted.warnings.length;

                if (!maxLoopSet) {
                    // this assumes that the first lint gives us more warnings than we will get on subsequent ones. Might be worth re-testing and increasing if not
                    maxLoops = (topIndex * (topIndex + 1)) / 2;
                }

                // get to the real business
                for(idx = 0; idx < linted.warnings.length && madeAChange === false; idx++) {

                    // var warning = linted.warnings[idx];

                    var results = this.correctText(linted, idx, code);
                    madeAChange = results.madeAChange;
                    code = results.code;
                }

                numberOfLoops++;

            } while (idx < topIndex && numberOfLoops < maxLoops);


            if (!this.test(code)) {
                return null;
            }

            return code;

        }

    }

    function inherit(proto) {
        var F = function() { };
        F.prototype = proto;
        return new F();
    }

    var parseLevel = inherit(wordReplacerBase);
 
    // implement template steps

    parseLevel.canWeExit = function(linted) {
         return linted.ok;
    }

 
    parseLevel.correctText = function(linted, idx, code) {

        var warning = linted.warnings[idx];

        var madeAChange = false;

        if (warning.code == "expected_a_b") {
            var fixed = false;

            // jslint thinks there should be a ; 
            // there are a few things this could be: 
            // 1. a keyword that looks to jslint like a name bc it's misspelled
            // 2. it's a command that requires parantheses or brackets that are missing
            // 3. it's really missing a ;
            if (warning.message.includes("Expected ';'")) {

                var currLine = linted.lines[warning.line];

                // if we think it needs brackets, give it brackets for the test
                // FIXME: there are cases where we need the brackets but they won't be in warning.b
                var addAndRemoveBrackets = (warning.a == ';' && 
                    (warning.b == '{' || 
                    currLine.trim().charAt(currLine.length - 1) == "{" ||
                    (warning.line < linted.lines.length - 2 && 
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
                var doesparse = parsingTools.testParseJs(currLine);         

                if (!doesparse) {

                    // FIXME: this will still fail if there are two misspelled keywords on a line
                    var newline = parsingTools.correctLineForKeywords(currLine);
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

            // if we haven't fixed it yet, let's just do what jslint tells us to
            // FIXME: this really needs to actually test if we're in a var statement                        
            if (!fixed
                && !(warning.a == ";" && !!warning.b && warning.b == ",")) // jslint hates multiple declarations -- let's just assume commas are ok
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

    parseLevel.test = function(code) {
        return parsingTools.testParseJs(code);
    };




    // BAD IDENTIFIERS
    var badIdentifiers = inherit(wordReplacerBase);

    // no early exit for bad identifiers
    badIdentifiers.canWeExit = function(linted) {
        return false;
    }

    badIdentifiers.buildIdentifiers = function(relinted) {

        var varlist = [];
        var global_obj = [];
        var identifiers = [];

        // FIXME: we really should not be looping through all this crap so many times -- should be pre-loaded once and re-used with each loop
        if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
            // get what's in scope from the browser
            for (var k in window ) {
                // if (typeof window[k] == 'object') {
                    global_obj[k] = true;
                // }
            }
        } else {
            // FIXME: we should add some fake browser stuff here for testing
        }

        for (var i = 0; i < relinted.tree.length; i++) {
            var node = relinted.tree[i];
            if (node.arity == "statement" && 
                (node.id == "const" || node.id == "var"  || node.id == "function")) {

                if (node.names) {
                    for(var j = 0; j < node.names.length; j++) {
                        if (node.names[j].role == "variable") {
                            varlist[node.names[j].id] = true;
                        }
                    }
                } else if (node.name) { // this is primarily for functions
                    varlist[node.name.id] = true;
                }

                // FIXME: For now, we're treating all parameters as if they are global, in fact JavaScirpt has no idea about scope
                if (node.parameters) {
                    for(var k = 0; k < node.parameters.length; k++) {
                        varlist[node.parameters[k].id] = true;
                    }
                }
            }
        }

        return Object.assign({}, global_obj, varlist);
    }

    badIdentifiers.correctText = function(relinted, idx, code) {
        madeAChange = false;

        var identifiers = this.buildIdentifiers(relinted);

        if (relinted.warnings[idx].code == "undeclared_a") {
            // here we will try swapping for each identifier
            var badIdent = relinted.warnings[idx].a;
            var idList = wordMatcher.findPotentialMatches(badIdent, identifiers);

            if (idList != null && idList.length > 0) {
                var lineToFix = relinted.lines[relinted.warnings[idx].line];

                var possibleLines = [];

                for(var j = 0; j < idList.length; j++) {
                    var newline = lineToFix.substr(0, relinted.warnings[idx].column) +
                        idList[j].word +
                        lineToFix.substring(relinted.warnings[idx].column + relinted.warnings[idx].a.length,
                            lineToFix.length);

                    if (parsingTools.testParseJs(newline)) {
                        possibleLines.push({line:newline, score:idList[j].score, place:j});
                    }
                }
                var sortedLines = possibleLines.sort(parsingTools.lineSorter);

                if (!sortedLines || sortedLines.length == 0) {
                    // we will do nothing in this case -- it means we did not find an identifier replacement that parses
                } else {
                    relinted.lines[relinted.warnings[idx].line] = sortedLines[0].line;
                    code = relinted.lines.join("\n");
                    madeAChange = true;
                }
            }
        }

        var retObj = {
            madeAChange: madeAChange,
            code: code
        };

        return retObj;

    }

    // always return the code, no final test
    badIdentifiers.test = function(code) {
        return true;
    };

    return {"parseLevel" : parseLevel,
            "badIdentifiers" : badIdentifiers};
})();
