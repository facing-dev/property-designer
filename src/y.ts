import * as PD from './index'
import { ValueTypeArray } from './index'
import { PropertyManager } from './propertyManager'
import { SetterDispatcher } from './setterDispatcher'



const def = PD.defineProperty<PD.PresetMetadata>()

const prop = [
    def({
        name: 'MyProp',
        viewType: 'Array',
        valueType: "Array",
        valueDefault: [],

        setterType: 'None',
        valueProperties: [def(
            {
                name: 'c',
                valueType: 'Number',
                viewType: 'Number',

                valueDefault: 1,

                setterType: 'None',
            }
        )]
    }),
    def({
        name: 'MyProp2',
        valueType: ValueTypeArray,
        valueDefault: [{ c: 1, d: '1', e: [{ e2: '' }] }],
        viewType: 'Array',
        setterType: 'None',
        valueAfterInsert(a, b, c) {
            let z = c[0].e[10].e2
        },
        valueProperties: [
            def(
                {
                    name: 'c',
                    valueType: 'Number',
                    valueDefault: 1,
                    viewType: 'Number',
                    setterType: 'None',
                }
            ),
            def(
                {
                    name: 'd',
                    valueType: 'String',
                    valueDefault: '',
                    viewType: 'Text',
                    setterType: 'None',
                }
            ),
            def({
                name: 'e',
                valueType: ValueTypeArray,
                valueDefault: [],
                viewType: 'Array',
                setterType: 'None',

                valueProperties: [def(
                    {
                        name: 'e2',
                        valueType: 'String',
                        valueDefault: '',
                        viewType: 'Text',
                        setterType: 'None',
                        viewMultiline: false
                    }
                )]
            })
        ]
    })
] as const
const d = new SetterDispatcher<{ a: string }>({
    'Custom': function () { this.a },
    'None': function () { }
})



declare const z: PD.Property<PD.PresetMetadata>
if (z.valueType === ValueTypeArray) {
    z.valueProperties
}

if (z.valueType === 'Number') {
    let c: number = z.valueDefault
}
if (z.valueType === 'Option') {
    let a: Array<any> = z.valueOptoins
}

const pm = new PropertyManager(prop,{a:'s'}, d)
const f = pm.initialize(null)
f()

pm.applyValue(prop[1].valueProperties[0],pm.value.MyProp2[0],1)

const kk = pm.generateDefaultArrayItem(prop[0])