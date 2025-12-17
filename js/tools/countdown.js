/**
 * Exam Countdown Timer
 * Countdown timer for exams
 */

document.addEventListener('DOMContentLoaded', function() {
    const examNameInput = document.getElementById('exam-name');
    const examDateInput = document.getElementById('exam-date');
    const examTimeInput = document.getElementById('exam-time');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const countdownContainer = document.getElementById('countdown-container');
    const examTitle = document.getElementById('exam-title');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    const STORAGE_KEY = 'exam_countdown_data';
    let countdownInterval = null;

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    examDateInput.setAttribute('min', today);

    // Load saved data
    loadSavedData();

    // Start button
    startBtn.addEventListener('click', startCountdown);

    // Reset button
    resetBtn.addEventListener('click', resetCountdown);

    /**
     * Start countdown
     */
    function startCountdown() {
        const examName = examNameInput.value.trim() || 'Your Exam';
        const examDate = examDateInput.value;
        const examTime = examTimeInput.value;

        if (!examDate) {
            showNotification('Please select an exam date', 'error');
            return;
        }

        if (!examTime) {
            showNotification('Please select an exam time', 'error');
            return;
        }

        // Clear existing interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // Set exam title
        examTitle.textContent = examName;
        countdownContainer.style.display = 'block';

        // Calculate target date
        const targetDateTime = new Date(`${examDate}T${examTime}`);
        const now = new Date();

        if (targetDateTime <= now) {
            showNotification('Exam date and time must be in the future', 'error');
            countdownContainer.style.display = 'none';
            return;
        }

        // Update countdown immediately
        updateCountdown(targetDateTime);

        // Update countdown every second
        countdownInterval = setInterval(() => {
            updateCountdown(targetDateTime);
        }, 1000);

        saveData();
    }

    /**
     * Update countdown display
     */
    function updateCountdown(targetDate) {
        const now = new Date();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Countdown finished
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minutesEl.textContent = '0';
            secondsEl.textContent = '0';
            
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }

            examTitle.textContent = 'Exam Time!';
            showNotification('Exam time has arrived!', 'info');
            return;
        }

        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update display
        daysEl.textContent = days;
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    /**
     * Reset countdown
     */
    function resetCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        examNameInput.value = '';
        examDateInput.value = '';
        examTimeInput.value = '';
        countdownContainer.style.display = 'none';
        clearLocalStorage(STORAGE_KEY);
        showNotification('Countdown reset', 'success');
    }

    /**
     * Save data to localStorage
     */
    function saveData() {
        const data = {
            examName: examNameInput.value,
            examDate: examDateInput.value,
            examTime: examTimeInput.value
        };
        saveToLocalStorage(STORAGE_KEY, data);
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved) {
            if (saved.examName) examNameInput.value = saved.examName;
            if (saved.examDate) examDateInput.value = saved.examDate;
            if (saved.examTime) examTimeInput.value = saved.examTime;

            // Auto-start if all fields are filled
            if (saved.examDate && saved.examTime) {
                setTimeout(startCountdown, 500);
            }
        }
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });
});

