import { RedBlackTree } from "./RedBlackTree"

const tree: RedBlackTree<number> = new RedBlackTree()
console.log("================")
tree.append(8)
console.log("================")
tree.append(18)
console.log("================")
tree.append(5)
console.log("================")
tree.append(15)
console.log("================")
tree.append(17)
console.log("================")
tree.append(25)
console.log("================")
tree.append(40)
console.log("================")
tree.append(80)
console.log("================")
console.log(tree.toString())