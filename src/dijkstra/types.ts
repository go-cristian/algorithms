export type Edge = {
  from: string;
  to: string;
  distance: number;
}
export type Graph = Edge[]
export type DistanceRef = {[key: string]: number}
