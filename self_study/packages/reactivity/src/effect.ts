import { isArray } from "@vue/shared"

export function effect(fn, options: any = {}) {
    const effect = createReactEffect(fn, options)
    if (!options.lazy) {
        effect()
    }
    return effect
}

let uid = 0
let activeEffect
const effectStack = []

function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) {
            try {
                activeEffect = effect
                effectStack.push(effect)
                fn()
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }
    }
    effect.uid = uid++
    effect._isEffect = true
    effect.raw = fn
    effect.options = options
    return effect
}

let targetMap = new WeakMap()

export function Track(target, type, key) {
    if (activeEffect == undefined) {
        return
    }
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
}

export function trigger(target, q, key?, value?, oldValue?) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let effectSet = new Set()
    const add = (effectAdd) => {
        if (effectAdd) {
            effectAdd.forEach(effect => {
                effectSet.add(effect)
            });
        }
    }
    add(depsMap.get(key))
    effectSet.forEach((effect: any) => effect());
    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            // if (key === 'length' || key > newValue) {
            //     add(dep)
            // }
        });
    }
}
 