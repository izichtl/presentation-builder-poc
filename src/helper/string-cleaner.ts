export function cleanString(inputString: string): string {
    // Remove spaces and replace with underscore
    let cleanedString = inputString.replace(/ /g, '_');
    
    // Remove special characters using regex
    cleanedString = cleanedString.replace(/[^\w\s]/gi, '');
    
    return cleanedString;
}