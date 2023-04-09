import type { Metadata, MetadataPartValue_Array } from "./metadata"

export type ValueTypeArray = 'Array'

export const ValueTypeArray = 'Array'

export type ValueType = Omit<string, ValueTypeArray> | ValueTypeArray

export interface ArrayHooks<T> {
    beforeRemove?: (at: number) => boolean | void
    afterRemove?: (at: number) => void
    beforeMove?: (from: number, to: number) => boolean | void
    afterMove?: (from: number, to: number) => void
    beforeInsert?: (at: number, value: T) => boolean | void
    afterInsert?: (at: number, value: T) => void
}
type PropertyContext = any
interface SetterExtra {
    skip?: boolean
    afterApplied?: (this: PropertyContext) => void
}

type PropertyBase<Name extends string> = {
    name: Name
}

type Prefix<Base extends string, Data extends Record<string, any>> = {
    [index in keyof Data as index extends string ? `${Base}${Capitalize<index>}` : index]: Data[index]
}

export type Property<
    TMetadata extends Metadata = Metadata,
    TName extends string = string,
    TViewType extends keyof TMetadata['view'] = string,
    TSetterType extends keyof TMetadata['setter'] = string,
    TValueType extends keyof TMetadata['value'] = keyof TMetadata['value'],
    TCertainValueType extends PropertyArray<TMetadata> = []
> = PropertyBase<TName>
    & Prefix<'value',
        Omit<TMetadata['value'][TValueType], 'valueType'>
        & {
            default: TValueType extends ValueTypeArray ? Array<ValueBox<TCertainValueType>> : TMetadata['value'][TValueType]['valueType']
        }
        & (TValueType extends ValueTypeArray ? (MetadataPartValue_Array<TMetadata> & ArrayHooks<ValueBox<TCertainValueType>>) : {})

    >
    & Prefix<'view', TMetadata['view'][TViewType]>
    & Prefix<'setter', TMetadata['setter'][TSetterType] & SetterExtra>

export function defineProperty<
    const TMetadata extends Metadata
>() {
    return function <
        const TName extends string,
        const TViewType extends keyof TMetadata['view'],
        const TSetterType extends keyof TMetadata['setter'],
        const TValueType extends ValueTypeArray | keyof TMetadata['value'],
        const TCertainValueType extends PropertyArray<TMetadata> | undefined
    >(prop: Property<
        TMetadata,
        TName,
        TViewType,
        TSetterType,
        TValueType,
        TCertainValueType extends PropertyArray<TMetadata> ? TCertainValueType : []
    > &
    {

        name: TName
        setterType: TSetterType
        viewType: TViewType
        valueType: TValueType

    } &
        (TValueType extends ValueTypeArray ? TCertainValueType extends PropertyArray<TMetadata> ? (
            {
                valueProperties: TCertainValueType
            }
            & Prefix<'value', ArrayHooks<ValueBox<TCertainValueType>>>
        ) : {} : {})
    ) {
        return prop
    }
}

export type ValueBox<PDA extends PropertyArray = PropertyArray> = {
    [index in PDA[number]['name']]: (PDA[number] & { name: index })['valueDefault']
}

export type PropertyArray<M extends Metadata = Metadata> = Record<number, Property<M>>