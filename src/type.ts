export const PropertyValueArray = Symbol('PropertyTypeArray')
const DefinedPropertySymbol = Symbol('DefinedProperty')
type TypeDetailValueArray = TypeDetailValue<typeof PropertyValueArray> & {
    propertyDefinitions: ReadonlyArray<Property>
}
type TypeDetail<Type extends string | symbol> = {
    type: Type
}

type TypeDetailValue<Type extends string | symbol> = TypeDetail<Type> & { valueType: unknown }

type Prefix<Base extends string, Data extends { [index in string]: any }> = {
    [index in keyof Data as index extends string ? `${Base}${Capitalize<index>}` : index]: Data[index]
}

export type BuildViewType<T extends TypeDetail<string>> = T

export type BuildSetterType<T extends TypeDetail<string>> = T

export type BuildValueType<T extends TypeDetailValue<string>> = T

export type PropertyData<
    Views extends Array<TypeDetail<string|symbol>> = Array<TypeDetail<string>>,
    Setters extends Array<TypeDetail<string|symbol>> = Array<TypeDetail<string>>,
    Values extends Array<TypeDetailValue<string|symbol>> = Array<TypeDetailValue<string>>
> = {
    view: {
        [index in Views[number]['type']]: Views[number] & {
            type: index
        }
    }
    setter: {
        [index in Setters[number]['type']]: Setters[number] & {
            type: index
        }
    }
    value: {
        [index in (Values[number] | TypeDetailValueArray)['type']]: (Values[number] | TypeDetailValueArray) & {
            type: index
        }
    }
}
type PropertyBase<Name extends string> = {
    name: Name
}
export type Property<
    Data extends PropertyData = PropertyData,
    Name extends string = string,
    ViewType extends keyof Data['view'] = string,
    SetterType extends keyof Data['setter'] = string,
    ValueType extends keyof Data['value'] = keyof Data['value'],
    CertainValueType extends Record<number, Property> = []
> = PropertyBase<Name>
    & Prefix<'value',
        Omit<Data['value'][ValueType], 'valueType'>
        & {
            default: Data['value'][ValueType]['type'] extends typeof PropertyValueArray ?
            Array<ValueBox<CertainValueType>> :
            Data['value'][ValueType]['valueType']
        }
    >
    & Prefix<'view', Data['view'][ViewType]>
    & Prefix<'setter', Data['setter'][SetterType]>


export type DefinedToProperty<T extends DefinedProperty> = T & Property
export type DefinedPropertyMap<T extends Record<number, DefinedProperty>> = { [index in (keyof T) & number]: DefinedToProperty<T[index] >}
// type DefinedPropertyMap<T extends ReadonlyArray<DefinedProperty>> = T extends Readonly<[infer F, ...infer E]> ?
//     [
//         F extends DefinedProperty ? DefinedToProperty<F> : never,
//         ...(E extends [] ? [] : E extends Array<DefinedProperty> ? DefinedPropertyMap<E> : never)
//     ]
//     : never

export function defineProperty<
    Data extends PropertyData<Array<TypeDetail<string>>, Array<TypeDetail<string>>, Array<TypeDetailValue<string>>>,
>() {
    return function <
        Name extends string,
        ViewType extends keyof Data['view'],
        SetterType extends keyof Data['setter'],
        ValueType extends keyof Data['value'],
        CertainValueType extends Record<number, DefinedProperty> | undefined
    >(prop: Property<
        Data,
        Name,
        ViewType,
        SetterType,
        ValueType,
        CertainValueType extends Record<number, DefinedProperty> ? DefinedPropertyMap<CertainValueType> : []
    > &
    {
        name: Name
        setterType: SetterType
        viewType: ViewType
        valueType: ValueType
    } &
        (ValueType extends typeof PropertyValueArray ? { valuePropertyDefinitions: CertainValueType } : {})
    ) {
        return prop as (typeof prop) & DefinedProperty
    }
}



export type ValueBox<PDA extends Record<number, Property> = Record<number, Property>> = {
    [index in PDA[number]['name']]: (PDA[number] & { name: index })['valueDefault']
}


export type DefinedProperty = {
    [DefinedPropertySymbol]: never
}


