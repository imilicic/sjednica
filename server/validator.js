function validateFormInput(values) {
    for (var i = 0; i < values.length; i++) {
        var current = values[i];

        if (current.Type === "char") {
            if (!isNaN(parseInt(current.Value))) { // value is number
                return false;
            }

            if (current.Value.length > current.Max || current.Value.length < current.Min) { // too big or too small
                return false;
            }

            if (current.RegExp) {
                var newRegExp = new RegExp(current.RegExp);

                if (!newRegExp.test(current.Value)) { // regexp doesn't match
                    return false;
                }
            }
        } else if (current.Type === "bool") {
            return current.Value === true || current.Value === false;
        } else if (current.Type === "int") {
            if (isNaN(parseInt(current.Value))) { // value is char
                return false;
            }

            if (parseFloat(current.Value) - parseInt(current.Value) != 0) { // value is float
                return false;
            }

            if (current.Value > current.Max || current.Value < current.Min) { // bigger or smaller than allowed
                return false;
            }
        } else if (current.Type === "float") {
            if (isNaN(parseInt(current.Value))) { // value is char
                return false;
            }

            if (current.Value > current.Max || current.Value < current.Min) { // bigger or smaller than allowed
                return false;
            }
        }
    }

    return true;
}

function appendValidators(chosenValidatorNames, validators) {
    var result = [];

    for (var i = 0; i < chosenValidatorNames.length; i++) {
        var val = validators.filter(val => {
            if (val.Name == chosenValidatorNames[i]) {
                return val;
            }
        })[0];

        result.push(val);
    }

    return result;
}

function routeParametersValidator(param) {
    if (isNaN(parseInt(param))) { // if char
        return false;
    } else if (parseFloat(param) - parseInt(param) != 0) { // if float
        return false;
    } else {
        return true;
    }
}

module.exports.appendValidators = appendValidators;
module.exports.validateFormInput = validateFormInput;
module.exports.routeParametersValidator = routeParametersValidator;