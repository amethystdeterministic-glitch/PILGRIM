/**
 * DETLINE — Deterministic State Engine
 * Single authority. No side effects.
 */

(function () {
  const STATES = {
    idle: {
      color: 'var(--det-idle)',
      anim: 'idlePulse 2.5s ease-in-out infinite'
    },
    active: {
      color: 'var(--det-active)',
      anim: 'activePulse 1.2s ease-in-out infinite'
    },
    secure: {
      color: 'var(--det-secure)',
      anim: 'none'
    },
    warning: {
      color: 'var(--det-warning)',
      anim: 'warningBlink 1s linear infinite'
    },
    error: {
      color: 'var(--det-error)',
      anim: 'errorStrobe 0.6s linear infinite'
    }
  };

  window.setDetState = function (state) {
    const s = STATES[state] || STATES.idle;

    document.documentElement.style.setProperty(
      '--det-dot-color',
      s.color
    );

    document.documentElement.style.setProperty(
      '--det-dot-pulse',
      s.anim
    );
  };

  // Canon boot state
  window.setDetState('idle');
})();
