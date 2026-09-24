/* Interactive instruments. Each widget mounts into a container and returns nothing.
   Widgets: jar, sir, seir, fit, vector, mco, builder, scenarios. */
(function () {
  'use strict';

  const el = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html.trim();
    // single root -> the live element itself; multi root -> a live wrapper that
    // keeps every root queryable after insertion (fragments empty on append)
    return d.children.length === 1 ? d.firstElementChild : d;
  };
  const fmt = (v, d = 0) => v.toLocaleString('en-US', { maximumFractionDigits: d });

  /* =============== slider helper =============== */
  function slider(opts) {
    // opts: {id, label, min, max, step, value, fmt, hint}
    return el(`<div class="control" data-ctl="${opts.id}">
      <div class="control-top">
        <label for="ctl-${opts.id}">${opts.label}</label>
        <output id="out-${opts.id}">${opts.fmt ? opts.fmt(opts.value) : opts.value}</output>
      </div>
      <input type="range" id="ctl-${opts.id}" min="${opts.min}" max="${opts.max}" step="${opts.step}" value="${opts.value}">
      ${opts.hint ? `<span class="control-hint">${opts.hint}</span>` : ''}
    </div>`);
  }
  function bindSlider(root, id, fn) {
    const input = root.querySelector('#ctl-' + id);
    const out = root.querySelector('#out-' + id);
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      out.textContent = v;
      fn(v);
    });
    return input;
  }

  /* =============== 1. bean jar (M1) =============== */
  function widgetJar(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="jar-canvas"></canvas></div>
      <div class="sim-readouts" id="jar-readouts"></div>
      <div class="controls" id="jar-controls"></div>
      <div class="btn-row">
        <button class="btn btn--primary" id="jar-step">Step one week</button>
        <button class="btn btn--blue" id="jar-run">Run 10 weeks</button>
        <button class="btn btn--ghost" id="jar-reset">Reset jar</button>
      </div>`));

    const state = { p: 0.5, contacts: 4, S: 499, I: 1, R: 0, history: [{ week: 0, S: 499, I: 1, R: 0, inc: 0 }], newInc: 0 };

    function step() {
      const s = state;
      const N = s.S + s.I + s.R;
      const inc = Math.min(s.S, Math.round(s.S * (s.contacts / N) * s.I * s.p));
      s.S -= inc; s.I += inc;
      const rec = s.I - inc;             // last week's infectious recover
      s.I -= rec; s.R += rec;
      s.newInc = inc;
      s.history.push({ week: s.history.length, S: s.S, I: s.I, R: s.R, inc });
    }
    // week-0 recover correction: at week 1 the initial 1 infectious recovers after spreading
    function reset() { Object.assign(state, { S: 499, I: 1, R: 0, history: [{ week: 0, S: 499, I: 1, R: 0, inc: 0 }], newInc: 0 }); draw(); readout('Jar reset. 1 infectious bean in 500.'); }

    function readout(msg) {
      const h = state.history[state.history.length - 1];
      container.querySelector('#jar-readouts').innerHTML =
        `<span>week <b>${h.week}</b></span><span>S <b>${fmt(h.S)}</b></span><span>I <b>${fmt(h.I)}</b></span>` +
        `<span>R <b>${fmt(h.R)}</b></span><span>new cases <b>${fmt(h.inc)}</b></span>` +
        (msg ? `<span>${msg}</span>` : '');
    }
    function draw() {
      const cv = container.querySelector('#jar-canvas');
      SimLib.drawChart(cv, {
        series: [
          { points: state.history.map(h => ({ x: h.week, y: h.S })), color: '#8fa3bd', width: 1.5, dash: [5, 3] },
          { points: state.history.map(h => ({ x: h.week, y: h.I })), color: '#b3372e', width: 2.5 },
          { points: state.history.map(h => ({ x: h.week, y: h.R })), color: '#1d56a4', width: 2 }
        ],
        xMin: 0, xMax: 10, yMax: 500, xTicks: 5, yTicks: 5,
        xLabel: 'week', yLabel: 'beans'
      });
    }
    const ctlP = slider({ id: 'jp', label: 'Transmission probability p (per contact with an infectious bean)', min: 0.05, max: 1, step: 0.05, value: 0.5 });
    container.querySelector('#jar-controls').appendChild(ctlP);
    bindSlider(container, 'jp', v => { state.p = v; });

    container.querySelector('#jar-step').addEventListener('click', () => {
      if (state.history.length > 10) { readout('10 weeks reached — reset to run again.'); return; }
      const before = state.I;
      step();
      draw(); readout(`You predicted, now see: ${fmt(state.newInc)} new cases (I went ${before} → ${state.I}).`);
    });
    container.querySelector('#jar-run').addEventListener('click', () => {
      reset();
      while (state.history.length <= 10) step();
      const peak = Math.max(...state.history.map(h => h.inc));
      draw();
      readout(`10 weeks done. Peak weekly incidence ${fmt(peak)}; final size ${fmt(state.R + state.I)} of 500.`);
    });
    container.querySelector('#jar-reset').addEventListener('click', reset);
    SimLib.animateChart(container.querySelector('#jar-canvas'), {
      series: [
        { points: state.history.map(h => ({ x: h.week, y: h.S })), color: '#8fa3bd', width: 1.5, dash: [5, 3] },
        { points: state.history.map(h => ({ x: h.week, y: h.I })), color: '#b3372e', width: 2.5 },
        { points: state.history.map(h => ({ x: h.week, y: h.R })), color: '#1d56a4', width: 2 }
      ],
      xMin: 0, xMax: 10, yMax: 500, xTicks: 5, yTicks: 5,
      xLabel: 'week', yLabel: 'beans'
    }); readout('Predict week-1 incidence, then step.');
  }

  /* =============== 2. SIR + integrator toggle (M2) =============== */
  function widgetSir(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="sir-canvas"></canvas></div>
      <div class="sim-readouts" id="sir-readouts"></div>
      <div class="controls" id="sir-controls"></div>
      <div class="btn-row">
        <button class="btn btn--primary" id="sir-run">Run model</button>
      </div>`));

    const st = { R0: 3, inf: 6, solver: 'rk4' };
    const ctlR0 = slider({ id: 'sr0', label: 'R0', min: 0.5, max: 8, step: 0.1, value: 3 });
    const ctlInf = slider({ id: 'sinf', label: 'Mean infectious period (days)', min: 2, max: 14, step: 1, value: 6 });
    container.querySelector('#sir-controls').append(ctlR0, ctlInf);
    bindSlider(container, 'sr0', v => { st.R0 = v; run(); });
    bindSlider(container, 'sinf', v => { st.inf = v; run(); });

    function simulate(solver) {
      const N = 10000, gamma = 1 / st.inf, beta = st.R0 * gamma;
      const deriv = (t, y) => {
        const [S, I, R] = y;
        const foi = beta * I / N;
        return [-foi * S, foi * S - gamma * I, gamma * I];
      };
      if (solver === 'rk4') {
        return SimLib.rk4(deriv, [N - 1, 1, 0], 0, 120, 0.05);
      }
      // deliberate teaching artefact: giant-step Euler
      let y = [N - 1, 1, 0], t = 0, out = [{ t: 0, y: y.slice() }];
      const dt = 7;
      while (t < 120) {
        const k = deriv(t, y);
        y = y.map((v, j) => Math.max(0, v + dt * k[j]));
        t += dt;
        out.push({ t, y: y.slice() });
      }
      return out;
    }
    function run() {
      const good = simulate('rk4'), bad = simulate('euler7');
      const dailyOf = sol => sol.filter(p => Math.abs(p.t - Math.round(p.t)) < 1e-9).map(p => ({ x: p.t, y: p.y[1] }));
      const goodDaily = dailyOf(good), badDaily = dailyOf(bad);
      const showEuler = st.solver === 'euler7';
      const series = showEuler
        ? [{ points: badDaily, color: '#b3372e', width: 2.5 },
           { points: goodDaily, color: '#8fa3bd', width: 1.25, dash: [5, 3] }]
        : [{ points: goodDaily, color: '#1d56a4', width: 2.5 },
           { points: badDaily, color: '#c9baa8', width: 1.25, dash: [6, 3] }];
      SimLib.animateChart(container.querySelector('#sir-canvas'), {
        series,
        xMin: 0, xMax: 120, xTicks: 6, yTicks: 4,
        xLabel: 'days', yLabel: 'infectious'
      });
      const shown = showEuler ? badDaily : goodDaily;
      const peak = Math.max(...shown.map(p => p.y));
      const peakDay = shown.find(p => p.y === peak).x;
      const final = good[good.length - 1].y[2] + good[good.length - 1].y[1];
      container.querySelector('#sir-readouts').innerHTML =
        `<span>shown: <b>${showEuler ? 'Euler dt 7d' : 'RK4'}</b></span>` +
        `<span>peak I <b>${fmt(peak)}</b> @ day <b>${Math.round(peakDay)}</b></span>` +
        `<span>final size (RK4 truth) <b>${fmt(final)}</b> of 10,000</span>` +
        `<span>r = γ(R0−1) = <b>${(1 / st.inf * (st.R0 - 1)).toFixed(2)}</b>/day</span>`;
    }
    // solver toggle buttons
    const tog = el(`<div class="btn-row" style="margin-top:8px">
       <button class="btn btn--blue" data-s="rk4">RK4 (dt 0.05 d) — trustworthy</button>
       <button class="btn btn--ghost" data-s="euler7">Euler (dt 7 d) — broken on purpose</button></div>`);
    container.querySelector('#sir-controls').after(tog);
    tog.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { st.solver = b.dataset.s; run(); tog.querySelectorAll('button').forEach(x => x.classList.toggle('btn--blue', x === b)); }));
    container.querySelector('#sir-run').addEventListener('click', run);
    run();
  }

  /* =============== 3. SEIR vs Malaysia data (M4) =============== */
  function widgetSeir(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="seir-canvas"></canvas></div>
      <div class="sim-readouts" id="seir-readouts"></div>
      <div class="controls" id="seir-controls"></div>
      <div class="btn-row"><button class="btn btn--primary" id="seir-run">Run course model</button></div>`));
    const st = { R0: 4 };
    const ctl = slider({ id: 'er0', label: 'R0 (course value 4)', min: 1, max: 8, step: 0.1, value: 4 });
    container.querySelector('#seir-controls').appendChild(ctl);
    bindSlider(container, 'er0', v => { st.R0 = v; run(); });

    const data = SimLib.malaysiaDaily('2020-02-28', '2020-03-18'); // uncontrolled window bars
    const dataLong = SimLib.malaysiaDaily('2020-02-28', '2020-06-30');

    function run() {
      const sol = SimLib.seir({ R0: st.R0, latent: 5, infectious: 6, pop: 3.27e7, I0: 20, tMax: 122 }); // Feb28+122 = Jun30
      const inc = sol.daily.map(d => ({ x: d.day, y: d.incidence }));
      const bars = dataLong.map(d => ({ x: d.day, y: d.cases }));
      SimLib.drawChart(container.querySelector('#seir-canvas'), {
        series: [{ points: inc, color: '#1d56a4', width: 2.5 }],
        bars: { points: bars, color: '#c7d3e2' },
        markers: [{ x: 19, label: 'MCO 18 Mar', color: '#b3372e' }],
        xMin: 0, xMax: 122, xTicks: 6, yTicks: 4,
        xFmt: v => { const d = new Date('2020-02-28'); d.setDate(d.getDate() + Math.round(v)); return d.toISOString().slice(5, 10); },
        yFmt: v => fmt(v), xLabel: 'date (2020)', yLabel: 'cases/day'
      });
      const at19 = sol.daily.find(d => d.day === 19);
      container.querySelector('#seir-readouts').innerHTML =
        `<span>model incidence 18 Mar: <b>${fmt(at19.incidence)}</b></span>` +
        `<span>observed 18 Mar: <b>${fmt(dataLong.find(d => d.day === 19).cases)}</b></span>` +
        `<span>model peak (28 Feb–29 Jun run): <b>${fmt(Math.max(...inc.map(p => p.y)))}</b>/day</span>`;
    }
    container.querySelector('#seir-run').addEventListener('click', () => {
      run();
      const sol = SimLib.seir({ R0: st.R0, latent: 5, infectious: 6, pop: 3.27e7, I0: 20, tMax: 122 });
      SimLib.animateChart(container.querySelector('#seir-canvas'), {
        series: [{ points: sol.daily.map(d => ({ x: d.day, y: d.incidence })), color: '#1d56a4', width: 2.5 }],
        bars: { points: dataLong.map(d => ({ x: d.day, y: d.cases })), color: '#c7d3e2' },
        markers: [{ x: 19, label: 'MCO 18 Mar', color: '#b3372e' }],
        xMin: 0, xMax: 122, xTicks: 6, yTicks: 4,
        xFmt: v => { const d = new Date('2020-02-28'); d.setDate(d.getDate() + Math.round(v)); return d.toISOString().slice(5, 10); },
        yFmt: v => fmt(v), xLabel: 'date (2020)', yLabel: 'cases/day'
      });
    });
    run();
  }

  /* =============== 4. fitting playground (M5) =============== */
  function widgetFit(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="fit-canvas"></canvas></div>
      <div class="sim-readouts" id="fit-readouts"></div>
      <div class="controls" id="fit-controls"></div>
      <div class="btn-row">
        <button class="btn btn--blue" id="fit-reveal">Reveal course optima</button>
        <button class="btn btn--ghost" id="fit-surface">Show likelihood surface</button>
      </div>
      <div class="sim-canvas-wrap" id="fit-surf-wrap" hidden><canvas id="fit-surface-canvas"></canvas></div>`));

    const st = { R0: 4, I0: 20, mode: 'ssq', bestSSQ: Infinity, bestNLL: Infinity };
    const data = SimLib.malaysiaDaily('2020-02-28', '2020-03-18'); // 20 days (2020 leap year)
    const y = data.map(d => d.cases);

    function solve(R0, I0) {
      const sol = SimLib.seir({ R0, latent: 5, infectious: 6, pop: 3.27e7, I0, tMax: 19 });
      return sol.daily.slice(0, 20).map(d => d.incidence); // days 0..19, like the course's seq()
    }
    function objective(model) {
      // course convention: Cases[-1] vs Incidence[-1] — skip the day-0 pair (incidence(0)=0)
      let ssq = 0, nll = 0;
      for (let i = 1; i < y.length; i++) {
        const d = y[i] - model[i];
        ssq += d * d;
        nll += -SimLib.poisLog(y[i], Math.max(model[i], 1e-9));
      }
      return { ssq, nll };
    }

    const cR0 = slider({ id: 'fr0', label: 'R0', min: 0.5, max: 8, step: 0.01, value: 4 });
    const cI0 = slider({ id: 'fi0', label: 'Seed I(0)', min: 1, max: 60, step: 1, value: 20 });
    container.querySelector('#fit-controls').append(cR0, cI0);
    bindSlider(container, 'fr0', v => { st.R0 = v; run(); });
    bindSlider(container, 'fi0', v => { st.I0 = v; run(); });

    function run() {
      const model = solve(st.R0, st.I0);
      const { ssq, nll } = objective(model);
      st.bestSSQ = Math.min(st.bestSSQ, ssq); st.bestNLL = Math.min(st.bestNLL, nll);
      const bars = data.map(d => ({ x: d.day, y: d.cases }));
      SimLib.drawChart(container.querySelector('#fit-canvas'), {
        series: [{ points: model.map((v, i) => ({ x: i, y: v })), color: '#b3372e', width: 2.5 }],
        bars: { points: bars, color: '#c7d3e2' },
        xMin: 0, xMax: 19, xTicks: 6, yTicks: 4,
        xLabel: 'days since 28 Feb 2020', yLabel: 'cases/day'
      });
      container.querySelector('#fit-readouts').innerHTML =
        `<span>SSQ <b>${fmt(ssq)}</b></span><span>NLL <b>${nll.toFixed(1)}</b></span>` +
        `<span>your best SSQ <b>${fmt(st.bestSSQ)}</b></span><span>your best NLL <b>${st.bestNLL.toFixed(1)}</b></span>`;
    }
    container.querySelector('#fit-reveal').addEventListener('click', () => {
      container.querySelector('#fit-readouts').innerHTML +=
        `<span class="section-done-tag">SSQ at course start (R0 4, I0 20): 19652.25 · course LSQ: R0 4.556, I0 15.4, SSQ 16756.64 · course MLE: R0 5.235 (CI 4.76–5.75), I0 9.00, NLL 161.25</span>`;
    });
    container.querySelector('#fit-surface').addEventListener('click', () => {
      const wrap = container.querySelector('#fit-surf-wrap');
      wrap.hidden = !wrap.hidden;
      if (wrap.hidden) return;
      drawSurface();
    });
    function drawSurface() {
      const cv = container.querySelector('#fit-surface-canvas');
      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth || 600, H = W * 0.7;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px';
      const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // grid search
      const R0s = [], I0s = [];
      for (let r = 1; r <= 8.001; r += 0.1) R0s.push(+r.toFixed(2));
      for (let i = 1; i <= 50; i += 1) I0s.push(i);
      const nllAt = (R0, I0) => objective(solve(R0, I0)).nll;
      let min = Infinity, max = -Infinity;
      const grid = R0s.map(r => I0s.map(i => { const v = nllAt(r, i); min = Math.min(min, v); max = Math.max(max, v); return v; }));
      // draw heat map
      const cw = W / R0s.length, ch = H / I0s.length;
      for (let a = 0; a < R0s.length; a++) for (let b = 0; b < I0s.length; b++) {
        const t = (grid[a][b] - min) / (max - min);
        // blue (low) to warm grey (high)
        ctx.fillStyle = `rgba(${Math.round(29 + 160 * t)},${Math.round(86 + 60 * t)},${Math.round(166 - 100 * t)},${0.25 + 0.6 * t})`;
        ctx.fillRect(a * cw, H - (b + 1) * ch, cw + 0.5, ch + 0.5);
      }
      // axes labels
      ctx.fillStyle = '#465061'; ctx.font = '11px "Courier Prime", monospace';
      ctx.fillText('R0 →', W - 44, H - 6);
      ctx.save(); ctx.translate(10, 20); ctx.rotate(-Math.PI / 2); ctx.fillText('I(0) →', 0, 0); ctx.restore();
      // optimum marker
      const opt = SimLib.seir({ R0: 5.235, latent: 5, infectious: 6, pop: 3.27e7, I0: 9, tMax: 1 });
      const xOf = r => (r - 1) / 7 * W, yOf = i => H - (i - 1) / 49 * H;
      ctx.strokeStyle = '#171c26'; ctx.lineWidth = 2;
      ctx.strokeRect(xOf(5.235) - 4, yOf(9) - 4, 8, 8);
      ctx.fillText('MLE 5.24 / 9', xOf(5.235) + 8, yOf(9) + 4);
      ctx.strokeRect(xOf(st.R0) - 4, yOf(st.I0) - 4, 8, 8);
      ctx.fillStyle = '#b3372e'; ctx.fillText('you', xOf(st.R0) + 8, yOf(st.I0) + 4);
    }
    run();
    SimLib.animateChart(container.querySelector('#fit-canvas'), {
      series: [{ points: solve(st.R0, st.I0).map((v, i) => ({ x: i, y: v })), color: '#b3372e', width: 2.5 }],
      bars: { points: data.map(d => ({ x: d.day, y: d.cases })), color: '#c7d3e2' },
      xMin: 0, xMax: 19, xTicks: 6, yTicks: 4,
      xLabel: 'days since 28 Feb 2020', yLabel: 'cases/day'
    });
  }

  /* =============== 5. vector-borne (M6) =============== */
  function widgetVector(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="vec-canvas"></canvas></div>
      <div class="sim-readouts" id="vec-readouts"></div>
      <div class="controls" id="vec-controls"></div>`));
    const st = { m: 2, bite: 0.5, life: 14 };
    const cM = slider({ id: 'vm', label: 'm — vectors per human', min: 0.25, max: 6, step: 0.25, value: 2 });
    const cA = slider({ id: 'va', label: 'a — bite rate (bites/mosquito/day)', min: 0.1, max: 1, step: 0.05, value: 0.5 });
    const cL = slider({ id: 'vl', label: 'Adult mosquito lifespan (days)', min: 5, max: 30, step: 1, value: 14 });
    container.querySelector('#vec-controls').append(cM, cA, cL);
    bindSlider(container, 'vm', v => { st.m = v; run(); });
    bindSlider(container, 'va', v => { st.bite = v; run(); });
    bindSlider(container, 'vl', v => { st.life = v; run(); });

    function rmR0() {
      const muV = 1 / st.life, n = 10, r = 1 / 5;
      const R0sq = st.m * (st.bite ** 2 * 0.75 * 0.75) / (r * muV) * Math.exp(-muV * n);
      return Math.sqrt(R0sq);
    }
    function run() {
      const sol = SimLib.vectorModel({
        popH: 10000, I0H: 1, popV: 10000 * st.m, E0V: 5,
        bite: st.bite, betaH: 0.75, betaV: 0.75, latentV: 10, infH: 5, lifeV: st.life, tMax: 120
      });
      const I = sol.daily.map(d => ({ x: d.day, y: d.IH }));
      SimLib.drawChart(container.querySelector('#vec-canvas'), {
        series: [{ points: I, color: '#1d56a4', width: 2.5 }],
        xMin: 0, xMax: 120, xTicks: 6, yTicks: 4,
        xLabel: 'days', yLabel: 'infectious humans'
      });
      const r0 = rmR0();
      const finalSize = sol.daily[sol.daily.length - 1].RH;
      container.querySelector('#vec-readouts').innerHTML =
        `<span>Ross–Macdonald R0 ≈ <b>${r0.toFixed(2)}</b></span>` +
        `<span>outbreak? <b>${r0 > 1 ? 'yes — R0 > 1' : 'no — R0 ≤ 1'}</b></span>` +
        `<span>recovered at day 120: <b>${fmt(finalSize)}</b>/10,000</span>`;
    }
    run();
    SimLib.animateChart(container.querySelector('#vec-canvas'), {
      series: [{ points: SimLib.vectorModel({ popH: 10000, I0H: 1, popV: 10000 * st.m, E0V: 5, bite: st.bite, betaH: 0.75, betaV: 0.75, latentV: 10, infH: 5, lifeV: st.life, tMax: 120 }).daily.map(d => ({ x: d.day, y: d.IH })), color: '#1d56a4', width: 2.5 }],
      xMin: 0, xMax: 120, xTicks: 6, yTicks: 4,
      xLabel: 'days', yLabel: 'infectious humans'
    });
  }

  /* =============== 6. MCO intervention game (M7) =============== */
  function widgetMco(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap"><canvas id="mco-canvas"></canvas></div>
      <div class="sim-readouts" id="mco-readouts"></div>
      <div class="controls" id="mco-controls"></div>
      <div class="btn-row">
        <button class="btn btn--blue" id="mco-reveal">Reveal the course calibration</button>
        <button class="btn btn--ghost" id="mco-cf">Counterfactual: MCO one week later</button>
      </div>`));
    const st = { start: 19, e1: 0.7, e2: 0.8 };
    const cS = slider({ id: 'ms', label: 'MCO start (days after 28 Feb; 19 = 18 Mar)', min: 5, max: 40, step: 1, value: 19 });
    const cE1 = slider({ id: 'me1', label: 'Phase 1 efficacy', min: 0, max: 0.95, step: 0.01, value: 0.7 });
    const cE2 = slider({ id: 'me2', label: 'Phase 2 efficacy (from phase1 + 14 d)', min: 0, max: 0.95, step: 0.01, value: 0.8 });
    container.querySelector('#mco-controls').append(cS, cE1, cE2);
    bindSlider(container, 'ms', v => { st.start = v; run(); });
    bindSlider(container, 'me1', v => { st.e1 = v; run(); });
    bindSlider(container, 'me2', v => { st.e2 = v; run(); });

    const R0 = 5.235132, I0 = 8.997775; // course MLE, as session 9 used
    const data = SimLib.malaysiaDaily('2020-02-28', '2020-05-13');
    function solve(start, e1, e2) {
      return SimLib.seirIntervention({
        R0, latent: 5, infectious: 6, pop: 3.27e7, I0, tMax: 75,
        phases: [{ from: start, to: start + 14, efficacy: e1 }, { from: start + 14, to: 75, efficacy: e2 }]
      });
    }
    let lastTotal = null;
    function run() {
      const sol = solve(st.start, st.e1, st.e2);
      const inc = sol.daily.map(d => ({ x: d.day, y: d.incidence }));
      const bars = data.map(d => ({ x: d.day, y: d.cases }));
      let nll = 0;
      for (let i = 1; i < data.length; i++) nll += -SimLib.poisLog(data[i].cases, Math.max(inc[i] ? inc[i].y : 1e-9, 1e-9));
      SimLib.drawChart(container.querySelector('#mco-canvas'), {
        series: [{ points: inc, color: '#1d56a4', width: 2.5 }],
        bars: { points: bars, color: '#c7d3e2' },
        markers: [
          { x: st.start, label: 'MCO', color: '#b3372e' },
          { x: st.start + 14, label: 'phase 2', color: '#6b7385' }
        ],
        xMin: 0, xMax: 75, xTicks: 5, yTicks: 4,
        xFmt: v => { const d = new Date('2020-02-28'); d.setDate(d.getDate() + Math.round(v)); return d.toISOString().slice(5, 10); },
        xLabel: 'date (2020)', yLabel: 'cases/day'
      });
      lastTotal = inc.reduce((a, p) => a + p.y, 0);
      container.querySelector('#mco-readouts').innerHTML =
        `<span>NLL vs data <b>${fmt(nll)}</b> (lower = better; course fit: 633)</span>` +
        `<span>Reff phase 1 <b>${((1 - st.e1) * R0).toFixed(2)}</b></span>` +
        `<span>Reff phase 2 <b>${((1 - st.e2) * R0).toFixed(2)}</b></span>` +
        `<span>total modelled cases <b>${fmt(lastTotal)}</b></span>`;
      return nll;
    }
    container.querySelector('#mco-reveal').addEventListener('click', () => {
      container.querySelector('#mco-readouts').innerHTML +=
        `<span class="section-done-tag">course: start 18 Mar, e1 0.728 (CI 0.721–0.735), e2 0.869 (CI 0.866–0.873), NLL 633.1</span>`;
    });
    container.querySelector('#mco-cf').addEventListener('click', () => {
      const base = lastTotal;
      const cf = solve(st.start + 7, st.e1, st.e2);
      const cfTotal = cf.daily.reduce((a, d) => a + d.incidence, 0);
      container.querySelector('#mco-readouts').innerHTML +=
        `<span>counterfactual (+7 days): <b>${fmt(cfTotal)}</b> total — that is <b>${(cfTotal / base).toFixed(1)}×</b> more cases</span>`;
    });
    run();
    const mcoSol = solve(st.start, st.e1, st.e2);
    SimLib.animateChart(container.querySelector('#mco-canvas'), {
      series: [{ points: mcoSol.daily.map(d => ({ x: d.day, y: d.incidence })), color: '#1d56a4', width: 2.5 }],
      bars: { points: data.map(d => ({ x: d.day, y: d.cases })), color: '#c7d3e2' },
      markers: [
        { x: st.start, label: 'MCO', color: '#b3372e' },
        { x: st.start + 14, label: 'phase 2', color: '#6b7385' }
      ],
      xMin: 0, xMax: 75, xTicks: 5, yTicks: 4,
      xFmt: v => { const d = new Date('2020-02-28'); d.setDate(d.getDate() + Math.round(v)); return d.toISOString().slice(5, 10); },
      xLabel: 'date (2020)', yLabel: 'cases/day'
    });
  }

  /* =============== 7. model builder (M3) =============== */
  function widgetBuilder(container) {
    container.appendChild(el(`
      <div class="sim-canvas-wrap" style="padding:12px"><div id="bd-diagram"></div></div>
      <div class="sim-readouts" id="bd-name"></div>
      <div class="controls" id="bd-controls"></div>`));
    const st = { E: false, waning: false, vector: false };
    function draw() {
      const svgNS = 'http://www.w3.org/2000/svg';
      const wrap = container.querySelector('#bd-diagram');
      wrap.innerHTML = '';
      const svg = document.createElementNS(svgNS, 'svg');
      const W = Math.min(wrap.clientWidth || 520, 560), H = st.vector ? 240 : 120;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.style.width = '100%';
      const box = (x, y, label) => {
        const g = document.createElementNS(svgNS, 'g');
        const r = document.createElementNS(svgNS, 'rect');
        r.setAttribute('x', x - 28); r.setAttribute('y', y - 18); r.setAttribute('width', 56); r.setAttribute('height', 36);
        r.setAttribute('rx', 3); r.setAttribute('fill', '#eaf1f9'); r.setAttribute('stroke', '#1d56a4'); r.setAttribute('stroke-width', '1.5');
        const t = document.createElementNS(svgNS, 'text');
        t.setAttribute('x', x); t.setAttribute('y', y + 4); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-family', 'Courier Prime, monospace'); t.setAttribute('font-size', '14'); t.setAttribute('font-weight', '700');
        t.setAttribute('fill', '#143e7c'); t.textContent = label;
        g.append(r, t); svg.appendChild(g);
        return { x, y };
      };
      const arrow = (a, b, id) => {
        const p = document.createElementNS(svgNS, 'path');
        const mid = (a.x + b.x) / 2;
        const d = st.vector && id === 'h2v' ? `M ${a.x + 28} ${a.y} C ${mid} ${a.y - 40}, ${mid} ${b.y - 40}, ${b.x - 28} ${b.y}` :
          st.vector && id === 'v2h' ? `M ${a.x - 28} ${a.y} C ${mid} ${a.y + 40}, ${mid} ${b.y + 40}, ${b.x + 28} ${b.y}` :
            `M ${a.x + 28} ${a.y} L ${b.x - 30} ${b.y}`;
        p.setAttribute('d', d); p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#1d56a4'); p.setAttribute('stroke-width', '1.75');
        p.setAttribute('marker-end', 'url(#bd-arrow)');
        if (id) { p.setAttribute('class', 'bd-flow'); p.setAttribute('data-flow', id || ''); }
        svg.appendChild(p);
      };
      const defs = document.createElementNS(svgNS, 'defs');
      defs.innerHTML = '<marker id="bd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#1d56a4"/></marker>';
      svg.appendChild(defs);

      const gap = Math.min(110, (W - 120) / 3);
      if (st.vector) {
        const S = box(60, 60, 'S'); const I = box(60 + gap, 60, 'I'); const R = box(60 + 2 * gap, 60, 'R');
        const V = box(60 + gap + (gap / 2), 180, 'V');
        arrow(S, I, 'h2v'); arrow(I, R, 'rec');
        // vector loop below
        const g = document.createElementNS(svgNS, 'g');
        const r = document.createElementNS(svgNS, 'rect');
        r.setAttribute('x', V.x - 40); r.setAttribute('y', 162); r.setAttribute('width', 80); r.setAttribute('height', 36);
        r.setAttribute('rx', 3); r.setAttribute('fill', '#f3efe6'); r.setAttribute('stroke', '#8a6d3b'); r.setAttribute('stroke-width', '1.5');
        const t = document.createElementNS(svgNS, 'text');
        t.setAttribute('x', V.x); t.setAttribute('y', 184); t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-family', 'Courier Prime, monospace'); t.setAttribute('font-size', '14'); t.setAttribute('font-weight', '700');
        t.textContent = 'V(mosq)';
        g.append(r, t); svg.appendChild(g);
      } else {
        const xs = [70, 70 + gap, 70 + 2 * gap];
        if (st.E) {
          const S = box(60, 60, 'S'); const E = box(60 + gap, 60, 'E'); const I = box(60 + 2 * gap, 60, 'I');
          arrow(S, E, 'inf'); arrow(E, I, 'lat');
          if (st.waning) {
            const R2 = box(Math.min(60 + 3 * gap, W - 50), 60, 'R');
            arrow(I, R2, 'rec');
            const back = document.createElementNS(svgNS, 'path');
            back.setAttribute('d', `M ${R2.x} ${78} C ${R2.x} ${118}, ${S.x} ${118}, ${S.x} ${80}`);
            back.setAttribute('fill', 'none'); back.setAttribute('stroke', '#8a6d3b');
            back.setAttribute('stroke-width', '1.75'); back.setAttribute('stroke-dasharray', '4 3');
            back.setAttribute('marker-end', 'url(#bd-arrow-b)');
            svg.appendChild(back);
          }
        } else {
          const S = box(70, 60, 'S'); const I = box(70 + gap, 60, 'I');
          arrow(S, I, 'inf');
          if (st.waning) {
            const R2 = box(70 + 2 * gap, 60, 'R');
            arrow(I, R2, 'rec');
            const back = document.createElementNS(svgNS, 'path');
            back.setAttribute('d', `M ${R2.x} ${78} C ${R2.x} ${118}, ${S.x} ${118}, ${S.x} ${80}`);
            back.setAttribute('fill', 'none'); back.setAttribute('stroke', '#8a6d3b');
            back.setAttribute('stroke-width', '1.75'); back.setAttribute('stroke-dasharray', '4 3');
            back.setAttribute('marker-end', 'url(#bd-arrow-b)');
            svg.appendChild(back);
          } else {
            // SI: no recovery
          }
        }
      }
      // second marker def for waning (brown)
      const defs2 = document.createElementNS(svgNS, 'defs');
      defs2.innerHTML = '<marker id="bd-arrow-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#8a6d3b"/></marker>';
      svg.appendChild(defs2);
      wrap.appendChild(svg);
      const nm = st.vector ? { name: 'Human–vector loop', ex: 'dengue, malaria, Zika' }
        : st.E && st.waning ? { name: 'SEIRS', ex: 'seasonal coronaviruses with latency' }
          : st.E ? { name: 'SEIR — latent period, lifelong immunity', ex: 'measles, rabies (R = death), SARS-CoV-2 original' }
            : st.waning ? { name: 'SIRS — waning immunity', ex: 'seasonal coronaviruses, influenza (partial)' }
              : { name: 'SIR — lifelong immunity', ex: 'measles, chickenpox' };
      container.querySelector('#bd-name').innerHTML =
        `<span>structure <b>${nm.name}</b></span><span>think: <b>${nm.ex}</b></span>`;
    }
    const mk = (id, label) => {
      const w = el(`<label class="check"><input type="checkbox" id="${id}"><span>${label}</span></label>`);
      container.querySelector('#bd-controls').appendChild(w);
      w.querySelector('input').addEventListener('change', e => { st[id === 'bE' ? 'E' : id === 'bW' ? 'waning' : 'vector'] = e.target.checked; draw(); });
    };
    mk('bE', 'Add latency: infected but not yet infectious (E)');
    mk('bW', 'Add waning immunity: R flows back to S');
    mk('bV', 'Add a vector: transmission needs a mosquito loop');
    draw();
  }

  /* =============== 8. scenario cards (M8) =============== */
  function widgetScenarios(container) {
    const SCEN = [
      {
        id: 'cholera', name: 'Cholera in a flood district',
        q: 'Which structure is minimal and defensible?',
        opts: [
          'Plain SIR — water is background',
          'SIR + water reservoir compartment W (shedding S→W, ingestion W→S)',
          'SEIRS with 1-year waning',
          'SI with no recovery'
        ], correct: 1,
        why: 'The reservoir is a state the pathogen LIVES IN — the same two-host grammar as dengue (Case 06), with shedding/inactivation replacing bites. Plain SIR cannot evaluate water interventions; that is the question being asked.'
      },
      {
        id: 'flu', name: 'Flu in a boarding school (R0 1.8)',
        q: 'The e* (efficacy needed for Reff<1) is closest to:',
        opts: ['25%', '44%', '65%', '82%'], correct: 1,
        why: 'e* = 1 − 1/R0 = 1 − 1/1.8 ≈ 0.44. Compare the MCO: R0 5.24 needed e > 81%. Low-R0 pathogens are far easier to control — portfolio arithmetic: independent reductions multiply.'
      },
      {
        id: 'ident', name: '10 days of flat data, boss wants R0',
        q: 'The professional answer is:',
        opts: [
          'Fit cumulative cases — fastest',
          'Report R0 = 1 (curve is flat)',
          'Cannot identify R0 from this; report growth-rate bounds / pooled data, and what would narrow it',
          'Assume R0 = 2.5 from literature and proceed silently'
        ], correct: 2,
        why: 'Flat early data → flat likelihood → fake-tight or meaningless CIs. Identifiability refusals are findings (Case 05). Offer the r-bound and the pooling path; state literature assumptions AS assumptions.'
      },
      {
        id: 'rumour', name: 'A rumour spreading on social media',
        q: 'The structural match is:',
        opts: ['SIR — hasnt-heard → sharing → bored', 'SIS — people share forever', 'vector model — the algorithm is the mosquito', 'not modelable with compartments'], correct: 0,
        why: 'Same grammar: susceptible (not yet seen) → infectious (reposting) → recovered (moved on / debunked). The flows transfer; only the time constants change. This is the portability promise of the whole register.'
      }
    ];
    let done = 0;
    SCEN.forEach(s => {
      const card = el(`<div class="quiz-q"><div class="q-text">${s.name}</div><p style="font-size:.9375rem;color:var(--ink-2);margin:0 0 12px">${s.q}</p><div class="opts"></div><div class="verdict" hidden></div></div>`);
      const optsDiv = card.querySelector('.opts'), verdict = card.querySelector('.verdict');
      const saved = window.Store.getPrediction('m8-' + s.id);
      const commit = (i) => {
        const right = i === s.correct;
        window.Store.recordPrediction('m8-' + s.id, i);
        optsDiv.querySelectorAll('.opt').forEach(x => { x.disabled = true; });
        optsDiv.children[i].classList.add(right ? 'is-right' : 'is-wrong');
        optsDiv.children[s.correct].classList.add('is-right');
        verdict.hidden = false;
        verdict.className = 'verdict ' + (right ? 'verdict--right' : 'verdict--wrong');
        verdict.innerHTML = `<span class="verdict-tag">${right ? 'Correct' : 'Not quite'}</span><span class="verdict-why">${s.why}</span>`;
        if (right) done++;
      };
      s.opts.forEach((o, i) => {
        const b = el(`<button class="opt"><span class="opt-key">${'ABCD'[i]}</span><span>${o}</span></button>`);
        b.addEventListener('click', () => commit(i));
        optsDiv.appendChild(b);
      });
      if (saved != null) commit(saved);
      container.appendChild(card);
    });
    const anySaved = SCEN.some(s => window.Store.getPrediction('m8-' + s.id) != null);
    if (anySaved) {
      const redo = el(`<div class="btn-row"><button class="btn btn--ghost">Re-test scenarios (clears commitments)</button></div>`);
      redo.querySelector('button').addEventListener('click', () => {
        SCEN.forEach(s => window.Store.deletePrediction('m8-' + s.id));
        location.reload();
      });
      container.appendChild(redo);
    }
  }

  /* =============== registry =============== */
  window.Interactives = {
    jar: widgetJar, sir: widgetSir, seir: widgetSeir, fit: widgetFit,
    vector: widgetVector, mco: widgetMco, builder: widgetBuilder, scenarios: widgetScenarios
  };
})();
