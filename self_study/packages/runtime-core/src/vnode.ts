import { ShapeFlags, isArray, isObject, isString } from "@vue/shared"

export const createVnode = (type, props, children=null) => {
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0
  const vnode = {
    _v_isVnode: true,
    type,
    props,
    children,
    key: props && props.key,
    el: null,
    shapeFlag
  }
  normalizeChildren(vnode, children)
  return vnode
}

function normalizeChildren(vnode, children) {
  let type = 0
  if (children == null) {
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.shapeFlag = vnode.shapeFlag | type
}

