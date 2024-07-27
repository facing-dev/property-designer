import type { Metadata, MetadataValueType, MetadataViewType, MetadataSetterType } from "./metadata"

export const ValueTypeArray: unique symbol = Symbol('ValueType_Array')
export type ValueTypeArray = typeof ValueTypeArray

export type ValueType = string | ValueTypeArray

const NotProvided: unique symbol = Symbol('NotProvided')
type NotProvided = typeof NotProvided

type PropertyBase<NAME extends string> = {
    name: NAME

}

type PropertyValueBase<DEFAULT extends unknown> = {
    default: DEFAULT
}

type Context = any


export interface PropertySetter<CONTEXT extends unknown> {
    skip?: boolean
    afterApply?: (this: CONTEXT, context: CONTEXT) => void
}

export interface PropertyValue_Array<METADATA extends Metadata, ARRAY_PROPERTIES extends ReadonlyArray<Property<METADATA>> | NotProvided, CONTEXT extends unknown> {
    properties: ARRAY_PROPERTIES extends ReadonlyArray<any> ? ARRAY_PROPERTIES : ReadonlyArray<unknown>
    afterRemove?: (this: Context, context: CONTEXT, oldAt: number, value: ARRAY_PROPERTIES extends ReadonlyArray<any> ? ValueBox<ARRAY_PROPERTIES> : any, array: ReadonlyArray<ARRAY_PROPERTIES extends ReadonlyArray<any> ? ValueBox<ARRAY_PROPERTIES> : any>) => void
    afterMove?: (this: Context, context: CONTEXT, from: number, to: number, array: ReadonlyArray<ARRAY_PROPERTIES extends ReadonlyArray<any> ? ValueBox<ARRAY_PROPERTIES> : any>) => void
    afterInsert?: (this: Context, context: CONTEXT, at: number, array: ReadonlyArray<ARRAY_PROPERTIES extends ReadonlyArray<any> ? ValueBox<ARRAY_PROPERTIES> : any>) => void
}




type Prefix<BASE extends string, DATA extends Record<string, any>> = DATA extends any ? {
    [index in keyof DATA as index extends string ? `${BASE}${Capitalize<index>}` : index]: DATA[index]
} : never

type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

export type Property<
    METADATA extends Metadata = Metadata,
    NAME extends string = string,
    VIEW_TYPE extends MetadataViewType<METADATA> = MetadataViewType<METADATA>,
    SETTER_TYPE extends MetadataSetterType<METADATA> = MetadataSetterType<METADATA>,
    VALUE_TYPE extends MetadataValueType<METADATA> = MetadataValueType<METADATA>,
    ARRAY_PROPERTIES extends ValueTypeArray extends VALUE_TYPE ? PropertyArray<METADATA> | NotProvided : never = ValueTypeArray extends VALUE_TYPE ? NotProvided : never
> =
    PropertyBase<NAME>
    & Prefix<'view', METADATA['view'][VIEW_TYPE]>
    & Prefix<'setter', METADATA['setter'][SETTER_TYPE] & PropertySetter<Context>>
    & Prefix<'value', {
        [I in VALUE_TYPE]:
        DistributiveOmit<METADATA['value'][I], 'valueType' | 'default'>
        & PropertyValueBase<I extends ValueTypeArray ? ARRAY_PROPERTIES extends ReadonlyArray<any> ? ReadonlyArray<ValueBox<ARRAY_PROPERTIES>> : ReadonlyArray<unknown> : METADATA['value'][I]['valueType']>
        & (I extends ValueTypeArray ? PropertyValue_Array<METADATA, ARRAY_PROPERTIES, Context> : {})
    }[VALUE_TYPE]
    >

export type PropertyArray<METADATA extends Metadata = Metadata> = ReadonlyArray<Property<METADATA>>

export type ValueBox<PROPERTY_ARRAY extends ReadonlyArray<PropertyBase<string> & Prefix<'value', PropertyValueBase<unknown>>> = PropertyArray> = {
    [index in PROPERTY_ARRAY[number]['name']]: (PROPERTY_ARRAY[number] & { name: index })['valueDefault']
}


export function defineProperty<
    METADATA extends Metadata
>() {
    return function <
        const NAME extends string,

        const VIEW_TYPE extends MetadataViewType<METADATA>,
        const SETTER_TYPE extends MetadataSetterType<METADATA>,
        const VALUE_TYPE extends METADATA['mapViewToValueType'][VIEW_TYPE],

        const PROPERTY_ARRAY extends ValueTypeArray extends VALUE_TYPE ? PropertyArray<METADATA> : never
    >(prop: Property<
        METADATA,
        NAME,
        VIEW_TYPE,
        SETTER_TYPE,
        VALUE_TYPE,
        PROPERTY_ARRAY
    >
        &
    {

        name: NAME
        setterType: SETTER_TYPE
        viewType: VIEW_TYPE
        valueType: VALUE_TYPE

    } &
        (
            VALUE_TYPE extends ValueTypeArray ?
            {
                valueProperties: PROPERTY_ARRAY
            }
            : {}
        )
    ) {
        return prop
    }
}
