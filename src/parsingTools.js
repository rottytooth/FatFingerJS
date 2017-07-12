
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

                var wordReplaceList = fatfinger.wordMatcher.findPotentialMatches(words[locIdx].value);

                for (var replaceIdx = 0; replaceIdx < wordReplaceList.length; replaceIdx++) // replaceIdx = which replacement word to use
                {
                    var newline = line.substring(0, words[locIdx].pos);
                    newline += wordReplaceList[replaceIdx].word;
                    newline += line.substring(words[locIdx].endpos, words[locIdx].length);
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
