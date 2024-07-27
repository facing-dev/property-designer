import type { ValueType, ValueTypeArray } from "./type"

type MetadataView<TYPE extends string = string> = {
    type: TYPE
}
type MetadataSetter<TYPE extends string = string> = {
    type: TYPE
}

type MetadataValue<TYPE extends ValueType = ValueType, VALUE_TYPE extends unknown = unknown> = {
    type: TYPE
    valueType: VALUE_TYPE
}

type MetadataValue_Array<VALUE_TYPE extends unknown[] = unknown[]> = MetadataValue<ValueTypeArray, VALUE_TYPE>

type Dict<K extends keyof any, T> = Record<K, Omit<T, 'type'>>

export type Metadata<
    VIEW_DICT extends Dict<string, MetadataView> = Dict<string, MetadataView>,
    SETTER_DICT extends Dict<string, MetadataSetter> = Dict<string, MetadataSetter>,
    VALUE_DICT extends Dict<ValueType, MetadataValue> = Dict<string | ValueTypeArray, MetadataValue>,
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
        [VT in keyof VALUE_DICT]:
        VT extends ValueType ? VALUE_DICT[VT] & MetadataValue<VT> : never
    }
    mapViewToValueType: MAP_VIEW_TO_VALUE_TYPE
}

export type MetadataSetterType<METADATA extends Metadata> = (keyof METADATA['setter']) & string
export type MetadataValueType<METADATA extends Metadata> = ((keyof METADATA['value'])) & ValueType
export type MetadataViewType<METADATA extends Metadata> = (keyof METADATA['view']) & string



export type BuildMetadataView<T extends Dict<string, MetadataView>> = T

export type BuildMetadataSetter<T extends Dict<string, MetadataSetter>> = T

export type BuildMetadataValue<T extends Partial<Dict<ValueType, MetadataValue>>> = {
    [key in ValueTypeArray | keyof T]:
    ValueTypeArray extends key ?
    T[ValueTypeArray] extends MetadataValue_Array ?
    T[ValueTypeArray] :
    MetadataValue_Array :
    T[key]
}

export type BuildMetadataMapViewToValueType<VIEW_DICT extends Dict<string, MetadataView>, VALUE_DICT extends Dict<ValueType, MetadataValue>, MAP extends {
    [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
}> = MAP