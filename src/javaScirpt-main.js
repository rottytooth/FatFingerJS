
var javascirpt =
(function() {

    function run(code) {
        code = addBracketsToEnd(code);

        code = makeItParse(code);

        if (code == null) {
            var retObj = {
                succeeded: false,
                text: code
            };
            return retObj;
        }

        code = fixBadIdentifiers(code);

        var retObj = {
            succeeded: true,
            text: code
        };
        return retObj;
    }

    function testParseJs(code) {
        try {
            ast = parse(code);
        } 
        catch(err) {
            if (err instanceof JS_Parse_Error) {
                return false;
            }
            else
                throw err;
        }
        return true;
    }

    function addBracketsToEnd(code) {
        var bracketCount = 0;

        var opens = (code.match(/{/g) || []).length;
        var closes = (code.match(/}/g) || []).length;

        for (var idx = 0; idx < opens - closes; idx++) {
            code += "\n}";            
        }
        return code;
    }


    function makeItParse(code) {

        var idx = 0;

        // number of warnings to loop through
        var topIndex = 1; // this will be set at the first lint

        // times through the outer for loop
        var numberOfLoops = 0;

        // number of times we can loop before it seems like we've exhausted the possibilities and are likely in an infinite loop
        var maxLoops = 1; // this will be set at the first lint

        // whether maxLoops has been set yet
        var maxLoopSet = false;

        var madeAChange;

        // This outer loop is to "reset" jslint each time we make a change.
        // Not doing so leads to issues when we fix one warning which actually 
        // resolves multiple warnings (like fixing the word "function" that then satisfies
        // away the warning about a bracket instead of semicolon, which we would NOT want to fix
        for (numberOfLoops = 0; idx < topIndex && numberOfLoops < maxLoops; numberOfLoops++) {

            // haha, jslint is never going to pass any of this
            var linted = jslint(code, {browser: true});
            if (jslint.ok) {
                return code;
            }

            madeAChange = false;
            topIndex = linted.warnings.length;

            if (!maxLoopSet) {
                maxLoops = (topIndex * (topIndex + 1)) / 2;
            }

            // get to the real business
            for(idx = 0; idx < linted.warnings.length && madeAChange === false; idx++) {
                var warning = linted.warnings[idx];
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
                        var doesparse = testParseJs(currLine);         

                        if (!doesparse) {

                            // FIXME: this will still fail if there are two misspelled keywords on a line
                            var newline = correctLineForKeywords(currLine);
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
            }
        }

        var canParse = testParseJs(code);

        if (!canParse) {
            return null;
            // FIXME: add new steps here to help get it parsing
        }

        return code;
    }

    function fixBadIdentifiers(code) {

        // FIXME: there's a lot of repeated logic between here and makeItParse, maybe an opportunity to combine / refactor
        // especially before we add a third one of these to deal with the object/method names

        var varlist = [];
        var global_obj = [];
        var identifiers = [];

        var idx = 0;

        // number of warnings to loop through
        var topIndex = 1; // this will be set at the first lint

        // times through the outer for loop
        var numberOfLoops = 0;

        // number of times we can loop before it seems like we've exhausted the possibilities and are likely in an infinite loop
        var maxLoops = 1; // this will be set at the first lint

        // whether maxLoops has been set yet
        var maxLoopSet = false;


        // if not in node
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

        for (numberOfLoops = 0; idx < topIndex && numberOfLoops < maxLoops; numberOfLoops++) {

            var relinted = jslint(code, {browser: true});

            madeAChange = false;
            topIndex = relinted.warnings.length;

            if (!maxLoopSet) {
                maxLoops = (topIndex * (topIndex + 1)) / 2;
            }


            // get all the identifiers
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

            identifiers = Object.assign({}, global_obj, varlist);

            for(idx = 0; idx < relinted.warnings.length && madeAChange === false; idx++) {

                madeAChange = false;

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

                            if (testParseJs(newline)) {
                                possibleLines.push({line:newline, score:idList[j].score, place:j});
                            }
                        }
                        var sortedLines = possibleLines.sort(lineSorter);

                        if (!sortedLines || sortedLines.length == 0) {
                            // we will do nothing in this case -- it means we did not find an identifier replacement that parses
                        } else {
                            relinted.lines[relinted.warnings[idx].line] = sortedLines[0].line;
                            code = relinted.lines.join("\n");
                            madeAChange = true;
                        }
                    }
                }
            }
        }
        return code;        
    }

    function correctLineForKeywords(line) {

        // load words with each token in the line
        var tgetter = tokenizer(line);
        var token = tgetter();
        var words = [];
        while(token.type != "eof") {
            words.push(token);
            token = tgetter();
        } 

        var possibleLines = [];

        // try swapping in our replacement keywords until we get something that parses
        for(var locIdx = words.length - 1; locIdx >= 0; locIdx--) { // locIdx = location in the string (by word)
            if (words[locIdx].type != "name") { continue; }

            var wordReplaceList = wordMatcher.findPotentialMatches(words[locIdx].value);

            for (var replaceIdx = 0; replaceIdx < wordReplaceList.length; replaceIdx++) // replaceIdx = which replacement word to use
            {
                var newline = line.substring(0, words[locIdx].pos);
                newline += wordReplaceList[replaceIdx].word;
                newline += line.substring(words[locIdx].endpos, words[locIdx].length);
                // console.debug(newline); (for debug)

                score = wordReplaceList[replaceIdx].score;

                if (testParseJs(newline)) {
                    possibleLines.push({line:newline, score:wordReplaceList[replaceIdx].score, place:locIdx});
                }
            }
        }

        var sortedLines = possibleLines.sort(lineSorter);

        if (sortedLines.length == 0) {
            return null;
        } // we have not found a match

        return sortedLines[0].line; // just return the best one
    }

    function lineSorter(a,b) {
        if (a.score == b.score) {
            return (a.place > b.place) ? -1 : 1;
        }
        else {
            return (a.score < b.score) ? -1 : 1;
        }
    }

    return {"run" : run};
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = javascirpt;
