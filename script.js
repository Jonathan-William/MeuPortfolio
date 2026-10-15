(function () {
  'use strict';

  const CFG = window.PORTFOLIO || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function store(kind, key, value) {
    try {
      const s = kind === 'session' ? sessionStorage : localStorage;
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (e) { return null; }
  }

  const UI = {
    pt: {
      sending: 'ENVIANDO...',
      success: 'Mensagem enviada! Respondo em breve.',
      error: 'Falha no envio — verifica sua conexão ou me chama por e-mail.',
      mailto: 'Abrindo seu app de e-mail com a mensagem pronta…',
      invalid: 'Preencha nome, e-mail válido e mensagem.',
      cmdPlaceholder: 'digite "help"...',
      notFound: (c) => `comando não encontrado: ${c} — digite "help"`,
    },
    en: {
      sending: 'SENDING...',
      success: 'Message sent! I’ll reply soon.',
      error: 'Failed to send — check your connection or email me directly.',
      mailto: 'Opening your email app with the message ready…',
      invalid: 'Fill in name, a valid email and message.',
      cmdPlaceholder: 'type "help"...',
      notFound: (c) => `command not found: ${c} — type "help"`,
    },
  };

  const dict = { pt: {}, en: CFG.en || {} };
  $$('[data-i18n]').forEach((el) => { dict.pt[el.dataset.i18n] = el.innerHTML.trim(); });
  $$('[data-i18n-placeholder]').forEach((el) => { dict.pt[el.dataset.i18nPlaceholder] = el.placeholder; });
  $$('[data-i18n-aria]').forEach((el) => { dict.pt[el.dataset.i18nAria] = el.getAttribute('aria-label'); });

  let lang = 'pt';
  const t = (key) => (dict[lang][key] !== undefined ? dict[lang][key] : dict.pt[key]);
  const listeners = [];

  function syncGlitchText(el) {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    el.dataset.text = clone.textContent
      .split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
  }

  function applyLanguage(next) {
    lang = next;
    $$('[data-i18n]').forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value === undefined) return;
      el.innerHTML = value;
      if (el.classList.contains('glitch')) syncGlitchText(el);
    });
    $$('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
      el.title = t(el.dataset.i18nAria);
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    $$('.lang-label').forEach((el) => { el.textContent = lang === 'pt' ? 'EN' : 'PT'; });
    listeners.forEach((fn) => fn(lang));
  }

  function setLanguage(next) {
    store('local', 'portfolioLang', next);
    applyLanguage(next);
  }

  const browserLang = (navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  const initialLang = store('local', 'portfolioLang') || browserLang;
  if (initialLang !== 'pt') applyLanguage(initialLang);
  else $$('.glitch').forEach(syncGlitchText);

  $$('.js-lang').forEach((btn) => btn.addEventListener('click', () => setLanguage(lang === 'pt' ? 'en' : 'pt')));

  function paintThemeIcons() {
    const dark = document.documentElement.dataset.theme === 'dark';
    $$('.theme-icon').forEach((el) => { el.textContent = dark ? '☀️' : '🌙'; });
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store('local', 'portfolioTheme', next);
    paintThemeIcons();
  }

  paintThemeIcons();
  $$('.js-theme').forEach((btn) => btn.addEventListener('click', toggleTheme));

  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', navLinks).forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });

  function bootDone() {
    window.dispatchEvent(new Event('bootDone'));
  }

  (function boot() {
    const screen = $('#boot');
    const log = $('#bootLog');
    const handle = CFG.handle || 'portfolio';

    if (reducedMotion || store('session', 'portfolioBootSeen')) {
      screen.remove();
      requestAnimationFrame(bootDone);
      return;
    }

    const lines = [
      `> inicializando ${handle}.dev...`,
      '> carregando módulos: frontend [ok] backend [ok] segurança [ok]',
      '> verificando integridade dos sistemas...',
      '> estabelecendo conexão segura...',
      '> acesso concedido.',
    ];

    document.body.style.overflow = 'hidden';
    let i = 0;
    (function next() {
      if (i >= lines.length) {
        setTimeout(() => {
          screen.classList.add('hide');
          document.body.style.overflow = '';
          store('session', 'portfolioBootSeen', '1');
          bootDone();
          setTimeout(() => screen.remove(), 500);
        }, 400);
        return;
      }
      const line = document.createElement('div');
      line.className = 'line';
      line.textContent = lines[i++];
      log.appendChild(line);
      setTimeout(next, 260);
    })();
  })();

  const nav = $('#nav');
  const progress = $('#scrollProgress');
  const sections = $$('section[id]');
  const spyLinks = $$('.navlinks a');
  const heroVisual = $('.hero-visual');
  const reveals = $$('.reveal');
  const contactGrid = $('#contactGrid');

  const nearViewport = (el, buffer = 60) => el.getBoundingClientRect().top < window.innerHeight - buffer;

  function checkReveals() {
    reveals.forEach((el) => {
      if (!el.classList.contains('is-visible') && nearViewport(el)) el.classList.add('is-visible');
    });
    if (!contactGrid.classList.contains('is-visible') && nearViewport(contactGrid)) {
      contactGrid.classList.add('is-visible');
    }
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = (max > 0 ? Math.min(doc.scrollTop / max, 1) * 100 : 0) + '%';

    nav.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top <= 120 && r.bottom >= 120) current = s.id;
    });
    spyLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

    if (!reducedMotion) {
      heroVisual.style.transform = `translateY(${Math.min(window.scrollY * 0.12, 60)}px)`;
      checkReveals();
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });

  if (reducedMotion) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    contactGrid.classList.add('is-visible');
  } else {
    window.addEventListener('resize', checkReveals);
    window.addEventListener('bootDone', checkReveals);
  }
  onScroll();

  (function particles() {
    const canvas = $('#particles');
    if (reducedMotion) { canvas.remove(); return; }

    const ctx = canvas.getContext('2d');
    const glow = getComputedStyle(document.documentElement).getPropertyValue('--accent-glow-rgb').trim() || '255, 59, 74';
    const count = window.matchMedia('(max-width: 700px)').matches ? 22 : 46;
    let w, h, dots, raf, running = false;

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      speed: Math.random() * 0.25 + 0.08,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.35 + 0.12,
    });

    function size() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      dots = Array.from({ length: count }, make);
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${glow}, ${p.alpha})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    }

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    size();
    start();
    window.addEventListener('resize', size);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  })();

  const heroTitle = $('.hero h1');

  function scramble(el, duration = 800) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01#*';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = node.textContent;
      const total = Math.round(duration / 30);
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / total) * original.length);
        let out = '';
        for (let i = 0; i < original.length; i++) {
          const ch = original[i];
          out += i < revealed || /\s/.test(ch) ? ch : chars[(Math.random() * chars.length) | 0];
        }
        node.textContent = out;
        if (frame >= total) { node.textContent = original; clearInterval(timer); }
      }, 30);
    });
  }

  function glitch(ms) {
    heroTitle.classList.add('glitching');
    setTimeout(() => heroTitle.classList.remove('glitching'), ms);
  }

  if (!reducedMotion) {
    window.addEventListener('bootDone', () => {
      scramble(heroTitle, 800);
      setTimeout(() => glitch(350), 850);
    }, { once: true });
    setInterval(() => glitch(300), 9000);
  }

  $$('.btn').forEach((btn) => {
    if (finePointer && !reducedMotion) {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    }

    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.6;
      const cx = e.clientX || r.left + r.width / 2;
      const cy = e.clientY || r.top + r.height / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = cx - r.left - size / 2 + 'px';
      ripple.style.top = cy - r.top - size / 2 + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  const projItems = $$('#projGrid .proj-item');
  $('#projCount').textContent = projItems.filter((c) => !('fun' in c.dataset)).length;

  projItems.forEach((card, i) => {
    const corners = document.createElement('span');
    corners.className = 'proj-corners';
    corners.setAttribute('aria-hidden', 'true');
    card.appendChild(corners);
    card.dataset.revealDelay = (Math.min(i, 7) * 0.06).toFixed(2);
  });

  if (!reducedMotion) {
    const cardObserver = new MutationObserver((records) => {
      records.forEach(({ target }) => {
        if (!target.classList.contains('is-visible') || target.dataset.revealed) return;
        target.dataset.revealed = '1';
        const d = target.dataset.revealDelay + 's';
        target.style.transitionDelay = `${d}, ${d}, 0s, 0s, 0s, 0s`;
        setTimeout(() => { target.style.transitionDelay = ''; }, 700 + parseFloat(d) * 1000);
      });
    });
    projItems.forEach((card) => cardObserver.observe(card, { attributes: true, attributeFilter: ['class'] }));
  }

  if (finePointer && !reducedMotion) {
    const maxTilt = 7;
    $$('.tilt').forEach((card) => {
      const glow = document.createElement('div');
      glow.className = 'tilt-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        if (e.buttons === 1) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          `rotateX(${(0.5 - py) * maxTilt * 2}deg) rotateY(${(px - 0.5) * maxTilt * 2}deg) translateZ(0) scale(1.015)`;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
      card.addEventListener('mousedown', () => { card.style.transform = ''; });
    });
  }

  (function filters() {
    const row = $('#filterRow');
    const empty = $('#filterEmpty');
    const tags = [...new Set(projItems.map((c) => c.dataset.tag))];
    tags.forEach((tag) => {
      const chip = document.createElement('button');
      chip.className = 'filter-chip';
      chip.dataset.filter = tag;
      chip.setAttribute('aria-pressed', 'false');
      chip.textContent = tag;
      row.appendChild(chip);
    });

    row.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      $$('.filter-chip', row).forEach((c) => {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      let visible = 0;
      projItems.forEach((card) => {
        const match = chip.dataset.filter === 'ALL' || card.dataset.tag === chip.dataset.filter;
        card.classList.toggle('is-hidden', !match);
        if (match) visible++;
      });
      empty.hidden = visible > 0;
    });
  })();

  $$('.skill-bar').forEach((bar) => {
    const raw = parseInt(bar.dataset.pct, 10);
    const pct = Number.isNaN(raw) ? null : Math.max(0, Math.min(100, raw));
    $('.skill-fill', bar).style.width = (pct ?? 0) + '%';
    $('.skill-pct', bar).textContent = pct === null ? '—' : pct + '%';
  });

  $$('.skill-icon').forEach((item) => {
    const label = item.textContent.trim();
    const img = document.createElement('img');
    img.src = item.dataset.iconSrc ||
      `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${item.dataset.icon}.svg`;
    img.alt = '';
    img.loading = 'lazy';
    img.width = 34;
    img.height = 34;
    item.textContent = '';
    item.append(img, Object.assign(document.createElement('span'), { textContent: label }));
  });

  (function terminal() {
    const box = $('#terminal');
    const prompt = `${CFG.handle || 'user'}@lab:~$`;
    const linesFor = (l) => (CFG.terminal && CFG.terminal[l]) || [];
    let state = 'idle';

    function addLine(cls) {
      const div = document.createElement('div');
      div.className = 'term-line' + (cls ? ' ' + cls : '');
      box.appendChild(div);
      return div;
    }

    function promptLine(cmd) {
      const div = addLine();
      const p = document.createElement('span');
      p.className = 'prompt';
      p.textContent = prompt;
      const typed = document.createElement('span');
      typed.textContent = cmd === undefined ? '' : ' ' + cmd;
      div.append(p, typed);
      return { div, typed };
    }

    function finalPrompt() {
      const { div } = promptLine();
      div.insertAdjacentHTML('beforeend', ' <span class="cursor"></span>');
    }

    function renderStatic() {
      $$('.term-line', box).forEach((n) => n.remove());
      linesFor(lang).forEach(({ cmd, out }) => {
        promptLine(cmd);
        addLine('term-out').textContent = out;
      });
      finalPrompt();
      state = 'done';
    }

    function type() {
      state = 'typing';
      const lines = linesFor(lang);
      let li = 0;
      (function nextCommand() {
        if (li >= lines.length) { finalPrompt(); state = 'done'; return; }
        const { cmd, out } = lines[li];
        const { typed } = promptLine();
        const text = ' ' + cmd;
        let ci = 0;
        const timer = setInterval(() => {
          typed.textContent += text[ci++];
          if (ci >= text.length) {
            clearInterval(timer);
            addLine('term-out').textContent = out;
            li++;
            setTimeout(nextCommand, 350);
          }
        }, 35);
      })();
    }

    if (reducedMotion) {
      renderStatic();
    } else {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); type(); }
      }, { threshold: 0.4 });
      io.observe(box);
    }

    listeners.push(() => { if (state === 'done') renderStatic(); });
  })();

  (function contactForm() {
    const form = $('#contactForm');
    const status = $('.form-status', form);
    const button = $('button[type="submit"]', form);
    const ejs = CFG.emailjs || {};
    const useEmailJS = Boolean(ejs.publicKey && ejs.serviceId && ejs.templateId);
    let ejsReady = null;

    function loadEmailJS() {
      if (!ejsReady) {
        ejsReady = new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4.4.1/dist/email.min.js';
          s.onload = () => { window.emailjs.init({ publicKey: ejs.publicKey }); resolve(window.emailjs); };
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      return ejsReady;
    }

    function show(msg, ok) {
      status.hidden = false;
      status.textContent = msg;
      status.style.color = ok ? 'var(--on-accent)' : 'var(--ink)';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { show(UI[lang].invalid, false); form.reportValidity(); return; }

      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim() || (lang === 'pt' ? 'Sem assunto' : 'No subject'),
        message: form.message.value.trim(),
        time: new Date().toLocaleString(lang === 'pt' ? 'pt-BR' : 'en-US'),
      };

      if (!useEmailJS) {
        const body = `${data.message}\n\n— ${data.name} <${data.email}>`;
        window.location.href =
          `mailto:${CFG.email || ''}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        show(UI[lang].mailto, true);
        return;
      }

      const label = button.innerHTML;
      button.textContent = UI[lang].sending;
      button.disabled = true;
      try {
        const emailjs = await loadEmailJS();
        await emailjs.send(ejs.serviceId, ejs.templateId, data);
        show(UI[lang].success, true);
        form.reset();
      } catch (err) {
        console.error('EmailJS:', err);
        show(UI[lang].error, false);
      }
      button.innerHTML = label;
      button.disabled = false;
    });
  })();

  (function commandPalette() {
    const overlay = $('#cmdk');
    const input = $('#cmdkInput');
    const output = $('#cmdkOutput');
    const trigger = $('#cmdkTrigger');
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      overlay.classList.add('open');
      input.value = '';
      input.placeholder = UI[lang].cmdPlaceholder;
      setTimeout(() => input.focus(), 30);
    }

    function close() {
      if (!overlay.classList.contains('open')) return;
      overlay.classList.remove('open');
      if (lastFocus) lastFocus.focus();
    }

    const go = (hash) => () => { close(); location.hash = hash; return `→ ${hash}`; };
    const handle = CFG.handle || 'me';
    const commands = {
      help: () => `comandos: sobre · projetos · seguranca · stack · curriculo · contato · skills · whoami · github · linkedin · tema · idioma · sudo hire ${handle} · clear · exit`,
      sobre: go('#about'), about: go('#about'),
      projetos: go('#projects'), projects: go('#projects'),
      seguranca: go('#lab'), security: go('#lab'),
      stack: go('#stack'),
      curriculo: go('#cv'), cv: go('#cv'), resume: go('#cv'),
      contato: go('#contact'), contact: go('#contact'),
      skills: () => CFG.skillsLine || '',
      whoami: () => CFG.whoami || '',
      github: () => { window.open(CFG.github, '_blank', 'noopener'); return `↗ ${CFG.github}`; },
      linkedin: () => { window.open(CFG.linkedin, '_blank', 'noopener'); return `↗ ${CFG.linkedin}`; },
      tema: () => { toggleTheme(); return 'ok.'; }, theme: () => commands.tema(),
      idioma: () => { setLanguage(lang === 'pt' ? 'en' : 'pt'); return 'ok.'; }, language: () => commands.idioma(),
      [`sudo hire ${handle}`]: () => { go('#contact')(); return 'permissão concedida.'; },
      clear: () => { output.textContent = ''; return null; },
      exit: () => { close(); return null; },
    };

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === '/' && !typing) { e.preventDefault(); open(); }
      else if (e.key === 'Escape') { close(); closeMenu(); }
    });
    trigger.addEventListener('click', open);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const raw = input.value.trim();
      if (!raw) return;
      const line = document.createElement('div');
      line.className = 'cmdk-line';
      line.innerHTML = '<span class="cmdk-prompt">$</span> ';
      line.appendChild(document.createTextNode(raw));
      output.appendChild(line);

      const fn = commands[raw.toLowerCase()];
      const result = fn ? fn() : UI[lang].notFound(raw);
      if (result) {
        const res = document.createElement('div');
        res.className = 'cmdk-result';
        res.textContent = result;
        output.appendChild(res);
      }
      output.scrollTop = output.scrollHeight;
      input.value = '';
    });
  })();

  console.log('%c> acesso ao console detectado.', 'color:#ff3b4a;font-family:monospace;font-size:14px');
  console.log(`%c> curioso(a)? bora conversar → ${CFG.email || ''}`, 'color:#f7f7f5;font-family:monospace;font-size:12px');
})();
