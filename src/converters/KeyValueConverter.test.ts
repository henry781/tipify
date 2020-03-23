import {expect} from 'chai';
import {createStubInstance} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {KeyValueConverter} from './KeyValueConverter';
import {StringConverter} from './StringConverter';

describe('KeyValueConverter', () => {

    let converter;
    let mapConverter: KeyValueConverter;
    const stringConverterDefinition = {converter: StringConverter};

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        mapConverter = new KeyValueConverter();
    });

    describe('deserialize', () => {

        it('when json is not an object, should throw an error', () => {
            const json = [];
            expect(() => mapConverter.deserialize(json, {keyType: String, valueConverter: stringConverterDefinition}, undefined, converter))
                .throws(JsonConverterError, 'Fail to deserialize map, given json is not an object');
        });

        it('when key is a string and expecting a number, should throw an error', () => {
            const json = {titi: 'toto'};
            expect(() => mapConverter.deserialize(json, {keyType: Number, valueConverter: stringConverterDefinition}, undefined, converter))
                .throws(JsonConverterError, 'Fail to parse map key <titi> should be a <Number>');
        });

        it('when fail to deserialize a value, should throw an error', () => {
            const json = {titi: 'toto'};
            converter.processDeserialize
                .withArgs('toto', stringConverterDefinition)
                .throws(new JsonConverterError(''));

            expect(() => mapConverter.deserialize(json, {keyType: String, valueConverter: stringConverterDefinition}, undefined, converter))
                .throws(JsonConverterError, 'Fail to deserialize map value with key <titi>');
        });

        it('should deserialize map', () => {
            const json = {titi: 'toto'};
            converter.processDeserialize
                .withArgs('toto', stringConverterDefinition)
                .returns('toto1');

            const result = mapConverter.deserialize(json, {
                keyType: String,
                valueConverter: stringConverterDefinition,
            }, undefined, converter);
            expect(result).deep.equal({titi: 'toto1'});
        });
    });

    describe('serialize', () => {

        it('when fail to serialize a value, should throw an error', () => {
            const json = {titi: 'toto'};
            converter.processSerialize
                .withArgs('toto', stringConverterDefinition)
                .throws(new JsonConverterError(''));

            expect(() => mapConverter.serialize(json, {keyType: String, valueConverter: stringConverterDefinition}, undefined, converter))
                .throws(JsonConverterError, 'Fail to serialize map value with key <titi>');
        });

        it('should serialize map', () => {
            const json = {titi: 'toto'};
            converter.processSerialize
                .withArgs('toto', stringConverterDefinition)
                .returns('toto1');

            const result = mapConverter.serialize(json, {keyType: String, valueConverter: stringConverterDefinition}, undefined, converter);
            expect(result).deep.equal({titi: 'toto1'});
        });
    });
});
