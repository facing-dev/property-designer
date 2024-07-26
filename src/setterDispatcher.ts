import type { Metadata, MetadataSetterType } from './metadata'
import type { Property } from './type'
export type Data<Context> = Record<
    MetadataSetterType<Metadata>,
    { (this: Context, property: Property<Metadata>, value: any, context: Context): void }
>
export class SetterDispatcher<Context> {
    context: Context
    data: Data<Context>
    constructor(data: Data<Context>, context: Context) {
        this.context = context
        this.data = data
    }
    dispatch<T extends MetadataSetterType<Metadata>>(type: T, property: Property<Metadata>, value: any) {
        const func = this.data[type]
        if (!func) {
            throw 'property designer SetterDispatcher func not found'
        }
        func.apply(this.context, [property, value, this.context])
    }
}