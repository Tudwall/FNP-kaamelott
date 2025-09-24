

type Point = { x: number; y: number };

function manhattan(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


function aStar(grid: number[][], start: Point, end: Point): Point[] {
    const size = grid.length;
    type Node = { point: Point; f: number; g: number };
    const open: Node[] = [{ point: start, f: manhattan(start, end), g: 0 }];
    const closed = Array.from({ length: size }, () => Array(size).fill(false));
    const parents: (Point | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
    const gScores = Array.from({ length: size }, () => Array(size).fill(Infinity));
    gScores[start.x][start.y] = 0;

    while (open.length > 0) {
        let minIdx = 0;
        for (let i = 1; i < open.length; i++) {
            if (open[i].f < open[minIdx].f) minIdx = i;
        }
        const current = open.splice(minIdx, 1)[0];
        const { point, g } = current;
        if (point.x === end.x && point.y === end.y) {
            const path: Point[] = [];
            let p: Point | null = end;
            while (p) {
                path.push(p);
                p = parents[p.x][p.y];
            }
            return path.reverse();
        }
        closed[point.x][point.y] = true;
        for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
            const nx = point.x + dx;
            const ny = point.y + dy;
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
            if (closed[nx][ny]) continue;
            const tentativeG = g + grid[nx][ny];
            if (tentativeG < gScores[nx][ny]) {
                gScores[nx][ny] = tentativeG;
                parents[nx][ny] = point;
                open.push({
                    point: { x: nx, y: ny },
                    g: tentativeG,
                    f: tentativeG + manhattan({ x: nx, y: ny }, end)
                });
            }
        }
    }
    return [];
}


const size = 25;
const grid: number[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.round((Math.random() * 0.9 + 0.1) * 10) / 10)
);
const start: Point = { x: Math.floor(size/2), y: Math.floor(size/2) };
const end: Point = { x: size-1, y: 0 };
const path = aStar(grid, start, end);
console.log('Chemin trouvé :', path);