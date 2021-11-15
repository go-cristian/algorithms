import { Path } from './Path'

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
