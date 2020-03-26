import {expect} from 'chai';
import {JsonConverter} from '../../core/JsonConverter';
import {Gender} from './Gender';
import {Passenger} from './Passenger';

interface DataEntry {
    expectedJson?: any;
    expectedObject?;
    json: any;
    name: string;
    object: any;
}

const data: DataEntry[] = [
    // basic
    {
        json: {
            gender: 'MALE',
            informations: {
                a: false,
                b: 'c',
            },
            name: 'titi',
            pid: 10,
        },
        name: 'basic',
        object: new Passenger({
            gender: Gender.MALE,
            informations: {
                a: false,
                b: 'c',
            },
            name: 'titi',
            pid: {id: 10},
        }),
    },

    // null
    {
        json: null,
        name: 'null',
        object: null,
    },

    // undefined
    {
        json: undefined,
        name: 'null',
        object: undefined,
    },

    // field null
    {
        expectedJson: {},
        json: {
            gender: null,
            informations: null,
            name: null,
            pid: null,
        },
        name: 'field null',
        object: new Passenger({
            gender: null,
            informations: null,
            name: null,
            pid: null,
        }),
    },
];

describe('Passenger', () => {

    const converter = new JsonConverter();

    for (const d of data) {
        describe(d.name, () => {
            it('serialize ' + d.name, () => {
                const expectedJson = d.hasOwnProperty('expectedJson') ? d.expectedJson : d.json;
                expect(converter.serialize(d.object)).deep.equal(expectedJson);
            });

            it('deserialize ' + d.name, () => {
                const expectedObject = d.hasOwnProperty('expectedObject') ? d.expectedObject : d.object;
                expect(converter.deserialize(d.json, Passenger)).deep.equal(expectedObject);
            });
        });
    }
});
