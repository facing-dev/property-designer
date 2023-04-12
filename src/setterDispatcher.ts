import type { Metadata as MetadataT, MetadataSetterType } from './metadata'
import type { Property } from './type'
export type Data<Metadata extends MetadataT, Context> = Record<
    MetadataSetterType<Metadata>,
    { (this: Context, property: Property<Metadata>, value: any): void }
>
export class SetterDispatcher<Metadata extends MetadataT, Context> {
    context: Context
    data: Data<Metadata, Context>
    constructor(data: Data<Metadata, Context>, context: Context) {
        this.context = context
        this.data = data
    }
    dispatch<T extends MetadataSetterType<Metadata>>(type: T, property: Property<Metadata>, value: any) {
        const func = this.data[type]
        if (!func) {
            throw 'property designer SetterDispatcher func not found'
        }
        func.apply(this.context, [property, value])
    }
}