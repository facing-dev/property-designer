
import { ValueTypeArray } from './type'
import type { ValueBox, PropertyArray, Property as PropertyT, Metadata } from './type'
import { cloneDeep } from 'lodash'
export class Property<Properties extends PropertyArray> {
    readonly propertyDefinitions: Properties
    #value: ValueBox<Properties> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(propertyDefinitions: Properties) {
        this.propertyDefinitions = cloneDeep(propertyDefinitions)
    }
    initialize(v?: ValueBox<Properties>) {
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<Properties>> = v ? cloneDeep(v) : {}
        function init(value: Partial<ValueBox<PropertyArray>>, defs: PropertyArray) {
            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name //as MapPropertyFlagsToProperties<PropertyFlags>[number]['name']
                if (typeof value[name] === undefined) {
                    value[name] = cloneDeep(pd.valueDefault) as any
                }

                if (pd.valueType === ValueTypeArray) {
                    init(value[name]!, (pd as PropertyT<Metadata, any, any, any, ValueTypeArray>).valuePropertyDefinitions)
                }
            }
        }
        init(_v, this.propertyDefinitions)
        this.#value = _v as ValueBox<Properties>
    }
}


