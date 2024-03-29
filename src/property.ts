
import { ValueTypeArray } from './type'
import type { ValueBox, PropertyArray, Property as PropertyT } from './type'
import type { Metadata as MetadataT } from './metadata'
import { cloneDeep } from 'lodash-es'
import recursiveFree from 'recursive-free'
import { SetterDispatcher } from './setterDispatcher'
import { MetadataItemValue_Array } from './metadata'
type CommonPropertyArray<Metadata extends MetadataT> = PropertyT<Metadata, string, string, string, ValueTypeArray>
export class Property<Metadata extends MetadataT, Properties extends PropertyArray<Metadata>, Context> {
    setterDispatcher: SetterDispatcher<Metadata, any>
    context: Context
    readonly properties: Properties
    #value: ValueBox<Metadata, Properties> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }
        return this.#value
    }
    constructor(properties: Properties, context: Context, setterDispatcher: SetterDispatcher<Metadata, Context>) {
        this.properties = cloneDeep(properties)
        this.context = context
        this.setterDispatcher = setterDispatcher
    }
    initialize(v: ValueBox<Metadata, Properties> | null) {

        const self = this
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox<Metadata, Properties>> = v ? cloneDeep(v) : {}
        const Setters: Function[] = []
        const init = recursiveFree<{ value: Partial<ValueBox<Metadata, PropertyArray<Metadata>>> | Partial<ValueBox<Metadata, Properties>>, defs: PropertyArray<Metadata> }, void>(function* (arg) {
            type ValueKey = keyof typeof value
            const { value, defs } = arg

            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name as ValueKey
                let val = value[name]
                if (typeof val === 'undefined') {
                    val = value[name] = self.generateDefaultValue(pd) as typeof val
                }
                Setters.push(() => {
                    self.callSetter(pd as any, val)
                })
                if (pd.valueType === ValueTypeArray) {
                    for (const v of val as MetadataItemValue_Array['valueType']) {
                        yield {
                            value: v,
                            defs: (pd as CommonPropertyArray<Metadata>).valueProperties
                        } as any
                    }
                }
            }
        })
        init({ value: _v, defs: this.properties })
        this.#value = _v as ValueBox<Metadata, Properties>
        return function () {
            Setters.forEach(setter => setter())
        }
    }
    private callSetter<T extends PropertyT<Metadata>>(property: T, value: any) {
        if (property.setterSkip === true) {
            return
        }
        this.setterDispatcher.dispatch(property.setterType, property, cloneDeep(value))
    }
    callAfterApplied<T extends PropertyT<Metadata>>(property: T) {
        property.setterAfterApplied?.apply(this.context)
    }

    applyValue<T extends PropertyT<Metadata>>(property: T, valueBox: Record<string, any>, value: any) {
        valueBox[property.name] = cloneDeep(value)
        this.callSetter(property, value)
        this.callAfterApplied(property)
    }
    arrayRemoveItem<T extends CommonPropertyArray<Metadata>>(property: T, at: number, array: Array<any>) {
        if (at >= array.length) {
            throw 'arrayRemoveItem'
        }
        const [v] = array.splice(at, 1)
        property.valueAfterRemove?.(this.context, at, v, array)
        this.callAfterApplied(property as any)
    }
    arrayMoveItem<T extends CommonPropertyArray<Metadata>>(property: T, from: number, to: number, array: Array<any>) {
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
    arrayInsertItem<T extends CommonPropertyArray<Metadata>>(property: T, at: number, array: Array<any>, value: T extends { valueProperties: infer v } ? (v extends PropertyArray<Metadata> ? ValueBox<Metadata, v> : never) : never) {
        if (at > array.length) {
            throw 'arrayInsertItem'
        }
        array.splice(at, 0, value)
        property.valueAfterInsert?.(this.context, at, value, array)
        this.callAfterApplied(property as any)
    }
    generateDefaultArrayItem<T extends CommonPropertyArray<Metadata>>(property: T): T extends { valueProperties: infer v } ? v extends PropertyArray<Metadata> ? ValueBox<Metadata, v> : never : never {
        const v: any = {}
        for (const p of property.valueProperties) {
            v[p.name] = this.generateDefaultValue(p)
        }
        return v
    }
    generateDefaultValue<T extends PropertyT<Metadata>>(property: T) {
        return cloneDeep(property.valueDefault)
    }
}


