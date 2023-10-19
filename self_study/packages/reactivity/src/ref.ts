export function ref(target) {
    return createRef(target)
}

export function shallowRef(target) {
    return createRef(target, true)

}

class RefImpl {
    public __v_isRef = true
    public _value
    constructor(public target, public isShallow) {}
}

function createRef(target, isShallow=false) {
    return new RefImpl(target, isShallow)
}
