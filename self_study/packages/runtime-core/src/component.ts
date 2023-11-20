import { ShapeFlags, isFunction, isObject } from '@vue/shared';
import { ComponentPublicInstance } from './componentPublicInstance';

export const createComponentInstance = (vnode) => {
  const instance = {
    vnode,
    type: vnode.type,
    props: {},
    attrs: {},
    setupState: {},
    ctx: {},
    proxy: {},
    data: {},
    render: false,
    isMounted: false
  }
  instance.ctx = {_: instance}
  return instance
}

function handlerSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  let Component = instance.type
  if (!instance.render) {
    if (!Component.render && Component.template) {

    }
    instance.render = Component.render
  }
}

function setUpStateComponent(instance) {
  instance.proxy = new Proxy(instance.ctx, ComponentPublicInstance as any)
  let Component = instance.type
  let { setup } = Component
  if (setup) {
    let setupContext = createContext(instance)
    let setupResult = setup(instance.props, setupContext)
    handlerSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance)
  }
  Component.render(instance.proxy)
}

function createContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {}
  }
}

export const setupComponent = (instance) => {
  const {props, children} = instance.vnode
  instance.props = props
  instance.children = children
  let shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
  if (shapeFlag) {
    setUpStateComponent(instance)
  }
}
