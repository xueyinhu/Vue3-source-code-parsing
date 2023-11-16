import { ApiCreateApp } from './apiCreateApp';

export function createRender(renderOptionDom) {
  let render = (vnode, container) => {}
  return {
    createApp: ApiCreateApp(render)
  }
}
