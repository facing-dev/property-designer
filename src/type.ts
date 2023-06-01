import type { Metadata, MetadataPartValue_Array } from "./metadata"

export type ValueTypeArray = 'Array'

export const ValueTypeArray = 'Array'

export type ValueType = Omit<string, ValueTypeArray> | ValueTypeArray

export interface ArrayHooks<T> {
    // beforeRemove?: (at: number) => boolean | void
    afterRemove?: (context: any, oldAt: number, value: T, array: any[]) => void
    // beforeMove?: (from: number, to: number) => boolean | void
    afterMove?: (context: any, from: number, to: number, array: any[]) => void
    // beforeInsert?: (at: number, value: T) => boolean | void
    afterInsert?: (context: any, at: number, value: T, array: any[]) => void
}
type PropertyContext = any
export interface SetterExtra {
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
            default: TValueType extends ValueTypeArray ? Array<ValueBox<TMetadata, TCertainValueType>> : TMetadata['value'][TValueType]['valueType']
        }
        & (TValueType extends ValueTypeArray ? (MetadataPartValue_Array<TMetadata> & ArrayHooks<ValueBox<TMetadata, TCertainValueType>>) : {})

    >
    & Prefix<'view', TMetadata['view'][TViewType]>
    & Prefix<'setter', TMetadata['setter'][TSetterType] & SetterExtra>


export function defineProperty<
    TMetadata extends Metadata,
    TMapView2ValueType extends ({
        [index in keyof TMetadata['view']]: ValueTypeArray | keyof TMetadata['value']
    } | void) = void
>() {
    return function <
        TName extends string,
        TViewType extends keyof TMetadata['view'],
        TSetterType extends keyof TMetadata['setter'],
        TValueType extends TMapView2ValueType extends object ? TMapView2ValueType[TViewType] : (ValueTypeArray | keyof TMetadata['value']),
        TCertainValueType
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
        (
            TValueType extends ValueTypeArray ?
            {
                valueProperties: TCertainValueType
            } & Prefix<'value', ArrayHooks<ValueBox<TMetadata, TCertainValueType extends PropertyArray<TMetadata> ? TCertainValueType : never>>>
            : {}
        )
        //     (TValueType extends ValueTypeArray ? TCertainValueType extends PropertyArray<TMetadata> ? (
        //         {
        //             valueProperties: TCertainValueType
        //         }
        //         & Prefix<'value', ArrayHooks<ValueBox<TMetadata, TCertainValueType>>>
        //     ) : {} : {})
    ) {
        return prop
    }
}

export type ValueBox<M extends Metadata, PDA extends PropertyArray<M> = PropertyArray<M>> = {
    [index in PDA[number]['name']]: (PDA[number] & { name: index })['valueDefault']
}

export type PropertyArray<M extends Metadata = Metadata> = Record<number, Property<M>>