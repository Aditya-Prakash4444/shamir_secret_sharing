const fs = require('fs');

// Function to convert a number from any base to decimal
function convertFromBase(value, base) {
    return parseInt(value, parseInt(base));
}

// Function to perform Lagrange interpolation to find the constant term
function lagrangeInterpolation(points) {
    const n = points.length;
    let constantTerm = 0;
    
    for (let i = 0; i < n; i++) {
        let numerator = 1;
        let denominator = 1;
        
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                numerator *= (0 - points[j].x);
                denominator *= (points[i].x - points[j].x);
            }
        }
        
        constantTerm += points[i].y * (numerator / denominator);
    }
    
    return Math.round(constantTerm);
}

// Function to solve the polynomial using matrix method (Gaussian elimination)
function solvePolynomial(points, degree) {
    const n = points.length;
    
    // Create augmented matrix [A|b]
    const matrix = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < degree; j++) {
            row.push(Math.pow(points[i].x, degree - 1 - j));
        }
        row.push(points[i].y);
        matrix.push(row);
    }
    
    // Gaussian elimination
    for (let i = 0; i < degree; i++) {
        // Find pivot
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
                maxRow = k;
            }
        }
        
        // Swap rows
        [matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]];
        
        // Eliminate column
        for (let k = i + 1; k < n; k++) {
            const factor = matrix[k][i] / matrix[i][i];
            for (let j = i; j <= degree; j++) {
                matrix[k][j] -= factor * matrix[i][j];
            }
        }
    }
    
    // Back substitution
    const coefficients = new Array(degree).fill(0);
    for (let i = degree - 1; i >= 0; i--) {
        let sum = matrix[i][degree];
        for (let j = i + 1; j < degree; j++) {
            sum -= matrix[i][j] * coefficients[j];
        }
        coefficients[i] = sum / matrix[i][i];
    }
    
    return coefficients[degree - 1]; // Return constant term
}

// Function to process a test case
function processTestCase(filename) {
    try {
        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const { n, k } = data.keys;
        const degree = k - 1;
        
        console.log(`\nProcessing ${filename}:`);
        console.log(`n = ${n}, k = ${k}, degree = ${degree}`);
        
        // Extract and decode points
        const points = [];
        for (const key in data) {
            if (key !== "keys") {
                const x = parseInt(key);
                const base = parseInt(data[key].base);
                const value = data[key].value;
                const y = convertFromBase(value, base);

                points.push({ x, y });
                console.log(`Point ${x}: x = ${x}, y = ${value} (base ${base}) = ${y}`);
            }
        }
        
        console.log(`\nDecoded points: ${JSON.stringify(points)}`);
        
        // Use Lagrange interpolation to find constant term
        const constantTerm = lagrangeInterpolation(points);
        console.log(`Constant term (Lagrange): ${constantTerm}`);
        
        // Also try matrix method for verification
        if (points.length >= degree + 1) {
            const matrixConstantTerm = solvePolynomial(points, degree + 1);
            console.log(`Constant term (Matrix): ${matrixConstantTerm}`);
        }
        
        return constantTerm;
        
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
        return null;
    }
}

// Main execution
function main() {
    console.log("Shamir's Secret Sharing - Polynomial Constant Term Finder");
    console.log("=" .repeat(50));
    
    const testcase1 = processTestCase('testcase1.json');
    const testcase2 = processTestCase('testcase2.json');
    
    console.log("\n" + "=" .repeat(50));
    console.log("FINAL RESULTS:");
    console.log(`Test Case 1 Secret: ${testcase1}`);
    console.log(`Test Case 2 Secret: ${testcase2}`);
}

// Run the solution
main(); 