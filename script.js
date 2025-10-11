// Uday Crackers Diwali Interactivity
// - Fireworks Canvas (lightweight)
// - Animated CTA pulse
// - Card selection + hover emphasis is CSS-driven, selection toggled via JS
// - Countdown timer to Diwali/offers
// - Social share API fallback
// - Sticky nav smooth scroll and active state

(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));

  document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    $$('.navbar nav a').forEach(a => a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = $(href);
        if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    }));

    // CTA pulse animation via JS class toggle (in case user prefers reduced motion, they can disable animations via OS)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      setInterval(() => {
        $$('.btn.cta').forEach(b => {
          b.classList.toggle('pulse');
          setTimeout(()=>b.classList.toggle('pulse'), 600);
        });
      }, 2800);
    }

    // Card selection
    $$('.card.selectable .select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.card.selectable');
        if (!card) return;
        card.classList.toggle('selected');
      });
    });

    // Countdown to Diwali (adjust target date as needed)
    const countdown = $('#countdown');
    function nextDiwaliApprox(){
      // Approximate date: Nov 1 2025 00:00 local (can be changed)
      const now = new Date();
      const year = now.getFullYear();
      const target = new Date('2025-10-29T00:00:00'); // Example Diwali 2025
      return target;
    }
    function tick(){
      if (!countdown) return;
      const t = nextDiwaliApprox().getTime() - Date.now();
      if (t <= 0) { countdown.textContent = 'Happy Diwali! Offers Live ✨'; return; }
      const d = Math.floor(t/86400000);
      const h = Math.floor((t%86400000)/3600000);
      const m = Math.floor((t%3600000)/60000);
      const s = Math.floor((t%60000)/1000);
      countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }
    tick();
    setInterval(tick, 1000);

    // Share button
    const shareBtn = $('#shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const data = { title: 'Uday Crackers', text: 'Light up your Diwali with Uday Crackers!', url: location.href };
        if (navigator.share) {
          try { await navigator.share(data); } catch {}
        } else {
          // Fallback: open Twitter intent
          const u = encodeURIComponent(data.url);
          const t = encodeURIComponent(data.text);
          window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, '_blank');
        }
      });
    }

    // Year in footer
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Lightweight fireworks animation
    initFireworks();
  });

  function initFireworks(){
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(innerWidth * dpr);
      h = canvas.height = Math.floor(innerHeight * dpr * 0.88);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(1,0,0,1,0,0);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    function spawn(x, y, color){
      const count = 80;
      for (let i=0;i<count;i++){
        const angle = Math.random()*Math.PI*2;
        const speed = Math.random()*2.2 + 0.8;
        particles.push({
          x, y,
          vx: Math.cos(angle)*speed,
          vy: Math.sin(angle)*speed,
          life: 60 + Math.random()*30,
          color,
          alpha: 1,
        });
      }
    }
    function randomColor(){
      const colors = ['#ffd34e','#ff7a18','#ff3d81','#7cffcb','#8a2be2','#00c2ff'];
      return colors[(Math.random()*colors.length)|0];
    }

    let last = 0;
    function loop(t){
      requestAnimationFrame(loop);
      if (!last) last = t; const dt = Math.min(33, t - last); last = t;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0,0,w,h);

      // Occasionally launch a burst from random position near top/bottom thirds
      if (Math.random() < 0.04) {
        const x = Math.random()*w*0.9 + w*0.05;
        const y = Math.random()*h*0.4 + h*0.1;
        spawn(x, y, randomColor());
      }

      for (let i=particles.length-1;i>=0;i--){
        const p = particles[i];
        p.x += p.vx * dpr;
        p.y += p.vy * dpr;
        p.vy += 0.02; // gravity
        p.life -= dt/16;
        p.alpha = Math.max(0, p.life/90);
        if (p.life <= 0) { particles.splice(i,1); continue; }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8*dpr, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(loop);
  }
})();
