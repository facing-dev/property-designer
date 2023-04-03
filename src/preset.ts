import type { BuildMetadataView, BuildMetadataSetter, BuildMetadataValue, Metadata as MetadataT } from './type2'
export enum ViewType {
    TEXT = 'TEXT',
    NUMBER = 'NUMBER',
    CHECKBOX = 'CHECKBOX',
    SELECT = 'SELECT'
}

export enum SetterType {
    NONE = 'NONE',
    CUSTOM = 'CUSTOM'
}

export enum ValueType {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    OPTION = 'OPTION'
}

type Views = [
    BuildMetadataView<{
        type: ViewType.TEXT
        multiline: boolean
    }>,
    BuildMetadataView<{
        type: ViewType.NUMBER
    }>,
    BuildMetadataView<{
        type: ViewType.CHECKBOX
    }>,
    BuildMetadataView<{
        type: ViewType.SELECT
    }>
]

type Setters = [
    BuildMetadataSetter<{
        type: SetterType.NONE
    }>,
    BuildMetadataSetter<{
        type: SetterType.CUSTOM,
        custom: Function
    }>
]

type Values = [
    BuildMetadataValue<{
        type: ValueType.BOOLEAN
        valueType: boolean
    }>,
    BuildMetadataValue<{
        type: ValueType.NUMBER
        valueType: number
    }>,
    BuildMetadataValue<{
        type: ValueType.STRING
        valueType: string
    }>,
    BuildMetadataValue<{
        type: ValueType.OPTION
        valueType: string
        optoins: { value: string, label: string }[]
    }>
]

export type Metadata = MetadataT<Views, Setters, Values>