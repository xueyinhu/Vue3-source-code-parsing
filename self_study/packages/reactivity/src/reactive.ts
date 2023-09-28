const reactiveHandlers = {}
const shallowReactiveHandlers = {}
const readonlyHandlers = {}
const shallowReadonlyHandlers = {}

export function reactive(target) {
    createReactObj(target, false, reactiveHandlers)
}
export function shallowReactive(target) {
    createReactObj(target, false, shallowReactiveHandlers)
}
export function readonly(target) {
    createReactObj(target, true, readonlyHandlers)
}
export function shallowReadonly(target) {
    createReactObj(target, true, shallowReadonlyHandlers)
}
function createReactObj(target, isReadonly, baseHandlers) {

}
