import type { Metadata, MetadataSetterType } from './metadata.mjs'
import type { Property } from './type.mjs'
export type Data<Context> = Record<
    MetadataSetterType<Metadata>,
    { (this: Context, property: Property<Metadata>, value: any, context: Context): void }
>
export class SetterDispatcher<Context> {

    data: Data<Context>
    constructor(data: Data<Context>) {
        this.data = data
    }
    dispatch<T extends MetadataSetterType<Metadata>>(context: Context, type: T, property: Property<Metadata>, value: any) {
        const func = this.data[type]
        if (!func) {
            throw 'property designer SetterDispatcher func not found'
        }
        func.apply(context, [property, value, context])
    }
}