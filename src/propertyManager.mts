
import { ValueTypeArray, CommonPropertyType } from './type.mjs'
import type { ValueBox, PropertyArray, Property } from './type.mjs'
import type { Metadata } from './metadata.mjs'
import { cloneDeep } from 'lodash-es'
import recursiveFree from 'recursive-free'
import { SetterDispatcher } from './setterDispatcher.mjs'

type CommonProperty_Array<METADATA extends Metadata> = Property<METADATA, string, CommonPropertyType, CommonPropertyType, ValueTypeArray, PropertyArray<METADATA>>

type CommonProperty_ArrayUnknow<METADATA extends Metadata> = Property<METADATA, string, CommonPropertyType, CommonPropertyType, ValueTypeArray>
export class PropertyManager<METADATA extends Metadata, Properties extends PropertyArray<METADATA>, Context> {
    setterDispatcher: SetterDispatcher<Context>
    context: Context
    readonly properties: Properties
    #value: ValueBox<Properties> | null = null
    get value() {
        if (this.#value === null) {
            throw 'Property value has not been initialized'
        }

        return this.#value

    }
    constructor(properties: Properties, context: Context, setterDispatcher: SetterDispatcher<Context>) {
        this.properties = cloneDeep(properties)
        this.context = context
        this.setterDispatcher = setterDispatcher
    }
    initialize(v: Partial<ValueBox<Properties>> | null) {

        const self = this
        if (this.#value !== null) {
            throw 'Property value has been initialized'
        }
        const _v: Partial<ValueBox> = v ? cloneDeep(v) : {}
        const Setters: Function[] = []

        const init = recursiveFree<{ value: Partial<Record<string, any>>, defs: ReadonlyArray<Property<METADATA>> }, void>(function* (arg) {
            const { value, defs } = arg
            for (const pdi in defs) {
                const pd = defs[pdi]
                const name = pd.name
                let val = value[name]
                if (typeof val === 'undefined') {
                    val = value[name] = self.generateDefaultValue(pd) as typeof val
                }
                Setters.push(() => {
                    self.callSetter(pd, val)
                })

                if (pd.valueType === ValueTypeArray) {
                    const cpd = pd as unknown as CommonProperty_Array<METADATA>
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
    private callSetter<T extends Property<METADATA>>(property: T, value: T['valueDefault']) {
        if (property.setterSkip === true) {
            return
        }
        this.setterDispatcher.dispatch(this.context, property.setterType, property, cloneDeep(value))
    }
    callAfterApplied<T extends Property<METADATA> | CommonProperty_Array<METADATA>>(property: T) {
        property.setterAfterApply?.apply(this.context, [this.context])
    }
    // { [k in NAME]: T['valueDefault'] }
    applyValue<T extends Property<METADATA>>(property: T, valueBox: { [k in T['name']]: T['valueDefault'] }, value: T['valueDefault']) {
        valueBox[property.name as T['name']] = cloneDeep(value)
        this.callSetter(property, value)
        this.callAfterApplied(property)
    }
    arrayRemoveItem<T extends CommonProperty_Array<METADATA>>(property: T, at: number, array: Array<ValueBox<T['valueProperties']>>) {
        if (at >= array.length) {
            throw 'arrayRemoveItem'
        }
        const [v] = array.splice(at, 1)
        property.valueAfterRemove?.apply(this.context, [this.context, at, v, array])
        this.callAfterApplied(property)
    }
    arrayMoveItem<T extends CommonProperty_Array<METADATA>>(property: T, from: number, to: number, array: Array<ValueBox<T['valueProperties']>>) {
        if (from >= array.length) {
            throw 'arrayMoveItem 1'
        }
        const [v] = array.splice(from, 1)
        if (to > array.length) {
            throw 'arrayMoveItem 2'
        }
        array.splice(to, 0, v)
        property.valueAfterMove?.apply(this.context, [this.context, from, to, array])
        this.callAfterApplied(property)
    }
    arrayInsertItem<T extends CommonProperty_Array<METADATA>>(property: T, at: number, array: Array<ValueBox<T['valueProperties']>>, value: ValueBox<T['valueProperties']>) {
        if (at > array.length) {
            throw 'arrayInsertItem'
        }
        array.splice(at, 0, value)
        property.valueAfterInsert?.apply([this.context], [this.context, at, array])
        this.callAfterApplied(property)
    }
    generateDefaultArrayItem<
        T extends CommonProperty_ArrayUnknow<METADATA>,
        PROPERTIES extends PropertyArray<METADATA>
    >(property: T & { valueProperties: PROPERTIES }): ValueBox<PROPERTIES> {
        const properties = property.valueProperties
        const v: Partial<Record<string, PROPERTIES[number]['valueDefault']>> = {}
        for (const p of properties) {
            v[p.name] = this.generateDefaultValue(p)
        }
        return v as ValueBox<PROPERTIES>
    }
    generateDefaultValue<T extends Property<METADATA>>(property: T): T['valueDefault'] {

        return cloneDeep(property.valueDefault)
    }
}




