import { createVnode } from "./vnode"

export const ApiCreateApp = (render) => {
  return function createApp(rootComponent, rootProps) {
    let app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container) {
        let vnode = createVnode(rootComponent, rootProps)
        console.log(vnode);
        render(vnode, container)
        app._container = container
      }
    }
    return app
  }
}