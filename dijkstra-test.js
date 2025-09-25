// Autre façon de faire

class PriorityQueue {
	constructor() {
		this.values = [];
	}

	enqueue(element, priority) {
		this.values.push({ element, priority });
		this.sort();
	}

	dequeue() {
		return this.values.shift();
	}

	sort() {
		this.values.sort((a, b) => a.priority - b.priority);
	}

	isEmpty() {
		return this.values.length === 0;
	}
}

function dijkstra(graph, source) {
	const distances = {};
	const prev = {};
	const pq = new PriorityQueue();

	for (let vertex in graph.adjacencyList) {
		distances[vertex] = Infinity;
		prev[vertex] = null;
	}

	distances[source] = 0;
	pq.enqueue(source, 0);

	while (!pq.isEmpty()) {
		const { element: vertex } = pq.dequeue();
		const neighbors = graph.getNeighbors(vertex);

		for (let neighbor of neighbors) {
			const alt = distances[vertex] + neighbor.weight;
			if (alt < distances[neighbor.node]) {
				distances[neighbor.node] = alt;
				prev[neighbor.node] = vertex;
				pq.enqueue(neighbor.node, alt);
			}
		}
	}
	return { distances, prev };
}

//Ne pas remettre de chemin vers le point de départ, et laisser le point d'arrivée vide.
const graph = {
	adjacencyList: {
		A: [
			{ node: "B", weight: 4 },
			{ node: "C", weight: 2 },
		],
		B: [
			{ node: "C", weight: 5 },
			{ node: "D", weight: 10 },
		],
		C: [
			{ node: "D", weight: 3 },
			{ node: "E", weight: 2 },
		],
		D: [{ node: "E", weight: 4 }],
		E: [],
	},
	getNeighbors(vertex) {
		return this.adjacencyList[vertex];
	},
};

const graph2 = {
	adjacencyList: {
		A: [
			{ node: "B", weight: 1 },
			{ node: "C", weight: 2 },
		],
		B: [
			{ node: "C", weight: 2 },
			{ node: "D", weight: 2 },
		],
		C: [
			{ node: "B", weight: 2 },
			{ node: "D", weight: 2 },
		],
		D: [
			{ node: "B", weight: 2 },
			{ node: "C", weight: 1 },
			{ node: "E", weight: 3 },
			{ node: "F", weight: 4 },
			{ node: "G", weight: 1 },
		],
		E: [
			{ node: "B", weight: 3 },
			{ node: "D", weight: 3 },
			{ node: "G", weight: 3 },
		],
		F: [
			{ node: "D", weight: 4 },
			{ node: "G", weight: 1 },
		],
		G: [],
	},
	getNeighbors(vertex) {
		return this.adjacencyList[vertex];
	},
};

const result = dijkstra(graph, "A");
console.log(result.distances); // { A: 0, B: 4, C: 2, D: 5, E: 4 }
console.log(result.prev); // { A: null, B: 'A', C: 'A', D: 'C', E: 'C' }

const result2 = dijkstra(graph2, "A");
console.log("distances: " + JSON.stringify(result2.distances));
console.log("Prédécesseurs: " + JSON.stringify(result2.prev));
