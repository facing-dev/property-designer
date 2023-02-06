import * as PD from './index'
import { Property } from './property'
import { PropertyValueArray } from './type'
const def = PD.defineProperty<PD.PresetPropertyData>()
const prop = [def({
    name: 'MyProp',
    valueType: PropertyValueArray,
    valueDefault: [],
    viewType: PD.PresetViewType.SELECT,
    setterType: PD.PresetSetterType.NONE,
    valuePropertyDefinitions: [
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
    valueType: PropertyValueArray,
    valueDefault: [],
    viewType: PD.PresetViewType.SELECT,
    setterType: PD.PresetSetterType.NONE,
    valuePropertyDefinitions: [
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
            valueType: PropertyValueArray,
            valueDefault: [],
            viewType: PD.PresetViewType.SELECT,
            setterType: PD.PresetSetterType.NONE,
            valuePropertyDefinitions: [def(
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
const P = new Property(prop)
const z = P.value.MyProp2[0].e[0].e2


