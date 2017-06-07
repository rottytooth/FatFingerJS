
var javascirpt =
(function() {

    function run(code) {
        code = addBracketsToEnd(code);

        code = wordReplacer.parseLevel.fixCode(code);

        if (code == null) {
            var retObj = {
                succeeded: false,
                text: code
            };
            return retObj;
        }

        code = wordReplacer.badIdentifiers.fixCode(code);

        var retObj = {
            succeeded: true,
            text: code
        };
        return retObj;
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


    return {"run" : run};
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = javascirpt;
