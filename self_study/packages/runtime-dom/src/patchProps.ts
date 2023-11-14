import { patchAttr } from "./modules/attrs"
import { patchClass } from "./modules/class"
import { patchEvent } from "./modules/event"
import { patchStyle } from "./modules/style"

export const patchProps = (el, key, prevValue, nextValue) => {
  switch(key) {
    case 'class':
      patchClass(el, nextValue)
      break
    case 'style':
      patchStyle(el, prevValue, nextValue)
      break
    default:
      if (/^on[^a-z]/) {
        patchEvent(el, key, nextValue)
      } else {
        patchAttr(el, key, nextValue)
      }
      break
  }
}