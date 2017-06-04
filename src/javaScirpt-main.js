
var javascirpt =
(function() {

    function run(code) {
        code = addBracketsToEnd(code);
        var linted = jslint(code, 'browser: true');

        // fixing the blocking warnings first, anything that would keep it from being valid js
        if (!linted.ok) {
            for(var idx = 0; idx < linted.warnings.length; idx++) {
                var warning = linted.warnings[idx];
                if (warning.code == "expected_a_b") {
                    var fixed = false;
                    if (warning.message.includes("Expected ';'")) {
                        // jslint just thinks there should be a ; but it's likely that there's a bad command, so let's try to fix it that way first
                        var currLine = linted.lines[warning.line];

                        // if we think it needs brackets, give it brackets for the test
                        var addAndRemoveBrackets = (warning.a == ';' && warning.b == '{');
                        if (addAndRemoveBrackets) {
                            currLine += "}";
                        }

                        var newline = correctLineForKeywords(currLine);
                        if (newline != null) {
                            fixed = true;

                            if (addAndRemoveBrackets) { 
                                newline = newline.substring(0, newline.length - "}".length);
                            }

                            linted.lines[warning.line] = newline;
                            code = linted.lines.join("\n");                            
                        }
                    }
                    if (!fixed) {
                        var line = linted.lines[warning.line];
                        line = line.substr(0, warning.column) +
                            linted.warnings[idx].a +
                            line.substring(warning.column + warning.b.length,
                                line.length);
                        linted.lines[warning.line] = line;
                        code = linted.lines.join("\n");
                    }
                }
            }
        }

        //FIXME: next we look for undeclared_a for typos in var and object names

        var relinted = jslint(code, 'browser: true');

        var retObj =
        {
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
        }
        return true;
    }

    function addBracketsToEnd(code) {
        var bracketCount = 0;
        var lines = code.split(/([{};])/g);

        for(var idx = 0; idx < lines.length; idx++) {
            if (lines[idx] == "{") {
                bracketCount++;
            }
            if (lines[idx] == "}") {
                bracketCount--;
            }
        }
        for(var brkAdd = 0; brkAdd < bracketCount; brkAdd++) {
            lines.push("}");
        }
        return lines.join("");
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

            var wordReplaceList = wordMatcher.findPotentialMatches(words[locIdx]);

            for (var replaceIdx = 0; replaceIdx < wordReplaceList.length; replaceIdx++) // replaceIdx = which replacement word to use
            {
                var newline = line.substring(0, words[locIdx].pos);
                var didntparse = false;
                newline += wordReplaceList[replaceIdx].word;
                newline += line.substring(words[locIdx].endpos, words[locIdx].length);
                // console.debug(newline); (for debug)

                try {
                    parse(newline);
                } 
                catch(err) {
                    if (err instanceof JS_Parse_Error) {
                        didntparse = true;
                    }
                    else throw err;
                }
                score = wordReplaceList[replaceIdx].score;

                if (!didntparse) {
                    possibleLines.push({line:newline, score:wordReplaceList[replaceIdx].score, place:locIdx});
                }
            }
        }

        var sortedLines = possibleLines.sort(function(a,b) {
            if (a.score == b.score) {
                return (a.place > b.place) ? -1 : 1;
            }
            else {
                return (a.score < b.score) ? -1 : 1;
            }
        });

        if (sortedLines.length == 0) {
            return null;
        } // we have not found a match

        return sortedLines[0].line; // just return the best one
    }

    return {"run" : run};
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = javascirpt;
