"use strict";
/// AStar.ts
// Algorithme A* pour grille pondérée (4 directions)
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPath = findPath;
function findPath(grid) {
    var _a, _b;
    var H = grid.length;
    var W = (_b = (_a = grid[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    if (!H || !W)
        return null;
    // local utilities
    var inBounds = function (x, y) { return x >= 0 && y >= 0 && x < H && y < W; };
    // locate start/end
    var start = null;
    var end = null;
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            if (grid[i][j] === 'start')
                start = [i, j];
            if (grid[i][j] === 'end')
                end = [i, j];
        }
    }
    if (!start || !end)
        return null;
    var sx = start[0], sy = start[1];
    var ex = end[0], ey = end[1];
    // coût minimal par pas (dans l'INSTANCE courante)
    var stepMin = Infinity;
    for (var i = 0; i < H; i++) {
        for (var j = 0; j < W; j++) {
            var v = grid[i][j];
            if (typeof v === 'number')
                stepMin = Math.min(stepMin, v);
        }
    }
    if (!isFinite(stepMin))
        stepMin = 1; // défaut si aucune pondération n'est présente
    // heuristique admissible & consistante : Manhattan * stepMin
    var heuristic = function (x, y) {
        return (Math.abs(x - ex) + Math.abs(y - ey)) * stepMin;
    };
    var open = [];
    var closed = Array.from({ length: H }, function () { return Array(W).fill(false); });
    var h0 = heuristic(sx, sy);
    open.push({ x: sx, y: sy, g: 0, h: h0, f: h0 });
    var directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    while (open.length > 0) {
        // extrait le nœud au plus petit f
        open.sort(function (a, b) { return a.f - b.f; });
        var current = open.shift();
        var x = current.x, y = current.y;
        if (x === ex && y === ey) {
            // reconstruit le chemin
            var path = [];
            var n = current;
            while (n) {
                path.push([n.x, n.y]);
                n = n.parent;
            }
            return { path: path.reverse(), cost: current.g };
        }
        if (closed[x][y])
            continue;
        closed[x][y] = true;
        var _loop_1 = function (dx, dy) {
            var nx = x + dx, ny = y + dy;
            if (!inBounds(nx, ny))
                return "continue";
            if (closed[nx][ny])
                return "continue";
            var cell = grid[nx][ny];
            if (cell === null)
                return "continue"; // obstacle
            var step = typeof cell === 'number' ? cell : 1; // coût pour entrer dans la case
            var g = current.g + step;
            var h = heuristic(nx, ny);
            var f = g + h;
            // vérifie si déjà dans open
            var existingIdx = open.findIndex(function (n) { return n.x === nx && n.y === ny; });
            if (existingIdx >= 0) {
                if (g < open[existingIdx].g) {
                    open[existingIdx].g = g;
                    open[existingIdx].h = h;
                    open[existingIdx].f = f;
                    open[existingIdx].parent = current;
                }
            }
            else {
                open.push({ x: nx, y: ny, g: g, h: h, f: f, parent: current });
            }
        };
        for (var _i = 0, directions_1 = directions; _i < directions_1.length; _i++) {
            var _c = directions_1[_i], dx = _c[0], dy = _c[1];
            _loop_1(dx, dy);
        }
    }
    return null; // pas de chemin
}
// Export pour UMD (browser/node compatible)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findPath: findPath };
}
else if (typeof window !== 'undefined') {
    window.AStar = { findPath: findPath };
}
//dans la distance Manhattan ne jamais mettre de pondération fixe,
// toujours la recherhcer dans la grille
