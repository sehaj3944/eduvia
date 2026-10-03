/**
 * EDUVIA COMPARISON MODULE (assets/js/comparison.js)
 * Manages dual-type comparison workspace (Programmes & Universities),
 * localStorage persistence, URL state, difference detection, and dock tray.
 */

const EduviaComparison = {
  activeType: "programmes", // "programmes" | "universities"
  selectedProgrammes: [],
  selectedUniversities: [],
  maxLimit: 4,

  init() {
    this.loadState();
    this.readUrlState();
    this.updateCompareBar();
    this.renderCompareWorkspace();
  },

  loadState() {
    try {
      const savedProgs = localStorage.getItem("eduvia_compare_programmes");
      if (savedProgs) {
        const parsed = JSON.parse(savedProgs);
        this.selectedProgrammes = Array.isArray(parsed) ? parsed : [];
      } else {
        this.selectedProgrammes = [];
      }

      const savedUnivs = localStorage.getItem("eduvia_compare_universities");
      if (savedUnivs) {
        const parsed = JSON.parse(savedUnivs);
        this.selectedUniversities = Array.isArray(parsed) ? parsed : [];
      } else {
        this.selectedUniversities = [];
      }
    } catch (e) {
      this.selectedProgrammes = [];
      this.selectedUniversities = [];
    }
  },

  saveState() {
    try {
      localStorage.setItem("eduvia_compare_programmes", JSON.stringify(this.selectedProgrammes));
      localStorage.setItem("eduvia_compare_universities", JSON.stringify(this.selectedUniversities));
    } catch (e) {
      console.warn("Storage sync error:", e);
    }
  },

  readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get("type") || params.get("tab");
    if (typeParam === "universities" || typeParam === "university") {
      this.activeType = "universities";
    } else if (typeParam === "programmes" || typeParam === "programme") {
      this.activeType = "programmes";
    }

    const itemsParam = params.get("items") || params.get("ids");
    if (itemsParam) {
      const items = itemsParam.split(",").map(s => s.trim()).filter(Boolean);
      if (items.length > 0) {
        if (this.activeType === "programmes") {
          this.selectedProgrammes = items.slice(0, this.maxLimit);
        } else {
          this.selectedUniversities = items.slice(0, this.maxLimit);
        }
        this.saveState();
      }
    }
  },

  syncUrlState() {
    if (!window.location.pathname.includes("compare.html")) return;
    const items = this.activeType === "programmes" ? this.selectedProgrammes : this.selectedUniversities;
    const url = new URL(window.location);
    url.searchParams.set("type", this.activeType);
    if (items.length > 0) {
      url.searchParams.set("items", items.join(","));
    } else {
      url.searchParams.delete("items");
    }
    window.history.replaceState({}, "", url);
  },

  switchType(type) {
    this.activeType = type;
    this.syncUrlState();
    this.updateCompareBar();
    this.renderCompareWorkspace();
  },

  toggleCompare(id) {
    // Check if ID is a programme or university
    const isProg = (typeof EduviaData !== "undefined" && EduviaData.getProgrammeById && EduviaData.getProgrammeById(id)) || id.startsWith("prog-");
    
    if (isProg) {
      this.toggleProgramme(id);
    } else {
      this.toggleUniversity(id);
    }
  },

  toggleProgramme(progId) {
    const idx = this.selectedProgrammes.indexOf(progId);
    if (idx > -1) {
      this.selectedProgrammes.splice(idx, 1);
      EduviaUI.showToast(`Removed programme from comparison matrix`);
    } else {
      if (this.selectedProgrammes.length >= this.maxLimit) {
        EduviaUI.showToast(`Comparison limit reached: Max ${this.maxLimit} programmes simultaneously.`);
        return;
      }
      this.selectedProgrammes.push(progId);
      EduviaUI.showToast(`Added programme to comparison matrix!`);
    }

    this.saveState();
    this.syncUrlState();
    this.notifyExternalModules(progId);
    this.updateCompareBar();
    this.renderCompareWorkspace();
  },

  toggleUniversity(univId) {
    const idx = this.selectedUniversities.indexOf(univId);
    if (idx > -1) {
      this.selectedUniversities.splice(idx, 1);
      EduviaUI.showToast(`Removed university from comparison matrix`);
    } else {
      if (this.selectedUniversities.length >= this.maxLimit) {
        EduviaUI.showToast(`Comparison limit reached: Max ${this.maxLimit} universities simultaneously.`);
        return;
      }
      this.selectedUniversities.push(univId);
      EduviaUI.showToast(`Added university to comparison matrix!`);
    }

    this.saveState();
    this.syncUrlState();
    this.notifyExternalModules(univId);
    this.updateCompareBar();
    this.renderCompareWorkspace();
  },

  notifyExternalModules(id) {
    if (typeof EduviaFilters !== "undefined" && typeof EduviaFilters.applyFilters === "function") {
      EduviaFilters.applyFilters(false);
    }
    if (typeof EduviaUniversityFilters !== "undefined" && typeof EduviaUniversityFilters.applyFilters === "function") {
      EduviaUniversityFilters.applyFilters(false);
    }
    if (typeof EduviaUniversityDetail !== "undefined" && typeof EduviaUniversityDetail.updateCompareButtonState === "function") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("id")) EduviaUniversityDetail.updateCompareButtonState(p.get("id"));
    }
    if (typeof EduviaProgrammeDetail !== "undefined" && typeof EduviaProgrammeDetail.updateCompareButtonState === "function") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("id")) EduviaProgrammeDetail.updateCompareButtonState(p.get("id"));
    }
    if (typeof EduviaNavigation !== "undefined" && EduviaNavigation.updateCompareCounter) {
      EduviaNavigation.updateCompareCounter();
    }
    if (typeof EduviaDiscover !== "undefined" && typeof EduviaDiscover.renderLiveResults === "function") {
      EduviaDiscover.renderLiveResults();
    }
  },

  clearAll() {
    if (this.activeType === "programmes") {
      this.selectedProgrammes = [];
    } else {
      this.selectedUniversities = [];
    }
    this.saveState();
    this.syncUrlState();
    this.notifyExternalModules();
    this.updateCompareBar();
    this.renderCompareWorkspace();
    EduviaUI.showToast(`Comparison list cleared`);
  },

  updateCompareBar() {
    const bar = document.getElementById("floating-compare-bar");
    const countSpan = document.getElementById("compare-count-badge");
    const topbarCompareCount = document.getElementById("topbar-compare-count");
    const navCompareCount = document.getElementById("nav-compare-active-count");
    const chipsList = document.getElementById("compare-chips-container");
    
    const items = this.activeType === "programmes" ? this.selectedProgrammes : this.selectedUniversities;
    const count = items.length;

    if (countSpan) countSpan.textContent = count;
    if (topbarCompareCount) topbarCompareCount.textContent = count;
    if (navCompareCount) navCompareCount.textContent = count;

    if (count >= 2 && bar) {
      bar.classList.add("visible");
      document.body.classList.add("has-compare-bar");
      if (chipsList) {
        chipsList.innerHTML = items.map(id => {
          if (this.activeType === "programmes") {
            const p = EduviaData.getProgrammeById(id);
            return p ? `
              <div class="compare-chip">
                <span>${p.title.replace('Online ', '').replace('Master of Business Administration (MBA)', 'MBA').replace('Master of Computer Applications (MCA)', 'MCA')}</span>
                <button class="compare-chip-remove" onclick="EduviaComparison.toggleCompare('${p.id}')" title="Remove">✕</button>
              </div>
            ` : "";
          } else {
            const u = EduviaData.getUniversityById(id);
            return u ? `
              <div class="compare-chip">
                <span>${u.shortName}</span>
                <button class="compare-chip-remove" onclick="EduviaComparison.toggleCompare('${u.id}')" title="Remove">✕</button>
              </div>
            ` : "";
          }
        }).join("");
      }
    } else {
      if (bar) bar.classList.remove("visible");
      document.body.classList.remove("has-compare-bar");
    }
  },

  renderCompareWorkspace() {
    const container = document.getElementById("compare-workspace-container");
    if (!container) return;

    const isProg = this.activeType === "programmes";
    const selectedIds = isProg ? this.selectedProgrammes : this.selectedUniversities;
    const selectedObjects = selectedIds.map(id => {
      return isProg ? EduviaData.getProgrammeById(id) : EduviaData.getUniversityById(id);
    }).filter(Boolean);

    // 1. Header & Switcher Markup
    let html = `
      <section class="compare-workspace-header" aria-label="Comparison Controls">
        <div class="compare-workspace-top">
          <div>
            <span class="label-caps text-primary block mb-1">Decision Intelligence</span>
            <h1 class="compare-workspace-title">COMPARE YOUR OPTIONS</h1>
            <p class="compare-workspace-sub">
              Put programmes or universities side-by-side and see the differences that matter across tuition, accreditations, and duration.
            </p>
          </div>
          <div class="compare-type-switcher" role="tablist" aria-label="Comparison Type">
            <button class="compare-switch-btn ${isProg ? 'active' : ''}" 
                    role="tab" 
                    aria-selected="${isProg ? 'true' : 'false'}"
                    onclick="EduviaComparison.switchType('programmes')">
              <span class="material-symbols-outlined text-[16px]">school</span>
              <span>Programmes (${this.selectedProgrammes.length})</span>
            </button>
            <button class="compare-switch-btn ${!isProg ? 'active' : ''}" 
                    role="tab" 
                    aria-selected="${!isProg ? 'true' : 'false'}"
                    onclick="EduviaComparison.switchType('universities')">
              <span class="material-symbols-outlined text-[16px]">account_balance</span>
              <span>Universities (${this.selectedUniversities.length})</span>
            </button>
          </div>
        </div>
      </section>
    `;

    // 2. Selected Options Strip (4 Slots)
    html += `
      <section class="compare-slots-strip" aria-label="Selected Options for Comparison">
        ${selectedObjects.map(obj => `
          <div class="compare-slot-card">
            <div class="compare-slot-top">
              <div class="compare-slot-logo">
                ${isProg 
                  ? (obj.discipline ? obj.discipline.substring(0,3).toUpperCase() : 'DEG') 
                  : (obj.logoUrl 
                      ? `<img src="${obj.logoUrl}" alt="${obj.name} logo" class="w-full h-full object-contain p-1 bg-white" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" /><span style="display:none;">${obj.logoText || obj.shortName.substring(0,4)}</span>` 
                      : (obj.logoText || obj.shortName.substring(0,4))
                    )}
              </div>
              <button class="compare-slot-remove-btn" onclick="EduviaComparison.toggleCompare('${obj.id}')" title="Remove from comparison" aria-label="Remove ${isProg ? obj.title : obj.name}">✕</button>
            </div>
            <div>
              <span class="badge badge-teal mb-1">${isProg ? (obj.degreeLevel || 'PG').toUpperCase() : obj.badge}</span>
              <h3 class="compare-slot-title">${isProg ? obj.title : obj.name}</h3>
              <p class="compare-slot-sub">${isProg ? obj.universityName : obj.location}</p>
            </div>
          </div>
        `).join("")}

        ${selectedObjects.length < this.maxLimit ? `
          <div class="compare-slot-empty-add" onclick="EduviaComparison.openAddModal()" role="button" tabindex="0" aria-label="Add ${isProg ? 'Programme' : 'University'}">
            <span class="material-symbols-outlined compare-slot-add-icon">add_circle</span>
            <span class="compare-slot-add-text">+ Add ${isProg ? 'Programme' : 'University'}</span>
            <span class="text-xs text-text-muted">Slot ${selectedObjects.length + 1} of ${this.maxLimit}</span>
          </div>
        ` : ''}
      </section>
    `;

    // 3. Matrix & Difference Rendering
    if (selectedObjects.length === 0) {
      html += `
        <div class="compare-empty-dossier">
          <span class="material-symbols-outlined compare-empty-icon">${isProg ? 'school' : 'account_balance'}</span>
          <h2 class="compare-empty-title">NO ${isProg ? 'PROGRAMMES' : 'UNIVERSITIES'} SELECTED</h2>
          <p class="compare-empty-desc">
            Select at least 2 ${isProg ? 'degree programmes' : 'accredited universities'} to generate an architectural side-by-side comparison matrix.
          </p>
          <div class="compare-empty-actions">
            <button class="btn btn-primary" onclick="EduviaComparison.openAddModal()">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>+ Add ${isProg ? 'Programme' : 'University'}</span>
            </button>
            <a href="${isProg ? 'programmes.html' : 'universities.html'}" class="btn btn-outline">
              <span>Browse All ${isProg ? 'Programmes' : 'Universities'}</span>
            </a>
          </div>
        </div>
      `;
    } else if (selectedObjects.length === 1) {
      html += `
        <div class="compare-empty-dossier">
          <span class="material-symbols-outlined compare-empty-icon">compare_arrows</span>
          <h2 class="compare-empty-title">ADD AT LEAST ONE MORE OPTION</h2>
          <p class="compare-empty-desc">
            You currently have <strong>${isProg ? selectedObjects[0].title : selectedObjects[0].name}</strong> selected. Add another option to evaluate differences across tuition fees, duration, eligibility, and accreditations.
          </p>
          <div class="compare-empty-actions">
            <button class="btn btn-primary" onclick="EduviaComparison.openAddModal()">
              <span class="material-symbols-outlined text-[18px]">add</span>
              <span>+ Add Second ${isProg ? 'Programme' : 'University'}</span>
            </button>
            <a href="${isProg ? 'programmes.html' : 'universities.html'}" class="btn btn-outline">
              <span>Browse Directory</span>
            </a>
          </div>
        </div>
      `;
    } else {
      // Render full Matrix
      if (isProg) {
        html += this.renderProgrammesMatrix(selectedObjects);
      } else {
        html += this.renderUniversitiesMatrix(selectedObjects);
      }

      // Render Key Differences
      html += this.renderKeyDifferences(isProg, selectedObjects);

      // Render Shortlist / Next Steps
      html += this.renderNextSteps(isProg, selectedObjects);
    }

    container.innerHTML = html;
  },

  renderProgrammesMatrix(programmes) {
    const groups = [
      {
        name: "Programme Basics",
        rows: [
          { label: "Awarding University", extract: p => `<a href="university.html?id=${p.universityId}" class="font-bold text-sapphire hover:underline">${p.universityName}</a>` },
          { label: "Degree Level", extract: p => `<span class="badge badge-teal">${(p.degreeLevel || 'PG').toUpperCase()}</span>` },
          { label: "Academic Discipline", extract: p => `<span class="badge badge-neutral">${p.discipline ? p.discipline.toUpperCase() : 'GENERAL'}</span>` },
          { label: "Duration", extract: p => `<strong>${p.duration}</strong>` },
          { label: "Study Delivery Mode", extract: p => p.studyMode }
        ]
      },
      {
        name: "Financials & Tuition",
        rows: [
          {
            label: "Total Course Tuition",
            extract: p => {
              if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
                const conv = EduviaI18n.convertPrice(p.totalFee, p.originalCurrency || "INR");
                return `<strong class="text-primary font-headline text-base">${conv.formatted}</strong> ${conv.isConverted ? `<span class="text-xs text-muted block">(Orig: ₹${p.totalFee.toLocaleString('en-IN')})</span>` : ''}`;
              }
              return `<strong class="text-primary font-headline text-base">₹${p.totalFee.toLocaleString('en-IN')}</strong>`;
            }
          },
          {
            label: "Estimated Semester Fee",
            extract: p => {
              const semBase = Math.round(p.totalFee / ((p.durationYears || 2) * 2));
              if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
                const conv = EduviaI18n.convertPrice(semBase, p.originalCurrency || "INR");
                return `<span>${conv.formatted}</span>`;
              }
              return `₹${semBase.toLocaleString('en-IN')}`;
            }
          },
          {
            label: "0% Monthly EMI",
            extract: p => {
              const emiBase = p.emiMonthly || Math.round(p.totalFee / 24);
              if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
                const conv = EduviaI18n.convertPrice(emiBase, p.originalCurrency || "INR");
                return `<strong class="text-secondary">${conv.formatted}/mo</strong>`;
              }
              return `<strong class="text-secondary">₹${emiBase.toLocaleString('en-IN')}/mo</strong>`;
            }
          }
        ]
      },
      {
        name: "Eligibility & Admissions",
        rows: [
          { label: "Academic Qualification", extract: p => p.eligibility || "Graduation with minimum 50% marks" },
          { label: "Admission Mechanism", extract: () => "Online application & digital document scrutiny" },
          { label: "Degree Equivalence", extract: () => "<span class='badge badge-blue'>UGC Entitled</span> Equivalent to Regular" }
        ]
      },
      {
        name: "Academics & Specialisations",
        rows: [
          { label: "Available Elective Tracks", extract: p => p.specialisation ? p.specialisation : "General Core Management" },
          { label: "Curriculum Modules", extract: p => p.syllabus ? `${p.syllabus.length} Semesters (${p.syllabus.reduce((acc, s) => acc + s.topics.length, 0)} Courses)` : "Curriculum on record" },
          { label: "Core Highlights", extract: p => p.highlights ? p.highlights.join(" • ") : "Cloud LMS & interactive clinics" }
        ]
      },
      {
        name: "Accreditation & Quality",
        rows: [
          { label: "Statutory Recognition", extract: p => p.accreditations ? p.accreditations.map(a => `<span class="badge badge-teal">${a}</span>`).join(" ") : (p.accreditation || 'UGC-DEB') },
          { label: "Examination Protocol", extract: () => "AI & Webcam Proctored Online Exams" }
        ]
      }
    ];

    return `
      <section class="compare-matrix-container" aria-label="Programme Comparison Matrix">
        <div class="mobile-table-swipe-hint">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">swipe_left</span>
            <span>Swipe left / right to compare options</span>
          </div>
          <span class="swipe-hint-pill">${programmes.length} Programmes ➔</span>
        </div>
        <div class="compare-matrix-scroll-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="compare-col-header-factor" scope="col">Comparison Factor</th>
                ${programmes.map(p => `
                  <th class="compare-col-header-item" scope="col">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="badge badge-teal">${(p.degreeLevel || 'PG').toUpperCase()}</span>
                      <button class="compare-chip-remove" onclick="EduviaComparison.toggleCompare('${p.id}')" title="Remove">✕</button>
                    </div>
                    <h4 class="font-headline font-bold text-sm text-secondary mb-0.5">${p.title}</h4>
                    <p class="text-xs text-text-muted">${p.universityName}</p>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              ${groups.map(g => `
                <tr class="compare-group-row">
                  <td colspan="${programmes.length + 1}" class="compare-table-group-header">${g.name}</td>
                </tr>
                ${g.rows.map(row => {
                  const values = programmes.map(p => row.extract(p));
                  const isDiff = new Set(values).size > 1;
                  return `
                    <tr class="compare-row">
                      <td class="compare-cell-factor">${row.label}</td>
                      ${values.map(val => `
                        <td class="compare-cell-val ${isDiff ? 'is-different' : ''}">${val}</td>
                      `).join("")}
                    </tr>
                  `;
                }).join("")}
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  renderUniversitiesMatrix(universities) {
    const groups = [
      {
        name: "Institutional Basics",
        rows: [
          { label: "Institution Type", extract: u => `<span class="badge badge-neutral">${u.type}</span>` },
          { label: "Campus Location", extract: u => u.location },
          { label: "Establishment Year", extract: u => `Est. ${u.established || 'N/A'}` },
          { label: "Catalogued Degrees", extract: u => `${u.programmesCount}+ Online Degrees` }
        ]
      },
      {
        name: "Financial Transparency",
        rows: [
          { label: "Total Tuition Range", extract: u => `<strong class="text-primary font-headline">${u.feeRange}</strong>` },
          { label: "Monthly EMI Starts", extract: u => `<strong class="text-secondary">${u.emiStarts}</strong>` },
          { label: "Financing Terms", extract: () => "0% Interest No-Cost EMI Available" }
        ]
      },
      {
        name: "Accreditations & Government Standing",
        rows: [
          { label: "NAAC Institutional Grade", extract: u => `<span class="badge badge-teal">${u.badge}</span>` },
          { label: "NIRF Ranking Tier", extract: u => u.nirfRank ? `<span class="badge badge-blue">${u.nirfRank}</span>` : "Accredited" },
          { label: "Statutory Approvals", extract: u => u.approvals.map(a => `<span class="badge badge-teal">${a}</span>`).join(" ") }
        ]
      },
      {
        name: "Pedagogy & Digital Learning",
        rows: [
          { label: "Examination Format", extract: u => u.examMode || "Proctored Online Exam" },
          { label: "Live Masterclasses", extract: u => u.liveSessions || "Weekend Mentorship Clinics" },
          { label: "LMS & Learning Tech", extract: u => u.lmsFeatures || "Cloud LMS & Mobile Access" }
        ]
      },
      {
        name: "Recruitment Network",
        rows: [
          { label: "Top Hiring Partners", extract: u => u.topRecruiters ? u.topRecruiters.join(", ") : "Corporate recruitment partners" }
        ]
      }
    ];

    return `
      <section class="compare-matrix-container" aria-label="University Comparison Matrix">
        <div class="mobile-table-swipe-hint">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[15px]">swipe_left</span>
            <span>Swipe left / right to compare options</span>
          </div>
          <span class="swipe-hint-pill">${universities.length} Universities ➔</span>
        </div>
        <div class="compare-matrix-scroll-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="compare-col-header-factor" scope="col">Comparison Factor</th>
                ${universities.map(u => `
                  <th class="compare-col-header-item" scope="col">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="badge badge-teal">${u.badge}</span>
                      <button class="compare-chip-remove" onclick="EduviaComparison.toggleCompare('${u.id}')" title="Remove">✕</button>
                    </div>
                    <div class="flex items-center gap-2 mb-1">
                      ${u.logoUrl ? `<img src="${u.logoUrl}" alt="${u.name} official institutional logo" width="24" height="24" loading="lazy" class="w-6 h-6 object-contain bg-white rounded p-0.5" onerror="this.style.display='none';" />` : ''}
                      <h4 class="font-headline font-bold text-sm text-secondary mb-0.5">${u.name}</h4>
                    </div>
                    <p class="text-xs text-text-muted">${u.location}</p>
                  </th>
                `).join("")}
              </tr>
            </thead>
            <tbody>
              ${groups.map(g => `
                <tr class="compare-group-row">
                  <td colspan="${universities.length + 1}" class="compare-table-group-header">${g.name}</td>
                </tr>
                ${g.rows.map(row => {
                  const values = universities.map(u => row.extract(u));
                  const isDiff = new Set(values).size > 1;
                  return `
                    <tr class="compare-row">
                      <td class="compare-cell-factor">${row.label}</td>
                      ${values.map(val => `
                        <td class="compare-cell-val ${isDiff ? 'is-different' : ''}">${val}</td>
                      `).join("")}
                    </tr>
                  `;
                }).join("")}
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  },

  renderKeyDifferences(isProg, items) {
    const diffs = [];

    if (isProg) {
      // Check fees
      const fees = items.map(p => `₹${p.totalFee.toLocaleString('en-IN')}`);
      if (new Set(fees).size > 1) {
        diffs.push({ factor: "Total Tuition Fee", statement: `${items.map(p => `${p.universityName.split(' ')[0]}: ₹${p.totalFee.toLocaleString('en-IN')}`).join(" vs ")}` });
      }

      // Check duration
      const durations = items.map(p => p.duration);
      if (new Set(durations).size > 1) {
        diffs.push({ factor: "Duration", statement: `${items.map(p => `${p.title.split(' ')[0]}: ${p.duration}`).join(" vs ")}` });
      }

      // Check study mode
      const modes = items.map(p => p.studyMode);
      if (new Set(modes).size > 1) {
        diffs.push({ factor: "Study Delivery", statement: `${items.map(p => `${p.universityName.split(' ')[0]}: ${p.studyMode}`).join(" vs ")}` });
      }

      // Check accreditations
      const accs = items.map(p => p.accreditation || 'UGC-DEB');
      if (new Set(accs).size > 1) {
        diffs.push({ factor: "Accreditation Portfolio", statement: `${items.map(p => `${p.universityName.split(' ')[0]}: ${p.accreditation || 'UGC-DEB'}`).join(" vs ")}` });
      }
    } else {
      // University differences
      const feeRanges = items.map(u => u.feeRange);
      if (new Set(feeRanges).size > 1) {
        diffs.push({ factor: "Tuition Spectrum", statement: `${items.map(u => `${u.shortName}: ${u.feeRange}`).join(" vs ")}` });
      }

      const nirfs = items.map(u => u.nirfRank || 'N/A');
      if (new Set(nirfs).size > 1) {
        diffs.push({ factor: "NIRF Standing", statement: `${items.map(u => `${u.shortName}: ${u.nirfRank || 'Ranked'}`).join(" vs ")}` });
      }

      const naacs = items.map(u => u.badge);
      if (new Set(naacs).size > 1) {
        diffs.push({ factor: "NAAC Rating", statement: `${items.map(u => `${u.shortName}: ${u.badge}`).join(" vs ")}` });
      }

      const locs = items.map(u => u.location);
      if (new Set(locs).size > 1) {
        diffs.push({ factor: "State / Location", statement: `${items.map(u => `${u.shortName}: ${u.location.split(',')[0]}`).join(" vs ")}` });
      }
    }

    if (diffs.length === 0) return "";

    return `
      <section class="compare-diffs-section" aria-labelledby="heading-key-diffs">
        <div class="flex items-center gap-2">
          <span class="badge badge-teal">Automatic Intelligence</span>
          <h2 id="heading-key-diffs" class="font-headline font-bold text-base text-secondary uppercase">KEY FACTUAL DIFFERENCES</h2>
        </div>
        <p class="text-xs text-text-secondary mt-1">
          Algorithmic summary of parameter variations across selected ${isProg ? 'programmes' : 'universities'}.
        </p>

        <div class="compare-diffs-grid">
          ${diffs.map(d => `
            <div class="compare-diff-card">
              <span class="compare-diff-factor">${d.factor}</span>
              <span class="compare-diff-statement">${d.statement}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },

  renderNextSteps(isProg, items) {
    return `
      <section class="compare-next-steps-section" aria-labelledby="heading-shortlist-steps">
        <span class="label-caps text-primary block mb-1">Decision Pathways</span>
        <h2 id="heading-shortlist-steps" class="font-headline font-bold text-base text-secondary uppercase">READY TO SHORTLIST?</h2>
        <p class="text-xs text-text-secondary mt-1">
          Deep-dive into complete curriculum syllabi or consult an academic counselor for verified admission details.
        </p>

        <div class="compare-next-steps-grid">
          ${items.map(obj => `
            <div class="compare-step-card">
              <div>
                <span class="badge badge-teal mb-1">${isProg ? (obj.degreeLevel || 'PG').toUpperCase() : obj.badge}</span>
                <h3 class="font-headline font-bold text-sm text-secondary">${isProg ? obj.title : obj.name}</h3>
                <p class="text-xs text-text-secondary mt-0.5">${isProg ? obj.universityName : obj.location}</p>
              </div>
              <div class="flex flex-col gap-2 pt-3 border-t border-border-card">
                <a href="${isProg ? `programme.html?id=${obj.id}` : `university.html?id=${obj.id}`}" class="btn btn-primary btn-sm text-center">
                  <span>View Full Dossier →</span>
                </a>
                <button class="btn btn-outline btn-sm text-center" onclick="EduviaUI.openCounselingModal('${isProg ? `${obj.universityName} - ${obj.title}` : obj.name}')">
                  <span>Request Fee Schedule</span>
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },

  openAddModal() {
    const isProg = this.activeType === "programmes";
    const modal = document.getElementById("compare-add-modal");
    if (!modal) return;

    const modalTitle = document.getElementById("compare-add-modal-title");
    if (modalTitle) {
      modalTitle.textContent = `Add ${isProg ? 'Programme' : 'University'} to Comparison`;
    }

    const input = document.getElementById("compare-modal-search-input");
    if (input) {
      input.value = "";
      input.placeholder = isProg ? "Search by degree name, discipline, or university..." : "Search by university name, location, or type...";
    }

    this.filterAddModalOptions("");
    modal.classList.add("open");
    if (input) input.focus();
  },

  filterAddModalOptions(query) {
    const isProg = this.activeType === "programmes";
    const listContainer = document.getElementById("compare-add-modal-options-list");
    if (!listContainer) return;

    const q = (query || "").toLowerCase().trim();
    const selected = isProg ? this.selectedProgrammes : this.selectedUniversities;

    if (isProg) {
      const allProgs = EduviaData.programmes || [];
      const filtered = allProgs.filter(p => {
        if (!q) return true;
        return p.title.toLowerCase().includes(q) || 
               p.universityName.toLowerCase().includes(q) || 
               p.discipline.toLowerCase().includes(q) ||
               (p.specialisation && p.specialisation.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="p-6 text-center text-xs text-text-muted">No programmes found matching "${query}".</div>`;
        return;
      }

      listContainer.innerHTML = filtered.map(p => {
        const isAdded = selected.includes(p.id);
        return `
          <div class="compare-option-row">
            <div>
              <span class="badge badge-teal mb-0.5">${(p.degreeLevel || 'PG').toUpperCase()}</span>
              <h4 class="font-headline font-bold text-xs text-secondary">${p.title}</h4>
              <p class="text-xs text-text-muted">${p.universityName} • ₹${p.totalFee.toLocaleString('en-IN')}</p>
            </div>
            <div>
              ${isAdded ? `
                <button class="btn btn-dark btn-sm text-xs py-1 px-3" disabled>
                  <span>✓ Added</span>
                </button>
              ` : `
                <button class="btn btn-primary btn-sm text-xs py-1 px-3" onclick="EduviaComparison.toggleCompare('${p.id}'); EduviaUI.closeAllModals();">
                  <span>+ Add</span>
                </button>
              `}
            </div>
          </div>
        `;
      }).join("");
    } else {
      const allUnivs = EduviaData.universities || [];
      const filtered = allUnivs.filter(u => {
        if (!q) return true;
        return u.name.toLowerCase().includes(q) || 
               u.location.toLowerCase().includes(q) || 
               u.type.toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="p-6 text-center text-xs text-text-muted">No universities found matching "${query}".</div>`;
        return;
      }

      listContainer.innerHTML = filtered.map(u => {
        const isAdded = selected.includes(u.id);
        return `
          <div class="compare-option-row">
            <div>
              <span class="badge badge-teal mb-0.5">${u.badge}</span>
              <h4 class="font-headline font-bold text-xs text-secondary">${u.name}</h4>
              <p class="text-xs text-text-muted">${u.location} • ${u.feeRange}</p>
            </div>
            <div>
              ${isAdded ? `
                <button class="btn btn-dark btn-sm text-xs py-1 px-3" disabled>
                  <span>✓ Added</span>
                </button>
              ` : `
                <button class="btn btn-primary btn-sm text-xs py-1 px-3" onclick="EduviaComparison.toggleCompare('${u.id}'); EduviaUI.closeAllModals();">
                  <span>+ Add</span>
                </button>
              `}
            </div>
          </div>
        `;
      }).join("");
    }
  },

  openComparisonMatrixModal() {
    // If not on compare.html, navigate to compare.html with current selection
    if (!window.location.pathname.includes("compare.html")) {
      const items = (this.activeType === 'programmes' ? this.selectedProgrammes : this.selectedUniversities).join(',');
      window.location.href = `compare.html?type=${this.activeType}${items ? `&items=${items}` : ''}`;
      return;
    }
    const container = document.getElementById("compare-workspace-container");
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  }
};

