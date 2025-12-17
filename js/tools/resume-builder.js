/**
 * Resume Builder
 * Create and download professional resumes
 */

document.addEventListener('DOMContentLoaded', function() {
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const locationInput = document.getElementById('location');
    const linkedinInput = document.getElementById('linkedin');
    const websiteInput = document.getElementById('website');
    const summaryInput = document.getElementById('summary');
    const skillsInput = document.getElementById('skills');
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    const addExperienceBtn = document.getElementById('add-experience-btn');
    const addEducationBtn = document.getElementById('add-education-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const previewContainer = document.getElementById('preview-container');
    const resumePreview = document.getElementById('resume-preview');
    const downloadBtn = document.getElementById('download-btn');
    const printBtn = document.getElementById('print-btn');

    let experienceCount = 0;
    let educationCount = 0;
    const STORAGE_KEY = 'resume_builder_data';

    // Load saved data
    loadSavedData();

    // Add experience button
    addExperienceBtn.addEventListener('click', addExperience);

    // Add education button
    addEducationBtn.addEventListener('click', addEducation);

    // Generate button
    generateBtn.addEventListener('click', generateResume);

    // Reset button
    resetBtn.addEventListener('click', resetBuilder);

    // Download button
    downloadBtn.addEventListener('click', downloadResume);

    // Print button
    printBtn.addEventListener('click', printResume);

    // Auto-save on input
    document.addEventListener('input', debounce(saveData, 1000));

    /**
     * Add experience entry
     */
    function addExperience(expData = null) {
        experienceCount++;
        const expDiv = document.createElement('div');
        expDiv.className = 'resume-section';
        expDiv.id = `experience-${experienceCount}`;

        expDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="color: var(--accent-primary); font-size: 1rem;">Experience ${experienceCount}</h3>
                <button type="button" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeExperience(${experienceCount})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Job Title</label>
                <input type="text" class="form-input exp-title" placeholder="e.g., Software Engineer" value="${expData ? expData.title : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Company</label>
                <input type="text" class="form-input exp-company" placeholder="e.g., Tech Company Inc." value="${expData ? expData.company : ''}">
            </div>
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="month" class="form-input exp-start" value="${expData ? expData.start : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="month" class="form-input exp-end" placeholder="Present" value="${expData ? expData.end : ''}">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea exp-description" rows="3" placeholder="Describe your responsibilities and achievements...">${expData ? expData.description : ''}</textarea>
            </div>
        `;

        experienceContainer.appendChild(expDiv);
    }

    /**
     * Add education entry
     */
    function addEducation(eduData = null) {
        educationCount++;
        const eduDiv = document.createElement('div');
        eduDiv.className = 'resume-section';
        eduDiv.id = `education-${educationCount}`;

        eduDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h3 style="color: var(--accent-primary); font-size: 1rem;">Education ${educationCount}</h3>
                <button type="button" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeEducation(${educationCount})">Remove</button>
            </div>
            <div class="form-group">
                <label class="form-label">Degree</label>
                <input type="text" class="form-input edu-degree" placeholder="e.g., Bachelor of Science" value="${eduData ? eduData.degree : ''}">
            </div>
            <div class="form-group">
                <label class="form-label">Institution</label>
                <input type="text" class="form-input edu-institution" placeholder="e.g., University Name" value="${eduData ? eduData.institution : ''}">
            </div>
            <div class="grid grid-2">
                <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="month" class="form-input edu-start" value="${eduData ? eduData.start : ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="month" class="form-input edu-end" value="${eduData ? eduData.end : ''}">
                </div>
            </div>
        `;

        educationContainer.appendChild(eduDiv);
    }

    /**
     * Remove experience
     */
    window.removeExperience = function(id) {
        const expDiv = document.getElementById(`experience-${id}`);
        if (expDiv) {
            expDiv.remove();
            saveData();
        }
    };

    /**
     * Remove education
     */
    window.removeEducation = function(id) {
        const eduDiv = document.getElementById(`education-${id}`);
        if (eduDiv) {
            eduDiv.remove();
            saveData();
        }
    };

    /**
     * Generate resume
     */
    function generateResume() {
        // Get personal information
        const personalInfo = {
            name: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            location: locationInput.value.trim(),
            linkedin: linkedinInput.value.trim(),
            website: websiteInput.value.trim(),
            summary: summaryInput.value.trim(),
            skills: skillsInput.value.split(',').map(s => s.trim()).filter(s => s)
        };

        // Get experiences
        const experiences = [];
        const expDivs = experienceContainer.querySelectorAll('.resume-section');
        expDivs.forEach(div => {
            const title = div.querySelector('.exp-title').value.trim();
            const company = div.querySelector('.exp-company').value.trim();
            const start = div.querySelector('.exp-start').value;
            const end = div.querySelector('.exp-end').value;
            const description = div.querySelector('.exp-description').value.trim();

            if (title || company) {
                experiences.push({ title, company, start, end, description });
            }
        });

        // Get education
        const educations = [];
        const eduDivs = educationContainer.querySelectorAll('.resume-section');
        eduDivs.forEach(div => {
            const degree = div.querySelector('.edu-degree').value.trim();
            const institution = div.querySelector('.edu-institution').value.trim();
            const start = div.querySelector('.edu-start').value;
            const end = div.querySelector('.edu-end').value;

            if (degree || institution) {
                educations.push({ degree, institution, start, end });
            }
        });

        // Generate HTML
        let html = `
            <div style="max-width: 800px; margin: 0 auto; padding: 2rem; font-family: Arial, sans-serif; line-height: 1.6;">
                <header style="border-bottom: 3px solid #000; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                    <h1 style="font-size: 2rem; margin-bottom: 0.5rem; color: #000;">${personalInfo.name || 'Your Name'}</h1>
                    <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9rem; color: #333;">
                        ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
                        ${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ''}
                        ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
                        ${personalInfo.linkedin ? `<span>🔗 <a href="${personalInfo.linkedin}" style="color: #0066cc;">LinkedIn</a></span>` : ''}
                        ${personalInfo.website ? `<span>🌐 <a href="${personalInfo.website}" style="color: #0066cc;">Website</a></span>` : ''}
                    </div>
                </header>

                ${personalInfo.summary ? `
                    <section style="margin-bottom: 1.5rem;">
                        <h2 style="font-size: 1.3rem; border-bottom: 2px solid #000; padding-bottom: 0.3rem; margin-bottom: 0.8rem; color: #000;">Professional Summary</h2>
                        <p style="color: #555; text-align: justify;">${personalInfo.summary}</p>
                    </section>
                ` : ''}

                ${experiences.length > 0 ? `
                    <section style="margin-bottom: 1.5rem;">
                        <h2 style="font-size: 1.3rem; border-bottom: 2px solid #000; padding-bottom: 0.3rem; margin-bottom: 0.8rem; color: #000;">Work Experience</h2>
                        ${experiences.map(exp => `
                            <div style="margin-bottom: 1rem;">
                                <h3 style="font-size: 1.1rem; color: #000; margin-bottom: 0.3rem;">${exp.title || 'Position'}</h3>
                                <p style="font-weight: 600; color: #333; margin-bottom: 0.3rem;">${exp.company || 'Company'}</p>
                                <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">
                                    ${exp.start ? formatMonthYear(exp.start) : ''} - ${exp.end ? formatMonthYear(exp.end) : 'Present'}
                                </p>
                                ${exp.description ? `<p style="color: #555; white-space: pre-line;">${exp.description}</p>` : ''}
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${educations.length > 0 ? `
                    <section style="margin-bottom: 1.5rem;">
                        <h2 style="font-size: 1.3rem; border-bottom: 2px solid #000; padding-bottom: 0.3rem; margin-bottom: 0.8rem; color: #000;">Education</h2>
                        ${educations.map(edu => `
                            <div style="margin-bottom: 1rem;">
                                <h3 style="font-size: 1.1rem; color: #000; margin-bottom: 0.3rem;">${edu.degree || 'Degree'}</h3>
                                <p style="font-weight: 600; color: #333; margin-bottom: 0.3rem;">${edu.institution || 'Institution'}</p>
                                <p style="font-size: 0.9rem; color: #666;">
                                    ${edu.start ? formatMonthYear(edu.start) : ''} - ${edu.end ? formatMonthYear(edu.end) : 'Present'}
                                </p>
                            </div>
                        `).join('')}
                    </section>
                ` : ''}

                ${personalInfo.skills.length > 0 ? `
                    <section>
                        <h2 style="font-size: 1.3rem; border-bottom: 2px solid #000; padding-bottom: 0.3rem; margin-bottom: 0.8rem; color: #000;">Skills</h2>
                        <p style="color: #555;">${personalInfo.skills.join(', ')}</p>
                    </section>
                ` : ''}
            </div>
        `;

        resumePreview.innerHTML = html;
        previewContainer.style.display = 'block';
        saveData();
    }

    /**
     * Format month-year
     */
    function formatMonthYear(dateString) {
        if (!dateString) return '';
        const [year, month] = dateString.split('-');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    /**
     * Download resume as PDF
     */
    function downloadResume() {
        if (!resumePreview.innerHTML) {
            showNotification('Please generate resume first', 'error');
            return;
        }

        const opt = {
            margin: 1,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(resumePreview).save();
        showNotification('Resume downloaded successfully', 'success');
    }

    /**
     * Print resume
     */
    function printResume() {
        if (!resumePreview.innerHTML) {
            showNotification('Please generate resume first', 'error');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Resume</title>
                    <style>
                        body { margin: 0; padding: 20px; }
                        @media print {
                            body { padding: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${resumePreview.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    /**
     * Reset builder
     */
    function resetBuilder() {
        fullNameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        locationInput.value = '';
        linkedinInput.value = '';
        websiteInput.value = '';
        summaryInput.value = '';
        skillsInput.value = '';
        experienceContainer.innerHTML = '';
        educationContainer.innerHTML = '';
        previewContainer.style.display = 'none';
        experienceCount = 0;
        educationCount = 0;
        clearLocalStorage(STORAGE_KEY);
        showNotification('Resume builder reset', 'success');
    }

    /**
     * Save data
     */
    function saveData() {
        const data = {
            personal: {
                name: fullNameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                location: locationInput.value,
                linkedin: linkedinInput.value,
                website: websiteInput.value,
                summary: summaryInput.value,
                skills: skillsInput.value
            },
            experiences: [],
            educations: [],
            experienceCount,
            educationCount
        };

        const expDivs = experienceContainer.querySelectorAll('.resume-section');
        expDivs.forEach(div => {
            data.experiences.push({
                title: div.querySelector('.exp-title').value,
                company: div.querySelector('.exp-company').value,
                start: div.querySelector('.exp-start').value,
                end: div.querySelector('.exp-end').value,
                description: div.querySelector('.exp-description').value
            });
        });

        const eduDivs = educationContainer.querySelectorAll('.resume-section');
        eduDivs.forEach(div => {
            data.educations.push({
                degree: div.querySelector('.edu-degree').value,
                institution: div.querySelector('.edu-institution').value,
                start: div.querySelector('.edu-start').value,
                end: div.querySelector('.edu-end').value
            });
        });

        saveToLocalStorage(STORAGE_KEY, data);
    }

    /**
     * Load saved data
     */
    function loadSavedData() {
        const saved = getFromLocalStorage(STORAGE_KEY);
        if (saved) {
            if (saved.personal) {
                if (saved.personal.name) fullNameInput.value = saved.personal.name;
                if (saved.personal.email) emailInput.value = saved.personal.email;
                if (saved.personal.phone) phoneInput.value = saved.personal.phone;
                if (saved.personal.location) locationInput.value = saved.personal.location;
                if (saved.personal.linkedin) linkedinInput.value = saved.personal.linkedin;
                if (saved.personal.website) websiteInput.value = saved.personal.website;
                if (saved.personal.summary) summaryInput.value = saved.personal.summary;
                if (saved.personal.skills) skillsInput.value = saved.personal.skills;
            }

            experienceCount = saved.experienceCount || 0;
            educationCount = saved.educationCount || 0;

            if (saved.experiences) {
                saved.experiences.forEach(exp => addExperience(exp));
            }

            if (saved.educations) {
                saved.educations.forEach(edu => addEducation(edu));
            }
        } else {
            // Add default entries
            addExperience();
            addEducation();
        }
    }
});

