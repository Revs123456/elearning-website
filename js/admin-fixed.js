// Admin Panel JavaScript - Fixed Version
document.addEventListener('DOMContentLoaded', function() {
    // Load shared.js first
    const script = document.createElement('script');
    script.src = 'js/shared.js';
    script.onload = function() {
        // Initialize the admin panel after shared.js is loaded
        initAdminPanel();
    };
    document.head.appendChild(script);
});

// Main function to initialize the admin panel
function initAdminPanel() {
    try {
        // Initialize sidebar navigation
        initSidebar();
        
        // Initialize modals
        initModals();
        
        // Load initial data
        loadDashboardData();
        
        // Set current admin name
        const adminElement = document.getElementById('current-admin');
        if (adminElement) {
            adminElement.textContent = 'Admin User';
        }
        
        console.log('Admin panel initialized successfully');
    } catch (error) {
        console.error('Error initializing admin panel:', error);
    }
}

// Initialize sidebar navigation
function initSidebar() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            const sectionId = this.getAttribute('data-section') + '-section';
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
            
            // Load section-specific data
            loadSectionData(this.getAttribute('data-section'));
        });
    });
    
    // Show dashboard by default
    const dashboardItem = document.querySelector('.menu-item[data-section="dashboard"]');
    if (dashboardItem) {
        dashboardItem.click();
    }
}

// Initialize modals and event listeners
function initModals() {
    // Add event listeners for all add buttons
    const addButtons = {
        'add-home-content': 'home',
        'add-course': 'course',
        'add-bookmark': 'bookmark',
        'add-playlist': 'playlist',
        'add-short': 'short',
        'add-website': 'website'
    };
    
    Object.entries(addButtons).forEach(([buttonId, section]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showAddModal(section);
            });
        } else {
            console.warn(`Button with ID '${buttonId}' not found`);
        }
    });
    
    // Initialize all sections to load their data
    const sections = ['home', 'courses', 'bookmarks', 'playlists', 'shorts', 'websites'];
    sections.forEach(section => {
        // Initialize with empty array if not exists
        const storageKey = section.endsWith('s') ? section : section + 's';
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, '[]');
        }
    });
}

// Show add modal for a specific section
function showAddModal(section) {
    let modalTitle = '';
    let formFields = '';
    
    switch(section) {
        case 'home':
            modalTitle = 'Add Home Content';
            formFields = `
                <div class="form-group">
                    <label for="home-title">Title</label>
                    <input type="text" id="home-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="home-type">Type</label>
                    <select id="home-type" class="form-control" required>
                        <option value="">Select Type</option>
                        <option value="banner">Banner</option>
                        <option value="feature">Feature</option>
                        <option value="testimonial">Testimonial</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="home-description">Description</label>
                    <textarea id="home-description" class="form-control" rows="3" required></textarea>
                </div>`;
            break;
            
        case 'bookmark':
            modalTitle = 'Add New Bookmark';
            formFields = `
                <div class="form-group">
                    <label for="bookmark-title">Title</label>
                    <input type="text" id="bookmark-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-url">URL</label>
                    <input type="url" id="bookmark-url" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-category">Category</label>
                    <input type="text" id="bookmark-category" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-tags">Tags (comma separated)</label>
                    <input type="text" id="bookmark-tags" class="form-control" placeholder="e.g., javascript, web, tutorial">
                </div>`;
            break;
            
        case 'course':
            modalTitle = 'Add New Course';
            formFields = `
                <div class="form-group">
                    <label for="course-title">Title</label>
                    <input type="text" id="course-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="course-instructor">Instructor</label>
                    <input type="text" id="course-instructor" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="course-description">Description</label>
                    <textarea id="course-description" class="form-control" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="course-category">Category</label>
                    <input type="text" id="course-category" class="form-control" required>
                </div>`;
            break;
            
        // Add other cases as needed
        default:
            modalTitle = 'Add New Item';
            formFields = `
                <div class="form-group">
                    <label for="item-title">Title</label>
                    <input type="text" id="item-title" class="form-control" required>
                </div>`;
    }
    
    const modalHtml = `
        <div class="modal" id="add-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${modalTitle}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="add-form">
                        ${formFields}
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>`;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('add-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to the container
    const modalContainer = document.getElementById('modal-container') || document.body;
    modalContainer.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show the modal
    const modal = document.getElementById('add-modal');
    modal.style.display = 'block';
    
    // Set up event listeners for the modal
    setupModalEvents(section);
}

// Set up modal event listeners
function setupModalEvents(section) {
    const modal = document.getElementById('add-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const form = document.getElementById('add-form');
    
    // Close modal when clicking on X or cancel button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.remove();
        });
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveItem(section);
        });
    }
}

// Save item to localStorage
function saveItem(section) {
    let item = {};
    
    switch(section) {
        case 'bookmark':
            item = {
                id: Date.now(),
                title: document.getElementById('bookmark-title').value,
                url: document.getElementById('bookmark-url').value,
                category: document.getElementById('bookmark-category').value,
                tags: document.getElementById('bookmark-tags').value.split(',').map(tag => tag.trim()),
                createdAt: new Date().toISOString()
            };
            break;
                  case 'course':
            item = {
                id: Date.now(),
                title: document.getElementById('course-title').value,
                instructor: document.getElementById('course-instructor').value,
                description: document.getElementById('course-description').value,
                category: document.getElementById('course-category').value,
                createdAt: new Date().toISOString()
            };
            break;
            
        // Add other cases as needed
        default:
            item = {
                id: Date.now(),
                title: document.getElementById('item-title').value,
                createdAt: new Date().toISOString()
            };
    }
    
    // Save to localStorage
    const storageKey = section.endsWith('e') ? section + 's' : section + 'es';
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    items.push(item);
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // Close the modal
    const modal = document.getElementById('add-modal');
    if (modal) {
        modal.remove();
    }
    
    // Reload the current section
    const activeSection = document.querySelector('.menu-item.active');
    if (activeSection) {
        loadSectionData(activeSection.getAttribute('data-section'));
  
    }
}

// Load section data
function loadSectionData(section) {
        const storageKey = section.endsWith('s') ? section : section + 's';
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Update the UI with the loaded data
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        // Here you would update the UI with the loaded items
        console.log(`Loaded ${items.length} items for ${section}`);

}

// Load dashboard data
function loadDashboardData() {
    // Load counts for the dashboard
    const sections = ['courses', 'bookmarks', 'playlists', 'shorts', 'websites'];
    sections.forEach(section => {
                const storageKey = section.endsWith('s') ? section : section + 's';
        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');

        const countElement = document.getElementById(`total-${section}`);
        if (countElement) {
            countElement.textContent = items.length;
        }
    });
}
