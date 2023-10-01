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
        try {
            activeEffect = effect
            effectStack.push(effect)
            fn()
        } finally {
            effectStack.pop()
        }
    }
    effect.uid = uid++
    effect._isEffect = true
    effect.raw = fn
    effect.options = options
    return effect
}

export function Track(target, type, key) {
}
