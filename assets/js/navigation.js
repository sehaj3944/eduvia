/**
 * EDUVIA NAVIGATION SYSTEM (assets/js/navigation.js)
 * High-performance, accessible navigation controller for Eduvia.
 * Manages desktop mega-menus (hover + click + keyboard), mobile off-canvas drawer,
 * accordion menus, active page state detection, and sticky header behavior.
 */

const EduviaNavigation = {
  isInitialized: false,
  activeDropdown: null,
  mobileDrawerOpen: false,

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.setupDesktopMegaMenus();
    this.setupMobileDrawer();
    this.setupStickyHeader();
    this.setupActiveStates();
    this.setupKeyboardShortcuts();
    this.updateCompareCounter();
  },

  /**
   * Desktop Mega-Menus (Explore, Compare, Discover, Resources)
   * Supports hover, click-to-toggle, keyboard accessibility, and outside clicks.
   */
  setupDesktopMegaMenus() {
    const dropdownItems = document.querySelectorAll(".nav-item-dropdown");
    let closeTimeout = null;

    dropdownItems.forEach(item => {
      const trigger = item.querySelector(".nav-dropdown-trigger");
      const dropdown = item.querySelector(".nav-dropdown");
      if (!trigger || !dropdown) return;

      // Mouse Enter (Hover)
      item.addEventListener("mouseenter", () => {
        if (window.innerWidth < 1024) return;
        clearTimeout(closeTimeout);
        this.openDropdown(item, trigger, dropdown);
      });

      // Mouse Leave
      item.addEventListener("mouseleave", () => {
        if (window.innerWidth < 1024) return;
        closeTimeout = setTimeout(() => {
          this.closeDropdown(item, trigger, dropdown);
        }, 120);
      });

      // Click to toggle
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains("is-open");
        if (isOpen) {
          this.closeDropdown(item, trigger, dropdown);
        } else {
          this.openDropdown(item, trigger, dropdown);
        }
      });

      // Keydown on trigger (Enter / Space / Down Arrow)
      trigger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          this.openDropdown(item, trigger, dropdown);
          const firstLink = dropdown.querySelector("a, button");
          if (firstLink) firstLink.focus();
        } else if (e.key === "Escape") {
          this.closeDropdown(item, trigger, dropdown);
        }
      });

      // Escape key inside dropdown
      dropdown.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeDropdown(item, trigger, dropdown);
          trigger.focus();
        }
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-item-dropdown")) {
        this.closeAllDropdowns();
      }
    });
  },

  openDropdown(item, trigger, dropdown) {
    this.closeAllDropdowns(item);
    item.classList.add("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    this.activeDropdown = item;
  },

  closeDropdown(item, trigger, dropdown) {
    item.classList.remove("is-open");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (this.activeDropdown === item) this.activeDropdown = null;
  },

  closeAllDropdowns(exceptItem = null) {
    document.querySelectorAll(".nav-item-dropdown").forEach(item => {
      if (item !== exceptItem) {
        item.classList.remove("is-open");
        const trigger = item.querySelector(".nav-dropdown-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
    if (!exceptItem) this.activeDropdown = null;
  },

  /**
   * Mobile Navigation Drawer & Accordions
   */
  setupMobileDrawer() {
    const toggleBtns = document.querySelectorAll(".mobile-menu-toggle, .mobile-drawer-toggle");
    const closeBtns = document.querySelectorAll(".mobile-drawer-close");
    const backdrop = document.querySelector(".mobile-nav-backdrop");

    toggleBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.toggleMobileDrawer();
      };
    });

    closeBtns.forEach(btn => {
      btn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.closeMobileDrawer();
      };
    });

    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        this.closeMobileDrawer();
      };
    }

    // Accordions inside Mobile Drawer (Only buttons or items with accordion content)
    const accordionHeaders = document.querySelectorAll(".mobile-accordion-header");
    accordionHeaders.forEach(header => {
      // If it's a direct anchor link with href, do not intercept click
      if (header.tagName.toLowerCase() === "a" || header.hasAttribute("href")) {
        return;
      }

      header.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const item = header.closest(".mobile-accordion-item");
        if (!item) return;

        const wasActive = item.classList.contains("active");

        // Close other accordions for single-focus 1-handed navigation
        document.querySelectorAll(".mobile-accordion-item").forEach(acc => {
          acc.classList.remove("active");
          const btn = acc.querySelector(".mobile-accordion-header");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (!wasActive) {
          item.classList.add("active");
          header.setAttribute("aria-expanded", "true");
        }
      };
    });

    // Close drawer on internal link click
    document.querySelectorAll(".mobile-nav-panel a").forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          // Standard page navigation - allow normal browser redirect
          this.closeMobileDrawer();
        } else if (href && href.startsWith("#")) {
          this.closeMobileDrawer();
        }
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileDrawer();
      }
    });
  },

  toggleMobileDrawer() {
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!drawer) return;
    const isCurrentlyOpen = drawer.classList.contains("open") || drawer.classList.contains("is-open") || this.mobileDrawerOpen;
    if (isCurrentlyOpen) {
      this.closeMobileDrawer();
    } else {
      this.openMobileDrawer();
    }
  },

  openMobileDrawer() {
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!drawer) return;

    drawer.classList.add("open", "is-open", "active");
    document.body.classList.add("nav-drawer-open");
    this.mobileDrawerOpen = true;

    const toggleBtns = document.querySelectorAll(".mobile-menu-toggle, .mobile-drawer-toggle");
    toggleBtns.forEach(btn => btn.setAttribute("aria-expanded", "true"));

    // Focus close button for accessibility
    const closeBtn = drawer.querySelector(".mobile-drawer-close");
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  },

  closeMobileDrawer() {
    const drawer = document.getElementById("mobile-nav-drawer");
    if (!drawer) return;

    drawer.classList.remove("open", "is-open", "active");
    document.body.classList.remove("nav-drawer-open");
    this.mobileDrawerOpen = false;

    const toggleBtns = document.querySelectorAll(".mobile-menu-toggle, .mobile-drawer-toggle");
    toggleBtns.forEach(btn => btn.setAttribute("aria-expanded", "false"));
  },

  /**
   * Sticky Header & Mobile Counseling Bar Slide-In Transitions
   */
  setupStickyHeader() {
    const header = document.querySelector(".site-header");
    const mobileBar = document.querySelector(".mobile-sticky-counseling-bar");
    if (!header && !mobileBar) return;

    let ticking = false;

    const onScroll = () => {
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > 20) {
          header.classList.add("is-scrolled");
        } else {
          header.classList.remove("is-scrolled");
        }
      }

      if (mobileBar) {
        if (scrollY > 80) {
          mobileBar.classList.add("is-visible");
        } else {
          mobileBar.classList.remove("is-visible");
        }
      }

      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();
  },

  /**
   * Active Navigation State Detection
   */
  setupActiveStates() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Desktop Nav Items
    document.querySelectorAll(".nav-item").forEach(item => {
      const href = item.getAttribute("href");
      const targetPage = item.getAttribute("data-page");

      if (targetPage && (currentPath === targetPage || currentPath.startsWith(targetPage.replace(".html", "")))) {
        item.classList.add("is-active");
      } else if (href && href.includes(currentPath) && currentPath !== "index.html") {
        item.classList.add("is-active");
      }
    });

    // Highlight Mega Menu category parents
    if (currentPath.includes("programmes") || currentPath.includes("programme") || currentPath.includes("universities") || currentPath.includes("university")) {
      const exploreTrigger = document.getElementById("nav-trigger-explore");
      if (exploreTrigger) exploreTrigger.closest(".nav-item").classList.add("is-active");
    } else if (currentPath.includes("compare")) {
      const compareTrigger = document.getElementById("nav-trigger-compare");
      if (compareTrigger) compareTrigger.closest(".nav-item").classList.add("is-active");
    } else if (currentPath.includes("discover")) {
      const discoverTrigger = document.getElementById("nav-trigger-discover");
      if (discoverTrigger) discoverTrigger.closest(".nav-item").classList.add("is-active");
    } else if (currentPath.includes("resources")) {
      const resourcesTrigger = document.getElementById("nav-trigger-resources");
      if (resourcesTrigger) resourcesTrigger.closest(".nav-item").classList.add("is-active");
    }
  },

  /**
   * Global Keyboard Shortcuts (Cmd+K / Ctrl+K)
   */
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (typeof EduviaSearch !== "undefined" && typeof EduviaSearch.open === "function") {
          EduviaSearch.open();
        } else if (typeof openSearchModal === "function") {
          openSearchModal();
        }
      }
    });
  },

  /**
   * Update active compare counter across navigation badges
   */
  updateCompareCounter() {
    let count = 0;
    if (typeof EduviaComparison !== "undefined") {
      const pCount = (EduviaComparison.selectedProgrammes && EduviaComparison.selectedProgrammes.length) || 0;
      const uCount = (EduviaComparison.selectedUniversities && EduviaComparison.selectedUniversities.length) || 0;
      count = pCount + uCount;
    }

    const navCountEl = document.getElementById("nav-compare-active-count");
    if (navCountEl) {
      navCountEl.textContent = count;
    }

    const topbarCountEl = document.getElementById("topbar-compare-count");
    if (topbarCountEl) {
      topbarCountEl.textContent = count;
    }
  }
};

// Global shortcuts for inline HTML handlers
window.toggleMobileMenu = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  EduviaNavigation.toggleMobileDrawer();
};
window.openMobileMenu = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  EduviaNavigation.openMobileDrawer();
};
window.closeMobileMenu = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  EduviaNavigation.closeMobileDrawer();
};

// Initialize navigation on DOM load
document.addEventListener("DOMContentLoaded", () => {
  EduviaNavigation.init();
});
