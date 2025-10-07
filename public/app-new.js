// ========================================
// FRUSTRATED THINKERS - LEARNING PLATFORM
// ========================================

// Global State
const state = {
  user: null,
  courses: [],
  currentCourse: null,
  currentModule: null,
  progress: {},
  quizAnswers: {}
};

// Utility Functions
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// API Helper
async function api(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

async function initApp() {
  // Set year in footer
  $('#year').textContent = new Date().getFullYear();
  
  // Animated hero text
  typeHeroText();
  
  // Initialize event listeners
  initEventListeners();
  
  // Check if user is logged in
  await checkAuth();
  
  // Load courses
  await loadCourses();
}

// Animated typing effect for hero
function typeHeroText() {
  const text = 'Welcome to Frustrated Thinkers!';
  const element = $('#animatedText');
  if (!element) return;
  
  let index = 0;
  function type() {
    if (index < text.length) {
      element.textContent = text.slice(0, index + 1);
      index++;
      setTimeout(type, 80);
    }
  }
  type();
}

// ========================================
// EVENT LISTENERS
// ========================================

function initEventListeners() {
  // Auth buttons
  $('#signInBtn')?.addEventListener('click', () => openModal('signIn'));
  $('#createAccountBtn')?.addEventListener('click', () => openModal('createAccount'));
  
  // Modal close buttons
  $('#closeSignIn')?.addEventListener('click', () => closeModal('signInModal'));
  $('#closeCreateAccount')?.addEventListener('click', () => closeModal('createAccountModal'));
  $('#closeQuiz')?.addEventListener('click', () => closeModal('quizModal'));
  
  // Auth form switches
  $('#switchToSignUp')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signInModal');
    openModal('createAccount');
  });
  $('#switchToSignIn')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('createAccountModal');
    openModal('signIn');
  });
  
  // Auth form submissions
  $('#signInForm')?.addEventListener('submit', handleSignIn);
  $('#createAccountForm')?.addEventListener('submit', handleCreateAccount);
  
  // Sidebar navigation
  $$('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      switchView(view);
      
      // Update active state
      $$('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
  
  // Mobile menu toggle
  $('#menuToggle')?.addEventListener('click', () => {
    $('#sidebar')?.classList.toggle('open');
  });
  
  // Course cards
  $$('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const courseId = card.getAttribute('data-course');
      openCourse(courseId);
    });
  });
  
  // Back to courses button
  $('#backToCourses')?.addEventListener('click', () => {
    switchView('home');
  });
}

// ========================================
// AUTHENTICATION
// ========================================

async function checkAuth() {
  try {
    const data = await api('/api/auth/me');
    if (data.user) {
      state.user = data.user;
      updateAuthUI();
      await loadProgress();
    }
  } catch (error) {
    // User not logged in
    state.user = null;
    updateAuthUI();
  }
}

async function handleSignIn(e) {
  e.preventDefault();
  
  const email = $('#signInEmail').value.trim();
  const password = $('#signInPassword').value;
  
  if (!email || !password) {
    alert('Please fill in all fields');
    return;
  }
  
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    state.user = data.user;
    updateAuthUI();
    closeModal('signInModal');
    await loadProgress();
    alert('Welcome back!');
  } catch (error) {
    alert(error.message || 'Sign in failed');
  }
}

async function handleCreateAccount(e) {
  e.preventDefault();
  
  const firstName = $('#firstName').value.trim();
  const lastName = $('#lastName').value.trim();
  const email = $('#signUpEmail').value.trim();
  const password = $('#signUpPassword').value;
  const confirmPassword = $('#confirmPassword').value;
  
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }
  
  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password
      })
    });
    
    state.user = data.user;
    updateAuthUI();
    closeModal('createAccountModal');
    await loadProgress();
    alert('Account created successfully! Welcome to Frustrated Thinkers!');
  } catch (error) {
    alert(error.message || 'Account creation failed');
  }
}

function updateAuthUI() {
  const authButtons = $('.auth-buttons');
  
  if (state.user) {
    // User is logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <span style="color: var(--acc1); font-weight: 600;">
          ${state.user.firstName || state.user.email}
        </span>
        <button id="logoutBtn" class="btn-auth">Logout</button>
      `;
      
      $('#logoutBtn')?.addEventListener('click', handleLogout);
    }
  } else {
    // User is not logged in
    if (authButtons) {
      authButtons.innerHTML = `
        <button id="signInBtn" class="btn-auth">Sign In</button>
        <button id="createAccountBtn" class="btn-auth primary">Create Account</button>
      `;
      
      $('#signInBtn')?.addEventListener('click', () => openModal('signIn'));
      $('#createAccountBtn')?.addEventListener('click', () => openModal('createAccount'));
    }
  }
}

async function handleLogout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
    state.user = null;
    state.progress = {};
    updateAuthUI();
    switchView('home');
    alert('Logged out successfully');
  } catch (error) {
    alert('Logout failed');
  }
}

// ========================================
// COURSES
// ========================================

async function loadCourses() {
  // For now, use hardcoded SQL and JavaScript courses
  state.courses = [
    {
      id: 'sql',
      title: 'SQL Course',
      summary: 'Master SQL from basics to advanced - 30 comprehensive modules',
      moduleCount: 30
    },
    {
      id: 'javascript',
      title: 'JavaScript Course',
      summary: 'Complete JavaScript mastery - 30 modules from scratch',
      moduleCount: 30
    }
  ];
}

async function openCourse(courseId) {
  // Check if user is logged in
  if (!state.user) {
    alert('Please sign in or create an account to access courses');
    openModal('signIn');
    return;
  }
  
  try {
    // Load course data
    const course = state.courses.find(c => c.id === courseId);
    if (!course) {
      alert('Course not found');
      return;
    }
    
    state.currentCourse = course;
    
    // Load modules from API
    const data = await api(`/api/courses/${courseId}`);
    state.currentCourse.modules = data.modules || [];
    
    // Render course detail view
    renderCourseDetail();
    switchView('course-detail');
    
  } catch (error) {
    console.error('Error loading course:', error);
    alert('Failed to load course. Please try again.');
  }
}

function renderCourseDetail() {
  const content = $('#courseDetailContent');
  if (!content || !state.currentCourse) return;
  
  const course = state.currentCourse;
  const modules = course.modules || [];
  
  content.innerHTML = `
    <h2>${course.title}</h2>
    <p style="opacity: 0.8; margin: 12px 0 24px 0;">
      ${course.summary}
    </p>
    <div class="modules-container">
      ${modules.map((module, index) => renderModuleCard(module, index)).join('')}
    </div>
  `;
  
  // Add event listeners to module cards
  $$('.module-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      const moduleId = card.getAttribute('data-module-id');
      openModule(moduleId, index);
    });
  });
}

function renderModuleCard(module, index) {
  const isLocked = isModuleLocked(index);
  const isCompleted = isModuleCompleted(module.id);
  
  return `
    <div class="module ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}" 
         data-module-id="${module.id}">
      <div class="module-title">
        <span>
          ${isCompleted ? '✅' : isLocked ? '🔒' : '📖'} 
          <b>${index + 1}. ${module.title}</b>
        </span>
        <span class="module-toggle">▼</span>
      </div>
      ${!isLocked ? `
        <div class="module-content">
          ${formatContent(module.content || 'Content coming soon...')}
          ${module.code ? `<div class="code-block"><pre><code>${escapeHtml(module.code)}</code></pre></div>` : ''}
        </div>
        <div class="quiz">
          ${module.quiz && module.quiz.length > 0 ? 
            `<button class="btn primary" onclick="startQuiz('${module.id}')">Take Quiz</button>` :
            `<button class="btn secondary" onclick="markComplete('${module.id}')">Mark Complete</button>`
          }
        </div>
      ` : `
        <div class="module-content">
          <p style="opacity: 0.6;">🔒 Complete previous modules to unlock</p>
        </div>
      `}
    </div>
  `;
}

function isModuleLocked(index) {
  if (index === 0) return false; // First module always unlocked
  
  const modules = state.currentCourse?.modules || [];
  const previousModule = modules[index - 1];
  
  if (!previousModule) return false;
  
  return !isModuleCompleted(previousModule.id);
}

function isModuleCompleted(moduleId) {
  const courseId = state.currentCourse?.id;
  if (!courseId) return false;
  
  return state.progress[courseId]?.completedModules?.includes(moduleId) || false;
}

function openModule(moduleId, index) {
  if (isModuleLocked(index)) {
    alert('Please complete previous modules first');
    return;
  }
  
  const moduleCard = $(`.module[data-module-id="${moduleId}"]`);
  if (moduleCard) {
    moduleCard.classList.toggle('expanded');
    
    // Highlight code if expanded
    if (moduleCard.classList.contains('expanded')) {
      moduleCard.querySelectorAll('pre code').forEach(block => {
        if (typeof hljs !== 'undefined') {
          hljs.highlightElement(block);
        }
      });
    }
  }
}

// ========================================
// QUIZ SYSTEM
// ========================================

window.startQuiz = function(moduleId) {
  const module = state.currentCourse?.modules.find(m => m.id === moduleId);
  if (!module || !module.quiz) {
    alert('Quiz not available');
    return;
  }
  
  state.currentModule = module;
  state.quizAnswers = {};
  
  renderQuiz(module.quiz);
  openModal('quiz');
};

function renderQuiz(questions) {
  const quizContent = $('#quizContent');
  if (!quizContent) return;
  
  quizContent.innerHTML = questions.map((q, index) => {
    if (q.type === 'mcq') {
      return `
        <div class="quiz-question">
          <h4>Question ${index + 1}: ${q.question}</h4>
          ${q.options.map((option, i) => `
            <label>
              <input type="radio" name="q${index}" value="${i}" />
              ${option}
            </label>
          `).join('')}
        </div>
      `;
    } else if (q.type === 'fill') {
      return `
        <div class="quiz-question">
          <h4>Question ${index + 1}: ${q.question}</h4>
          <input type="text" id="fill${index}" placeholder="Your answer" />
        </div>
      `;
    } else if (q.type === 'coding') {
      return `
        <div class="quiz-question">
          <h4>Question ${index + 1}: ${q.question}</h4>
          <textarea id="code${index}" rows="4" placeholder="Write your code here..." 
                    style="width:100%; padding:12px; background:rgba(0,0,0,.3); 
                    border:1px solid rgba(0,212,255,.3); border-radius:8px; 
                    color:var(--text); font-family:'Fira Code',monospace;"></textarea>
        </div>
      `;
    }
  }).join('');
  
  // Show quiz modal
  $('#quizResults').classList.add('hidden');
  $('#submitQuiz').onclick = submitQuiz;
}

function submitQuiz() {
  const quiz = state.currentModule?.quiz;
  if (!quiz) return;
  
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const total = quiz.length;
  
  quiz.forEach((q, index) => {
    if (q.type === 'mcq') {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      if (!selected) {
        skipped++;
      } else if (parseInt(selected.value) === q.correct) {
        correct++;
      } else {
        wrong++;
      }
    } else if (q.type === 'fill') {
      const answer = $(`#fill${index}`)?.value.trim().toLowerCase();
      if (!answer) {
        skipped++;
      } else if (answer === q.answer.toLowerCase()) {
        correct++;
      } else {
        wrong++;
      }
    } else if (q.type === 'coding') {
      const code = $(`#code${index}`)?.value.trim();
      if (!code) {
        skipped++;
      } else {
        // Simple check - in real app, would need proper code validation
        const expectedCode = q.answer.toLowerCase().replace(/\s+/g, '');
        const userCode = code.toLowerCase().replace(/\s+/g, '');
        if (userCode.includes(expectedCode) || expectedCode.includes(userCode)) {
          correct++;
        } else {
          wrong++;
        }
      }
    }
  });
  
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= 60;
  
  // Show results
  const resultsDiv = $('#quizResults');
  resultsDiv.innerHTML = `
    <h3>${passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h3>
    <div class="stat-grid" style="margin-top: 20px;">
      <div class="stat-item">
        <div class="stat-value">${total}</div>
        <div class="stat-label">Total Questions</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" style="color: #10b981;">${correct}</div>
        <div class="stat-label">Correct</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" style="color: #ef4444;">${wrong}</div>
        <div class="stat-label">Wrong</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" style="color: #f59e0b;">${skipped}</div>
        <div class="stat-label">Skipped</div>
      </div>
    </div>
    <div style="margin-top: 24px; text-align: center;">
      <div style="font-size: 3rem; font-weight: 800; color: var(--acc1);">${percentage}%</div>
      <div style="opacity: 0.8; margin-top: 8px;">
        ${passed ? 'You passed! Module completed.' : 'Score at least 60% to pass.'}
      </div>
    </div>
  `;
  resultsDiv.classList.remove('hidden');
  
  // Update progress if passed
  if (passed) {
    markModuleComplete(state.currentModule.id);
  }
}

// ========================================
// PROGRESS TRACKING
// ========================================

async function loadProgress() {
  if (!state.user) return;
  
  try {
    const data = await api('/api/progress');
    state.progress = data.progress || {};
    updateDashboard();
  } catch (error) {
    console.error('Error loading progress:', error);
  }
}

async function markModuleComplete(moduleId) {
  if (!state.user || !state.currentCourse) return;
  
  try {
    await api('/api/progress/complete', {
      method: 'POST',
      body: JSON.stringify({
        courseId: state.currentCourse.id,
        moduleId: moduleId
      })
    });
    
    // Update local state
    const courseId = state.currentCourse.id;
    if (!state.progress[courseId]) {
      state.progress[courseId] = { completedModules: [] };
    }
    if (!state.progress[courseId].completedModules.includes(moduleId)) {
      state.progress[courseId].completedModules.push(moduleId);
    }
    
    // Refresh course view
    renderCourseDetail();
    updateDashboard();
    
  } catch (error) {
    console.error('Error marking module complete:', error);
  }
}

window.markComplete = markModuleComplete;

function updateDashboard() {
  const dashboardContent = $('#dashboardContent');
  if (!dashboardContent) return;
  
  const sqlProgress = state.progress['sql'] || { completedModules: [] };
  const jsProgress = state.progress['javascript'] || { completedModules: [] };
  
  const sqlCompleted = sqlProgress.completedModules.length;
  const jsCompleted = jsProgress.completedModules.length;
  const totalCompleted = sqlCompleted + jsCompleted;
  const totalModules = 60; // 30 SQL + 30 JS
  
  dashboardContent.innerHTML = `
    <div class="dashboard-card">
      <h3>📊 Your Progress</h3>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">${totalCompleted}</div>
          <div class="stat-label">Modules Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Math.round((totalCompleted/totalModules)*100)}%</div>
          <div class="stat-label">Overall Progress</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${sqlCompleted}/30</div>
          <div class="stat-label">SQL Modules</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${jsCompleted}/30</div>
          <div class="stat-label">JavaScript Modules</div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-card">
      <h3>📚 Course Progress</h3>
      <div style="margin-top: 16px;">
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>SQL Course</span>
            <span>${sqlCompleted}/30</span>
          </div>
          <div class="progressbar">
            <span style="width: ${(sqlCompleted/30)*100}%"></span>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>JavaScript Course</span>
            <span>${jsCompleted}/30</span>
          </div>
          <div class="progressbar">
            <span style="width: ${(jsCompleted/30)*100}%"></span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Update enrolled courses
  updateEnrolledCourses();
  updateCompletedModules();
  updateProfile();
}

function updateEnrolledCourses() {
  const enrolledDiv = $('#enrolledCourses');
  if (!enrolledDiv) return;
  
  const sqlProgress = state.progress['sql'] || { completedModules: [] };
  const jsProgress = state.progress['javascript'] || { completedModules: [] };
  
  enrolledDiv.innerHTML = `
    <div class="enrolled-item">
      <div>
        <strong>SQL Course</strong>
        <div style="opacity: 0.7; font-size: 0.9rem;">
          ${sqlProgress.completedModules.length}/30 modules completed
        </div>
      </div>
      <button class="btn primary" onclick="window.location.reload(); setTimeout(() => document.querySelector('[data-course=sql]').click(), 100)">
        Continue
      </button>
    </div>
    <div class="enrolled-item">
      <div>
        <strong>JavaScript Course</strong>
        <div style="opacity: 0.7; font-size: 0.9rem;">
          ${jsProgress.completedModules.length}/30 modules completed
        </div>
      </div>
      <button class="btn primary" onclick="window.location.reload(); setTimeout(() => document.querySelector('[data-course=javascript]').click(), 100)">
        Continue
      </button>
    </div>
  `;
}

function updateCompletedModules() {
  const completedDiv = $('#completedModules');
  if (!completedDiv) return;
  
  const sqlProgress = state.progress['sql'] || { completedModules: [] };
  const jsProgress = state.progress['javascript'] || { completedModules: [] };
  
  const allCompleted = [
    ...sqlProgress.completedModules.map(id => ({ course: 'SQL', id })),
    ...jsProgress.completedModules.map(id => ({ course: 'JavaScript', id }))
  ];
  
  if (allCompleted.length === 0) {
    completedDiv.innerHTML = '<p style="opacity: 0.6; padding: 20px;">No modules completed yet. Start learning!</p>';
    return;
  }
  
  completedDiv.innerHTML = allCompleted.map(item => `
    <div class="completed-item">
      <div>
        <strong>${item.course} - ${item.id}</strong>
      </div>
      <span style="color: #10b981;">✅ Completed</span>
    </div>
  `).join('');
}

function updateProfile() {
  const profileDiv = $('#profileInfo');
  if (!profileDiv || !state.user) return;
  
  profileDiv.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--acc1), var(--acc2)); 
                  margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 800; color: #0a0e27;">
        ${(state.user.firstName?.[0] || state.user.email[0]).toUpperCase()}
      </div>
      <h3 style="color: var(--acc1); margin-bottom: 8px;">
        ${state.user.firstName || ''} ${state.user.lastName || ''}
      </h3>
      <p style="opacity: 0.7;">${state.user.email}</p>
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,.08);">
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-value">${(state.progress['sql']?.completedModules?.length || 0) + (state.progress['javascript']?.completedModules?.length || 0)}</div>
            <div class="stat-label">Modules Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">2</div>
            <div class="stat-label">Courses Enrolled</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// UI HELPERS
// ========================================

function switchView(viewName) {
  // Hide all views
  $$('.view-section').forEach(view => view.classList.remove('active'));
  
  // Show selected view
  const targetView = $(`#view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  // Update dashboard if switching to it
  if (viewName === 'dashboard' && state.user) {
    updateDashboard();
  }
}

function openModal(modalType) {
  if (modalType === 'signIn') {
    $('#signInModal')?.classList.remove('hidden');
  } else if (modalType === 'createAccount') {
    $('#createAccountModal')?.classList.remove('hidden');
  } else if (modalType === 'quiz') {
    $('#quizModal')?.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  $(`#${modalId}`)?.classList.add('hidden');
}

function formatContent(content) {
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available
window.openCourse = openCourse;
