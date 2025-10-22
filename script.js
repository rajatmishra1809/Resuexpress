/**
 * script.js
 * Contains the core application logic for Resuexpress:
 * - State management (resumeData) and persistence via localStorage
 * - Navigation and step display
 * - Dynamic form manipulation (Add/Remove items)
 * - Input binding and auto-saving
 * - Live resume preview rendering via window.resumeTemplates (from templates.js)
 */

let resumeData = {
    currentStep: 1,
    selectedTemplate: 'template1',
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
    experience: [{}],
    education: [{}],
    skills: '',
    projects: [{}],
};

const STORAGE_KEY = 'resuexpressData';
const STEP_TITLES = [
    "Personal Details",
    "Work Experience",
    "Education",
    "Skills & Projects",
    "Select Template & Finalize"
];
const TOTAL_STEPS = STEP_TITLES.length;

// --- CSS CONTENT EMBEDDED HERE TO FIX FETCH ERROR ---
// This large string contains the entire content of style.css, allowing the download function to work locally.
const EMBEDDED_CSS = `
/* --- Global Styles --- */
body {
    font-family: 'Inter', sans-serif;
}

/* --- Input Field --- */
.input-field {
    padding: 0.75rem; /* p-3 */
    border-width: 1px;
    border-color: #d1d5db; /* border-gray-300 */
    border-radius: 0.5rem; /* rounded-lg */
    transition-property: border-color, box-shadow;
    transition-duration: 150ms;
    background-color: white;
    color: #1f2937; /* text-gray-900 */
    font-size: 0.875rem; /* text-sm */
    width: 100%; /* Ensure full width */
}
.input-field:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-color: #3b82f6; /* focus:ring-blue-500 */
    --tw-border-opacity: 1;
    border-color: #3b82f6; /* focus:border-blue-500 */
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); /* simulated ring */
}

/* --- Primary Button Style (.btn-primary) --- */
.btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.75rem 1.5rem; /* px-6 py-3 */
    font-weight: 600; /* font-semibold */
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* shadow-lg */
    transition: all 300ms ease-in-out;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
}
.btn-primary:hover {
    background: linear-gradient(135deg, #3b82f6, #4f46e5);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5), 0 4px 6px -4px rgba(59, 130, 246, 0.5); /* shadow-xl shadow-blue-300/50 */
}

/* --- Secondary Button Style (.btn-secondary) --- */
.btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem; /* rounded-lg */
    padding: 0.5rem 1rem; /* px-4 py-2 */
    font-weight: 600; /* font-semibold */
    color: #4b5563; /* text-gray-700 */
    background-color: white;
    border-width: 1px;
    border-color: #d1d5db; /* border-gray-300 */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    transition: all 300ms ease-in-out;
}
.btn-secondary:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
}

/* --- Floating Animation & Element Styles --- */
@keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); opacity: 0.9; } 
    50% { transform: translate(10px, -10px) rotate(2deg); opacity: 1.0; } 
    100% { transform: translate(0, 0) rotate(0deg); opacity: 0.9; } 
}

.floating-element {
    animation: float 14s ease-in-out infinite alternate;
    filter: blur(0.7px);
    position: absolute;
    stroke-width: 1.5;
    color: #cccccc; /* Explicitly set stroke/color to light grey */
    fill: transparent; /* Ensure SVGs are outlines, not solid black blocks */
    transition: color 0.5s;
}

/* --- Scrollbar Styles (non-standard but kept for UX) --- */
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #9ca3af; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background-color: #e5e7eb; }

/* --- Resume Preview Container (Fixed Overflow) --- */
.resume-preview-container {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow-y: auto; 
    height: 60vh; 
    padding: 0; /* Ensures inner template content scrolls correctly without border overlap */
}

/* --- Template Selection Button --- */
.template-btn {
    padding: 0.75rem; /* p-3 */
    text-align: center;
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); /* shadow-md */
    border: 2px solid transparent;
    transition: all 200ms;
    background-color: white;
    color: #1f2937;
}
.template-btn:hover {
    background-color: #f3f4f6; /* hover:bg-gray-100 */
}
.template-btn.selected {
    border-color: #3b82f6; /* border-blue-500 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(96, 165, 250, 0.5); /* ring-4 ring-blue-200 */
}


/* --- Template Specific Styles (Templates should use p-X class for padding) --- */

/* Template 1: Classic Modern */
.template-1 h1 { font-size: 2rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem; }
.template-1 h2 { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin-top: 1rem; padding-bottom: 0.25rem; border-bottom: 2px solid #3b82f6; }

/* Template 2: Minimalist Tech */
.template-2 { font-family: 'monospace'; }
.template-2 h1 { font-size: 2.2rem; font-weight: 300; letter-spacing: 2px; color: #000; }
.template-2 h2 { font-size: 1.1rem; font-weight: 500; color: #374151; margin-top: 1.5rem; border-left: 4px solid #f97316; padding-left: 8px; }
.template-2 .contact-info { color: #6b7280; font-size: 0.85rem; }

/* Template 3: Bold and Structured */
.template-3 { display: grid; grid-template-columns: 1fr; } 
@media (min-width: 768px) {
    .template-3 { grid-template-columns: 1fr 3fr; } 
}
.template-3 .sidebar { background-color: #1f2937; color: white; padding: 20px; }
.template-3 .main-content { padding: 20px; }

/* Template 4: Creative/Design Focus */
.template-4 { border: 1px dashed #d1d5db; padding: 30px; background-color: #f5f3ff; }
.template-4 h1 { font-family: 'serif'; font-size: 3rem; font-style: italic; color: #9333ea; }
.template-4 .skill-item { display: inline-block; background: #e9d5ff; color: #7e22ce; padding: 4px 8px; border-radius: 4px; margin-right: 5px; margin-bottom: 5px; font-size: 0.8rem; }

/* Template 5: Executive Summary */
.template-5 { padding: 25px; border-top: 8px solid #10b981; }
.template-5 .summary-block { margin-bottom: 15px; background-color: #f0fff4; padding: 10px; border-radius: 5px; }
`;


// --- DATA PERSISTENCE (localStorage) ---

/**
 * Loads data from localStorage into the local state and updates the UI.
 */
function loadResumeData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge loaded data and ignore any old dark mode setting
            const { isDarkMode, ...restData } = parsedData; 
            resumeData = { ...resumeData, ...restData };
            
            // Ensure array sections have at least one element
            if (!resumeData.experience || resumeData.experience.length === 0) resumeData.experience = [{}];
            if (!resumeData.education || resumeData.education.length === 0) resumeData.education = [{}];
            if (!resumeData.projects || resumeData.projects.length === 0) resumeData.projects = [{}];
            
        } catch (e) {
            console.error("Error parsing localStorage data:", e);
        }
    }

    // Initialize the UI after loading or using defaults
    updateUIFromData();
    renderCurrentResume();
}

/**
 * Saves current resumeData state to localStorage.
 */
function saveResumeData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
}


// --- UI and DATA BINDING ---

function updateUIFromData() {
    // 1. Update simple fields (Step 1 & 4)
    document.querySelectorAll('[data-field]').forEach(input => {
        const fieldName = input.getAttribute('data-field');
        input.value = resumeData[fieldName] || '';
    });

    // 2. Update dynamic lists (Steps 2, 3, 4)
    renderExperienceList();
    renderEducationList();
    renderProjectList();

    // 3. Update step and progress
    updateStepUI(resumeData.currentStep);
    
    // 4. Update template selection buttons
    setupTemplateSelection();
}

function updateDataAndSave(section, index, field, value) {
    if (section && index !== undefined && field) {
        // Update nested array object (e.g., experience[0].jobTitle)
        resumeData[section][index][field] = value;
    } else if (section) {
         // Update top-level field (e.g., name, skills)
         resumeData[section] = value;
    }

    // Debounced save
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(() => {
        saveResumeData(resumeData);
        renderCurrentResume();
    }, 500); // Wait 0.5 seconds after last input before saving
}

// Bind simple inputs
function bindInputs() {
    document.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', (e) => {
            const fieldName = input.getAttribute('data-field');
            updateDataAndSave(fieldName, undefined, undefined, e.target.value);
        });
    });
}


// --- DYNAMIC FORM RENDERING (Steps 2, 3, 4) ---

function createExperienceItem(exp, index) {
    return `
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4 transition duration-200 hover:shadow-md" data-index="${index}">
            <div class="flex justify-end">
                <button type="button" onclick="window.removeExperience(${index})" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <input type="text" value="${exp.jobTitle || ''}" oninput="window.updateExperience(${index}, 'jobTitle', this.value)" placeholder="Job Title" class="input-field col-span-1">
                <input type="text" value="${exp.company || ''}" oninput="window.updateExperience(${index}, 'company', this.value)" placeholder="Company Name" class="input-field col-span-1">
                <input type="text" value="${exp.city || ''}" oninput="window.updateExperience(${index}, 'city', this.value)" placeholder="City, State" class="input-field col-span-1">
                <div class="flex space-x-2 col-span-1">
                    <input type="month" value="${exp.startDate || ''}" oninput="window.updateExperience(${index}, 'startDate', this.value)" title="Start Date" class="input-field w-1/2">
                    <input type="month" value="${exp.endDate || ''}" oninput="window.updateExperience(${index}, 'endDate', this.value)" title="End Date (or Present)" placeholder="End Date" class="input-field w-1/2">
                </div>
                <textarea oninput="window.updateExperience(${index}, 'description', this.value)" placeholder="Key accomplishments (use bullet points or periods to separate)" rows="3" class="input-field md:col-span-2">${exp.description || ''}</textarea>
            </div>
        </div>
    `;
}

function createEducationItem(edu, index) {
    return `
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4 transition duration-200 hover:shadow-md" data-index="${index}">
            <div class="flex justify-end">
                <button type="button" onclick="window.removeEducation(${index})" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <input type="text" value="${edu.degree || ''}" oninput="window.updateEducation(${index}, 'degree', this.value)" placeholder="Degree/Certification" class="input-field col-span-1">
                <input type="text" value="${edu.institution || ''}" oninput="window.updateEducation(${index}, 'institution', this.value)" placeholder="Institution Name" class="input-field col-span-1">
                <input type="text" value="${edu.city || ''}" oninput="window.updateEducation(${index}, 'city', this.value)" placeholder="City, State" class="input-field col-span-1">
                <input type="text" value="${edu.year || ''}" oninput="window.updateEducation(${index}, 'year', this.value)" placeholder="Graduation Year" class="input-field col-span-1">
            </div>
        </div>
    `;
}

function createProjectItem(proj, index) {
      return `
        <div class="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4 transition duration-200 hover:shadow-md" data-index="${index}">
            <div class="flex justify-end">
                <button type="button" onclick="window.removeProject(${index})" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6l-12 12M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="grid grid-cols-1 gap-3 mt-1">
                <input type="text" value="${proj.name || ''}" oninput="window.updateProject(${index}, 'name', this.value)" placeholder="Project Name" class="input-field">
                <textarea oninput="window.updateProject(${index}, 'description', this.value)" placeholder="Short description of your contribution and results" rows="2" class="input-field">${proj.description || ''}</textarea>
            </div>
        </div>
    `;
}

function renderExperienceList() {
    const list = document.getElementById('experience-list');
    list.innerHTML = resumeData.experience.map(createExperienceItem).join('');
}

function renderEducationList() {
    const list = document.getElementById('education-list');
    list.innerHTML = resumeData.education.map(createEducationItem).join('');
}

function renderProjectList() {
    const list = document.getElementById('project-list');
    list.innerHTML = resumeData.projects.map(createProjectItem).join('');
}

// --- DYNAMIC DATA UPDATING (CRUD on Arrays) ---

// Experience
window.addExperience = () => {
    resumeData.experience.push({});
    renderExperienceList();
    updateDataAndSave();
};
window.removeExperience = (index) => {
    if (resumeData.experience.length > 1) {
        resumeData.experience.splice(index, 1);
    } else {
        resumeData.experience = [{}];
    }
    renderExperienceList();
    updateDataAndSave();
};
window.updateExperience = (index, field, value) => updateDataAndSave('experience', index, field, value);

// Education
window.addEducation = () => {
    resumeData.education.push({});
    renderEducationList();
    updateDataAndSave();
};
window.removeEducation = (index) => {
    if (resumeData.education.length > 1) {
        resumeData.education.splice(index, 1);
    } else {
        resumeData.education = [{}];
    }
    renderEducationList();
    updateDataAndSave();
};
window.updateEducation = (index, field, value) => updateDataAndSave('education', index, field, value);

// Projects
window.addProject = () => {
    resumeData.projects.push({});
    renderProjectList();
    updateDataAndSave();
};
window.removeProject = (index) => {
    if (resumeData.projects.length > 1) {
        resumeData.projects.splice(index, 1);
    } else {
        resumeData.projects = [{}];
    }
    renderProjectList();
    updateDataAndSave();
};
window.updateProject = (index, field, value) => updateDataAndSave('projects', index, field, value);


// --- CORE APP NAVIGATION AND TEMPLATE RENDERING ---

/**
 * Updates step-specific UI elements (progress bar, title, navigation).
 */
function updateStepUI(step) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach((el, i) => {
        el.classList.add('hidden');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
        currentStepEl.classList.remove('hidden');
        document.getElementById('current-step-display').textContent = step;
        document.getElementById('step-title').textContent = STEP_TITLES[step - 1];
    }

    // Update progress bar
    const progress = (step / TOTAL_STEPS) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Previous button visibility
    prevBtn.classList.toggle('invisible', step === 1);

    if (step < TOTAL_STEPS) {
        nextBtn.classList.remove('hidden');
        downloadBtn.classList.add('hidden');
        nextBtn.textContent = (step === TOTAL_STEPS - 1) ? 'Select Template' : 'Next Step';
    } else {
        nextBtn.classList.add('hidden');
        downloadBtn.classList.remove('hidden');
    }
    
    // Ensure form container is scrolled to the top on step change
    document.getElementById('form-container').scrollTop = 0;
}

/**
 * Navigates between steps.
 */
window.navigateStep = (direction) => {
    let newStep = resumeData.currentStep + direction;

    if (newStep < 1 || newStep > TOTAL_STEPS) return;

    // Simple validation for Step 1 before moving forward
    if (direction > 0 && resumeData.currentStep === 1) {
        if (!resumeData.name || !resumeData.summary) {
            alert('Please fill out your Name and Professional Summary before proceeding.');
            return;
        }
    }

    resumeData.currentStep = newStep;
    updateStepUI(newStep);
    saveResumeData(resumeData); // Auto-save step change
};

function setupTemplateSelection() {
    const container = document.getElementById('template-selection');
    container.innerHTML = Object.entries(window.resumeTemplates).map(([key, template], index) => `
        <button id="select-${key}" type="button" class="template-btn ${key === resumeData.selectedTemplate ? 'selected' : ''}" 
            onclick="window.selectTemplate('${key}')">
        <span class="font-semibold text-sm">${template.name}</span>
        <span class="block text-xs text-gray-500">T${index + 1}</span>
        </button>
    `).join('');

    // Set the current name display
    document.getElementById('current-template-name').textContent = window.resumeTemplates[resumeData.selectedTemplate].name;
}

window.selectTemplate = (templateKey) => {
    if (resumeData.selectedTemplate === templateKey) return;

    // Update button styles
    document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`select-${templateKey}`).classList.add('selected');

    // Update state and save
    resumeData.selectedTemplate = templateKey;
    document.getElementById('current-template-name').textContent = window.resumeTemplates[templateKey].name;
    saveResumeData(resumeData);
    
    // Update live preview
    renderCurrentResume();
};

window.renderCurrentResume = () => {
    const template = window.resumeTemplates[resumeData.selectedTemplate];
    if (template) {
        const html = template.render(resumeData);
        document.getElementById('resume-preview').innerHTML = html;
        // Scroll preview to top when template changes/renders
        document.getElementById('resume-preview').scrollTop = 0;
    }
};


// --- DOWNLOAD FUNCTION (Saves as .html for easy printing/conversion) ---

window.downloadResume = () => {
    const resumeContainer = document.getElementById('resume-preview');
    const templateContent = resumeContainer.innerHTML;
    const templateClass = resumeContainer.firstChild.className; // Get the class of the top-level template div
    const templateName = document.getElementById('current-template-name').textContent;

    // FIX: Using EMBEDDED_CSS variable instead of fetch() to bypass local file security restrictions.
    const cssContent = EMBEDDED_CSS;

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Resuexpress Resume - ${resumeData.name || 'Untitled'}</title>
            <style>
                /* Embed custom CSS here for a self-contained printable file */
                ${cssContent}

                /* --- Print-Specific Styles --- */
                @media print {
                    body { margin: 0; padding: 0; background: none !important; color: black !important; }
                    /* Ensure two-column template prints correctly */
                    .template-3 { grid-template-columns: 1fr 3fr; } 
                }
            </style>
        </head>
        <body>
            <div class="${templateClass}" style="min-height: 100vh; max-width: 800px; margin: 0 auto; padding: 0;">
                ${templateContent}
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resuexpress_Resume_${resumeData.name.replace(/ /g, '_')}_${templateName.replace(/ /g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};


// --- START UP ---
window.addEventListener('DOMContentLoaded', () => {
    loadResumeData(); // Load data first
    bindInputs();     // Bind input listeners
});