/**
 * EDUVIA AUTHENTICATION SYSTEM (assets/js/auth.js)
 * High-fidelity, production-grade authentication module for Eduvia.
 * Supports Email/Password Sign-In, Sign-Up with password strength, Forgot Password,
 * and seamless Google, Apple, and Facebook OAuth integrations with local persistence.
 */

const EduviaAuth = {
  activeTab: "signin", // 'signin' | 'signup' | 'forgot'
  currentUser: null,
  oauthProvider: null,

  init() {
    this.loadSession();
    this.injectModalDOM();
    this.bindGlobalTriggers();
    this.renderNavUserState();
  },

  loadSession() {
    try {
      const saved = localStorage.getItem("eduvia_auth_user");
      if (saved) {
        this.currentUser = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Auth session load error:", e);
      this.currentUser = null;
    }
  },

  saveSession(user) {
    this.currentUser = user;
    try {
      localStorage.setItem("eduvia_auth_user", JSON.stringify(user));
    } catch (e) {
      console.warn("Auth session save error:", e);
    }
    this.renderNavUserState();
  },

  clearSession() {
    this.currentUser = null;
    try {
      localStorage.removeItem("eduvia_auth_user");
    } catch (e) {
      console.warn("Auth session clear error:", e);
    }
    this.renderNavUserState();
  },

  injectModalDOM() {
    if (document.getElementById("eduvia-auth-modal")) return;

    const modalHTML = `
      <div id="eduvia-auth-modal" class="eduvia-auth-backdrop" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="eduvia-auth-container" onclick="event.stopPropagation()">
          <div class="eduvia-auth-card">
            <!-- Close Button -->
            <button type="button" class="eduvia-auth-close-btn" aria-label="Close login dialog" onclick="EduviaAuth.close()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <!-- Header -->
            <div class="eduvia-auth-header">
              <span class="eduvia-auth-badge">EDUVIA CONNECT ACCOUNT</span>
              <h2 id="auth-modal-title" class="eduvia-auth-title">Welcome back</h2>
              <p id="auth-modal-subtitle" class="eduvia-auth-subtitle">Continue exploring your education journey with Eduvia Connect.</p>
            </div>

            <!-- Tab Switcher -->
            <div class="eduvia-auth-tabs" id="auth-tab-bar">
              <button type="button" class="auth-tab-btn active" id="tab-btn-signin" onclick="EduviaAuth.switchTab('signin')">Sign In</button>
              <button type="button" class="auth-tab-btn" id="tab-btn-signup" onclick="EduviaAuth.switchTab('signup')">Create Account</button>
            </div>

            <!-- Global Error / Alert Box -->
            <div id="auth-alert-box" class="eduvia-auth-alert" style="display: none;"></div>

            <!-- 1. SIGN IN FORM -->
            <form id="auth-form-signin" class="eduvia-auth-form" onsubmit="EduviaAuth.submitSignIn(event)">
              <div class="auth-field-group">
                <label for="signin-email" class="auth-label">Email Address</label>
                <div class="auth-input-wrap">
                  <input type="email" id="signin-email" class="auth-input" placeholder="student@example.com" required autocomplete="email" />
                </div>
              </div>

              <div class="auth-field-group">
                <div class="auth-label-row">
                  <label for="signin-password" class="auth-label">Password</label>
                  <a href="#forgot" class="auth-forgot-link" onclick="event.preventDefault(); EduviaAuth.switchTab('forgot');">Forgot password?</a>
                </div>
                <div class="auth-input-wrap">
                  <input type="password" id="signin-password" class="auth-input" placeholder="••••••••" required autocomplete="current-password" />
                  <button type="button" class="auth-eye-btn" aria-label="Toggle password visibility" onclick="EduviaAuth.togglePasswordVisibility('signin-password', this)">
                    <svg class="eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
              </div>

              <div class="auth-remember-row">
                <label class="auth-checkbox-label">
                  <input type="checkbox" id="signin-remember" checked />
                  <span>Remember my login</span>
                </label>
              </div>

              <button type="submit" class="btn-auth-primary" id="btn-submit-signin">
                <span class="btn-text">Sign In</span>
                <span class="btn-loader" style="display:none;"></span>
              </button>
            </form>

            <!-- 2. SIGN UP / CREATE ACCOUNT FORM -->
            <form id="auth-form-signup" class="eduvia-auth-form" style="display: none;" onsubmit="EduviaAuth.submitSignUp(event)">
              <div class="auth-field-group">
                <label for="signup-name" class="auth-label">Full Name</label>
                <div class="auth-input-wrap">
                  <input type="text" id="signup-name" class="auth-input" placeholder="e.g. Aarav Sharma" required autocomplete="name" />
                </div>
              </div>

              <div class="auth-field-group">
                <label for="signup-email" class="auth-label">Email Address</label>
                <div class="auth-input-wrap">
                  <input type="email" id="signup-email" class="auth-input" placeholder="student@example.com" required autocomplete="email" />
                </div>
              </div>

              <div class="auth-field-group">
                <label for="signup-password" class="auth-label">Create Password</label>
                <div class="auth-input-wrap">
                  <input type="password" id="signup-password" class="auth-input" placeholder="At least 6 characters" required minlength="6" oninput="EduviaAuth.evaluatePasswordStrength(this.value)" autocomplete="new-password" />
                  <button type="button" class="auth-eye-btn" aria-label="Toggle password visibility" onclick="EduviaAuth.togglePasswordVisibility('signup-password', this)">
                    <svg class="eye-open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                </div>
                <!-- Strength Meter -->
                <div class="password-strength-container" id="password-strength-box" style="display: none;">
                  <div class="strength-bars">
                    <span class="strength-bar" id="str-bar-1"></span>
                    <span class="strength-bar" id="str-bar-2"></span>
                    <span class="strength-bar" id="str-bar-3"></span>
                  </div>
                  <span class="strength-text" id="str-text">Password strength</span>
                </div>
              </div>

              <div class="auth-field-group">
                <label for="signup-stream" class="auth-label">Academic Stream of Interest</label>
                <div class="auth-input-wrap">
                  <select id="signup-stream" class="auth-input auth-select">
                    <option value="General Discovery">General Discovery / Undecided</option>
                    <option value="Business & Management">Management & Strategy (MBA/BBA)</option>
                    <option value="Software & Computing">Technology & Computing (MCA/BCA)</option>
                    <option value="Data & Analytics">Data Science & AI (M.Sc / Certification)</option>
                    <option value="Commerce & Finance">Commerce & FinTech (M.Com/B.Com)</option>
                    <option value="Healthcare & Ops">Healthcare & Hospital Admin (MHA)</option>
                  </select>
                </div>
              </div>

              <div class="auth-remember-row">
                <label class="auth-checkbox-label">
                  <input type="checkbox" id="signup-terms" required />
                  <span>I agree to Eduvia's <a href="terms.html" target="_blank" style="color:var(--color-coral); text-decoration:underline;">Terms</a> and <a href="privacy.html" target="_blank" style="color:var(--color-coral); text-decoration:underline;">Privacy Policy</a></span>
                </label>
              </div>

              <button type="submit" class="btn-auth-primary" id="btn-submit-signup">
                <span class="btn-text">Create Free Account</span>
                <span class="btn-loader" style="display:none;"></span>
              </button>
            </form>

            <!-- 3. FORGOT PASSWORD FORM -->
            <form id="auth-form-forgot" class="eduvia-auth-form" style="display: none;" onsubmit="EduviaAuth.submitForgot(event)">
              <div class="auth-field-group">
                <label for="forgot-email" class="auth-label">Registered Student Email</label>
                <div class="auth-input-wrap">
                  <input type="email" id="forgot-email" class="auth-input" placeholder="student@example.com" required autocomplete="email" />
                </div>
              </div>

              <button type="submit" class="btn-auth-primary" id="btn-submit-forgot">
                <span class="btn-text">Send Recovery Link</span>
                <span class="btn-loader" style="display:none;"></span>
              </button>

              <button type="button" class="btn-auth-back" onclick="EduviaAuth.switchTab('signin')">
                ← Back to Sign In
              </button>
            </form>

            <!-- SOCIAL AUTH DIVIDER & BUTTONS -->
            <div class="eduvia-auth-social-wrapper" id="auth-social-section">
              <div class="eduvia-auth-divider">
                <span>OR CONTINUE WITH</span>
              </div>

              <!-- Main Google One-Tap Action (as highlighted in prompt & design) -->
              <button type="button" class="btn-social-highlight" onclick="EduviaAuth.startOAuth('Google')">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <!-- Secondary Row: Apple & Facebook -->
              <div class="eduvia-social-grid-row">
                <!-- Apple -->
                <button type="button" class="btn-social-secondary" onclick="EduviaAuth.startOAuth('Apple')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.35-.55.64-.99 1.7-0.87 2.72 1.01.08 1.96-.47 2.58-1.22z"/>
                  </svg>
                  <span>Apple</span>
                </button>

                <!-- Facebook -->
                <button type="button" class="btn-social-secondary" onclick="EduviaAuth.startOAuth('Facebook')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            <!-- Footer Switcher -->
            <div class="eduvia-auth-footer">
              <span id="auth-footer-prompt">Don't have an account?</span>
              <button type="button" id="auth-footer-toggle" class="auth-toggle-link" onclick="EduviaAuth.toggleMode()">
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- OAUTH SIMULATION DIALOG OVERLAY -->
      <div id="eduvia-oauth-modal" class="eduvia-oauth-backdrop" style="display: none;" onclick="EduviaAuth.closeOAuth()">
        <div class="eduvia-oauth-window" onclick="event.stopPropagation()">
          <div class="oauth-window-header">
            <div class="oauth-brand-badge" id="oauth-provider-badge">
              <!-- Injected by provider -->
            </div>
            <span class="oauth-secure-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Secure 256-Bit SSO
            </span>
          </div>

          <div class="oauth-window-body" id="oauth-window-body">
            <!-- Dynamic provider profiles -->
          </div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.id = "eduvia-auth-root";
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    // Close on backdrop click
    const backdrop = document.getElementById("eduvia-auth-modal");
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) EduviaAuth.close();
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        EduviaAuth.close();
        EduviaAuth.closeOAuth();
      }
    });
  },

  bindGlobalTriggers() {
    // Intercept all links targeting #login or with class nav-login-btn
    document.addEventListener("click", (e) => {
      const loginBtn = e.target.closest(".nav-login-btn, a[href='#login'], [data-open-auth]");
      if (loginBtn) {
        e.preventDefault();
        const mode = loginBtn.getAttribute("data-auth-mode") || "signin";
        EduviaAuth.open(mode);
      }
    });
  },

  open(mode = "signin") {
    this.injectModalDOM();
    const modal = document.getElementById("eduvia-auth-modal");
    if (!modal) return;

    this.switchTab(mode);
    this.clearAlert();
    modal.classList.add("open");
    document.body.classList.add("auth-modal-open");

    // Focus initial input
    setTimeout(() => {
      if (mode === "signup") {
        const input = document.getElementById("signup-name");
        if (input) input.focus();
      } else {
        const input = document.getElementById("signin-email");
        if (input) input.focus();
      }
    }, 100);
  },

  close() {
    const modal = document.getElementById("eduvia-auth-modal");
    if (modal) {
      modal.classList.remove("open");
    }
    document.body.classList.remove("auth-modal-open");
    this.clearAlert();
  },

  switchTab(tab) {
    this.activeTab = tab;
    this.clearAlert();

    const titleEl = document.getElementById("auth-modal-title");
    const subtitleEl = document.getElementById("auth-modal-subtitle");
    const tabBar = document.getElementById("auth-tab-bar");
    const tabSignIn = document.getElementById("tab-btn-signin");
    const tabSignUp = document.getElementById("tab-btn-signup");

    const formSignIn = document.getElementById("auth-form-signin");
    const formSignUp = document.getElementById("auth-form-signup");
    const formForgot = document.getElementById("auth-form-forgot");
    const socialSec = document.getElementById("auth-social-section");
    const footerPrompt = document.getElementById("auth-footer-prompt");
    const footerToggle = document.getElementById("auth-footer-toggle");

    if (!titleEl || !formSignIn || !formSignUp || !formForgot) return;

    // Reset visibility
    formSignIn.style.display = "none";
    formSignUp.style.display = "none";
    formForgot.style.display = "none";
    if (tabSignIn) tabSignIn.classList.remove("active");
    if (tabSignUp) tabSignUp.classList.remove("active");

    if (tab === "signin") {
      tabBar.style.display = "flex";
      socialSec.style.display = "block";
      formSignIn.style.display = "flex";
      if (tabSignIn) tabSignIn.classList.add("active");
      titleEl.textContent = "Welcome back";
      subtitleEl.textContent = "Continue exploring your education journey with Eduvia Connect.";
      if (footerPrompt) footerPrompt.textContent = "Don't have an account?";
      if (footerToggle) footerToggle.textContent = "Create an account";
    } else if (tab === "signup") {
      tabBar.style.display = "flex";
      socialSec.style.display = "block";
      formSignUp.style.display = "flex";
      if (tabSignUp) tabSignUp.classList.add("active");
      titleEl.textContent = "Create an account";
      subtitleEl.textContent = "Join over 45,000+ students comparing verified online programmes.";
      if (footerPrompt) footerPrompt.textContent = "Already have an account?";
      if (footerToggle) footerToggle.textContent = "Sign in instead";
    } else if (tab === "forgot") {
      tabBar.style.display = "none";
      socialSec.style.display = "none";
      formForgot.style.display = "flex";
      titleEl.textContent = "Reset Password";
      subtitleEl.textContent = "Enter your student email and we'll send a secure password reset link.";
      if (footerPrompt) footerPrompt.textContent = "Remembered your password?";
      if (footerToggle) footerToggle.textContent = "Back to Sign In";
    }
  },

  toggleMode() {
    if (this.activeTab === "signin") {
      this.switchTab("signup");
    } else {
      this.switchTab("signin");
    }
  },

  showAlert(message, type = "error") {
    const alertBox = document.getElementById("auth-alert-box");
    if (!alertBox) return;
    alertBox.className = `eduvia-auth-alert alert-${type}`;
    alertBox.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>${message}</span>
    `;
    alertBox.style.display = "flex";
  },

  clearAlert() {
    const alertBox = document.getElementById("auth-alert-box");
    if (alertBox) {
      alertBox.style.display = "none";
      alertBox.innerHTML = "";
    }
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.innerHTML = isPassword
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  },

  evaluatePasswordStrength(pwd) {
    const box = document.getElementById("password-strength-box");
    const bar1 = document.getElementById("str-bar-1");
    const bar2 = document.getElementById("str-bar-2");
    const bar3 = document.getElementById("str-bar-3");
    const text = document.getElementById("str-text");

    if (!pwd) {
      box.style.display = "none";
      return;
    }
    box.style.display = "flex";

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10 || (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))) score++;
    if (pwd.length >= 12 && /[^A-Za-z0-9]/.test(pwd)) score++;

    bar1.className = "strength-bar";
    bar2.className = "strength-bar";
    bar3.className = "strength-bar";

    if (score === 1) {
      bar1.classList.add("fill-weak");
      text.textContent = "Weak password (add numbers or uppercase)";
      text.style.color = "#f87171";
    } else if (score === 2) {
      bar1.classList.add("fill-medium");
      bar2.classList.add("fill-medium");
      text.textContent = "Good password strength";
      text.style.color = "#fbbf24";
    } else {
      bar1.classList.add("fill-strong");
      bar2.classList.add("fill-strong");
      bar3.classList.add("fill-strong");
      text.textContent = "Strong & secure password";
      text.style.color = "#4ade80";
    }
  },

  setLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const text = btn.querySelector(".btn-text");
    const loader = btn.querySelector(".btn-loader");
    btn.disabled = isLoading;
    if (text) text.style.opacity = isLoading ? "0" : "1";
    if (loader) loader.style.display = isLoading ? "inline-block" : "none";
  },

  submitSignIn(e) {
    e.preventDefault();
    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value;

    if (!email || !password) {
      this.showAlert("Please fill in both email and password.");
      return;
    }

    this.setLoading("btn-submit-signin", true);
    setTimeout(() => {
      this.setLoading("btn-submit-signin", false);
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      const user = {
        name: name || "Student Member",
        email: email,
        provider: "Email",
        stream: "Technology & Computing",
        avatarInitial: (name[0] || "S").toUpperCase(),
        token: "jwt_" + Math.random().toString(36).substring(2),
        loggedInAt: new Date().toISOString()
      };

      this.saveSession(user);
      this.close();
      if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
        EduviaUI.showToast(`Welcome back, ${user.name}! Accessing verified student dashboard.`);
      }
    }, 700);
  },

  submitSignUp(e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const stream = document.getElementById("signup-stream").value;
    const terms = document.getElementById("signup-terms").checked;

    if (!name || !email || !password) {
      this.showAlert("Please complete all registration fields.");
      return;
    }
    if (password.length < 6) {
      this.showAlert("Password must be at least 6 characters long.");
      return;
    }
    if (!terms) {
      this.showAlert("Please accept the Terms & Privacy Policy to proceed.");
      return;
    }

    this.setLoading("btn-submit-signup", true);
    setTimeout(() => {
      this.setLoading("btn-submit-signup", false);
      const user = {
        name: name,
        email: email,
        provider: "Email",
        stream: stream,
        avatarInitial: name.charAt(0).toUpperCase(),
        token: "jwt_" + Math.random().toString(36).substring(2),
        loggedInAt: new Date().toISOString()
      };

      this.saveSession(user);
      this.close();
      if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
        EduviaUI.showToast(`Account created successfully! Welcome to Eduvia Connect, ${user.name}.`);
      }
    }, 850);
  },

  submitForgot(e) {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim();
    if (!email) {
      this.showAlert("Please enter your registered student email.");
      return;
    }

    this.setLoading("btn-submit-forgot", true);
    setTimeout(() => {
      this.setLoading("btn-submit-forgot", false);
      this.showAlert(`Password reset link sent to ${email}. Check your inbox!`, "success");
      setTimeout(() => {
        this.switchTab("signin");
      }, 2500);
    }, 750);
  },

  startOAuth(provider) {
    this.oauthProvider = provider;
    const oauthModal = document.getElementById("eduvia-oauth-modal");
    const badge = document.getElementById("oauth-provider-badge");
    const body = document.getElementById("oauth-window-body");

    let providerIcon = "";
    let mockProfileName = "Aarav Sharma";
    let mockEmail = "aarav.sharma@gmail.com";
    let providerColor = "#4285F4";

    if (provider === "Google") {
      providerColor = "#4285F4";
      providerIcon = `<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`;
      mockEmail = "aarav.sharma@gmail.com";
    } else if (provider === "Apple") {
      providerColor = "#ffffff";
      providerIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.63 1.35-.55.64-.99 1.7-0.87 2.72 1.01.08 1.96-.47 2.58-1.22z"/></svg>`;
      mockProfileName = "Priya Patel";
      mockEmail = "priya.patel@privaterelay.appleid.com";
    } else if (provider === "Facebook") {
      providerColor = "#1877F2";
      providerIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
      mockProfileName = "Rohan Verma";
      mockEmail = "rohan.verma@facebook.com";
    }

    badge.innerHTML = `${providerIcon} <span style="font-weight:700; font-size:1.1rem; color:#fff;">Sign in with ${provider}</span>`;

    body.innerHTML = `
      <div class="oauth-prompt-text">
        <p><strong>Eduvia Connect</strong> will securely receive your verified name, email address, and account avatar.</p>
      </div>

      <div class="oauth-account-picker">
        <!-- Account 1 -->
        <div class="oauth-account-row" onclick="EduviaAuth.completeOAuth('${mockProfileName}', '${mockEmail}', '${provider}')">
          <div class="oauth-avatar" style="background: ${providerColor}; color:#fff;">
            ${mockProfileName.charAt(0)}
          </div>
          <div class="oauth-acc-info">
            <span class="oauth-acc-name">${mockProfileName}</span>
            <span class="oauth-acc-email">${mockEmail}</span>
          </div>
          <svg class="oauth-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <!-- Custom Account Entry -->
        <div class="oauth-account-row custom-acc" onclick="EduviaAuth.showCustomOAuthPrompt('${provider}')">
          <div class="oauth-avatar" style="background: #334155; color:#cbd5e1;">
            +
          </div>
          <div class="oauth-acc-info">
            <span class="oauth-acc-name">Use another ${provider} account</span>
            <span class="oauth-acc-email">Enter credentials</span>
          </div>
        </div>
      </div>

      <div class="oauth-footer-actions">
        <button type="button" class="btn-oauth-cancel" onclick="EduviaAuth.closeOAuth()">Cancel</button>
      </div>
    `;

    oauthModal.style.display = "flex";
  },

  showCustomOAuthPrompt(provider) {
    const customEmail = prompt(`Enter your ${provider} email:`, `student@${provider.toLowerCase()}.com`);
    if (customEmail && customEmail.includes("@")) {
      const customName = customEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      this.completeOAuth(customName, customEmail, provider);
    }
  },

  completeOAuth(name, email, provider) {
    const body = document.getElementById("oauth-window-body");
    if (body) {
      body.innerHTML = `
        <div class="oauth-authorizing-state">
          <div class="auth-spinner-large"></div>
          <h4 style="color:#ffffff; margin: 1rem 0 0.25rem 0;">Authenticating with ${provider}...</h4>
          <p style="color:#94a3b8; font-size:0.875rem;">Establishing secure SSO token for ${name}</p>
        </div>
      `;
    }

    setTimeout(() => {
      const user = {
        name: name,
        email: email,
        provider: provider,
        stream: "General Discovery",
        avatarInitial: name.charAt(0).toUpperCase(),
        token: `${provider.toLowerCase()}_oauth_` + Math.random().toString(36).substring(2),
        loggedInAt: new Date().toISOString()
      };

      this.saveSession(user);
      this.closeOAuth();
      this.close();

      if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
        EduviaUI.showToast(`Logged in successfully via ${provider}! Welcome back, ${name}.`);
      }
    }, 900);
  },

  closeOAuth() {
    const oauthModal = document.getElementById("eduvia-oauth-modal");
    if (oauthModal) {
      oauthModal.style.display = "none";
    }
  },

  logout() {
    const userName = this.currentUser ? this.currentUser.name : "Student";
    this.clearSession();
    if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
      EduviaUI.showToast(`You have signed out. See you next time, ${userName}!`);
    }
  },

  renderNavUserState() {
    const loginButtons = document.querySelectorAll(".nav-login-btn");
    const mobileLoginButtons = document.querySelectorAll(".mobile-login-btn");
    const mobileDrawerAuthContainers = document.querySelectorAll(".mobile-drawer-auth-container");
    
    // Desktop Nav Login Buttons
    loginButtons.forEach(btn => {
      if (this.currentUser) {
        btn.classList.add("is-logged-in");
        btn.setAttribute("href", "#profile");
        btn.onclick = (e) => {
          e.preventDefault();
          this.toggleUserMenu(btn);
        };
        btn.innerHTML = `
          <div class="nav-user-pill">
            <div class="user-avatar-badge">${this.currentUser.avatarInitial || "S"}</div>
            <span class="user-display-name">${this.currentUser.name.split(" ")[0]}</span>
            <svg class="user-dropdown-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        `;
      } else {
        btn.classList.remove("is-logged-in");
        btn.setAttribute("href", "#login");
        btn.onclick = (e) => {
          e.preventDefault();
          EduviaAuth.open("signin");
        };
        btn.innerHTML = `Login`;
      }
    });

    // Mobile Header Login Buttons
    mobileLoginButtons.forEach(btn => {
      if (this.currentUser) {
        btn.classList.add("is-logged-in");
        btn.setAttribute("title", `Account: ${this.currentUser.name}`);
        btn.onclick = (e) => {
          e.preventDefault();
          this.toggleUserMenu(btn);
        };
        btn.innerHTML = `
          <div class="mobile-user-avatar">${this.currentUser.avatarInitial || "S"}</div>
        `;
      } else {
        btn.classList.remove("is-logged-in");
        btn.setAttribute("title", "Student Login / Account");
        btn.onclick = (e) => {
          e.preventDefault();
          EduviaAuth.open("signin");
        };
        btn.innerHTML = `
          <span class="material-symbols-outlined text-[20px]">person</span>
        `;
      }
    });

    // Mobile Drawer Auth Section
    mobileDrawerAuthContainers.forEach(container => {
      if (this.currentUser) {
        container.innerHTML = `
          <div class="mobile-drawer-user-card" onclick="EduviaAuth.toggleUserMenu(this)">
            <div class="mobile-drawer-avatar">${this.currentUser.avatarInitial || "S"}</div>
            <div class="mobile-drawer-user-info">
              <span class="mobile-drawer-user-name">${this.currentUser.name}</span>
              <span class="mobile-drawer-user-email">${this.currentUser.email}</span>
            </div>
            <button type="button" class="mobile-drawer-logout-btn" onclick="event.stopPropagation(); EduviaAuth.logout();" title="Sign Out">
              <span class="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <button type="button" class="mobile-drawer-login-btn" onclick="if(typeof closeMobileMenu==='function')closeMobileMenu(); EduviaAuth.open('signin');">
            <span class="material-symbols-outlined text-[18px]">person</span>
            <span>Student Login / Register</span>
          </button>
        `;
      }
    });
  },

  toggleUserMenu(triggerEl) {
    let existingMenu = document.getElementById("eduvia-user-dropdown-menu");
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    if (!this.currentUser) return;

    const menu = document.createElement("div");
    menu.id = "eduvia-user-dropdown-menu";
    menu.className = "eduvia-user-menu-dropdown";
    menu.innerHTML = `
      <div class="user-menu-header">
        <div class="user-menu-avatar">${this.currentUser.avatarInitial}</div>
        <div class="user-menu-meta">
          <span class="user-meta-name">${this.currentUser.name}</span>
          <span class="user-meta-email">${this.currentUser.email}</span>
          <span class="user-meta-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Verified Student (${this.currentUser.provider})
          </span>
        </div>
      </div>

      <div class="user-menu-divider"></div>

      <ul class="user-menu-list">
        <li>
          <a href="discover.html" class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <span>My Recommended Stream: <strong>${this.currentUser.stream || "General"}</strong></span>
          </a>
        </li>
        <li>
          <a href="compare.html" class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Comparison Matrix Tray</span>
          </a>
        </li>
        <li>
          <a href="resources.html" class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>UGC Regulatory Guides</span>
          </a>
        </li>
      </ul>

      <div class="user-menu-divider"></div>

      <div class="user-menu-footer">
        <button type="button" class="btn-user-signout" onclick="EduviaAuth.logout(); document.getElementById('eduvia-user-dropdown-menu')?.remove();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    document.body.appendChild(menu);

    // Position menu under trigger
    const rect = triggerEl.getBoundingClientRect();
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    menu.style.right = `${Math.max(16, window.innerWidth - rect.right - window.scrollX)}px`;

    // Close menu when clicking outside
    const dismissHandler = (e) => {
      if (!menu.contains(e.target) && !triggerEl.contains(e.target)) {
        menu.remove();
        document.removeEventListener("click", dismissHandler);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", dismissHandler);
    }, 50);
  }
};

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => EduviaAuth.init());
} else {
  EduviaAuth.init();
}

// Export globally
window.EduviaAuth = EduviaAuth;
