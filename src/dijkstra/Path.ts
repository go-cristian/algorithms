import { DistanceRef, Edge, Graph } from "./types"

export class Path {

  private debug: boolean
  private vertices: Set<string>
  private edges: { [key: string]: Set<string> }
  private distances: { [key: string]: number }

  /**
   * @param {object} An object with the graph edges and vertices
   * Every edge is an object with the properties from, to and distance
   */
  constructor(graph: Graph, debug: boolean = false) {
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

  /**
   *
   * @param {string} The label of the starting vertex
   * @param {string} The label of the end vertex
   * @returns {object} An object with the shortest path and the distance
   */
  distance(initial: string, destination: string) {
    const visited = new Set()
    const nonVisited = new Set(this.vertices)

    const distanceTo: DistanceRef = {}
    const reverseConnections: {[key: string]: string} = {}
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

  minDistance(distanceTo: DistanceRef, nonVisited: Set<string>) {
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

  addVertex(vertex: string) {
    this.vertices.add(vertex)
  }

  addEdge(edge: Edge) {
    if (!this.edges[edge.from]) {
      this.edges[edge.from] = new Set()
    }
    if (!this.edges[edge.to]) {
      this.edges[edge.to] = new Set()
    }
    this.edges[edge.from].add(edge.to)
    this.edges[edge.to].add(edge.from)
  }
}
