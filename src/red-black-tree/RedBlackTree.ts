import { dLog } from '../log'
import { Tree, Node } from './types'
import { inOrder } from './utils'

export class RedBlackTree<T> implements Tree<T> {
  private root?: Node<T>

  constructor() {
    this.root = undefined
  }

  append(value: T) {
    const node = this.insertNode(this.root, undefined, value)
    dLog(`returned node: ${node.value}/${node.color}`)
    const isRoot = this.root === undefined
    // first scenario: root is undefined
    if (isRoot) {
      this.updateRoot(node)
      return
    }
    this.applyRotations(node)
  }

  getRoot() {
    return this.root
  }

  toString() {
    let result = ''

    inOrder(this.root, (node) => {
      result += `value: ${node.value}/${node.color}, parent: ${node.parent?.value}, left:${node.left?.value}, right: ${node.right?.value}\n`
    })

    return result.slice(0, -1)
  }

  private insertNode(
    node: Node<T> | undefined,
    parent: Node<T> | undefined,
    value: T,
  ): Node<T> {
    if (node === undefined) {
      dLog(`inserting ${value} with parent: ${parent?.value}`)
      return {
        value,
        parent,
        color: 'red',
        left: undefined,
        right: undefined,
      }
    } else {
      if (value < node.value){
        dLog(`trying to insert ${value} at left with parent: ${node?.value}`)
        const resultNode = this.insertNode(node.left, node, value)
        if(!node.left) {
          node.left = resultNode
        }
        return resultNode
      } else if (value > node.value) {
        dLog(`trying to insert ${value} at right with parent: ${node?.value}`)
        const resultNode = this.insertNode(node.right, node, value)
        if(!node.right) {
          node.right = resultNode
        }
        return resultNode
      }
      throw new Error('value already exists')
    }
  }

  private uncleOf(node: Node<T>): Node<T> | undefined {
    if (node === undefined) {
      return undefined
    }
    const parent = node.parent
    if (parent === undefined) {
      return undefined
    }
    const grandParent = parent.parent
    if (grandParent === undefined) {
      return undefined
    }
    if (grandParent.left === parent) {
      return grandParent.right
    } else {
      return grandParent.left
    }
  }

  private updateRoot(node: Node<T>) {
    dLog(`updating root to ${node.value}`)
    this.root = node
    this.root.color = 'black'
  }

  private applyRotations(node: Node<T>) {
    const parent = node.parent
    if(parent) dLog(`parent node: ${parent.value}/${parent.color}`)
    const isParentRed = parent?.color === 'red'

    if (isParentRed){
      dLog('isParentRed')
      const grandparent = node.parent?.parent
      const uncle = this.uncleOf(node)

      const hasRedUncle = uncle && uncle.color === 'red'
      const hasBlackUncle = uncle === undefined || uncle.color === 'black'
      // second scenario: recolor only
      if (hasRedUncle) {
        dLog('hasRedUncle')
        this.recolour(node)
      } else if (hasBlackUncle) {
        dLog('hasBlackUncle')
        const isLeftNodeInTriangle = node === parent.left && uncle === grandparent?.left
        const isRightNodeInTriangle = node === parent.right && uncle === grandparent?.right
        const isInTriangleShape = isLeftNodeInTriangle || isRightNodeInTriangle

        const isRightNodeInLine = node === parent.right && uncle === grandparent?.left
        const isLeftNodeInLine = node === parent.left && uncle === grandparent?.right
        const isInLineShape= isRightNodeInLine || isLeftNodeInLine
        // third scenario: rotate on triangle movement -> rotate parent
        if (isInTriangleShape) {
          if(isLeftNodeInTriangle) {
            dLog('isLeftNodeInTriangle')
            this.rotate2(node)
            if(node.right) this.rotate(node.right)
          }
          if(isRightNodeInTriangle) {
            dLog('isRightNodeInTriangle')
            this.rotate2(node)
            if(node.left) this.rotate(node.left)
          }
        }
        // fourth scenario: rotate on line movement -> rotate grandparent
        if (isInLineShape && grandparent) {
          if(isLeftNodeInLine) {
            dLog('isRightNodeInTriangle')
            this.rotate(node)
          }
          if(isRightNodeInLine) {
            dLog('isRightNodeInLine')
            this.rotate(node)
          }
        }
      }
    }
  }

  private rotate(node: Node<T>) {
    const parent = node.parent
    const grandParent = parent?.parent
    if (!grandParent || !parent) return

    dLog('starting rotation for:')
    dLog('node', node.value)
    dLog('parent', parent.value)
    dLog('grandParent', grandParent.value)

    const uncle = this.uncleOf(node)
    const greatGrandParent = grandParent.parent
    parent.parent = greatGrandParent
    grandParent.parent = parent
    if (greatGrandParent) {
      if (greatGrandParent.left === grandParent) {
        greatGrandParent.left = parent
      } else if (greatGrandParent.right === grandParent) {
        greatGrandParent.right = parent
      }
    }

    if (grandParent.right === uncle) {
      grandParent.left = parent.right
      parent.right = grandParent
    } else if (grandParent.left === uncle) {
      grandParent.right = parent.left
      parent.left = grandParent
    }

    this.recolour(node)
    if (grandParent && grandParent.value === this.root?.value) {
      this.updateRoot(parent)
    }
  }

  private rotate2(node: Node<T>) {
    const parent = node.parent
    const grandParent = parent?.parent
    if (!grandParent || !parent) return

    node.parent = grandParent
    parent.parent = node

    if (parent.left === node) {
      parent.left = node.right
      node.right = parent
      grandParent.right = node
    } else if (parent.right === node) {
      const aux = parent.left
      parent.left = node.left
      parent.right = node.right
      node.left = parent
      node.right = aux
      grandParent.left = node
    }
  }

  private recolour(node: Node<T>) {
    dLog(`applying recoloring on ${node.value}`)
    const parent = node.parent
    const grandParent = parent?.parent
    const uncle = this.uncleOf(node)

    if(uncle) uncle.color = 'black'
    if(parent) parent.color = 'black'
    if(grandParent && grandParent !== this.root) grandParent.color = 'red'
    if(parent?.left) parent.left.color = 'red'
    if(parent?.right) parent.right.color = 'red'

    const greatGrandParent = grandParent?.parent
    dLog('greatGrandParent color', greatGrandParent?.color)
    if(greatGrandParent && greatGrandParent.color === 'red' && grandParent.color === 'red') {
      this.applyRotations(grandParent)
    }
  }
}
