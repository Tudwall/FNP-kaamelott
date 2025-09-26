/// AStar.ts
// Algorithme A* pour grille pondérée (4 directions)

export type CellType = number | null | 'start' | 'end';
export type GridType = CellType[][];

interface Node {
  x: number;
  y: number;
  g: number; // coût depuis le départ
  h: number; // heuristique (minorant du coût restant)
  f: number; // g + h
  parent?: Node;
}

export function findPath(grid: GridType): { path: [number, number][], cost: number } | null {
  const H = grid.length;
  const W = grid[0]?.length ?? 0;
  if (!H || !W) return null;

  // local utilities
  const inBounds = (x: number, y: number) => x >= 0 && y >= 0 && x < H && y < W;

  // locate start/end
  let start: [number, number] | null = null;
  let end: [number, number] | null = null;
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      if (grid[i][j] === 'start') start = [i, j];
      if (grid[i][j] === 'end') end = [i, j];
    }
  }
  if (!start || !end) return null;
  const [sx, sy] = start;
  const [ex, ey] = end;

  // coût minimal par pas (dans l'INSTANCE courante)
  let stepMin = Infinity;
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      const v = grid[i][j];
      if (typeof v === 'number') stepMin = Math.min(stepMin, v);
    }
  }
  if (!isFinite(stepMin)) stepMin = 1; // défaut si aucune pondération n'est présente

  // heuristique admissible & consistante : Manhattan * stepMin
  const heuristic = (x: number, y: number) =>
    (Math.abs(x - ex) + Math.abs(y - ey)) * stepMin;

  const open: Node[] = [];
  const closed: boolean[][] = Array.from({ length: H }, () => Array(W).fill(false));

  const h0 = heuristic(sx, sy);
  open.push({ x: sx, y: sy, g: 0, h: h0, f: h0 });

  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0]
  ] as const;

  while (open.length > 0) {
    // extrait le nœud au plus petit f
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const { x, y } = current;

    if (x === ex && y === ey) {
      // reconstruit le chemin
      const path: [number, number][] = [];
      let n: Node | undefined = current;
      while (n) { path.push([n.x, n.y]); n = n.parent; }
      return { path: path.reverse(), cost: current.g };
    }

    if (closed[x][y]) continue;
    closed[x][y] = true;

    for (const [dx, dy] of directions) {
      const nx = x + dx, ny = y + dy;
      if (!inBounds(nx, ny)) continue;
      if (closed[nx][ny]) continue;

      const cell = grid[nx][ny];
      if (cell === null) continue; // obstacle

      const step = typeof cell === 'number' ? cell : 1; // coût pour entrer dans la case
      const g = current.g + step;
      const h = heuristic(nx, ny);
      const f = g + h;

      // vérifie si déjà dans open
      const existingIdx = open.findIndex(n => n.x === nx && n.y === ny);
      if (existingIdx >= 0) {
        if (g < open[existingIdx].g) {
          open[existingIdx].g = g;
          open[existingIdx].h = h;
          open[existingIdx].f = f;
          open[existingIdx].parent = current;
        }
      } else {
        open.push({ x: nx, y: ny, g, h, f, parent: current });
      }
    }
  }

  return null; // pas de chemin
}


//dans la distance Manhattan ne jamais mettre de pondération fixe,
// toujours la recherhcer dans la grille