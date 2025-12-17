/**
 * Image Compressor
 * Compress images using canvas API
 */

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('quality-value');
    const previewContainer = document.getElementById('preview-container');
    const originalPreview = document.getElementById('original-preview');
    const compressedPreview = document.getElementById('compressed-preview');
    const originalSize = document.getElementById('original-size');
    const originalDimensions = document.getElementById('original-dimensions');
    const compressedSize = document.getElementById('compressed-size');
    const sizeReduction = document.getElementById('size-reduction');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');

    let originalFile = null;
    let compressedBlob = null;

    // Quality slider update
    qualitySlider.addEventListener('input', function() {
        const value = Math.round(this.value * 100);
        qualityValue.textContent = value + '%';
        if (originalFile) {
            compressImage();
        }
    });

    // File input change
    imageInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });

    // Download button
    downloadBtn.addEventListener('click', downloadCompressedImage);

    // Reset button
    resetBtn.addEventListener('click', resetCompressor);

    /**
     * Handle file select
     */
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    /**
     * Handle file
     */
    function handleFile(file) {
        // Validate file type
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            showNotification('Please select a valid image file (JPEG, PNG, or WebP)', 'error');
            return;
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            showNotification('File size must be less than 10MB', 'error');
            return;
        }

        originalFile = file;
        originalSize.textContent = formatFileSize(file.size);

        // Load and display original image
        const reader = new FileReader();
        reader.onload = function(e) {
            originalPreview.src = e.target.result;
            originalPreview.onload = function() {
                originalDimensions.textContent = `${this.naturalWidth} x ${this.naturalHeight}`;
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    /**
     * Compress image
     */
    function compressImage() {
        if (!originalFile) return;

        const quality = parseFloat(qualitySlider.value);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            // Draw image on canvas
            ctx.drawImage(this, 0, 0);

            // Convert to blob
            canvas.toBlob(function(blob) {
                if (!blob) {
                    showNotification('Failed to compress image', 'error');
                    return;
                }

                compressedBlob = blob;
                compressedSize.textContent = formatFileSize(blob.size);

                // Calculate size reduction
                const reduction = ((originalFile.size - blob.size) / originalFile.size) * 100;
                sizeReduction.textContent = formatPercentage(reduction);

                // Display compressed image
                const url = URL.createObjectURL(blob);
                compressedPreview.src = url;
                previewContainer.style.display = 'block';

                // Clean up old URL
                compressedPreview.onload = function() {
                    URL.revokeObjectURL(url);
                };
            }, originalFile.type, quality);
        };

        img.src = originalPreview.src;
    }

    /**
     * Download compressed image
     */
    function downloadCompressedImage() {
        if (!compressedBlob) {
            showNotification('No compressed image available', 'error');
            return;
        }

        const url = URL.createObjectURL(compressedBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'compressed_' + originalFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showNotification('Image downloaded successfully', 'success');
    }

    /**
     * Reset compressor
     */
    function resetCompressor() {
        originalFile = null;
        compressedBlob = null;
        imageInput.value = '';
        originalPreview.src = '';
        compressedPreview.src = '';
        previewContainer.style.display = 'none';
        qualitySlider.value = 0.8;
        qualityValue.textContent = '80%';
        showNotification('Compressor reset', 'success');
    }
});

