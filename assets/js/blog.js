/**
 * EDUVIA BLOG SYSTEM JAVASCRIPT (assets/js/blog.js)
 * High-performance, zero-dependency Vanilla JS for Table of Contents, Reading Progress & Category Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar Injection & Handler
  const isArticlePage = document.querySelector('.blog-article-page');
  if (isArticlePage) {
    let progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress-bar';
      document.body.appendChild(progressBar);
    }

    const updateReadingProgress = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrolled = (totalScroll / windowHeight) * 100;
        progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
      }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();
  }

  // 2. Table of Contents: Mobile Collapsible Toggle & Active ScrollSpy
  const tocNav = document.getElementById('article-toc');
  const tocToggleBtn = document.querySelector('.toc-toggle-btn');
  const tocLinks = document.querySelectorAll('.toc-link, .toc-list a');
  const articleSections = document.querySelectorAll('.article-prose section[id], .article-prose h2[id]');

  if (tocToggleBtn && tocNav) {
    tocToggleBtn.addEventListener('click', () => {
      const isExpanded = tocToggleBtn.getAttribute('aria-expanded') === 'true';
      tocToggleBtn.setAttribute('aria-expanded', !isExpanded);
      tocNav.classList.toggle('expanded');
    });
  }

  if (tocLinks.length > 0 && articleSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -65% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            const targetHref = link.getAttribute('href');
            if (targetHref === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    articleSections.forEach(section => sectionObserver.observe(section));

    // Smooth scroll and auto-close mobile TOC on link click
    tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (tocToggleBtn && window.innerWidth <= 1024) {
          tocToggleBtn.setAttribute('aria-expanded', 'false');
          tocNav.classList.remove('expanded');
        }
      });
    });
  }

  // 3. Category Filter Tabs on Blog Landing Page (blog/index.html)
  const categoryPills = document.querySelectorAll('.category-pill');
  const featuredCardWrapper = document.querySelector('.featured-article-card-wrapper');
  const articleItems = document.querySelectorAll('.blog-card-item');
  const articlesCountEl = document.getElementById('articles-count');

  if (categoryPills.length > 0) {
    categoryPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const selectedCategory = pill.getAttribute('data-category');
        let visibleCount = 0;

        // Check featured card
        if (featuredCardWrapper) {
          const featuredCard = featuredCardWrapper.querySelector('.featured-article-card');
          const featuredCategory = featuredCard ? (featuredCard.getAttribute('data-category') || '') : '';
          if (selectedCategory === 'all' || featuredCategory.includes(selectedCategory)) {
            featuredCardWrapper.style.display = 'block';
            visibleCount++;
          } else {
            featuredCardWrapper.style.display = 'none';
          }
        }

        // Check grid items
        articleItems.forEach(item => {
          const itemCategories = item.getAttribute('data-category') || '';
          if (selectedCategory === 'all' || itemCategories.includes(selectedCategory)) {
            item.style.display = 'block';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });

        if (articlesCountEl) {
          articlesCountEl.textContent = visibleCount;
        }
      });
    });
  }
});
