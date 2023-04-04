
import { ValueTypeArray } from './type'
import type { ValueBox, PropertyArray, Property as PropertyT } from './type'
import type { Metadata as MetadataT } from './metadata'
import { cloneDeep } from 'lodash'
import recursiveFree from 'recursive-free'
import { SetterDispatcher } from './setterDispatcher'
export class Property<Metadata extends MetadataT, Properties extends PropertyArray> {
    setterDispatcher: SetterDispatcher<Metadata, any>
    readonly properties: Properties
    #value: ValueBox<Properties> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(properties: Properties, setterDispatcher: SetterDispatcher<Metadata, any>) {
        this.properties = cloneDeep(properties)
        this.setterDispatcher = setterDispatcher
    }
    initialize(v?: ValueBox<Properties>) {
        const self = this
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<Properties>> = v ? cloneDeep(v) : {}

        const init = recursiveFree<{ value: Partial<ValueBox<PropertyArray>>, defs: PropertyArray }, void>(function* (arg) {
            const { value, defs } = arg
            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name
                if (typeof value[name] === undefined) {
                    value[name] = cloneDeep(pd.valueDefault) as any
                }
                self.callSetter(pd as any, value[name])
                if (pd.valueType === ValueTypeArray) {
                    yield {
                        value: value[name]!,
                        defs: (pd as PropertyT<Metadata, any, any, any, ValueTypeArray>).valueProperties
                    }
                }
            }
        })
        init({ value: _v, defs: this.properties })
        this.#value = _v as ValueBox<Properties>
    }
    callSetter<T extends PropertyT<Metadata>>(property: T, value: any) {
        if (property.setterSkip === true) {
            return
        }
        this.setterDispatcher.dispatch(property.setterType, property, value)
    }
    applyValue<T extends PropertyT<Metadata>>(property: T, valueBox: Record<string, any>, value: any) {
        valueBox[property.name] = cloneDeep(value)
        this.callSetter(property, value)
    }
}


