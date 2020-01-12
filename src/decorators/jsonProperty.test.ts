import {expect} from 'chai';
import {BooleanConverter} from '../converters/BooleanConverter';
import {NumberConverter} from '../converters/NumberConverter';
import {ObjectConverter} from '../converters/ObjectConverter';
import {StringConverter} from '../converters/StringConverter';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {jsonProperty} from './jsonProperty';

describe('jsonProperty', () => {

    class Person {
        @jsonProperty('name')
        private _name: string;
    }

    it('should create type mapping', () => {
        const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Person);
        expect(foundTypeMapping).not.undefined;
    });

    it('should add property mapping', () => {
        const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Person);

        const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_name');
        expect(foundPropertyMapping).not.undefined;
        expect(foundPropertyMapping.serializedName).equal('name');
        expect(foundPropertyMapping.converterDefinition).deep.equal({converter: StringConverter});

    });

    describe('implicit property typing', () => {

        class Company {

            @jsonProperty('name')
            private _name: string;
        }

        class Smartphone {
            @jsonProperty('name')
            private _name: string;

            @jsonProperty('id')
            private _id: number;

            @jsonProperty('active')
            private _active: boolean;

            @jsonProperty('company')
            private _company: Company;
        }

        it('should add property mapping (string)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_name');
            expect(foundPropertyMapping).not.undefined;
            expect(foundPropertyMapping.serializedName).equal('name');
            expect(foundPropertyMapping.converterDefinition).deep.equal({converter: StringConverter});
        });

        it('should add property mapping (number)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_id');
            expect(foundPropertyMapping).not.undefined;
            expect(foundPropertyMapping.serializedName).equal('id');
            expect(foundPropertyMapping.converterDefinition).deep.equal({converter: NumberConverter});
        });

        it('should add property mapping (boolean)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_active');
            expect(foundPropertyMapping).not.undefined;
            expect(foundPropertyMapping.serializedName).equal('active');
            expect(foundPropertyMapping.converterDefinition).deep.equal({converter: BooleanConverter});
        });

        it('should add property mapping (class)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_company');
            expect(foundPropertyMapping).not.undefined;
            expect(foundPropertyMapping.serializedName).equal('company');
            expect(foundPropertyMapping.converterDefinition).deep.equal({converter: ObjectConverter, options: {type: Company}});
        });
    });
});
