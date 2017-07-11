//require("../lib/parse-js.js");

fatfinger.wordMatcher = 
(function() {

    function findPotentialMatches(orig, dictionary) {
        var dict = [];

        if (!dictionary) {
            
            // against keywords
            addToList(dict, orig, KEYWORDS);
            addToList(dict, orig, KEYWORDS_ATOM);

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
