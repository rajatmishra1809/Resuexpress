/**
 * templates.js
 * Contains the functions for rendering resume data into 5 distinct HTML templates.
 * These functions are called by script.js to update the live preview.
 */

// Define the template map globally for script.js to access
window.resumeTemplates = {
    template1: { name: "Classic Modern", render: renderTemplate1 },
    template2: { name: "Minimalist Tech", render: renderTemplate2 },
    template3: { name: "Bold & Structured", render: renderTemplate3 },
    template4: { name: "Creative Design", render: renderTemplate4 },
    template5: { name: "Executive Summary", render: renderTemplate5 }
};

// Default data for the preview when the user hasn't entered anything yet
const defaultData = {
    name: 'Jane Doe',
    jobTitle: 'Senior Product Manager',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    linkedin: 'linkedin.com/in/janedoe',
    summary: 'Highly analytical and results-oriented professional with 8+ years of experience in product strategy and lifecycle management. Proven ability to drive complex projects from concept to launch, exceeding KPIs by 20%.',
    experience: [
        { jobTitle: 'Product Manager', company: 'Innovate Solutions', city: 'San Francisco, CA', startDate: '2019-03', endDate: 'Present', description: 'Led cross-functional teams (5 engineers, 2 designers) to launch two major B2B SaaS features, resulting in a 15% increase in customer retention. Defined product roadmap and managed backlog.' },
        { jobTitle: 'Associate PM', company: 'Global Tech Corp', city: 'New York, NY', startDate: '2017-06', endDate: '2019-02', description: 'Conducted market research and competitive analysis, contributing to a successful pivot in mobile strategy. Managed A/B testing efforts for marketing campaigns.' },
    ],
    education: [
        { degree: 'M.S. in Business Administration', institution: 'State University', city: 'Cityville, ST', year: '2017' },
        { degree: 'B.A. in Economics', institution: 'Local College', city: 'Township, ST', year: '2015' }
    ],
    skills: 'Product Roadmapping, Tailwind CSS, Project Management, SQL, Data Analysis, Stakeholder Management, Vercel Deployment',
    projects: [
        { name: 'Resuexpress Web App', description: 'Developed a 5-step, multi-template resume builder with live preview and local storage persistence.' },
        { name: 'E-commerce Recommendation Engine', description: 'Built and deployed a Python/TensorFlow model that improved click-through rates by 12%.' }
    ]
};

/**
 * Utility function to ensure data is filled for the preview when empty.
 */
const getPreviewData = (data) => {
    // If the main fields are empty, use default data for a meaningful preview
    return (data && data.name) ? data : defaultData;
};

// Helper function to render list items
const renderList = (items) => {
    if (!items || items.length === 0) return '';
    // Automatically wrap descriptions in a list format
    return items.map(item => `<li class="mb-1">${item}</li>`).join('');
};

// --- Template 1: Classic Modern (Professional and Clean) ---
function renderTemplate1(data) {
    const d = getPreviewData(data);
    return `
        <div class="template-1 p-4 sm:p-8 bg-white">
            <header class="text-center pb-4 border-b border-gray-300">
                <h1>${d.name}</h1>
                <p class="text-sm text-gray-600">${d.jobTitle || d.summary.split('.')[0] || 'Professional Title'}</p>
                <p class="text-xs text-gray-500 mt-2 flex flex-wrap justify-center space-x-2 sm:space-x-4">
                    ${d.phone ? `<span class="mr-1 sm:mr-3">${d.phone}</span>` : ''}
                    ${d.email ? `<span class="mr-1 sm:mr-3">${d.email}</span>` : ''}
                    ${d.linkedin ? `<a href="https://${d.linkedin}" target="_blank" class="text-blue-600 hover:underline">${d.linkedin}</a>` : ''}
                </p>
            </header>

            <section class="mt-4">
                <h2>Professional Summary</h2>
                <div class="section-content text-justify">
                    <p class="text-gray-700 text-sm">${d.summary}</p>
                </div>
            </section>

            <section class="mt-4">
                <h2>Work Experience</h2>
                ${d.experience.map(exp => `
                    <div class="section-content mb-3">
                        <div class="flex flex-col sm:flex-row justify-between">
                            <span class="job-title text-sm font-semibold text-gray-800">${exp.jobTitle || 'Job Title'} at ${exp.company || 'Company Name'}</span>
                            <span class="text-xs text-gray-600 mt-1 sm:mt-0">${exp.startDate} - ${exp.endDate}</span>
                        </div>
                        <p class="text-xs italic text-gray-500">${exp.city}</p>
                        <ul class="list-disc ml-5 mt-1 text-sm text-gray-700">
                            ${renderList((exp.description || 'Key achievement or responsibility listed here.').split('. ').filter(s => s))}
                        </ul>
                    </div>
                `).join('')}
            </section>

            <section class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2>Education</h2>
                    ${d.education.map(edu => `
                        <div class="section-content mb-3">
                            <p class="section-title text-sm font-semibold text-gray-800">${edu.degree || 'Degree Title'}</p>
                            <p class="text-sm text-gray-700">${edu.institution || 'Institution Name'}, ${edu.city}</p>
                            <p class="text-xs text-gray-600">${edu.year}</p>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h2>Technical Skills</h2>
                    <div class="section-content">
                        <p class="text-sm text-gray-700">${d.skills || 'List of technical, soft, and industry skills.'}</p>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// --- Template 2: Minimalist Tech (Clean and Code-Inspired) ---
function renderTemplate2(data) {
    const d = getPreviewData(data);
    const skillsArray = d.skills ? d.skills.split(',').map(s => s.trim()) : [];
    return `
        <div class="template-2 p-4 sm:p-8 bg-gray-50 border-t-8 border-gray-800">
            <header>
                <h1 class="text-gray-800">${d.name}</h1>
                <p class="contact-info">
                    [${d.email}] | [${d.phone}] | [${d.linkedin}]
                </p>
            </header>

            <section class="mt-4">
                <h2 class="text-gray-800">> PROFESSIONAL STATEMENT</h2>
                <p class="mt-2 text-gray-700 text-sm">${d.summary}</p>
            </section>

            <section class="mt-4">
                <h2 class="text-gray-800">> EXPERIENCE</h2>
                ${d.experience.map(exp => `
                    <div class="mt-3">
                        <div class="flex flex-col sm:flex-row justify-between text-sm">
                            <span class="font-bold text-gray-800">${exp.jobTitle || 'Role'} @ ${exp.company || 'Company'}</span>
                            <span class="text-xs text-gray-600 mt-1 sm:mt-0">${exp.startDate} - ${exp.endDate}</span>
                        </div>
                        <p class="text-sm text-gray-500 italic">${exp.city}</p>
                        <ul class="list-none ml-4 text-xs text-gray-700 mt-1 space-y-0.5">
                            ${renderList((exp.description || 'Key outcome or accomplishment.').split('. ').filter(s => s).map(s => `> ${s}`))}
                        </ul>
                    </div>
                `).join('')}
            </section>

            <section class="mt-4">
                <h2 class="text-gray-800">> EDUCATION & SKILLS</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                        <p class="font-bold text-sm text-gray-800">EDUCATION</p>
                        ${d.education.map(edu => `
                            <div class="text-xs mt-1 text-gray-700">
                                <p>${edu.degree || 'Degree'}</p>
                                <p class="text-gray-600">${edu.institution || 'University'}</p>
                                <p class="text-gray-500">${edu.year}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-800">SKILLS</p>
                        <p class="text-xs text-gray-700 mt-1">${skillsArray.map(s => `[${s}]`).join(' ')}</p>
                    </div>
                </div>
            </section>

            <section class="mt-4">
                <h2 class="text-gray-800">> PROJECTS</h2>
                ${d.projects.map(proj => `
                    <div class="mt-2 text-sm">
                        <span class="font-bold text-gray-800">${proj.name || 'Project Name'}:</span> <span class="text-gray-700 text-xs">${proj.description || 'Brief description of the project and its results.'}</span>
                    </div>
                `).join('')}
            </section>
        </div>
    `;
}

// --- Template 3: Bold and Structured (Two-Column Layout) ---
function renderTemplate3(data) {
    const d = getPreviewData(data);
    return `
        <div class="template-3 min-h-[800px] bg-white text-gray-900 border border-gray-100">
            <div class="sidebar">
                <h1 class="text-white">${d.name.toUpperCase()}</h1>
                <p class="text-blue-300 font-medium text-sm">${d.jobTitle || 'Professional Role'}</p>

                <div class="mt-6">
                    <h2>CONTACT</h2>
                    <ul class="text-xs mt-2 space-y-1">
                        ${d.phone ? `<li><span class="font-bold">Phone:</span> ${d.phone}</li>` : ''}
                        ${d.email ? `<li><span class="font-bold">Email:</span> ${d.email}</li>` : ''}
                        ${d.linkedin ? `<li><span class="font-bold">LinkedIn:</span> <a href="https://${d.linkedin}" target="_blank" class="text-blue-300">${d.linkedin.split('/').pop()}</a></li>` : ''}
                        <li><span class="font-bold">Location:</span> ${d.experience[0]?.city || 'Global'}</li>
                    </ul>
                </div>

                <div class="mt-6">
                    <h2>SKILLS</h2>
                    <ul class="text-xs mt-2 list-none space-y-1">
                        ${d.skills ? d.skills.split(',').map(s => `<li>- ${s.trim()}</li>`).join('') : '<li>- Core Skills</li>'}
                    </ul>
                </div>

                <div class="mt-6">
                    <h2>EDUCATION</h2>
                    ${d.education.map(edu => `
                        <div class="text-xs mt-2">
                            <p class="font-bold">${edu.degree || 'Degree Title'}</p>
                            <p>${edu.institution || 'Institution Name'}</p>
                            <p class="text-gray-400">${edu.year}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="main-content">
                <section>
                    <p class="text-sm text-gray-700">${d.summary}</p>
                </section>

                <section class="mt-8">
                    <h2>WORK EXPERIENCE</h2>
                    ${d.experience.map(exp => `
                        <div class="mt-4">
                            <div class="flex flex-col sm:flex-row justify-between text-sm">
                                <p class="font-bold text-gray-900">${exp.jobTitle || 'Job Title'}</p>
                                <span class="text-gray-600">${exp.startDate} - ${exp.endDate}</span>
                            </div>
                            <p class="text-xs italic text-gray-700">${exp.company || 'Company Name'} | ${exp.city}</p>
                            <ul class="list-disc ml-5 mt-1 text-sm text-gray-700">
                                ${renderList((exp.description || 'Key accomplishment or responsibility.').split('. ').filter(s => s))}
                            </ul>
                        </div>
                    `).join('')}
                </section>

                <section class="mt-8">
                    <h2>PROJECTS</h2>
                    ${d.projects.map(proj => `
                        <div class="mt-3">
                            <p class="font-bold text-sm text-gray-900">${proj.name || 'Project Name'}</p>
                            <p class="text-xs text-gray-700">${proj.description || 'Brief project summary.'}</p>
                        </div>
                    `).join('')}
                </section>
            </div>
        </div>
    `;
}

// --- Template 4: Creative/Design Focus (Soft and modern) ---
function renderTemplate4(data) {
    const d = getPreviewData(data);
    const skillsArray = d.skills ? d.skills.split(',').map(s => s.trim()) : [];
    return `
        <div class="template-4 p-4 sm:p-8 bg-purple-50">
            <header class="text-center pb-4 mb-6">
                <h1 class="border-b-4 border-purple-400 inline-block pb-1">${d.name}</h1>
                <p class="text-lg text-purple-600 mt-2 font-light">${d.jobTitle || 'Creative Professional'}</p>
            </header>

            <div class="grid grid-cols-1 gap-8">
                <section>
                    <h2>Profile</h2>
                    <p class="mt-2 text-gray-700">${d.summary}</p>
                    <div class="mt-4 text-sm text-gray-600 flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-4">
                        <span>${d.phone}</span>
                        <span>${d.email}</span>
                        <a href="https://${d.linkedin}" target="_blank" class="text-purple-600 hover:text-purple-800">${d.linkedin ? 'LinkedIn' : ''}</a>
                    </div>
                </section>

                <section>
                    <h2>Experience & Achievements</h2>
                    ${d.experience.map(exp => `
                        <div class="mt-3 p-3 bg-white rounded-lg shadow-sm">
                            <div class="flex flex-col sm:flex-row justify-between text-sm">
                                <p class="font-bold text-purple-800">${exp.jobTitle || 'Role'}</p>
                                <span class="text-gray-500 italic text-xs sm:text-sm">${exp.startDate} - ${exp.endDate}</span>
                            </div>
                            <p class="text-xs font-semibold text-gray-600">${exp.company || 'Company'} | ${exp.city}</p>
                            <ul class="list-disc ml-5 mt-1 text-xs text-gray-700">
                                ${renderList((exp.description || 'Creative contribution or project outcome.').split('. ').filter(s => s))}
                            </ul>
                        </div>
                    `).join('')}
                </section>

                <section>
                    <h2>Skills & Tools</h2>
                    <div class="mt-2">
                        ${skillsArray.map(s => `<span class="skill-item">${s}</span>`).join('')}
                    </div>
                </section>

                <section>
                    <h2>Education</h2>
                    ${d.education.map(edu => `
                        <div class="mt-2 text-sm">
                            <p class="font-semibold text-gray-800">${edu.degree || 'Degree'}</p>
                            <p class="text-xs text-gray-600">${edu.institution || 'Institution'} (${edu.year})</p>
                        </div>
                    `).join('')}
                </section>
            </div>
        </div>
    `;
}

// --- Template 5: Executive Summary (Focus on Outcomes) ---
function renderTemplate5(data) {
    const d = getPreviewData(data);
    return `
        <div class="template-5 p-4 sm:p-8 bg-white">
            <header class="pb-4 border-b border-gray-200">
                <h1>${d.name.toUpperCase()}</h1>
                <p class="text-lg text-gray-700">${d.jobTitle || 'Executive Title'}</p>
                <div class="text-sm text-gray-500 mt-1 space-x-4 flex flex-wrap">
                    <span>${d.phone}</span>
                    <span>${d.email}</span>
                    <a href="https://${d.linkedin}" target="_blank" class="text-green-600 hover:underline">${d.linkedin ? 'LinkedIn' : ''}</a>
                </div>
            </header>

            <section class="mt-6">
                <h2>EXECUTIVE SUMMARY</h2>
                <div class="summary-block">
                    <p class="text-gray-700 text-base">${d.summary}</p>
                </div>
            </section>

            <section class="mt-6">
                <h2>PROFESSIONAL HISTORY</h2>
                ${d.experience.map(exp => `
                    <div class="mt-4 pb-2 border-b border-gray-100 last:border-b-0">
                        <div class="flex flex-col sm:flex-row justify-between text-sm">
                            <p class="font-bold text-green-700">${exp.jobTitle || 'Executive Role'}</p>
                            <span class="text-gray-600">${exp.startDate} - ${exp.endDate}</span>
                        </div>
                        <p class="text-sm italic text-gray-700">${exp.company || 'Company Name'}, ${exp.city}</p>
                        <ul class="list-disc ml-5 mt-1 text-sm text-gray-700">
                            ${renderList((exp.description || 'Significant business outcome or metric achieved.').split('. ').filter(s => s))}
                        </ul>
                    </div>
                `).join('')}
            </section>

            <section class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h2>KEY PROJECTS</h2>
                    ${d.projects.map(proj => `
                        <div class="mt-2 text-sm">
                            <p class="font-semibold text-gray-800">${proj.name || 'Project Name'}</p>
                            <p class="text-xs text-gray-600">${proj.description || 'Project objective and result.'}</p>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h2>EDUCATION & SKILLS</h2>
                    ${d.education.map(edu => `
                        <div class="mt-2 text-sm">
                            <p class="font-semibold text-gray-800">${edu.degree || 'Degree'}</p>
                            <p class="text-xs text-gray-600">${edu.institution || 'Institution'} (${edu.year})</p>
                        </div>
                    `).join('')}
                    <h3 class="text-sm font-bold text-gray-800 mt-4">CORE COMPETENCIES</h3>
                    <p class="text-xs text-gray-700">${d.skills || 'Strategy, Leadership, Finance, Operations'}</p>
                </div>
            </section>
        </div>
    `;
}