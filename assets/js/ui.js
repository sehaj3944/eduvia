/**
 * EDUVIA UI MODULE (assets/js/ui.js)
 * Reusable modal controllers, toast notifications, accordions, and detail drawers.
 */

const EduviaUI = {
  shortlist: [],

  init() {
    this.loadShortlist();
    this.setupModalBackdrops();
    this.setupAccordions();
    this.updateShortlistBadges();
    this.setupScrollReveals();
    this.setupCookieConsent();
  },

  loadShortlist() {
    try {
      const saved = localStorage.getItem("eduvia_shortlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.shortlist = Array.isArray(parsed) ? parsed : [];
      } else {
        this.shortlist = [];
      }
    } catch (e) {
      this.shortlist = [];
    }
  },

  saveShortlist() {
    try {
      localStorage.setItem("eduvia_shortlist", JSON.stringify(this.shortlist));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  },

  setupCookieConsent() {
    if (localStorage.getItem("eduvia_cookie_consent")) return;

    const banner = document.createElement("div");
    banner.className = "cookie-consent-banner";
    banner.id = "eduvia-cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Data governance and cookie preferences");
    banner.innerHTML = `
      <div class="cookie-content">
        <div class="cookie-text">
          <strong>Student Data Governance & Essential Cookies:</strong> Eduvia uses strictly necessary local storage cookies to retain your comparison matrix, shortlisted programmes, and filters. We respect student privacy and never sell data to telemarketers. By continuing, you agree to our <a href="privacy.html" style="color: var(--color-coral); text-decoration: underline;">Privacy Charter</a> and <a href="terms.html" style="color: var(--color-coral); text-decoration: underline;">Terms</a>.
        </div>
        <div class="cookie-actions">
          <button type="button" class="btn btn-outline btn-sm text-xs" onclick="EduviaUI.dismissCookieConsent(false)">Essential Only</button>
          <button type="button" class="btn btn-primary btn-sm text-xs" onclick="EduviaUI.dismissCookieConsent(true)">Accept All</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    setTimeout(() => {
      banner.classList.add("show");
    }, 1200);
  },

  dismissCookieConsent(allAccepted = true) {
    const banner = document.getElementById("eduvia-cookie-consent");
    if (banner) {
      banner.classList.remove("show");
      setTimeout(() => banner.remove(), 400);
    }
    localStorage.setItem("eduvia_cookie_consent", allAccepted ? "all" : "essential");
  },

  setupScrollReveals() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".reveal-on-scroll");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: "0px 0px -30px 0px",
      threshold: 0.08
    });

    elements.forEach(el => observer.observe(el));
  },

  lockBodyScroll() {
    document.body.classList.add("modal-scroll-locked");
  },

  unlockBodyScroll() {
    document.body.classList.remove("modal-scroll-locked");
  },

  setupModalBackdrops() {
    document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeAllModals();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.closeAllModals();
    });
  },

  setupAccordions() {
    // Single-open accordion logic for FAQ items
    document.querySelectorAll(".faq-question-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleFaqItem(btn);
      });
    });
  },

  toggleFaqItem(btn) {
    const currentItem = btn.closest(".faq-item");
    if (!currentItem) return;
    const parentList = currentItem.closest(".faq-accordion-list") || document;
    const isCurrentlyActive = currentItem.classList.contains("active");

    // Close all other items in this list (Only one open at a time)
    parentList.querySelectorAll(".faq-item").forEach(item => {
      item.classList.remove("active");
      const b = item.querySelector(".faq-question-btn");
      if (b) b.setAttribute("aria-expanded", "false");
    });

    // Toggle current item
    if (!isCurrentlyActive) {
      currentItem.classList.add("active");
      btn.setAttribute("aria-expanded", "true");
    }
  },

  toggleFooterAccordion(btn) {
    if (window.innerWidth > 768) return;
    const parentCol = btn.closest(".footer-col-accordion");
    if (!parentCol) return;
    const isActive = parentCol.classList.contains("active");
    parentCol.classList.toggle("active", !isActive);
    btn.setAttribute("aria-expanded", !isActive ? "true" : "false");
  },

  handleNewsletterSubmit(form) {
    const emailInput = form.querySelector("#newsletter-email-input") || form.querySelector("input[type='email']");
    const consentCheck = form.querySelector("#newsletter-consent") || form.querySelector("input[type='checkbox']");
    const feedbackMsg = form.querySelector("#newsletter-feedback") || form.querySelector(".newsletter-feedback-msg");

    if (!emailInput || !feedbackMsg) return;

    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset styles
    emailInput.classList.remove("is-invalid");
    feedbackMsg.className = "newsletter-feedback-msg";
    feedbackMsg.style.display = "none";

    if (!emailRegex.test(emailVal)) {
      emailInput.classList.add("is-invalid");
      feedbackMsg.className = "newsletter-feedback-msg is-error";
      feedbackMsg.textContent = "Please enter a valid email address (e.g. yourname@gmail.com or name@edu.in).";
      feedbackMsg.style.display = "block";
      emailInput.focus();
      return;
    }

    if (consentCheck && !consentCheck.checked) {
      feedbackMsg.className = "newsletter-feedback-msg is-error";
      feedbackMsg.textContent = "Please confirm your consent to receive academic and regulatory alerts.";
      feedbackMsg.style.display = "block";
      consentCheck.focus();
      return;
    }

    // Success State
    feedbackMsg.className = "newsletter-feedback-msg is-success";
    feedbackMsg.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span> <span>Subscribed! We've registered your email for verified UGC regulatory alerts.</span>`;
    feedbackMsg.style.display = "flex";
    emailInput.value = "";
    if (consentCheck) consentCheck.checked = false;
    emailInput.disabled = true;
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Subscribed</span> <span class="material-symbols-outlined text-[16px]">check</span>`;
    }
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      this.lockBodyScroll();
    }
  },

  closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
    this.unlockBodyScroll();
  },

  showToast(message) {
    let toast = document.getElementById("global-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "global-toast";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined text-primary-fixed text-[20px]">verified</span>
      <span>${message}</span>
    `;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  },

  openUniversityDetailModal(univId) {
    const univ = EduviaData.getUniversityById(univId);
    if (!univ) return;

    const modal = document.getElementById("generic-detail-modal");
    const title = document.getElementById("generic-modal-title");
    const body = document.getElementById("generic-modal-body");
    if (!modal || !title || !body) return;

    title.textContent = `${univ.name} (Institutional Dossier)`;
    body.innerHTML = `
      <div class="space-y-4">
        <div class="bg-surface-container-low p-4 border border-outline-variant flex items-center justify-between flex-wrap gap-4">
          <div>
            <span class="badge badge-teal">${univ.badge}</span>
            <span class="badge badge-blue">${univ.nirfRank}</span>
            <h4 class="font-headline text-lg font-bold mt-1">${univ.name}</h4>
            <p class="text-xs text-on-surface-variant">${univ.location} • ${univ.approvals.join(" • ")}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-on-surface-variant uppercase font-bold block">Tuition Range</span>
            <span class="font-headline font-bold text-primary text-lg">${univ.feeRange}</span>
          </div>
        </div>

        <div>
          <h5 class="font-headline font-bold text-sm text-secondary uppercase mb-1">Institutional Overview</h5>
          <p class="text-sm text-on-surface-variant leading-relaxed">${univ.description}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white p-3 border border-outline-variant">
            <h6 class="font-headline font-bold text-xs text-secondary uppercase mb-2">Examination & Pedagogy</h6>
            <ul class="text-xs space-y-1 text-on-surface-variant">
              <li>• <strong>Exams:</strong> ${univ.examMode}</li>
              <li>• <strong>Lectures:</strong> ${univ.liveSessions}</li>
              <li>• <strong>LMS Platform:</strong> ${univ.lmsFeatures}</li>
            </ul>
          </div>
          <div class="bg-white p-3 border border-outline-variant">
            <h6 class="font-headline font-bold text-xs text-secondary uppercase mb-2">Placement & Alumni Records</h6>
            <ul class="text-xs space-y-1 text-on-surface-variant">
              <li>• <strong>Average CTC:</strong> ${univ.placementAvg}</li>
              <li>• <strong>Highest Package:</strong> ${univ.placementHighest}</li>
              <li>• <strong>Key Recruiters:</strong> ${univ.topRecruiters.join(", ")}</li>
            </ul>
          </div>
        </div>

        <div class="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
          <button class="btn btn-outline btn-sm" onclick="EduviaComparison.toggleCompare('${univ.id}')">Add to Compare</button>
          <button class="btn btn-primary btn-sm" onclick="EduviaUI.openCounselingModal('${univ.name}')">Book Free Institutional Counseling</button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  openProgrammeDetailModal(progId) {
    const prog = EduviaData.getProgrammeById(progId);
    if (!prog) return;

    const modal = document.getElementById("generic-detail-modal");
    const title = document.getElementById("generic-modal-title");
    const body = document.getElementById("generic-modal-body");
    if (!modal || !title || !body) return;

    title.textContent = `${prog.title} - Full Curriculum`;
    body.innerHTML = `
      <div class="space-y-4">
        <div class="bg-surface-container-low p-4 border border-outline-variant flex items-center justify-between flex-wrap gap-4">
          <div>
            <span class="badge badge-teal">${prog.accreditation}</span>
            <h4 class="font-headline text-lg font-bold mt-1">${prog.title}</h4>
            <p class="text-xs text-on-surface-variant">${prog.universityName} • Duration: ${prog.duration}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-on-surface-variant uppercase font-bold block">Course Fee</span>
            <span class="font-headline font-bold text-primary text-lg">₹${prog.totalFee.toLocaleString('en-IN')}</span>
            <span class="text-xs text-on-surface-variant block">(₹${prog.emiMonthly.toLocaleString('en-IN')}/mo)</span>
          </div>
        </div>

        <div>
          <h5 class="font-headline font-bold text-sm text-secondary uppercase mb-1">Eligibility Criteria</h5>
          <p class="text-xs text-on-surface bg-white p-2.5 border border-outline-variant font-semibold">${prog.eligibility}</p>
        </div>

        <div>
          <h5 class="font-headline font-bold text-sm text-secondary uppercase mb-2">Semester-by-Semester Curriculum</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${prog.syllabus.map(s => `
              <div class="bg-white p-3 border border-outline-variant">
                <span class="font-headline text-xs font-bold text-primary uppercase block mb-1.5">${s.sem}</span>
                <ul class="text-xs space-y-1 text-on-surface-variant">
                  ${s.topics.map(t => `<li>• ${t}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="pt-4 border-t border-outline-variant/30 flex justify-between items-center">
          <button class="btn btn-outline btn-sm" onclick="EduviaUI.toggleShortlist('${prog.id}')">Shortlist Programme</button>
          <button class="btn btn-primary btn-sm" onclick="EduviaUI.openCounselingModal('${prog.universityName} - ${prog.title}')">Apply for Admission</button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  openCounselingModal(defaultSubject = "") {
    const modal = document.getElementById("counseling-modal");
    const subjInput = document.getElementById("counsel-programme-input");
    if (subjInput && defaultSubject) {
      subjInput.value = defaultSubject;
    }
    if (modal) modal.classList.add("open");
  },

  toggleShortlist(progId) {
    const idx = this.shortlist.indexOf(progId);
    if (idx > -1) {
      this.shortlist.splice(idx, 1);
      this.showToast(`Removed from shortlist`);
    } else {
      this.shortlist.push(progId);
      this.showToast(`Added to your shortlist!`);
    }
    this.saveShortlist();
    this.updateShortlistBadges();
    if (typeof EduviaFilters !== "undefined" && typeof EduviaFilters.applyFilters === "function") {
      EduviaFilters.applyFilters(false);
    }
  },

  updateShortlistBadges() {
    const count = this.shortlist.length;
    const badge = document.getElementById("shortlist-count-badge");
    const topbarBadge = document.getElementById("topbar-shortlist-count");
    if (badge) badge.textContent = count;
    if (topbarBadge) topbarBadge.textContent = count;
  },

  openShortlistDrawer() {
    const modal = document.getElementById("generic-detail-modal");
    const title = document.getElementById("generic-modal-title");
    const body = document.getElementById("generic-modal-body");
    if (!modal || !title || !body) return;

    title.textContent = `My Shortlisted Programmes (${this.shortlist.length})`;
    
    if (this.shortlist.length === 0) {
      body.innerHTML = `
        <div class="text-center py-8">
          <span class="material-symbols-outlined text-[48px] text-outline mb-2">favorite_border</span>
          <h4 class="font-headline font-bold text-base">Your shortlist is empty</h4>
          <p class="text-xs text-on-surface-variant mt-1">Browse courses and click the heart icon to save them for easy comparison.</p>
        </div>
      `;
    } else {
      const list = this.shortlist.map(id => EduviaData.getProgrammeById(id)).filter(Boolean);
      body.innerHTML = `
        <div class="space-y-3">
          ${list.map(p => `
            <div class="p-3 bg-surface-container-low border border-outline-variant flex items-center justify-between gap-4">
              <div>
                <span class="text-xs text-on-surface-variant font-bold uppercase">${p.universityName}</span>
                <h5 class="font-headline font-bold text-sm text-secondary">${p.title}</h5>
                <span class="text-xs text-primary font-bold">₹${p.totalFee.toLocaleString('en-IN')} (EMI: ₹${p.emiMonthly}/mo)</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn btn-outline btn-sm" onclick="EduviaUI.openProgrammeDetailModal('${p.id}')">View</button>
                <button class="btn btn-primary btn-sm" onclick="EduviaUI.openCounselingModal('${p.universityName} - ${p.title}')">Counseling</button>
                <button class="text-error p-1" onclick="EduviaUI.toggleShortlist('${p.id}'); EduviaUI.openShortlistDrawer();" title="Remove">✕</button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    modal.classList.add("open");
  },

  /* --------------------------------------------------------------------------
     SKELETON BODY GENERATORS
     -------------------------------------------------------------------------- */
  renderSkeletonSnapCards(count = 4, type = "programme") {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <div class="snap-skeleton-card skeleton-body" aria-busy="true" aria-label="Loading content...">
          <div>
            <div class="flex gap-2 mb-3">
              <div class="skeleton-shimmer skeleton-badge"></div>
              <div class="skeleton-shimmer skeleton-badge"></div>
            </div>
            <div class="skeleton-shimmer skeleton-line-title"></div>
            <div class="skeleton-shimmer skeleton-line-subtitle"></div>
            <div class="skeleton-spec-grid mt-4">
              <div>
                <div class="skeleton-shimmer skeleton-line-sm"></div>
                <div class="skeleton-shimmer skeleton-line-xs"></div>
              </div>
              <div>
                <div class="skeleton-shimmer skeleton-line-sm"></div>
                <div class="skeleton-shimmer skeleton-line-xs"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-footer-row">
            <div>
              <div class="skeleton-shimmer skeleton-line-sm" style="width: 80px;"></div>
              <div class="skeleton-shimmer skeleton-line-xs" style="width: 110px;"></div>
            </div>
            <div class="skeleton-shimmer skeleton-pill" style="width: 60px;"></div>
          </div>
        </div>
      `;
    }
    return html;
  },

  renderSkeletonDossiers(count = 6) {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <article class="skeleton-dossier-card skeleton-body" aria-busy="true" aria-label="Loading programme dossier...">
          <div class="skeleton-header-row">
            <div class="skeleton-shimmer skeleton-avatar"></div>
            <div class="flex-1">
              <div class="skeleton-shimmer skeleton-line-sm" style="width: 40%;"></div>
              <div class="skeleton-shimmer skeleton-line-xs" style="width: 25%;"></div>
            </div>
            <div class="skeleton-shimmer skeleton-circle" style="width: 32px; height: 32px;"></div>
          </div>
          <div class="skeleton-shimmer skeleton-line-title" style="width: 85%;"></div>
          <div class="skeleton-shimmer skeleton-pill" style="width: 140px;"></div>
          <div class="skeleton-spec-grid">
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
          </div>
          <div class="skeleton-footer-row">
            <div><div class="skeleton-shimmer skeleton-line-title" style="width: 100px; margin-bottom: 4px;"></div><div class="skeleton-shimmer skeleton-line-xs" style="width: 130px;"></div></div>
            <div class="skeleton-shimmer skeleton-btn" style="width: 120px;"></div>
          </div>
        </article>
      `;
    }
    return html;
  },

  renderSkeletonUniversityDossiers(count = 6) {
    let html = "";
    for (let i = 0; i < count; i++) {
      html += `
        <article class="skeleton-dossier-card skeleton-body" aria-busy="true" aria-label="Loading university dossier...">
          <div class="skeleton-header-row">
            <div class="skeleton-shimmer skeleton-avatar" style="width: 48px; height: 48px; border-radius: 4px;"></div>
            <div class="flex-1">
              <div class="flex gap-2 mb-2">
                <div class="skeleton-shimmer skeleton-badge" style="width: 60px; height: 18px;"></div>
                <div class="skeleton-shimmer skeleton-badge" style="width: 70px; height: 18px;"></div>
                <div class="skeleton-shimmer skeleton-badge" style="width: 65px; height: 18px;"></div>
              </div>
              <div class="skeleton-shimmer skeleton-line-title" style="width: 70%; height: 20px;"></div>
              <div class="skeleton-shimmer skeleton-line-xs" style="width: 45%;"></div>
            </div>
          </div>
          <div class="skeleton-shimmer skeleton-line" style="height: 14px; width: 95%;"></div>
          <div class="skeleton-shimmer skeleton-line" style="height: 14px; width: 80%;"></div>
          <div class="skeleton-spec-grid" style="grid-template-columns: repeat(2, 1fr);">
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
          </div>
          <div class="skeleton-footer-row" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="skeleton-shimmer skeleton-pill" style="width: 130px; height: 32px;"></div>
            <div class="flex gap-2">
              <div class="skeleton-shimmer skeleton-btn" style="width: 110px; height: 36px;"></div>
              <div class="skeleton-shimmer skeleton-btn" style="width: 110px; height: 36px;"></div>
            </div>
          </div>
        </article>
      `;
    }
    return html;
  },

  renderSkeletonDetailHero() {
    return `
      <section class="univ-hero-dossier skeleton-body" aria-busy="true" aria-label="Loading institutional dossier...">
        <div class="univ-hero-left" style="padding: 2rem;">
          <div class="skeleton-header-row" style="margin-bottom: 1.5rem;">
            <div class="skeleton-shimmer skeleton-avatar-lg" style="width: 72px; height: 72px; border-radius: 4px;"></div>
            <div class="flex-1">
              <div class="flex gap-2 mb-2">
                <div class="skeleton-shimmer skeleton-badge"></div>
                <div class="skeleton-shimmer skeleton-badge"></div>
              </div>
              <div class="skeleton-shimmer skeleton-line-title" style="width: 75%; height: 28px;"></div>
              <div class="skeleton-shimmer skeleton-line-sm" style="width: 45%;"></div>
            </div>
          </div>
          <div class="skeleton-shimmer skeleton-line" style="height: 16px; width: 90%; margin-bottom: 8px;"></div>
          <div class="skeleton-shimmer skeleton-line" style="height: 16px; width: 75%; margin-bottom: 16px;"></div>
          <div class="skeleton-spec-grid" style="grid-template-columns: repeat(3, 1fr); padding: 1rem;">
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
            <div><div class="skeleton-shimmer skeleton-line-xs"></div><div class="skeleton-shimmer skeleton-line-sm"></div></div>
          </div>
          <div class="flex gap-3 mt-4">
            <div class="skeleton-shimmer skeleton-btn" style="width: 140px; height: 42px;"></div>
            <div class="skeleton-shimmer skeleton-btn" style="width: 140px; height: 42px;"></div>
          </div>
        </div>
        <div class="univ-hero-right" style="min-height: 280px; display: flex; align-items: center; justify-content: center;">
          <div class="skeleton-shimmer" style="width: 100%; height: 100%; min-height: 280px;"></div>
        </div>
      </section>
    `;
  }
};
