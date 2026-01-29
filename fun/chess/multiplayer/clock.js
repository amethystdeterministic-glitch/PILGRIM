// Deterministic clocks (turn-based, no wall-clock drift)

export function initClock(baseSeconds){
  return {
    white: baseSeconds,
    black: baseSeconds
  };
}

export function applyMove(clock, turn, cost=1){
  clock[turn] = Math.max(0, clock[turn] - cost);
  return clock;
}
