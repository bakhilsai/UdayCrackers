// Uday Crackers — Gen-Z Interactive Script
// Features:
// - Mobile nav drawer toggle
// - Hero spark canvas particles (perf-friendly)
// - Countdown timer
// - Product card sound effects
// - Sliders (deals/reviews)
// - Lazy masonry images enhancements
// - Festive popup (once per session)
// - Contact form feedback
// - Parallax + small performance tweaks
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const burger = $('.hamburger');
    const drawer = $('#mobileMenu');
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = !drawer.hasAttribute('hidden');
        if (open) drawer.setAttribute('hidden',''); else drawer.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', String(!open));
      });
      drawer.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
          drawer.setAttribute('hidden','');
          burger.setAttribute('aria-expanded','false');
        }
      });
    }

    // Smooth scroll + active link state
    $$('.nav-links a').forEach(a => a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const el = $(href);
      if (el) el.scrollIntoView({behavior:'smooth'});
      $$('.nav-links a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    }));

    // Year in footer
    const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear());

    // Festive popup (once per session)
    const popup = $('#festivePopup');
    if (popup && !sessionStorage.getItem('uday_popup_shown')) {
      try { popup.showModal?.(); sessionStorage.setItem('uday_popup_shown','1'); } catch {}
    }

    // Countdown to Diwali sale end (example: Nov 1 current year)
    const target = new Date(new Date().getFullYear(), 10, 1, 23, 59, 59); // Nov 1
    const box = $('#countdownTimer');
    function two(n){return n<10?`0${n}`:String(n)}
    function tick(){
      if (!box) return;
      const now = new Date();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff/86400000); diff-= d*86400000;
      const h = Math.floor(diff/3600000); diff-= h*3600000;
      const m = Math.floor(diff/60000); diff-= m*60000;
      const s = Math.floor(diff/1000);
      box.textContent = `${d}d ${two(h)}h ${two(m)}m ${two(s)}s`;
    }
    tick(); const t = setInterval(tick, 1000);

    // Hero spark canvas particles
    const canvas = $('#sparkCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d', { alpha: true });
      let w=canvas.width=canvas.offsetWidth, h=canvas.height=canvas.offsetHeight;
      const DPR = Math.min(2, window.devicePixelRatio||1);
      canvas.width = w*DPR; canvas.height = h*DPR; ctx.scale(DPR,DPR);
      let particles = [];
      const colors = ['#ffd166','#ff6b6b','#4dffb8','#a78bfa'];
      function spawn(){
        const x = Math.random()*w, y = Math.random()*h*0.6 + 10;
        const vx = (Math.random()-0.5)*0.6, vy = -Math.random()*1.2 - .3;
        const life = 60 + Math.random()*40;
        particles.push({x,y,vx,vy,life,c: colors[(Math.random()*colors.length)|0]});
        if (particles.length>220) particles.shift();
      }
      function step(){
        ctx.clearRect(0,0,w,h);
        particles.forEach(p=>{
          p.x+=p.vx; p.y+=p.vy; p.vy+=0.01; p.life-=1;
          ctx.globalAlpha = Math.max(0, p.life/100);
          ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,Math.PI*2); ctx.fill();
        });
        particles = particles.filter(p=>p.life>0);
        for(let i=0;i<4;i++) spawn();
        raf = requestAnimationFrame(step);
      }
      let raf = requestAnimationFrame(step);
      const ro = new ResizeObserver(entries => {
        const cr = entries[0].contentRect; w=cr.width; h=cr.height;
        canvas.width = w*DPR; canvas.height = h*DPR; ctx.scale(DPR,DPR);
      });
      ro.observe(canvas);
      document.addEventListener('visibilitychange',()=>{
        if (document.hidden){ cancelAnimationFrame(raf); }
        else { raf = requestAnimationFrame(step); }
      });
    }

    // Product card sound effects
    const audioCache = new Map();
    function play(src){
      if (!src) return;
      let a = audioCache.get(src);
      if (!a){ a = new Audio(src); audioCache.set(src, a); }
      a.currentTime = 0; a.volume = 0.6; a.play().catch(()=>{});
    }
    $$('.crack-btn').forEach(btn=> btn.addEventListener('click',()=> play(btn.getAttribute('data-sound'))));

    // Sound toggle demo (mute/unmute all cached sounds)
    const soundBtn = $('#soundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click',()=>{
        const pressed = soundBtn.getAttribute('aria-pressed') === 'true';
        soundBtn.setAttribute('aria-pressed', String(!pressed));
        audioCache.forEach(a=>{ a.muted = pressed ? false : true; });
      });
    }

    // Simple sliders (scroll-snap based with buttons)
    $$('[data-slider]').forEach(slider => {
      const slides = $('.slides', slider);
      const prev = $('.slide-nav.prev', slider);
      const next = $('.slide-nav.next', slider);
      if (!slides) return;
      const step = () => slides.clientWidth * 0.9;
      prev?.addEventListener('click', () => slides.scrollBy({left: -step(), behavior:'smooth'}));
      next?.addEventListener('click', () => slides.scrollBy({left: step(), behavior:'smooth'}));
      // touch inertia is native; no extra logic needed
    });

    // Masonry lightbox-ready: prevent default to allow later lightbox lib
    $$('.masonry .m-item').forEach(a => {
      a.addEventListener('click', e => {
        // Placeholder: keep href for external lightbox; no-op here
        e.preventDefault();
      });
    });

    // Contact form feedback
    const form = $('.contact-form');
    const note = $('#formNote');
    const ping = $('#formPing');
    ping?.addEventListener('click', () => {
      if (!form || !note) return;
      note.textContent = 'Thanks! We will reach out on WhatsApp shortly.';
      setTimeout(()=> note.textContent='', 4000);
    });

    // Parallax subtle effect in hero
    const l1 = $('.layer-1');
    const l2 = $('.layer-2');
    if (l1 || l2){
      window.addEventListener('scroll', () => {
        const y = window.scrollY || 0;
        if (l1) l1.style.transform = `translateY(${y*0.04}px)`;
        if (l2) l2.style.transform = `translateY(${y*0.08}px)`;
      }, { passive: true });
      window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth/2, cy = window.innerHeight/2;
        const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy;
        if (l1) l1.style.transform += ` translate(${dx*4}px, ${dy*2}px)`;
        if (l2) l2.style.transform += ` translate(${dx*8}px, ${dy*4}px)`;
      }, { passive: true });
    }
  });
})();
