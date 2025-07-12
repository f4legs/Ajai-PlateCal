/**Program name: Good registered car plate number sequence
 * Author: F
 * Date: 2025-06-16
 * Description: This program generates a list of valid car plate numbers
 * Thailand car plate will be in this bor mat: N XX NNNN which N is a number from 0 to 9
 * and XX is a Thai Characters from ก-ฮ
 * TThe good will generated in this method:
 * 1. Generate the last 4 digits from 0000 to 9999 and exclude those with rules:
 *    - Exclude numbers containing specific two-digit sequences (e.g., "00", "01", etc.)
 *    - all the digits must sum to more than 5
 *    - the first pair and last pair digits must sum to more than 5 ( e.g., 1234 -> 1+2 > 5 and 3+4 > 5 )
 *    - the first digit and last digit must sum to more than 5 ( e.g., 1234 -> 1+4 > 5 )
 *    - if there is "1" in the first or second digit, the third or fourth digits must not be "1"
 *    - all digits sum must not be equal to 13
 *    - the first and last must not sum to 13
 *    - keep track of the sum of the digits and ensure it meets the criteria
 * 2. User Input the first two digits (XX) from ก-ฮ and the first digit (N) from 0-9
 *    - convert the Thai characters to a number based on a predefined mapping
 *    - sum the first digit (N) with the converted value of the Thai characters (XX)
 *    - subtract the sum from the subtract Number list [2, 4,5,6,9,14,15,19,23,24,36,41,42,45,46,50,51,54,55,56,59,63,64,65]
 * 3. match the sum of (1.) and (2.) to generate the a list of valid car plate numbers
 * This program will generate a list of valid car plate numbers based on the above rules.
 * and show the sum number of valid car plate numbers
 */


document.addEventListener('DOMContentLoaded', () => {
    const badNumbersInput = document.getElementById('badNumbersInput');
    const generateButton = document.getElementById('generateButton');
    const resultsPre = document.getElementById('results');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');

    // Get references to the new input fields
    const firstDigitInput = document.getElementById('firstDigitInput');
    const thaiCharsInput = document.getElementById('thaiCharsInput');

    // Get references for the new sum calculation feature
    const calculateSumInput = document.getElementById('calculateSumInput');
    const calculateSumButton = document.getElementById('calculateSumButton');
    const calculateSumResultsPre = document.getElementById('calculateSumResults');

    // Default 'badNumbers' array containing two-digit strings.
    // This will be displayed in the textarea initially.
    const defaultBadNumbers = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
        "10", "11", "12", "13", "14", "17", "18",
        "20", "21", "22", "23", "25", "27",
        "30", "31", "32", "33", "34", "37", "38",
        "40", "41", "43", "48", "49",
        "50", "52", "57", "58",
        "60", "67", "68",
        "70", "71", "72", "73", "75", "76", "77",
        "80", "81", "83", "84", "85", "86",
        "90", "94"
    ];

    // Initialize the textarea with the default bad numbers
    badNumbersInput.value = defaultBadNumbers.join(',');

    /**
     * Displays a message in a styled box.
     * @param {string} message The message to display.
     * @param {string} type The type of message ('error', 'success', 'warning').
     */
    function showMessage(message, type = 'warning') {
        messageText.textContent = message;
        messageBox.className = `message-box rounded-lg p-4 mb-4 text-sm show`; // Reset classes
        if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'text-red-800', 'border-red-400');
        } else if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'text-green-800', 'border-green-400');
        } else { // Default to warning
            messageBox.classList.add('bg-yellow-100', 'text-yellow-800', 'border-yellow-400');
        }
    }

    /**
     * Hides the message box.
     */
    function hideMessageBox() {
        messageBox.classList.remove('show', 'bg-red-100', 'text-red-800', 'border-red-400', 'bg-green-100', 'text-green-800', 'border-green-400', 'bg-yellow-100', 'text-yellow-800', 'border-yellow-400');
        messageBox.classList.add('hidden');
        messageText.textContent = '';
    }

    /**
     * Checks if a number's string representation contains any of the bad two-digit sequences.
     * @param {string} numStr The string representation of the number.
     * @param {Set<string>} excludeSet A Set of two-digit strings to exclude.
     * @returns {boolean} True if the number contains any excluded sequence, false otherwise.
     */
    function containsExcludedSequence(numStr, excludeSet) {
        const paddedNumStr = numStr.padStart(4, '0'); // Pad to 4 digits for 0000-9999 range

        for (let i = 0; i <= paddedNumStr.length - 2; i++) {
            const sub = paddedNumStr.substring(i, i + 2);
            if (excludeSet.has(sub)) {
                return true; // Found an excluded sequence
            }
        }
        return false; // No excluded sequence found
    }

    /**
     * Generates a list of numbers from 0 to 9999, excluding those
     * containing any of the specific two-digit sequences from the provided exclusion set.
     * @param {Set<string>} excludeSet A Set of two-digit strings to exclude.
     * @returns {number[]} An array of valid numbers.
     */
    function generateNumbersExcludingBadSequences(excludeSet, targetSums) {
        hideMessageBox(); // Hide previous messages on new generation

        const validNumbers = [];
        for (let i = 0; i <= 9999; i++) {
            const numStr = i.toString().padStart(4, '0');
            if (!containsExcludedSequence(numStr, excludeSet)) {
                // Check if the number is valid based on existing rules AND if its sum is in targetSums
                const digits = numStr.split('').map(Number);
                const sum = digits.reduce((a, b) => a + b, 0);

                if (isValidNumber(i) && targetSums.includes(sum)) {
                    validNumbers.push(i);
                }
            }
        }
        return validNumbers;
    }

    /** 
    * Adds second set of rules after the first generation
    * 1. all the digits must sum to more than 4
    * 2. the first pair and last pair digits must sum to more than 4 ( e.g., 1234 -> 1+2 > 4 and 3+4 > 4 )
    * 3. the first digit and last digit must sum to more than 4 ( e.g., 1234 -> 1+4 > 4 )
    * 4. if there is "1" in the first or second digit, the third or fourth digits must not be "1"
    * 5. all digits sum must not be equal to 13
    * 6. the first and last must not sum to 13
    */
    function isValidNumber(num) {
        const digits = num.toString().padStart(4, '0').split('').map(Number);
        const sum = digits.reduce((a, b) => a + b, 0);

        // Rule 1: All digits must sum to more than 4
        if (sum <= 4) return false;

        // Rule 2: First pair and last pair digits must sum to more than 4
        if (digits[0] + digits[1] <= 4 || digits[2] + digits[3] <= 4) return false;

        // Rule 3: First digit and last digit must sum to more than 4
        if (digits[0] + digits[3] <= 4) return false;

        // Rule 4: If there is "1" in the first or second digit, the third or fourth digits must not be "1"
        if ((digits[0] === 1 || digits[1] === 1) && (digits[2] === 1 || digits[3] === 1)) return false;

        // Rule 5: All digits sum must not be equal to 13
        if (sum === 13) return false;

        // Rule 6: The first and last must not sum to 13
        if (digits[0] + digits[3] === 13) return false;

        return true; // Number passes all rules
    }

    generateButton.addEventListener('click', () => {
        const rawBadNumbers = badNumbersInput.value.trim();
        let parsedBadNumbers = [];

        // Get values from new inputs
        const firstDigit = parseInt(firstDigitInput.value, 10);
        const thaiChars = thaiCharsInput.value.trim();

        // Validate new inputs
        if (isNaN(firstDigit) || firstDigit < 0 || firstDigit > 9) {
            showMessage("Please enter a valid single digit (0-9) for the first digit.", "error");
            resultsPre.textContent = "Invalid first digit input.";
            return;
        }

        if (thaiChars.length !== 2) {
            showMessage("Please enter exactly two Thai characters.", "error");
            resultsPre.textContent = "Invalid Thai characters input.";
            return;
        }

        // Convert Thai characters and calculate the sum
        const thaiCharsValue = convertThaiCharactersToNumber(thaiChars);
        const requiredSum = firstDigit + thaiCharsValue;

        let catNum = requiredSum;

        // Define the subtract Number list
        const subtractNumberList = [2, 4, 5, 6, 9, 14, 15, 19, 23, 24, 36, 41, 42, 45, 46, 50, 51, 54, 55, 56, 59, 63, 64, 65];

        // Calculate the target sums for the last four digits
        const targetSums = subtractNumberList.map(subtractValue => subtractValue - requiredSum).filter(sum => sum >= 0);

        if (targetSums.length === 0) {
            showMessage(`No possible sums for the last four digits based on the inputs and subtract list. Required sum was ${requiredSum}.`, "warning");
            resultsPre.textContent = "No numbers found matching the criteria.";
            return;
        }

        if (rawBadNumbers) {
            parsedBadNumbers = rawBadNumbers.split(',').map(s => s.trim()).filter(s => s.length === 2 && /^\d{2}$/.test(s));
            if (parsedBadNumbers.length === 0 && rawBadNumbers.length > 0) {
                showMessage("No valid 2-digit sequences found in your input. Please ensure they are comma-separated and exactly two digits (e.g., '23,45').", "error");
                resultsPre.textContent = "Invalid bad numbers input.";
                return; // Stop execution if input is invalid
            }
        }

        const badNumbersSet = new Set(parsedBadNumbers);
        // Pass targetSums to the generation function
        const numbers = generateNumbersExcludingBadSequences(badNumbersSet, targetSums);

        if (numbers.length > 0) {
            // Group numbers by their sum
            const numbersBySum = numbers.reduce((acc, num) => {
                const numStr = num.toString().padStart(4, '0');
                const digits = numStr.split('').map(Number);
                const sum = digits.reduce((a, b) => a + b, 0);
                if (!acc[sum]) {
                    acc[sum] = [];
                }
                acc[sum].push(numStr);
                return acc;
            }, {});

            // Format the output string
            let displayText = `CAT: ${firstDigit}${thaiChars} (${catNum})\n-----------------------------\n`;

            // Sort sums numerically before displaying
            const sortedSums = Object.keys(numbersBySum).map(Number).sort((a, b) => a - b);

            for (const sum of sortedSums) {
                displayText += `SUM: ${sum} (${catNum+sum})\n`;
                displayText += `NUM: ${numbersBySum[sum].join(', ')}\n`;
                displayText += `-----------------------------\n`;
            }

            resultsPre.textContent = displayText;
            showMessage(`Successfully generated ${numbers.length} numbers grouped by sum.`, "success");
        } else {
            resultsPre.textContent = "No numbers found matching the criteria for the given exclusions.";
            showMessage("No numbers found matching the criteria. This might be due to extensive exclusions.", "warning");
        }
    });

    // Add event listener for the calculate sum button
    calculateSumButton.addEventListener('click', () => {
        const inputString = calculateSumInput.value.trim();

        if (inputString) {
            const sum = calculateInputSum(inputString);
            calculateSumResultsPre.textContent = `The calculated sum is: ${sum}`;
        } else {
            calculateSumResultsPre.textContent = "Please enter a string to calculate the sum.";
        }
    });

    // Initial generation based on the default bad numbers when the page loads
    generateButton.click();
});


/**
 * This function will handle the generation of numbers based on the bad numbers input.
 * a box will be in this format: "1" and "กข" or 1 number and 2 Thai characters
 * the function will take the input from the text box and convert it to a number
 * and sum that 2 numbers and sum it with the first number that input       
 */
function convertThaiCharactersToNumber(thaiInput) {
    const conversionMap = [
        { "characters": "กดถทภ", "value": 1 },
        { "characters": "ขบปงช", "value": 2 },
        { "characters": "ตฒฆ", "value": 3 },
        { "characters": "คธรญษ", "value": 4 },
        { "characters": "ฉณฌนมหฮฎฬ", "value": 5 },
        { "characters": "จลวอ", "value": 6 },
        { "characters": "ศส", "value": 7 },
        { "characters": "ยผฝพฟ", "value": 8 },
        { "characters": "ฐ", "value": 9 }
    ];

    let totalValue = 0;
    for (const char of thaiInput) {
        for (const entry of conversionMap) {
            if (entry.characters.includes(char)) {
                totalValue += entry.value;
                break; // Stop searching once we find a match
            }
        }
    }
    return totalValue;
}

/**
 * this function is a utility, it will calculate the summary of the number+characters of the input like "1กก 5360" or any length or combination
 * the logic was easy use existing char translation to number and sum it with the all numbers in the input, and we only sum of each digit fo the in put like "1234" is 1+2+3+4 = 10
 * @param {string} input - The input string containing numbers and Thai characters.
 */

function calculateInputSum(input) {
    const conversionMap = [
        { "characters": "กดถทภ", "value": 1 },
        { "characters": "ขบปงช", "value": 2 },
        { "characters": "ตฒฆ", "value": 3 },
        { "characters": "คธรญษ", "value": 4 },
        { "characters": "ฉณฌนมหฮฎฬ", "value": 5 },
        { "characters": "จลวอ", "value": 6 },
        { "characters": "ศส", "value": 7 },
        { "characters": "ยผฝพฟ", "value": 8 },
        { "characters": "ฐ", "value": 9 }
    ];

    let totalValue = 0;
    const regex = /\d+|[ก-ฮ]/g; // Match numbers and Thai characters

    const matches = input.match(regex);
    if (matches) {
        for (const match of matches) {
            if (!isNaN(match)) {
                // Iterate over each digit and add it to the totalValue
                for (const digitChar of match) {
                    totalValue += parseInt(digitChar, 10);
                }
            } else {
                for (const entry of conversionMap) {
                    if (entry.characters.includes(match)) {
                        totalValue += entry.value; // Sum Thai character values
                        break; // Stop searching once we find a match
                    }
                }
            }
        }
    }
    return totalValue;
}