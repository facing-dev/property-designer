import * as PD from './index'
import { Property } from './property'
import { SetterDispatcher } from './setterDispatcher'
const def = PD.defineProperty<PD.PresetMetadata>()
const prop = [def({
    name: 'MyProp',
    valueType: 'Array',
    valueDefault: [],
    viewType: PD.PresetViewType.SELECT,
    setterType: PD.PresetSetterType.NONE,
    valueProperties: [
        def(
            {

                name: 'c',
                valueType: PD.PresetValueType.NUMBER,
                valueDefault: 1,
                viewType: PD.PresetViewType.SELECT,
                setterType: PD.PresetSetterType.NONE,
            }
        )
    ]
}), def({
    name: 'MyProp2',
    valueType: 'Array',
    valueDefault: [],
    viewType: PD.PresetViewType.SELECT,
    setterType: PD.PresetSetterType.NONE,
    valueProperties: [
        def(
            {
                name: 'c',
                valueType: PD.PresetValueType.NUMBER,
                valueDefault: 1,
                viewType: PD.PresetViewType.SELECT,
                setterType: PD.PresetSetterType.NONE,
            }
        ),
        def(
            {
                name: 'd',
                valueType: PD.PresetValueType.STRING,
                valueDefault: '',
                viewType: PD.PresetViewType.SELECT,
                setterType: PD.PresetSetterType.NONE,
            }
        ),
        def({
            name: 'e',
            valueType: 'Array',
            valueDefault: [],
            viewType: PD.PresetViewType.SELECT,
            setterType: PD.PresetSetterType.NONE,
            valueProperties: [def(
                {
                    name: 'e2',
                    valueType: PD.PresetValueType.STRING,
                    valueDefault: '',
                    viewType: PD.PresetViewType.SELECT,
                    setterType: PD.PresetSetterType.NONE,
                }
            )]
        })
    ]
})]

const d = new SetterDispatcher<PD.PresetMetadata, {a:string}>({
    'CUSTOM': function () {this.a },
    'NONE': function () { }
}, {a:'s'})
const P = new Property<PD.PresetMetadata, typeof prop>(prop, d)

P.value.MyProp2[1].e[0].e2


