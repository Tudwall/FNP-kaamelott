function dijkstra(
	graph: { [key: string]: { [key: string]: number } },
	start: string
): {} {
	const distances: { [key: string]: number } = {};
	const visited = new Set();
	const path = new Set();
	const queue = [start];

	for (let node in graph) {
		distances[node] = Infinity;
	}

	distances[start] = 0;

	while (queue.length > 0) {
		let currentNode: any = queue.shift();
		if (visited.has(currentNode)) continue;
		visited.add(currentNode);
		let neighbors = graph[currentNode];
		for (let neighbor in neighbors) {
			let newDist = distances[currentNode] + neighbors[neighbor];
			if (newDist < distances[neighbor]) {
				distances[neighbor] = newDist;
				path.add(currentNode);
				queue.push(neighbor);
			}
		}
	}
	return path;
}

const graph = {
	A: { B: 1, C: 2 },
	B: { A: 1, C: 2, D: 2, E: 3 },
	C: { A: 2, B: 2, D: 1 },
	D: { B: 2, C: 1, E: 3, F: 4 },
	E: { B: 3, D: 3, G: 3 },
	F: { D: 4, G: 1 },
	G: { E: 3, F: 1 },
};

console.log(dijkstra(graph, "A"));

export default dijkstra;
