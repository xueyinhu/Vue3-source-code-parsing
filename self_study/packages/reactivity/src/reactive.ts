import { isObject } from "@vue/shared"
import {
    reactiveHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'

export function reactive(target) {
    return createReactObj(target, false, reactiveHandlers)
}
export function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    return createReactObj(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers)
}
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()
function createReactObj(target, isReadonly, baseHandlers) {
    if (!isObject(target)) {
        return target
    }
    const proxyMap = isReadonly ? readonlyMap : reactiveMap
    const proxyEs = proxyMap.get(target)
    if (proxyEs) {
        return proxyEs
    }
    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy)
    return proxy
}
