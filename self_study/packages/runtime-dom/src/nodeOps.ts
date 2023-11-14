export const nodeOps = {
  createElement: tagname => document.createElement(tagname),
  remove: child => {
    let parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  insert: (child, parent, anchor=null) => {
    parent.insertBefore(child, anchor)
  },
  querySelector: select => document.querySelector(select),
  setElementText: (el, text) => el.textContent = text,
  createText: (el, text) => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text
}