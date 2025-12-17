/**
 * Finance Calculators
 * EMI Calculator and GST Calculator
 */

// EMI Calculator
if (document.getElementById('loan-amount')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loanAmountInput = document.getElementById('loan-amount');
        const interestRateInput = document.getElementById('interest-rate');
        const loanTenureInput = document.getElementById('loan-tenure');
        const tenureTypeSelect = document.getElementById('tenure-type');
        const calculateBtn = document.getElementById('calculate-btn');
        const resetBtn = document.getElementById('reset-btn');
        const resultContainer = document.getElementById('result-container');
        const emiResult = document.getElementById('emi-result');
        const resultDetails = document.getElementById('result-details');

        const STORAGE_KEY = 'emi_calculator_data';

        // Load saved data
        loadSavedData();

        // Calculate button
        calculateBtn.addEventListener('click', calculateEMI);

        // Reset button
        resetBtn.addEventListener('click', resetCalculator);

        // Auto-calculate on input change
        [loanAmountInput, interestRateInput, loanTenureInput, tenureTypeSelect].forEach(input => {
            input.addEventListener('input', debounce(calculateEMI, 300));
        });

        /**
         * Calculate EMI
         */
        function calculateEMI() {
            const loanAmount = parseFloat(loanAmountInput.value);
            const annualRate = parseFloat(interestRateInput.value);
            let tenure = parseFloat(loanTenureInput.value);
            const tenureType = tenureTypeSelect.value;

            // Validation
            if (!loanAmount || loanAmount <= 0) {
                resultContainer.style.display = 'none';
                return;
            }

            if (!annualRate || annualRate < 0 || annualRate > 100) {
                resultContainer.style.display = 'none';
                return;
            }

            if (!tenure || tenure <= 0) {
                resultContainer.style.display = 'none';
                return;
            }

            // Convert tenure to months if needed
            if (tenureType === 'years') {
                tenure = tenure * 12;
            }

            // Calculate monthly interest rate
            const monthlyRate = annualRate / (12 * 100);

            // Calculate EMI using formula: EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]
            const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                       (Math.pow(1 + monthlyRate, tenure) - 1);

            // Calculate total amount
            const totalAmount = emi * tenure;

            // Calculate total interest
            const totalInterest = totalAmount - loanAmount;

            // Display results
            emiResult.textContent = formatCurrency(emi);
            
            let detailsHTML = `
                <p><strong>Loan Amount:</strong> ${formatCurrency(loanAmount)}</p>
                <p><strong>Interest Rate:</strong> ${formatPercentage(annualRate)} per annum</p>
                <p><strong>Loan Tenure:</strong> ${tenure} months (${(tenure / 12).toFixed(1)} years)</p>
                <p><strong>Monthly EMI:</strong> ${formatCurrency(emi)}</p>
                <p><strong>Total Interest:</strong> ${formatCurrency(totalInterest)}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
            `;

            resultDetails.innerHTML = detailsHTML;
            resultContainer.style.display = 'block';
            saveData();
        }

        /**
         * Reset calculator
         */
        function resetCalculator() {
            loanAmountInput.value = '';
            interestRateInput.value = '';
            loanTenureInput.value = '';
            tenureTypeSelect.value = 'years';
            resultContainer.style.display = 'none';
            clearLocalStorage(STORAGE_KEY);
            showNotification('Calculator reset', 'success');
        }

        /**
         * Save data
         */
        function saveData() {
            const data = {
                loanAmount: loanAmountInput.value,
                interestRate: interestRateInput.value,
                loanTenure: loanTenureInput.value,
                tenureType: tenureTypeSelect.value
            };
            saveToLocalStorage(STORAGE_KEY, data);
        }

        /**
         * Load saved data
         */
        function loadSavedData() {
            const saved = getFromLocalStorage(STORAGE_KEY);
            if (saved) {
                if (saved.loanAmount) loanAmountInput.value = saved.loanAmount;
                if (saved.interestRate) interestRateInput.value = saved.interestRate;
                if (saved.loanTenure) loanTenureInput.value = saved.loanTenure;
                if (saved.tenureType) tenureTypeSelect.value = saved.tenureType;
                
                if (saved.loanAmount && saved.interestRate && saved.loanTenure) {
                    setTimeout(calculateEMI, 100);
                }
            }
        }
    });
}

