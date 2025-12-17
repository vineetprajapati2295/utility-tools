/**
 * CGPA Calculator
 * Calculate CGPA and GPA from multiple subjects
 */

document.addEventListener('DOMContentLoaded', function() {
    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const cgpaResult = document.getElementById('cgpa-result');
    const resultDetails = document.getElementById('result-details');

    let subjectCount = 0;
    const STORAGE_KEY = 'cgpa_calculator_data';

    // Grade point mapping
    const gradePoints = {
        'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
    };

    // Load saved data
    loadSavedData();

    // Add subject button
    addSubjectBtn.addEventListener('click', addSubject);

    // Calculate button
    calculateBtn.addEventListener('click', calculateCGPA);

    // Reset button
    resetBtn.addEventListener('click', resetCalculator);

    /**
     * Add a new subject input row
     */
    function addSubject(subjectData = null) {
        subjectCount++;
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'grade-entry';
        subjectDiv.id = `subject-${subjectCount}`;

        const gradeOptions = Object.keys(gradePoints).map(grade => 
            `<option value="${grade}" ${subjectData && subjectData.grade === grade ? 'selected' : ''}>${grade}</option>`
        ).join('');

        subjectDiv.innerHTML = `
            <div class="grade-entry-header">
                <span class="grade-entry-title">Subject ${subjectCount}</span>
                <button type="button" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeSubject(${subjectCount})">Remove</button>
            </div>
            <div class="input-row">
                <div class="form-group">
                    <label class="form-label">Subject Name</label>
                    <input type="text" class="form-input subject-name" placeholder="e.g., Mathematics" value="${subjectData ? subjectData.name : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Grade</label>
                    <select class="form-select subject-grade">
                        ${gradeOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Credits</label>
                    <input type="number" class="form-input subject-credits" min="1" max="10" placeholder="e.g., 4" value="${subjectData ? subjectData.credits : ''}">
                </div>
            </div>
        `;

        subjectsContainer.appendChild(subjectDiv);
        saveData();
    }

    /**
     * Remove a subject
     */
    window.removeSubject = function(id) {
        const subjectDiv = document.getElementById(`subject-${id}`);
        if (subjectDiv) {
            subjectDiv.remove();
            saveData();
        }
    };

    /**
     * Calculate CGPA
     */
    function calculateCGPA() {
        const subjects = [];
        const subjectDivs = subjectsContainer.querySelectorAll('.grade-entry');

        if (subjectDivs.length === 0) {
            showNotification('Please add at least one subject', 'error');
            return;
        }

        let totalCredits = 0;
        let totalPoints = 0;
        let hasError = false;

        subjectDivs.forEach((div, index) => {
            const name = div.querySelector('.subject-name').value.trim();
            const grade = div.querySelector('.subject-grade').value;
            const credits = parseFloat(div.querySelector('.subject-credits').value);

            if (!name) {
                showNotification(`Subject ${index + 1}: Please enter subject name`, 'error');
                hasError = true;
                return;
            }

            if (!credits || credits <= 0) {
                showNotification(`Subject ${index + 1}: Please enter valid credits`, 'error');
                hasError = true;
                return;
            }

            const points = gradePoints[grade] * credits;
            totalCredits += credits;
            totalPoints += points;

            subjects.push({
                name,
                grade,
                credits,
                points
            });
        });

        if (hasError) return;

        if (totalCredits === 0) {
            showNotification('Total credits cannot be zero', 'error');
            return;
        }

        const cgpa = totalPoints / totalCredits;
        const gpa = cgpa; // CGPA and GPA are the same in this calculation

        // Display results
        cgpaResult.textContent = cgpa.toFixed(2);

        let detailsHTML = `
            <p><strong>Total Credits:</strong> ${totalCredits}</p>
            <p><strong>Total Grade Points:</strong> ${totalPoints.toFixed(2)}</p>
            <p><strong>GPA:</strong> ${gpa.toFixed(2)}</p>
            <hr style="margin: 1rem 0; border-color: var(--border-color);">
            <p><strong>Subject Details:</strong></p>
        `;

        subjects.forEach(subject => {
            detailsHTML += `
                <p style="margin: 0.5rem 0;">
                    ${subject.name}: ${subject.grade} (${subject.credits} credits) = ${subject.points.toFixed(2)} points
                </p>
            `;
        });

        resultDetails.innerHTML = detailsHTML;
        resultContainer.style.display = 'block';
        saveData();
    }

    /**
     * Reset calculator
     */
    function resetCalculator() {
        subjectsContainer.innerHTML = '';
        resultContainer.style.display = 'none';
        subjectCount = 0;
        clearLocalStorage(STORAGE_KEY);
        showNotification('Calculator reset', 'success');
    }

    /**
     * Save data to localStorage
     */
    function saveData() {
        const subjects = [];
        const subjectDivs = subjectsContainer.querySelectorAll('.grade-entry');

        subjectDivs.forEach(div => {
            const name = div.querySelector('.subject-name').value.trim();
            const grade = div.querySelector('.subject-grade').value;
            const credits = div.querySelector('.subject-credits').value;

            if (name && credits) {
                subjects.push({ name, grade, credits: parseFloat(credits) });
            }
        });

        saveToLocalStorage(STORAGE_KEY, { subjects, subjectCount });
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved && saved.subjects && saved.subjects.length > 0) {
            subjectCount = saved.subjectCount || 0;
            saved.subjects.forEach(subject => {
                addSubject(subject);
            });
        } else {
            // Add one default subject
            addSubject();
        }
    }

    // Auto-save on input change
    subjectsContainer.addEventListener('input', debounce(saveData, 500));
});

