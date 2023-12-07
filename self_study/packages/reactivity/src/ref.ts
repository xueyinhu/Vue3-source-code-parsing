import { hasChange, isArray } from "@vue/shared"
import { Track, trigger } from "./effect"
import { TrackOpType, TriggerOpTypes } from "./operations"

// 函数柯里化

// 实现对 rawValue 的监测
export function ref(rawValue) {
    return createRef(rawValue)
}

// 实现对 rawValue 的浅层监测
export function shallowRef(rawValue) {
    return createRef(rawValue, true)
}

class RefImpl {
    // 标识类型
    public __v_isRef = true
    // 被监测的对象
    public _value
    constructor(public rawValue, public isShallow) {
        this._value = rawValue
    }
    get value() {
        // 对依赖进行收集
        Track(this, TrackOpType.GET, 'value')
        // 返回值
        return this._value
    }
    set value(newValue) {
        // 优化，oldValue 与 newValue 不同时候更新依赖
        if (hasChange(newValue, this._value)) {
            this._value = newValue
            this.rawValue = newValue
            // 更新依赖
            trigger(this, TriggerOpTypes.SET, 'value', newValue)
        }
    } 
}

// 创建 Ref
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

