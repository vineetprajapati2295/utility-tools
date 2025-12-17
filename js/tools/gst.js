/**
 * GST Calculator
 * Calculate GST amount and total price
 */

document.addEventListener('DOMContentLoaded', function() {
    const calculationTypeSelect = document.getElementById('calculation-type');
    const amountLabel = document.getElementById('amount-label');
    const amountInput = document.getElementById('amount');
    const gstRateSelect = document.getElementById('gst-rate');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const resultLabel = document.getElementById('result-label');
    const totalResult = document.getElementById('total-result');
    const resultDetails = document.getElementById('result-details');

    const STORAGE_KEY = 'gst_calculator_data';

    // Update label on calculation type change
    calculationTypeSelect.addEventListener('change', function() {
        if (this.value === 'add') {
            amountLabel.textContent = 'Base Amount (₹)';
            resultLabel.textContent = 'Total Amount (Including GST)';
        } else {
            amountLabel.textContent = 'Total Amount (₹)';
            resultLabel.textContent = 'Base Amount (Excluding GST)';
        }
    });

    // Load saved data
    loadSavedData();

    // Calculate button
    calculateBtn.addEventListener('click', calculateGST);

    // Reset button
    resetBtn.addEventListener('click', resetCalculator);

    // Auto-calculate on input change
    [calculationTypeSelect, amountInput, gstRateSelect].forEach(input => {
        input.addEventListener('input', debounce(calculateGST, 300));
    });

    /**
     * Calculate GST
     */
    function calculateGST() {
        const calculationType = calculationTypeSelect.value;
        const amount = parseFloat(amountInput.value);
        const gstRate = parseFloat(gstRateSelect.value);

        // Validation
        if (!amount || amount <= 0) {
            resultContainer.style.display = 'none';
            return;
        }

        let baseAmount, gstAmount, totalAmount;

        if (calculationType === 'add') {
            // Add GST to base amount
            baseAmount = amount;
            gstAmount = (baseAmount * gstRate) / 100;
            totalAmount = baseAmount + gstAmount;
        } else {
            // Remove GST from total amount
            totalAmount = amount;
            baseAmount = totalAmount / (1 + gstRate / 100);
            gstAmount = totalAmount - baseAmount;
        }

        // Display results
        totalResult.textContent = formatCurrency(calculationType === 'add' ? totalAmount : baseAmount);

        let detailsHTML = `
            <p><strong>Base Amount:</strong> ${formatCurrency(baseAmount)}</p>
            <p><strong>GST Rate:</strong> ${formatPercentage(gstRate)}</p>
            <p><strong>GST Amount:</strong> ${formatCurrency(gstAmount)}</p>
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
        calculationTypeSelect.value = 'add';
        amountLabel.textContent = 'Base Amount (₹)';
        resultLabel.textContent = 'Total Amount (Including GST)';
        amountInput.value = '';
        gstRateSelect.value = '18';
        resultContainer.style.display = 'none';
        clearLocalStorage(STORAGE_KEY);
        showNotification('Calculator reset', 'success');
    }

    /**
     * Save data
     */
    function saveData() {
        const data = {
            calculationType: calculationTypeSelect.value,
            amount: amountInput.value,
            gstRate: gstRateSelect.value
        };
        saveToLocalStorage(STORAGE_KEY, data);
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved) {
            if (saved.calculationType) {
                calculationTypeSelect.value = saved.calculationType;
                calculationTypeSelect.dispatchEvent(new Event('change'));
            }
            if (saved.amount) amountInput.value = saved.amount;
            if (saved.gstRate) gstRateSelect.value = saved.gstRate;
            
            if (saved.amount) {
                setTimeout(calculateGST, 100);
            }
        }
    }
});

