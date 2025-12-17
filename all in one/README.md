# All-in-One Utility Website

A comprehensive collection of free, online utility tools for students, creators, and professionals. Built with pure HTML, CSS, and JavaScript - no frameworks, no dependencies (except CDN libraries for specific features).

## Features

- **Static-first**: Works without a backend server
- **No Login Required**: All tools work without registration
- **Free & Open Source**: Uses only free and open-source resources
- **SEO Optimized**: Proper meta tags and sitemap
- **AdSense Ready**: Non-intrusive ad placements
- **Mobile Responsive**: Works perfectly on all devices
- **Dark Theme**: Modern dark tech theme with subtle neon accents

## Tools Included

### Student Tools
- **CGPA Calculator**: Calculate CGPA and GPA from multiple subjects
- **Attendance Calculator**: Track attendance percentage and required classes
- **Exam Countdown**: Live countdown timer for exams

### PDF Tools
- **PDF Merger**: Merge multiple PDF files into one
- **PDF Compressor**: Compress PDF file size

### Image Tools
- **Image Compressor**: Compress images without significant quality loss
- **Image Resizer**: Resize images to any dimension

### Text Tools
- **Word Counter**: Count words, characters, sentences, and paragraphs
- **Password Generator**: Generate secure passwords with customizable options
- **QR Code Generator**: Create QR codes for text, URLs, emails, and WiFi

### Finance Tools
- **EMI Calculator**: Calculate loan EMI, interest, and total amount
- **GST Calculator**: Calculate GST amount and total price

### Resume Tools
- **Resume Builder**: Create professional resumes and download as PDF

## Project Structure

```
/
├── index.html                 # Homepage
├── privacy.html              # Privacy Policy
├── terms.html                # Terms of Service
├── sitemap.xml               # SEO Sitemap
├── css/
│   ├── main.css             # Main styles
│   ├── components.css       # Reusable components
│   └── tool.css             # Tool-specific styles
├── js/
│   ├── main.js              # Common functionality
│   ├── utils.js             # Utility functions
│   └── tools/
│       ├── cgpa.js          # CGPA calculator logic
│       ├── attendance.js     # Attendance calculator logic
│       ├── countdown.js     # Countdown timer logic
│       ├── image.js         # Image compressor logic
│       ├── word-counter.js  # Word counter logic
│       ├── password-generator.js  # Password generator logic
│       ├── qr-generator.js  # QR code generator logic
│       ├── finance.js       # EMI calculator logic
│       ├── gst.js           # GST calculator logic
│       └── resume-builder.js  # Resume builder logic
└── tools/
    ├── student/             # Student tools
    ├── pdf/                 # PDF tools
    ├── image/               # Image tools
    ├── text/                # Text tools
    ├── finance/             # Finance tools
    └── resume/              # Resume tools
```

## Getting Started

1. **Clone or Download** this repository
2. **Open** `index.html` in your web browser
3. **That's it!** No build process, no npm install, no server required

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## External Dependencies (CDN)

- **QRCode.js**: For QR code generation (`tools/text/qr-generator.html`)
- **PDF-lib**: For PDF manipulation (`tools/pdf/`)
- **html2pdf.js**: For PDF generation from HTML (`tools/resume/resume-builder.html`)

## Features & Functionality

### Local Storage
All tools save user input to browser localStorage for convenience. Data never leaves the user's device.

### Responsive Design
Mobile-first design that works seamlessly on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

### SEO Optimization
- Proper meta tags on all pages
- Semantic HTML structure
- Sitemap.xml for search engines
- Accessible labels and ARIA attributes

### AdSense Integration
- Maximum 3 ads per page
- Non-intrusive placements:
  - 1 banner below tool title
  - 1 ad after result section
  - 1 footer ad
- Easy to remove/replace with actual AdSense code

## Customization

### Changing Colors
Edit CSS variables in `css/main.css`:
```css
:root {
    --accent-primary: #4a9eff;
    --accent-secondary: #7b68ee;
    /* ... */
}
```

### Adding New Tools
1. Create HTML file in appropriate `tools/` subdirectory
2. Create corresponding JS file in `js/tools/`
3. Add link to `index.html`
4. Update `sitemap.xml`

### Replacing AdSense Placeholders
Replace `.ad-placeholder` divs with actual AdSense code:
```html
<div class="ad-container ad-banner">
    <!-- Your AdSense code here -->
</div>
```

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Please ensure:
- Code follows existing style
- No external dependencies (except CDN)
- Mobile responsive
- Works without backend

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using pure HTML, CSS, and JavaScript

