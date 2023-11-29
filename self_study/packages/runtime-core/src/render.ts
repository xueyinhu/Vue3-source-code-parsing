import { ShapeFlags } from '@vue/shared';
import { ApiCreateApp } from './apiCreateApp';
import { effect } from '@vue/reactivity'
import { createComponentInstance, setupComponent } from './component';
import { TEXT, cVnode } from './vnode';
import { invokeArrayFns } from './apiLifecycle';

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
        let {bm, m} = instance
        if (bm) {
          invokeArrayFns(bm)
        }
        let proxy = instance.proxy
        let subTree = instance.subTree = instance.render.call(proxy, proxy)
        patch(null, subTree, container)
        if (m) {
          invokeArrayFns(m)
        }
        instance.isMounted = true
      } else {
        let {bu, u} = instance
        if (bu) {
          invokeArrayFns(bu)
        }
        let proxy  = instance.proxy
        const prevTree = instance.subTree
        const nextTree = instance.render.call(proxy, proxy)
        instance.subTree = nextTree
        patch(prevTree, nextTree, container)
        if (u) {
          invokeArrayFns(u)
        }
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
  function mountElement(vnode, container, anchor) {
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
    hostInsert(el, container, anchor)
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
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSomeVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1 --
      e2 --
    }
    if (i > e1) {
      const nextPros = e2 + 1
      const anchor = nextPros < c2.length ? c2[nextPros].el : null
      while (i <= e2) {
        patch(null, c2[i++], el, anchor)
      }
    } else if (i > e2) {
      while(i <= e1) {
        unmount(c1[i++])
      }
    } else {
      let s1 = i
      let s2 = i
      const toBePatched = e2 - s2 + 1
      const newIndexToPatchMap = new Array(toBePatched).fill(0)
      let keyIndexMap = new Map()
      for (let i = s2; i <= e2; i++) {
        const childVnode = c2[i]
        keyIndexMap.set(childVnode.key, i)
      }
      for (let i = s1; i <= e1; i++) {
        const oldChildVnode = c1[i]
        let newIndex = keyIndexMap.get(oldChildVnode.key)
        if (newIndex == undefined) {
          unmount(oldChildVnode)
        } else {
          newIndexToPatchMap[newIndex - s2] = i + 1
          patch(oldChildVnode, c2[newIndex], el)
        }
      }
      let increasingNewIndexSequence = getSequence(newIndexToPatchMap)
      let j = increasingNewIndexSequence.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        let currentIndex = i + s2
        let child = c2[currentIndex]
        let anchor = currentIndex + 1 < c2.length ? c2[currentIndex].el : null
        if (newIndexToPatchMap[i] == 0) {
          patch(null, child, el, anchor)
        } else {
          if (i != increasingNewIndexSequence[j]) {
            hostInsert(child.el, el, anchor)
          } else {
            j --
          }
        }
      }
    }
  }
  const patchElement = (n1, n2, container, anchor) => {
    let el = (n2.el = n1.el)
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    patchProps(el, oldProps, newProps)
    patchChild(n1, n2, el)
  }
  function processElement(n1, n2, container, anchor) {
    if (n1 == null) {
      mountElement(n2, container, anchor)
    } else {
      patchElement(n1, n2, container, anchor)
    }
  }
  const isSomeVnode = (n1, n2) => {
    return n1.type == n2.type && n1.key == n2.key
  }
  const unmount = (vnode) => {
    hostRemove(vnode.el)
  }
  const patch = (n1, n2, container, anchor=null) => {
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
          processElement(n1, n2, container, anchor)
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

function getSequence(arr) {
  let len = arr.length
  const result = [0]
  let sat, end, mid
  let p = arr.slice(0)
  for (let i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI != 0) {
      let resultLastIndex = result[result.length - 1]
      if (arr[resultLastIndex] < arrI) {
        p[i] = resultLastIndex
        result.push(i)
        continue
      }
      sat = 0
      end = result.length - 1
      while (sat < end) {
        mid = ((sat + end) / 2) | 0
        if (arr[result[mid]] < arrI) {
          sat = mid + 1
        } else {
          end = mid
        }
      }
      if (arrI < arr[result[sat]]) {
        if (sat > 0) {
          p[i] = result[sat - 1]
        }
        result[sat] = i
      }
    }
  }
  let rlen = result.length
  let last = result[rlen - 1]
  while (rlen --) {
    result[rlen] = last
    last = p[last]
  }
  return result
}
