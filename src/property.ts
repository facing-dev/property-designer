
import { ValueTypeArray } from './type2'
import type { ValueBox, PropertyFlag, MapPropertyFlagsToProperties, Property as PropertyT, Metadata } from './type2'
import { cloneDeep } from 'lodash'
export class Property<PropertyFlags extends Record<number, PropertyFlag>> {
    propertyDefinitions: MapPropertyFlagsToProperties<PropertyFlags>
    #value: ValueBox<MapPropertyFlagsToProperties<PropertyFlags>> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(propertyDefinitions: PropertyFlags) {
        this.propertyDefinitions = cloneDeep(propertyDefinitions) as MapPropertyFlagsToProperties<PropertyFlags>
    }
    initialize(v?: ValueBox<MapPropertyFlagsToProperties<PropertyFlags>>) {
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<MapPropertyFlagsToProperties<PropertyFlags>>> = v ? cloneDeep(v) : {}
        function init(value: Partial<ValueBox<MapPropertyFlagsToProperties<PropertyFlags>>>, defs: Record<number, PropertyT>) {
            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name as MapPropertyFlagsToProperties<PropertyFlags>[number]['name']
                if (typeof value[name] === undefined) {
                    value[name] = cloneDeep(pd.valueDefault) as any
                }

                if (pd.valueType === ValueTypeArray) {
                    init(value[name]!, (pd as PropertyT<Metadata, any, any, any, ValueTypeArray>).valuePropertyDefinitions)
                }
            }
        }
        init(_v, this.propertyDefinitions)
        this.#value = _v as ValueBox<MapPropertyFlagsToProperties<PropertyFlags>>
    }
}


