import type { ValueTypeArray, Property } from "./type"

type MetadataItem<T extends string = string> = {
    type: T
}

interface MetadataItemValue extends MetadataItem {
    valueType: unknown
}

export interface MetadataItemValue_Array extends MetadataItem {
    valueType: any[]
}

export type Metadata<
    TViews extends Record<string, Omit<MetadataItem, 'type'>> = Record<string, Omit<MetadataItem, 'type'>>,
    TSetters extends Record<string, Omit<MetadataItem, 'type'>> = Record<string, Omit<MetadataItem, 'type'>>,
    TValues extends Record<string, Omit<MetadataItemValue, 'type'>> = Record<string, Omit<MetadataItemValue, 'type'>>
> = {
    view: {
        [index in keyof TViews]:
        index extends string ? TViews[index] & MetadataItem<index> : never
    }
    setter: {
        [index in keyof TSetters]:
        index extends string ? TSetters[index] & MetadataItem<index> : never
    }
    value: {
        [index in keyof TValues | ValueTypeArray]:
        index extends string ?
        (TValues[index] extends {} ? TValues[index] : {})
        & (index extends ValueTypeArray ? MetadataItemValue_Array : {})
        & MetadataItem<index>
        : never

    }
}

export type MetadataSetterType<M extends Metadata> = (keyof M['setter']) & string
export type MetadataValueType<M extends Metadata> = ((keyof M['value']) | ValueTypeArray) & string
export type MetadataViewType<M extends Metadata> = (keyof M['view']) & string

export type BuildMetadataView<T extends MetadataItem> = T

export type BuildMetadataSetter<T extends MetadataItem> = T

export type BuildMetadataValue<T extends MetadataItemValue> = T