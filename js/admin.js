// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin panel
    initAdminPanel();
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
            document.getElementById(sectionId).style.display = 'block';
            
            // Load section-specific data
            loadSectionData(this.getAttribute('data-section'));
        });
    });
    
    // Show dashboard by default
    document.querySelector('.menu-item[data-section="dashboard"]').click();
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
                </div>
                <div class="form-group">
                    <label for="home-content">Content</label>
                    <textarea id="home-content" class="form-control" rows="5" required></textarea>
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
                    <textarea id="home-content" class="form-control" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="home-image">Image URL</label>
                    <input type="url" id="home-image" class="form-control">
                </div>
            `;
            break;
            
        case 'course':
            modalTitle = 'Add New Course';
            formFields = `
                <div class="form-group">
                    <label for="course-title">Course Title</label>
                    <input type="text" id="course-title" class="form-control" required>
                </div>
                <div class="form-group">
                    </select>
                </div>
                <div class="form-group">
                    <label for="course-description">Description</label>
                    <textarea id="course-description" class="form-control" rows="4" required></textarea>
                </div>
                <div class="form-group">
                    <label for="course-image">Thumbnail URL</label>
                    <input type="url" id="course-image" class="form-control" placeholder="https://example.com/image.jpg">
                </div>
            `;
            break;
            
                    <input type="text" id="bookmark-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-url">URL</label>
                    <input type="url" id="bookmark-url" class="form-control" required placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label for="bookmark-category">Category</label>
                    <input type="text" id="bookmark-category" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="bookmark-description">Description (Optional)</label>
                    <textarea id="bookmark-description" class="form-control" rows="3"></textarea>
                </div>
            `;
            break;
            
        case 'playlist':
            modalTitle = 'Add New Playlist';
            formFields = `
                <div class="form-group">
                    <label for="playlist-title">Playlist Title</label>
                    <input type="text" id="playlist-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="playlist-category">Category</label>
                    <select id="playlist-category" class="form-control" required>
                        <option value="">Select Category</option>
                        <option value="web">Web Development</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="design">Design</option>
                        <option value="business">Business</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="playlist-description">Description</label>
                    <textarea id="playlist-description" class="form-control" rows="4" required></textarea>
                </div>
            `;
            break;
            
        case 'short':
            modalTitle = 'Add New Short';
            formFields = `
                <div class="form-group">
                    <label for="short-title">Title</label>
                    <input type="text" id="short-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="short-url">Video URL</label>
                    <input type="url" id="short-url" class="form-control" required placeholder="https://example.com/video">
                </div>
                <div class="form-group">
                    <label for="short-thumbnail">Thumbnail URL (Optional)</label>
                    <input type="url" id="short-thumbnail" class="form-control" placeholder="https://example.com/thumbnail.jpg">
                </div>
                <div class="form-group">
                    <label for="short-duration">Duration (MM:SS)</label>
                    <input type="text" id="short-duration" class="form-control" placeholder="0:30" pattern="[0-9]+:[0-9]{2}" title="Enter duration in MM:SS format">
                </div>
            `;
            break;
            
        case 'website':
            modalTitle = 'Add New Website';
            formFields = `
                <div class="form-group">
                    <label for="website-name">Website Name</label>
                    <input type="text" id="website-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="website-url">Website URL</label>
                    <input type="url" id="website-url" class="form-control" required placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label for="website-category">Category</label>
                    <select id="website-category" class="form-control" required>
                        <option value="">Select Category</option>
                        <option value="education">Education</option>
                        <option value="productivity">Productivity</option>
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="website-description">Description (Optional)</label>
                    <textarea id="website-description" class="form-control" rows="3"></textarea>
                </div>
            `;
            break;
            
        default:
            modalTitle = 'Add New Item';
            formFields = `
                <div class="form-group">
                    <label for="item-title">Title</label>
                    <input type="text" id="item-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="item-description">Description</label>
                    <textarea id="item-description" class="form-control" rows="4"></textarea>
                </div>
            `;
    }
    
    const modalHtml = `
        <div class="modal" id="add-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${modalTitle}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-form">
                        ${formFields}
                        <div class="form-actions" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
                            <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the page
    document.getElementById('modal-container').innerHTML = modalHtml;
    
    // Show the modal
    document.getElementById('add-modal').style.display = 'block';
    
    // Add event listeners
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
            handleFormSubmit(section);
        });
    }
}

// Handle form submission
function handleFormSubmit(section) {
    let item, storageKey, successMessage;
    
    switch(section) {
        case 'course':
            item = {
                id: Date.now().toString(),
                title: document.getElementById('course-title').value,
                instructor: document.getElementById('course-instructor').value,
                category: document.getElementById('course-category').value,
                description: document.getElementById('course-description').value,
                image: document.getElementById('course-image').value || 'https://via.placeholder.com/300x200',
                status: 'active'
            };
            storageKey = 'courses';
            successMessage = 'Course';
            break;
            
        case 'bookmark':
            item = {
                id: Date.now().toString(),
                title: document.getElementById('bookmark-title').value,
                url: document.getElementById('bookmark-url').value,
                category: document.getElementById('bookmark-category').value,
                description: document.getElementById('bookmark-description').value || '',
                status: 'active'
            };
            storageKey = 'bookmarks';
            successMessage = 'Bookmark';
            break;
            
        case 'playlist':
            item = {
                id: Date.now().toString(),
                title: document.getElementById('playlist-title').value,
                description: document.getElementById('playlist-description').value,
                category: document.getElementById('playlist-category').value,
                items: [],
                status: 'active'
            };
            storageKey = 'playlists';
            successMessage = 'Playlist';
            break;
            
        case 'short':
            item = {
                id: Date.now().toString(),
                title: document.getElementById('short-title').value,
                url: document.getElementById('short-url').value,
                thumbnail: document.getElementById('short-thumbnail').value || 'https://via.placeholder.com/300x200',
                duration: document.getElementById('short-duration').value || '0:30',
                views: 0,
                status: 'active'
            };
            storageKey = 'shorts';
            successMessage = 'Short';
            break;
            
        case 'website':
            item = {
                id: Date.now().toString(),
                name: document.getElementById('website-name').value,
                url: document.getElementById('website-url').value,
                category: document.getElementById('website-category').value,
                description: document.getElementById('website-description').value || '',
                status: 'active'
            };
            storageKey = 'websites';
            successMessage = 'Website';
            break;
            
        default:
            console.error('Unknown section:', section);
            return;
    }
    
    // Get existing items from local storage or initialize empty array
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Add new item
    items.push(item);
    
    // Save back to local storage
    localStorage.setItem(storageKey, JSON.stringify(items));
    
    // Show success message
    alert(`${successMessage} added successfully!`);
    
    // Close the modal and reload the section
    document.getElementById('add-modal')?.remove();
    loadSectionData(section + 's'); // Add 's' to match the section IDs (e.g., 'course' -> 'courses')
}

// Helper function to render a table row with action buttons
function renderTableRow(item, columns, section) {
    const row = document.createElement('tr');
    let rowContent = '';
    
    // Add data cells
    columns.forEach(col => {
        if (col === 'status') {
            const status = item[col] || 'active';
            const statusColor = status === 'active' ? '#2ecc71' : '#e74c3c';
            rowContent += `<td><span style="color: ${statusColor};">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>`;
        } else if (col === 'actions') {
            rowContent += `
                <td class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="editItem('${section.replace('s', '')}', '${item.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem('${section.replace('s', '')}', '${item.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>`;
        } else {
            // Truncate long text
            let cellContent = item[col] || '-';
            if (typeof cellContent === 'string' && cellContent.length > 30) {
                cellContent = cellContent.substring(0, 30) + '...';
            }
            rowContent += `<td>${cellContent}</td>`;
        }
    });
    
    row.innerHTML = rowContent;
    return row;
}

// Load data for a specific section
function loadSectionData(section) {
    console.log(`Loading data for ${section}`);
    
    // Common variables
    let items, container, columns, emptyMessage, storageKey;
    
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            return;
            
        case 'home':
            storageKey = 'homeContent';
            container = document.getElementById('home-content-list');
            columns = ['id', 'title', 'type', 'status', 'actions'];
            emptyMessage = 'No home content added yet';
            break;
            
        case 'courses':
            storageKey = 'courses';
            container = document.getElementById('courses-list');
            columns = ['id', 'title', 'instructor', 'category', 'status', 'actions'];
            emptyMessage = 'No courses added yet';
            break;
            
        case 'bookmarks':
            storageKey = 'bookmarks';
            container = document.getElementById('bookmarks-list');
            columns = ['id', 'title', 'url', 'category', 'actions'];
            emptyMessage = 'No bookmarks added yet';
            break;
            
        case 'playlists':
            storageKey = 'playlists';
            container = document.getElementById('playlists-list');
            columns = ['id', 'title', 'description', 'category', 'actions'];
            emptyMessage = 'No playlists added yet';
            break;
            
        case 'shorts':
            storageKey = 'shorts';
            container = document.getElementById('shorts-list');
            columns = ['id', 'title', 'duration', 'views', 'actions'];
            emptyMessage = 'No shorts added yet';
            break;
            
        case 'websites':
            storageKey = 'websites';
            container = document.getElementById('websites-list');
            columns = ['id', 'name', 'url', 'category', 'status', 'actions'];
            emptyMessage = 'No websites added yet';
            break;
            
        default:
            console.error('Unknown section:', section);
            return;
    }
    
    // Get items from localStorage
    items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // If container doesn't exist, log error and return
    if (!container) {
        console.error(`Container not found for section: ${section}`);
        return;
    }
    
    // Clear existing rows
    container.innerHTML = '';
    
    // Show empty message if no items
    if (!items || items.length === 0) {
        const colCount = columns.length + 1; // +1 for actions column
        container.innerHTML = `
            <tr>
                <td colspan="${colCount}" style="text-align: center; padding: 20px 0; color: #7f8c8d;">
                    ${emptyMessage}
                </td>
            </tr>`;
        return;
    }
    
    // Add each item to the table
    items.forEach(item => {
        // For display, we'll show a shortened ID
        if (item.id) {
            item.id = item.id.slice(-6);
        }
        
        // For URLs, show as clickable links
        if (item.url) {
            item.url = `<a href="${item.url}" target="_blank" title="${item.url}">View</a>`;
        }
        
        const row = renderTableRow(item, columns, section);
        container.appendChild(row);
    });
}

// Load dashboard data
function loadDashboardData() {
    // In a real application, you would fetch this data from a server
    const stats = {
        totalCourses: 42,
        totalBookmarks: 128,
        totalPlaylists: 15,
        recentActivity: [
            { id: 1, action: 'New course added', details: 'Introduction to React', time: '2 hours ago' },
            { id: 2, action: 'User registered', details: 'john.doe@example.com', time: '5 hours ago' },
            { id: 3, action: 'Content updated', details: 'Homepage banner', time: '1 day ago' },
            { id: 4, action: 'New playlist created', details: 'Web Development Fundamentals', time: '2 days ago' }
        ]
    };
    
    // Update stats
    document.getElementById('total-courses').textContent = stats.totalCourses;
    document.getElementById('total-bookmarks').textContent = stats.totalBookmarks;
    document.getElementById('total-playlists').textContent = stats.totalPlaylists;
    
    // Update recent activity
    const activityList = document.getElementById('recent-activity');
    if (activityList) {
        if (stats.recentActivity.length > 0) {
            activityList.innerHTML = '';
            
            stats.recentActivity.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.style.padding = '10px 0';
                activityItem.style.borderBottom = '1px solid #eee';
                
                activityItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${activity.action}</strong>
                            <p style="margin: 5px 0 0; color: #666;">${activity.details}</p>
                        </div>
                        <span style="color: #999; font-size: 0.9em;">${activity.time}</span>
                    </div>
                `;
                
                activityList.appendChild(activityItem);
            });
        }
    }
}

// Delete an item
function deleteItem(type, id) {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
        return;
    }
    
    // Map type to storage key
    const storageKey = type === 'course' ? 'courses' : 
                     type === 'bookmark' ? 'bookmarks' :
                     type === 'playlist' ? 'playlists' :
                     type === 'short' ? 'shorts' :
                     type === 'website' ? 'websites' :
                     type + 's'; // Default to plural form
    
    // Get items from local storage
    const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Find and remove the item
    const updatedItems = items.filter(item => item.id !== id);
    
    // Save back to local storage
    localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    
    // Show success message
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    
    // Reload the section data
    loadSectionData(storageKey);
}

// Edit an item
function editItem(type, id) {
    // In a real application, you would fetch the item data and populate the edit form
    console.log(`Editing ${type} with ID: ${id}`);
    
    // For now, just show the add modal with the type
    showAddModal(type);
    
    // In a real app, you would pre-fill the form with the item's data
    // and update the form submission to handle updates instead of creates
}

// Add CSS for modals
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #2c3e50;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #7f8c8d;
    }
    
    .close-modal:hover {
        color: #2c3e50;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .btn-secondary {
        background-color: #95a5a6;
        color: white;
    }
`;

document.head.appendChild(modalStyles);
