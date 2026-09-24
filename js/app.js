/* App: hash router, register view, case-file view, progress, stamp moment. */
(function () {
  'use strict';
  const { MODULES } = window.CONTENT;
  const app = document.getElementById('app');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function mdInline(s) {
    // authored inline markers: **bold**, *em* (HTML spans pass through untouched)
    return s
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(“"])\*([^*\n]+)\*(?=[\s).,;:!?”]|$)/g, '$1<em>$2</em>');
  }
  function renderTex(root) {
    if (window.renderMathInElement) {
      window.renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  }

  /* ---------- blocks (concept content) ---------- */
  function renderBlock(b) {
    switch (b.t) {
      case 'p': return h(`<p>${mdInline(b.md)}</p>`);
      case 'eq': return h(`<div class="eq-block"><div class="katex-container">\\[${b.tex}\\]</div><div class="eq-words">${b.words}</div></div>`);
      case 'note': return h(`<div class="note"><span class="reg-label">${b.label}</span>${mdInline(b.md)}</div>`);
      case 'list': return h(`<ul class="plain">${b.items.map(i => `<li>${mdInline(i)}</li>`).join('')}</ul>`);
      case 'table': return h(`<div style="overflow-x:auto"><table style="border-collapse:collapse;width:100%;font-size:var(--step--1);margin:0 0 var(--space-4)">
        <thead><tr>${b.head.map(x => `<th style="text-align:left;border-bottom:2px solid var(--ink);padding:6px 10px 6px 0">${x}</th>`).join('')}</tr></thead>
        <tbody>${b.rows.map(r => `<tr>${r.map(c => `<td style="border-bottom:1px solid var(--rule);padding:8px 10px 8px 0;vertical-align:top">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      default: return h(`<p>${b}</p>`);
    }
  }

  /* ---------- quiz ---------- */
  function renderQuiz(container, mod, quiz, secId) {
    const wrap = h('<div></div>');
    quiz.questions.forEach(q => {
      const qEl = h(`<div class="quiz-q" data-qid="${q.id}">
        <div class="q-text">${q.q}</div>
        <div class="opts"></div>
        <div class="verdict" role="status" hidden></div></div>`);
      const optsDiv = qEl.querySelector('.opts');
      const verdict = qEl.querySelector('.verdict');
      const prev = window.Store.quizState(mod.id, q.id);
      const prevWrong = (prev && prev.wrongPicks) || [];
      q.opts.forEach((o, i) => {
        const b = h(`<button class="opt"><span class="opt-key">${'ABCDEFGH'[i]}</span><span>${o}</span></button>`);
        if (prev && !prev.correct && prevWrong.includes(i)) {
          b.disabled = true;
          b.classList.add('is-wrong');
        }
        if (prev && prev.correct) {
          b.disabled = true;
          if (i === q.correct) b.classList.add('is-right');
        }
        b.addEventListener('click', () => {
          const correct = i === q.correct;
          window.Store.recordQuizAnswer(mod.id, q.id, correct, i);
          if (correct) {
            optsDiv.querySelectorAll('.opt').forEach(x => x.disabled = true);
            b.classList.add('is-right');
            verdict.hidden = false;
            verdict.className = 'verdict verdict--right';
            verdict.innerHTML = `<span class="verdict-tag">Correct</span>
              <span class="verdict-why">${q.why}</span>`;
            if (secId) window.Store.markSection(mod.id, secId);
            const secEl = qEl.closest('.case-section');
            if (secEl && !secEl.querySelector('h2 .section-done-tag')) {
              secEl.querySelector('h2').appendChild(h('<span class="section-done-tag" style="margin-left:8px">done</span>'));
            }
            checkDone();
          } else {
            // genuine retrieval: rule the distractor out yourself — the key is not shown
            b.disabled = true;
            b.classList.add('is-wrong');
            verdict.hidden = false;
            verdict.className = 'verdict verdict--wrong';
            verdict.innerHTML = `<span class="verdict-tag">Ruled out</span>
              <span class="verdict-why">That option doesn't hold up. Work the remaining ones — the reasoning appears once you commit to the right answer.</span>`;
          }
        });
        optsDiv.appendChild(b);
      });
      if (prev && prev.correct) {
        verdict.hidden = false;
        verdict.className = 'verdict verdict--right';
        verdict.innerHTML = `<span class="verdict-tag">Correct</span><span class="verdict-why">${q.why}</span>`;
      }
      wrap.appendChild(qEl);
    });
    // re-test affordance: a stamped/complete checkpoint can be cleared and retaken
    const allCorrect = quiz.questions.every(q => {
      const s = window.Store.quizState(mod.id, q.id);
      return s && s.correct;
    });
    if (allCorrect) {
      wrap.appendChild(h(`<div class="btn-row"><button class="btn btn--ghost" id="redo-${mod.id}">Re-test this checkpoint (clears answers for genuine retrieval)</button></div>`));
      wrap.querySelector('#redo-' + mod.id).addEventListener('click', () => {
        window.Store.clearModuleQuiz(mod.id);
        location.reload();
      });
    }
    container.appendChild(wrap);
    function checkDone() { /* progress re-render handled by continue bar */ }
  }

  /* ---------- transfer ---------- */
  function renderTransfer(container, mod, transfer) {
    const ms = window.Store.moduleState(mod.id);
    const checksHtml = transfer.tasks.map((t, i) =>
      `<label class="check"><input type="checkbox" data-i="${i}" ${ms.transfer.checks[i] ? 'checked' : ''}><span><strong>${i + 1}.</strong> ${t}</span></label>`).join('');
    const allCheckedNow = () => transfer.tasks.every((_, i) => ms.transfer.checks[i]);
    const alreadyStamped = !!ms.stampedAt;
    const elT = h(`<div class="transfer">
      <span class="reg-label" style="display:block;margin-bottom:8px">Scenario — commit your own answer first</span>
      <p class="scenario">${transfer.scenario}</p>
      <div class="selfcheck">${checksHtml}</div>
      <div class="control" style="margin-top:12px">
        <div class="control-top"><label for="notes-${mod.id}">${transfer.selfNote}</label></div>
        <textarea class="notes-field" id="notes-${mod.id}" placeholder="Your field notes — saved on this device.">${ms.transfer.notes || ''}</textarea>
      </div>
      <div class="reveal">
        <button class="btn btn--blue" id="reveal-${mod.id}" disabled>Write your attempt to unlock the model answer</button>
        <div class="reveal-body" hidden><span class="reg-label" style="display:block;margin-bottom:6px">Model answer</span>${transfer.modelAnswer.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="btn-row"><button class="btn btn--primary" id="confirm-${mod.id}" ${allCheckedNow() ? '' : 'disabled'}>${alreadyStamped ? 'Case self-verified' : 'Confirm self-assessment — file this case'}</button></div>
      <p class="control-hint" style="margin-top:8px">Honest self-assessment: check off only the tasks you actually completed. Confirming with the checkpoint passed stamps the case in the register.</p>
    </div>`);

    function allChecked() { return [...elT.querySelectorAll('.selfcheck input')].every(c => c.checked); }

    function syncRevealGate() {
      const btn = elT.querySelector('#reveal-' + mod.id);
      const ready = (elT.querySelector('#notes-' + mod.id).value || '').trim().length >= 20;
      btn.disabled = !ready && !bodyOpen();
      btn.title = ready ? '' : 'Write your attempt in the notes field first — even one line per task.';
      if (!ready) btn.textContent = 'Write your attempt to unlock the model answer';
      else if (!bodyOpen()) btn.textContent = 'Commit your answers, then open the model answer';
    }
    function bodyOpen() { return !elT.querySelector('.reveal-body').hidden; }
    elT.querySelectorAll('.selfcheck input').forEach(c => c.addEventListener('change', () => {
      window.Store.toggleTransferCheck(mod.id, +c.dataset.i, c.checked);
      elT.querySelector('#confirm-' + mod.id).disabled = !allChecked();
    }));
    elT.querySelector('#notes-' + mod.id).addEventListener('input', e => {
      window.Store.setTransferNotes(mod.id, e.target.value);
      syncRevealGate();
    });
    elT.querySelector('#reveal-' + mod.id).addEventListener('click', () => {
      const body = elT.querySelector('.reveal-body');
      body.hidden = !body.hidden;
      renderTex(body);
      syncRevealGate();
    });
    syncRevealGate();
    elT.querySelector('#confirm-' + mod.id).addEventListener('click', () => {
      if (!window.Store.moduleComplete(mod.id, mod)) {
        const toast = document.getElementById('toast');
        toast.textContent = 'Checkpoint not yet passed — answer every checkpoint question correctly first.';
        toast.classList.add('is-on');
        setTimeout(() => toast.classList.remove('is-on'), 2600);
        return;
      }
      window.Store.confirmTransfer(mod.id, true);
      const fresh = window.Store.stampModule(mod.id);
      const secTag = document.querySelector('h2 .section-done-tag');
      if (!secTag) {
        const hs = document.querySelectorAll('.case-section h2');
        const last = hs[hs.length - 1];
        if (last) last.appendChild(h('<span class="section-done-tag" style="margin-left:8px">done</span>'));
      }
      // re-render the file header stamp with the slam
      const slot = document.getElementById('file-stamp-slot');
      if (slot) {
    // stamp lives in the meta row, in flow — it certifies alongside the file's facts
    const stampSlot = h(`<span id="file-stamp-slot"></span>`);
    frame.querySelector('.file-meta').appendChild(stampSlot);
    if (stamped) {
      stampSlot.innerHTML = `<span class="stamp-slam">Self-verified</span>`;
    }
        if (fresh) {
          const toast = document.getElementById('toast');
          toast.textContent = 'Case self-verified — stamped in the register.';
          toast.classList.add('is-on');
          setTimeout(() => toast.classList.remove('is-on'), 2600);
        }
      }
      elT.querySelector('#confirm-' + mod.id).disabled = true;
      elT.querySelector('#confirm-' + mod.id).textContent = 'Case self-verified';
    });
    container.appendChild(elT);
    renderTex(elT);
  }

  /* ---------- section renderers ---------- */
  function renderConceptSection(container, mod, sec) {
    const secEl = h(`<section class="case-section" id="sec-${sec.id}"><h2>${sec.title}</h2><div class="prose"></div></section>`);
    const prose = secEl.querySelector('.prose');
    sec.blocks.forEach(b => prose.appendChild(renderBlock(b)));
    container.appendChild(secEl);
    renderTex(secEl);
  }
  function renderSimSection(container, mod, sec) {
    const secEl = h(`<section class="case-section" id="sec-${sec.id}"><h2>${sec.title}</h2></section>`);
    if (sec.intro) secEl.appendChild(h(`<div class="prose"><p>${sec.intro}</p></div>`));
    const inst = h(`<div class="instrument is-locked"><div class="instrument-head"><span class="reg-label">Instrument — locked</span><span class="reg-label" style="color:var(--blue)" data-sim-label></span></div><div class="instrument-body"><p style="color:var(--ink-3);font-size:var(--step--1);margin:4px 0">Commit a prediction to unlock the instrument.</p></div></div>`);
    const body = inst.querySelector('.instrument-body');
    inst.classList.add('is-locked');
    const simLabels = { jar: 'Bean jar', sir: 'Solver bench', seir: 'SEIR vs Malaysia', fit: 'Fitting bench', vector: 'Two-host loop', mco: 'MCO bench', builder: 'Compartment builder', scenarios: 'Scenario cards' };
    inst.querySelector('[data-sim-label]').textContent = simLabels[sec.sim] || '';
    secEl.appendChild(inst);

    // predict gate
    if (sec.predict) {
      const pid = sec.id + '-pred';
      const pred = h(`<div class="predict"><div class="q-text" style="font-weight:700;margin-bottom:12px">Predict first: ${sec.predict.q}</div><div class="opts"></div><div class="verdict" role="status" hidden></div></div>`);
      const opts = pred.querySelector('.opts');
      const verdict = pred.querySelector('.verdict');
      const prevPred = window.Store.getPrediction(pid);
      function unlock() {
        const ctr = h(`<div class="predict-after"><p style="font-size:var(--step--1);color:var(--ink-2);margin:0 0 8px">${sec.controls}</p></div>`);
        pred.after(ctr);
        const inst2 = container.querySelector('.instrument');
        if (inst2) {
          inst2.classList.remove('is-locked');
          inst2.querySelector('.instrument-head .reg-label').textContent = 'Instrument — live';
          inst2.querySelector('.instrument-body').innerHTML = '';
          window.Interactives[sec.sim](inst2.querySelector('.instrument-body'));
          renderTex(inst2.querySelector('.instrument-body'));
        }
      }
      sec.predict.opts.forEach((o, i) => {
        const b = h(`<button class="opt"><span class="opt-key">${'ABCD'[i]}</span><span>${o}</span></button>`);
        b.addEventListener('click', () => {
          const correct = i === sec.predict.correct;
          window.Store.recordPrediction(pid, i);
          opts.querySelectorAll('.opt').forEach(x => x.disabled = true);
          b.classList.add(correct ? 'is-right' : 'is-wrong');
          opts.children[sec.predict.correct].classList.add('is-right');
          verdict.hidden = false;
          verdict.className = 'verdict ' + (correct ? 'verdict--right' : 'verdict--wrong');
          verdict.innerHTML = `<span class="verdict-tag">${correct ? 'Correct' : 'Worth knowing'}</span><span class="verdict-why">${sec.predict.why}</span>`;
          window.Store.markSection(mod.id, sec.id);
        if (!secEl.querySelector('h2 .section-done-tag')) {
          secEl.querySelector('h2').appendChild(h('<span class="section-done-tag" style="margin-left:8px">done</span>'));
        }
        if (!container.querySelector('.predict-after')) unlock();
        });
        opts.appendChild(b);
      });
      if (prevPred != null) {
        // already predicted before: show state and unlock
        opts.querySelectorAll('.opt').forEach((x, i) => { x.disabled = true; if (i === sec.predict.correct) x.classList.add('is-right'); });
        const wasRight = prevPred === sec.predict.correct;
        verdict.hidden = false;
        verdict.className = 'verdict ' + (wasRight ? 'verdict--right' : 'verdict--wrong');
        verdict.innerHTML = `<span class="verdict-tag">${wasRight ? 'Correct' : 'Worth knowing'}</span><span class="verdict-why">${sec.predict.why}</span>`;
        secEl.appendChild(pred);
        secEl.appendChild(inst);
        container.appendChild(secEl);
        unlock();
        return;
      }
      secEl.appendChild(pred);
      secEl.appendChild(inst);
      container.appendChild(secEl);
        return;
    }
    // no predict gate
    body.innerHTML = '';
    window.Interactives[sec.sim](body);
    container.appendChild(secEl);
  }
  function renderQuizSection(container, mod, sec) {
    const intro = sec.intro || 'Every question must be answered correctly before the case can be stamped. Wrong picks are ruled out — work the rest yourself; the reasoning appears once you commit to the right answer.';
    const secEl = h(`<section class="case-section" id="sec-${sec.id}"><h2>${sec.title}</h2><div class="prose"><p>${intro}</p></div></section>`);
    renderQuiz(secEl, mod, sec, sec.id);
    container.appendChild(secEl);
  }
  function renderTransferSection(container, mod, sec) {
    const secEl = h(`<section class="case-section" id="sec-${sec.id}"><h2>${sec.title}</h2></section>`);
    renderTransfer(secEl, mod, sec);
    container.appendChild(secEl);
  }
  function renderDebriefSection(container, mod, sec) {
    const secEl = h(`<section class="case-section" id="sec-${sec.id}"><h2>${sec.title}</h2><div class="prose"></div></section>`);
    const prose = secEl.querySelector('.prose');
    prose.appendChild(h(`<ul class="plain">${sec.points.map(p => `<li>${mdInline(p)}</li>`).join('')}</ul>`));
    sec.eqs.forEach(e => prose.appendChild(renderBlock({ t: 'eq', tex: e.tex, words: e.words })));
    container.appendChild(secEl);
    renderTex(secEl);
  }

  /* ---------- views ---------- */
  function viewRegister() {
    document.title = 'Modelling Mastery · Infectious disease modelling register';
    app.innerHTML = '';
    const frame = h(`<div class="frame">
      <header class="file-head">
        <span class="reg-label">Communicable disease modelling — training register</span>
        <h1>Modelling Mastery</h1>
        <p class="file-sub">From the SPARKLE short course to any outbreak — eight case files, worked until they are yours.</p>
        <div class="file-meta"><span>opened: SPARKLE workshop · Malaysia 2026</span><span id="reg-date"></span><span id="reg-progress"></span></div>
      </header>
      <div style="height:var(--space-5)"></div>
      <div class="register"><div class="register-head"><span>case no.</span><span>investigation</span><span>status</span></div><div id="case-lines"></div></div>
      <div class="method-strip">
        <div class="m"><b>1 · Predict</b>commit to an answer before any reveal — the register records the guess, not just the grade</div>
        <div class="m"><b>2 · Verify</b>run the live instruments; the equations are the course's own, the data is Malaysia's real first wave</div>
        <div class="m"><b>3 · Transfer</b>every case closes on a pathogen the course never touched — that is where understanding lives</div>
      </div>
      <footer class="colophon"><p>Built from the <a href="https://training.spark.edu.au/courses/intro-mathematical-modelling/" target="_blank" rel="noopener">SPARKLE short course</a> (training.spark.edu.au), Malaysia 2026. Course scripts and data: MoH Malaysia open-data repository. Progress is stored only on this device — <button class="danger-link" id="reset-progress">reset all progress</button>.</p></footer>
    </div>`);
    app.appendChild(frame);

    frame.querySelector('#reg-date').textContent = 'date: ' + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const stamped = MODULES.filter(m => window.Store.moduleState(m.id).stampedAt).length;
    frame.querySelector('#reg-progress').textContent = `verified: ${stamped}/${MODULES.length} cases`;

    const list = frame.querySelector('#case-lines');
    const last = window.Store.state.last;
    MODULES.forEach(m => {
      const ms = window.Store.moduleState(m.id);
      const stampedM = !!ms.stampedAt;
      const attempted = !!(ms.stampedAt || ms.transfer.confirmed || Object.keys(ms.quiz).length || Object.keys(ms.transfer.checks).length);
      const isResume = last && last.module === m.id && !stampedM;
      const status = stampedM
        ? '<span class="stamp stamp--verified">Self-verified</span>'
        : attempted ? '<span class="stamp stamp--open">Open</span>' : '<span class="stamp stamp--unopened">Unopened</span>';
      const row = h(`<button class="case-line ${isResume ? 'is-resume' : ''}" data-mod="${m.id}">
        <span class="case-no">${m.caseNo}</span>
        <span><span class="case-name">${m.title}</span><br><span class="case-scope">${m.scope}</span>${isResume ? '<br><span class="section-done-tag" style="font-size:.6875rem">→ resume here</span>' : ''}</span>
        <span class="case-side">${status}</span>
      </button>`);
      row.addEventListener('click', () => {
        const resumeInto = isResume && last && last.section ? `#/m/${m.id}/${last.section}` : `#/m/${m.id}`;
        location.hash = resumeInto;
      });
      list.appendChild(row);
    });

    const stampedMods = MODULES.filter(m => window.Store.moduleState(m.id).stampedAt);
    if (stampedMods.length >= 2) {
      const recall = h(`<div class="btn-row" style="margin-top:var(--space-4)"><button class="btn btn--blue" id="field-recall">Field recall — re-test a random closed case</button></div>`);
      frame.querySelector('.method-strip').after(recall);
      recall.querySelector('#field-recall').addEventListener('click', () => {
        const pick = stampedMods[Math.floor(Math.random() * stampedMods.length)];
        const quizSec = pick.sections.find(s => s.kind === 'quiz');
        location.hash = `#/m/${pick.id}/${quizSec.id}`;
      });
    }

    frame.querySelector('#reset-progress').addEventListener('click', () => {
      if (confirm('Clear all progress, answers and notes on this device?')) {
        window.Store.resetAll();
        viewRegister();
      }
    });
  }

  function viewModule(modId, anchorSec) {
    const mod = MODULES.find(m => m.id === modId);
    if (!mod) { location.hash = '#/'; return; }
    document.title = `Case ${mod.caseNo} · ${mod.title} — Modelling Mastery`;
    app.innerHTML = '';
    const ms = window.Store.moduleState(mod.id);
    const stamped = !!ms.stampedAt;

    const totalSecs = mod.sections.length;
    const doneSecs = mod.sections.filter(s => window.Store.isSectionDone(mod.id, s.id)).length;
    const doneFrac = (doneSecs / totalSecs).toFixed(3);

    const frame = h(`<div class="frame">
      <a class="back-link" href="#/"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Register</a>
      <header class="file-head">
        <span class="reg-label">Case file ${mod.caseNo} — ${mod.opened}</span>
        <h1>${mod.title}</h1>
        <p class="file-sub">${mod.scope}</p>
        <div class="file-meta"><span>opened: ${mod.opened}</span><span>sections: ${totalSecs}</span></div>
        <div class="file-progress"><i style="transform:scaleX(${doneFrac})"></i></div>
      </header>
      <div style="height:var(--space-4)"></div>
      <div class="prose">${mod.brief.map(p => `<p>${mdInline(p)}</p>`).join('')}</div>
      <div id="sections"></div>
    </div>`);
    app.appendChild(frame);

    // stamp lives in the meta row, in flow — it certifies alongside the file's facts
    const stampSlot = h(`<span id="file-stamp-slot"></span>`);
    frame.querySelector('.file-meta').appendChild(stampSlot);
    if (stamped) {
      stampSlot.innerHTML = `<span class="stamp-slam">Self-verified</span>`;
    }

    const secWrap = frame.querySelector('#sections');
    mod.sections.forEach(sec => {
      const fn = { concept: renderConceptSection, sim: renderSimSection, quiz: renderQuizSection, transfer: renderTransferSection, debrief: renderDebriefSection }[sec.kind];
      fn(secWrap, mod, sec);
    });
    renderTex(frame);

    // continue bar
    const bar = h(`<div class="continue-bar"><div class="bar-inner">
      <span class="bar-progress" id="bar-progress"></span>
      <button class="btn btn--primary" id="bar-next">Next</button>
    </div></div>`);
    document.body.appendChild(bar);
    let idx = 0;
    function visibleSections() { return mod.sections; }
    function syncBar() {
      const transferConfirmed = window.Store.moduleState(mod.id).transfer.confirmed;
      const atEnd = idx >= mod.sections.length - 1;
      frame.querySelector('.file-progress i').style.transform = 'scaleX(' + ((idx + 1) / mod.sections.length).toFixed(3) + ')';
      document.getElementById('bar-progress').textContent = stamped ? 'case verified' :
        `section ${Math.min(idx + 1, mod.sections.length)} of ${mod.sections.length}${transferConfirmed ? ' · transfer confirmed' : ''}`;
      const btn = document.getElementById('bar-next');
      btn.textContent = atEnd ? (stamped ? 'Back to register' : 'Back to register') : 'Next section';
    }
    function scrollToSection(i) {
      const target = document.getElementById('sec-' + mod.sections[i].id);
      if (target) {
        target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        if (!REDUCED) {
          target.classList.remove('anim-section-in');
          void target.offsetWidth;
          target.classList.add('anim-section-in');
        }
      }
    }
    bar.querySelector('#bar-next').addEventListener('click', () => {
      if (idx < mod.sections.length - 1) { idx++; scrollToSection(idx); }
      else { location.hash = '#/'; return; }
      syncBar();
    });
    // track current section on scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const i = mod.sections.findIndex(s => 'sec-' + s.id === en.target.id);
          if (i >= 0) { idx = i; syncBar(); window.Store.setLast(mod.id, mod.sections[i].id); }
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    mod.sections.forEach(s => {
      const n = document.getElementById('sec-' + s.id);
      if (!n) return;
      observer.observe(n);
      if (window.Store.isSectionDone(mod.id, s.id)) {
        n.querySelector('h2').appendChild(h('<span class="section-done-tag" style="margin-left:8px">done</span>'));
      }
    });

    syncBar();
    if (anchorSec) {
      const i = mod.sections.findIndex(s => s.id === anchorSec);
      if (i >= 0) { idx = i; setTimeout(() => scrollToSection(i), 50); }
    }
    // cleanup bar on route change
    window.addEventListener('hashchange', () => { bar.remove(); observer.disconnect(); }, { once: true });
  }

  /* ---------- router ---------- */
  function route() {
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/m\/([a-z0-9]+)(?:\/([a-z0-9-]+))?/);
    if (m) viewModule(m[1], m[2]);
    else viewRegister();
    window.scrollTo(0, 0);
    app.setAttribute('tabindex', '-1');
    app.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  // boot immediately — this script sits at the end of body, above nothing it waits for
  function boot() { route(); }
  boot();
  window.addEventListener('load', () => { if (window.renderMathInElement) renderTex(document.getElementById('app')); });
})();
