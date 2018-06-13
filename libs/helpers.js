function lowerCaseFirstLetter(input) {
    return input[0].toLowerCase() + input.substr(1);
}

function sanitizeParameterValue(input) {
    if (input[0] === '"' && input.substr(-1) === '"') return input.substr(1, input.length - 2);
    return input;
}

function replaceSubstr(input, pos, length, replaceWith) {
    const start = input.substr(0, pos);
    const end = input.substr(pos + length);
    return start + replaceWith + end;
}

function leftTrim(input) {
    if (input == null) return input;
    return input.replace(/^\s+/g, '');
}

function searchAfter(string, position, searchString) {
    return position + string.substring(position).search(searchString);
}

function isConstructor(reference) {
    try {
        new reference();
    } catch (err) {
        // verify err is the expected error and then
        return false;
    }
    return true;
}

module.exports = {
    sanitizeParameterValue,
    replaceSubstr,
    leftTrim,
    searchAfter,
    isConstructor,
    lowerCaseFirstLetter
};