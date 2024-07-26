import * as PD from './index'
import { PropertyManager } from './propertyManager'
import { SetterDispatcher } from './setterDispatcher'



const def = PD.defineProperty<PD.PresetMetadata>()

const prop = [
    def({
        name: 'MyProp',
        viewType: 'Array',
        valueType: 'Array',
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
        valueType: 'Array',
        valueDefault: [{ c: 1, d: '1', e: [{ e2: '' }] }],
        viewType: 'Array',
        setterType:'None',
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
                valueType: 'Array',
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
                        viewMultiline:false
                    }
                )]
            })
        ]
    })]
const d = new SetterDispatcher<PD.PresetMetadata, { a: string }>({
    'Custom': function () { this.a },
    'None': function () { }
}, { a: 's' })



declare const z: PD.Property<PD.PresetMetadata>
if (z.valueType === 'Number') {

}

