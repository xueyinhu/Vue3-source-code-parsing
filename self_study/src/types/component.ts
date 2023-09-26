import { ComponentOptions } from "./options"

export declare class Component {
    constructor(options: any)
    _uid: number
    $el: any
    $data: Record<string, any>
    $props: Record<string, any>
    $options: ComponentOptions
}