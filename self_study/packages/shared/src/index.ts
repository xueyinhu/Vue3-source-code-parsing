// 判断输入值类型是否为 Object
export function isObject(target) {
    return typeof target === 'object' && target != null
}
// 判断输入值类型是否为 Array
export const isArray = Array.isArray
// 判断输入值类型是否为 Function
export const isFunction = (val) => typeof val === 'function'
// 判断输入值类型是否为 Number
export const isNumber = (val) => typeof val === 'number'
// 判断输入值类型是否为 String
export const isString = (val) => typeof val === 'string'
// 判断输入值类型是否为 Integer 的 Key
export const isIntegerKey = (key) => parseInt(key) + '' === key

// 对 Object.prototype.hasOwnProperty 的简写
const hasOwnProperty = Object.prototype.hasOwnProperty
// 对输入值的属性是否存在进行鉴定，hasOwnProperty.call(val, key)
export const hasOwn = (
    val: object,
    key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

// 判断两个输入值是否有差异
export const hasChange = (value, oldValue) => value !== oldValue

// 1
export const extend = Object.assign

export * from "./shapeFlags"

