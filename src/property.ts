
import { ValueBox, DefinedProperty, DefinedPropertyMap, PropertyValueArray, Property as PropertyT, PropertyData } from './type'
import cloneDeep from 'lodash.clonedeep'
export class Property<PDA extends Record<number, DefinedProperty>> {
    propertyDefinitions: DefinedPropertyMap<PDA>
    #value: ValueBox<DefinedPropertyMap<PDA>> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(propertyDefinitions: PDA) {
        this.propertyDefinitions = cloneDeep(propertyDefinitions) as DefinedPropertyMap<PDA>
    }
    initialize(v?: ValueBox<DefinedPropertyMap<PDA>>) {
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<DefinedPropertyMap<PDA>>> = v ? cloneDeep(v) : {}
        function init(value: Partial<ValueBox<DefinedPropertyMap<PDA>>>, defs: Record<number, PropertyT>) {
            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name as DefinedPropertyMap<PDA>[number]['name']
                if (typeof value[name] === undefined) {
                    value[name] = cloneDeep(pd.valueDefault) as any
                }
                if (pd.valueType === PropertyValueArray) {
                    init(value[name]!, (pd as PropertyT<PropertyData, any, any, any, typeof PropertyValueArray>).valuePropertyDefinitions)
                }
            }
        }
        init(_v, this.propertyDefinitions)
        this.#value = _v as ValueBox<DefinedPropertyMap<PDA>>
    }
}


