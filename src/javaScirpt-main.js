

javaScirpt.run = function(code) {

    code = addBracketsToEnd(code);

    code = javaScirpt.wordReplacer.parseLevel.fixCode(code);

    code = cleanUpForVars(code);

    if (code == null) {
        var retObj = {
            succeeded: false,
            text: code
        };
        return retObj;
    }

    code = javaScirpt.wordReplacer.badIdentifiers.fixCode(code);

    var retObj = {
        succeeded: true,
        text: code
    };
    return retObj;



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
            console.log("match found at " + match.index);

            var varstmt = /(var\s+[^;]*)\s*;/.exec(code.substring(match.index, code.length));
            var remain = /var\s+([^;]*)\s*;/.exec(code.substring(match.index, code.length));

            code = code.substring(0, match.index) + 
                varstmt[0] + 
                "\nfor(" + 
                code.substring(match.index + remain.index + 3, code.length); // the 3 is for the length of "var" -- we already swallowed any leading whitespace

        }

        return code;
    }
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = javaScirpt;
