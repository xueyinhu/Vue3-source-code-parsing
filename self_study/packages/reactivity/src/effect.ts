export function effect(fn, options: any = {}) {
    const effect = createReactEffect(fn, options)
    if (!options.lazy) {
        effect()
    }
    return effect
}

let uid = 0

function createReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        fn()
    }
    effect.uid = uid++
    effect._isEffect = true
    effect.raw = fn
    effect.options = options
    return effect
}
