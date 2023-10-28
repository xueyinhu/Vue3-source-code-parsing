import { hasChange, isArray } from "@vue/shared"
import { Track, trigger } from "./effect"
import { TrackOpType, TriggerOpTypes } from "./operations"

// 函数柯里化

export function ref(rawValue) {
    return createRef(rawValue)
}

export function shallowRef(rawValue) {
    return createRef(rawValue, true)
}

class RefImpl {
    public __v_isRef = true
    public _value
    constructor(public rawValue, public isShallow) {
        this._value = rawValue
    }
    get value() {
        Track(this, TrackOpType.GET, 'value')
        return this._value
    }
    set value(newValue) {
        if (hasChange(newValue, this._value)) {
            this._value = newValue
            this.rawValue = newValue
            trigger(this, TriggerOpTypes.SET, 'value', newValue)
        }
    } 
}

function createRef(rawValue, isShallow=false) {
    return new RefImpl(rawValue, isShallow)
}

export function toRef(target, key) {
    return new ObjectRefImpl(target, key)
}

class ObjectRefImpl {
    public __v_isRef = true
    constructor(public target, public key) {}
    get value() {
        return this.target[this.key]
    }
    set value(newValue) {
        this.target[this.key] = newValue
    }
}

export function toRefs(target) {
    let ret = isArray(target) ? new Array(target.length): {}
    for (let key in target) {
        ret[key] = toRef(target, key)
    }
    return ret
}

