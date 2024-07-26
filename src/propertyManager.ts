
import { ValueTypeArray } from './type'
import type { ValueBox, PropertyArray, Property as PropertyT } from './type'
import type { Metadata } from './metadata'
import { cloneDeep } from 'lodash-es'
import recursiveFree from 'recursive-free'
import { SetterDispatcher } from './setterDispatcher'
// import { MetadataItemValue_Array } from './metadata'
type CommonProperty_Array<METADATA extends Metadata> = PropertyT<METADATA, string, string, string, ValueTypeArray>
export class PropertyManager<METADATA extends Metadata, Properties extends PropertyArray<METADATA>, Context> {
    setterDispatcher: SetterDispatcher<METADATA, Context>
    context: Context
    readonly properties: Properties
    #value: ValueBox<Properties> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(properties: Properties, context: Context, setterDispatcher: SetterDispatcher<METADATA, Context>) {
        this.properties = cloneDeep(properties)
        this.context = context
        this.setterDispatcher = setterDispatcher
    }
    initialize(v: Partial<ValueBox<Properties>> | null) {

        const self = this
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<Properties>> = v ? cloneDeep(v) : {}
        const Setters: Function[] = []

        const init = recursiveFree<{ value: Partial<Record<string, any>>, defs: PropertyArray<METADATA> }, void>(function* (arg) {
            const { value, defs } = arg
            for (const pdi in defs) {
                const pd = defs[pdi]

                const name = pd.name
                let val = value[name]
                if (typeof val === 'undefined') {
                    val = value[name] = self.generateDefaultValue(pd) as typeof val
                }
                Setters.push(() => {
                    self.callSetter(pd as any, val)
                })
                if (pd.valueType === "Array") {
                    const cpd = pd as PropertyT<METADATA, string, string, string, ValueTypeArray>

                    for (const v of val) {
                        yield {
                            value: v,
                            defs: cpd.valueProperties
                        }
                    }
                }
            }
        })
        init({ value: _v, defs: this.properties })
        this.#value = _v as ValueBox<Properties>
        return function () {
            Setters.forEach(setter => setter())
        }
    }
    private callSetter<T extends PropertyT<METADATA>>(property: T, value: any) {
        if (property.setterSkip === true) {
            return
        }
        this.setterDispatcher.dispatch(property.setterType, property, cloneDeep(value))
    }
    callAfterApplied<T extends PropertyT<METADATA>>(property: T) {
        property.setterAfterApply?.apply(this.context,[this.context])
    }

    applyValue<T extends PropertyT<METADATA>>(property: T, valueBox: Record<string, any>, value: any) {
        valueBox[property.name] = cloneDeep(value)
        this.callSetter(property, value)
        this.callAfterApplied(property)
    }
    arrayRemoveItem<T extends CommonProperty_Array<METADATA>>(property: T, at: number, array: Array<any>) {
        if (at >= array.length) {
            throw 'arrayRemoveItem'
        }
        const [v] = array.splice(at, 1)
        property.valueAfterRemove?.(this.context, at, v, array)
        this.callAfterApplied(property as any)
    }
    arrayMoveItem<T extends CommonProperty_Array<METADATA>>(property: T, from: number, to: number, array: Array<any>) {
        if (from >= array.length) {
            throw 'arrayMoveItem 1'
        }
        const [v] = array.splice(from, 1)
        if (to > array.length) {
            throw 'arrayMoveItem 2'
        }
        array.splice(to, 0, v)
        property.valueAfterMove?.(this.context, from, to, array)
        this.callAfterApplied(property as any)
    }
    arrayInsertItem<T extends CommonProperty_Array<METADATA>>(property: T, at: number, array: Array<any>, value: T extends { valueProperties: infer v } ? (v extends PropertyArray<Metadata> ? ValueBox<v> : never) : never) {
        if (at > array.length) {
            throw 'arrayInsertItem'
        }
        array.splice(at, 0, value)
        property.valueAfterInsert?.(this.context, at, value, array)
        this.callAfterApplied(property as any)
    }
    generateDefaultArrayItem<T extends CommonProperty_Array<METADATA>>(property: T): T extends { valueProperties: infer v } ? v extends PropertyArray<Metadata> ? ValueBox<v> : never : never {
        const v: any = {}
        for (const p of property.valueProperties) {
            v[p.name] = this.generateDefaultValue(p)
        }
        return v
    }
    generateDefaultValue<T extends PropertyT<METADATA>>(property: T) {
        return cloneDeep(property.valueDefault)
    }
}


