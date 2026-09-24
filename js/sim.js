/* Simulation engine: RK4 integration for compartment models, and a
   measured-graticule canvas chart (the oscilloscope discipline: every
   axis labelled, every division meaningful). */
(function () {
  'use strict';

  /* ---------- ODE ---------- */

  // y0: array of numbers; deriv(t, y) -> array of derivatives
  function rk4(deriv, y0, t0, t1, dt) {
    const steps = Math.max(1, Math.round((t1 - t0) / dt));
    let y = y0.slice();
    let t = t0;
    const out = [{ t, y: y.slice() }];
    for (let i = 0; i < steps; i++) {
      const h = Math.min(dt, t1 - t);
      const k1 = deriv(t, y);
      const y2 = y.map((v, j) => v + h / 2 * k1[j]);
      const k2 = deriv(t + h / 2, y2);
      const y3 = y.map((v, j) => v + h / 2 * k2[j]);
      const k3 = deriv(t + h / 2, y3);
      const y4 = y.map((v, j) => v + h * k3[j]);
      const k4 = deriv(t + h, y4);
      y = y.map((v, j) => v + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
      t += h;
      out.push({ t, y: y.slice() });
    }
    return out;
  }

  /* ---------- standard compartment models ---------- */

  // SEIR with rates per day. params: {R0, latent, infectious, pop, I0, E0, tMax}
  // Returns solution plus derived incidence (E/latent per day).
  function seir(params) {
    const { R0, latent, infectious, pop, I0, E0 } = params;
    const gamma = 1 / infectious, sigma = 1 / latent, beta = R0 * gamma;
    const deriv = (t, y) => {
      const [S, E, I, R] = y;
      const foi = beta * I / pop;
      return [-foi * S, foi * S - sigma * E, sigma * E - gamma * I, gamma * I];
    };
    const y0 = [pop - I0 - (E0 || 0), E0 || 0, I0, 0];
    const sol = rk4(deriv, y0, 0, params.tMax, 0.05);
    // daily sampling with incidence
    const daily = [];
    for (let d = 0; d < sol.length; d++) {
      const p = sol[d];
      if (Math.abs(p.t - Math.round(p.t)) < 1e-9) {
        daily.push({
          day: Math.round(p.t),
          S: p.y[0], E: p.y[1], I: p.y[2], R: p.y[3],
          incidence: p.y[1] * sigma
        });
      }
    }
    return { sol, daily };
  }

  // SEIRS (waning immunity), for M1/M2 intuition and the SIRS connection.
  function seirs(params) {
    const { R0, infectious, immune, pop, I0 } = params;
    const gamma = 1 / infectious, omega = immune > 0 ? 1 / immune : 0;
    const beta = R0 * gamma;
    const deriv = (t, y) => {
      const [S, I, R] = y;
      const foi = beta * I / pop;
      return [-foi * S + omega * R, foi * S - gamma * I, gamma * I - omega * R];
    };
    const y0 = [pop - I0, I0, 0];
    const sol = rk4(deriv, y0, 0, params.tMax, 0.05);
    const daily = sol.filter(p => Math.abs(p.t - Math.round(p.t)) < 1e-9)
      .map(p => ({ day: Math.round(p.t), S: p.y[0], I: p.y[1], R: p.y[2] }));
    return { sol, daily };
  }

  // Intervention SEIR: efficacy schedule e(t) piecewise.
  function seirIntervention(params) {
    const { R0, latent, infectious, pop, I0, tMax, phases } = params;
    // phases: [{from, to, efficacy}] on day axis
    const gamma = 1 / infectious, sigma = 1 / latent;
    const deriv = (t, y) => {
      const [S, E, I, R] = y;
      let eff = 0;
      for (const ph of phases) if (t >= ph.from && t < ph.to) eff = ph.efficacy;
      const Reff = (1 - eff) * R0;
      const foi = Reff * gamma * I / pop;
      return [-foi * S, foi * S - sigma * E, sigma * E - gamma * I, gamma * I];
    };
    const y0 = [pop - I0, 0, I0, 0];
    const sol = rk4(deriv, y0, 0, tMax, 0.05);
    const daily = sol.filter(p => Math.abs(p.t - Math.round(p.t)) < 1e-9)
      .map(p => ({ day: Math.round(p.t), S: p.y[0], E: p.y[1], I: p.y[2], R: p.y[3], incidence: p.y[1] * sigma }));
    return { sol, daily };
  }

  // Vector-borne (dengue) two-host model, Ross-style coupled SEI(vector)-SIR(human).
  // Simplified per course session 8: humans S->I->R; mosquitoes S->E->I (no recovery).
  function vectorModel(p) {
    // p: {popH, I0H, popV, E0V, bite, betaH (mosq->human per bite), betaV (human->mosq),
    //     latentV, infH (days infectious human), lifeV (vector lifespan days), tMax}
    const gammaH = 1 / p.infH, muV = 1 / p.lifeV, sigmaV = 1 / p.latentV;
    const deriv = (t, y) => {
      const [SH, IH, RH, SV, EV, IV] = y;
      const m = p.popV / p.popH;
      const lambdaH = p.bite * p.betaH * (IV / p.popV);              // force of infection on humans
      const lambdaV = p.bite * p.betaV * (IH / p.popH);              // force on mosquitoes
      return [
        -lambdaH * SH, lambdaH * SH - gammaH * IH, gammaH * IH,
        p.popV * muV - lambdaV * SV - muV * SV,   // constant emergence keeps vector pop stable
        lambdaV * SV - sigmaV * EV - muV * EV,
        sigmaV * EV - muV * IV
      ];
    };
    const y0 = [p.popH - p.I0H, p.I0H, 0,
      p.popV - (p.E0V || 0) - (p.I0V || 0), p.E0V || 0, p.I0V || 0];
    const sol = rk4(deriv, y0, 0, p.tMax, 0.05);
    const daily = sol.filter(q => Math.abs(q.t - Math.round(q.t)) < 1e-9)
      .map(q => ({ day: Math.round(q.t), SH: q.y[0], IH: q.y[1], RH: q.y[2], IV: q.y[5] }));
    return { sol, daily };
  }

  /* ---------- chart: measured graticule ---------- */

  // opts: {series:[{points:[{x,y}], color, width, dash}], bars:{points, color}, xLabel, yLabel,
  //        xTicks: number, yTicks: number, xFmt, yFmt, drawIndex (progressive 0..1)}
  function drawChart(canvas, opts) {
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || canvas.parentElement.clientWidth;
    const cssH = cssW * (opts.heightRatio || 0.62);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.height = cssH + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const padL = 44, padR = 10, padT = 12, padB = 30;
    const W = cssW - padL - padR, H = cssH - padT - padB;

    // scales
    let xMin = opts.xMin != null ? opts.xMin : Infinity, xMax = opts.xMax != null ? opts.xMax : -Infinity;
    let yMax = 0;
    const allPts = [];
    (opts.series || []).forEach(s => s.points.forEach(p => { allPts.push(p); xMin = Math.min(xMin, p.x); xMax = Math.max(xMax, p.x); yMax = Math.max(yMax, p.y); }));
    if (opts.bars) opts.bars.points.forEach(p => { allPts.push(p); xMin = Math.min(xMin, p.x); xMax = Math.max(xMax, p.x); yMax = Math.max(yMax, p.y); });
    if (opts.yMax) yMax = opts.yMax;
    if (opts.series || opts.bars) { /* keep */ } else { xMin = 0; xMax = 1; }
    if (!isFinite(xMin)) { xMin = 0; xMax = 10; }
    if (yMax <= 0) yMax = 1;
    yMax = niceCeil(yMax);

    const X = x => padL + (x - xMin) / (xMax - xMin) * W;
    const Y = y => padT + H - (y / yMax) * H;

    // graticule
    ctx.strokeStyle = '#e3e7ec';
    ctx.lineWidth = 1;
    const xTicks = opts.xTicks || 5, yTicks = opts.yTicks || 4;
    ctx.font = '10px "Courier Prime", monospace';
    ctx.fillStyle = '#6b7385';
    for (let i = 0; i <= yTicks; i++) {
      const yv = yMax / yTicks * i;
      const yy = Y(yv);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(padL + W, yy); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(opts.yFmt ? opts.yFmt(yv) : String(Math.round(yv)), padL - 5, yy);
    }
    for (let i = 0; i <= xTicks; i++) {
      const xv = xMin + (xMax - xMin) / xTicks * i;
      const xx = X(xv);
      ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, padT + H); ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(opts.xFmt ? opts.xFmt(xv) : String(Math.round(xv)), xx, padT + H + 5);
    }
    // axis labels
    ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText(opts.xLabel || '', padL, cssH - 1);
    ctx.save();
    ctx.translate(9, padT + 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'right'; ctx.textBaseline = 'top';
    ctx.fillText(opts.yLabel || '', 0, 0);
    ctx.restore();

    // bars (data)
    if (opts.bars) {
      ctx.fillStyle = opts.bars.color || '#c9d4e2';
      const bw = Math.max(1.5, W / ((opts.bars.points.length) * 1.4));
      const n = opts.bars.points.length;
      const upTo = opts.drawIndex != null ? Math.floor(n * opts.drawIndex) : n;
      for (let i = 0; i < upTo; i++) {
        const p = opts.bars.points[i];
        const x0 = X(p.x) - bw / 2;
        ctx.fillRect(x0, Y(p.y), bw, padT + H - Y(p.y));
      }
    }

    // series (model)
    (opts.series || []).forEach(s => {
      const pts = s.points;
      const nDraw = opts.drawIndex != null ? Math.max(2, Math.floor(pts.length * opts.drawIndex)) : pts.length;
      ctx.strokeStyle = s.color || '#1d56a4';
      ctx.lineWidth = s.width || 2;
      ctx.setLineDash(s.dash || []);
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i < nDraw; i++) {
        const p = pts[i];
        if (i === 0) ctx.moveTo(X(p.x), Y(p.y)); else ctx.lineTo(X(p.x), Y(p.y));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // markers (e.g., MCO date)
    (opts.markers || []).forEach(m => {
      const xx = X(m.x);
      ctx.strokeStyle = m.color || '#b3372e';
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(xx, padT); ctx.lineTo(xx, padT + H); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = m.color || '#b3372e';
      ctx.textAlign = m.align || 'left';
      ctx.textBaseline = 'top';
      ctx.font = '10px "Courier Prime", monospace';
      ctx.fillText(m.label || '', xx + 3, padT + 2);
    });

    return { X, Y, padL, padT, W, H };
  }

  function niceCeil(v) {
    const exp = Math.pow(10, Math.floor(Math.log10(v)));
    const f = v / exp;
    const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return nf * exp;
  }

  /* ---------- Malaysia data helpers ---------- */
  const MALAYSIA_EPOCH = null;
  function malaysiaDaily(fromISO, toISO) {
    const rows = (window.MALAYSIA_2020 || []).filter(r => (!fromISO || r[0] >= fromISO) && (!toISO || r[0] <= toISO));
    const t0 = new Date(rows[0][0]).getTime();
    return rows.map(r => ({
      date: r[0],
      day: Math.round((new Date(r[0]).getTime() - t0) / 86400000),
      cases: r[1], cum: r[2]
    }));
  }
  function malaysiaDay0(fromISO) {
    return new Date(fromISO).getTime();
  }

  window.SimLib = { rk4, seir, seirs, seirIntervention, vectorModel, drawChart, malaysiaDaily };
})();
