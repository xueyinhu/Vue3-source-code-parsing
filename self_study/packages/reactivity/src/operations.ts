// 语义化的操作符

// 用于 Track 函数，收集依赖
export const enum TrackOpType {
    GET
}

// 用于 trigger 函数，对数据进行 增加 或 修改 的标识符
export const enum TriggerOpTypes {
    ADD,
    SET
}