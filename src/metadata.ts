import type { ValueTypeArray } from "./type"
type MetadataView<TYPE extends string = string> = {
    type: TYPE
}
type MetadataSetter<TYPE extends string = string> = {
    type: TYPE
}

type MetadataValue<TYPE extends string = string, VALUE_TYPE extends unknown = unknown> = {
    type: TYPE
    valueType: VALUE_TYPE
}

type MetadataValue_Array<VALUE_TYPE extends unknown[] = unknown[]> = MetadataValue<ValueTypeArray, VALUE_TYPE>

type Dict<T> = Record<string, Omit<T, 'type'>>

export type Metadata<
    VIEW_DICT extends Dict<MetadataView> = Dict<MetadataView>,
    SETTER_DICT extends Dict<MetadataSetter> = Dict<MetadataSetter>,
    VALUE_DICT extends Dict<MetadataValue> = Dict<MetadataValue>,
    MAP_VIEW_TO_VALUE_TYPE extends {
        [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
    } = {
        [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
    }
> = {
    view: {
        [ViewType in keyof VIEW_DICT]:
        ViewType extends string ? VIEW_DICT[ViewType] & MetadataView<ViewType> : never
    }
    setter: {
        [SetterType in keyof SETTER_DICT]:
        SetterType extends string ? SETTER_DICT[SetterType] & MetadataSetter<SetterType> : never
    }
    value: {
        [ValueType in ValueTypeArray | keyof VALUE_DICT]:
        ValueType extends string ?
        (ValueType extends ValueTypeArray ?
            VALUE_DICT[ValueType] extends MetadataValue_Array ?
            VALUE_DICT[ValueType] :
            MetadataValue_Array :
            VALUE_DICT[ValueType]) & MetadataValue<ValueType> :
        never
    }
    valueArray:
    mapViewToValueType: MAP_VIEW_TO_VALUE_TYPE
}

export type MetadataSetterType<METADATA extends Metadata> = (keyof METADATA['setter']) & string
export type MetadataValueType<METADATA extends Metadata> = ((keyof METADATA['value']) | ValueTypeArray) & string
export type MetadataViewType<METADATA extends Metadata> = (keyof METADATA['view']) & string



export type BuildMetadataView<T extends Dict<MetadataView>> = T

export type BuildMetadataSetter<T extends Dict<MetadataSetter>> = T

export type BuildMetadataValue<T extends Dict<MetadataValue>> = T

export type BuildMetadataMapViewToValueType<VIEW_DICT extends Dict<MetadataView>, VALUE_DICT extends Dict<MetadataValue>, MAP extends {
    [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
}> = MAP