// @ts-nocheck
export function cmToPoints(cm: number): number {
    const pointsPerInch = 72; // There are 72 points in an inch
    const cmPerInch = 2.54; // There are 2.54 centimeters in an inch

    const points = cm * pointsPerInch / cmPerInch;
  
    return points;
  }

export const pixelsToPoints = (pixels: number): number => {
    // const dpr = window.devicePixelRatio || 1; 
    log(pixels * 72 / (96 * 1), 'points')
    return pixels * 72 / (96 * 1);
  }