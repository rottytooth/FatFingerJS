

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
