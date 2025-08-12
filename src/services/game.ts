export type Game = {
  board: boolean[][];
  topHints: number[][];
  leftHints: number[][];
};

function mixSeedTo32(seed: string, height: number, width: number, threshold: number): number {
  // Convert seed string to numeric hash (simple fn)
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const thresholdInt = Math.floor(threshold * 1e6);

  let h = s >>> 0;
  h = Math.imul(h ^ (height + 0x9e3779b1), 0x85ebca6b) >>> 0;
  h = Math.imul(h ^ (width + 0xc2b2ae35), 0x27d4eb2f) >>> 0;
  h = Math.imul(h ^ (thresholdInt + 0x165667b1), 0x45d9f3b) >>> 0;
  return h;
}

function mulberry32(seed: number) {
  return () => {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildHints(board: boolean[][], height: number, width: number) {
  const topHints: number[][] = Array.from({ length: width }, () => []);
  const leftHints: number[][] = Array.from({ length: height }, () => []);

  // Calculate top hints (column-wise)
  for (let col = 0; col < width; col++) {
    let count = 0;
    for (let row = 0; row < height; row++) {
      if (board[row][col]) {
        count++;
      } else if (count > 0) {
        topHints[col].push(count);
        count = 0;
      }
    }
    if (count > 0) topHints[col].push(count);
    if (topHints[col].length === 0) topHints[col].push(0);
  }

  // Calculate left hints (row-wise)
  for (let row = 0; row < height; row++) {
    let count = 0;
    for (let col = 0; col < width; col++) {
      if (board[row][col]) {
        count++;
      } else if (count > 0) {
        leftHints[row].push(count);
        count = 0;
      }
    }
    if (count > 0) leftHints[row].push(count);
    if (leftHints[row].length === 0) leftHints[row].push(0);
  }

  return { topHints, leftHints };
}

export function buildGame(seed: string, height: number, width: number, threshold = 0.5, step = 0.05): Game {
  const rand = mulberry32(mixSeedTo32(seed, height, width, threshold));

  // Store random values once
  const randomValues: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => rand()));

  const thresholds: number[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => threshold));

  const board: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));

  const fillBoard = () => {
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        board[r][c] = randomValues[r][c] < thresholds[r][c];
      }
    }
  };

  const hasEmptyRowOrCol = (): boolean => {
    for (let r = 0; r < height; r++) {
      if (board[r].every((cell) => !cell)) return true;
    }
    for (let c = 0; c < width; c++) {
      let colEmpty = true;
      for (let r = 0; r < height; r++) {
        if (board[r][c]) {
          colEmpty = false;
          break;
        }
      }
      if (colEmpty) return true;
    }
    return false;
  };

  const bumpEmptyThresholds = () => {
    for (let r = 0; r < height; r++) {
      if (board[r].every((cell) => !cell)) {
        for (let c = 0; c < width; c++) {
          thresholds[r][c] = Math.min(1, thresholds[r][c] + step);
        }
      }
    }
    for (let c = 0; c < width; c++) {
      let colEmpty = true;
      for (let r = 0; r < height; r++) {
        if (board[r][c]) {
          colEmpty = false;
          break;
        }
      }
      if (colEmpty) {
        for (let r = 0; r < height; r++) {
          thresholds[r][c] = Math.min(1, thresholds[r][c] + step);
        }
      }
    }
  };

  while (true) {
    fillBoard();
    if (!hasEmptyRowOrCol()) {
      break;
    }
    bumpEmptyThresholds();
  }

  const { topHints, leftHints } = buildHints(board, height, width);

  return { board, topHints, leftHints };
}
