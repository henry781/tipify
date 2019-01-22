import * as chai from 'chai';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {jsonProperty} from './jsonProperty';

describe('jsonProperty', () => {

    class Person {
        @jsonProperty('name', String)
        private _name: string;
    }

    it('should create type mapping', () => {
        const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Person);
        chai.expect(foundTypeMapping).not.undefined;
    });

    it('should add property mapping', () => {
        const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Person);

        const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_name');
        chai.expect(foundPropertyMapping).not.undefined;
        chai.expect(foundPropertyMapping.serializedName).equal('name');
        chai.expect(foundPropertyMapping.type).equal(String);

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
            chai.expect(foundPropertyMapping).not.undefined;
            chai.expect(foundPropertyMapping.serializedName).equal('name');
            chai.expect(foundPropertyMapping.type).equal(String);
        });

        it('should add property mapping (number)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_id');
            chai.expect(foundPropertyMapping).not.undefined;
            chai.expect(foundPropertyMapping.serializedName).equal('id');
            chai.expect(foundPropertyMapping.type).equal(Number);
        });

        it('should add property mapping (boolean)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_active');
            chai.expect(foundPropertyMapping).not.undefined;
            chai.expect(foundPropertyMapping.serializedName).equal('active');
            chai.expect(foundPropertyMapping.type).equal(Boolean);
        });

        it('should add property mapping (class)', () => {
            const foundTypeMapping = JsonConverterMapper.getMapping().find((m) => m.type === Smartphone);

            const foundPropertyMapping = foundTypeMapping.properties.find((m) => m.name === '_company');
            chai.expect(foundPropertyMapping).not.undefined;
            chai.expect(foundPropertyMapping.serializedName).equal('company');
            chai.expect(foundPropertyMapping.type).equal(Company);
        });
    });
});
