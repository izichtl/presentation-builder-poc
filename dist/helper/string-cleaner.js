"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanString = void 0;
function cleanString(inputString) {
    // Remove spaces and replace with underscore
    let cleanedString = inputString.replace(/ /g, '_');
    // Remove special characters using regex
    cleanedString = cleanedString.replace(/[^\w\s]/gi, '');
    return cleanedString;
}
exports.cleanString = cleanString;
//# sourceMappingURL=string-cleaner.js.map