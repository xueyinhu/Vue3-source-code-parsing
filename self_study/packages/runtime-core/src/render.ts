import { ShapeFlags } from '@vue/shared';
import { ApiCreateApp } from './apiCreateApp';
import { effect } from '@vue/reactivity'
import { createComponentInstance, setupComponent } from './component';

export function createRender(renderOptionDom) {
  const setupRenderEffect = (instance) => {
    effect(function componentEffect() {
      if (!instance.isMounted) {
        let proxy = instance.proxy
        instance.render.call(proxy, proxy)
      }
    })
  }
  const mountComponent = (initialVnode, container) => {
    const instance = initialVnode.component = createComponentInstance(initialVnode)
    setupComponent(instance)
    setupRenderEffect(instance)
  }
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container)
    } else {

    }
  }
  const patch = (n1, n2, container) => {
    let {shapeFlag} = n2
    if (shapeFlag & ShapeFlags.ELEMENT) {

    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n1, n2, container)
    }
  }
  let render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: ApiCreateApp(render)
  }
}
