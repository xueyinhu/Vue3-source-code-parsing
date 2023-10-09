import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared';
import { reactive, readonly } from "./reactive"
import { TrackOpType, TriggerOpTypes } from './operations';
import { Track } from './effect';

function createGetter(isReadonly=false, shallow=false) {
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

function createSetter(shallow=false) {
    return function set(target, key, value, receiver) {
        const result = Reflect.set(target, key, value, receiver)
        const oldValue = target[key]
        let hasKey = isArray(target) && isIntegerKey(key)? Number(key) < target.length : hasOwn(target, key)
        if (!hasKey) {
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else {
            if (hasChange(value, oldValue)) {
                trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }
        }
    }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

export const reactiveHandlers = {
    get,
    set
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
export const readonlyHandlers = {
    get: readonlyGet,
    set: (target, key, value) => {
        console.log(`readonly, target: ${target}, key: ${key}, value: ${value}`);
    }
}
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set: (target, key, value) => {
        console.log(`readonly, target: ${target}, key: ${key}, value: ${value}`);
    }
}