import type { BuildMetadataView, BuildMetadataSetter, BuildMetadataValue, BuildMetadataMapViewToValueType, Metadata } from './index'


type Views = BuildMetadataView<{
    Text: {
        multiline?: boolean
    },
    Number: {},
    Checkbox: {},
    Select: {},
    Array: {}
}>


type Setters = BuildMetadataSetter<{
    None: {},
    Custom: {
        custom: Function
    }
}>

type Values = BuildMetadataValue<{
    Boolean: {
        valueType: boolean
    },
    Number: {
        valueType: number
    },
    String: {
        valueType: string
    },
    Option: {
        valueType: string
        optoins: { value: string, label: string }[]
    }
}>

export type ViewToValueTypeMap = BuildMetadataMapViewToValueType<Views, Values, {
    Text:'String',
    Number:'Number',
    Checkbox:'Boolean',
    Select:'Option',
    Array:'Array'
}>

export type PresetMetadata = Metadata<Views, Setters, Values, ViewToValueTypeMap>