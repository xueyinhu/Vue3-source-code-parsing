/** 提供实现 reactive 功能的对应 Handlers
 * 主要提供 getter 与 setter 函数的实现与劫持
 * 
 * 若为只读：
 *  getter: 单纯返回值，若 shallow==true 以及 type(target)==Object，则递归进行 readOnly 设置
 *  setter：不允许
 * 若为响应：
 *  getter: 与只读类似，但是通过 Track 函数收集依赖
 *  setter: 通过 trigger 函数响应式更新所有依赖
 */

import { hasOwn, isArray, isIntegerKey, isObject, hasChange } from '@vue/shared';
import { reactive, readonly } from "./reactive"
import { TrackOpType, TriggerOpTypes } from './operations';
import { Track, trigger } from './effect';

// 函数柯里化

// 根据参数返回对应的 get 函数
function createGetter(isReadonly=false, shallow=false) {
    // 返回 get 函数
    return function get(target, key, receiver) {
        /** 为什么使用 proxy 而不是 target[key]
         * Reflect.get 能明确 this 的指向
         */
        const res = Reflect.get(target, key, receiver)
        // 如果是响应式的
        if (!isReadonly) {
            // 对依赖进行收集
            Track(target, TrackOpType.GET, key)
        }
        // 如果是浅层的
        if (shallow) {
            return res
        }
        // 若不是浅层的，则递归进行配置
        if (isObject(res)) {
            return isReadonly? readonly(res): reactive(res)
        }
        // 配置完成后进行值得返回
        return res
    }
}

// 根据参数返回对应的 set 函数
function createSetter(shallow=false) {
    // 返回 set 函数
    return function set(target, key, value, receiver) {
        // 获取旧值
        const oldValue = target[key]
        // 判断 key 是否存在
        let hasKey = isArray(target) && isIntegerKey(key)? Number(key) < target.length : hasOwn(target, key)
        Reflect.set(target, key, value, receiver)
        if (!hasKey) {
            trigger(target, TriggerOpTypes.ADD, key, value)
        } else {
            // 进行判断，优化
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