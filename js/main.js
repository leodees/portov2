    /* ─── THEME TOGGLE ─── */
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeBtn');
    const iconSun = document.getElementById('iconSun');
    const iconMoon = document.getElementById('iconMoon');

    function applyTheme(theme) {
      html.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
      } else {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
      }
    }

    // Load saved theme or system preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    themeBtn.addEventListener('click', () => {
      document.body.classList.add('theme-transitioning');
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 350);
    });

    /* ─── SCROLL PROGRESS BAR ─── */
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + '%';
    }, { passive: true });

    /* ─── BACK TO TOP ─── */
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ─── PAGE NAVIGATION ─── */
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    const pageLinks = document.querySelectorAll('.sidebar-nav a[data-page], a[data-page].btn');
    const pages = document.querySelectorAll('.page[data-page]');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav a[data-page]');

    function closeSidebar() {
      sidebar?.classList.remove('open');
      sidebarOverlay?.classList.remove('open');
      mobileSidebarBtn?.classList.remove('open');
    }

    function openSidebar() {
      sidebar?.classList.add('open');
      sidebarOverlay?.classList.add('open');
      mobileSidebarBtn?.classList.add('open');
    }

    mobileSidebarBtn?.addEventListener('click', () => {
      if (sidebar?.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
    sidebarOverlay?.addEventListener('click', closeSidebar);

    function observeFadeIns(root) {
      const scope = root || document;
      scope.querySelectorAll('.fade-in:not(.visible)').forEach(el => fadeObserver.observe(el));
    }

    function showPage(pageId) {
      pages.forEach(p => p.classList.toggle('active', p.dataset.page === pageId));
      sidebarNavLinks.forEach(a => a.classList.toggle('active', a.dataset.page === pageId));
      window.scrollTo({ top: 0, behavior: 'instant' });
      closeSidebar();
      const activePage = document.getElementById('page-' + pageId);
      if (activePage) observeFadeIns(activePage);
    }

    pageLinks.forEach(link => {
      link.addEventListener('click', e => {
        const pageId = link.dataset.page;
        if (!pageId) return;
        e.preventDefault();
        showPage(pageId);
      });
    });

    /* ─── FADE-IN ON SCROLL ─── */
    const fadeObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    observeFadeIns(document.getElementById('page-beranda'));

    /* ─── PROJECT SEARCH & FILTER ─── */
    const projectSearch = document.getElementById('projectSearch');
    const projectCategoryFilter = document.getElementById('projectCategoryFilter');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');
    const projectsEmpty = document.getElementById('projectsEmpty');

    function filterProjects() {
      const query = (projectSearch?.value || '').trim().toLowerCase();
      const category = projectCategoryFilter?.value || 'all';
      let visible = 0;
      projectCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchQuery = !query || text.includes(query);
        const matchCategory = category === 'all' || card.dataset.category === category;
        const show = matchQuery && matchCategory;
        card.style.display = show ? 'block' : 'none';
        if (show) visible++;
      });
      projectsEmpty?.classList.toggle('visible', visible === 0);
    }

    projectSearch?.addEventListener('input', filterProjects);
    projectCategoryFilter?.addEventListener('change', filterProjects);

    /* ─── LANGUAGE SWITCHER ─── */
    // Konten dalam dua bahasa — Bahasa Indonesia (ID) dan English (EN)
    const langBtn = document.getElementById('langBtn');
    let currentLang = 'ID';

    const translations = {
      ID: {
        navHome: 'Beranda',
        navAbout: 'Tentang',
        navProjects: 'Proyek',
        navContact: 'Kontak',
        badge: 'Tersedia untuk kolaborasi',
        heroDesc: 'Seorang pengembang perangkat lunak yang berfokus pada pengalaman pengguna dan arsitektur sistem yang bersih. Saya senang membangun produk yang bermakna.',
        cvBtn: 'Unduh CV',
        contactBtn: 'Hubungi Saya',
      },
      EN: {
        navHome: 'Home',
        navAbout: 'About',
        navProjects: 'Projects',
        navContact: 'Contact',
        badge: 'Open to collaboration',
        heroDesc: 'A software developer focused on user experience and clean system architecture. I love building products that make a difference.',
        cvBtn: 'Download CV',
        contactBtn: 'Contact Me',
      }
    };

    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'ID' ? 'EN' : 'ID';
      langBtn.textContent = currentLang;
      const t = translations[currentLang];
      document.querySelectorAll('.sidebar-nav a[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (!t[key]) return;
        const icon = el.querySelector('svg');
        el.replaceChildren(icon, document.createTextNode(' ' + t[key]));
      });
      const badgeSpan = document.querySelector('.hero-badge span:last-child');
      if (badgeSpan) badgeSpan.textContent = t.badge;
      const heroDesc = document.querySelector('.hero-desc');
      if (heroDesc) heroDesc.textContent = t.heroDesc;
      const cvBtn = document.querySelector('#page-beranda .btn-primary');
      if (cvBtn) {
        const label = cvBtn.querySelector('svg') ? cvBtn.lastChild : cvBtn;
        if (label && label.nodeType === 3) label.textContent = ' ' + t.cvBtn;
        else if (cvBtn.childNodes.length > 1) cvBtn.childNodes[cvBtn.childNodes.length - 1].textContent = ' ' + t.cvBtn;
      }
      const contactOutline = document.querySelector('#page-beranda a.btn-outline[data-page="kontak"]');
      if (contactOutline) contactOutline.textContent = t.contactBtn;
    });
