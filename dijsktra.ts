export default function dijkstra(graph: Object, start: String) {
	const distances = {};
	const visited = new Set();
	const queue = [start];

	for (let node in graph) {
		distances[node] = Infinity;
	}

	distances[start] = 0;

	while (queue.length > 0) {
		let currentNode = queue.shift();
		if (visited.has(currentNode)) continue;
		visited.add(currentNode);
		let neighbors = graph[currentNode];
		for (let neighbor in neighbors) {
			let newDist = distances[currentNode] + neighbors[neighbor];
			if (newDist < distances[neighbor]) {
				distances[neighbor] = newDist;
				queue.push(neighbor);
			}
		}
	}
	return distances;
}
