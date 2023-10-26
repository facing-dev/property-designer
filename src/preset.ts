import type { BuildMetadataView, BuildMetadataSetter, BuildMetadataValue, Metadata as MetadataT } from './index'


type Views = {
    TEXT: {
        multiline: boolean
    },
    NUMBER: {},
    CHECKBOX: {},
    SELECT: {},
    ARRAY:{}
}


type Setters = {
    NONE: {},
    CUSTOM: {
        custom: Function
    }
}

type Values = {
    BOOLEAN: {
        valueType: boolean
    },
    NUMBER: {
        valueType: number
    },
    STRING: {
        valueType: string
    },
    OPTION: {
        valueType: string
        optoins: { value: string, label: string }[]
    }
}



export type Metadata = MetadataT<Views, Setters, Values>