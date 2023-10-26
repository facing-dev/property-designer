import * as PD from './index'
import { Property } from './property'
import { SetterDispatcher } from './setterDispatcher'



const def = PD.defineProperty<PD.PresetMetadata>()

const prop = [
    def({
        name: 'MyProp',
        valueType: 'Array',
        valueDefault: [],
        viewType: 'NUMBER',
        setterType: 'NONE',
        valueProperties:[]
    }), def({
        name: 'MyProp2',
        valueType: 'Array',
        valueDefault: [{c:1,d:'a',e:[{e2:''}]}],
        viewType: 'SELECT',
        setterType: 'NONE',
        valueProperties: [
            def(
                {
                    name: 'c',
                    valueType: 'NUMBER',
                    valueDefault: 1,
                    viewType: 'SELECT',
                    setterType: 'NONE',
                }
            ),
            def(
                {
                    name: 'd',
                    valueType: 'STRING',
                    valueDefault: '',
                    viewType: 'SELECT',
                    setterType: 'NONE',
                }
            ),
            def({
                name: 'e',
                valueType: 'Array',
                valueDefault: [],
                viewType: 'SELECT',
                setterType: 'NONE',
                valueProperties: [def(
                    {
                        name: 'e2',
                        valueType: 'STRING',
                        valueDefault: '',
                        viewType: 'SELECT',
                        setterType: 'NONE',
                    }
                )]
            })
        ]
    })]

const d = new SetterDispatcher<PD.PresetMetadata, { a: string }>({
    'CUSTOM': function () { this.a },
    'NONE': function () { }
}, { a: 's' })
const P = new Property<PD.PresetMetadata, typeof prop, any>(prop, {}, d)

const ppp = prop[1]
P.value
P.arrayInsertItem(ppp, 0, [], { c: 1, d: '', e: [] })
