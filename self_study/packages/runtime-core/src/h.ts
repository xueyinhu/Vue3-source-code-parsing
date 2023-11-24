import { isArray, isObject } from "@vue/shared"
import { createVnode, isVnode } from "./vnode"

export function h(type, propsOrChildren, children) {
  const i = arguments.length
  if (i == 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren])
      }
      return createVnode(type, propsOrChildren)
    }
    return createVnode(type, null, propsOrChildren)
  } else {
    if (i > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (i == 3 && isVnode(children)) {
      children = [children]
    }
    return createVnode(type, propsOrChildren, children)
  }
}