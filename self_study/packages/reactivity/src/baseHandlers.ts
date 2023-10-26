import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared';
import { reactive, readonly } from "./reactive"
import { TrackOpType, TriggerOpTypes } from './operations';
import { Track, trigger } from './effect';

// 函数柯里化

// 根据参数返回对应的 get 函数
function createGetter(isReadonly=false, shallow=false) {
    // 返回 get 函数
    return function get(target, key, receiver) {
        const res = Reflect.get(target, key, receiver)
        if (!isReadonly) {
            Track(target, TrackOpType.GET, key)
        }
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            return isReadonly? readonly(res): reactive(res)
        }
        return res
    }
}

// 根据参数返回对应的 set 函数
function createSetter(shallow=false) {
    // 返回 set 函数
    return function set(target, key, value, receiver) {
        const oldValue = target[key]
        let hasKey = isArray(target) && isIntegerKey(key)? Number(key) < target.length : hasOwn(target, key)
        Reflect.set(target, key, value, receiver)
        if (!hasKey) {
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else {
            if (hasChange(value, oldValue)) {
                trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }
        }
    }
}

// 生成 reactiveHandlers 对应的 get 函数
const get = createGetter()
// 生成 shallowReactiveHandlers 对应的 get 函数
const shallowGet = createGetter(false, true)
// 生成 readonlyHandlers 对应的 get 函数
const readonlyGet = createGetter(true)
// 生成 shallowReadonlyHandlers 对应的 get 函数
const shallowReadonlyGet = createGetter(true, true)

// 生成 reactiveHandlers 对应的 set 函数
const set = createSetter()
// 生成 shallowReactiveHandlers 对应的 set 函数
const shallowSet = createSetter(true)
// readonlyHandlers 与 shallowReadonlyHandlers 不允许对值进行写入

// 生成 reactive 对应的 handlers
export const reactiveHandlers = {
    get,
    set
}
// 生成 shallowReactive 对应的 handlers
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
// 生成 readonly 对应的 handlers
export const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key, value) => {
        console.log(`readonly, target: ${target}, key: ${key}, value: ${value}`);
    }
}
// 生成 shallowReadonly 对应的 handlers
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key, value) => {
        console.log(`readonly, target: ${target}, key: ${key}, value: ${value}`);
    }
}