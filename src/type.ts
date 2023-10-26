import type { Metadata, MetadataValueType, MetadataViewType, MetadataSetterType } from "./metadata"

export type ValueTypeArray = 'Array'

export const ValueTypeArray = 'Array'

export type ValueType = Omit<string, ValueTypeArray> | ValueTypeArray

type PropertyBase<Name extends string> = {
    name: Name
}

type PropertyContext = any

export interface PropertySetter {

    skip?: boolean
    afterApplied?: (this: PropertyContext) => void
}

export interface PropertyValue_Array<MD extends Metadata, V = any> {
    properties: ReadonlyArray<Property<MD>>
    afterRemove?: (context: any, oldAt: number, value: V, array: any[]) => void
    afterMove?: (context: any, from: number, to: number, array: any[]) => void
    afterInsert?: (context: any, at: number, value: V, array: any[]) => void
}

type Prefix<Base extends string, Data extends Record<string, any>> = {
    [index in keyof Data as index extends string ? `${Base}${Capitalize<index>}` : index]: Data[index]
}

export type Property<
    TMetadata extends Metadata = Metadata,
    TName extends string = string,
    TViewType extends MetadataViewType<TMetadata> = MetadataViewType<TMetadata>,
    TSetterType extends MetadataSetterType<TMetadata> = MetadataSetterType<TMetadata>,
    TValueType extends MetadataValueType<TMetadata> = MetadataValueType<TMetadata>,
    TArrayProperties extends PropertyArray<TMetadata> = PropertyArray<TMetadata>
> = PropertyBase<TName>
    & Prefix<'value',
        Omit<TMetadata['value'][TValueType], 'valueType'>
        & {
            default: TValueType extends ValueTypeArray ? Array<ValueBox<TMetadata, TArrayProperties>> : TMetadata['value'][TValueType]['valueType']
        }
        & (TValueType extends ValueTypeArray ? PropertyValue_Array<TMetadata> : {})
    >
    & Prefix<'view', TMetadata['view'][TViewType]>
    & Prefix<'setter', TMetadata['setter'][TSetterType] & PropertySetter>


export type PropertyArray<M extends Metadata = Metadata> = ReadonlyArray<Property<M>>

export type ValueBox<M extends Metadata, PDA extends PropertyArray<M> = PropertyArray<M>> = {
    [index in PDA[number]['name']]: (PDA[number] & { name: index })['valueDefault']
}

// function d<TMetadata extends Metadata>() {
//     return function <
//         TName extends string,
//         TViewType extends keyof TMetadata['view'],
//         TSetterType extends keyof TMetadata['setter'],
//         TValueType extends keyof TMetadata['value']
//         TCertainValueType
//     >() {

//     }
// }


export function defineProperty<
    TMetadata extends Metadata,
    TMapView2ValueType extends ({
        [index in MetadataViewType<TMetadata>]: MetadataValueType<TMetadata>
    } | false) = false
>() {
    return function <
        TName extends string,
        TViewType extends MetadataViewType<TMetadata>,
        TSetterType extends MetadataSetterType<TMetadata>,
        TValueType extends TMapView2ValueType extends object ? TMapView2ValueType[TViewType] : MetadataValueType<TMetadata>,
        TArrayProperties
    >(prop: Property<
        TMetadata,
        TName,
        TViewType,
        TSetterType,
        TValueType,
        TArrayProperties extends PropertyArray<TMetadata> ? TArrayProperties : []
    >
        &
    {

        name: TName
        setterType: TSetterType
        viewType: TViewType
        valueType: TValueType

    } &
        (
            TValueType extends ValueTypeArray ?
            {
                valueProperties: TArrayProperties
            }
            : {}
        )
    ) {
        return prop
    }
}