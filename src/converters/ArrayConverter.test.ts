import {fail} from 'assert';
import {expect} from 'chai';
import {createStubInstance} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {ArrayConverter} from './ArrayConverter';
import {StringConverter} from './StringConverter';

describe('ArrayConverter', () => {

    let converter;
    let arrayConverter: ArrayConverter;
    const stringConverterDefinition = {converter: StringConverter};

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        arrayConverter = new ArrayConverter();
    });

    describe('deserialize', () => {

        it('when json is not an array, should throw an error', () => {

            const json = {};
            try {
                arrayConverter.deserialize(json, {itemConverter: stringConverterDefinition}, undefined, converter);
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).contains('Fail to deserialize, given json is not an array');
            }
        });

        it('should deserialize each item', () => {

            const json = ['toto', 'titi'];
            converter.processDeserialize.withArgs('toto', stringConverterDefinition).returns('toto1');
            converter.processDeserialize.withArgs('titi', stringConverterDefinition).returns('titi1');

            const obj = arrayConverter.deserialize(json, {itemConverter: stringConverterDefinition}, undefined, converter);

            expect(obj).length(2);
            expect(obj[0]).equal('toto1');
            expect(obj[1]).equal('titi1');
        });

        it('when deserialization of item <1> fail, should throw an error', () => {

            const json = ['toto', 'titi'];
            converter.processDeserialize.withArgs('toto', stringConverterDefinition).returns('toto1');
            converter.processDeserialize.withArgs('titi', stringConverterDefinition).throws(new Error('unexpected'));

            try {
                arrayConverter.deserialize(json, {itemConverter: stringConverterDefinition}, undefined, converter);
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).contains('Fail to deserialize index <1> of array');
            }
        });
    });

    describe('serialize', () => {

        it('should serialize each item', () => {

            const obj = ['toto', 'titi'];
            converter.processSerialize.withArgs('toto', stringConverterDefinition).returns('toto1');
            converter.processSerialize.withArgs('titi', stringConverterDefinition).returns('titi1');

            const json = arrayConverter.serialize(obj, {itemConverter: stringConverterDefinition}, undefined, converter);

            expect(json).length(2);
            expect(json[0]).equal('toto1');
            expect(json[1]).equal('titi1');
        });

        it('when serialization of item <1> fail, should throw an error', () => {

            const obj = ['toto', 'titi'];
            converter.processSerialize.withArgs('toto', stringConverterDefinition).returns('toto1');
            converter.processSerialize.withArgs('titi', stringConverterDefinition).throws(new Error('unexpected'));

            try {
                arrayConverter.serialize(obj, {itemConverter: stringConverterDefinition}, undefined, converter);
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).contains('Fail to serialize index <1> of array');
            }
        });
    });
});
