const state = {
  user: null,
  courses: [],
  selectedCourse: null,
  modules: [],
  progress: {},
  currentView: 'home'
};

const el = sel => document.querySelector(sel);
const els = sel => Array.from(document.querySelectorAll(sel));

// Animated Hero Text
const animatedText = 'Hello, Welcome Thinkers!';
function typeText(idx = 0) {
  if (idx <= animatedText.length) {
    el('#animatedText').textContent = animatedText.slice(0, idx);
    requestAnimationFrame(() => setTimeout(() => typeText(idx + 1), 60));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  typeText();
  el('#year').textContent = new Date().getFullYear();
  fetchCourses();
  getMe();
  initSidebar();
  initFooterLinks();
});

async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function fetchCourses() {
  const data = await api('/api/courses/list');
  state.courses = data.courses;
  renderCourses();
}

function renderCourses() {
  const grid = el('#coursesGrid');
  grid.innerHTML = '';
  state.courses.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${c.image}" alt="${c.title}" class="card-image" onerror="this.src='https://via.placeholder.com/400x250/1a1f3a/00d4ff?text=${encodeURIComponent(c.title)}'" />
      <div class="card-body">
        <div class="title">${c.title}</div>
        <div class="summary">${c.summary}</div>
        <button class="btn primary cta">Enroll</button>
      </div>
    `;
    card.querySelector('.cta').addEventListener('click', () => onOpenCourse(c));
    grid.appendChild(card);
  });
}

async function onOpenCourse(course) {
  if (!state.user) {
    openModal(signInPrompt(course));
    return;
  }
  state.selectedCourse = course;
  const data = await api(`/api/courses/${course.id}/modules`);
  state.modules = data.modules;
  renderModules();
}

function signInPrompt(course) {
  return `
    <h3>👉 Sign in to get this course.</h3>
    <p>Access modules and quizzes for <b>${course.title}</b>.</p>
    <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap">
      <button class="btn primary" id="goSignIn">Sign in</button>
      <button class="btn ghost" id="cancel">Cancel</button>
    </div>
  `;
}

function openModal(contentHtml) {
  el('#modalBody').innerHTML = contentHtml;
  el('#modal').classList.remove('hidden');
  el('#closeModal').onclick = closeModal;
  const cancel = el('#cancel');
  if (cancel) cancel.onclick = closeModal;
  const go = el('#goSignIn');
  if (go) go.onclick = () => showEmailForm();
}
function closeModal(){ el('#modal').classList.add('hidden'); }

function showEmailForm() {
  el('#modalBody').innerHTML = `
    <h3>Sign in</h3>
    <label>Email</label>
    <input id="email" type="email" placeholder="you@example.com" style="width:100%;padding:10px;border-radius:8px;margin-top:6px"/>
    <div style="margin-top:12px">
      <button class="btn primary" id="sendOtp">Send OTP</button>
    </div>
  `;
  el('#sendOtp').onclick = async () => {
    const email = el('#email').value.trim();
    if (!email) return alert('Enter email');
    try {
      await api('/api/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) });
      showOtpForm(email);
    } catch (e) { alert(e.message); }
  };
}

function showOtpForm(email) {
  el('#modalBody').innerHTML = `
    <h3>Enter OTP</h3>
    <p>We sent a 6-digit code to <b>${email}</b>.</p>
    <input id="otp" type="text" placeholder="123456" maxlength="6" style="width:140px;padding:10px;border-radius:8px"/>
    <div style="margin-top:12px">
      <button class="btn primary" id="verifyOtp">Verify</button>
    </div>
  `;
  el('#verifyOtp').onclick = async () => {
    const otp = el('#otp').value.trim();
    if (otp.length !== 6) return alert('Invalid OTP');
    try {
      await api('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) });
      showSetPassword(email);
    } catch (e) { alert(e.message); }
  };
}

function showSetPassword(email) {
  el('#modalBody').innerHTML = `
    <h3>Create Password</h3>
    <label>Name</label>
    <input id="name" type="text" placeholder="Your name" style="width:100%;padding:10px;border-radius:8px;margin:6px 0"/>
    <label>Password</label>
    <input id="password" type="password" placeholder="••••••" style="width:100%;padding:10px;border-radius:8px"/>
    <div style="margin-top:12px">
      <button class="btn primary" id="finish">Complete Registration</button>
    </div>
  `;
  el('#finish').onclick = async () => {
    const password = el('#password').value;
    const name = el('#name').value;
    if ((password||'').length < 6) return alert('Password too short');
    try {
      const { user } = await api('/api/auth/set-password', { method: 'POST', body: JSON.stringify({ email, password, name }) });
      state.user = user; closeModal(); updateUserUI();
    } catch (e) { alert(e.message); }
  };
}

async function getMe() {
  try {
    const { user } = await api('/api/auth/me');
    state.user = user; updateUserUI();
    if (user) loadProgress();
  } catch {}
}

async function loadProgress(){
  const { progress } = await api('/api/progress');
  state.progress = progress; renderProgress();
}

function updateUserUI(){
  const info = el('#userInfo');
  if (!state.user) { info.innerHTML = 'Not signed in.'; return; }
  info.innerHTML = `Signed in as <b>${state.user.name || state.user.email}</b>`;
}

function renderModules(){
  const detailView = el('#view-course-detail');
  const content = el('#courseDetailContent');
  content.innerHTML = `<h2>${state.selectedCourse.title}</h2><p style="opacity:.8;margin-top:8px">Click on any module to expand and view content</p>`;
  
  const container = document.createElement('div');
  container.className = 'modules';
  
  state.modules.forEach((m, idx) => {
    const mod = document.createElement('div');
    mod.className = 'module';
    mod.setAttribute('data-module-id', m.id);
    
    const contentHtml = formatModuleContent(m.content);
    
    if (m.quiz && m.quiz.length > 0) {
      mod.innerHTML = `
        <div class="module-title">
          <span><b>${idx + 1}. ${m.title}</b></span>
          <span class="module-toggle">▼</span>
        </div>
        <div class="module-content">${contentHtml}</div>
        <div class="quiz">
          <h4>📝 Quiz</h4>
          <p><strong>${m.quiz[0].q}</strong></p>
          ${m.quiz[0].a.map((ans,i)=>`<label><input type='radio' name='q-${m.id}' value='${i}'/> ${ans}</label>`).join('')}
          <button class='btn secondary' data-mid='${m.id}'>Submit Answer</button>
        </div>
      `;
    } else {
      mod.innerHTML = `
        <div class="module-title">
          <span><b>${idx + 1}. ${m.title}</b></span>
          <span class="module-toggle">▼</span>
        </div>
        <div class="module-content">${contentHtml}</div>
        <div class="quiz">
          <button class='btn primary' data-mid='${m.id}' onclick='markModuleComplete("${m.id}")'>✓ Mark Complete</button>
        </div>
      `;
    }
    
    // Toggle expand/collapse
    mod.querySelector('.module-title').addEventListener('click', () => {
      mod.classList.toggle('expanded');
      if (mod.classList.contains('expanded')) {
        // Highlight code blocks when expanded
        mod.querySelectorAll('pre code').forEach(block => {
          if (typeof hljs !== 'undefined') hljs.highlightElement(block);
        });
      }
    });
    
    container.appendChild(mod);
  });
  
  content.appendChild(container);
  switchView('course-detail');
  
  els('.quiz button').forEach(btn => btn.addEventListener('click', onSubmitQuiz));
}

function formatModuleContent(content) {
  // Check if content has code blocks marked with ```
  if (content.includes('```')) {
    return content.split('```').map((part, i) => {
      if (i % 2 === 1) {
        // This is a code block
        const lines = part.split('\n');
        const lang = lines[0].trim() || 'javascript';
        const code = lines.slice(1).join('\n');
        return `<div class="code-block">
          <button class="copy-btn" onclick="copyCode(this)">Copy</button>
          <pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>
        </div>`;
      }
      return part.replace(/\n/g, '<br>');
    }).join('');
  }
  return content.replace(/\n/g, '<br>');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function copyCode(btn) {
  const code = btn.nextElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

async function onSubmitQuiz(e){
  const btn = e.currentTarget;
  const moduleId = btn.getAttribute('data-mid');
  const m = state.modules.find(x=>x.id===moduleId);
  const sel = document.querySelector(`input[name='q-${m.id}']:checked`);
  if (!sel) return alert('Select an answer');
  const correct = Number(sel.value) === m.quiz[0].correct;
  alert(correct ? 'Correct! ✅' : 'Incorrect ❌');
  await api('/api/progress/update', { method:'POST', body: JSON.stringify({ courseId: state.selectedCourse.id, moduleId: m.id, quizPassed: correct }) });
  loadProgress();
  checkAllComplete();
}

function renderProgress(){
  // This is called to update progress displays across views
  renderEnrolledCourses();
  renderCompletedModules();
}

function checkAllComplete(){
  if (!state.selectedCourse) return;
  const courseProg = state.progress[state.selectedCourse.id] || { completedModules:{} };
  const completedCount = Object.keys(courseProg.completedModules).length;
  if (completedCount === state.modules.length && state.modules.length>0) {
    issueCertificate();
  }
}

async function issueCertificate(){
  await api('/api/progress/certificate/issue', { method:'POST', body: JSON.stringify({ courseId: state.selectedCourse.id }) });
  drawCertificate();
}

function drawCertificate(){
  const canvas = el('#certificateCanvas');
  const ctx = canvas.getContext('2d');
  canvas.classList.remove('hidden');

  // Background
  const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  grad.addColorStop(0,'#0b2249'); grad.addColorStop(1,'#7f5af0');
  ctx.fillStyle = grad; ctx.fillRect(0,0,canvas.width,canvas.height);

  // Frame
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 6; ctx.strokeRect(30,30,canvas.width-60,canvas.height-60);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 60px Orbitron, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Completion', canvas.width/2, 180);

  // Name
  ctx.font = '28px Inter, Arial';
  ctx.fillText('Awarded to', canvas.width/2, 260);
  ctx.font = 'bold 44px Inter, Arial';
  ctx.fillText(state.user?.name || state.user?.email || 'Thinker', canvas.width/2, 320);

  // Course
  ctx.font = '26px Inter, Arial';
  ctx.fillText(`for completing ${state.selectedCourse.title}`, canvas.width/2, 380);

  // Date
  ctx.font = '22px Inter, Arial';
  ctx.fillText(new Date().toDateString(), canvas.width/2, 440);

  // Signature
  ctx.font = '20px Inter, Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Thinkers Academy', 100, canvas.height - 120);
  ctx.beginPath(); ctx.moveTo(100, canvas.height - 110); ctx.lineTo(320, canvas.height - 110); ctx.stroke();

  const link = el('#downloadCert');
  link.href = canvas.toDataURL('image/png');
  link.classList.remove('hidden');
}

// Sidebar Navigation
function initSidebar() {
  const menuToggle = el('#menuToggle');
  const sidebar = el('#sidebar');
  const sidebarLinks = els('.sidebar-link');
  const backBtn = el('#backToCourses');
  
  menuToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      switchView(view);
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 768) sidebar.classList.remove('open');
    });
  });
  
  backBtn?.addEventListener('click', () => {
    switchView('home');
  });
}

function switchView(viewName) {
  state.currentView = viewName;
  els('.view-section').forEach(v => v.classList.remove('active'));
  const targetView = el(`#view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active');
    
    // Load data for specific views
    if (viewName === 'account') renderAccountInfo();
    if (viewName === 'enrolled') renderEnrolledCourses();
    if (viewName === 'completed') renderCompletedModules();
  }
}

function renderAccountInfo() {
  const container = el('#accountInfo');
  if (!state.user) {
    container.innerHTML = `
      <p>You are not signed in.</p>
      <button class="btn primary" onclick="showEmailForm(); openModal('');">Sign In</button>
    `;
    return;
  }
  
  const enrolledCount = Object.keys(state.progress).length;
  let totalCompleted = 0;
  Object.values(state.progress).forEach(p => {
    totalCompleted += Object.keys(p.completedModules || {}).length;
  });
  
  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:20px; margin-bottom:24px">
      <div style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,var(--acc1),var(--acc2)); display:flex; align-items:center; justify-content:center; font-size:2rem">
        ${(state.user.name || 'U')[0].toUpperCase()}
      </div>
      <div>
        <h3 style="margin-bottom:8px">${state.user.name || 'Thinker'}</h3>
        <p style="opacity:.8">${state.user.email}</p>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px">
      <div class="progress-card">
        <h4 style="color:var(--acc1)">Courses Enrolled</h4>
        <p style="font-size:2rem; font-weight:700">${enrolledCount}</p>
      </div>
      <div class="progress-card">
        <h4 style="color:var(--acc1)">Modules Completed</h4>
        <p style="font-size:2rem; font-weight:700">${totalCompleted}</p>
      </div>
    </div>
  `;
}

function renderEnrolledCourses() {
  const container = el('#enrolledCourses');
  if (!state.user) {
    container.innerHTML = '<p>Please sign in to view enrolled courses.</p>';
    return;
  }
  
  const enrolled = Object.keys(state.progress);
  if (enrolled.length === 0) {
    container.innerHTML = '<p>You have not enrolled in any courses yet.</p>';
    return;
  }
  
  container.innerHTML = '';
  enrolled.forEach(courseId => {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    
    const prog = state.progress[courseId];
    const completed = Object.keys(prog.completedModules || {}).length;
    const total = 15; // Each course has 15 modules
    const pct = Math.round((completed / total) * 100);
    
    const item = document.createElement('div');
    item.className = 'enrolled-item';
    item.innerHTML = `
      <div>
        <h4 style="color:var(--acc1); margin-bottom:6px">${course.title}</h4>
        <div class="progressbar" style="width:200px"><span style="width:${pct}%"></span></div>
        <p style="opacity:.8; margin-top:6px">${completed}/${total} modules</p>
      </div>
      <button class="btn primary" onclick="openCourseById('${courseId}')">Continue</button>
    `;
    container.appendChild(item);
  });
}

function renderCompletedModules() {
  const container = el('#completedModules');
  if (!state.user) {
    container.innerHTML = '<p>Please sign in to view completed modules.</p>';
    return;
  }
  
  const allCompleted = [];
  Object.keys(state.progress).forEach(courseId => {
    const course = state.courses.find(c => c.id === courseId);
    const prog = state.progress[courseId];
    Object.keys(prog.completedModules || {}).forEach(moduleId => {
      allCompleted.push({
        courseTitle: course?.title || courseId,
        moduleId,
        completedAt: prog.completedModules[moduleId].completedAt
      });
    });
  });
  
  if (allCompleted.length === 0) {
    container.innerHTML = '<p>No modules completed yet. Start learning!</p>';
    return;
  }
  
  allCompleted.sort((a, b) => b.completedAt - a.completedAt);
  
  container.innerHTML = '';
  allCompleted.forEach(item => {
    const div = document.createElement('div');
    div.className = 'completed-item';
    div.innerHTML = `
      <div>
        <h4 style="color:var(--acc1)">${item.courseTitle}</h4>
        <p style="opacity:.8">Module: ${item.moduleId}</p>
      </div>
      <span style="opacity:.7">${new Date(item.completedAt).toLocaleDateString()}</span>
    `;
    container.appendChild(div);
  });
}

async function openCourseById(courseId) {
  const course = state.courses.find(c => c.id === courseId);
  if (course) {
    await onOpenCourse(course);
  }
}

async function markModuleComplete(moduleId) {
  if (!state.user || !state.selectedCourse) return;
  await api('/api/progress/update', { 
    method:'POST', 
    body: JSON.stringify({ 
      courseId: state.selectedCourse.id, 
      moduleId, 
      quizPassed: true 
    }) 
  });
  alert('Module marked as complete! ✅');
  loadProgress();
  checkAllComplete();
}

// Footer Links
function initFooterLinks() {
  el('#linkDisclaimer')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(`
      <h3>Disclaimer</h3>
      <p style="line-height:1.8; opacity:.9">
        The content provided on Thinkers Academy is for educational purposes only. 
        While we strive to provide accurate and up-to-date information, we make no 
        representations or warranties of any kind about the completeness, accuracy, 
        or reliability of the content. Any reliance you place on such information is 
        strictly at your own risk.
      </p>
    `);
  });
  
  el('#linkPrivacy')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(`
      <h3>Privacy Policy</h3>
      <p style="line-height:1.8; opacity:.9">
        We respect your privacy. Your email and personal information are used solely 
        for authentication and course progress tracking. We do not share your data 
        with third parties. All data is stored securely and you can request deletion 
        at any time by contacting support.
      </p>
    `);
  });
  
  el('#linkTerms')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(`
      <h3>Terms of Service</h3>
      <p style="line-height:1.8; opacity:.9">
        By using Thinkers Academy, you agree to use the platform for lawful educational 
        purposes only. You are responsible for maintaining the confidentiality of your 
        account. We reserve the right to modify or terminate the service at any time. 
        All course content is the property of Thinkers Academy and may not be redistributed 
        without permission.
      </p>
    `);
  });
}
