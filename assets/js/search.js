/**
 * EDUVIA SEARCH MODULE (assets/js/search.js)
 * Global search modal, keyboard shortcut listener (Cmd+K), and query autocomplete.
 */

const EduviaSearch = {
  activeIntent: "all",

  init() {
    this.setupKeyboardTrigger();
    this.setupInputListener();
    this.setupHeroSearch();
  },

  setupKeyboardTrigger() {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.open();
      }
    });
  },

  setupInputListener() {
    const input = document.getElementById("modal-search-input");
    if (input) {
      input.addEventListener("input", (e) => {
        this.handleSearch(e.target.value);
      });
    }
  },

  setupHeroSearch() {
    const heroInput = document.getElementById("hero-main-search-input");
    if (heroInput) {
      heroInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.open(heroInput.value, this.activeIntent);
        }
      });
    }
  },

  setIntent(intent, btnElement) {
    this.activeIntent = intent;
    document.querySelectorAll(".intent-tab-btn").forEach(btn => btn.classList.remove("active"));
    if (btnElement) {
      btnElement.classList.add("active");
    }
    const heroInput = document.getElementById("hero-main-search-input");
    if (heroInput) {
      const placeholders = {
        all: "Search programmes, universities or specialisations...",
        programmes: "Search degrees (e.g. MBA, MCA, M.Sc Data Science, BBA)...",
        universities: "Search universities (e.g. Manipal, Amity, Chandigarh, Jain)...",
        specialisations: "Search specialisations (e.g. AI & ML, FinTech, Cloud, Marketing)..."
      };
      heroInput.placeholder = placeholders[intent] || placeholders.all;
    }
  },

  open(initialQuery = "", intent = "all") {
    this.activeIntent = intent;
    const modal = document.getElementById("global-search-modal");
    const input = document.getElementById("modal-search-input");
    if (modal) {
      modal.classList.add("open");
      if (input) {
        input.value = initialQuery;
        input.focus();
        this.handleSearch(initialQuery);
      }
    }
  },

  handleSearch(query) {
    const resultsContainer = document.getElementById("modal-search-results");
    if (!resultsContainer) return;

    const q = query.trim().toLowerCase();
    
    let progMatches = [];
    let univMatches = [];

    if (!q) {
      progMatches = EduviaData.programmes.slice(0, 3);
      univMatches = EduviaData.universities.slice(0, 2);
    } else {
      if (this.activeIntent === "all" || this.activeIntent === "programmes" || this.activeIntent === "specialisations") {
        progMatches = EduviaData.programmes.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) || 
          (p.universityName && p.universityName.toLowerCase().includes(q)) ||
          (p.discipline && p.discipline.toLowerCase().includes(q)) ||
          (typeof p.specialisation === "string" && p.specialisation.toLowerCase().includes(q)) ||
          (Array.isArray(p.specialisations) && p.specialisations.some(s => s.toLowerCase().includes(q)))
        );
      }

      if (this.activeIntent === "all" || this.activeIntent === "universities") {
        univMatches = EduviaData.universities.filter(u =>
          u.name.toLowerCase().includes(q) ||
          u.shortName.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q)
        );
      }
    }

    if (progMatches.length === 0 && univMatches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="py-6 text-center text-xs text-on-surface-variant">
          No exact records matched "${query}". Try searching "MBA", "MCA", "Data Science", or "Manipal".
        </div>
      `;
      return;
    }

    let html = "";

    if (univMatches.length > 0) {
      html += `<div class="label-caps text-on-surface-variant mb-1 mt-1">Matched Universities (${univMatches.length})</div>`;
      html += univMatches.map(u => {
        const logoSrc = u.logoUrl || `assets/images/universities/logos/${u.id}.png`;
        const logoText = u.logoText || u.shortName || u.name.slice(0, 3);
        return `
        <div class="p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant flex items-center justify-between cursor-pointer transition-colors mb-2 gap-3" onclick="EduviaUI.closeAllModals(); EduviaUI.openUniversityDetailModal('${u.id}');">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="flex-shrink-0 flex items-center justify-center bg-white rounded p-1 border border-outline-variant shadow-sm" style="width: 48px; height: 38px;">
              ${logoSrc ? `<img src="${logoSrc}" alt="${u.name} institutional logo" width="40" height="30" loading="lazy" class="w-full h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />` : ''}
              <span class="text-[10px] font-bold text-primary font-headline" style="${logoSrc ? 'display:none;' : ''}">${logoText}</span>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[10px] uppercase font-bold text-primary block truncate">${u.badge} • ${u.approvals.join(', ')}</span>
              <h5 class="font-headline text-sm font-bold text-secondary truncate">${u.name}</h5>
              <span class="text-xs text-on-surface-variant block truncate">${u.location} • ${u.programmesCount}+ Verified Programmes</span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="font-headline font-bold text-xs text-secondary block">${u.feeRange}</span>
            <span class="text-[10px] text-primary block font-bold">EMI: ${u.emiStarts}</span>
          </div>
        </div>
      `;
      }).join("");
    }

    if (progMatches.length > 0) {
      html += `<div class="label-caps text-on-surface-variant mb-1 mt-2">Matched Degree Programmes (${progMatches.length})</div>`;
      html += progMatches.map(p => {
        const u = typeof EduviaData !== "undefined" && EduviaData.universities ? EduviaData.universities.find(univ => univ.id === p.universityId || univ.name === p.universityName) : null;
        const logoSrc = u ? (u.logoUrl || `assets/images/universities/logos/${u.id}.png`) : (p.logoUrl || '');
        const logoText = u ? (u.logoText || u.shortName || u.name.slice(0, 3)) : (p.universityName ? p.universityName.slice(0, 3) : 'UNI');
        return `
        <div class="p-3 bg-surface-container-low hover:bg-surface-container border border-outline-variant flex items-center justify-between cursor-pointer transition-colors mb-2 gap-3" onclick="EduviaUI.closeAllModals(); EduviaUI.openProgrammeDetailModal('${p.id}');">
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <div class="flex-shrink-0 flex items-center justify-center bg-white rounded p-1 border border-outline-variant shadow-sm" style="width: 48px; height: 38px;">
              ${logoSrc ? `<img src="${logoSrc}" alt="${p.universityName} official logo" width="40" height="30" loading="lazy" class="w-full h-full object-contain" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />` : ''}
              <span class="text-[10px] font-bold text-primary font-headline" style="${logoSrc ? 'display:none;' : ''}">${logoText}</span>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[10px] uppercase font-bold text-primary block truncate">${p.universityName}</span>
              <h5 class="font-headline text-sm font-bold text-secondary truncate">${p.title}</h5>
              <span class="text-xs text-on-surface-variant block truncate">${p.duration} • ${p.studyMode}</span>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="font-headline font-bold text-sm text-secondary block">₹${p.totalFee.toLocaleString('en-IN')}</span>
            <span class="text-[10px] text-primary block font-bold">EMI: ₹${p.emiMonthly}/mo</span>
          </div>
        </div>
      `;
      }).join("");
    }

    resultsContainer.innerHTML = html;
  }
};

/**
 * Toggle hero refine search drawer
 */
function toggleHeroRefineDrawer() {
  const drawer = document.getElementById("hero-refine-drawer");
  const toggle = document.getElementById("hero-refine-toggle");
  if (!drawer || !toggle) return;
  const isOpen = drawer.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  drawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

/**
 * Apply hero refine filters and navigate/scroll to catalog
 */
function applyHeroRefineSearch() {
  const disciplineSelect = document.getElementById("hero-discipline-select");
  const discipline = disciplineSelect ? disciplineSelect.value : "all";
  
  if (typeof filterByDiscipline === "function") {
    filterByDiscipline(discipline);
  }
  
  const catalog = document.getElementById("programmes-catalog-section");
  if (catalog) {
    catalog.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = "programmes.html" + (discipline !== "all" ? "?discipline=" + discipline : "");
  }
}
