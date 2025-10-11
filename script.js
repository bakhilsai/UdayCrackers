// Uday Crackers — Gen-Z Interactive Script
// Features:
// - Mobile nav drawer toggle
// - Hero spark canvas particles
// - Countdown timer
// - Product card sound effects
// - Sliders (deals/reviews)
// - Masonry lightbox placeholder
// - Festive popup + contact form feedback

(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const burger = $('.hamburger');
    const drawer = $('#mobileMenu');
    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const open = drawer.hasAttribute('hidden') ? false : true;
        if (open) drawer.setAttribute('hidden',''); else drawer.removeAttribute('hidden');
        burger.setAttribute('aria-expanded', String(!open));
      });
      drawer.addEventListener('click', e => {
        if (e.target.tagName === 'A') { drawer.setAttribute('hidden',''); burger.setAttribute('aria-expanded','false'); }
      });
    }

    // Smooth scroll and active link
    $$('.nav-links a').forEach(a => a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const el = $(href);
      if (el) el.scrollIntoView({behavior:'smooth'});
    }));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#'+entry.target.id;
          $$('.nav-links a').forEach(l => l.classList.toggle('active', l.getAttribute('href')===id));
        }
      });
    }, { threshold: 0.6 });
    ['home','products','deals','gallery','reviews','contact'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

    // Countdown
    const timerEl = $('#countdownTimer');
    function targetDate(){ return new Date('2025-10-29T00:00:00'); }
    function tick(){
      if (!timerEl) return;
      const t = targetDate().getTime() - Date.now();
      if (t <= 0) { timerEl.textContent = 'Live now ✨'; return; }
      const d = Math.floor(t/86400000);
      const h = Math.floor((t%86400000)/3600000);
      const m = Math.floor((t%3600000)/60000);
      const s = Math.floor((t%60000)/1000);
      timerEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
    tick(); setInterval(tick, 1000);

    // Product card sounds
    const audioCache = new Map();
    function play(url){
      if (!url) return;
      let a = audioCache.get(url);
      if (!a) { a = new Audio(url); audioCache.set(url,a); }
      a.currentTime = 0; a.play().catch(()=>{});
    }
    $$('.crack-btn').forEach(btn => btn.addEventListener('click', () => play(btn.dataset.sound)));

    // Hero spark particles
    initSparks();

    // Sliders
    $$('.slider').forEach(setupSlider);

    // Popup once per session
    const pop = $('#festivePopup');
    if (pop && !sessionStorage.getItem('festivalSeen')) {
      pop.showModal();
      pop.addEventListener('close', () => sessionStorage.setItem('festivalSeen','1'), { once: true });
    }

    // Contact mock submit
    const formBtn = $('#formPing');
    const note = $('#formNote');
    if (formBtn && note) {
      formBtn.addEventListener('click', () => {
        note.textContent = 'Thanks! We will reach out on WhatsApp shortly.';
        setTimeout(()=> note.textContent = '', 4000);
      });
    }

    // Footer year
    const year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  });

  function setupSlider(root){
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const track = root.querySelector('.slides');
    if (!track) return;
    const step = () => track.clientWidth * 0.9;
    if (prev) prev.addEventListener('click', () => track.scrollBy({left: -step(), behavior:'smooth'}));
    if (next) next.addEventListener('click', () => track.scrollBy({left: step(), behavior:'smooth'}));
  }

  function initSparks(){
    const canvas = document.getElementById('sparkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(Math.max(innerHeight*0.6, 400) * dpr);
      canvas.style.width = '100%';
      canvas.style.height = Math.max(innerHeight*0.6, 400)+'px';
    }
    resize(); window.addEventListener('resize', resize);

    const sparks = [];
    function burst(){
      const cx = w*0.5, cy = h*0.45; const n = 80;
      for(let i=0;i<n;i++){
        const ang = Math.random()*Math.PI*2;
        const spd = Math.random()*2 + 0.8;
        sparks.push({ x: cx, y: cy, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life: 90, c: randColor() });
      }
    }
    function randColor(){
      const arr = ['#ffd34e','#ff7a18','#ff3d81','#7cffcb','#8a2be2','#00c2ff'];
      return arr[(Math.random()*arr.length)|0];
    }

    let last=0; function loop(t){
      requestAnimationFrame(loop);
      if (!last) last = t; const dt = Math.min(33, t-last); last = t;
      ctx.fillStyle = 'rgba(0,0,0,0.20)'; ctx.fillRect(0,0,w,h);
      if (Math.random()<0.03) burst();
      for (let i=sparks.length-1;i>=0;i--){
        const p = sparks[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.01; p.life -= dt/16;
        if (p.life<=0) { sparks.splice(i,1); continue; }
        ctx.globalAlpha = Math.max(0, p.life/90);
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 2*dpr, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(loop);
  }
})();
