/**
 * Attendance Calculator
 * Calculate attendance percentage and required classes
 */

document.addEventListener('DOMContentLoaded', function() {
    const totalClassesInput = document.getElementById('total-classes');
    const attendedClassesInput = document.getElementById('attended-classes');
    const requiredPercentageInput = document.getElementById('required-percentage');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const attendanceResult = document.getElementById('attendance-result');
    const resultDetails = document.getElementById('result-details');

    const STORAGE_KEY = 'attendance_calculator_data';

    // Load saved data
    loadSavedData();

    // Calculate button
    calculateBtn.addEventListener('click', calculateAttendance);

    // Reset button
    resetBtn.addEventListener('click', resetCalculator);

    // Auto-calculate on input change
    [totalClassesInput, attendedClassesInput, requiredPercentageInput].forEach(input => {
        input.addEventListener('input', debounce(calculateAttendance, 300));
    });

    /**
     * Calculate attendance
     */
    function calculateAttendance() {
        const totalClasses = parseFloat(totalClassesInput.value);
        const attendedClasses = parseFloat(attendedClassesInput.value);
        const requiredPercentage = parseFloat(requiredPercentageInput.value) || null;

        // Validation
        if (!totalClasses || totalClasses <= 0) {
            resultContainer.style.display = 'none';
            return;
        }

        if (attendedClasses < 0 || attendedClasses > totalClasses) {
            showNotification('Attended classes cannot be greater than total classes', 'error');
            resultContainer.style.display = 'none';
            return;
        }

        // Calculate current attendance
        const currentPercentage = (attendedClasses / totalClasses) * 100;
        attendanceResult.textContent = formatPercentage(currentPercentage);

        let detailsHTML = `
            <p><strong>Total Classes:</strong> ${totalClasses}</p>
            <p><strong>Classes Attended:</strong> ${attendedClasses}</p>
            <p><strong>Classes Absent:</strong> ${totalClasses - attendedClasses}</p>
            <p><strong>Current Attendance:</strong> ${formatPercentage(currentPercentage)}</p>
        `;

        // Calculate required classes if percentage is provided
        if (requiredPercentage !== null && requiredPercentage > 0 && requiredPercentage <= 100) {
            const requiredClasses = Math.ceil((requiredPercentage / 100) * totalClasses);
            const classesNeeded = Math.max(0, requiredClasses - attendedClasses);
            const remainingClasses = totalClasses - attendedClasses;

            detailsHTML += `<hr style="margin: 1rem 0; border-color: var(--border-color);">`;
            detailsHTML += `<p><strong>Required Percentage:</strong> ${formatPercentage(requiredPercentage)}</p>`;
            detailsHTML += `<p><strong>Required Classes:</strong> ${requiredClasses} out of ${totalClasses}</p>`;

            if (classesNeeded === 0) {
                detailsHTML += `<p style="color: #2ed573;"><strong>✓ You have met the required attendance!</strong></p>`;
            } else if (classesNeeded <= remainingClasses) {
                detailsHTML += `<p style="color: var(--accent-primary);"><strong>You need to attend ${classesNeeded} more class${classesNeeded > 1 ? 'es' : ''} to meet the requirement.</strong></p>`;
            } else {
                detailsHTML += `<p style="color: #e74c3c;"><strong>⚠ You cannot achieve ${formatPercentage(requiredPercentage)} attendance. Maximum possible: ${formatPercentage((attendedClasses + remainingClasses) / totalClasses * 100)}</strong></p>`;
            }
        }

        resultDetails.innerHTML = detailsHTML;
        resultContainer.style.display = 'block';
        saveData();
    }

    /**
     * Reset calculator
     */
    function resetCalculator() {
        totalClassesInput.value = '';
        attendedClassesInput.value = '';
        requiredPercentageInput.value = '';
        resultContainer.style.display = 'none';
        clearLocalStorage(STORAGE_KEY);
        showNotification('Calculator reset', 'success');
    }

    /**
     * Save data to localStorage
     */
    function saveData() {
        const data = {
            totalClasses: totalClassesInput.value,
            attendedClasses: attendedClassesInput.value,
            requiredPercentage: requiredPercentageInput.value
        };
        saveToLocalStorage(STORAGE_KEY, data);
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved) {
            if (saved.totalClasses) totalClassesInput.value = saved.totalClasses;
            if (saved.attendedClasses) attendedClassesInput.value = saved.attendedClasses;
            if (saved.requiredPercentage) requiredPercentageInput.value = saved.requiredPercentage;
            
            // Calculate if all required fields are present
            if (saved.totalClasses && saved.attendedClasses) {
                setTimeout(calculateAttendance, 100);
            }
        }
    }
});

