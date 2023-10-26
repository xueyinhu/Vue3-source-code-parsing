import { isObject } from "@vue/shared"
import {
    reactiveHandlers,
    shallowReactiveHandlers,
    readonlyHandlers,
    shallowReadonlyHandlers
} from './baseHandlers'

// 函数柯里化

// 对象 的 响应式代理
export function reactive(target) {
    return createReactObj(target, false, reactiveHandlers)
}
// 对象 的 浅层 响应式代理
export function shallowReactive(target) {
    return createReactObj(target, false, shallowReactiveHandlers)
}
// 对象 的 只读式代理
export function readonly(target) {
    return createReactObj(target, true, readonlyHandlers)
}
// 对象 的 浅层 只读式代理
export function shallowReadonly(target) {
    return createReactObj(target, true, shallowReadonlyHandlers)
}

// 响应 - 创建存储对应 target 的 proxy 对象的 WeakMap
const reactiveMap = new WeakMap()
// 只读 - 创建存储对应 target 的 proxy 对象的 WeakMap
const readonlyMap = new WeakMap()

// 为 Object 类型的值创建 Proxy 对象并进行存储
function createReactObj(target, isReadonly, baseHandlers) {
    // 确保 target 是 Object 类型
    if (!isObject(target)) {
        return target
    }
    // 判断可读性，进而确定可能包含其 proxy 对象的 WeakMap
    const proxyMap = isReadonly ? readonlyMap : reactiveMap
    // 若在 proxyMap 中找到 target 对应的 proxy 对象
    const proxyEs = proxyMap.get(target)
    // 则直接返回
    if (proxyEs) {
        return proxyEs
    }
    // 若不存在，则创建新的 proxy 对象
    const proxy = new Proxy(target, baseHandlers)
    // 并添加到 proxyMap 中
    proxyMap.set(target, proxy)
    // 返回 proxy
    return proxy
}
