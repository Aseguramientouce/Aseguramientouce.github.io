/* =========================================================
   FACULTAD DE CULTURA FÍSICA — UCE
   Script general del sitio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader inicial ---------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 350);
    });
    // seguro por si "load" ya ocurrió
    setTimeout(() => loader.classList.add('hide'), 1800);
  }

  /* ---------- Header: cambia de transparente a sólido ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add('solid');
    else header.classList.remove('solid');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader);

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ---------- Botón volver arriba ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 480);
    });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Barras de estadísticas animadas ---------- */
  const statBars = document.querySelectorAll('.stat-bar-fill');
  if (statBars.length && 'IntersectionObserver' in window) {
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.value || '0';
          entry.target.style.width = target + '%';
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statBars.forEach(bar => statIO.observe(bar));
  }

  /* ---------- Contador de visitantes (simulado) ---------- */
  const counterEl = document.getElementById('visitCount');
  if (counterEl) {
    const KEY = 'fcf_aseg_calidad_visitas';
    let count = parseInt(localStorageSafeGet(KEY), 10);
    if (isNaN(count)) count = 4820 + Math.floor(Math.random() * 60);
    count += 1;
    localStorageSafeSet(KEY, count);
    let shown = 0;
    const step = Math.max(1, Math.floor(count / 60));
    const tick = setInterval(() => {
      shown += step;
      if (shown >= count) { shown = count; clearInterval(tick); }
      counterEl.textContent = shown.toLocaleString('es-EC');
    }, 20);
  }
  function localStorageSafeGet(key){
    try { return localStorage.getItem(key); } catch(e){ return null; }
  }
  function localStorageSafeSet(key, val){
    try { localStorage.setItem(key, val); } catch(e){ /* modo privado: se ignora */ }
  }

  /* ---------- Filtros de galería ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'todos' || item.dataset.category === filter;
        item.classList.toggle('hidden-item', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox && galleryItems.length) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    let currentIndex = 0;
    let visibleItems = [];

    function refreshVisible(){
      visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hidden-item'));
    }

    function openLightbox(item){
      refreshVisible();
      currentIndex = visibleItems.indexOf(item);
      showCurrent();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function showCurrent(){
      const item = visibleItems[currentIndex];
      if (!item) return;
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.alt;
    }
    function closeLightbox(){
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });
    lbClose && lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lbPrev && lbPrev.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      showCurrent();
    });
    lbNext && lbNext.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      showCurrent();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lbNext.click();
      if (e.key === 'ArrowLeft') lbPrev.click();
    });
  }

  /* ---------- Formulario de contacto (demostrativo) ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      if (msg) {
        msg.textContent = '¡Gracias! Tu mensaje fue registrado. El departamento te contactará pronto.';
        msg.classList.add('show');
      }
      contactForm.reset();
    });
  }

});
