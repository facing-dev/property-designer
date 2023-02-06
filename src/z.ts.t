export enum Type {
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    OPTIONS = 'OPTIONS',
    COLOR = 'COLOR',
    IMAGE = 'IMAGE',
    C_SHADOW = 'C_SHADOW'
}

export type Assert<E, T extends E> = T

type Option = {
    label: string,
    value: string
}
type TypeDetailBase<T extends Type, VT> = {
    type: T
    defaultValue: VT
    valueBuilder?: { (v: VT): any }
}

export type TypeDetail = Assert<{ [index in Type]: { type: Type, defaultValue: any } }, {
    [Type.STRING]: TypeDetailBase<Type.STRING, string> & {
        multiline: boolean
    }
    [Type.NUMBER]: TypeDetailBase<Type.NUMBER, number> & { step?: number }
    [Type.BOOLEAN]: TypeDetailBase<Type.BOOLEAN, boolean>
    [Type.OPTIONS]: TypeDetailBase<Type.OPTIONS, any> & {
        options: Option[] | { (comp: ComponentCommon): Promise<Option[]> }
        mapValue?: boolean
        optionsBuilder?: (opts: Option[]) => Option[]
    }
    [Type.COLOR]: TypeDetailBase<Type.COLOR, {
        type: "Pure" | 'Gradient'
        pureValue: string
        gradientValue: {
            type: 'radial' | 'linear'
            coords: {
                x1: number
                y1: number
                x2: number
                y2: number
                r1: number
                r2: number
            }
            colorStops: {
                offset: number
                color: string
            }[]
        }
    }> & { fabricColor?: boolean, gradientEnabled?: boolean }
    [Type.IMAGE]: TypeDetailBase<Type.IMAGE, string>
    [Type.C_SHADOW]: TypeDetailBase<Type.C_SHADOW, {
        color: string
        offsetX: number
        offsetY: number
        blur: number
    }>
}>

export enum Setter {
    NONE,
    CUSTOM = 'CUSTOM',
    FABRIC_PROPERTY = 'FABRIC_PROPERTY'
}

type SetterDetail = Assert<{ [index in Setter]: { setter: Setter } }, {
    [Setter.NONE]: {
        setter: Setter.NONE
    }
    [Setter.CUSTOM]: {
        setter: Setter.CUSTOM
        customSetter: Function //(this:Component,Component,value)
    }
    [Setter.FABRIC_PROPERTY]: {
        setter: Setter.FABRIC_PROPERTY,
        fabricPropertyName: string
    }
}>

export type Property<N extends string, T extends Type, S extends Setter> = {
    type: T
    setter: S
    name: N
    label: string

} & TypeDetail[T] & SetterDetail[S]

export type PropertyCommon = Property<string, Type, Setter>



export function defineProperty<N extends string, T extends Type, S extends Setter>(p: Property<N, T, S>) {
    return p
}


type ValueBoxT<Properties extends ReadonlyArray<Property<string, Type, Setter>>> = {
    [index in keyof Properties]: { v: TypeDetail[Properties[index]['type']]['defaultValue'], n: Properties[index]['name'] }
}[number]


export type ValueBox<Properties extends ReadonlyArray<Property<string, Type, Setter>>> = {
    [index in ValueBoxT<Properties>['n']]?: (ValueBoxT<Properties> & { n: index })['v']
}

export type ValueBoxCommon = ValueBox<Property<string, Type, Setter>[]>



const props = [defineProperty({
    label: '文字大小',
    name: 'FontSize',
    type: Type.NUMBER,
    defaultValue: 40,
    setter: Setter.FABRIC_PROPERTY,
    fabricPropertyName: 'fontSize'
}), defineProperty({
    type: Type.IMAGE,
    label: '图片',
    name: 'Image',
    defaultValue: `https://img.wqdlib.com/res/535402131914625024/20220908/41b4561430bf49c6ab132bc9626400cc.png?x-oss-process=image/resize,h_200,w_200`,
    setter: Setter.CUSTOM,
    customSetter: function (comp: any, val: string) {
        const obj = comp.fabricObject
        const width = obj.getScaledWidth()
        obj.setSrc(val, () => {
            const size = obj.getOriginalSize()
            obj.set({
                width: size.width,
                height: size.height,
                scaleX: width / size.width,
                scaleY: width / size.width
            })
            comp.fabric.requestRenderAll()
        }, {
            crossOrigin: 'anonymous'
        })
    }
})] as const

type z = ValueBoxT<typeof props>

type m = Required<ValueBox<typeof props>>

const a = {} as m







