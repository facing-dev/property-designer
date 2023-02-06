import { BuildViewType, BuildSetterType, BuildValueType, PropertyData as PD } from './type'
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
    BuildViewType<{
        type: ViewType.TEXT
        multiline: boolean
    }>,
    BuildViewType<{
        type: ViewType.NUMBER
    }>,
    BuildViewType<{
        type: ViewType.CHECKBOX
    }>,
    BuildViewType<{
        type: ViewType.SELECT
    }>
]

type Setters = [
    BuildSetterType<{
        type: SetterType.NONE
    }>,
    BuildSetterType<{
        type: SetterType.CUSTOM,
        custom: Function
    }>
]

type Values = [
    BuildValueType<{
        type: ValueType.BOOLEAN
        valueType: boolean
    }>,
    BuildValueType<{
        type: ValueType.NUMBER
        valueType: number
    }>,
    BuildValueType<{
        type: ValueType.STRING
        valueType: string
    }>,
    BuildValueType<{
        type: ValueType.OPTION
        valueType: string
        optoins: { value: string, label: string }[]
    }>
]

export type PropertyData = PD<Views, Setters, Values>