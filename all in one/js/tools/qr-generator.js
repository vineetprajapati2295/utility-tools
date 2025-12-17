/**
 * QR Code Generator
 * Generate QR codes for text, URLs, and other data
 */

document.addEventListener('DOMContentLoaded', function() {
    const qrTypeSelect = document.getElementById('qr-type');
    const textInputGroup = document.getElementById('text-input-group');
    const wifiInputGroup = document.getElementById('wifi-input-group');
    const qrContentInput = document.getElementById('qr-content');
    const wifiSSIDInput = document.getElementById('wifi-ssid');
    const wifiPasswordInput = document.getElementById('wifi-password');
    const wifiSecuritySelect = document.getElementById('wifi-security');
    const sizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultContainer = document.getElementById('result-container');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    const downloadBtn = document.getElementById('download-btn');

    let currentQRCodeDataURL = null;

    // QR type change
    qrTypeSelect.addEventListener('change', function() {
        if (this.value === 'wifi') {
            textInputGroup.style.display = 'none';
            wifiInputGroup.style.display = 'block';
        } else {
            textInputGroup.style.display = 'block';
            wifiInputGroup.style.display = 'none';
        }
    });

    // Size slider update
    sizeSlider.addEventListener('input', function() {
        sizeValue.textContent = this.value + 'px';
        if (currentQRCodeDataURL) {
            generateQRCode();
        }
    });

    // Generate button
    generateBtn.addEventListener('click', generateQRCode);

    // Reset button
    resetBtn.addEventListener('click', resetGenerator);

    // Download button
    downloadBtn.addEventListener('click', downloadQRCode);

    /**
     * Generate QR code
     */
    function generateQRCode() {
        const qrType = qrTypeSelect.value;
        const size = parseInt(sizeSlider.value);
        let content = '';

        // Get content based on type
        if (qrType === 'wifi') {
            const ssid = wifiSSIDInput.value.trim();
            const password = wifiPasswordInput.value.trim();
            const security = wifiSecuritySelect.value;

            if (!ssid) {
                showNotification('Please enter WiFi SSID', 'error');
                return;
            }

            // WiFi QR code format: WIFI:T:WPA;S:SSID;P:Password;;
            content = `WIFI:T:${security};S:${ssid};P:${password};;`;
        } else {
            content = qrContentInput.value.trim();

            if (!content) {
                showNotification('Please enter content', 'error');
                return;
            }

            // Format content based on type
            switch (qrType) {
                case 'url':
                    if (!content.startsWith('http://') && !content.startsWith('https://')) {
                        content = 'https://' + content;
                    }
                    break;
                case 'email':
                    if (!content.includes('@')) {
                        showNotification('Please enter a valid email address', 'error');
                        return;
                    }
                    content = `mailto:${content}`;
                    break;
                case 'phone':
                    content = `tel:${content}`;
                    break;
            }
        }

        // Generate QR code
        QRCode.toCanvas(qrCodeDisplay, content, {
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, function(error) {
            if (error) {
                showNotification('Failed to generate QR code', 'error');
                console.error(error);
                return;
            }

            // Get data URL for download
            currentQRCodeDataURL = qrCodeDisplay.toDataURL('image/png');
            resultContainer.style.display = 'block';
        });
    }

    /**
     * Download QR code
     */
    function downloadQRCode() {
        if (!currentQRCodeDataURL) {
            showNotification('No QR code to download', 'error');
            return;
        }

        const link = document.createElement('a');
        link.href = currentQRCodeDataURL;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('QR code downloaded successfully', 'success');
    }

    /**
     * Reset generator
     */
    function resetGenerator() {
        qrTypeSelect.value = 'text';
        qrContentInput.value = '';
        wifiSSIDInput.value = '';
        wifiPasswordInput.value = '';
        wifiSecuritySelect.value = 'WPA';
        sizeSlider.value = 400;
        sizeValue.textContent = '400px';
        textInputGroup.style.display = 'block';
        wifiInputGroup.style.display = 'none';
        resultContainer.style.display = 'none';
        currentQRCodeDataURL = null;
        qrCodeDisplay.innerHTML = '';
        showNotification('Generator reset', 'success');
    }
});

