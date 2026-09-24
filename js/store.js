/* Progress store — localStorage persistence for stop-and-resume. */
(function () {
  'use strict';
  const KEY = 'mm-progress-v1';
  const listeners = [];

  function blank() {
    return {
      v: 1,
      modules: {},          // id -> { sections: {secId:true}, quiz: {qid: {correct:true, attempts, wrongPicks}}, transfer: {checks:{i:true}, notes:'', confirmed:true}, stampedAt }
      predictions: {},      // simId -> chosen option index
      last: null            // { module, section }
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1) return blank();
      if (!parsed.modules) parsed.modules = {};
      return parsed;
    } catch (e) {
      return blank();
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private mode: progress won't persist */ }
    listeners.forEach(fn => fn(state));
  }

  function moduleState(id) {
    if (!state.modules) state.modules = {};
    if (!state.modules[id]) state.modules[id] = { sections: {}, quiz: {}, transfer: { checks: {}, notes: '', confirmed: false }, stampedAt: null };
    const m = state.modules[id];
    if (!m.sections) m.sections = {};
    if (!m.quiz) m.quiz = {};
    if (!m.transfer) m.transfer = { checks: {}, notes: '', confirmed: false };
    return m;
  }

  window.Store = {
    get state() { return state; },
    onChange(fn) { listeners.push(fn); },

    moduleState,

    markSection(moduleId, secId) {
      moduleState(moduleId).sections[secId] = true;
      save();
    },
    isSectionDone(moduleId, secId) {
      const m = state.modules[moduleId];
      return !!(m && m.sections[secId]);
    },

    recordPrediction(simId, choice) {
      state.predictions[simId] = choice;
      save();
    },
    deletePrediction(simId) {
      delete state.predictions[simId];
      save();
    },
    getPrediction(simId) {
      return state.predictions[simId];
    },

    recordQuizAnswer(moduleId, qid, correct, chosenIdx) {
      const q = moduleState(moduleId).quiz[qid] || (moduleState(moduleId).quiz[qid] = { correct: false, attempts: 0, wrongPicks: [] });
      q.attempts++;
      if (correct) q.correct = true;
      else if (!q.wrongPicks.includes(chosenIdx)) q.wrongPicks.push(chosenIdx);
      save();
    },
    quizState(moduleId, qid) {
      const m = state.modules[moduleId];
      return (m && m.quiz[qid]) || null;
    },

    toggleTransferCheck(moduleId, idx, on) {
      const t = moduleState(moduleId).transfer;
      if (on) t.checks[idx] = true; else delete t.checks[idx];
      save();
    },
    setTransferNotes(moduleId, text) {
      moduleState(moduleId).transfer.notes = text;
      save();
    },
    confirmTransfer(moduleId, on) {
      moduleState(moduleId).transfer.confirmed = on;
      save();
    },

    stampModule(moduleId) {
      const m = moduleState(moduleId);
      if (!m.stampedAt) {
        m.stampedAt = Date.now();
        save();
        return true; // newly stamped
      }
      return false;
    },

    setLast(moduleId, sectionId) {
      state.last = { module: moduleId, section: sectionId, ts: Date.now() };
      save();
    },

    clearModuleQuiz(moduleId) {
      const m = moduleState(moduleId);
      m.quiz = {};
      save();
    },

    resetAll() {
      state = blank();
      save();
    },

    moduleComplete(moduleId, module) {
      const m = state.modules[moduleId];
      if (!m) return false;
      const quizIds = (module.sections || [])
        .filter(s => s.kind === 'quiz')
        .flatMap(s => s.questions.map(q => q.id));
      const quizOk = quizIds.length > 0 && quizIds.every(qid => m.quiz[qid] && m.quiz[qid].correct);
      const transferOk = m.transfer.confirmed;
      return quizOk && transferOk;
    }
  };
})();
