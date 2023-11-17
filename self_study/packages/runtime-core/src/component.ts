export const createComponentInstance = (vnode) => {
  const instance = {
    vnode,
    props: {},
    attrs: {},
    setupState: {},
    ctx: {},
    proxy: {},
    isMounted: false
  }
  instance.ctx = {_: instance}
  return instance
}

export const setupComponent = (instance) => {
  const {props, children} = instance.vnode
  instance.props = props
  instance.children = children
}

export const setupRenderEffect = () => {

}
