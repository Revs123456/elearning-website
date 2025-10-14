// Initialize users array from localStorage or empty array if not exists
let users = [];
try {
    const storedUsers = localStorage.getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
} catch (e) {
    console.error('Error loading users from localStorage:', e);
    users = [];
}

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility for all password fields
    function setupPasswordToggles() {
        // Process all password inputs
        document.querySelectorAll('.password-input').forEach(container => {
            // Remove any existing toggle buttons
            const existingIcons = container.querySelectorAll('.toggle-password');
            existingIcons.forEach(icon => icon.remove());
            
            const input = container.querySelector('input[type="password"], input[type="text"]');
            if (!input) return;
            
            // Create and append the eye icon
            const icon = document.createElement('i');
            icon.className = 'fas fa-eye toggle-password';
            container.appendChild(icon);
            
            // Add click handler for the icon
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                this.className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'} toggle-password`;
            });
        });
    }
    
    // Initialize password toggles
    setupPasswordToggles();
    
    // Re-initialize toggles when switching between forms
    document.querySelectorAll('.toggle-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            // Small delay to ensure DOM is updated
            setTimeout(setupPasswordToggles, 10);
        });
    });

    // Toggle between Login and Register forms
    const toggleButtons = document.querySelectorAll('.toggle-buttons button');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formContainer = document.querySelector('.form-container');

    // Show login form by default
    if (loginForm) loginForm.style.display = 'block';
    if (registerForm) registerForm.style.display = 'none';
    if (formContainer) formContainer.setAttribute('data-form', 'login');
    
    // Function to handle form switching
    function switchForm(isLogin) {
        // Update active button
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        toggleButtons[isLogin ? 0 : 1].classList.add('active');
        
        // Toggle forms
        if (loginForm) loginForm.style.display = isLogin ? 'block' : 'none';
        if (registerForm) registerForm.style.display = isLogin ? 'none' : 'block';
        if (formContainer) formContainer.setAttribute('data-form', isLogin ? 'login' : 'register');
        
        // Reset initialization flags for password toggles
        document.querySelectorAll('.password-input').forEach(container => {
            container.removeAttribute('data-toggle-initialized');
        });
        
        // Reinitialize password toggles
        setupPasswordToggles();
    }
    
    // Set up button click handlers
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            switchForm(index === 0); // true for login, false for register
            // Reinitialize password toggles after a small delay
            setTimeout(setupPasswordToggles, 10);
        });
    });
    
    // Initialize remember me from localStorage
    const rememberCheckbox = document.getElementById('remember');
    const usernameInput = document.getElementById('username');
    
    // Load saved credentials if remember me was checked
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('savedUsername');
        if (rememberCheckbox && usernameInput && savedUsername) {
            rememberCheckbox.checked = true;
            usernameInput.value = savedUsername;
        }
    }
    
    // Save username when remember me is checked
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            localStorage.setItem('rememberMe', this.checked);
            if (this.checked && usernameInput.value) {
                localStorage.setItem('savedUsername', usernameInput.value);
            } else {
                localStorage.removeItem('savedUsername');
            }
        });
    }
    
    // Save username on input if remember me is checked
    if (usernameInput) {
        usernameInput.addEventListener('input', function() {
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('savedUsername', this.value);
            }
        });
    }

    // Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        setTimeout(() => errorElement.classList.remove('show'), 3000); // Hide after 3 seconds
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message, .form-error').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Handle remember me
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedUsername', username);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
        }
        
        // Simple validation
        if (!username) {
            showError('loginError', 'Please enter your username');
            return;
        }
        
        if (!password) {
            showError('passwordError', 'Please enter your password');
            return;
        }
        
        // Check if any users exist
        if (users.length === 0) {
            showError('loginError', 'No registered users found. Please register first.');
            return;
        }
        
        // Find user (case-insensitive username comparison)
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
        
        if (user) {
            // Store user session
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Store remember me preference
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            
            console.log('Login successful, redirecting to dashboard...');
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            return;
        } else {
            console.log('Login failed - invalid credentials');
            showError('loginError', 'Invalid username or password');
        }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();
            
            const newUsername = document.getElementById('newUsername').value.trim();
            const email = document.getElementById('email').value.trim();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            let hasError = false;
            
            // Validation
            if (!newUsername) {
                showError('newUsernameError', 'Username is required');
                hasError = true;
            } else if (users.some(u => u.username === newUsername)) {
                showError('newUsernameError', 'Username already exists');
                hasError = true;
            }
            
            if (!email) {
                showError('emailError', 'Email is required');
                hasError = true;
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                showError('emailError', 'Please enter a valid email');
                hasError = true;
            }
            
            if (!newPassword) {
                showError('newPasswordError', 'Password is required');
                hasError = true;
            } else if (newPassword.length < 6) {
                showError('newPasswordError', 'Password must be at least 6 characters');
                hasError = true;
            }
            
            if (!confirmPassword) {
                showError('confirmPasswordError', 'Please confirm your password');
                hasError = true;
            } else if (newPassword !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                hasError = true;
            }
            
            if (hasError) return;
            
            // Add new user
            users.push({
                username: newUsername,
                email: email,
                password: newPassword
            });
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please login.');
            
            // Switch to login form and clear form
            document.querySelector('.toggle-buttons button:first-child')?.click();
            registerForm.reset();
        });
    }

    // Check if user is already logged in (for dashboard)
    if (window.location.pathname.includes('dashboard.html')) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = 'index.html';
        } else {
            const username = localStorage.getItem('username');
            const welcomeMessage = document.querySelector('.welcome-text');
            if (welcomeMessage && username) {
                welcomeMessage.textContent = `Welcome back, ${username}! You have successfully logged in to Tech_Champs_By_Rev!`;
            }
        }
    }

    // Handle logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'index.html';
        });
    }
});
