/**Program name: Good registered car plate number sequence
 * Author: F
 * Date: 2025-06-16
 * Description: This program generates a list of valid car plate numbers
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tab Elements
    const tabGenerator = document.getElementById('tab-generator');
    const tabCalculator = document.getElementById('tab-calculator');
    const sectionGenerator = document.getElementById('generator-section');
    const sectionCalculator = document.getElementById('calculator-section');

    // Generator Elements
    const badNumbersInput = document.getElementById('badNumbersInput');
    const generateButton = document.getElementById('generateButton');
    const resultsPre = document.getElementById('results');
    const resultsContainer = document.getElementById('results-container');
    const messageBox = document.getElementById('messageBox');
    const messageText = document.getElementById('messageText');
    const firstDigitInput = document.getElementById('firstDigitInput');
    const thaiCharsInput = document.getElementById('thaiCharsInput');

    // Calculator Elements
    const calculateSumInput = document.getElementById('calculateSumInput');
    const calculateSumButton = document.getElementById('calculateSumButton');
    const calculateSumResultsPre = document.getElementById('calculateSumResults');
    const calculateSumResultsContainer = document.getElementById('calculateSumResults-container');

    // Default 'badNumbers' array
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

    // Initialize textarea
    badNumbersInput.value = defaultBadNumbers.join(',');

    // Tab Switching Logic
    function switchTab(tab) {
        if (tab === 'generator') {
            tabGenerator.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
            tabGenerator.classList.remove('text-gray-500');

            tabCalculator.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
            tabCalculator.classList.add('text-gray-500');

            sectionGenerator.classList.remove('hidden');
            sectionCalculator.classList.add('hidden');
        } else {
            tabCalculator.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
            tabCalculator.classList.remove('text-gray-500');

            tabGenerator.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
            tabGenerator.classList.add('text-gray-500');

            sectionCalculator.classList.remove('hidden');
            sectionGenerator.classList.add('hidden');
        }
        hideMessageBox();
    }

    tabGenerator.addEventListener('click', () => switchTab('generator'));
    tabCalculator.addEventListener('click', () => switchTab('calculator'));

    // Helper Functions
    function showMessage(message, type = 'warning') {
        messageText.textContent = message;
        messageBox.className = `message-box rounded-lg p-4 mb-4 text-sm show`;
        if (type === 'error') {
            messageBox.classList.add('bg-red-100', 'text-red-800', 'border-red-400');
        } else if (type === 'success') {
            messageBox.classList.add('bg-green-100', 'text-green-800', 'border-green-400');
        } else {
            messageBox.classList.add('bg-yellow-100', 'text-yellow-800', 'border-yellow-400');
        }
        messageBox.classList.remove('hidden');
    }

    function hideMessageBox() {
        messageBox.classList.add('hidden');
        messageText.textContent = '';
    }

    function containsExcludedSequence(numStr, excludeSet) {
        const paddedNumStr = numStr.padStart(4, '0');
        for (let i = 0; i <= paddedNumStr.length - 2; i++) {
            const sub = paddedNumStr.substring(i, i + 2);
            if (excludeSet.has(sub)) return true;
        }
        return false;
    }

    function isValidNumber(num) {
        const digits = num.toString().padStart(4, '0').split('').map(Number);
        const sum = digits.reduce((a, b) => a + b, 0);

        if (sum <= 4) return false;
        if (digits[0] + digits[1] <= 4 || digits[2] + digits[3] <= 4) return false;
        if (digits[0] + digits[3] <= 4) return false;
        if ((digits[0] === 1 || digits[1] === 1) && (digits[2] === 1 || digits[3] === 1)) return false;
        if (sum === 13) return false;
        if (digits[0] + digits[3] === 13) return false;

        return true;
    }

    function generateNumbersExcludingBadSequences(excludeSet, targetSums) {
        hideMessageBox();
        const validNumbers = [];
        for (let i = 0; i <= 9999; i++) {
            const numStr = i.toString().padStart(4, '0');
            if (!containsExcludedSequence(numStr, excludeSet)) {
                const digits = numStr.split('').map(Number);
                const sum = digits.reduce((a, b) => a + b, 0);
                if (isValidNumber(i) && targetSums.includes(sum)) {
                    validNumbers.push(i);
                }
            }
        }
        return validNumbers;
    }

    // Generator Logic
    generateButton.addEventListener('click', () => {
        const rawBadNumbers = badNumbersInput.value.trim();
        let parsedBadNumbers = [];

        const firstDigit = parseInt(firstDigitInput.value, 10);
        const thaiChars = thaiCharsInput.value.trim();

        if (isNaN(firstDigit) || firstDigit < 0 || firstDigit > 9) {
            showMessage("Please enter a valid single digit (0-9) for the first digit.", "error");
            return;
        }

        if (thaiChars.length !== 2) {
            showMessage("Please enter exactly two Thai characters.", "error");
            return;
        }

        const thaiCharsValue = convertThaiCharactersToNumber(thaiChars);
        const requiredSum = firstDigit + thaiCharsValue;
        let catNum = requiredSum;

        /*
        This array contains a list of specific numbers (e.g., 2, 4, 5, ... 65).
        In the context of car plate numerology, these are likely the desired total sums 
        for the entire plate (First Digit + Thai Letters + 4-Digit Number).
        */
        const subtractNumberList = [2, 4, 5, 6, 9, 14, 15, 19, 23, 24, 36, 41, 42, 45, 46, 50, 51, 54, 55, 56, 59, 63, 64, 65];

        /*
        requiredSum: This represents the sum of the parts you already have:
            -The First Digit (e.g., 1)
            -The converted value of the Thai Characters (e.g., กก = 2)
            -Example: If you input 1กก, requiredSum might be 1 + 2 = 3.
        targetSums Calculation:
            -The code takes each "good total sum" from the list and subtracts your requiredSum.
            -Formula: Target 4-Digit Sum = Desired Total Sum - Prefix Sum
            -Example: If a desired total is 9 and your prefix sums to 3, then your 4-digit number needs to sum to 6 (because 9 - 3 = 6).
        .filter(sum => sum >= 0): This removes any impossible results. If your prefix sum is already higher than a number in the list 
        (e.g., prefix is 50, but the list has 2), the result would be negative, which is impossible for a sum of digits.
        */
        const targetSums = subtractNumberList.map(subtractValue => subtractValue - requiredSum).filter(sum => sum >= 0);

        if (targetSums.length === 0) {
            showMessage(`No possible sums for the last four digits based on the inputs. Required sum was ${requiredSum}.`, "warning");
            resultsContainer.classList.add('hidden');
            return;
        }

        if (rawBadNumbers) {
            parsedBadNumbers = rawBadNumbers.split(',').map(s => s.trim()).filter(s => s.length === 2 && /^\d{2}$/.test(s));
        }

        const badNumbersSet = new Set(parsedBadNumbers);
        const numbers = generateNumbersExcludingBadSequences(badNumbersSet, targetSums);

        if (numbers.length > 0) {
            const numbersBySum = numbers.reduce((acc, num) => {
                const numStr = num.toString().padStart(4, '0');
                const digits = numStr.split('').map(Number);
                const sum = digits.reduce((a, b) => a + b, 0);
                if (!acc[sum]) acc[sum] = [];
                acc[sum].push(numStr);
                return acc;
            }, {});

            let displayText = `CAT: ${firstDigit}${thaiChars} (${catNum})\n-----------------------------\n`;
            const sortedSums = Object.keys(numbersBySum).map(Number).sort((a, b) => a - b);

            for (const sum of sortedSums) {
                displayText += `SUM: ${sum} (${catNum + sum})\n`;
                displayText += `NUM: ${numbersBySum[sum].join(', ')}\n`;
                displayText += `-----------------------------\n`;
            }

            resultsPre.textContent = displayText;
            resultsContainer.classList.remove('hidden');
            showMessage(`Successfully generated ${numbers.length} numbers grouped by sum.`, "success");
        } else {
            resultsContainer.classList.add('hidden');
            showMessage("No numbers found matching the criteria.", "warning");
        }
    });

    // Calculator Logic
    calculateSumButton.addEventListener('click', () => {
        const inputString = calculateSumInput.value.trim();
        if (inputString) {
            const sum = calculateInputSum(inputString);
            calculateSumResultsPre.textContent = `The calculated sum is: ${sum}`;
            calculateSumResultsContainer.classList.remove('hidden');
        } else {
            calculateSumResultsPre.textContent = "Please enter a string to calculate the sum.";
        }
    });
});

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
                break;
            }
        }
    }
    return totalValue;
}

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
    const regex = /\d+|[ก-ฮ]/g;

    const matches = input.match(regex);
    if (matches) {
        for (const match of matches) {
            if (!isNaN(match)) {
                for (const digitChar of match) {
                    totalValue += parseInt(digitChar, 10);
                }
            } else {
                for (const entry of conversionMap) {
                    if (entry.characters.includes(match)) {
                        totalValue += entry.value;
                        break;
                    }
                }
            }
        }
    }
    return totalValue;
}