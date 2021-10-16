class Path {

  constructor(graph, debug = false) {
    this.debug = debug
    this.vertices = new Set()
    this.edges = {}
    this.distances = {}
    graph.forEach(edge => {
      this.addVertex(edge.from)
      this.addVertex(edge.to)
      this.addEdge(edge)
      this.distances[`${edge.from}-${edge.to}`] = edge.distance
    })
    if (this.debug) {
      console.log('vertices', this.vertices)
      console.log('edges', this.edges)
      console.log('distances', this.distances)
    }
  }

  addVertex(vertex) {
    this.vertices.add(vertex)
  }

  addEdge(edge) {
    if (!this.edges[edge.from]) {
      this.edges[edge.from] = new Set()
    }
    if (!this.edges[edge.to]) {
      this.edges[edge.to] = new Set()
    }
    this.edges[edge.from].add(edge.to)
    this.edges[edge.to].add(edge.from)
  }

  get length() {
    return this.vertices.size
  }

  distance(initial, destination) {
    const visited = new Set()
    const nonVisited = new Set(this.vertices)

    const distanceTo = {}
    const reverseConnections = {}
    this.vertices.forEach(vertex => {
      distanceTo[vertex] = Number.MAX_VALUE
    })
    distanceTo[initial] = 0

    while (nonVisited.size !== 0) {
      const current = this.minDistance(distanceTo, nonVisited)
      if (this.debug) { console.log('current', current) }
      if (current === null) break

      const neighbors = this.edges[current] ?? []
      neighbors.forEach(vertex => {
        const distance = this.distances[`${current}-${vertex}`] ?? this.distances[`${vertex}-${current}`] ?? Number.MAX_VALUE
        const newDistance = distanceTo[current] + distance
        if (newDistance < distanceTo[vertex]) {
          distanceTo[vertex] = newDistance
          reverseConnections[vertex] = current
        }
      })
      visited.add(current)
      nonVisited.delete(current)
      if (this.debug) { console.log('distanceTo', distanceTo) }

    }
    if (this.debug) { console.log('reverseConnections', reverseConnections) }

    const path = []
    let current = destination
    path.push(current)
    while (current !== initial) {
      current = reverseConnections[current]
      path.push(current)
    }

    return {
      distance: distanceTo[destination],
      path,
    }
  }

  minDistance(distanceTo, nonVisited) {
    let min = Number.MAX_VALUE
    let nextVertex = null
    nonVisited.forEach(vertex => {
      if (distanceTo[vertex] < min) {
        min = distanceTo[vertex]
        nextVertex = vertex
      }
    })
    return nextVertex
  }
}

const path = new Path([
  { from: '0', to: '1', distance: 4 },
  { from: '0', to: '7', distance: 8 },
  { from: '1', to: '7', distance: 11 },
  { from: '1', to: '2', distance: 8 },
  { from: '7', to: '6', distance: 1 },
  { from: '7', to: '8', distance: 7 },
  { from: '2', to: '8', distance: 2 },
  { from: '6', to: '8', distance: 6 },
  { from: '6', to: '5', distance: 2 },
  { from: '2', to: '3', distance: 7 },
  { from: '2', to: '5', distance: 4 },
  { from: '3', to: '5', distance: 14 },
  { from: '3', to: '4', distance: 9 },
  { from: '5', to: '4', distance: 10 },
])
console.log(path.distance('0', '4'))
