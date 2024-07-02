"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixelsToPoints = exports.cmToPoints = void 0;
// @ts-nocheck
function cmToPoints(cm) {
    const pointsPerInch = 72; // There are 72 points in an inch
    const cmPerInch = 2.54; // There are 2.54 centimeters in an inch
    const points = cm * pointsPerInch / cmPerInch;
    return points;
}
exports.cmToPoints = cmToPoints;
const pixelsToPoints = (pixels) => {
    // const dpr = window.devicePixelRatio || 1; 
    log(pixels * 72 / (96 * 1), 'points');
    return pixels * 72 / (96 * 1);
};
exports.pixelsToPoints = pixelsToPoints;
//# sourceMappingURL=unit-converts.js.map