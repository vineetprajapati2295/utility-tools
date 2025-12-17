/**
 * Password Generator
 * Generate secure passwords with customizable options
 */

document.addEventListener('DOMContentLoaded', function() {
    const lengthSlider = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const generatedPassword = document.getElementById('generated-password');
    const copyPasswordBtn = document.getElementById('copy-password-btn');
    const passwordStrength = document.getElementById('password-strength');

    // Character sets
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length display
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generate button
    generateBtn.addEventListener('click', generatePassword);

    // Reset button
    resetBtn.addEventListener('click', resetGenerator);

    // Copy button
    copyPasswordBtn.addEventListener('click', copyPassword);

    /**
     * Generate password
     */
    function generatePassword() {
        // Check if at least one character set is selected
        if (!includeUppercase.checked && !includeLowercase.checked && 
            !includeNumbers.checked && !includeSymbols.checked) {
            showNotification('Please select at least one character type', 'error');
            return;
        }

        // Build character set
        let charset = '';
        if (includeUppercase.checked) charset += uppercase;
        if (includeLowercase.checked) charset += lowercase;
        if (includeNumbers.checked) charset += numbers;
        if (includeSymbols.checked) charset += symbols;

        // Generate password
        const length = parseInt(lengthSlider.value);
        let password = '';

        // Ensure at least one character from each selected type
        if (includeUppercase.checked) {
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
        }
        if (includeLowercase.checked) {
            password += lowercase[Math.floor(Math.random() * lowercase.length)];
        }
        if (includeNumbers.checked) {
            password += numbers[Math.floor(Math.random() * numbers.length)];
        }
        if (includeSymbols.checked) {
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle password
        password = shuffleString(password);

        // Display password
        generatedPassword.value = password;
        resultContainer.style.display = 'block';

        // Calculate and display strength
        const strength = calculatePasswordStrength(password);
        displayPasswordStrength(strength);
    }

    /**
     * Shuffle string
     */
    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    /**
     * Calculate password strength
     */
    function calculatePasswordStrength(password) {
        let strength = 0;
        const length = password.length;

        // Length score
        if (length >= 12) strength += 2;
        else if (length >= 8) strength += 1;

        // Character variety score
        let variety = 0;
        if (/[a-z]/.test(password)) variety++;
        if (/[A-Z]/.test(password)) variety++;
        if (/[0-9]/.test(password)) variety++;
        if (/[^a-zA-Z0-9]/.test(password)) variety++;

        strength += variety - 1;

        // Determine strength level
        if (strength >= 5) return { level: 'Very Strong', color: '#2ed573', percentage: 100 };
        if (strength >= 4) return { level: 'Strong', color: '#4a9eff', percentage: 80 };
        if (strength >= 3) return { level: 'Moderate', color: '#ffc107', percentage: 60 };
        if (strength >= 2) return { level: 'Weak', color: '#ff9800', percentage: 40 };
        return { level: 'Very Weak', color: '#e74c3c', percentage: 20 };
    }

    /**
     * Display password strength
     */
    function displayPasswordStrength(strength) {
        passwordStrength.innerHTML = `
            <p><strong>Password Strength:</strong> <span style="color: ${strength.color};">${strength.level}</span></p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${strength.percentage}%; background: ${strength.color};"></div>
            </div>
        `;
    }

    /**
     * Copy password
     */
    async function copyPassword() {
        const password = generatedPassword.value;
        if (!password) {
            showNotification('No password to copy', 'error');
            return;
        }

        const success = await copyToClipboard(password);
        if (success) {
            showNotification('Password copied to clipboard', 'success');
        } else {
            showNotification('Failed to copy password', 'error');
        }
    }

    /**
     * Reset generator
     */
    function resetGenerator() {
        lengthSlider.value = 16;
        lengthValue.textContent = '16';
        includeUppercase.checked = true;
        includeLowercase.checked = true;
        includeNumbers.checked = true;
        includeSymbols.checked = true;
        generatedPassword.value = '';
        resultContainer.style.display = 'none';
        showNotification('Generator reset', 'success');
    }

    // Generate password on page load
    generatePassword();
});

