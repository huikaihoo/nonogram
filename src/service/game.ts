export type Game = {
  board: boolean[][];
  topHints: number[][];
  leftHints: number[][];
};

// Linear Congruential Generator for deterministic PRNG
function lcg(seed: number) {
  let state = seed >>> 0; // force unsigned 32-bit
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function buildGame(seed: number, m: number, n: number): Game {
  const rand = lcg(seed);

  // Step 1: Generate board as boolean[][]
  const board: boolean[][] = Array.from({ length: m }, () =>
    Array.from({ length: n }, () => rand() < 0.3)
  );

  // Step 2: Compute left hints (per row)
  const hitsLeft: number[][] = [];
  for (let row = 0; row < m; row++) {
    const hints: number[] = [];
    let count = 0;
    for (let col = 0; col < n; col++) {
      if (board[row][col]) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) hints.push(count);
    hitsLeft.push(hints.length ? hints : [0]);
  }

  // Step 3: Compute top hints (per column)
  const hitsTop: number[][] = [];
  for (let col = 0; col < n; col++) {
    const hints: number[] = [];
    let count = 0;
    for (let row = 0; row < m; row++) {
      if (board[row][col]) {
        count++;
      } else if (count > 0) {
        hints.push(count);
        count = 0;
      }
    }
    if (count > 0) hints.push(count);
    hitsTop.push(hints.length ? hints : [0]);
  }

  console.log("Generated game with seed:", seed, board, hitsTop, hitsLeft);
  return { board, topHints: hitsTop, leftHints: hitsLeft };
}
