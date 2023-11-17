import { extend } from "@vue/shared";
import { createRender } from "@vue/runtime-core";

import { nodeOps } from "./nodeOps";
import { patchProps } from "./patchProps";

const renderOptionDom = extend({ patchProps }, nodeOps);

export const createApp = (rootComponent, rootProps) => {
  let app = createRender(renderOptionDom).createApp(rootComponent, rootProps);
  let { mount } = app;
  app.mount = function (container) {
    container = document.querySelector(container);
    container.innerHTML = "";
    mount(container);
  };
  return app;
};
