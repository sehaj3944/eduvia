/**
 * EDUVIA FILTERS & DISCOVERY MODULE (assets/js/filters.js)
 * Phase 05: Programme discovery engine with multi-faceted filtering,
 * fuzzy search, sorting, URL synchronization, active chips, and mobile drawer.
 */

const EduviaFilters = {
  state: {
    query: "",
    countries: [],       // 'IN', 'CA', 'GB', 'US', 'AU', 'AE', 'DE', etc.
    levels: [],          // 'ug', 'pg', 'exec'
    disciplines: [],     // 'business', 'tech', 'data', 'commerce', 'healthcare'
    specialisations: [], // strings matching prog.specialisation
    universities: [],    // 'muj', 'cu', 'jain', 'amity', 'nmims', etc.
    modes: [],           // 'online', 'hybrid'
    locations: [],       // 'Rajasthan', 'Punjab', 'Karnataka', 'Uttar Pradesh', 'Maharashtra'
    durations: [],       // 2, 3
    feeRanges: [],       // 'under-150k', '150k-200k', 'above-200k'
    accreditations: [],  // 'UGC-DEB', 'AICTE', 'NAAC A+', 'NAAC A++', 'WES', 'Category-1'
    sortBy: "relevance"  // 'relevance', 'name-asc', 'fee-asc', 'fee-desc', 'duration-asc'
  },

  init() {
    const isProgPage = document.getElementById("programme-main-search-input") || document.getElementById("programmes-results-grid");
    if (!isProgPage) return;

    this.readUrlState();
    this.bindSearchInput();
    this.bindSortDropdown();
    this.bindMobileDrawer();
    this.renderSidebarFacets();
    this.applyFilters();

    // Listen to popstate (browser back/forward)
    window.addEventListener("popstate", () => {
      this.readUrlState();
      this.renderSidebarFacets();
      this.applyFilters(false);
    });
  },

  bindSearchInput() {
    const searchInput = document.getElementById("programme-main-search-input");
    if (searchInput) {
      if (this.state.query) {
        searchInput.value = this.state.query;
      }
      searchInput.addEventListener("input", (e) => {
        this.state.query = e.target.value.trim();
        this.applyFilters();
      });
      // Clear button inside search bar if present
      const clearBtn = document.getElementById("programme-search-clear-btn");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          this.state.query = "";
          searchInput.value = "";
          this.applyFilters();
          searchInput.focus();
        });
      }
    }
  },

  bindSortDropdown() {
    const sortSelect = document.getElementById("programme-sort-select");
    if (sortSelect) {
      sortSelect.value = this.state.sortBy;
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        this.applyFilters();
      });
    }
    const mobileSortSelect = document.getElementById("mobile-sort-select");
    if (mobileSortSelect) {
      mobileSortSelect.value = this.state.sortBy;
      mobileSortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        if (sortSelect) sortSelect.value = e.target.value;
        this.applyFilters();
      });
    }
  },

  bindMobileDrawer() {
    const openBtn = document.getElementById("open-mobile-filters-btn");
    const drawer = document.getElementById("mobile-filters-drawer");
    const closeBtn = document.getElementById("close-mobile-filters-btn");
    const backdrop = document.getElementById("mobile-filters-backdrop");
    const applyBtn = document.getElementById("apply-mobile-filters-btn");
    const clearBtn = document.getElementById("clear-mobile-filters-btn");

    if (openBtn && drawer) {
      openBtn.addEventListener("click", () => {
        drawer.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }
    const closeDrawer = () => {
      if (drawer) {
        drawer.classList.remove("open");
        document.body.style.overflow = "";
      }
    };
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        this.applyFilters();
        closeDrawer();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearAll();
        closeDrawer();
      });
    }
  },

  toggleFacet(category, value) {
    if (Array.isArray(this.state[category])) {
      const idx = this.state[category].indexOf(value);
      if (idx > -1) {
        this.state[category].splice(idx, 1);
      } else {
        this.state[category].push(value);
      }
    }
    this.renderSidebarFacets();
    this.applyFilters();
  },

  clearFilter(category, value) {
    if (category === "query") {
      this.state.query = "";
      const searchInput = document.getElementById("programme-main-search-input");
      if (searchInput) searchInput.value = "";
    } else if (Array.isArray(this.state[category])) {
      this.state[category] = this.state[category].filter(v => v !== value);
    }
    this.renderSidebarFacets();
    this.applyFilters();
  },

  clearAll() {
    this.state.query = "";
    this.state.countries = [];
    this.state.levels = [];
    this.state.disciplines = [];
    this.state.specialisations = [];
    this.state.universities = [];
    this.state.modes = [];
    this.state.locations = [];
    this.state.durations = [];
    this.state.feeRanges = [];
    this.state.accreditations = [];
    this.state.sortBy = "relevance";

    const searchInput = document.getElementById("programme-main-search-input");
    if (searchInput) searchInput.value = "";
    const sortSelect = document.getElementById("programme-sort-select");
    if (sortSelect) sortSelect.value = "relevance";
    const mobileSortSelect = document.getElementById("mobile-sort-select");
    if (mobileSortSelect) mobileSortSelect.value = "relevance";

    this.renderSidebarFacets();
    this.applyFilters();
    if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
      EduviaUI.showToast("All filters and searches have been reset");
    }
  },

  renderSidebarFacets() {
    const rawProgrammes = EduviaData.programmes || [];

    // Derive available facets and counts from dataset
    const counts = {
      countries: {},
      levels: {},
      disciplines: {},
      universities: {},
      modes: {},
      locations: {},
      durations: {},
      feeRanges: {
        "under-150k": 0,
        "150k-200k": 0,
        "above-200k": 0
      },
      accreditations: {}
    };

    // Calculate country counts (based on available countries list or primary country)
    const allSupportedCountries = (typeof EduviaI18n !== "undefined" && EduviaI18n.countries) 
      ? EduviaI18n.countries 
      : [{ code: "IN", name: "India", flag: "🇮🇳" }];

    allSupportedCountries.forEach(c => {
      counts.countries[c.code] = 0;
    });

    rawProgrammes.forEach(p => {
      // Countries
      if (Array.isArray(p.countriesAvailable)) {
        p.countriesAvailable.forEach(cCode => {
          counts.countries[cCode] = (counts.countries[cCode] || 0) + 1;
        });
      } else {
        const cCode = p.country || "IN";
        counts.countries[cCode] = (counts.countries[cCode] || 0) + 1;
      }

      // Level
      counts.levels[p.degreeLevel] = (counts.levels[p.degreeLevel] || 0) + 1;
      // Discipline
      counts.disciplines[p.discipline] = (counts.disciplines[p.discipline] || 0) + 1;
      // University
      counts.universities[p.universityId] = (counts.universities[p.universityId] || 0) + 1;
      // Study mode
      const modeKey = p.modeCategory || (p.studyMode.toLowerCase().includes("hybrid") ? "hybrid" : "online");
      counts.modes[modeKey] = (counts.modes[modeKey] || 0) + 1;
      // Location / State
      if (p.state) {
        counts.locations[p.state] = (counts.locations[p.state] || 0) + 1;
      }
      // Duration
      if (p.durationYears) {
        counts.durations[p.durationYears] = (counts.durations[p.durationYears] || 0) + 1;
      }
      // Fee
      if (p.totalFee < 150000) counts.feeRanges["under-150k"]++;
      else if (p.totalFee <= 200000) counts.feeRanges["150k-200k"]++;
      else counts.feeRanges["above-200k"]++;
      // Accreditations
      if (Array.isArray(p.accreditations)) {
        p.accreditations.forEach(acc => {
          counts.accreditations[acc] = (counts.accreditations[acc] || 0) + 1;
        });
      }
    });

    const levelLabels = {
      ug: "Undergraduate (UG)",
      pg: "Postgraduate (PG)",
      exec: "Executive / Working Pro"
    };

    const disciplineLabels = {
      business: "Business & Management",
      tech: "Computer Science & IT",
      data: "Data Science & AI",
      commerce: "Commerce & Accounting",
      healthcare: "Healthcare & Hospital Mgmt"
    };

    const univLabels = {
      muj: "Manipal University Jaipur",
      cu: "Chandigarh University",
      jain: "Jain University (Online)",
      amity: "Amity University Online",
      nmims: "NMIMS CDOE"
    };

    const modeLabels = {
      online: "100% Online",
      hybrid: "Hybrid / Case Cohorts"
    };

    // Helper to generate checkbox HTML
    const makeCheckbox = (category, value, label, count) => {
      const isChecked = this.state[category].includes(value);
      return `
        <label class="facet-checkbox-label">
          <input type="checkbox" ${isChecked ? "checked" : ""} onchange="EduviaFilters.toggleFacet('${category}', '${value}')">
          <span class="facet-name">${label}</span>
          <span class="facet-count">(${count})</span>
        </label>
      `;
    };

    const makeCheckboxNumeric = (category, value, label, count) => {
      const isChecked = this.state[category].includes(value);
      return `
        <label class="facet-checkbox-label">
          <input type="checkbox" ${isChecked ? "checked" : ""} onchange="EduviaFilters.toggleFacet('${category}', ${value})">
          <span class="facet-name">${label}</span>
          <span class="facet-count">(${count})</span>
        </label>
      `;
    };

    // Prominent study destinations to show in sidebar filter
    const featuredCountries = ["IN", "CA", "GB", "US", "AU", "AE", "DE", "FR", "SG", "MY"];
    const countryList = allSupportedCountries.filter(c => featuredCountries.includes(c.code) || (counts.countries[c.code] && counts.countries[c.code] > 0));

    const sidebarHTML = `
      <!-- 0. STUDY DESTINATION / COUNTRY -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Study Destination</h4>
        <div class="facet-options-list">
          ${countryList.slice(0, 8).map(c => makeCheckbox("countries", c.code, c.name, counts.countries[c.code] || rawProgrammes.length)).join("")}
        </div>
      </div>

      <!-- A. DEGREE LEVEL -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Degree Level</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.levels).map(lvl => makeCheckbox("levels", lvl, levelLabels[lvl] || lvl.toUpperCase(), counts.levels[lvl])).join("")}
        </div>
      </div>

      <!-- B. FIELD / DISCIPLINE -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Field / Discipline</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.disciplines).map(disc => makeCheckbox("disciplines", disc, disciplineLabels[disc] || disc, counts.disciplines[disc])).join("")}
        </div>
      </div>

      <!-- C. UNIVERSITY -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">University</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.universities).map(uId => {
            const uObj = EduviaData.getUniversityById(uId);
            const uName = uObj ? uObj.shortName : (univLabels[uId] || uId);
            return makeCheckbox("universities", uId, uName, counts.universities[uId]);
          }).join("")}
        </div>
      </div>

      <!-- D. STUDY MODE -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Study Mode</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.modes).map(mode => makeCheckbox("modes", mode, modeLabels[mode] || mode, counts.modes[mode])).join("")}
        </div>
      </div>

      <!-- E. LOCATION / STATE -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Location / State</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.locations).map(loc => makeCheckbox("locations", loc, loc, counts.locations[loc])).join("")}
        </div>
      </div>

      <!-- F. DURATION -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Duration</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.durations).sort().map(dur => makeCheckboxNumeric("durations", parseInt(dur), `${dur} Years`, counts.durations[dur])).join("")}
        </div>
      </div>

      <!-- G. FEES -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Total Course Fees</h4>
        <div class="facet-options-list">
          ${makeCheckbox("feeRanges", "under-150k", "Under ₹1.5 Lakhs", counts.feeRanges["under-150k"])}
          ${makeCheckbox("feeRanges", "150k-200k", "₹1.5L - ₹2.0 Lakhs", counts.feeRanges["150k-200k"])}
          ${makeCheckbox("feeRanges", "above-200k", "Above ₹2.0 Lakhs", counts.feeRanges["above-200k"])}
        </div>
      </div>

      <!-- H. ACCREDITATION / RECOGNITION -->
      <div class="filter-facet-group">
        <h4 class="facet-group-title">Accreditation & Approvals</h4>
        <div class="facet-options-list">
          ${Object.keys(counts.accreditations).map(acc => makeCheckbox("accreditations", acc, acc, counts.accreditations[acc])).join("")}
        </div>
      </div>
    `;

    const desktopContainer = document.getElementById("desktop-filter-facets-container");
    if (desktopContainer) desktopContainer.innerHTML = sidebarHTML;

    const mobileContainer = document.getElementById("mobile-filter-facets-container");
    if (mobileContainer) mobileContainer.innerHTML = sidebarHTML;
  },

  applyFilters(syncUrl = true) {
    const rawProgrammes = EduviaData.programmes || [];

    let results = rawProgrammes.filter(p => {
      // 0. Country / Study Destination Filter
      if (this.state.countries && this.state.countries.length > 0) {
        const matchesCountry = this.state.countries.some(code => {
          if (p.country && p.country.toUpperCase() === code.toUpperCase()) return true;
          if (Array.isArray(p.countriesAvailable) && p.countriesAvailable.includes(code.toUpperCase())) return true;
          return false;
        });
        if (!matchesCountry) return false;
      }

      // 1. Text Search Query matching title, university, discipline, specialisation, location, studyMode
      if (this.state.query) {
        const q = this.state.query.toLowerCase();
        const matchesQuery = 
          p.title.toLowerCase().includes(q) ||
          p.universityName.toLowerCase().includes(q) ||
          p.discipline.toLowerCase().includes(q) ||
          (p.specialisation && p.specialisation.toLowerCase().includes(q)) ||
          (p.studyMode && p.studyMode.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          (p.accreditation && p.accreditation.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Degree Level
      if (this.state.levels.length > 0 && !this.state.levels.includes(p.degreeLevel)) {
        return false;
      }

      // 3. Discipline
      if (this.state.disciplines.length > 0 && !this.state.disciplines.includes(p.discipline)) {
        return false;
      }

      // 4. University
      if (this.state.universities.length > 0 && !this.state.universities.includes(p.universityId)) {
        return false;
      }

      // 5. Study Mode
      if (this.state.modes.length > 0) {
        const pMode = p.modeCategory || (p.studyMode.toLowerCase().includes("hybrid") ? "hybrid" : "online");
        if (!this.state.modes.includes(pMode)) return false;
      }

      // 6. Location / State
      if (this.state.locations.length > 0 && (!p.state || !this.state.locations.includes(p.state))) {
        return false;
      }

      // 7. Duration
      if (this.state.durations.length > 0 && (!p.durationYears || !this.state.durations.includes(p.durationYears))) {
        return false;
      }

      // 8. Fee Ranges
      if (this.state.feeRanges.length > 0) {
        const fee = p.totalFee;
        let matchFee = false;
        if (this.state.feeRanges.includes("under-150k") && fee < 150000) matchFee = true;
        if (this.state.feeRanges.includes("150k-200k") && fee >= 150000 && fee <= 200000) matchFee = true;
        if (this.state.feeRanges.includes("above-200k") && fee > 200000) matchFee = true;
        if (!matchFee) return false;
      }

      // 9. Accreditations
      if (this.state.accreditations.length > 0) {
        const pAccreds = p.accreditations || (p.accreditation ? p.accreditation.split(",").map(s => s.trim()) : []);
        const hasAll = this.state.accreditations.some(acc => pAccreds.includes(acc));
        if (!hasAll) return false;
      }

      return true;
    });

    // Apply Sorting
    results = this.sortResults(results);

    // Render Dynamic Results
    this.renderProgrammeResults(results);
    this.renderActiveFilterChips();
    this.updateCounters(results.length, rawProgrammes.length);

    if (syncUrl) {
      this.syncUrlState();
    }
  },

  sortResults(list) {
    const sorted = [...list];
    switch (this.state.sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "fee-asc":
        return sorted.sort((a, b) => a.totalFee - b.totalFee);
      case "fee-desc":
        return sorted.sort((a, b) => b.totalFee - a.totalFee);
      case "duration-asc":
        return sorted.sort((a, b) => (a.durationYears || 0) - (b.durationYears || 0));
      case "relevance":
      default:
        return sorted;
    }
  },

  showSkeletonLoader() {
    const container = document.getElementById("programmes-results-grid");
    if (!container) return;
    if (typeof EduviaUI !== "undefined" && typeof EduviaUI.renderSkeletonDossiers === "function") {
      container.innerHTML = EduviaUI.renderSkeletonDossiers(6);
    }
  },

  renderProgrammeResults(results) {
    const container = document.getElementById("programmes-results-grid");
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-results-box" role="region" aria-label="No programmes found">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3 class="empty-title">NO PROGRAMMES FOUND</h3>
          <p class="empty-desc">We couldn't find programmes matching your current search and filter selections. Try removing one or more filters to broaden your exploration.</p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-sm" onclick="EduviaFilters.clearAll()">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Clear All Filters</span>
            </button>
            <a href="discover.html" class="btn btn-outline btn-sm">
              <span>Explore Career Paths</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map(prog => {
      const isSelectedCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes)
        ? EduviaComparison.selectedProgrammes.includes(prog.id)
        : false;
      const uObj = (typeof EduviaData !== "undefined" && EduviaData.getUniversityById) ? EduviaData.getUniversityById(prog.universityId) : null;
      const logoText = uObj ? uObj.logoText : prog.universityName.substring(0, 3).toUpperCase();
      const uLogoSrc = uObj ? (uObj.logoUrl || `assets/images/universities/logos/${uObj.id}.png`) : '';
      const levelBadge = prog.degreeLevel === "ug" ? "Undergraduate" : (prog.degreeLevel === "exec" ? "Executive" : "Postgraduate");
      const isShortlisted = (typeof EduviaUI !== "undefined" && Array.isArray(EduviaUI.shortlist))
        ? EduviaUI.shortlist.includes(prog.id)
        : false;

      // Currency and Fee localization
      let formattedTotalFee = `₹${prog.totalFee.toLocaleString('en-IN')}`;
      let formattedEmi = `₹${prog.emiMonthly.toLocaleString('en-IN')}/mo`;
      let convertedNoteHtml = '';

      if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
        const convTotal = EduviaI18n.convertPrice(prog.totalFee, prog.originalCurrency || "INR");
        const convEmi = EduviaI18n.convertPrice(prog.emiMonthly, prog.originalCurrency || "INR");
        formattedTotalFee = convTotal.formatted;
        formattedEmi = `${convEmi.formatted}/mo`;
        if (convTotal.isConverted) {
          convertedNoteHtml = `
            <span class="pricing-converted-note" title="Original Published Fee: ₹${prog.totalFee.toLocaleString('en-IN')} INR">
              ≈ Approx (${convTotal.currency})
            </span>
          `;
        }
      }

      return `
        <article class="programme-dossier-card ${isSelectedCompare ? 'is-selected-compare' : ''}" id="prog-card-${prog.id}">
          <!-- Header Area -->
          <div class="dossier-header">
            <div class="dossier-univ-row">
              <div class="dossier-logo-badge" aria-hidden="true">
                ${uLogoSrc ? `<img src="${uLogoSrc}" alt="${prog.universityName} logo" class="dossier-logo-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />` : ''}
                <span class="dossier-logo-text" ${uLogoSrc ? 'style="display: none;"' : ''}>${logoText}</span>
              </div>
              <div class="dossier-univ-info">
                <span class="dossier-univ-name">${prog.universityName}</span>
                <span class="dossier-univ-location">${prog.location || (uObj ? uObj.location : 'India')}</span>
              </div>
              <button class="dossier-shortlist-btn ${isShortlisted ? 'active' : ''}" 
                      title="${isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}" 
                      onclick="EduviaUI.toggleShortlist('${prog.id}')"
                      aria-label="Shortlist ${prog.title}">
                <span class="material-symbols-outlined text-[20px]">${isShortlisted ? 'favorite' : 'favorite_border'}</span>
              </button>
            </div>
            
            <h3 class="dossier-title">
              <a href="programme.html?id=${encodeURIComponent(prog.id)}">${prog.title}</a>
            </h3>

            ${prog.specialisation ? `
              <div class="dossier-spec-tag">
                <span class="spec-label">Specialisation:</span>
                <span class="spec-value">${prog.specialisation}</span>
              </div>
            ` : ''}
          </div>

          <!-- Structured Meta Grid -->
          <div class="dossier-specs-matrix">
            <div class="matrix-cell">
              <span class="cell-k">Degree Level</span>
              <span class="cell-v font-bold">${levelBadge}</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">Study Mode</span>
              <span class="cell-v">${prog.studyMode}</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">Duration</span>
              <span class="cell-v font-bold">${prog.duration}</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">Accreditation</span>
              <span class="cell-v text-jade-deep font-semibold">${prog.accreditation}</span>
            </div>
          </div>

          <!-- Description / Highlights Preview -->
          <p class="dossier-summary">${prog.description || prog.highlights.join(" • ")}</p>

          <!-- Pricing & Actions Footer -->
          <div class="dossier-footer">
            <div class="dossier-pricing-col">
              <span class="pricing-label">Total Course Fee</span>
              <div class="pricing-val-wrap">
                <span class="pricing-total">${formattedTotalFee}</span>
                <span class="pricing-emi">(EMI: ${formattedEmi})</span>
                ${convertedNoteHtml}
              </div>
            </div>

            <div class="dossier-actions-col">
              <label class="compare-checkbox-pill" title="Compare this programme">
                <input type="checkbox" ${isSelectedCompare ? 'checked' : ''} onchange="EduviaComparison.toggleCompare('${prog.id}')">
                <span>${isSelectedCompare ? '✓ Compared' : '+ Compare'}</span>
              </label>
              <a href="programme.html?id=${encodeURIComponent(prog.id)}" class="btn btn-primary btn-sm dossier-view-btn">
                <span>View Programme</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  renderActiveFilterChips() {
    const container = document.getElementById("active-filters-chips-bar");
    const chipsWrapper = document.getElementById("active-filter-chips-list");
    if (!container || !chipsWrapper) return;

    const chips = [];

    // Search query chip
    if (this.state.query) {
      chips.push({
        category: "query",
        value: this.state.query,
        label: `Search: "${this.state.query}"`
      });
    }

    // Country chips
    if (this.state.countries && this.state.countries.length > 0) {
      this.state.countries.forEach(cCode => {
        const cObj = (typeof EduviaI18n !== "undefined" && EduviaI18n.getCountry) ? EduviaI18n.getCountry(cCode) : null;
        chips.push({
          category: "countries",
          value: cCode,
          label: cObj ? cObj.name : cCode
        });
      });
    }

    // Levels
    const levelNames = { ug: "Undergraduate", pg: "Postgraduate", exec: "Executive" };
    this.state.levels.forEach(lvl => {
      chips.push({ category: "levels", value: lvl, label: levelNames[lvl] || lvl });
    });

    // Disciplines
    const discNames = {
      business: "Business & Management",
      tech: "Computer Science & IT",
      data: "Data Science & AI",
      commerce: "Commerce & Accounting",
      healthcare: "Healthcare & Hospital"
    };
    this.state.disciplines.forEach(d => {
      chips.push({ category: "disciplines", value: d, label: discNames[d] || d });
    });

    // Universities
    this.state.universities.forEach(uId => {
      const u = EduviaData.getUniversityById(uId);
      chips.push({ category: "universities", value: uId, label: u ? u.shortName : uId });
    });

    // Modes
    const modeNames = { online: "Online", hybrid: "Hybrid" };
    this.state.modes.forEach(m => {
      chips.push({ category: "modes", value: m, label: modeNames[m] || m });
    });

    // Locations
    this.state.locations.forEach(loc => {
      chips.push({ category: "locations", value: loc, label: loc });
    });

    // Durations
    this.state.durations.forEach(dur => {
      chips.push({ category: "durations", value: dur, label: `${dur} Years` });
    });

    // Fee Ranges
    const feeNames = {
      "under-150k": "< ₹1.5L",
      "150k-200k": "₹1.5L - ₹2.0L",
      "above-200k": "> ₹2.0L"
    };
    this.state.feeRanges.forEach(f => {
      chips.push({ category: "feeRanges", value: f, label: feeNames[f] || f });
    });

    // Accreditations
    this.state.accreditations.forEach(acc => {
      chips.push({ category: "accreditations", value: acc, label: acc });
    });

    if (chips.length > 0) {
      container.style.display = "flex";
      chipsWrapper.innerHTML = `
        ${chips.map(chip => `
          <button class="active-filter-chip" onclick="EduviaFilters.clearFilter('${chip.category}', '${chip.value}')" title="Remove filter">
            <span>${chip.label}</span>
            <span class="chip-remove" aria-hidden="true">✕</span>
          </button>
        `).join("")}
        <button class="clear-all-filters-btn" onclick="EduviaFilters.clearAll()">
          Clear all
        </button>
      `;
    } else {
      container.style.display = "none";
      chipsWrapper.innerHTML = "";
    }
  },

  updateCounters(matchingCount, totalCount) {
    const introCount = document.getElementById("intro-programme-count");
    if (introCount) {
      introCount.textContent = `Showing ${matchingCount} of ${totalCount} programmes`;
    }

    const headerCount = document.getElementById("results-header-count");
    if (headerCount) {
      headerCount.textContent = `${matchingCount} ${matchingCount === 1 ? 'programme' : 'programmes'} found`;
    }

    const mobileCountBadge = document.getElementById("mobile-filter-count-badge");
    if (mobileCountBadge) {
      mobileCountBadge.textContent = `${matchingCount}`;
    }
  },

  syncUrlState() {
    const params = new URLSearchParams();
    if (this.state.query) params.set("q", this.state.query);
    if (this.state.countries && this.state.countries.length > 0) params.set("country", this.state.countries.join(","));
    if (this.state.levels.length > 0) params.set("level", this.state.levels.join(","));
    if (this.state.disciplines.length > 0) params.set("discipline", this.state.disciplines.join(","));
    if (this.state.universities.length > 0) params.set("univ", this.state.universities.join(","));
    if (this.state.modes.length > 0) params.set("mode", this.state.modes.join(","));
    if (this.state.locations.length > 0) params.set("loc", this.state.locations.join(","));
    if (this.state.durations.length > 0) params.set("dur", this.state.durations.join(","));
    if (this.state.feeRanges.length > 0) params.set("fee", this.state.feeRanges.join(","));
    if (this.state.accreditations.length > 0) params.set("accred", this.state.accreditations.join(","));
    if (this.state.sortBy !== "relevance") params.set("sort", this.state.sortBy);

    const queryString = params.toString();
    const newRelativePathQuery = window.location.pathname + (queryString ? "?" + queryString : "");
    window.history.replaceState({ path: newRelativePathQuery }, "", newRelativePathQuery);
  },

  readUrlState() {
    const params = new URLSearchParams(window.location.search);
    this.state.query = params.get("q") || params.get("degree") || "";
    this.state.countries = params.get("country") ? params.get("country").split(",") : [];
    this.state.levels = params.get("level") ? params.get("level").split(",") : [];
    this.state.disciplines = params.get("discipline") ? params.get("discipline").split(",") : [];
    this.state.universities = params.get("univ") ? params.get("univ").split(",") : [];
    this.state.modes = params.get("mode") ? params.get("mode").split(",") : [];
    this.state.locations = params.get("loc") ? params.get("loc").split(",") : [];
    this.state.durations = params.get("dur") ? params.get("dur").split(",").map(Number) : [];
    this.state.feeRanges = params.get("fee") ? params.get("fee").split(",") : [];
    this.state.accreditations = params.get("accred") ? params.get("accred").split(",") : [];
    this.state.sortBy = params.get("sort") || "relevance";
  }
};

/**
 * ============================================================================
 * EDUVIA UNIVERSITY FILTERS MODULE (Phase 07: University Discovery & Directory)
 * ============================================================================
 */
const EduviaUniversityFilters = {
  state: {
    query: "",
    modes: [],          // 'online', 'hybrid'
    types: [],          // 'Private University', 'Deemed University'
    locations: [],      // 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Karnataka', 'Maharashtra', 'Uttarakhand'
    regions: [],        // 'North India', 'South India', 'West India'
    levels: [],         // 'ug', 'pg', 'exec'
    disciplines: [],    // 'business', 'tech', 'data', 'commerce', 'healthcare'
    accreditations: [], // 'UGC-DEB', 'NAAC A+', 'NAAC A++', 'NIRF Ranked', 'AICTE', 'WES'
    sortBy: "relevance" // 'relevance', 'name-asc', 'name-desc', 'location', 'programmes-desc'
  },

  // Helper mapping to extract metadata for each university
  getMeta(univ) {
    const locParts = (univ.location || "").split(",");
    const city = locParts[0] ? locParts[0].trim() : "";
    const state = locParts[1] ? locParts[1].trim() : "";

    let region = "North India";
    if (["Karnataka", "Tamil Nadu", "Kerala", "Telangana", "Andhra Pradesh"].includes(state)) {
      region = "South India";
    } else if (["Maharashtra", "Gujarat", "Goa"].includes(state)) {
      region = "West India";
    } else if (["West Bengal", "Odisha", "Bihar", "Jharkhand"].includes(state)) {
      region = "East India";
    }

    let typeCategory = "Private University";
    if ((univ.type || "").toLowerCase().includes("deemed")) {
      typeCategory = "Deemed University";
    }

    const progs = (typeof EduviaData !== "undefined" && EduviaData.getProgrammesByUniversity) 
      ? EduviaData.getProgrammesByUniversity(univ.id) 
      : [];

    const disciplines = [...new Set(progs.map(p => p.discipline).filter(Boolean))];
    const levels = [...new Set(progs.map(p => p.degreeLevel).filter(Boolean))];

    // University official logo mapping
    const logoMap = {
      lpu: "uni/Lovely-Professional-University-Online-logo.webp",
      amrita: "uni/amrita-online-ahead-logo.webp",
      cu: "uni/chandigarh-online-university-logo.webp",
      deakin: "uni/deakin-business-school-logo-with-upgrad.webp",
      dypatil: "uni/dy-patil-vidyapeeth-university-online.webp",
      chitkara: "uni/online-chitkara-university-logo.webp",
      parul: "uni/parul-university-logo.webp",
      shoolini: "uni/shoolini-university-online-logo.webp",
      muj: "assets/images/universities/logos/muj.png",
      amity: "assets/images/universities/logos/amity-online.png",
      jain: "assets/images/universities/logos/jain-university.png",
      nmims: "assets/images/universities/logos/nmims-cdoe.png",
      upes: "assets/images/universities/logos/upes.png"
    };

    // Modes supported
    const modes = ["online"];
    if (univ.id === "nmims" || (univ.examMode && univ.examMode.toLowerCase().includes("hybrid"))) {
      modes.push("hybrid");
    }

    // Accreditations list
    const accreditations = [...(univ.approvals || [])];
    if (univ.badge) accreditations.push(univ.badge);
    if (univ.nirfRank) accreditations.push("NIRF Ranked");

    return {
      city,
      state,
      region,
      typeCategory,
      modes,
      disciplines,
      levels,
      programmes: progs,
      accreditations,
      logoSrc: univ.logoUrl || logoMap[univ.id] || `assets/images/universities/logos/${univ.id}.png`
    };
  },

  init() {
    const isUnivPage = document.getElementById("univ-main-search-input") || document.getElementById("universities-results-container");
    if (!isUnivPage) return;

    this.readUrlState();
    this.bindSearchInput();
    this.bindQuickDiscovery();
    this.bindSortDropdown();
    this.bindMobileDrawer();
    this.renderSidebarFacets();
    this.applyFilters();

    // Listen to popstate (browser back/forward)
    window.addEventListener("popstate", () => {
      this.readUrlState();
      this.renderSidebarFacets();
      this.applyFilters(false);
    });
  },

  bindSearchInput() {
    const searchInput = document.getElementById("univ-main-search-input");
    if (searchInput) {
      if (this.state.query) {
        searchInput.value = this.state.query;
      }
      searchInput.addEventListener("input", (e) => {
        this.state.query = e.target.value.trim();
        this.applyFilters();
      });
      const clearBtn = document.getElementById("univ-search-clear-btn");
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          this.state.query = "";
          searchInput.value = "";
          this.applyFilters();
          searchInput.focus();
        });
      }
    }
  },

  bindQuickDiscovery() {
    const quickButtons = document.querySelectorAll(".quick-filter-btn");
    quickButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const fType = btn.getAttribute("data-filter-type"); // 'mode', 'type', 'region'
        const fVal = btn.getAttribute("data-filter-val");

        if (fType === "mode") {
          this.toggleFilter("modes", fVal);
        } else if (fType === "type") {
          this.toggleFilter("types", fVal);
        } else if (fType === "region") {
          this.toggleFilter("regions", fVal);
        }
      });
    });
  },

  updateQuickButtonsState() {
    document.querySelectorAll(".quick-filter-btn").forEach(btn => {
      const fType = btn.getAttribute("data-filter-type");
      const fVal = btn.getAttribute("data-filter-val");
      let isActive = false;

      if (fType === "mode" && this.state.modes.includes(fVal)) isActive = true;
      if (fType === "type" && this.state.types.includes(fVal)) isActive = true;
      if (fType === "region" && this.state.regions.includes(fVal)) isActive = true;

      if (isActive) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      }
    });
  },

  bindSortDropdown() {
    const sortSelect = document.getElementById("univ-sort-select");
    if (sortSelect) {
      sortSelect.value = this.state.sortBy;
      sortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        const mobileSort = document.getElementById("mobile-univ-sort-select");
        if (mobileSort) mobileSort.value = e.target.value;
        this.applyFilters();
      });
    }
    const mobileSortSelect = document.getElementById("mobile-univ-sort-select");
    if (mobileSortSelect) {
      mobileSortSelect.value = this.state.sortBy;
      mobileSortSelect.addEventListener("change", (e) => {
        this.state.sortBy = e.target.value;
        if (sortSelect) sortSelect.value = e.target.value;
        this.applyFilters();
      });
    }
  },

  bindMobileDrawer() {
    const openBtn = document.getElementById("open-mobile-univ-filters-btn");
    const drawer = document.getElementById("mobile-univ-filters-drawer");
    const closeBtn = document.getElementById("close-mobile-univ-filters-btn");
    const backdrop = document.getElementById("mobile-univ-filters-backdrop");
    const applyBtn = document.getElementById("apply-mobile-univ-filters-btn");
    const clearBtn = document.getElementById("clear-mobile-univ-filters-btn");

    if (openBtn && drawer) {
      openBtn.addEventListener("click", () => {
        drawer.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    }
    const closeDrawer = () => {
      if (drawer) {
        drawer.classList.remove("open");
        document.body.style.overflow = "";
      }
    };
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    if (applyBtn) applyBtn.addEventListener("click", closeDrawer);
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearAll();
        closeDrawer();
      });
    }
  },

  toggleFilter(category, value) {
    if (Array.isArray(this.state[category])) {
      const idx = this.state[category].indexOf(value);
      if (idx > -1) {
        this.state[category].splice(idx, 1);
      } else {
        this.state[category].push(value);
      }
    }
    this.renderSidebarFacets();
    this.applyFilters();
  },

  clearFilter(category, value) {
    if (category === "query") {
      this.state.query = "";
      const searchInput = document.getElementById("univ-main-search-input");
      if (searchInput) searchInput.value = "";
    } else if (Array.isArray(this.state[category])) {
      this.state[category] = this.state[category].filter(v => v !== value);
    }
    this.renderSidebarFacets();
    this.applyFilters();
  },

  clearAll() {
    this.state.query = "";
    this.state.modes = [];
    this.state.types = [];
    this.state.locations = [];
    this.state.regions = [];
    this.state.levels = [];
    this.state.disciplines = [];
    this.state.accreditations = [];
    this.state.sortBy = "relevance";

    const searchInput = document.getElementById("univ-main-search-input");
    if (searchInput) searchInput.value = "";
    const sortSelect = document.getElementById("univ-sort-select");
    if (sortSelect) sortSelect.value = "relevance";
    const mobileSortSelect = document.getElementById("mobile-univ-sort-select");
    if (mobileSortSelect) mobileSortSelect.value = "relevance";

    this.renderSidebarFacets();
    this.applyFilters();
    if (typeof EduviaUI !== "undefined") {
      EduviaUI.showToast("All university filters have been reset");
    }
  },

  renderSidebarFacets() {
    const rawUniversities = (typeof EduviaData !== "undefined" && EduviaData.universities) ? EduviaData.universities : [];

    // Calculate facet counts dynamically
    const counts = {
      types: {},
      modes: { online: 0, hybrid: 0 },
      locations: {},
      regions: {},
      levels: { pg: 0, ug: 0, exec: 0 },
      disciplines: { business: 0, tech: 0, data: 0, commerce: 0, healthcare: 0 },
      accreditations: { "UGC-DEB": 0, "NAAC A+": 0, "NAAC A++": 0, "NIRF Ranked": 0, "AICTE": 0, "WES": 0 }
    };

    rawUniversities.forEach(u => {
      const meta = this.getMeta(u);

      // Types
      counts.types[meta.typeCategory] = (counts.types[meta.typeCategory] || 0) + 1;

      // Modes
      meta.modes.forEach(m => {
        counts.modes[m] = (counts.modes[m] || 0) + 1;
      });

      // Locations / States
      if (meta.state) {
        counts.locations[meta.state] = (counts.locations[meta.state] || 0) + 1;
      }

      // Regions
      if (meta.region) {
        counts.regions[meta.region] = (counts.regions[meta.region] || 0) + 1;
      }

      // Levels
      meta.levels.forEach(lvl => {
        if (counts.levels[lvl] !== undefined) counts.levels[lvl]++;
      });

      // Disciplines
      meta.disciplines.forEach(d => {
        if (counts.disciplines[d] !== undefined) counts.disciplines[d]++;
      });

      // Accreditations
      meta.accreditations.forEach(acc => {
        if (counts.accreditations[acc] !== undefined) {
          counts.accreditations[acc]++;
        }
      });
    });

    const markup = `
      <!-- 1. University Type -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>University Type</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          ${Object.entries(counts.types).map(([typeKey, cnt]) => `
            <label class="facet-checkbox-label">
              <input type="checkbox" ${this.state.types.includes(typeKey) ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('types', '${typeKey}')" />
              <span class="facet-name">${typeKey}</span>
              <span class="facet-count">${cnt}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <!-- 2. Study Mode -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>Study Mode</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.modes.includes('online') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('modes', 'online')" />
            <span class="facet-name">100% Online</span>
            <span class="facet-count">${counts.modes.online}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.modes.includes('hybrid') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('modes', 'hybrid')" />
            <span class="facet-name">Hybrid / Weekend Cohorts</span>
            <span class="facet-count">${counts.modes.hybrid}</span>
          </label>
        </div>
      </div>

      <!-- 3. Location (State) -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>State / Location</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          ${Object.entries(counts.locations).map(([st, cnt]) => `
            <label class="facet-checkbox-label">
              <input type="checkbox" ${this.state.locations.includes(st) ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('locations', '${st}')" />
              <span class="facet-name">${st}</span>
              <span class="facet-count">${cnt}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <!-- 4. Geographic Region -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>Geographic Region</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          ${Object.entries(counts.regions).map(([reg, cnt]) => `
            <label class="facet-checkbox-label">
              <input type="checkbox" ${this.state.regions.includes(reg) ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('regions', '${reg}')" />
              <span class="facet-name">${reg}</span>
              <span class="facet-count">${cnt}</span>
            </label>
          `).join("")}
        </div>
      </div>

      <!-- 5. Degree Level Availability -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>Degree Levels Offered</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.levels.includes('pg') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('levels', 'pg')" />
            <span class="facet-name">Postgraduate (Masters)</span>
            <span class="facet-count">${counts.levels.pg}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.levels.includes('ug') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('levels', 'ug')" />
            <span class="facet-name">Undergraduate (Bachelors)</span>
            <span class="facet-count">${counts.levels.ug}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.levels.includes('exec') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('levels', 'exec')" />
            <span class="facet-name">Executive Post Graduate</span>
            <span class="facet-count">${counts.levels.exec}</span>
          </label>
        </div>
      </div>

      <!-- 6. Academic Discipline -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>Academic Discipline</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.disciplines.includes('business') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('disciplines', 'business')" />
            <span class="facet-name">Management & Strategy</span>
            <span class="facet-count">${counts.disciplines.business}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.disciplines.includes('tech') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('disciplines', 'tech')" />
            <span class="facet-name">Computer Science & IT</span>
            <span class="facet-count">${counts.disciplines.tech}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.disciplines.includes('data') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('disciplines', 'data')" />
            <span class="facet-name">Data Science & AI</span>
            <span class="facet-count">${counts.disciplines.data}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.disciplines.includes('commerce') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('disciplines', 'commerce')" />
            <span class="facet-name">Commerce & FinTech</span>
            <span class="facet-count">${counts.disciplines.commerce}</span>
          </label>
          <label class="facet-checkbox-label">
            <input type="checkbox" ${this.state.disciplines.includes('healthcare') ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('disciplines', 'healthcare')" />
            <span class="facet-name">Healthcare Administration</span>
            <span class="facet-count">${counts.disciplines.healthcare}</span>
          </label>
        </div>
      </div>

      <!-- 7. Statutory Recognition -->
      <div class="filter-facet-group">
        <button class="facet-header-btn" onclick="this.parentElement.classList.toggle('collapsed')">
          <span>Statutory Accreditation</span>
          <span class="material-symbols-outlined facet-collapse-icon">expand_more</span>
        </button>
        <div class="facet-options-list">
          ${Object.entries(counts.accreditations).map(([acc, cnt]) => `
            <label class="facet-checkbox-label">
              <input type="checkbox" ${this.state.accreditations.includes(acc) ? 'checked' : ''} onchange="EduviaUniversityFilters.toggleFilter('accreditations', '${acc}')" />
              <span class="facet-name">${acc}</span>
              <span class="facet-count">${cnt}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `;

    const desktopContainer = document.getElementById("university-filter-facets-container");
    if (desktopContainer) desktopContainer.innerHTML = markup;

    const mobileContainer = document.getElementById("mobile-univ-filter-facets-container");
    if (mobileContainer) mobileContainer.innerHTML = markup;

    this.updateQuickButtonsState();
  },

  applyFilters(syncUrl = true) {
    const rawUniversities = (typeof EduviaData !== "undefined" && EduviaData.universities) ? EduviaData.universities : [];

    let results = rawUniversities.filter(u => {
      const meta = this.getMeta(u);

      // 1. Search Query
      if (this.state.query) {
        const q = this.state.query.toLowerCase();
        const matchesName = (u.name || "").toLowerCase().includes(q);
        const matchesShort = (u.shortName || "").toLowerCase().includes(q);
        const matchesCity = meta.city.toLowerCase().includes(q);
        const matchesState = meta.state.toLowerCase().includes(q);
        const matchesRegion = meta.region.toLowerCase().includes(q);
        const matchesType = (u.type || "").toLowerCase().includes(q);
        const matchesDesc = (u.description || "").toLowerCase().includes(q);
        const matchesApprovals = (u.approvals || []).some(a => a.toLowerCase().includes(q));

        // Matches associated programmes title/specialisation/discipline
        const matchesProgs = meta.programmes.some(p => 
          (p.title || "").toLowerCase().includes(q) || 
          (p.specialisation || "").toLowerCase().includes(q) ||
          (p.discipline || "").toLowerCase().includes(q)
        );

        if (!matchesName && !matchesShort && !matchesCity && !matchesState && !matchesRegion && !matchesType && !matchesDesc && !matchesApprovals && !matchesProgs) {
          return false;
        }
      }

      // 2. Study Modes
      if (this.state.modes.length > 0) {
        const hasMode = this.state.modes.some(m => meta.modes.includes(m));
        if (!hasMode) return false;
      }

      // 3. University Type
      if (this.state.types.length > 0) {
        if (!this.state.types.includes(meta.typeCategory)) return false;
      }

      // 4. Locations (State)
      if (this.state.locations.length > 0) {
        if (!this.state.locations.includes(meta.state)) return false;
      }

      // 5. Geographic Region
      if (this.state.regions.length > 0) {
        if (!this.state.regions.includes(meta.region)) return false;
      }

      // 6. Degree Levels
      if (this.state.levels.length > 0) {
        const hasLevel = this.state.levels.some(lvl => meta.levels.includes(lvl));
        if (!hasLevel) return false;
      }

      // 7. Disciplines
      if (this.state.disciplines.length > 0) {
        const hasDisc = this.state.disciplines.some(d => meta.disciplines.includes(d));
        if (!hasDisc) return false;
      }

      // 8. Accreditations
      if (this.state.accreditations.length > 0) {
        const hasAcc = this.state.accreditations.some(acc => meta.accreditations.includes(acc));
        if (!hasAcc) return false;
      }

      return true;
    });

    // Apply Sorting
    results = this.sortResults(results);

    // Render Dynamic Results
    this.renderUniversityResults(results);
    this.renderActiveFilterChips();
    this.updateCounters(results.length, rawUniversities.length);
    this.updateQuickButtonsState();

    if (syncUrl) {
      this.syncUrlState();
    }
  },

  sortResults(list) {
    const sorted = [...list];
    switch (this.state.sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "location":
        return sorted.sort((a, b) => a.location.localeCompare(b.location));
      case "programmes-desc":
        return sorted.sort((a, b) => (b.programmesCount || 0) - (a.programmesCount || 0));
      case "relevance":
      default:
        return sorted;
    }
  },

  showSkeletonLoader() {
    const container = document.getElementById("universities-results-container");
    if (!container) return;
    if (typeof EduviaUI !== "undefined" && typeof EduviaUI.renderSkeletonUniversityDossiers === "function") {
      container.innerHTML = EduviaUI.renderSkeletonUniversityDossiers(4);
    }
  },

  renderUniversityResults(results) {
    const container = document.getElementById("universities-results-container");
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-results-box" role="status">
          <span class="material-symbols-outlined empty-icon" aria-hidden="true">domain_disabled</span>
          <h3 class="empty-title">NO UNIVERSITIES FOUND</h3>
          <p class="empty-desc">
            No universities match your selected filter criteria. Try removing one or more active filters, broadening your search term, or clearing all filters.
          </p>
          <div class="empty-actions">
            <button class="btn btn-primary btn-sm" onclick="EduviaUniversityFilters.clearAll()">
              <span>Clear All Filters</span>
            </button>
            <a href="programmes.html" class="btn btn-outline btn-sm">
              <span>Explore Programmes Instead</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      `;
      return;
    }

    const selectedCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedUniversities) 
      ? EduviaComparison.selectedUniversities 
      : [];

    container.innerHTML = results.map(univ => {
      const meta = this.getMeta(univ);
      const isSelected = selectedCompare.includes(univ.id);

      // Offerings summary tags
      const progs = meta.programmes;
      const progTags = progs.length > 0 
        ? progs.map(p => p.title.replace("Online ", "").replace("Master of Business Administration", "MBA").replace("Master of Computer Applications", "MCA").replace("Bachelor of Business Administration", "BBA").replace("Bachelor of Computer Applications", "BCA"))
        : ["MBA", "MCA", "BBA", "BCA", "FinTech", "Data Science"];

      return `
        <article class="university-dossier-card ${isSelected ? 'selected-for-compare' : ''}" id="univ-card-${univ.id}" data-id="${univ.id}">
          <div class="univ-card-top-header">
            <div class="univ-identity-col">
              <div class="univ-logo-box">
                <img src="${meta.logoSrc}" alt="${univ.name} Official Logo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" loading="lazy" />
                <div class="univ-logo-monogram" style="display: none;">${univ.logoText || univ.shortName.slice(0, 3)}</div>
              </div>
              <div class="univ-names-col">
                <div class="univ-badges-group">
                  <span class="badge badge-teal">${univ.badge}</span>
                  ${univ.nirfRank ? `<span class="badge badge-blue">NIRF ${univ.nirfRank.replace('Rank #', '#')}</span>` : ''}
                  <span class="badge badge-neutral">UGC-DEB</span>
                </div>
                <h3 class="univ-title">
                  <a href="university.html?id=${univ.id}">${univ.name}</a>
                </h3>
                <div class="univ-meta-subline">
                  <span class="univ-meta-location">
                    <span class="material-symbols-outlined text-[15px] text-outline">location_on</span>
                    <span>${univ.location}</span>
                  </span>
                  <span class="meta-dot">•</span>
                  <span class="univ-meta-type-badge">${meta.typeCategory}</span>
                  <span class="meta-dot">•</span>
                  <span class="univ-meta-est">Est. ${univ.established}</span>
                </div>
              </div>
            </div>
          </div>

          <p class="univ-description-prose">${univ.description}</p>

          <div class="univ-specs-matrix">
            <div class="matrix-cell">
              <span class="cell-k">Available Degrees</span>
              <span class="cell-v font-bold">${univ.programmesCount}+ Online Degrees</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">Tuition Range</span>
              <span class="cell-v font-bold">${univ.feeRange}</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">0% No-Cost EMI</span>
              <span class="cell-v font-bold text-jade-deep">${univ.emiStarts}</span>
            </div>
            <div class="matrix-cell">
              <span class="cell-k">Student Rating</span>
              <span class="cell-v font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-warning text-[14px] fill-1">star</span>
                ${univ.rating} (${(univ.reviewsCount/1000).toFixed(1)}k verified)
              </span>
            </div>
          </div>

          <div class="univ-programmes-preview">
            <div class="univ-programmes-header">Curriculum Tracks & Specialisations Offered</div>
            <div class="univ-programmes-tag-list">
              ${progTags.slice(0, 4).map(t => `<span class="univ-prog-pill">${t}</span>`).join("")}
              ${progTags.length > 4 ? `<span class="text-xs text-on-surface-variant font-bold">+${progTags.length - 4} more</span>` : ''}
            </div>
          </div>

          <div class="univ-card-footer">
            <div class="univ-compare-col">
              <label class="compare-checkbox-pill" title="Select to compare side-by-side">
                <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="EduviaComparison.toggleCompare('${univ.id}')">
                <span class="material-symbols-outlined text-[16px]">${isSelected ? 'check_box' : 'add_box'}</span>
                <span>${isSelected ? 'Selected to Compare' : '+ Compare'}</span>
              </label>
            </div>

            <div class="univ-actions-col">
              <a href="programmes.html?univ=${univ.id}" class="btn btn-outline btn-sm">
                <span>View Programmes</span>
                <span class="material-symbols-outlined text-[16px]">school</span>
              </a>
              <a href="university.html?id=${univ.id}" class="btn btn-dark btn-sm">
                <span>View University</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  },

  renderActiveFilterChips() {
    const container = document.getElementById("active-univ-filters-bar");
    const chipsWrapper = document.getElementById("active-univ-chips-list");
    if (!container || !chipsWrapper) return;

    const chips = [];

    // Query
    if (this.state.query) {
      chips.push({ category: "query", value: this.state.query, label: `Search: "${this.state.query}"` });
    }

    // Modes
    const modeNames = { online: "100% Online", hybrid: "Hybrid" };
    this.state.modes.forEach(m => {
      chips.push({ category: "modes", value: m, label: modeNames[m] || m });
    });

    // Types
    this.state.types.forEach(t => {
      chips.push({ category: "types", value: t, label: t });
    });

    // Locations
    this.state.locations.forEach(loc => {
      chips.push({ category: "locations", value: loc, label: loc });
    });

    // Regions
    this.state.regions.forEach(reg => {
      chips.push({ category: "regions", value: reg, label: reg });
    });

    // Levels
    const levelNames = { ug: "Undergraduate", pg: "Postgraduate", exec: "Executive" };
    this.state.levels.forEach(lvl => {
      chips.push({ category: "levels", value: lvl, label: levelNames[lvl] || lvl });
    });

    // Disciplines
    const discNames = {
      business: "Management & Strategy",
      tech: "Computer Science & IT",
      data: "Data Science & AI",
      commerce: "Commerce & FinTech",
      healthcare: "Healthcare Administration"
    };
    this.state.disciplines.forEach(d => {
      chips.push({ category: "disciplines", value: d, label: discNames[d] || d });
    });

    // Accreditations
    this.state.accreditations.forEach(acc => {
      chips.push({ category: "accreditations", value: acc, label: acc });
    });

    if (chips.length > 0) {
      container.style.display = "flex";
      chipsWrapper.innerHTML = `
        ${chips.map(chip => `
          <button class="active-filter-chip" onclick="EduviaUniversityFilters.clearFilter('${chip.category}', '${chip.value}')" title="Remove filter">
            <span>${chip.label}</span>
            <span class="chip-remove" aria-hidden="true">✕</span>
          </button>
        `).join("")}
        <button class="clear-all-filters-btn" onclick="EduviaUniversityFilters.clearAll()">
          Clear all
        </button>
      `;
    } else {
      container.style.display = "none";
      chipsWrapper.innerHTML = "";
    }
  },

  updateCounters(matchingCount, totalCount) {
    const introCount = document.getElementById("intro-university-count");
    if (introCount) {
      introCount.textContent = `Showing ${matchingCount} of ${totalCount} universities available`;
    }

    const headerCount = document.getElementById("results-university-count");
    if (headerCount) {
      headerCount.textContent = `${matchingCount} ${matchingCount === 1 ? 'university' : 'universities'} found`;
    }

    const mobileCountBadge = document.getElementById("mobile-univ-filter-count-badge");
    if (mobileCountBadge) {
      mobileCountBadge.textContent = `${matchingCount}`;
    }
  },

  syncUrlState() {
    const params = new URLSearchParams();
    if (this.state.query) params.set("q", this.state.query);
    if (this.state.modes.length > 0) params.set("mode", this.state.modes.join(","));
    if (this.state.types.length > 0) params.set("type", this.state.types.join(","));
    if (this.state.locations.length > 0) params.set("location", this.state.locations.join(","));
    if (this.state.regions.length > 0) params.set("region", this.state.regions.join(","));
    if (this.state.levels.length > 0) params.set("level", this.state.levels.join(","));
    if (this.state.disciplines.length > 0) params.set("discipline", this.state.disciplines.join(","));
    if (this.state.accreditations.length > 0) params.set("accred", this.state.accreditations.join(","));
    if (this.state.sortBy !== "relevance") params.set("sort", this.state.sortBy);

    const queryString = params.toString();
    const newRelativePathQuery = window.location.pathname + (queryString ? "?" + queryString : "");
    window.history.replaceState({ path: newRelativePathQuery }, "", newRelativePathQuery);
  },

  readUrlState() {
    const params = new URLSearchParams(window.location.search);
    this.state.query = params.get("q") || "";
    this.state.modes = params.get("mode") ? params.get("mode").split(",") : [];
    this.state.types = params.get("type") ? params.get("type").split(",") : [];
    this.state.locations = params.get("location") ? params.get("location").split(",") : [];
    this.state.regions = params.get("region") ? params.get("region").split(",") : [];
    this.state.levels = params.get("level") ? params.get("level").split(",") : [];
    this.state.disciplines = params.get("discipline") ? params.get("discipline").split(",") : [];
    this.state.accreditations = params.get("accred") ? params.get("accred").split(",") : [];
    this.state.sortBy = params.get("sort") || "relevance";
  }
};

/**
 * Persona profile prefill presets
 */
const EduviaPersonaPresets = {
  exec: { step1: "pro", step2: "mba", step3: "mid", step4: "pivot" },
  tech: { step1: "grad", step2: "mca", step3: "mid", step4: "salary" },
  grad: { step1: "grad", step2: "ds", step3: "budget", step4: "pivot" },
  govt: { step1: "grad", step2: "fin", step3: "budget", step4: "govt" }
};

/**
 * Handle clicking a persona card on the left
 */
function selectPersonaProfile(personaKey, btn) {
  document.querySelectorAll(".persona-intent-card").forEach(c => {
    c.classList.remove("active");
    c.setAttribute("aria-pressed", "false");
  });
  if (btn) {
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
  }

  const preset = EduviaPersonaPresets[personaKey];
  if (!preset) return;

  Object.keys(preset).forEach(step => {
    const val = preset[step];
    document.querySelectorAll(`.quiz-btn-option[data-step="${step}"]`).forEach(opt => {
      if (opt.dataset.val === val) {
        opt.classList.add("selected");
      } else {
        opt.classList.remove("selected");
      }
    });
  });
}

/**
 * Handle selecting an option inside the selector form
 */
function selectSelectorOption(step, val, btn) {
  document.querySelectorAll(`.quiz-btn-option[data-step="${step}"]`).forEach(opt => {
    opt.classList.remove("selected");
  });
  if (btn) {
    btn.classList.add("selected");
  }
}

/**
 * Show matched programmes dynamically
 */
function showMatchedProgrammes() {
  const step1 = document.querySelector('.quiz-btn-option[data-step="step1"].selected')?.dataset.val || "grad";
  const step2 = document.querySelector('.quiz-btn-option[data-step="step2"].selected')?.dataset.val || "mba";
  const step3 = document.querySelector('.quiz-btn-option[data-step="step3"].selected')?.dataset.val || "mid";
  const step4 = document.querySelector('.quiz-btn-option[data-step="step4"].selected')?.dataset.val || "pivot";

  const discMap = { mba: "business", mca: "tech", ds: "data", fin: "commerce", ug: "business" };
  const targetDiscipline = discMap[step2] || "business";

  let matches = [];
  if (typeof EduviaData !== "undefined" && EduviaData.programmes) {
    matches = EduviaData.programmes.filter(p => p.discipline === targetDiscipline);
    if (matches.length === 0) matches = EduviaData.programmes.slice(0, 3);
  }

  const resultBox = document.getElementById("quiz-result-box");
  if (resultBox) {
    resultBox.classList.add("active");
    resultBox.innerHTML = `
      <div class="flex items-center justify-between mb-3 border-b border-border-card pb-2">
        <div>
          <span class="label-caps text-primary font-bold">Matched Degree Pathways</span>
          <h4 class="font-headline font-bold text-sm text-secondary">Found ${matches.length} Verified Programmes Matching Your Criteria</h4>
        </div>
        <button type="button" class="text-xs text-muted hover:text-primary cursor-pointer border-none bg-transparent" onclick="this.closest('#quiz-result-box').classList.remove('active')">✕ Close</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        ${matches.slice(0, 2).map(p => `
          <div class="p-3 bg-surface-card border border-border-card flex flex-col justify-between shadow-sm">
            <div>
              <span class="text-[10px] font-bold text-primary uppercase">${p.universityName}</span>
              <h5 class="font-headline font-bold text-xs text-secondary mt-0.5">${p.title}</h5>
              <div class="text-[11px] text-muted mt-1">${p.duration} • ₹${p.totalFee.toLocaleString("en-IN")} total</div>
            </div>
            <div class="flex items-center gap-2 mt-3 pt-2 border-t border-border-subtle">
              <a href="programme.html?id=${p.id}" class="btn btn-dark btn-xs">View Details</a>
              <button type="button" class="btn btn-outline btn-xs" onclick="EduviaComparison.toggleCompare('${p.id}', 'programme')">Compare</button>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="text-right">
        <a href="programmes.html?discipline=${targetDiscipline}" class="btn btn-primary btn-sm">
          <span>Explore All Matched (${matches.length})</span>
          <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
      </div>
    `;
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    window.location.href = `programmes.html?discipline=${targetDiscipline}`;
  }
}

// Global Alias for backwards compatibility
function generateQuizRecommendations() {
  showMatchedProgrammes();
}

