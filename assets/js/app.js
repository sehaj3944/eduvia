/**
 * EDUVIA MASTER BOOTSTRAP (assets/js/app.js)
 * Coordinates data stores, comparison engine, filters, calculator, and UI modules.
 */

const EduviaApp = {
  calculator: {
    totalFee: 160000,
    downPaymentPct: 10,
    tenureMonths: 24,
    interestRate: 0,
    debounceTimer: null
  },

  activeProgrammeDiscipline: "all",

  init() {
    // Initialize child modules in sequence
    EduviaUI.init();
    EduviaComparison.init();
    EduviaFilters.init();
    if (typeof EduviaUniversityFilters !== "undefined") {
      EduviaUniversityFilters.init();
    }
    if (typeof EduviaUniversityDetail !== "undefined") {
      EduviaUniversityDetail.init();
    }
    if (typeof EduviaProgrammeDetail !== "undefined") {
      EduviaProgrammeDetail.init();
    }
    if (typeof EduviaDiscover !== "undefined") {
      EduviaDiscover.init();
    }
    if (typeof EduviaResources !== "undefined") {
      EduviaResources.init();
    }
    EduviaSearch.init();
    EduviaNavigation.init();
    this.initHomepage();
    this.initCalculator();
  },

  initHomepage() {
    this.renderHomepageProgrammes("all", false);
    this.renderHomepageUniversities();
    this.renderCredibilityElements();
  },

  /* --------------------------------------------------------------------------
     HOMEPAGE: SKELETON LOADERS FOR SNAP-SCROLL ROWS
     -------------------------------------------------------------------------- */
  renderHomepageProgrammesSkeleton() {
    const container = document.getElementById("programmes-cards-container");
    if (!container) return;
    container.className = "snap-scroll-row skeleton-body";
    container.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="snap-card snap-skeleton-card">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="skeleton-pill skeleton-shimmer"></div>
            <div class="skeleton-badge skeleton-shimmer"></div>
          </div>
          <div class="skeleton-line-title skeleton-shimmer"></div>
          <div class="skeleton-line-subtitle skeleton-shimmer"></div>
          <div class="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-card">
            <div class="skeleton-line skeleton-shimmer" style="height: 28px;"></div>
            <div class="skeleton-line skeleton-shimmer" style="height: 28px;"></div>
          </div>
        </div>
        <div class="pt-3 border-t border-card">
          <div class="flex items-center justify-between mb-3">
            <div class="skeleton-bar-md skeleton-shimmer" style="height: 20px; width: 45%;"></div>
            <div class="skeleton-pill skeleton-shimmer" style="width: 70px;"></div>
          </div>
          <div class="skeleton-btn skeleton-shimmer"></div>
        </div>
      </div>
    `).join("");
  },

  renderHomepageUniversitiesSkeleton() {
    const container = document.getElementById("universities-cards-container");
    if (!container) return;
    container.className = "snap-scroll-row skeleton-body";
    container.innerHTML = Array.from({ length: 6 }).map(() => `
      <div class="snap-card snap-skeleton-card">
        <div>
          <div class="flex gap-2 mb-3">
            <div class="skeleton-badge skeleton-shimmer"></div>
            <div class="skeleton-badge skeleton-shimmer"></div>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <div class="skeleton-avatar skeleton-shimmer"></div>
            <div style="flex: 1;">
              <div class="skeleton-line-title skeleton-shimmer" style="width: 90%; margin-bottom: 6px;"></div>
              <div class="skeleton-line-sm skeleton-shimmer" style="width: 50%;"></div>
            </div>
          </div>
          <div class="space-y-2 mt-2">
            <div class="skeleton-line skeleton-shimmer"></div>
            <div class="skeleton-line skeleton-shimmer"></div>
          </div>
        </div>
        <div class="pt-3 border-t border-card">
          <div class="skeleton-btn skeleton-shimmer"></div>
        </div>
      </div>
    `).join("");
  },

  /* --------------------------------------------------------------------------
     HOMEPAGE: EXPLORE PROGRAMMES SNAP-SCROLL ROW & FILTER TABS
     -------------------------------------------------------------------------- */
  renderHomepageProgrammes(discipline = "all", isFade = true) {
    const container = document.getElementById("programmes-cards-container");
    if (!container) return;

    this.activeProgrammeDiscipline = discipline;

    // Smooth fade transition
    if (isFade) {
      container.style.opacity = "0.3";
      container.style.transition = "opacity 160ms ease";
    }

    setTimeout(() => {
      let progs = (typeof EduviaData !== "undefined" && EduviaData.programmes) ? EduviaData.programmes : [];

      if (discipline !== "all") {
        progs = progs.filter(p => {
          const disc = (p.discipline || "").toLowerCase();
          const target = discipline.toLowerCase();
          if (target === "business") return disc.includes("business") || p.title.toLowerCase().includes("mba") || p.title.toLowerCase().includes("bba");
          if (target === "tech") return disc.includes("tech") || p.title.toLowerCase().includes("mca") || p.title.toLowerCase().includes("bca");
          if (target === "data") return disc.includes("data") || p.title.toLowerCase().includes("data") || p.title.toLowerCase().includes("ai");
          if (target === "commerce") return disc.includes("commerce") || p.title.toLowerCase().includes("com") || p.title.toLowerCase().includes("fin");
          if (target === "healthcare") return disc.includes("health") || p.title.toLowerCase().includes("hospital") || p.title.toLowerCase().includes("mha");
          return disc === target;
        });
      }

      // Display 6 curated snap cards
      const selectedProgs = progs.slice(0, 6);

      if (selectedProgs.length === 0) {
        container.className = "";
        container.innerHTML = `
          <div class="snap-empty-state">
            <span class="material-symbols-outlined text-[36px] text-primary mb-2">search_off</span>
            <h4>No degrees found for this filter</h4>
            <p>Try switching disciplines or browse our full catalog of 350+ accredited online programmes.</p>
            <button type="button" class="btn btn-outline btn-sm" onclick="filterByDiscipline('all')">
              <span>View All Programmes</span>
            </button>
          </div>
        `;
      } else {
        container.className = "snap-scroll-row";
        const selectedForCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes) ? EduviaComparison.selectedProgrammes : [];

        container.innerHTML = selectedProgs.map(p => {
          const univ = (typeof EduviaData !== "undefined" && EduviaData.getUniversityById) ? EduviaData.getUniversityById(p.universityId) : null;
          const univName = univ ? univ.shortName : (p.university || "UGC Approved University");
          const isChecked = selectedForCompare.includes(p.id);
          
          let formattedFee = `₹${(p.totalFee || 150000).toLocaleString('en-IN')}`;
          let formattedEmi = p.emiStarts || `₹${Math.round((p.totalFee || 150000) / 24).toLocaleString('en-IN')}/mo`;
          let approxNote = '';
          if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
            const conv = EduviaI18n.convertPrice(p.totalFee || 150000, p.originalCurrency || "INR");
            formattedFee = conv.formatted;
            const emiVal = p.emiMonthly || Math.round((p.totalFee || 150000) / 24);
            const convEmi = EduviaI18n.convertPrice(emiVal, p.originalCurrency || "INR");
            formattedEmi = `${convEmi.formatted}/mo`;
            if (conv.isConverted) {
              approxNote = `<span class="text-[10px] text-muted block" title="Original: ₹${(p.totalFee || 150000).toLocaleString('en-IN')} INR">≈ Approx (${conv.currency})</span>`;
            }
          }

          return `
            <div class="snap-card snap-card-prog" id="prog-card-${p.id}">
              <div>
                <div class="prog-top-meta">
                  <span class="badge badge-teal">${p.degreeLevel ? p.degreeLevel.toUpperCase() : 'DEGREE'}</span>
                  <span class="badge badge-neutral">${p.mode || '100% Online'}</span>
                </div>
                <h3 class="prog-name">
                  <a href="programme.html?id=${p.id}" class="hover:text-primary transition-colors">${p.title}</a>
                </h3>
                <div class="prog-univ">
                  <span class="material-symbols-outlined text-[14px]">account_balance</span>
                  <span>${univName}</span>
                </div>
                
                <div class="prog-specs-strip">
                  <div class="spec-item">
                    <span class="spec-key">Duration</span>
                    <span class="spec-val">${p.duration || '2 Years'}</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-key">Approval</span>
                    <span class="spec-val">${p.accreditation || (univ ? univ.badge : 'UGC-DEB')}</span>
                  </div>
                </div>
              </div>

              <div>
                <div class="prog-footer">
                  <div>
                    <div class="fee-amount">${formattedFee}</div>
                    <span class="fee-sub">0% EMI from ${formattedEmi}</span>
                  </div>

                  <label class="card-compare-action" title="Add to side-by-side comparison matrix">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="EduviaComparison.toggleCompare('${p.id}')" />
                    <span>Compare</span>
                  </label>
                </div>

                <a href="programme.html?id=${p.id}" class="btn btn-outline btn-sm w-full mt-3 text-center">
                  <span>View Details</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>
            </div>
          `;
        }).join("");
      }

      if (isFade) {
        container.style.opacity = "1";
      }
    }, isFade ? 160 : 0);
  },

  /* --------------------------------------------------------------------------
     HOMEPAGE: EXPLORE UNIVERSITIES SNAP-SCROLL ROW
     -------------------------------------------------------------------------- */
  renderHomepageUniversities() {
    const container = document.getElementById("universities-cards-container");
    if (!container) return;

    const univs = (typeof EduviaData !== "undefined" && EduviaData.universities) ? EduviaData.universities : [];
    const selectedUnivs = univs.slice(0, 6);
    const selectedForCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedUniversities) ? EduviaComparison.selectedUniversities : [];

    container.className = "snap-scroll-row";
    container.innerHTML = selectedUnivs.map(u => {
      const isChecked = selectedForCompare.includes(u.id);
      const progsCount = (typeof EduviaData !== "undefined" && EduviaData.getProgrammesByUniversity) ? EduviaData.getProgrammesByUniversity(u.id).length : (u.programmesCount || 18);
      const feeRange = u.feeRange || `₹${(u.minFee/100000).toFixed(1)}L - ₹${(u.maxFee/100000).toFixed(1)}L`;
      const logoImgSrc = u.logoUrl || (typeof EduviaData !== "undefined" && EduviaData.getUniversityLogoUrl ? EduviaData.getUniversityLogoUrl(u.id) : `assets/images/universities/logos/${u.id}.png`);

      return `
        <div class="snap-card snap-card-univ" id="univ-card-${u.id}">
          <div>
            <div class="univ-badge-row">
              <span class="badge badge-teal">${u.badge || 'NAAC A+'}</span>
              <span class="badge badge-blue">${u.nirfRank || 'UGC-DEB'}</span>
            </div>

            <div class="univ-logo-strip">
              <div class="univ-logo-box">
                ${logoImgSrc ? `<img src="${logoImgSrc}" alt="${u.name} logo" class="univ-logo-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" loading="lazy" />` : ''}
                <div class="univ-logo-monogram" ${logoImgSrc ? 'style="display: none;"' : ''}>${u.logoText || u.shortName.slice(0, 3)}</div>
              </div>
              <div>
                <h3 class="univ-heading">
                  <a href="university.html?id=${u.id}" class="hover:text-primary transition-colors">${u.name}</a>
                </h3>
                <span class="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <span class="material-symbols-outlined text-[14px]">location_on</span>
                  ${u.location || 'India'}
                </span>
              </div>
            </div>

            <div class="univ-stats-grid">
              <div class="meta-row">
                <span class="meta-key">Programmes</span>
                <span class="meta-val">${progsCount}+ Degrees</span>
              </div>
              <div class="meta-row">
                <span class="meta-key">Fee Range</span>
                <span class="meta-val">${feeRange}</span>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between pt-3 border-t border-card">
              <span class="text-xs text-muted font-bold">100% Online LMS</span>
              <label class="card-compare-action" title="Add to university comparison tray">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="EduviaComparison.toggleCompare('${u.id}')" />
                <span>Compare</span>
              </label>
            </div>

            <a href="university.html?id=${u.id}" class="btn btn-outline btn-sm w-full mt-3 text-center">
              <span>Explore University</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </a>
          </div>
        </div>
      `;
    }).join("");
  },

  /* --------------------------------------------------------------------------
     HOMEPAGE: CREDIBILITY ELEMENTS (MARQUEE & TESTIMONIALS)
     -------------------------------------------------------------------------- */
  renderCredibilityElements() {
    const fallbackData = {
      partners: [
        { id: "lpu", name: "Lovely Professional University", badge: "NAAC A++", logo: "LPU", logoUrl: "uni/Lovely-Professional-University-Online-logo.webp" },
        { id: "cu", name: "Chandigarh University", badge: "NAAC A+", logo: "CU", logoUrl: "uni/chandigarh-online-university-logo.webp" },
        { id: "chitkara", name: "Chitkara University", badge: "NAAC A+", logo: "CHITKARA", logoUrl: "uni/online-chitkara-university-logo.webp" },
        { id: "shoolini", name: "Shoolini University", badge: "NAAC A+", logo: "SHOOLINI", logoUrl: "uni/shoolini-university-online-logo.webp" },
        { id: "dypatil", name: "Dr. D.Y. Patil Vidyapeeth", badge: "NAAC A++", logo: "DPU", logoUrl: "uni/dy-patil-vidyapeeth-university-online.webp" },
        { id: "amrita", name: "Amrita Vishwa Vidyapeetham", badge: "NAAC A++", logo: "AMRITA", logoUrl: "uni/amrita-online-ahead-logo.webp" },
        { id: "parul", name: "Parul University", badge: "NAAC A++", logo: "PARUL", logoUrl: "uni/parul-university-logo.webp" },
        { id: "deakin", name: "Deakin Business School", badge: "AACSB", logo: "DEAKIN", logoUrl: "uni/deakin-business-school-logo-with-upgrad.webp" },
        { id: "muj", name: "Manipal University Jaipur", badge: "NAAC A+", logo: "MUJ", logoUrl: "assets/images/universities/logos/muj.png" },
        { id: "amity", name: "Amity University Online", badge: "NAAC A+", logo: "AMITY", logoUrl: "assets/images/universities/logos/amity-online.png" },
        { id: "jain", name: "Jain University Online", badge: "NAAC A++", logo: "JAIN", logoUrl: "assets/images/universities/logos/jain-university.png" },
        { id: "nmims", name: "NMIMS CDOE", badge: "NAAC A+", logo: "NMIMS", logoUrl: "assets/images/universities/logos/nmims-cdoe.png" }
      ],
      testimonials: [
        {
          name: "Rohit Verma",
          role: "Product Marketing Lead",
          company: "Swiggy",
          programme: "Online MBA in Digital Marketing",
          university: "Manipal University Jaipur",
          outcome: "+52% Salary Jump & Shifted from Agency to Product Org",
          quote: "Eduvia's semester fee transparency saved me from hidden exam charges. The UGC-DEB verification gave me full confidence to invest while working.",
          photo: "assets/images/students/eduvia-persona-working-professional-01.jpg",
          verified: true
        },
        {
          name: "Ananya Sen",
          role: "Senior Cloud Engineer",
          company: "Cognizant",
          programme: "Online MCA in Cloud Architecture",
          university: "Chandigarh University",
          outcome: "Promoted to Cloud Architect with ₹14.5 LPA Package",
          quote: "Being able to compare MCA specialisations side-by-side helped me pick the AWS-aligned syllabus without leaving my job.",
          photo: "assets/images/students/eduvia-persona-recent-graduate-01.jpg",
          verified: true
        },
        {
          name: "Vikramaditya Rao",
          role: "Senior Data Analyst",
          company: "Deloitte USI",
          programme: "M.Sc Data Science & AI",
          university: "Jain University Online",
          outcome: "Transitioned from Mechanical to FinTech Data Analytics",
          quote: "The 0% EMI financing calculator accurately predicted my monthly payment down to the rupee. Zero spam calls—just pure data.",
          photo: "assets/images/students/eduvia-persona-data-analyst-01.jpg",
          verified: true
        },
        {
          name: "Pooja Hegde",
          role: "Financial Risk Consultant",
          company: "KPMG India",
          programme: "Online M.Com in International Finance",
          university: "Amity University Online",
          outcome: "ACCA Paper Exemptions & Global WES Credential Approved",
          quote: "Eduvia clearly stated the WES evaluation status for Canadian PR equivalence before I enrolled. Invaluable clearinghouse!",
          photo: "assets/images/hero/eduvia-hero-student-01.jpg",
          verified: true
        },
        {
          name: "Siddharth Menon",
          role: "Senior FinTech Product Manager",
          company: "Razorpay",
          programme: "Online MBA in Financial Technology",
          university: "Dr. D.Y. Patil Vidyapeeth (DPU Online)",
          outcome: "Led Payment Gateway Migration with 65% Compensation Hike",
          quote: "Comparing NAAC A++ accreditation scores and curriculum structures in minutes saved me weeks of manual research. Zero misleading sales pitches.",
          photo: "assets/images/students/eduvia-persona-siddharth-menon.jpg",
          verified: true
        },
        {
          name: "Meera Krishnan",
          role: "Lead UX Researcher & Designer",
          company: "Zomato",
          programme: "Online M.Des in Interaction Design",
          university: "Lovely Professional University (LPU Online)",
          outcome: "Promoted to Design Track Lead & Published 2 Design Patents",
          quote: "The UGC-DEB statutory validation and credit equivalence table gave me complete clarity to upskill alongside a demanding sprint schedule.",
          photo: "assets/images/students/eduvia-persona-meera-krishnan.jpg",
          verified: true
        }
      ]
    };

    const renderData = (data) => {
      // 1. Populate partners marquee
      const marqueeTrack = document.getElementById("hero-partners-marquee-track");
      if (marqueeTrack && data.partners) {
        const partnersHtml = data.partners.map(p => `
          <a href="universities.html" class="marquee-partner-item" title="${p.name}">
            <span class="marquee-logo-badge">
              ${p.logoUrl ? `<img src="${p.logoUrl}" alt="${p.name} logo" class="marquee-partner-logo-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';" />` : ''}
              <span class="marquee-logo-text" ${p.logoUrl ? 'style="display: none;"' : ''}>${p.logo || p.name.slice(0, 3)}</span>
            </span>
            <span>${p.name}</span>
            <span class="badge badge-teal">${p.badge}</span>
          </a>
        `).join("");
        // Duplicate for seamless infinite continuous ticker across all screen widths
        marqueeTrack.innerHTML = partnersHtml + partnersHtml + partnersHtml + partnersHtml;
      }

      // 2. Populate testimonials marquee ticker
      const testContainer = document.getElementById("testimonials-cards-container");
      if (testContainer && data.testimonials) {
        const testimonialsHtml = data.testimonials.map(t => `
          <div class="testimonial-editorial-card">
            <div>
              <div class="testimonial-header-row">
                <span class="testimonial-verified-badge">
                  <span class="material-symbols-outlined">verified</span>
                  <span>Verified Learner</span>
                </span>
                <span class="text-xs text-muted font-bold">${t.company || 'Alumni'}</span>
              </div>

              <div class="testimonial-outcome-pill">
                <span class="material-symbols-outlined">trending_up</span>
                <span>${t.outcome}</span>
              </div>

              <p class="testimonial-quote-text">"${t.quote}"</p>
            </div>

            <div class="testimonial-author-block">
              <img src="${t.photo}" alt="${t.name} — Student of ${t.programme} at ${t.university}" class="testimonial-avatar" width="48" height="48" loading="lazy" onerror="this.onerror=null;this.src='assets/images/students/eduvia-persona-working-professional-01.jpg';" />
              <div>
                <h4 class="testimonial-author-name">${t.name}</h4>
                <div class="testimonial-author-meta">
                  <span>${t.programme}</span> • <span class="testimonial-univ-tag">${t.university}</span>
                </div>
              </div>
            </div>
          </div>
        `).join("");
        // Duplicate cards for seamless 100% infinite continuous ticker rotation
        testContainer.innerHTML = testimonialsHtml + testimonialsHtml + testimonialsHtml + testimonialsHtml;
      }
    };

    // Render directly from in-memory EduviaData (pure JS, 0 fetch / network requests)
    const activeData = (window.EduviaData && window.EduviaData.credibility) ? window.EduviaData.credibility : fallbackData;
    renderData(activeData);
  },

  scrollTestimonials(direction) {
    const container = document.getElementById("testimonials-cards-container");
    if (!container) return;
    const card = container.firstElementChild;
    const step = card ? (card.offsetWidth + 20) : 340;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (direction > 0 && container.scrollLeft >= maxScroll - 15) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && container.scrollLeft <= 15) {
      container.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      container.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  },

  scrollRow(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const card = container.firstElementChild;
    const step = card ? (card.offsetWidth + 24) : 360;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (direction > 0 && container.scrollLeft >= maxScroll - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && container.scrollLeft <= 10) {
      container.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      container.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  },

  /* --------------------------------------------------------------------------
     HOMEPAGE: ENHANCED TUITION EMI & FINANCING CALCULATOR
     -------------------------------------------------------------------------- */
  initCalculator() {
    const feeSlider = document.getElementById("calc-fee-slider");
    const downSlider = document.getElementById("calc-down-slider");
    const tenureSlider = document.getElementById("calc-tenure-slider");
    const noCostToggle = document.getElementById("calc-nocost-toggle");

    const debouncedUpdate = () => {
      clearTimeout(this.calculator.debounceTimer);
      this.calculator.debounceTimer = setTimeout(() => this.updateCalculator(), 35);
    };

    if (feeSlider) feeSlider.addEventListener("input", debouncedUpdate);
    if (downSlider) downSlider.addEventListener("input", debouncedUpdate);
    if (tenureSlider) tenureSlider.addEventListener("input", debouncedUpdate);
    if (noCostToggle) noCostToggle.addEventListener("change", () => this.updateCalculator());

    this.updateCalculator(true);
  },

  updateCalculator(isInitial = false) {
    const feeSlider = document.getElementById("calc-fee-slider");
    const downSlider = document.getElementById("calc-down-slider");
    const tenureSlider = document.getElementById("calc-tenure-slider");
    const noCostToggle = document.getElementById("calc-nocost-toggle");

    if (!feeSlider || !downSlider || !tenureSlider) return;

    const totalFee = parseInt(feeSlider.value) || 120000;
    const downPct = parseInt(downSlider.value) || 0;
    const tenureMonths = parseInt(tenureSlider.value) || 24;
    const isNoCost = noCostToggle ? noCostToggle.checked : true;

    const downPayment = Math.round(totalFee * (downPct / 100));
    const financedAmount = totalFee - downPayment;
    
    let monthlyEmi = 0;
    let totalInterest = 0;

    if (isNoCost) {
      monthlyEmi = Math.round(financedAmount / tenureMonths);
      totalInterest = 0;
    } else {
      const r = 0.095 / 12; // 9.5% standard annual rate
      monthlyEmi = Math.round((financedAmount * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1));
      totalInterest = Math.round((monthlyEmi * tenureMonths) - financedAmount);
    }

    const totalPayable = downPayment + financedAmount + totalInterest;

    // 1. Update Slider Track Gradient Fills (accent up to thumb, clean light track after)
    const feeMin = parseInt(feeSlider.min) || 50000;
    const feeMax = parseInt(feeSlider.max) || 350000;
    const feePct = ((totalFee - feeMin) / (feeMax - feeMin)) * 100;
    feeSlider.style.background = `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${feePct}%, rgba(26, 22, 19, 0.12) ${feePct}%, rgba(26, 22, 19, 0.12) 100%)`;
    feeSlider.setAttribute("aria-valuenow", totalFee);
    feeSlider.setAttribute("aria-valuetext", `₹${totalFee.toLocaleString('en-IN')}`);

    const downMin = parseInt(downSlider.min) || 0;
    const downMax = parseInt(downSlider.max) || 50;
    const downSliderPct = ((downPct - downMin) / (downMax - downMin)) * 100;
    downSlider.style.background = `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${downSliderPct}%, rgba(26, 22, 19, 0.12) ${downSliderPct}%, rgba(26, 22, 19, 0.12) 100%)`;
    downSlider.setAttribute("aria-valuenow", downPct);
    downSlider.setAttribute("aria-valuetext", `${downPct}% initial down payment (₹${downPayment.toLocaleString('en-IN')})`);

    const tenureMin = parseInt(tenureSlider.min) || 6;
    const tenureMax = parseInt(tenureSlider.max) || 36;
    const tenureSliderPct = ((tenureMonths - tenureMin) / (tenureMax - tenureMin)) * 100;
    tenureSlider.style.background = `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${tenureSliderPct}%, rgba(26, 22, 19, 0.12) ${tenureSliderPct}%, rgba(26, 22, 19, 0.12) 100%)`;
    tenureSlider.setAttribute("aria-valuenow", tenureMonths);
    const tenureYears = (tenureMonths / 12).toFixed(tenureMonths % 12 === 0 ? 0 : 1);
    tenureSlider.setAttribute("aria-valuetext", `${tenureMonths} Months (${tenureYears} Year${tenureYears === '1' ? '' : 's'})`);

    // 2. Update Live Labels with Indian Numbering System
    const feeLabel = document.getElementById("calc-fee-label");
    const downLabel = document.getElementById("calc-down-label");
    const tenureLabel = document.getElementById("calc-tenure-label");
    const emiDisplay = document.getElementById("calc-emi-display");
    const totalDisplay = document.getElementById("calc-total-display");
    const interestDisplay = document.getElementById("calc-interest-display");
    const financedDisplay = document.getElementById("calc-financed-display");
    const downAmountDisplay = document.getElementById("calc-downamount-display");

    let feeFormatted = `₹${totalFee.toLocaleString('en-IN')}`;
    let downFormatted = `₹${downPayment.toLocaleString('en-IN')}`;
    let financedFormatted = `₹${financedAmount.toLocaleString('en-IN')}`;
    let emiFormatted = `₹${monthlyEmi.toLocaleString('en-IN')}/mo`;
    let totalFormatted = `₹${totalPayable.toLocaleString('en-IN')}`;
    let interestFormatted = isNoCost ? `₹0 at 0% EMI (No-Cost)` : `₹${totalInterest.toLocaleString('en-IN')} (9.5% p.a.)`;

    if (typeof EduviaI18n !== "undefined" && typeof EduviaI18n.convertPrice === "function") {
      const convFee = EduviaI18n.convertPrice(totalFee, "INR");
      const convDown = EduviaI18n.convertPrice(downPayment, "INR");
      const convFin = EduviaI18n.convertPrice(financedAmount, "INR");
      const convEmi = EduviaI18n.convertPrice(monthlyEmi, "INR");
      const convTotal = EduviaI18n.convertPrice(totalPayable, "INR");
      const convInt = EduviaI18n.convertPrice(totalInterest, "INR");

      feeFormatted = convFee.formatted;
      downFormatted = convDown.formatted;
      financedFormatted = convFin.formatted;
      emiFormatted = `${convEmi.formatted}/mo`;
      totalFormatted = convTotal.formatted;
      interestFormatted = isNoCost ? `${convInt.formatted} at 0% EMI (No-Cost)` : `${convInt.formatted} (9.5% p.a.)`;
    }

    if (feeLabel) feeLabel.textContent = feeFormatted;
    if (downLabel) downLabel.textContent = `${downPct}% (${downFormatted})`;
    if (tenureLabel) tenureLabel.textContent = `${tenureMonths} Months (${tenureYears} Year${tenureYears === '1' ? '' : 's'})`;

    // 3. Animated Monthly Installment Number
    if (emiDisplay) {
      emiDisplay.textContent = emiFormatted;
      if (!isInitial) {
        emiDisplay.style.transform = "scale(1.04)";
        emiDisplay.style.transition = "transform 140ms ease-out";
        setTimeout(() => {
          emiDisplay.style.transform = "scale(1)";
        }, 140);
      }
    }

    // 4. Financial Breakdown
    if (downAmountDisplay) downAmountDisplay.textContent = downFormatted;
    if (financedDisplay) financedDisplay.textContent = financedFormatted;
    if (totalDisplay) totalDisplay.textContent = totalFormatted;
    if (interestDisplay) interestDisplay.textContent = interestFormatted;

    // 5. Update SVG Donut Chart (Down Payment vs Financed)
    const donutCircleBar = document.getElementById("calc-donut-circle-bar");
    const donutLegendDown = document.getElementById("calc-donut-legend-down");
    const donutLegendFin = document.getElementById("calc-donut-legend-fin");

    if (donutCircleBar) {
      const circumference = 175.93; // 2 * PI * 28
      const downOffset = (downPct / 100) * circumference;
      donutCircleBar.style.strokeDasharray = `${downOffset} ${circumference}`;
      donutCircleBar.style.transition = "stroke-dasharray 220ms ease-out";
    }
    if (donutLegendDown) {
      donutLegendDown.textContent = `Down Payment: ${downPct}% (₹${downPayment.toLocaleString('en-IN')})`;
    }
    if (donutLegendFin) {
      donutLegendFin.textContent = `Financed: ${100 - downPct}% (₹${financedAmount.toLocaleString('en-IN')})`;
    }
  }
};

/**
 * ============================================================================
 * EDUVIA UNIVERSITY DETAIL MODULE (Phase 08: Institutional Dossier Profile)
 * ============================================================================
 */
const EduviaUniversityDetail = {
  activeLevelFilter: "all",

  init() {
    const container = document.getElementById("university-detail-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const univId = params.get("id");

    if (!univId) {
      this.renderNotFound(container);
      return;
    }

    const univ = (typeof EduviaData !== "undefined" && EduviaData.getUniversityById)
      ? EduviaData.getUniversityById(univId)
      : null;

    if (!univ) {
      this.renderNotFound(container);
      return;
    }

    this.renderUniversityProfile(container, univ);
  },

  renderNotFound(container) {
    document.title = "University Not Found — Eduvia";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "The requested university profile could not be found. Explore our comprehensive directory of UGC-DEB approved institutions on Eduvia.");
    }

    const breadcrumbCurrent = document.getElementById("breadcrumb-univ-name");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = "Not Found";

    container.innerHTML = `
      <div class="univ-error-dossier" role="alert">
        <span class="material-symbols-outlined univ-error-icon" aria-hidden="true">domain_disabled</span>
        <h1 class="univ-error-title">UNIVERSITY NOT FOUND</h1>
        <p class="univ-error-desc">
          We couldn't find the university profile you're looking for. The institution identifier may be incorrect or no longer listed in our institutional registry.
        </p>
        <div class="univ-error-actions">
          <a href="universities.html" class="btn btn-primary btn-sm">
            <span>Explore Universities</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
          <a href="programmes.html" class="btn btn-outline btn-sm">
            <span>Explore Programmes</span>
            <span class="material-symbols-outlined text-[16px]">school</span>
          </a>
        </div>
      </div>
    `;
  },

  renderUniversityProfile(container, univ) {
    // Dynamic metadata
    document.title = `${univ.name} | Programmes, Admissions & Comparison | Eduvia`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `Explore ${univ.name} (${univ.location}) programmes, ${univ.type} accreditations (${(univ.approvals || []).join(", ")}), admissions, fees, and side-by-side comparisons on Eduvia.`);
    }

    // Dynamic breadcrumb
    const breadcrumbCurrent = document.getElementById("breadcrumb-univ-name");
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = univ.name;

    const allProgs = (typeof EduviaData !== "undefined" && EduviaData.getProgrammesByUniversity)
      ? EduviaData.getProgrammesByUniversity(univ.id)
      : [];

    const logoSrc = univ.logoUrl || `assets/images/universities/logos/${univ.id}.png`;
    const campusSrc = `assets/images/universities/campuses/${univ.id}.jpg`;
    const isSelectedForCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedUniversities)
      ? EduviaComparison.selectedUniversities.includes(univ.id)
      : false;

    // Study modes available
    const studyModes = ["100% Online"];
    if (univ.id === "nmims" || (univ.examMode && univ.examMode.toLowerCase().includes("hybrid"))) {
      studyModes.push("Hybrid / Weekend Cohorts");
    }

    // Related universities
    const otherUniversities = (typeof EduviaData !== "undefined" && EduviaData.universities)
      ? EduviaData.universities.filter(u => u.id !== univ.id).slice(0, 3)
      : [];

    // Filter facets for programmes
    const availableLevels = [...new Set(allProgs.map(p => p.degreeLevel).filter(Boolean))];

    container.innerHTML = `
      <!-- 1. UNIVERSITY HERO / INSTITUTIONAL HEADER -->
      <section class="univ-hero-dossier" aria-label="University Identity & Dossier Header">
        <div class="univ-hero-left">
          <div class="univ-hero-top-row">
            <div class="univ-hero-logo-box">
              <img src="${logoSrc}" alt="${univ.name} Official Logo" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" loading="eager" />
              <div class="univ-hero-logo-monogram" style="display: none;">${univ.logoText || univ.shortName.slice(0, 3)}</div>
            </div>
            <div class="univ-hero-identity">
              <div class="univ-hero-badges">
                <span class="badge badge-teal">${univ.badge}</span>
                ${univ.nirfRank ? `<span class="badge badge-blue">NIRF ${univ.nirfRank.replace('Rank #', '#')}</span>` : ''}
                <span class="badge badge-neutral">${univ.type}</span>
              </div>
              <h1 class="univ-hero-title">${univ.name}</h1>
              <div class="univ-hero-subline">
                <span class="inline-flex items-center gap-1 font-semibold text-secondary">
                  <span class="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  ${univ.location}
                </span>
                <span class="meta-dot">•</span>
                <span>Est. ${univ.established}</span>
                <span class="meta-dot">•</span>
                <span>${(univ.approvals || []).join(" · ")}</span>
              </div>
            </div>
          </div>

          <p class="univ-hero-desc">${univ.description}</p>

          <div class="univ-hero-meta-table">
            <div>
              <span class="univ-meta-cell-k">Institution Type</span>
              <span class="univ-meta-cell-v">${univ.type}</span>
            </div>
            <div>
              <span class="univ-meta-cell-k">Available Study Modes</span>
              <span class="univ-meta-cell-v">${studyModes.join(" · ")}</span>
            </div>
            <div>
              <span class="univ-meta-cell-k">Programmes Available</span>
              <span class="univ-meta-cell-v">${allProgs.length > 0 ? `${allProgs.length} Verified Curricula` : `${univ.programmesCount}+ Degree Pathways`}</span>
            </div>
          </div>

          <div class="univ-hero-actions">
            <a href="#programmes-section" class="btn btn-primary btn-sm">
              <span>View Programmes</span>
              <span class="material-symbols-outlined text-[16px]">school</span>
            </a>
            <button class="btn btn-outline btn-sm" id="univ-hero-compare-btn" onclick="EduviaComparison.toggleCompare('${univ.id}'); EduviaUniversityDetail.updateCompareButtonState('${univ.id}');">
              <span class="material-symbols-outlined text-[16px]">${isSelectedForCompare ? 'check_box' : 'add_box'}</span>
              <span>${isSelectedForCompare ? 'Selected in Comparison' : 'Compare University'}</span>
            </button>
            ${univ.website ? `
              <a href="${univ.website}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                <span>Visit Official Website</span>
                <span class="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            ` : ''}
          </div>
        </div>

        <div class="univ-hero-right">
          <!-- Authentic Campus Image or Refined Architectural Monogram Placeholder -->
          <div class="univ-campus-photo-container">
            <img src="${campusSrc}" alt="${univ.name} Campus Environment" onerror="this.parentElement.innerHTML = document.getElementById('univ-arch-template-${univ.id}') ? document.getElementById('univ-arch-template-${univ.id}').innerHTML : '';" loading="eager" />
            <div class="univ-campus-caption-strip">
              <span>${univ.name} — ${univ.location}</span>
              <span class="font-bold">Authentic Campus Facility</span>
            </div>
          </div>
          <!-- Template for Architectural Monogram Fallback -->
          <div id="univ-arch-template-${univ.id}" style="display: none;">
            <div class="univ-arch-placeholder" role="img" aria-label="${univ.name} Institutional Dossier Graphic">
              <div class="univ-arch-placeholder-top">
                <span class="label-caps text-jade-light" style="letter-spacing: 0.12em;">INSTITUTIONAL DOSSIER</span>
                <span class="badge badge-teal">${univ.badge}</span>
              </div>
              <div class="univ-arch-placeholder-mid">
                <div style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 900; line-height: 1; letter-spacing: -0.04em; color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">
                  ${univ.logoText || univ.shortName.slice(0, 4)}
                </div>
                <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--text);">
                  ${univ.name}
                </div>
                <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">
                  ${univ.location} • Est. ${univ.established}
                </div>
              </div>
              <div class="univ-arch-placeholder-bot">
                <span>Statutory Clearances: ${(univ.approvals || []).join(", ")}</span>
                <span class="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. QUICK FACTS STRIP -->
      <section class="univ-facts-strip" aria-label="Institutional Quick Facts">
        <div class="univ-fact-item">
          <span class="univ-fact-k">LOCATION</span>
          <span class="univ-fact-v">${univ.location}</span>
        </div>
        <div class="univ-fact-item">
          <span class="univ-fact-k">UNIVERSITY TYPE</span>
          <span class="univ-fact-v">${univ.type}</span>
        </div>
        <div class="univ-fact-item">
          <span class="univ-fact-k">STUDY MODE</span>
          <span class="univ-fact-v">${studyModes.join(" + ")}</span>
        </div>
        <div class="univ-fact-item">
          <span class="univ-fact-k">DEGREE LEVELS</span>
          <span class="univ-fact-v">UG + PG Degrees</span>
        </div>
        <div class="univ-fact-item">
          <span class="univ-fact-k">RECOGNITION</span>
          <span class="univ-fact-v">${(univ.approvals || [])[0] || 'UGC-DEB'} · ${univ.badge}</span>
        </div>
        <div class="univ-fact-item">
          <span class="univ-fact-k">ESTABLISHED</span>
          <span class="univ-fact-v">${univ.established}</span>
        </div>
      </section>

      <!-- 3. ABOUT THE UNIVERSITY (Editorial 2-Column Section) -->
      <section class="univ-editorial-card" aria-labelledby="heading-about-univ">
        <div class="univ-two-col-grid">
          <div>
            <span class="univ-section-tag">Institutional Profile</span>
            <h2 id="heading-about-univ" class="univ-section-heading">ABOUT ${univ.name.toUpperCase()}</h2>
            <p class="univ-editorial-lead">
              Verified overview of governance, academic structure, and digital learning infrastructure.
            </p>
            <div class="p-4 bg-surface-tinted border border-border-card space-y-2 mt-4">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-secondary">Statutory Status:</span>
                <span class="text-primary font-bold">UGC-DEB Entitled</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-secondary">NAAC Grade:</span>
                <span class="text-jade-deep font-bold">${univ.badge}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-secondary">Examination Model:</span>
                <span class="text-secondary">${univ.examMode || 'Online Remote Proctored'}</span>
              </div>
            </div>
          </div>

          <div class="univ-editorial-body space-y-4">
            <p>${univ.description}</p>
            <p>
              ${univ.name} is formally recognized by the University Grants Commission (UGC) and the Distance Education Bureau (DEB) to offer degree programmes through online and distance modes. Curricula are structured to meet contemporary industry requirements while adhering to the National Education Policy (NEP) guidelines.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div class="p-3 bg-surface-tinted border border-border-card">
                <span class="text-xs font-bold text-secondary uppercase block mb-1">Pedagogy & Faculty</span>
                <span class="text-xs text-text-body">${univ.liveSessions || 'Interactive live weekend lectures and recorded masterclasses with academic faculty.'}</span>
              </div>
              <div class="p-3 bg-surface-tinted border border-border-card">
                <span class="text-xs font-bold text-secondary uppercase block mb-1">Recruiter Network</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  ${(univ.topRecruiters || []).slice(0, 4).map(r => `<span class="badge badge-neutral text-[10px]">${r}</span>`).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. PROGRAMMES AT THIS UNIVERSITY -->
      <section class="mb-12" id="programmes-section" aria-labelledby="heading-univ-progs">
        <div class="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <span class="univ-section-tag">Degree Offerings</span>
            <h2 id="heading-univ-progs" class="univ-section-heading" style="margin-bottom: 0.25rem;">
              PROGRAMMES AT ${univ.name.toUpperCase()}
            </h2>
            <p class="text-sm text-text-secondary">
              Explore verified undergraduate and postgraduate degree curricula offered by ${univ.name}.
            </p>
          </div>
          <a href="programmes.html?univ=${univ.id}" class="btn btn-outline btn-sm">
            <span>Explore All in Directory</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>

        <!-- Programme Filters -->
        ${allProgs.length > 1 ? `
          <div class="univ-progs-controls-strip">
            <div class="univ-progs-filter-group" id="univ-level-filters">
              <span class="text-xs font-bold text-text-subtle uppercase mr-2">Level:</span>
              <button class="univ-prog-filter-btn active" data-filter-type="level" data-filter-val="all" onclick="EduviaUniversityDetail.filterProgrammes('level', 'all', this)">All</button>
              ${availableLevels.includes('ug') ? `<button class="univ-prog-filter-btn" data-filter-type="level" data-filter-val="ug" onclick="EduviaUniversityDetail.filterProgrammes('level', 'ug', this)">UG</button>` : ''}
              ${availableLevels.includes('pg') ? `<button class="univ-prog-filter-btn" data-filter-type="level" data-filter-val="pg" onclick="EduviaUniversityDetail.filterProgrammes('level', 'pg', this)">PG</button>` : ''}
              ${availableLevels.includes('exec') ? `<button class="univ-prog-filter-btn" data-filter-type="level" data-filter-val="exec" onclick="EduviaUniversityDetail.filterProgrammes('level', 'exec', this)">Executive</button>` : ''}
            </div>

            <div class="text-xs text-text-muted font-bold" id="univ-progs-count-display">
              Showing ${allProgs.length} of ${allProgs.length} programmes
            </div>
          </div>
        ` : ''}

        <!-- Programmes List Container -->
        <div id="univ-programmes-list-container">
          ${this.renderProgrammesMarkup(allProgs, univ)}
        </div>
      </section>

      <!-- 5. STUDY MODES SECTION -->
      <section class="univ-editorial-card" aria-labelledby="heading-study-modes">
        <div class="mb-6">
          <span class="univ-section-tag">Delivery Formats</span>
          <h2 id="heading-study-modes" class="univ-section-heading">STUDY MODES AT THIS UNIVERSITY</h2>
          <p class="univ-editorial-lead">
            Available across selected programmes at ${univ.name}. Delivery format and schedule depend on specific degree curriculum requirements.
          </p>
        </div>

        <div class="univ-modes-grid">
          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">100% Online</span>
                <span class="badge badge-teal">Full Flexibility</span>
              </div>
              <p class="univ-mode-body">
                Asynchronous digital lecture access, e-learning materials, discussion forums, and online submission of assignments through the institutional LMS.
              </p>
            </div>
            <div class="univ-mode-note">
              ✓ Fully remote access anywhere in India
            </div>
          </div>

          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">Live Weekend Masterclasses</span>
                <span class="badge badge-blue">Faculty Mentorship</span>
              </div>
              <p class="univ-mode-body">
                Scheduled live interactive lectures and doubt-clearing sessions conducted by university professors and industry practitioners during weekends.
              </p>
            </div>
            <div class="univ-mode-note">
              ✓ Direct interaction & peer networking
            </div>
          </div>

          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">Proctored Examinations</span>
                <span class="badge badge-neutral">UGC Compliant</span>
              </div>
              <p class="univ-mode-body">
                AI and webcam-supervised end-term examinations conducted online, ensuring statutory examination integrity without requiring travel to physical centers.
              </p>
            </div>
            <div class="univ-mode-note">
              ✓ Secure remote examination system
            </div>
          </div>
        </div>
      </section>

      <!-- 6. RECOGNITION & ACCREDITATION -->
      <section class="univ-editorial-card" aria-labelledby="heading-recognition">
        <div class="mb-6">
          <span class="univ-section-tag">Statutory Clearances</span>
          <h2 id="heading-recognition" class="univ-section-heading">RECOGNITION & ACCREDITATION</h2>
          <p class="univ-editorial-lead">
            Verified institutional approvals and certifications on record for ${univ.name}.
          </p>
        </div>

        <div class="univ-recognition-grid">
          <div class="univ-recognition-block">
            <div class="univ-rec-top">
              <span class="univ-rec-authority">UGC-DEB</span>
              <span class="badge badge-teal">Mandatory</span>
            </div>
            <p class="univ-rec-details">
              University Grants Commission – Distance Education Bureau approval authorising the institution to grant valid higher education degrees online.
            </p>
            <div class="univ-rec-footer">
              <span>Status: Verified Entitled</span>
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          <div class="univ-recognition-block">
            <div class="univ-rec-top">
              <span class="univ-rec-authority">NAAC Accreditation</span>
              <span class="badge badge-teal">${univ.badge}</span>
            </div>
            <p class="univ-rec-details">
              National Assessment and Accreditation Council institutional rating certifying faculty standards, digital pedagogy, and institutional governance.
            </p>
            <div class="univ-rec-footer">
              <span>Grade: ${univ.badge} Accredited</span>
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          ${univ.nirfRank ? `
            <div class="univ-recognition-block">
              <div class="univ-rec-top">
                <span class="univ-rec-authority">NIRF Ranking</span>
                <span class="badge badge-blue">Ranked</span>
              </div>
              <p class="univ-rec-details">
                National Institutional Ranking Framework (Ministry of Education, Govt. of India) institutional standing on national benchmark parameters.
              </p>
              <div class="univ-rec-footer">
                <span>NIRF: ${univ.nirfRank}</span>
                <span class="material-symbols-outlined text-[16px]">military_tech</span>
              </div>
            </div>
          ` : ''}

          ${(univ.approvals || []).includes("AICTE") ? `
            <div class="univ-recognition-block">
              <div class="univ-rec-top">
                <span class="univ-rec-authority">AICTE</span>
                <span class="badge badge-neutral">Technical</span>
              </div>
              <p class="univ-rec-details">
                All India Council for Technical Education alignment for technical and management curricula (MCA/MBA).
              </p>
              <div class="univ-rec-footer">
                <span>Status: Curriculum Aligned</span>
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
              </div>
            </div>
          ` : ''}
        </div>
      </section>

      <!-- 7. ADMISSIONS & ELIGIBILITY -->
      <section class="univ-editorial-card" aria-labelledby="heading-admissions">
        <div class="mb-6">
          <span class="univ-section-tag">Enrollment Process</span>
          <h2 id="heading-admissions" class="univ-section-heading">ADMISSIONS & ELIGIBILITY</h2>
          <p class="univ-editorial-lead">
            Standard admission protocol and qualifying prerequisites for degree enrollment.
          </p>
        </div>

        <div class="univ-admissions-grid">
          <div class="univ-admissions-card">
            <h3 class="univ-adm-card-title">Admission Process Protocol</h3>
            <ol class="univ-adm-steps-list">
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">1</span>
                <div>
                  <strong>Online Application:</strong> Submit personal profile, degree choice, and academic background details via the digital admissions form.
                </div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">2</span>
                <div>
                  <strong>Document Verification:</strong> Upload scanned original marksheets, graduation certificates, and government identification.
                </div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">3</span>
                <div>
                  <strong>Tuition Payment & 0% EMI Setup:</strong> Confirm semester fees directly or opt for paperless no-cost monthly installment financing.
                </div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">4</span>
                <div>
                  <strong>Enrollment & LMS Access:</strong> Receive official student enrollment number, institutional email, and learning portal credentials.
                </div>
              </li>
            </ol>
          </div>

          <div class="univ-admissions-card">
            <h3 class="univ-adm-card-title">Eligibility Prerequisites</h3>
            <div class="space-y-3 text-xs text-text-body">
              <div class="p-2.5 bg-white border border-border-card">
                <strong class="text-secondary block mb-0.5">Postgraduate Degrees (MBA / MCA / M.Sc / M.Com):</strong>
                <span>Bachelor's degree in any discipline or relevant stream from a recognized university with minimum 50% aggregate marks (45% for reserved categories).</span>
              </div>
              <div class="p-2.5 bg-white border border-border-card">
                <strong class="text-secondary block mb-0.5">Undergraduate Degrees (BBA / BCA / B.Com):</strong>
                <span>10+2 Higher Secondary Certificate from a recognized national or state educational board with qualifying pass marks.</span>
              </div>
              <p class="text-text-muted italic pt-1">
                Note: Eligibility details vary by programme. Check the programme-specific admission information on individual curriculum pages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. CAMPUS / LEARNING ENVIRONMENT -->
      <section class="univ-editorial-card" aria-labelledby="heading-learning-env">
        <div class="mb-6">
          <span class="univ-section-tag">Student Infrastructure</span>
          <h2 id="heading-learning-env" class="univ-section-heading">THE LEARNING ENVIRONMENT</h2>
          <p class="univ-editorial-lead">
            Digital learning platforms, examination mechanisms, and career enablement systems at ${univ.name}.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-surface-tinted border border-border-card">
            <h3 class="font-headline font-bold text-sm text-secondary uppercase mb-2">Technology & LMS Infrastructure</h3>
            <p class="text-xs text-text-body leading-relaxed mb-3">
              ${univ.lmsFeatures || 'Modern Cloud-based LMS featuring 24/7 video lecture archives, digital library access, interactive discussion forums, and automated self-assessment quizzes.'}
            </p>
            <div class="flex items-center gap-2 text-xs text-jade-deep font-bold">
              <span class="material-symbols-outlined text-[16px]">devices</span>
              <span>Accessible on Desktop, Tablet, and Mobile</span>
            </div>
          </div>

          <div class="p-4 bg-surface-tinted border border-border-card">
            <h3 class="font-headline font-bold text-sm text-secondary uppercase mb-2">Examination & Quality Mechanism</h3>
            <p class="text-xs text-text-body leading-relaxed mb-3">
              ${univ.examMode || 'AI-monitored proctored exams with continuous internal assessment, case study submissions, and secure semester-end test modules.'}
            </p>
            <div class="flex items-center gap-2 text-xs text-sapphire font-bold">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>100% Proctored Remote Standards</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 9. COMPARE THIS UNIVERSITY CALLOUT -->
      <section class="univ-compare-callout" aria-label="University Comparison Callout">
        <div class="univ-compare-callout-text">
          <span class="label-caps text-jade-light block mb-1">DECISION SUPPORT</span>
          <h3>COMPARE BEFORE YOU CHOOSE</h3>
          <p>
            Compare ${univ.name} side-by-side with other accredited universities across tuition fees, NAAC grades, examination formats, and recruiter networks.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-primary btn-sm" onclick="EduviaComparison.toggleCompare('${univ.id}'); EduviaUniversityDetail.updateCompareButtonState('${univ.id}');">
            <span class="material-symbols-outlined text-[16px]">${isSelectedForCompare ? 'check_box' : 'add_box'}</span>
            <span>${isSelectedForCompare ? 'Selected to Compare' : '+ Compare This University'}</span>
          </button>
          <button class="btn btn-outline btn-sm text-white border-white/40" onclick="EduviaComparison.openComparisonMatrixModal()">
            <span>View Comparison Matrix</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- 10. RELATED UNIVERSITIES ("YOU MAY ALSO EXPLORE") -->
      ${otherUniversities.length > 0 ? `
        <section class="mb-12" aria-labelledby="heading-related-univs">
          <div class="mb-4">
            <span class="univ-section-tag">Institutional Directory</span>
            <h2 id="heading-related-univs" class="univ-section-heading">YOU MAY ALSO EXPLORE</h2>
            <p class="text-sm text-text-secondary">
              Explore other accredited universities with similar study options and delivery models.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${otherUniversities.map(u => `
              <div class="p-4 bg-white border border-border-structural flex flex-col justify-between hover:border-sapphire transition-all shadow-sm">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="badge badge-teal">${u.badge}</span>
                    <span class="badge badge-neutral">${u.type}</span>
                  </div>
                  <h3 class="font-headline font-bold text-sm text-secondary mb-1">
                    <a href="university.html?id=${u.id}" class="hover:text-sapphire">${u.name}</a>
                  </h3>
                  <p class="text-xs text-text-muted mb-3">${u.location} • Est. ${u.established}</p>
                </div>
                <div class="pt-3 border-t border-border-card flex items-center justify-between">
                  <span class="text-xs font-bold text-secondary">${u.feeRange}</span>
                  <a href="university.html?id=${u.id}" class="btn btn-dark btn-sm text-xs py-1 px-2.5">
                    <span>View Dossier →</span>
                  </a>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ''}

      <!-- 11. FINAL CTA -->
      <section class="discovery-assistance-section" aria-label="Final Discovery Assistance">
        <div class="assistance-text-col">
          <span class="assistance-tag">Academic Discovery</span>
          <h3 class="assistance-title">READY TO EXPLORE YOUR OPTIONS?</h3>
          <p class="assistance-desc">
            Compare programmes, explore universities, and find the study option that fits your goals.
          </p>
        </div>
        <div class="assistance-actions-col">
          <a href="programmes.html" class="btn btn-primary btn-sm">
            <span>Explore Programmes</span>
            <span class="material-symbols-outlined text-[16px]">school</span>
          </a>
          <a href="compare.html" class="btn btn-outline btn-sm">
            <span>Compare Options</span>
            <span class="material-symbols-outlined text-[16px]">compare_arrows</span>
          </a>
        </div>
      </section>
    `;
  },

  renderProgrammesMarkup(programmes, univ) {
    if (programmes.length === 0) {
      return `
        <div class="p-8 bg-white border border-border-structural text-center">
          <span class="material-symbols-outlined text-4xl text-text-muted mb-2">school</span>
          <h3 class="font-headline font-bold text-base text-secondary uppercase mb-1">Curricula Being Indexed</h3>
          <p class="text-xs text-text-secondary max-w-md mx-auto mb-4">
            Direct curriculum dossiers for ${univ.name} are currently being indexed from institutional records. You can explore all degree pathways or speak with an academic advisor.
          </p>
          <div class="flex justify-center gap-3">
            <a href="programmes.html" class="btn btn-outline btn-sm">Browse All Programmes</a>
            <button class="btn btn-primary btn-sm" onclick="EduviaUI.openCounselingModal('${univ.name}')">Request Programme Syllabus</button>
          </div>
        </div>
      `;
    }

    let filtered = programmes;
    if (this.activeLevelFilter !== "all") {
      filtered = filtered.filter(p => p.degreeLevel === this.activeLevelFilter);
    }

    if (filtered.length === 0) {
      return `
        <div class="p-6 bg-white border border-border-structural text-center">
          <p class="text-sm text-text-secondary">No programmes found matching the selected level filter.</p>
          <button class="btn btn-outline btn-sm mt-3" onclick="EduviaUniversityDetail.filterProgrammes('level', 'all', document.querySelector('#univ-level-filters button'))">Show All Programmes</button>
        </div>
      `;
    }

    const selectedCompare = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedUniversities)
      ? EduviaComparison.selectedUniversities
      : [];

    return filtered.map(p => {
      const isSelected = selectedCompare.includes(p.id);
      return `
        <article class="univ-prog-card-row" id="prog-card-${p.id}">
          <div class="univ-prog-main-col">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="badge badge-teal">${(p.degreeLevel || 'PG').toUpperCase()}</span>
              <span class="badge badge-neutral">${p.discipline || 'General'}</span>
            </div>
            <h3 class="univ-prog-title">
              <a href="programme.html?id=${p.id}">${p.title}</a>
            </h3>
            <p class="univ-prog-spec-line">${p.specialisation || 'Comprehensive Curriculum'}</p>
            <div class="univ-prog-tags-row">
              <span>Duration: <strong>${p.duration}</strong></span>
              <span>•</span>
              <span>Study Mode: <strong>${p.studyMode}</strong></span>
              <span>•</span>
              <span>Accreditation: <strong>${p.accreditation || 'UGC-DEB'}</strong></span>
            </div>
          </div>

          <div class="univ-prog-pricing-col">
            <span class="univ-meta-cell-k">Total Tuition Fee</span>
            <span class="univ-prog-total-fee">₹${p.totalFee.toLocaleString('en-IN')}</span>
            <span class="univ-prog-emi-sub block">0% EMI ₹${p.emiMonthly ? p.emiMonthly.toLocaleString('en-IN') : Math.round(p.totalFee / 24).toLocaleString('en-IN')}/mo</span>
          </div>

          <div class="univ-prog-actions-col">
            <a href="programme.html?id=${p.id}" class="btn btn-outline btn-sm">
              <span>View Programme</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </article>
      `;
    }).join("");
  },

  filterProgrammes(type, val, btnEl) {
    if (type === "level") {
      this.activeLevelFilter = val;
      if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll(".univ-prog-filter-btn").forEach(b => b.classList.remove("active"));
        btnEl.classList.add("active");
      }
    }

    const params = new URLSearchParams(window.location.search);
    const univId = params.get("id");
    const univ = (typeof EduviaData !== "undefined" && EduviaData.getUniversityById) ? EduviaData.getUniversityById(univId) : null;
    const allProgs = (typeof EduviaData !== "undefined" && EduviaData.getProgrammesByUniversity) ? EduviaData.getProgrammesByUniversity(univId) : [];

    const listContainer = document.getElementById("univ-programmes-list-container");
    if (listContainer && univ) {
      listContainer.innerHTML = this.renderProgrammesMarkup(allProgs, univ);
    }

    const countDisplay = document.getElementById("univ-progs-count-display");
    if (countDisplay) {
      let filteredCount = allProgs.length;
      if (this.activeLevelFilter !== "all") {
        filteredCount = allProgs.filter(p => p.degreeLevel === this.activeLevelFilter).length;
      }
      countDisplay.textContent = `Showing ${filteredCount} of ${allProgs.length} programmes`;
    }
  },

  updateCompareButtonState(univId) {
    const isSelected = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedUniversities)
      ? EduviaComparison.selectedUniversities.includes(univId)
      : false;

    const heroBtn = document.getElementById("univ-hero-compare-btn");
    if (heroBtn) {
      heroBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">${isSelected ? 'check_box' : 'add_box'}</span>
        <span>${isSelected ? 'Selected in Comparison' : 'Compare University'}</span>
      `;
    }
  }
};

/**
 * EDUVIA PROGRAMME DETAIL CONTROLLER (assets/js/app.js)
 * Manages dynamic rendering for programme.html?id=[prog-id]
 */
const EduviaProgrammeDetail = {
  activeProgramme: null,
  activeUniversity: null,

  init() {
    const container = document.getElementById("programme-detail-container");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const progId = params.get("id");

    if (!progId) {
      // Default to first programme if no id is provided
      const defaultProg = (typeof EduviaData !== "undefined" && EduviaData.programmes && EduviaData.programmes.length > 0)
        ? EduviaData.programmes[0]
        : null;
      if (defaultProg) {
        this.renderProgramme(defaultProg);
      } else {
        this.renderNotFoundState("default");
      }
      return;
    }

    const prog = (typeof EduviaData !== "undefined" && EduviaData.getProgrammeById)
      ? EduviaData.getProgrammeById(progId)
      : null;

    if (!prog) {
      this.renderNotFoundState(progId);
      return;
    }

    this.renderProgramme(prog);
  },

  renderProgramme(prog) {
    this.activeProgramme = prog;
    const univ = (typeof EduviaData !== "undefined" && EduviaData.getUniversityById)
      ? EduviaData.getUniversityById(prog.universityId)
      : {
          id: prog.universityId,
          name: prog.universityName,
          shortName: prog.universityName,
          location: prog.location || "India",
          type: "Accredited University",
          badge: "UGC-DEB",
          logoText: prog.universityName.substring(0, 4).toUpperCase()
        };
    this.activeUniversity = univ;

    // 1. Dynamic SEO Metadata
    document.title = `${prog.title} | ${univ.name} | Eduvia`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `Comprehensive syllabus, semester breakdown, eligibility prerequisites, fee structure (₹${prog.totalFee.toLocaleString('en-IN')}), and recognition for ${prog.title} at ${univ.name}.`);
    }

    // 2. Dynamic Breadcrumb
    const breadcrumbProg = document.getElementById("breadcrumb-prog-name");
    const breadcrumbUniv = document.getElementById("breadcrumb-prog-univ");
    if (breadcrumbProg) breadcrumbProg.textContent = prog.title;
    if (breadcrumbUniv) {
      breadcrumbUniv.innerHTML = `<a href="university.html?id=${univ.id}">${univ.shortName || univ.name}</a>`;
    }

    // 3. Main Container Render
    const container = document.getElementById("programme-detail-container");
    if (!container) return;

    const isSelected = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes)
      ? EduviaComparison.selectedProgrammes.includes(prog.id)
      : false;

    const semestersCount = (prog.durationYears || 2) * 2;
    const semFeeCalc = Math.round(prog.totalFee / semestersCount);

    const relatedProgrammes = (typeof EduviaData !== "undefined" && EduviaData.programmes)
      ? EduviaData.programmes.filter(p => p.id !== prog.id && (p.discipline === prog.discipline || p.universityId === prog.universityId)).slice(0, 3)
      : [];

    container.innerHTML = `
      <!-- 1. PROGRAMME HERO / DOSSIER HEADER -->
      <section class="prog-hero-dossier" aria-label="Programme Identity Dossier">
        <div class="prog-hero-left">
          <div class="prog-hero-univ-strip">
            <div class="prog-hero-univ-logo">
              <img src="${univ.logoUrl || 'assets/images/universities/logos/' + univ.id + '.png'}" 
                   alt="${univ.name} logo" 
                   onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
              <span class="prog-hero-logo-fallback" style="display:none;">${univ.logoText || univ.shortName.substring(0,4)}</span>
            </div>
            <div class="prog-hero-univ-meta">
              <a href="university.html?id=${univ.id}" class="prog-hero-univ-name">
                <span>${univ.name}</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
              <span class="prog-hero-univ-sub">${univ.location} • ${univ.type}</span>
            </div>
          </div>

          <div class="prog-hero-title-area">
            <div class="prog-hero-badges-row">
              <span class="badge badge-teal">${(prog.degreeLevel || 'PG').toUpperCase()} DEGREE</span>
              <span class="badge badge-blue">${(prog.discipline || 'General').toUpperCase()}</span>
              <span class="badge badge-neutral">${prog.studyMode}</span>
              ${prog.accreditation ? `<span class="badge badge-teal">${prog.accreditation}</span>` : ''}
            </div>
            <h1 class="prog-hero-title">${prog.title}</h1>
            <p class="prog-hero-spec-line">
              <strong>Specialisations:</strong> ${prog.specialisation || 'General Management & Core Track'}
            </p>
          </div>

          <div class="prog-hero-meta-grid">
            <div>
              <span class="univ-meta-cell-k">Duration</span>
              <span class="univ-meta-cell-v">${prog.duration}</span>
            </div>
            <div>
              <span class="univ-meta-cell-k">Study Delivery</span>
              <span class="univ-meta-cell-v">${prog.studyMode}</span>
            </div>
            <div>
              <span class="univ-meta-cell-k">Total Programme Tuition</span>
              <span class="univ-meta-cell-v font-bold text-primary">
                ${typeof EduviaI18n !== "undefined" ? EduviaI18n.convertPrice(prog.totalFee, prog.originalCurrency || "INR").formatted : `₹${prog.totalFee.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div>
              <span class="univ-meta-cell-k">No-Cost Monthly EMI</span>
              <span class="univ-meta-cell-v font-bold text-secondary">
                ${typeof EduviaI18n !== "undefined" ? `${EduviaI18n.convertPrice(prog.emiMonthly || Math.round(prog.totalFee / 24), prog.originalCurrency || "INR").formatted}/mo` : `₹${prog.emiMonthly ? prog.emiMonthly.toLocaleString('en-IN') : Math.round(prog.totalFee / 24).toLocaleString('en-IN')}/mo`}
              </span>
            </div>
          </div>

          <div class="prog-hero-actions">
            <button class="btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm" 
                    id="prog-hero-compare-btn"
                    onclick="EduviaComparison.toggleCompare('${prog.id}')">
              <span class="material-symbols-outlined text-[16px]">${isSelected ? 'check_box' : 'add_box'}</span>
              <span>${isSelected ? 'Selected in Comparison' : 'Compare Programme'}</span>
            </button>
            <a href="university.html?id=${univ.id}" class="btn btn-dark btn-sm">
              <span class="material-symbols-outlined text-[16px]">account_balance</span>
              <span>View University Dossier</span>
            </a>
            <button class="btn btn-outline btn-sm" onclick="EduviaUI.openCounselingModal('${univ.name} - ${prog.title}')">
              <span class="material-symbols-outlined text-[16px]">support_agent</span>
              <span>Request Syllabus PDF</span>
            </button>
          </div>
        </div>

        <div class="prog-hero-right">
          <div class="prog-hero-banner-container">
            <img src="assets/images/programmes/eduvia-programme-academic-banner-01.jpg" 
                 alt="${prog.title} academic curriculum overview banner" 
                 loading="eager" />
            <div class="prog-hero-banner-caption">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-jade">verified</span>
                <span>Verified Curriculum Dossier</span>
              </div>
              <span>${prog.accreditation || 'UGC-DEB Recognized'}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. KEY PROGRAMME FACTS STRIP -->
      <section class="prog-facts-strip" aria-label="Key Programme Facts">
        <div class="prog-fact-item">
          <span class="prog-fact-k">Degree Level</span>
          <span class="prog-fact-v">${(prog.degreeLevel || 'PG').toUpperCase()}</span>
        </div>
        <div class="prog-fact-item">
          <span class="prog-fact-k">Duration</span>
          <span class="prog-fact-v">${prog.duration}</span>
        </div>
        <div class="prog-fact-item">
          <span class="prog-fact-k">Study Mode</span>
          <span class="prog-fact-v">${prog.studyMode.split('+')[0].trim()}</span>
        </div>
        <div class="prog-fact-item">
          <span class="prog-fact-k">Total Fee</span>
          <span class="prog-fact-v">
            ${typeof EduviaI18n !== "undefined" ? EduviaI18n.convertPrice(prog.totalFee, prog.originalCurrency || "INR").formatted : `₹${prog.totalFee.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div class="prog-fact-item">
          <span class="prog-fact-k">Monthly EMI</span>
          <span class="prog-fact-v">
            ${typeof EduviaI18n !== "undefined" ? `${EduviaI18n.convertPrice(prog.emiMonthly || Math.round(prog.totalFee / 24), prog.originalCurrency || "INR").formatted}/mo` : `₹${prog.emiMonthly ? prog.emiMonthly.toLocaleString('en-IN') : Math.round(prog.totalFee / 24).toLocaleString('en-IN')}/mo`}
          </span>
        </div>
        <div class="prog-fact-item">
          <span class="prog-fact-k">Accreditation</span>
          <span class="prog-fact-v">${prog.accreditations ? prog.accreditations[0] : (prog.accreditation || 'UGC-DEB')}</span>
        </div>
      </section>

      <!-- 3. OVERVIEW / ABOUT THE PROGRAMME -->
      <section class="univ-editorial-card" aria-labelledby="heading-about-prog">
        <div class="univ-two-col-grid">
          <div>
            <span class="univ-section-tag">Academic Scope</span>
            <h2 id="heading-about-prog" class="univ-section-heading">WHAT YOU'LL STUDY</h2>
            <p class="univ-editorial-lead">
              A comprehensive evaluation of the degree architecture, subject orientation, and intended academic competencies.
            </p>
            <div class="p-3 bg-surface-tinted border border-border-card text-xs text-text-body space-y-1 mt-4">
              <div><strong>Offered By:</strong> ${univ.name}</div>
              <div><strong>Academic Stream:</strong> ${(prog.discipline || '').toUpperCase()}</div>
              <div><strong>Statutory Level:</strong> ${(prog.degreeLevel || 'PG').toUpperCase()} Degree</div>
            </div>
          </div>
          <div>
            <p class="univ-editorial-body mb-4">
              ${prog.description}
            </p>
            ${prog.highlights && prog.highlights.length > 0 ? `
              <div class="p-4 bg-surface-canvas border border-border-card">
                <h4 class="font-headline font-bold text-xs text-secondary uppercase mb-2">Programme Highlights & Core Pedagogy</h4>
                <ul class="space-y-1.5 text-xs text-text-body">
                  ${prog.highlights.map(h => `<li class="flex items-start gap-1.5"><span class="text-jade font-bold">✓</span><span>${h}</span></li>`).join("")}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- 4. ELIGIBILITY & ADMISSIONS -->
      <section class="univ-editorial-card" aria-labelledby="heading-eligibility">
        <div class="mb-6">
          <span class="univ-section-tag">Academic Clearance</span>
          <h2 id="heading-eligibility" class="univ-section-heading">ELIGIBILITY & ADMISSION</h2>
          <p class="univ-editorial-lead">
            Prerequisite academic credentials and the step-by-step statutory verification pathway for ${prog.title}.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 bg-surface-tinted border border-border-card flex flex-col justify-between">
            <div>
              <h3 class="font-headline font-bold text-sm text-secondary uppercase mb-2">Academic Qualification Requirements</h3>
              <p class="text-xs text-text-body leading-relaxed mb-4">
                ${prog.eligibility || "Graduation in any discipline from a UGC-recognized university with minimum 50% aggregate marks (45% for reserved categories)."}
              </p>
            </div>
            <div class="p-3 bg-white border border-border-card text-xs text-text-secondary">
              <strong>Equivalence Note:</strong> Online degrees awarded by UGC-DEB recognized universities carry equal legal validity to traditional on-campus degrees under UGC regulations.
            </div>
          </div>

          <div class="p-4 bg-white border border-border-card">
            <h3 class="font-headline font-bold text-sm text-secondary uppercase mb-3">4-Step Admission Procedure</h3>
            <ol class="univ-adm-steps-list">
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">1</span>
                <div><strong>Online Registration:</strong> Submit official application form with academic background.</div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">2</span>
                <div><strong>Document Scrutiny:</strong> Upload verified graduation certificates, marksheets, and government ID.</div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">3</span>
                <div><strong>Fee Payment / EMI Setup:</strong> Pay semester tuition directly or activate paperless 0% interest monthly installments.</div>
              </li>
              <li class="univ-adm-step-item">
                <span class="univ-adm-step-num">4</span>
                <div><strong>LMS Credentials & Enrollment:</strong> Receive official student enrollment ID and access digital learning portal.</div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <!-- 5. FEES & FINANCING -->
      <section class="univ-editorial-card" aria-labelledby="heading-fees">
        <div class="mb-6">
          <span class="univ-section-tag">Financial Architecture</span>
          <h2 id="heading-fees" class="univ-section-heading">FEES & FINANCING</h2>
          <p class="univ-editorial-lead">
            Transparent breakdown of tuition, semester installment options, and no-cost EMI terms.
          </p>
        </div>

        <div class="prog-fees-summary-grid">
          <div class="prog-fee-card featured">
            <span class="prog-fee-label">Total Course Tuition</span>
            <span class="prog-fee-val">
              ${typeof EduviaI18n !== "undefined" ? EduviaI18n.convertPrice(prog.totalFee, prog.originalCurrency || "INR").formatted : `₹${prog.totalFee.toLocaleString('en-IN')}`}
            </span>
            <span class="prog-fee-note">
              ${(typeof EduviaI18n !== "undefined" && EduviaI18n.convertPrice(prog.totalFee, prog.originalCurrency || "INR").isConverted) ? `Estimated in ${EduviaI18n.activeCurrency} (Original: ₹${prog.totalFee.toLocaleString('en-IN')} INR)` : `Inclusive of LMS access & digital e-books`}
            </span>
          </div>
          <div class="prog-fee-card">
            <span class="prog-fee-label">Estimated Semester Fee</span>
            <span class="prog-fee-val">
              ${typeof EduviaI18n !== "undefined" ? EduviaI18n.convertPrice(semFeeCalc, prog.originalCurrency || "INR").formatted : `₹${semFeeCalc.toLocaleString('en-IN')}`}
            </span>
            <span class="prog-fee-note">Calculated across ${semestersCount} academic semesters</span>
          </div>
          <div class="prog-fee-card">
            <span class="prog-fee-label">0% Interest Monthly EMI</span>
            <span class="prog-fee-val">
              ${typeof EduviaI18n !== "undefined" ? `${EduviaI18n.convertPrice(prog.emiMonthly || Math.round(prog.totalFee / 24), prog.originalCurrency || "INR").formatted}/mo` : `₹${prog.emiMonthly ? prog.emiMonthly.toLocaleString('en-IN') : Math.round(prog.totalFee / 24).toLocaleString('en-IN')}/mo`}
            </span>
            <span class="prog-fee-note">Paperless instant approval with 0 down-payment options</span>
          </div>
        </div>

        <div class="p-4 bg-surface-tinted border border-border-card flex items-start gap-3 text-xs text-text-secondary">
          <span class="material-symbols-outlined text-[18px] text-sapphire mt-0.5">info</span>
          <div>
            <strong>Fee Transparency Commitment:</strong> Eduvia verifies institutional fees against official statutory gazettes. No additional middleman surcharges or hidden platform fees are added.
          </div>
        </div>
      </section>

      <!-- 6. CURRICULUM BREAKDOWN -->
      <section class="univ-editorial-card" aria-labelledby="heading-curriculum">
        <div class="prog-curriculum-header">
          <div>
            <span class="univ-section-tag">Curriculum Architecture</span>
            <h2 id="heading-curriculum" class="univ-section-heading" style="margin-bottom: 0.25rem;">CURRICULUM</h2>
            <p class="text-xs text-text-secondary">
              Semester-by-semester subject mapping and practical topics.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-outline btn-sm text-xs py-1 px-2.5" onclick="EduviaProgrammeDetail.toggleAllSemesters(true)">Expand All</button>
            <button class="btn btn-outline btn-sm text-xs py-1 px-2.5" onclick="EduviaProgrammeDetail.toggleAllSemesters(false)">Collapse All</button>
          </div>
        </div>

        ${prog.syllabus && prog.syllabus.length > 0 ? `
          <div class="prog-curriculum-list" id="curriculum-accordion-list">
            ${prog.syllabus.map((sem, idx) => `
              <div class="prog-sem-card ${idx === 0 ? 'is-open' : ''}" id="sem-card-${idx}">
                <button class="prog-sem-toggle-btn" 
                        onclick="EduviaProgrammeDetail.toggleSemester(${idx})"
                        aria-expanded="${idx === 0 ? 'true' : 'false'}"
                        aria-controls="sem-body-${idx}">
                  <div class="prog-sem-btn-left">
                    <span class="prog-sem-badge">${sem.sem}</span>
                    <h3 class="prog-sem-title">Core Academic Modules (${sem.topics.length} Subjects)</h3>
                  </div>
                  <span class="material-symbols-outlined prog-sem-chevron">expand_more</span>
                </button>
                <div class="prog-sem-body" id="sem-body-${idx}">
                  <div class="prog-sem-topics-grid">
                    ${sem.topics.map(t => `
                      <div class="prog-topic-item">
                        <span class="material-symbols-outlined prog-topic-icon">check_circle</span>
                        <span>${t}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `
          <div class="p-6 bg-surface-tinted border border-border-card text-center text-xs text-text-secondary">
            Detailed curriculum syllabus is currently being synchronized with institutional course records.
          </div>
        `}
      </section>

      <!-- 7. SPECIALISATIONS -->
      ${prog.specialisation ? `
        <section class="univ-editorial-card" aria-labelledby="heading-specs">
          <div class="mb-6">
            <span class="univ-section-tag">Elective Tracks</span>
            <h2 id="heading-specs" class="univ-section-heading">AVAILABLE SPECIALISATIONS</h2>
            <p class="univ-editorial-lead">
              Tailor your degree with industry-relevant electives and specialized capstone concentrations.
            </p>
          </div>

          <div class="prog-specs-chips-grid">
            ${prog.specialisation.split(',').map(s => `
              <div class="prog-spec-card">
                <span class="badge badge-teal w-fit mb-1">Elective Track</span>
                <h3 class="prog-spec-name">${s.trim()}</h3>
                <p class="prog-spec-desc">Dedicated elective course modules and capstone projects in ${s.trim()}.</p>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ''}

      <!-- 8. STUDY MODE / LEARNING FORMAT -->
      <section class="univ-editorial-card" aria-labelledby="heading-studymode">
        <div class="mb-6">
          <span class="univ-section-tag">Pedagogical Delivery</span>
          <h2 id="heading-studymode" class="univ-section-heading">HOW YOU'LL STUDY</h2>
          <p class="univ-editorial-lead">
            The operational learning model, examination mechanism, and student support infrastructure for this programme.
          </p>
        </div>

        <div class="univ-modes-grid">
          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">Digital Learning Portal (LMS)</span>
                <span class="badge badge-teal">24/7 Access</span>
              </div>
              <p class="univ-mode-body">
                Access self-paced video lectures, downloadable e-books, case studies, and interactive discussion forums through ${univ.name}'s accredited learning management system.
              </p>
            </div>
            <div class="univ-mode-note">✓ Compatible with Desktop, Tablet, and Mobile</div>
          </div>

          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">Weekend Live Masterclasses</span>
                <span class="badge badge-blue">Interactive</span>
              </div>
              <p class="univ-mode-body">
                Engage in live weekend doubt-clearing sessions, industry practitioner masterclasses, and interactive cohort clinics designed for working professionals.
              </p>
            </div>
            <div class="univ-mode-note">✓ Recorded archives available for later review</div>
          </div>

          <div class="univ-mode-card">
            <div>
              <div class="univ-mode-header">
                <span class="univ-mode-title">Proctored Online Examinations</span>
                <span class="badge badge-neutral">UGC Compliant</span>
              </div>
              <p class="univ-mode-body">
                Statutory end-term examinations are conducted through secure, AI and webcam-monitored online assessment engines, eliminating the requirement for physical travel.
              </p>
            </div>
            <div class="univ-mode-note">✓ Secure remote assessment protocols</div>
          </div>
        </div>
      </section>

      <!-- 9. RECOGNITION & ACCREDITATION -->
      <section class="univ-editorial-card" aria-labelledby="heading-recognition">
        <div class="mb-6">
          <span class="univ-section-tag">Statutory Clearances</span>
          <h2 id="heading-recognition" class="univ-section-heading">RECOGNITION & ACCREDITATION</h2>
          <p class="univ-editorial-lead">
            Verified institutional approvals and statutory certifications validating this degree programme.
          </p>
        </div>

        <div class="univ-recognition-grid">
          <div class="univ-recognition-block">
            <div class="univ-rec-top">
              <span class="univ-rec-authority">UGC-DEB Approval</span>
              <span class="badge badge-teal">Mandatory</span>
            </div>
            <p class="univ-rec-details">
              University Grants Commission – Distance Education Bureau approval authorising the institution to grant fully recognized online degrees.
            </p>
            <div class="univ-rec-footer">
              <span>Status: Verified Entitled</span>
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          <div class="univ-recognition-block">
            <div class="univ-rec-top">
              <span class="univ-rec-authority">NAAC Accreditation</span>
              <span class="badge badge-teal">${univ.badge || 'Accredited'}</span>
            </div>
            <p class="univ-rec-details">
              National Assessment and Accreditation Council grade validating institutional curriculum quality, faculty governance, and pedagogy.
            </p>
            <div class="univ-rec-footer">
              <span>Grade: ${univ.badge || 'Recognized'}</span>
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
            </div>
          </div>

          <div class="univ-recognition-block">
            <div class="univ-rec-top">
              <span class="univ-rec-authority">Equivalence Guarantee</span>
              <span class="badge badge-blue">Statutory</span>
            </div>
            <p class="univ-rec-details">
              Online degrees awarded by UGC-entitled institutions are recognized for higher education admissions, government jobs, and corporate employment.
            </p>
            <div class="univ-rec-footer">
              <span>Status: Fully Equivalent</span>
              <span class="material-symbols-outlined text-[16px]">verified</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 10. CAREER & INDUSTRY CONTEXT -->
      <section class="univ-editorial-card" aria-labelledby="heading-career">
        <div class="mb-6">
          <span class="univ-section-tag">Industry Pathways</span>
          <h2 id="heading-career" class="univ-section-heading">CAREER & INDUSTRY CONTEXT</h2>
          <p class="univ-editorial-lead">
            Relevant target corporate roles and industry domains aligned with the ${prog.title} curriculum.
          </p>
        </div>

        <div class="prog-career-roles-grid">
          ${this.getCareerRolesForDiscipline(prog.discipline).map(role => `
            <div class="prog-role-card">
              <div class="prog-role-icon">
                <span class="material-symbols-outlined">work</span>
              </div>
              <span class="prog-role-text">${role}</span>
            </div>
          `).join("")}
        </div>

        <div class="p-4 bg-surface-tinted border border-border-card text-xs text-text-secondary">
          <strong>Editorial Note:</strong> Career trajectories depend upon prior professional experience, elective concentration, and individual candidate merit. Eduvia maintains strict data integrity by not presenting unverified placement percentages or fabricated salary claims.
        </div>
      </section>

      <!-- 11. COMPARE THIS PROGRAMME CALLOUT -->
      <section class="univ-compare-callout" aria-label="Compare This Programme">
        <div class="univ-compare-callout-text">
          <span class="badge badge-teal mb-2">Decision Intelligence</span>
          <h3>COMPARE BEFORE YOU CHOOSE</h3>
          <p>
            Evaluate ${prog.title} side-by-side against alternatives across tuition fees, duration, eligibility, and accreditations.
          </p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="EduviaComparison.toggleCompare('${prog.id}')">
            <span class="material-symbols-outlined text-[18px]">${isSelected ? 'check_box' : 'add_box'}</span>
            <span>${isSelected ? 'Selected in Comparison' : 'Compare This Programme'}</span>
          </button>
        </div>
      </section>

      <!-- 12. OFFERED BY (UNIVERSITY CONNECTION) -->
      <section class="prog-univ-card" aria-label="Offered By University">
        <div class="prog-univ-card-left">
          <div class="prog-univ-card-logo">
            <img src="assets/images/universities/logos/${univ.id}.png" 
                 alt="${univ.name} logo" 
                 onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
            <span style="display:none;">${univ.logoText || univ.shortName.substring(0,4)}</span>
          </div>
          <div>
            <span class="univ-section-tag" style="margin-bottom: 2px;">Awarding Institution</span>
            <h3 class="prog-univ-card-title">${univ.name}</h3>
            <p class="prog-univ-card-meta">${univ.location} • ${univ.type} • Est. ${univ.established || 'N/A'}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="university.html?id=${univ.id}" class="btn btn-dark btn-sm">
            <span>View University Dossier</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
        </div>
      </section>

      <!-- 13. RELATED PROGRAMMES (YOU MAY ALSO EXPLORE) -->
      ${relatedProgrammes.length > 0 ? `
        <section class="univ-editorial-card" aria-labelledby="heading-related-progs">
          <div class="mb-6">
            <span class="univ-section-tag">Alternative Pathways</span>
            <h2 id="heading-related-progs" class="univ-section-heading">YOU MAY ALSO EXPLORE</h2>
            <p class="univ-editorial-lead">
              Explore related degree options in ${prog.discipline} and allied disciplines.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${relatedProgrammes.map(rp => `
              <div class="p-4 bg-white border border-border-structural flex flex-col justify-between">
                <div>
                  <span class="badge badge-teal mb-1">${(rp.degreeLevel || 'PG').toUpperCase()}</span>
                  <h3 class="font-headline font-bold text-sm text-secondary mb-1">
                    <a href="programme.html?id=${rp.id}" class="hover:text-sapphire">${rp.title}</a>
                  </h3>
                  <p class="text-xs text-text-secondary">${rp.universityName}</p>
                  <p class="text-xs text-text-muted mt-1">${rp.duration} • ${rp.studyMode}</p>
                </div>
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-border-card">
                  <span class="font-headline font-bold text-sm text-primary">₹${rp.totalFee.toLocaleString('en-IN')}</span>
                  <a href="programme.html?id=${rp.id}" class="btn btn-outline btn-sm text-xs py-1 px-2.5">View →</a>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ''}

      <!-- 14. FINAL CTA -->
      <section class="discovery-assistance-section" aria-label="Final Discovery Assistance">
        <div class="assistance-text-col">
          <span class="assistance-tag">Academic Decision Engine</span>
          <h3 class="assistance-title">READY TO COMPARE YOUR OPTIONS?</h3>
          <p class="assistance-desc">
            Explore programmes, compare universities, and make your shortlist with the information that matters.
          </p>
        </div>
        <div class="assistance-actions-col">
          <a href="programmes.html" class="btn btn-primary btn-sm">
            <span>Explore Programmes</span>
            <span class="material-symbols-outlined text-[16px]">school</span>
          </a>
          <a href="compare.html" class="btn btn-outline btn-sm">
            <span>Compare Options</span>
            <span class="material-symbols-outlined text-[16px]">compare_arrows</span>
          </a>
        </div>
      </section>

      <!-- 15. STICKY PROGRAMME ACTION BAR -->
      <div class="prog-sticky-action-bar" id="prog-sticky-bar">
        <div class="container prog-sticky-content">
          <div class="prog-sticky-title-group">
            <span class="prog-sticky-title">${prog.title}</span>
            <span class="prog-sticky-sub">${univ.shortName || univ.name} • ₹${prog.totalFee.toLocaleString('en-IN')}</span>
          </div>
          <div class="prog-sticky-actions">
            <button class="btn btn-primary btn-sm" onclick="EduviaComparison.toggleCompare('${prog.id}')">
              <span class="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Compare</span>
            </button>
            <a href="university.html?id=${univ.id}" class="btn btn-outline btn-sm text-white border-white/40">
              <span>University</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Setup sticky bar scroll listener
    this.setupStickyBar();
  },

  toggleSemester(semIndex) {
    const card = document.getElementById(`sem-card-${semIndex}`);
    if (!card) return;
    const btn = card.querySelector(".prog-sem-toggle-btn");
    const isOpen = card.classList.toggle("is-open");
    if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  },

  toggleAllSemesters(expand) {
    const cards = document.querySelectorAll(".prog-sem-card");
    cards.forEach(card => {
      if (expand) {
        card.classList.add("is-open");
        const btn = card.querySelector(".prog-sem-toggle-btn");
        if (btn) btn.setAttribute("aria-expanded", "true");
      } else {
        card.classList.remove("is-open");
        const btn = card.querySelector(".prog-sem-toggle-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  },

  setupStickyBar() {
    const stickyBar = document.getElementById("prog-sticky-bar");
    if (!stickyBar) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 450) {
        stickyBar.classList.add("visible");
      } else {
        stickyBar.classList.remove("visible");
      }
    }, { passive: true });
  },

  getCareerRolesForDiscipline(discipline) {
    const roleMap = {
      business: ["Business Analyst", "Marketing Strategist", "Financial Associate", "Operations Manager", "Human Resources Business Partner", "Product Associate"],
      tech: ["Software Development Engineer", "Cloud Solutions Architect", "Full Stack Developer", "Systems Analyst", "Database Administrator", "DevOps Engineer"],
      data: ["Data Scientist", "Machine Learning Engineer", "Business Intelligence Analyst", "Big Data Engineer", "Quantitative Research Analyst", "AI Consultant"],
      commerce: ["Corporate Financial Analyst", "Tax Consultant", "Audit Associate", "Investment Banking Analyst", "Wealth Advisor", "Compliance Officer"],
      healthcare: ["Hospital Operations Manager", "Healthcare Quality Auditor", "Clinical Informatics Specialist", "Healthcare Risk Associate", "NABH Compliance Officer"]
    };
    return roleMap[discipline] || ["Industry Consultant", "Specialist Associate", "Strategic Analyst", "Project Lead"];
  },

  renderNotFoundState(invalidId) {
    const container = document.getElementById("programme-detail-container");
    if (!container) return;

    document.title = "Programme Not Found | Eduvia";

    container.innerHTML = `
      <div class="prog-error-dossier">
        <span class="material-symbols-outlined prog-error-icon">school</span>
        <h1 class="prog-error-title">PROGRAMME NOT FOUND</h1>
        <p class="prog-error-desc">
          We couldn't find an accredited degree dossier matching the identifier <code>"${invalidId || ''}"</code>.
        </p>
        <div class="prog-error-actions">
          <a href="programmes.html" class="btn btn-primary">
            <span class="material-symbols-outlined text-[18px]">school</span>
            <span>Explore All Programmes</span>
          </a>
          <a href="universities.html" class="btn btn-outline">
            <span class="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Explore Universities</span>
          </a>
        </div>
      </div>
    `;
  },

  updateCompareButtonState(progId) {
    const isSelected = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes)
      ? EduviaComparison.selectedProgrammes.includes(progId)
      : false;

    const heroBtn = document.getElementById("prog-hero-compare-btn");
    if (heroBtn) {
      heroBtn.className = `btn ${isSelected ? 'btn-primary' : 'btn-outline'} btn-sm`;
      heroBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">${isSelected ? 'check_box' : 'add_box'}</span>
        <span>${isSelected ? 'Selected in Comparison' : 'Compare Programme'}</span>
      `;
    }
  }
};

/**
 * ============================================================================
 * EDUVIA DISCOVER & PATHWAY EXPLORATION MODULE (Phase 11)
 * ============================================================================
 */
const EduviaDiscover = {
  currentStep: 1,
  selectedInterest: "all",
  selectedField: "all",
  selectedLevel: "all",
  selectedSpec: "all",
  selectedMode: "all",

  init() {
    const container = document.getElementById("discover-builder-container");
    if (!container) return;

    this.readUrlState();
    this.renderBuilder();
    this.renderLiveResults();
    this.updateCompareTrayCount();
  },

  readUrlState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("interest")) {
      this.selectedInterest = params.get("interest");
      this.currentStep = 2;
    }
    if (params.get("field")) {
      this.selectedField = params.get("field");
      this.currentStep = 3;
    }
    if (params.get("level")) {
      this.selectedLevel = params.get("level");
      this.currentStep = 4;
    }
    if (params.get("spec")) {
      this.selectedSpec = params.get("spec");
      this.currentStep = 5;
    }
    if (params.get("step")) {
      const stepVal = parseInt(params.get("step"), 10);
      if (!isNaN(stepVal) && stepVal >= 1 && stepVal <= 5) {
        this.currentStep = stepVal;
      }
    }
    if (params.get("mode")) {
      this.selectedMode = params.get("mode");
    }
  },

  syncUrlState() {
    if (!window.location.pathname.includes("discover.html")) return;
    const url = new URL(window.location);
    if (this.selectedInterest !== "all") url.searchParams.set("interest", this.selectedInterest);
    else url.searchParams.delete("interest");

    if (this.selectedField !== "all") url.searchParams.set("field", this.selectedField);
    else url.searchParams.delete("field");

    if (this.selectedLevel !== "all") url.searchParams.set("level", this.selectedLevel);
    else url.searchParams.delete("level");

    if (this.selectedSpec !== "all") url.searchParams.set("spec", this.selectedSpec);
    else url.searchParams.delete("spec");

    if (this.currentStep > 1) url.searchParams.set("step", this.currentStep);
    else url.searchParams.delete("step");

    window.history.replaceState({}, "", url);
  },

  selectRoute(routeKey) {
    if (routeKey === "know-study") {
      if (typeof EduviaSearch !== "undefined" && EduviaSearch.open) {
        EduviaSearch.open();
      } else {
        window.location.href = "programmes.html";
      }
    } else if (routeKey === "figuring-out") {
      const el = document.getElementById("academic-interests");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      this.goToStep(1);
    } else if (routeKey === "career-direction") {
      const el = document.getElementById("career-directions-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (routeKey === "study-online") {
      this.selectedMode = "online";
      this.syncUrlState();
      const el = document.getElementById("discover-builder-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      this.renderBuilder();
      this.renderLiveResults();
    } else if (routeKey === "study-campus") {
      window.location.href = "universities.html";
    }
  },

  selectInterest(discKey) {
    this.selectedInterest = discKey;
    this.selectedField = "all";
    this.selectedSpec = "all";
    this.currentStep = 2;
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
    const el = document.getElementById("discover-builder-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  },

  setInterest(interest) {
    this.selectedInterest = interest;
    this.selectedField = "all";
    this.selectedSpec = "all";
    this.currentStep = 2;
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
  },

  setField(field) {
    this.selectedField = field;
    this.selectedSpec = "all";
    this.currentStep = 3;
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
  },

  setLevel(level) {
    this.selectedLevel = level;
    this.selectedSpec = "all";
    this.currentStep = 4;
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
  },

  setSpec(spec) {
    this.selectedSpec = spec;
    this.currentStep = 5;
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
  },

  goToStep(stepNum) {
    this.currentStep = Math.max(1, Math.min(5, stepNum));
    this.syncUrlState();
    this.renderBuilder();
    if (this.currentStep === 5) {
      const el = document.getElementById("discover-results-panel");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  },

  resetBuilder() {
    this.currentStep = 1;
    this.selectedInterest = "all";
    this.selectedField = "all";
    this.selectedLevel = "all";
    this.selectedSpec = "all";
    this.selectedMode = "all";
    this.syncUrlState();
    this.renderBuilder();
    this.renderLiveResults();
  },

  getMatchingProgrammes() {
    if (!EduviaData || !EduviaData.programmes) return [];
    return EduviaData.programmes.filter(prog => {
      // 1. Interest filter
      if (this.selectedInterest !== "all" && prog.discipline !== this.selectedInterest) {
        return false;
      }
      // 2. Level filter
      if (this.selectedLevel !== "all") {
        if (this.selectedLevel === "pg" && prog.degreeLevel !== "pg" && prog.degreeLevel !== "exec") return false;
        if (this.selectedLevel === "ug" && prog.degreeLevel !== "ug") return false;
        if (this.selectedLevel === "exec" && prog.degreeLevel !== "exec") return false;
      }
      // 3. Field sub-filter
      if (this.selectedField !== "all") {
        const textToSearch = (prog.specialisation + " " + prog.title + " " + (prog.description || "")).toLowerCase();
        if (!textToSearch.includes(this.selectedField.toLowerCase())) {
          return false;
        }
      }
      // 4. Specialisation filter
      if (this.selectedSpec !== "all") {
        const specToSearch = (prog.specialisation + " " + prog.title).toLowerCase();
        if (!specToSearch.includes(this.selectedSpec.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  },

  getInterestLabel(key) {
    const map = {
      tech: "Technology & Computing",
      business: "Business & Management",
      data: "Data Science & AI",
      commerce: "Commerce & FinTech",
      healthcare: "Healthcare Administration",
      all: "All Interests"
    };
    return map[key] || "All Interests";
  },

  getFieldLabel(key) {
    const map = {
      all: "All Areas",
      software: "Software Development",
      cloud: "Cloud & Infrastructure",
      ai: "Artificial Intelligence",
      strategy: "Strategic Leadership",
      marketing: "Marketing & Strategy",
      finance: "Corporate Finance",
      hr: "HR Leadership",
      ml: "Machine Learning & NLP",
      analytics: "Business Analytics",
      fintech: "FinTech & Banking",
      taxation: "Taxation & Audit",
      hospital: "Hospital Operations",
      quality: "Healthcare Quality & NABH"
    };
    return map[key] || key;
  },

  getLevelLabel(key) {
    const map = {
      all: "All Degree Levels",
      ug: "Undergraduate (UG)",
      pg: "Postgraduate (PG)",
      exec: "Executive Track"
    };
    return map[key] || key;
  },

  getSpecLabel(key) {
    if (key === "all") return "All Specialisations";
    return key;
  },

  renderPathwayVisual() {
    return `
      <div class="discover-pathway-visual" role="navigation" aria-label="Selected Pathway Breadcrumbs">
        <button class="pathway-visual-node ${this.currentStep === 1 ? 'is-active' : ''}" onclick="EduviaDiscover.goToStep(1)">
          <span class="pathway-node-step">1. Interest</span>
          <span class="pathway-node-val">${this.getInterestLabel(this.selectedInterest)}</span>
        </button>
        <span class="pathway-visual-arrow">→</span>
        <button class="pathway-visual-node ${this.currentStep === 2 ? 'is-active' : ''}" onclick="EduviaDiscover.goToStep(2)">
          <span class="pathway-node-step">2. Field</span>
          <span class="pathway-node-val">${this.getFieldLabel(this.selectedField)}</span>
        </button>
        <span class="pathway-visual-arrow">→</span>
        <button class="pathway-visual-node ${this.currentStep === 3 ? 'is-active' : ''}" onclick="EduviaDiscover.goToStep(3)">
          <span class="pathway-node-step">3. Degree</span>
          <span class="pathway-node-val">${this.getLevelLabel(this.selectedLevel)}</span>
        </button>
        <span class="pathway-visual-arrow">→</span>
        <button class="pathway-visual-node ${this.currentStep === 4 ? 'is-active' : ''}" onclick="EduviaDiscover.goToStep(4)">
          <span class="pathway-node-step">4. Specialisation</span>
          <span class="pathway-node-val">${this.getSpecLabel(this.selectedSpec)}</span>
        </button>
        <span class="pathway-visual-arrow">→</span>
        <button class="pathway-visual-node ${this.currentStep === 5 ? 'is-active' : ''}" onclick="EduviaDiscover.goToStep(5)">
          <span class="pathway-node-step">5. Programmes</span>
          <span class="pathway-node-val">${this.getMatchingProgrammes().length} Available</span>
        </button>
      </div>
    `;
  },

  renderBuilder() {
    const container = document.getElementById("discover-builder-container");
    if (!container) return;

    let stepHtml = "";

    if (this.currentStep === 1) {
      stepHtml = `
        <div class="builder-step-prompt">
          <span class="label-caps text-primary block mb-1">Step 01 of 05</span>
          <h3 class="builder-step-title">What interests you most?</h3>
          <p class="builder-step-sub">Select an academic discipline supported by verified programme curricula.</p>
        </div>
        <div class="builder-cards-grid">
          <div class="builder-selectable-card ${this.selectedInterest === 'tech' ? 'is-selected' : ''}" onclick="EduviaDiscover.setInterest('tech')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setInterest('tech')" role="button" tabindex="0" aria-pressed="${this.selectedInterest === 'tech'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">terminal</span></div>
            <div>
              <h4 class="builder-card-heading">Technology & Computing</h4>
              <p class="builder-card-sub">Software development, cloud architecture, and systems engineering</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedInterest === 'business' ? 'is-selected' : ''}" onclick="EduviaDiscover.setInterest('business')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setInterest('business')" role="button" tabindex="0" aria-pressed="${this.selectedInterest === 'business'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">domain</span></div>
            <div>
              <h4 class="builder-card-heading">Business & Management</h4>
              <p class="builder-card-sub">Executive leadership, strategy, marketing, operations, and commerce</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedInterest === 'data' ? 'is-selected' : ''}" onclick="EduviaDiscover.setInterest('data')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setInterest('data')" role="button" tabindex="0" aria-pressed="${this.selectedInterest === 'data'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">analytics</span></div>
            <div>
              <h4 class="builder-card-heading">Data Science & AI</h4>
              <p class="builder-card-sub">Statistical modeling, predictive analytics, deep learning, and NLP</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedInterest === 'commerce' ? 'is-selected' : ''}" onclick="EduviaDiscover.setInterest('commerce')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setInterest('commerce')" role="button" tabindex="0" aria-pressed="${this.selectedInterest === 'commerce'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">payments</span></div>
            <div>
              <h4 class="builder-card-heading">Commerce & FinTech</h4>
              <p class="builder-card-sub">Financial markets, taxation, corporate accounting, IFRS, and digital banking</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedInterest === 'healthcare' ? 'is-selected' : ''}" onclick="EduviaDiscover.setInterest('healthcare')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setInterest('healthcare')" role="button" tabindex="0" aria-pressed="${this.selectedInterest === 'healthcare'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">local_hospital</span></div>
            <div>
              <h4 class="builder-card-heading">Healthcare Administration</h4>
              <p class="builder-card-sub">Hospital operations, NABH quality frameworks, and clinical management</p>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentStep === 2) {
      // Step 2: Focus Area / Subfield
      const subFieldsByInterest = {
        tech: [
          { key: "all", name: "All Computing Disciplines", sub: "Explore full software, cloud & AI spectrum" },
          { key: "software", name: "Software Development", sub: "Full-stack web, OOP, algorithms, and application engineering" },
          { key: "cloud", name: "Cloud & Infrastructure", sub: "Cloud platforms (AWS/GCP), DevOps, and distributed systems" },
          { key: "ai", name: "Artificial Intelligence", sub: "Machine learning fundamentals and intelligent systems" }
        ],
        business: [
          { key: "all", name: "All Management Disciplines", sub: "General leadership and cross-functional operations" },
          { key: "strategy", name: "Strategic Leadership", sub: "Enterprise growth, corporate governance, and decision frameworks" },
          { key: "marketing", name: "Marketing & Digital Growth", sub: "Brand strategy, consumer insights, and international business" },
          { key: "finance", name: "Finance & FinTech Leadership", sub: "Valuation, financial management, and analytics" }
        ],
        data: [
          { key: "all", name: "All Data Disciplines", sub: "Full data science lifecycle and intelligent systems" },
          { key: "ml", name: "Machine Learning & NLP", sub: "Supervised/unsupervised models, transformers, and neural networks" },
          { key: "analytics", name: "Business Analytics & Big Data", sub: "Applied statistics, predictive metrics, and Python pipelines" }
        ],
        commerce: [
          { key: "all", name: "All Commerce Disciplines", sub: "Comprehensive accounting and financial practice" },
          { key: "fintech", name: "FinTech & Digital Markets", sub: "Algorithmic risk modeling, blockchain, and digital banking" },
          { key: "taxation", name: "Taxation, Audit & IFRS", sub: "Direct/indirect taxation (GST), audit, and ACCA paper mapping" }
        ],
        healthcare: [
          { key: "all", name: "All Healthcare Disciplines", sub: "Comprehensive healthcare administration" },
          { key: "hospital", name: "Hospital Operations", sub: "Clinical workflows, facility architecture, and bed logistics" },
          { key: "quality", name: "Quality & Health Informatics", sub: "NABH compliance auditing and medical information systems" }
        ]
      };

      const options = subFieldsByInterest[this.selectedInterest] || [
        { key: "all", name: "All Areas", sub: "Explore all available academic areas" }
      ];

      stepHtml = `
        <div class="builder-step-prompt">
          <span class="label-caps text-primary block mb-1">Step 02 of 05</span>
          <h3 class="builder-step-title">Which academic focus area?</h3>
          <p class="builder-step-sub">Choose a focus area within ${this.getInterestLabel(this.selectedInterest)}.</p>
        </div>
        <div class="builder-cards-grid">
          ${options.map(opt => `
            <div class="builder-selectable-card ${this.selectedField === opt.key ? 'is-selected' : ''}" onclick="EduviaDiscover.setField('${opt.key}')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setField('${opt.key}')" role="button" tabindex="0" aria-pressed="${this.selectedField === opt.key}">
              <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">category</span></div>
              <div>
                <h4 class="builder-card-heading">${opt.name}</h4>
                <p class="builder-card-sub">${opt.sub}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (this.currentStep === 3) {
      // Step 3: Target Degree Level
      stepHtml = `
        <div class="builder-step-prompt">
          <span class="label-caps text-primary block mb-1">Step 03 of 05</span>
          <h3 class="builder-step-title">Which degree level?</h3>
          <p class="builder-step-sub">Select undergraduate, postgraduate, or explore both.</p>
        </div>
        <div class="builder-cards-grid">
          <div class="builder-selectable-card ${this.selectedLevel === 'all' ? 'is-selected' : ''}" onclick="EduviaDiscover.setLevel('all')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setLevel('all')" role="button" tabindex="0" aria-pressed="${this.selectedLevel === 'all'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">layers</span></div>
            <div>
              <h4 class="builder-card-heading">All Degree Levels</h4>
              <p class="builder-card-sub">Show both Bachelor's and Master's degrees</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedLevel === 'ug' ? 'is-selected' : ''}" onclick="EduviaDiscover.setLevel('ug')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setLevel('ug')" role="button" tabindex="0" aria-pressed="${this.selectedLevel === 'ug'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">school</span></div>
            <div>
              <h4 class="builder-card-heading">Undergraduate (UG)</h4>
              <p class="builder-card-sub">3-Year Bachelor's Degrees (BBA, BCA, B.Com)</p>
            </div>
          </div>

          <div class="builder-selectable-card ${this.selectedLevel === 'pg' ? 'is-selected' : ''}" onclick="EduviaDiscover.setLevel('pg')" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setLevel('pg')" role="button" tabindex="0" aria-pressed="${this.selectedLevel === 'pg'}">
            <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">workspace_premium</span></div>
            <div>
              <h4 class="builder-card-heading">Postgraduate (PG)</h4>
              <p class="builder-card-sub">2-Year Master's Degrees (MBA, MCA, M.Sc, M.Com, MHA)</p>
            </div>
          </div>
        </div>
      `;
    } else if (this.currentStep === 4) {
      // Step 4: Specialisation / Curriculum Track
      // Dynamically extract real specialisations matching interest and level
      const matchingProgs = (EduviaData.programmes || []).filter(p => {
        if (this.selectedInterest !== "all" && p.discipline !== this.selectedInterest) return false;
        if (this.selectedLevel !== "all") {
          if (this.selectedLevel === "pg" && p.degreeLevel !== "pg" && p.degreeLevel !== "exec") return false;
          if (this.selectedLevel === "ug" && p.degreeLevel !== "ug") return false;
        }
        return true;
      });

      const specOptions = [{ key: "all", name: "All Available Specialisations", sub: "Explore all elective tracks" }];
      
      matchingProgs.forEach(p => {
        if (p.specialisation) {
          specOptions.push({
            key: p.specialisation,
            name: p.title.replace('Online ', ''),
            sub: p.specialisation
          });
        }
      });

      stepHtml = `
        <div class="builder-step-prompt">
          <span class="label-caps text-primary block mb-1">Step 04 of 05</span>
          <h3 class="builder-step-title">Which specialisation connects to your direction?</h3>
          <p class="builder-step-sub">Select from documented elective curricula offered by recognized universities.</p>
        </div>
        <div class="builder-cards-grid">
          ${specOptions.map(opt => `
            <div class="builder-selectable-card ${this.selectedSpec === opt.key ? 'is-selected' : ''}" data-spec-key="${opt.key}" onclick="EduviaDiscover.setSpec(this.dataset.specKey)" onkeydown="if(event.key==='Enter'||event.key===' ')EduviaDiscover.setSpec(this.dataset.specKey)" role="button" tabindex="0" aria-pressed="${this.selectedSpec === opt.key}">
              <div class="builder-card-top-icon"><span class="material-symbols-outlined text-[20px]">tune</span></div>
              <div>
                <h4 class="builder-card-heading">${opt.name}</h4>
                <p class="builder-card-sub">${opt.sub}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (this.currentStep === 5) {
      // Step 5: Pathway Complete Overview
      const matchCount = this.getMatchingProgrammes().length;
      stepHtml = `
        <div class="builder-step-prompt">
          <span class="label-caps text-primary block mb-1">Step 05 of 05 • Exploration Complete</span>
          <h3 class="builder-step-title">Explore Your Matching Programmes</h3>
          <p class="builder-step-sub">
            We found <strong>${matchCount}</strong> accredited ${matchCount === 1 ? 'programme' : 'programmes'} matching your exact pathway selections below.
          </p>
        </div>
        <div class="p-4 bg-surface-tinted border border-border-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold text-secondary uppercase block mb-1">Current Pathway Filter:</span>
            <span class="text-xs text-text-secondary">
              ${this.getInterestLabel(this.selectedInterest)} → ${this.getFieldLabel(this.selectedField)} → ${this.getLevelLabel(this.selectedLevel)} → ${this.getSpecLabel(this.selectedSpec)}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-outline btn-sm" onclick="EduviaDiscover.resetBuilder()">
              <span class="material-symbols-outlined text-[14px]">refresh</span>
              <span>Reset Filters</span>
            </button>
            <button class="btn btn-primary btn-sm" onclick="document.getElementById('discover-results-panel').scrollIntoView({behavior: 'smooth'})">
              <span>View ${matchCount} Programmes ↓</span>
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="discover-builder-card">
        ${this.renderPathwayVisual()}

        <div class="builder-stepper-header">
          <div class="builder-step-indicator" role="navigation" aria-label="Step progress">
            <span class="step-pill ${this.currentStep === 1 ? 'active' : (this.currentStep > 1 ? 'completed' : '')}" onclick="EduviaDiscover.goToStep(1)" style="cursor:pointer;" title="Step 1: Interest">1</span>
            <span class="text-text-muted text-xs">→</span>
            <span class="step-pill ${this.currentStep === 2 ? 'active' : (this.currentStep > 2 ? 'completed' : '')}" onclick="EduviaDiscover.goToStep(2)" style="cursor:pointer;" title="Step 2: Field">2</span>
            <span class="text-text-muted text-xs">→</span>
            <span class="step-pill ${this.currentStep === 3 ? 'active' : (this.currentStep > 3 ? 'completed' : '')}" onclick="EduviaDiscover.goToStep(3)" style="cursor:pointer;" title="Step 3: Level">3</span>
            <span class="text-text-muted text-xs">→</span>
            <span class="step-pill ${this.currentStep === 4 ? 'active' : (this.currentStep > 4 ? 'completed' : '')}" onclick="EduviaDiscover.goToStep(4)" style="cursor:pointer;" title="Step 4: Specialisation">4</span>
            <span class="text-text-muted text-xs">→</span>
            <span class="step-pill ${this.currentStep === 5 ? 'active' : ''}" onclick="EduviaDiscover.goToStep(5)" style="cursor:pointer;" title="Step 5: Results">5</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="EduviaDiscover.resetBuilder()" title="Reset selections">
            <span class="material-symbols-outlined text-[14px]">refresh</span>
            <span>Reset Pathway</span>
          </button>
        </div>

        <div class="builder-step-content">
          ${stepHtml}
        </div>

        <div class="builder-nav-footer">
          <div>
            ${this.currentStep > 1 ? `
              <button class="btn btn-outline btn-sm" onclick="EduviaDiscover.goToStep(${this.currentStep - 1})">
                <span>← Previous Step</span>
              </button>
            ` : '<span class="text-xs text-text-muted">Select an option to proceed</span>'}
          </div>
          <div>
            ${this.currentStep < 5 ? `
              <button class="btn btn-primary btn-sm" onclick="EduviaDiscover.goToStep(${this.currentStep + 1})">
                <span>Next Step →</span>
              </button>
            ` : `
              <button class="btn btn-primary btn-sm" onclick="document.getElementById('discover-results-panel').scrollIntoView({behavior: 'smooth'})">
                <span>View Matching Programmes ↓</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderLiveResults() {
    const resultsContainer = document.getElementById("discover-results-panel");
    if (!resultsContainer) return;

    const matches = this.getMatchingProgrammes();
    const count = matches.length;

    this.updateCompareTrayCount();

    if (count === 0) {
      resultsContainer.innerHTML = `
        <div class="discover-results-container">
          <div class="p-8 text-center bg-white border border-border-card max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-4xl text-primary block mb-2">filter_alt_off</span>
            <h3 class="font-headline font-bold text-lg text-secondary mb-1">NO PROGRAMMES FOUND</h3>
            <p class="text-xs text-text-secondary leading-relaxed mb-4">
              Try changing one of your selections or explore all programmes across accredited universities.
            </p>
            <div class="flex items-center justify-center gap-3">
              <button class="btn btn-primary btn-sm" onclick="EduviaDiscover.resetBuilder()">
                <span>Clear Selections</span>
              </button>
              <a href="programmes.html" class="btn btn-outline btn-sm">
                <span>Browse All Programmes</span>
              </a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="discover-results-container" id="programmes-results-section">
        <div class="discover-results-header">
          <div>
            <span class="label-caps text-primary block mb-0.5">Your Explore Results</span>
            <h3 class="font-headline font-bold text-lg text-secondary">
              ${count} ${count === 1 ? 'PROGRAMME MATCHES' : 'PROGRAMMES MATCH'} YOUR SELECTED PATHWAY
            </h3>
            <p class="text-xs text-text-secondary">
              Directly catalogued from UGC-DEB accredited universities. No automated predictions or match percentages.
            </p>
          </div>
          <a href="programmes.html${this.selectedInterest !== 'all' ? `?discipline=${this.selectedInterest}` : ''}" class="btn btn-outline btn-sm">
            <span>Explore in Full Directory →</span>
          </a>
        </div>

        <div class="discover-results-grid">
          ${matches.map(prog => {
            const isCompared = (typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes)
              ? EduviaComparison.selectedProgrammes.includes(prog.id)
              : false;
            const u = EduviaData.getUniversityById(prog.universityId);

            return `
              <div class="programme-dossier-card ${isCompared ? 'is-selected-compare' : ''}">
                <div class="dossier-header">
                  <div class="dossier-univ-row">
                    <div class="dossier-logo-badge">${u ? u.logoText : prog.universityName.substring(0,3).toUpperCase()}</div>
                    <div class="dossier-univ-info">
                      <span class="dossier-univ-name">${prog.universityName}</span>
                      <span class="dossier-univ-location">${prog.location || (u ? u.location : 'India')}</span>
                    </div>
                  </div>
                  <h4 class="dossier-title">
                    <a href="programme.html?id=${prog.id}">${prog.title}</a>
                  </h4>
                  ${prog.specialisation ? `
                    <div class="dossier-spec-tag">
                      <span class="spec-label">Specialisation:</span>
                      <span class="spec-value">${prog.specialisation}</span>
                    </div>
                  ` : ''}
                </div>

                <div class="dossier-specs-matrix">
                  <div class="matrix-cell">
                    <span class="cell-k">Degree Level</span>
                    <span class="cell-v font-bold">${(prog.degreeLevel || 'PG').toUpperCase()}</span>
                  </div>
                  <div class="matrix-cell">
                    <span class="cell-k">Duration</span>
                    <span class="cell-v font-bold">${prog.duration}</span>
                  </div>
                  <div class="matrix-cell">
                    <span class="cell-k">Total Fee</span>
                    <span class="cell-v font-bold text-primary">₹${prog.totalFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="matrix-cell">
                    <span class="cell-k">Accreditation</span>
                    <span class="cell-v text-jade-deep font-semibold">${prog.accreditation}</span>
                  </div>
                </div>

                <div class="dossier-footer">
                  <div class="dossier-pricing-col">
                    <span class="pricing-label">No-Cost EMI</span>
                    <div class="pricing-val-wrap">
                      <span class="pricing-total">₹${prog.emiMonthly ? prog.emiMonthly.toLocaleString('en-IN') : Math.round(prog.totalFee/24).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                  <div class="dossier-actions-col">
                    <button class="btn ${isCompared ? 'btn-primary' : 'btn-outline'} btn-sm text-xs py-1 px-3" onclick="EduviaDiscover.toggleCompare('${prog.id}')" title="Compare this programme">
                      <span>${isCompared ? '✓ Compared' : '+ Compare'}</span>
                    </button>
                    <a href="programme.html?id=${prog.id}" class="btn btn-primary btn-sm text-xs py-1 px-3">
                      <span>View Programme →</span>
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  toggleCompare(progId) {
    if (typeof EduviaComparison !== "undefined" && EduviaComparison.toggleCompare) {
      EduviaComparison.toggleCompare(progId);
      this.renderLiveResults();
      this.updateCompareTrayCount();
    }
  },

  updateCompareTrayCount() {
    const trayCountEl = document.getElementById("discover-compare-tray-count");
    if (trayCountEl && typeof EduviaComparison !== "undefined" && EduviaComparison.selectedProgrammes) {
      trayCountEl.textContent = EduviaComparison.selectedProgrammes.length;
    }
  }
};

/**
 * EDUVIA RESOURCES & EDUCATION GUIDES MODULE (Phase 12)
 */
const EduviaResources = {
  activeCategory: "all",
  searchQuery: "",

  init() {
    const rootEl = document.getElementById("resources-directory-grid");
    if (!rootEl && !document.querySelector(".resources-hero-section")) return;

    // Read URL parameters
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get("topic") || params.get("category");
    const queryParam = params.get("q") || params.get("search");
    const guideParam = params.get("guide") || params.get("id");

    if (catParam) {
      this.activeCategory = catParam.toLowerCase();
    }
    if (queryParam) {
      this.searchQuery = queryParam.trim();
      const inputEl = document.getElementById("resources-search-input");
      if (inputEl) inputEl.value = this.searchQuery;
    }

    // Attach search listener
    const searchInput = document.getElementById("resources-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.search(e.target.value);
      });
    }

    const searchForm = document.getElementById("resources-search-form");
    if (searchForm) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (searchInput) this.search(searchInput.value);
      });
    }

    // Initialize FAQ accordions
    this.initFaq();

    // Render resources directory
    this.renderResources();
    this.updateTopicButtons();

    // Auto-open guide modal if specified in URL
    if (guideParam) {
      this.openGuideModal(guideParam);
    }
  },

  setCategory(categoryKey) {
    this.activeCategory = categoryKey || "all";
    this.updateUrl();
    this.updateTopicButtons();
    this.renderResources();
  },

  search(query) {
    this.searchQuery = (query || "").trim();
    this.updateUrl();
    this.renderResources();
    this.updateClearBtn();
  },

  clearFilters() {
    this.activeCategory = "all";
    this.searchQuery = "";
    const searchInput = document.getElementById("resources-search-input");
    if (searchInput) searchInput.value = "";
    this.updateUrl();
    this.updateTopicButtons();
    this.renderResources();
  },

  updateUrl() {
    const params = new URLSearchParams();
    if (this.activeCategory && this.activeCategory !== "all") {
      params.set("topic", this.activeCategory);
    }
    if (this.searchQuery) {
      params.set("q", this.searchQuery);
    }
    const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", newQuery);
  },

  updateTopicButtons() {
    const buttons = document.querySelectorAll(".topic-filter-btn");
    buttons.forEach((btn) => {
      const topic = btn.getAttribute("data-topic");
      if (topic === this.activeCategory) {
        btn.classList.add("is-active");
      } else {
        btn.classList.remove("is-active");
      }
    });
    this.updateClearBtn();
  },

  updateClearBtn() {
    const clearBtn = document.getElementById("topic-clear-btn");
    if (clearBtn) {
      if (this.activeCategory !== "all" || this.searchQuery.length > 0) {
        clearBtn.style.display = "inline-flex";
      } else {
        clearBtn.style.display = "none";
      }
    }
  },

  initFaq() {
    const faqItems = document.querySelectorAll(".resource-faq-item");
    faqItems.forEach((item) => {
      const trigger = item.querySelector(".resource-faq-trigger");
      if (trigger) {
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");
          faqItems.forEach((i) => i.classList.remove("is-open"));
          if (!isOpen) {
            item.classList.add("is-open");
          }
        });
      }
    });
  },

  getFilteredResources() {
    if (!EduviaData || !EduviaData.resources) return [];
    let list = [...EduviaData.resources];

    // Filter by topic
    if (this.activeCategory && this.activeCategory !== "all") {
      list = list.filter((r) => r.category === this.activeCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter((r) => {
        const titleMatch = r.title && r.title.toLowerCase().includes(q);
        const descMatch = r.description && r.description.toLowerCase().includes(q);
        const catMatch = (r.categoryLabel || r.category || "").toLowerCase().includes(q);
        const contentMatch = r.content && r.content.toLowerCase().includes(q);
        const kwMatch = r.keywords && r.keywords.some((k) => k.toLowerCase().includes(q));
        return titleMatch || descMatch || catMatch || contentMatch || kwMatch;
      });
    }

    return list;
  },

  renderResources() {
    const gridEl = document.getElementById("resources-directory-grid");
    const countEl = document.getElementById("resources-count-badge");
    if (!gridEl) return;

    const resources = this.getFilteredResources();

    if (countEl) {
      countEl.textContent = `${resources.length} Guide${resources.length === 1 ? "" : "s"}`;
    }

    if (resources.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center; background: var(--card-light); border: 1.5px solid var(--border-card);">
          <span class="material-symbols-outlined text-[36px] text-outline mb-2" style="display:block;">manage_search</span>
          <h3 class="font-headline font-bold text-base text-secondary uppercase mb-1">No Matching Guides Found</h3>
          <p class="text-xs text-on-surface-variant max-w-md mx-auto mb-4 leading-relaxed">
            No education guides match "${this.searchQuery ? this.searchQuery : this.activeCategory}". Try adjusting your keywords or clearing the active filters.
          </p>
          <button class="btn btn-outline btn-sm" onclick="EduviaResources.clearFilters()">
            <span>Reset All Filters</span>
          </button>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = resources
      .map((r) => {
        return `
        <article class="resource-editorial-card" data-id="${r.id}">
          <div class="resource-card-top">
            <span class="resource-cat-badge">${r.categoryLabel || r.category}</span>
            <h3 class="resource-card-title">${r.title}</h3>
            <p class="resource-card-desc">${r.description}</p>
          </div>

          <div>
            ${
              r.source
                ? `
              <div class="resource-card-source">
                <span class="material-symbols-outlined text-[13px] text-outline">verified</span>
                <span>Source: ${r.source}</span>
              </div>
            `
                : ""
            }

            <div class="resource-card-footer">
              <button class="btn btn-outline btn-sm text-xs py-1 px-2.5" onclick="EduviaResources.openGuideModal('${r.id}')">
                <span>Read Guide</span>
                <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>

              ${
                r.actionUrl && r.actionText
                  ? `
                <a href="${r.actionUrl}" class="text-[11px] font-bold uppercase tracking-wider text-sapphire hover:underline flex items-center gap-1">
                  <span>${r.actionText}</span>
                  <span class="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              `
                  : ""
              }
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  },

  openGuideModal(guideId) {
    const guide = EduviaData.getResourceById(guideId);
    if (!guide) return;

    const modalTitle = document.getElementById("generic-modal-title");
    const modalBody = document.getElementById("generic-modal-body");

    if (modalTitle) {
      modalTitle.textContent = guide.title;
    }

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 border-b pb-3" style="border-color: var(--border-card);">
            <span class="badge badge-teal">${guide.categoryLabel || guide.category}</span>
            ${guide.source ? `<span class="text-xs text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">verified</span> <strong>Ref:</strong> ${guide.source}</span>` : ""}
          </div>

          <p class="text-sm text-secondary font-bold leading-relaxed">
            ${guide.description}
          </p>

          <div class="text-xs text-on-surface-variant leading-relaxed p-4 bg-surface-tinted border border-border-card space-y-3">
            <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-primary-dark">Official Guidance & Analysis</h4>
            <p>${guide.content}</p>
          </div>

          <div class="pt-2 flex items-center justify-between flex-wrap gap-3 border-t" style="border-color: var(--border-card);">
            ${guide.actionUrl ? `
              <a href="${guide.actionUrl}" class="btn btn-primary btn-sm">
                <span>${guide.actionText || 'Explore Next Step'}</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            ` : '<div></div>'}
            <button class="btn btn-outline btn-sm" onclick="EduviaUI.closeAllModals()">
              <span>Close Guide</span>
            </button>
          </div>
        </div>
      `;
    }

    EduviaUI.openModal("generic-detail-modal");
  }
};



// Global shorthand proxies for inline HTML onclick handlers
function filterByDiscipline(discId) {
  const tabBtns = document.querySelectorAll(".catalog-tab-row .tab-btn");
  if (tabBtns && tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute("data-disc") === discId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    if (typeof EduviaApp !== "undefined" && EduviaApp.renderHomepageProgrammes) {
      EduviaApp.renderHomepageProgrammes(discId, true);
    }
  }
  if (typeof EduviaFilters !== "undefined" && typeof EduviaFilters.setDiscipline === "function") {
    EduviaFilters.setDiscipline(discId);
  }
}
function resetFilters() { EduviaFilters.reset(); }
function toggleUniversityCompare(id) { EduviaComparison.toggleCompare(id); }
function clearAllCompare() { EduviaComparison.clearAll(); }
function openComparisonMatrixModal() { EduviaComparison.openComparisonMatrixModal(); }
function openUniversityDetailModal(id) { EduviaUI.openUniversityDetailModal(id); }
function openProgrammeDetailModal(id) { EduviaUI.openProgrammeDetailModal(id); }
function openCounselingModal(subject) { EduviaUI.openCounselingModal(subject); }
function toggleShortlist(id) { EduviaUI.toggleShortlist(id); }
function openShortlistDrawer() { EduviaUI.openShortlistDrawer(); }
function closeAllModals() { EduviaUI.closeAllModals(); }
function openSearchModal() { EduviaSearch.open(); }
function toggleMobileMenu(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (typeof EduviaNavigation !== "undefined" && EduviaNavigation.toggleMobileDrawer) {
    EduviaNavigation.toggleMobileDrawer();
  } else {
    const d = document.getElementById("mobile-nav-drawer");
    if (d) d.classList.toggle("open");
  }
}
function openMobileMenu(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (typeof EduviaNavigation !== "undefined" && EduviaNavigation.openMobileDrawer) {
    EduviaNavigation.openMobileDrawer();
  } else {
    const d = document.getElementById("mobile-nav-drawer");
    if (d) d.classList.add("open");
  }
}
function closeMobileMenu(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (typeof EduviaNavigation !== "undefined" && EduviaNavigation.closeMobileDrawer) {
    EduviaNavigation.closeMobileDrawer();
  } else {
    const d = document.getElementById("mobile-nav-drawer");
    if (d) d.classList.remove("open");
  }
}

// DOMContentLoaded Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  EduviaApp.init();
});
