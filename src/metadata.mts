import type { SetterType, ValueType, ValueTypeArray, ViewType } from "./type.mjs"

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
    VIEW_DICT extends Dict<ViewType, MetadataView> = Dict<ViewType, MetadataView>,
    SETTER_DICT extends Dict<SetterType, MetadataSetter> = Dict<SetterType, MetadataSetter>,
    VALUE_DICT extends Dict<ValueType, MetadataValue> = Dict<ValueType, MetadataValue>,
    MAP_VIEW_TO_VALUE_TYPE extends {
        [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
    } = {
        [index in keyof VIEW_DICT]: ValueTypeArray | keyof VALUE_DICT
    }
> = {
    view: {
        [VT in keyof VIEW_DICT]:
        VT extends ViewType ? VIEW_DICT[VT] & MetadataView<VT> : never
    }
    setter: {
        [ST in keyof SETTER_DICT]:
        ST extends SetterType ? SETTER_DICT[ST] & MetadataSetter<ST> : never
    }
    value: {
        [VT in keyof VALUE_DICT]:
        VT extends ValueType ? VALUE_DICT[VT] & MetadataValue<VT> : never
    }
    commonView: (keyof VIEW_DICT) extends ViewType ? MetadataView<keyof VIEW_DICT> : never
    commonSetter: (keyof SETTER_DICT) extends SetterType ? MetadataSetter<keyof SETTER_DICT> : never
    commonValue: (keyof VALUE_DICT) extends ValueType ? MetadataValue<keyof VALUE_DICT> : never
    mapViewToValueType: MAP_VIEW_TO_VALUE_TYPE
}

export type MetadataSetterType<METADATA extends Metadata> = (keyof METADATA['setter']) & SetterType
export type MetadataValueType<METADATA extends Metadata> = (keyof METADATA['value']) & ValueType
export type MetadataViewType<METADATA extends Metadata> = (keyof METADATA['view']) & ViewType



export type BuildMetadataView<T extends Dict<ViewType, MetadataView>> = T

export type BuildMetadataSetter<T extends Dict<SetterType, MetadataSetter>> = T

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