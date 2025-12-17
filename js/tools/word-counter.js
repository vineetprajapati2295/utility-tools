/**
 * Word Counter
 * Count words, characters, sentences, and paragraphs
 */

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const charNoSpacesEl = document.getElementById('char-no-spaces');
    const sentenceCountEl = document.getElementById('sentence-count');
    const paragraphCountEl = document.getElementById('paragraph-count');
    const readingTimeEl = document.getElementById('reading-time');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    const STORAGE_KEY = 'word_counter_data';
    const READING_SPEED = 200; // words per minute

    // Load saved data
    loadSavedData();

    // Count on input
    textInput.addEventListener('input', debounce(countText, 100));

    // Clear button
    clearBtn.addEventListener('click', clearText);

    // Copy button
    copyBtn.addEventListener('click', copyText);

    /**
     * Count text statistics
     */
    function countText() {
        const text = textInput.value;
        
        // Word count (split by whitespace and filter empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = text.trim() === '' ? 0 : words.length;

        // Character count (with spaces)
        const charCount = text.length;

        // Character count (without spaces)
        const charNoSpaces = text.replace(/\s/g, '').length;

        // Sentence count (split by sentence-ending punctuation)
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;

        // Paragraph count (split by double newlines or single newline if text is short)
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const paragraphCount = paragraphs.length || (text.trim() ? 1 : 0);

        // Reading time (average reading speed: 200 words per minute)
        const readingTime = wordCount > 0 ? Math.ceil(wordCount / READING_SPEED) : 0;

        // Update display
        wordCountEl.textContent = formatNumber(wordCount);
        charCountEl.textContent = formatNumber(charCount);
        charNoSpacesEl.textContent = formatNumber(charNoSpaces);
        sentenceCountEl.textContent = formatNumber(sentenceCount);
        paragraphCountEl.textContent = formatNumber(paragraphCount);
        readingTimeEl.textContent = readingTime;

        // Save data
        saveData();
    }

    /**
     * Clear text
     */
    function clearText() {
        textInput.value = '';
        countText();
        clearLocalStorage(STORAGE_KEY);
        showNotification('Text cleared', 'success');
    }

    /**
     * Copy text
     */
    async function copyText() {
        const text = textInput.value;
        if (!text.trim()) {
            showNotification('No text to copy', 'error');
            return;
        }

        const success = await copyToClipboard(text);
        if (success) {
            showNotification('Text copied to clipboard', 'success');
        } else {
            showNotification('Failed to copy text', 'error');
        }
    }

    /**
     * Save data to localStorage
     */
    function saveData() {
        saveToLocalStorage(STORAGE_KEY, { text: textInput.value });
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved && saved.text) {
            textInput.value = saved.text;
            countText();
        }
    }
});

