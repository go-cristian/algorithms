import { Node } from './types'

export function inOrder<T>(
  node: Node<T> | undefined,
  callback: (node: Node<T>,
) => void) {
  if (node === undefined) {
    return
  }
  callback(node)
  inOrder(node?.left, callback)
  inOrder(node?.right, callback)
}
