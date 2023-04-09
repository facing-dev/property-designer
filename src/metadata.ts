import { ValueTypeArray } from "./type"
import type { Property } from './type'

type MetadataPartBase<T extends string = string> = {
    type: T
}

type MetadataPartValue_ValueType = { valueType: unknown }

export type MetadataPartValue_Array<T extends Metadata> = {
    properties: ReadonlyArray<Property<T>>
}

export type BuildMetadataView<T extends MetadataPartBase> = T

export type BuildMetadataSetter<T extends MetadataPartBase> = T

export type BuildMetadataValue<T extends MetadataPartBase> = T

export type Metadata<
    TViews extends Array<MetadataPartBase> = Array<MetadataPartBase>,
    TSetters extends Array<MetadataPartBase> = Array<MetadataPartBase>,
    TValues extends Array<MetadataPartBase & MetadataPartValue_ValueType> = Array<MetadataPartBase & MetadataPartValue_ValueType>
> = {
    view: {
        [index in TViews[number]['type']]: TViews[number] & {
            type: index
        }
    }
    setter: {
        [index in TSetters[number]['type']]: TSetters[number] & {
            type: index
        }
    }
    value: {
        [index in TValues[number]['type'] | ValueTypeArray]: index extends ValueTypeArray ? (
            MetadataPartBase<ValueTypeArray> & MetadataPartValue_ValueType & MetadataPartValue_Array<Metadata>
        ) : (
            TValues[number] & {
                type: index
            }
        )
    }
}

export type MetadataSetterType<M extends Metadata> = keyof M['setter']
export type MetadataValueType<M extends Metadata> = keyof M['value']
export type MetadataViewType<M extends Metadata> = keyof M['view']