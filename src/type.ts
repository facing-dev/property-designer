export type ValueTypeArray = 'Array'

export const ValueTypeArray = 'Array'

export type ValueType = Omit<string, ValueTypeArray> | ValueTypeArray

type MetadataPartBase<T extends string = string> = {
    type: T
}

type MetadataPartValue_ValueType = { valueType: unknown }

type MetadataPartValue_Array = {
    propertyDefinitions: ReadonlyArray<Property>
}

type Prefix<Base extends string, Data extends Record<string, any>> = {
    [index in keyof Data as index extends string ? `${Base}${Capitalize<index>}` : index]: Data[index]
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
            MetadataPartBase<ValueTypeArray> & MetadataPartValue_ValueType & MetadataPartValue_Array
        ) : (
            TValues[number] & {
                type: index
            }
        )

    }
}

type PropertyBase<Name extends string> = {
    name: Name
}

export type Property<
    TMetadata extends Metadata = Metadata,
    TName extends string = string,
    TViewType extends keyof TMetadata['view'] = string,
    TSetterType extends keyof TMetadata['setter'] = string,
    TValueType extends keyof TMetadata['value'] = keyof TMetadata['value'],
    TCertainValueType extends PropertyArray = []
> = PropertyBase<TName>
    & Prefix<'value',
        Omit<TMetadata['value'][TValueType], 'valueType'>
        & {
            default: TValueType extends ValueTypeArray ? Array<ValueBox<TCertainValueType>> : TMetadata['value'][TValueType]['valueType']
        }
        & (TValueType extends ValueTypeArray ? MetadataPartValue_Array : {})

    >
    & Prefix<'view', TMetadata['view'][TViewType]>
    & Prefix<'setter', TMetadata['setter'][TSetterType]>

export function defineProperty<
    const TMetadata extends Metadata
>() {
    return function <
        const TName extends string,
        const TViewType extends keyof TMetadata['view'],
        const TSetterType extends keyof TMetadata['setter'],
        const TValueType extends ValueTypeArray | keyof TMetadata['value'],
        const TCertainValueType extends PropertyArray | undefined
    >(prop: Property<
        TMetadata,
        TName,
        TViewType,
        TSetterType,
        TValueType,
        TCertainValueType extends PropertyArray ? TCertainValueType : []
    > &
    {

        name: TName
        setterType: TSetterType
        viewType: TViewType
        valueType: TValueType

    } &
        (TValueType extends ValueTypeArray ? { valuePropertyDefinitions: TCertainValueType } : {})
    ) {
        return prop
    }
}

export type ValueBox<PDA extends PropertyArray = PropertyArray> = {
    [index in PDA[number]['name']]: (PDA[number] & { name: index })['valueDefault']
}

export type PropertyArray = Record<number, Property>