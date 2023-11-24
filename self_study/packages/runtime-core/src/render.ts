import { ShapeFlags } from '@vue/shared';
import { ApiCreateApp } from './apiCreateApp';
import { effect } from '@vue/reactivity'
import { createComponentInstance, setupComponent } from './component';
import { TEXT, cVnode } from './vnode';

export function createRender(renderOptionDom) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProps: hostPatchProps,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComponent: hostCreateComponent,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = renderOptionDom
  const setupRenderEffect = (instance, container) => {
    effect(function componentEffect() {
      if (!instance.isMounted) {
        let proxy = instance.proxy
        let subTree = instance.subTree = instance.render.call(proxy, proxy)
        patch(null, subTree, container)
        instance.isMounted = true
      } else {
        let proxy  = instance.proxy
        const prevTree = instance.subTree
        const nextTree = instance.render.call(proxy, proxy)
        instance.subTree = nextTree
        patch(prevTree, nextTree, container)
      }
    })
  }
  const mountComponent = (initialVnode, container) => {
    const instance = initialVnode.component = createComponentInstance(initialVnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  function processText(n1, n2, container) {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container)
    }
  }
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container)
    } else {
    }
  }
  function mountChildren(el, children) {
    for (let i = 0; i < children.length; i++) {
      let child = cVnode(children[i])
      patch(null, child, el)
    }
  }
  function mountElement(vnode, container) {
    const {props, shapeFlag, type, children} = vnode
    let el = vnode.el = hostCreateElement(type)
    if (props) {
      for (let key in props) {
        hostPatchProps(el, key, null, props[key])
      }
    }
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, children)
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(el, children)
      }
    }
    hostInsert(el, container)
  }
  const patchProps = (el, oldProps, newProps) => {
    if (oldProps != newProps) {
      for (let key in newProps) {
        const prev = oldProps[key]
        const next = newProps[key]
        if (prev != next) {
          hostPatchProps(el, key, prev, next)
        }
      }
    }
    for (let key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProps(el, key, oldProps[key], null)
      }
    }
  }
  const patchChild = (n1, n2, el) => {
    const c1 = n1.children
    const c2 = n2.children
    const prevShapeFlag = n1.shapeFlag
    const nextShapeFlag = n2.shapeFlag
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, c2)
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        patchKeyChild(c1, c2, el)
      } else {
        hostSetElementText(el, '')
        mountChildren(el, c2)
      }
    }
  }
  const patchKeyChild = (c1, c2, el) => {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSomeVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      i ++
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSomeVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1 --
      e2 --
    }
  }
  const patchElement = (n1, n2, container) => {
    let el = (n2.el = n1.el)
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    patchProps(el, oldProps, newProps)
    patchChild(n1, n2, el)
  }
  function processElement(n1, n2, container) {
    if (n1 == null) {
      mountElement(n2, container)
    } else {
      patchElement(n1, n2, container)
    }
  }
  const isSomeVnode = (n1, n2) => {
    return n1.type == n2.type && n1.key == n2.key
  }
  const unmount = (vnode) => {
    hostRemove(vnode.el)
  }
  const patch = (n1, n2, container) => {
    if (n1 && !isSomeVnode(n1, n2)) {
      unmount(n1)
      n1 = null
    }
    let {shapeFlag, type} = n2
    switch(type) {
      case TEXT:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container)
        }
    }
  }
  let render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: ApiCreateApp(render)
  }
}
