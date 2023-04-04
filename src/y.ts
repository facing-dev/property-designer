import * as PD from './index'
import { Property } from './property'
// import { PropertyValueArray } from './type2'
const def = PD.defineProperty<PD.PresetMetadata>()
const prop = [def({
    name: 'MyProp',
    valueType: 'Array',
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
    valueType: 'Array',
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
            valueType: 'Array',
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


