import { isArray, isIntegerKey } from "@vue/shared"
import { TriggerOpTypes } from "./operations"

/**
 * effect 函数中的 get 触发 Track 函数收集所有依赖
 * effect 函数中的 set 触发 trigger 函数使得对应依赖响应式更新
 */

// 输入一个函数与相应选项，返回对应的 effect
export function effect(fn, options: any = {}) {
    const effect = createReactEffect(fn, options)
    // 是否为懒加载
    if (!options.lazy) {
        // 若不是懒加载，则直接执行
        effect()
    }
    return effect
}

// 每个 effect 的唯一标识
let uid = 0
// effect 指针
let activeEffect
// 用于 effect 函数嵌套时，effect 运行时机正确
const effectStack = []

// 创建 effect 依赖
function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        // 查找是否存在现有的 effect 在 effectStack 中
        if (!effectStack.includes(effect)) {
            try {
                // 指向当前 effect
                activeEffect = effect
                // 入栈
                effectStack.push(effect)
                // 执行在 effect 函数中输入的函数
                fn()
            } finally {
                // 出栈
                effectStack.pop()
                // 指向 effectStack 中最后一个 effect
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }
    // 挂载属性到自身
    effect.uid = uid++
    effect._isEffect = true
    effect.raw = fn
    effect.options = options
    return effect
}

let targetMap = new WeakMap()

export function Track(target, type, key) {
    // 不使用 effect 触发则不执行
    if (activeEffect == undefined) {
        return
    }
    // 存储 target 对应的依赖
    let depMap = targetMap.get(target)
    if (!depMap) {
        targetMap.set(target, (depMap = new Map))
    }
    let dep = depMap.get(key)
    if (!dep) {
        depMap.set(key, (dep = new Set))
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)
    }
    console.log(targetMap);
}

export function trigger(target, type, key?, newValue?, oldValue?) {
    // 获取 target 对应的依赖
    const depsMap = targetMap.get(target)
    // 若没有则返回
    if (!depsMap) return
    // 收集依赖到 Set 中，避免重复
    let effectSet = new Set()
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(effect => {
                effectSet.add(effect)
            });
        }
    }
    // 特殊情况：改变数组长度
    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            // 将对应数组长度的依赖收集
            if (key === 'length' || key > newValue) {
                add(dep)
            }
        });
    } else {
        // 将对应 key 的依赖收集
        if (key != undefined) {
            add(depsMap.get(key))
        }
        switch(type) {
            // 对数组添加值
            case TriggerOpTypes.ADD:
                if (isArray(target) && isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
        }
    }
    // 将收集的依赖进行执行
    effectSet.forEach((effect: any) => effect());
}
 