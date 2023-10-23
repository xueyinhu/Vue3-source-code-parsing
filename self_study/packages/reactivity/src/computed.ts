import { isFunction } from "@vue/shared"
import { effect } from "./effect"

export function computed(getterOrOptions) {
    let getter
    let setter
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions
        setter = () => {
            console.log('计算属性是只读的');
        }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
    public _dirty = true
    public _value
    public effect
    constructor(public getter, public setter) {
        this.effect = effect(getter, {lazy: true})
    }
    get value() {
        if (this._dirty) {
            this.effect()
        }
        return 1
    }
    set value(newValue) {
    }
}
