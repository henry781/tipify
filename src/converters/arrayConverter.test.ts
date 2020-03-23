import {fail} from 'assert';
import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {JsonConverterError} from '../core/JsonConverterError';
import {anyConverter} from './anyConverter';
import {arrayConverter} from './arrayConverter';

describe('ArrayConverter', () => {

    const sandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('deserialize', () => {

        it('when json is not an array, should throw an error', () => {

            const json = {};
            try {
                arrayConverter.deserialize(json, {itemConverter: undefined, itemConverterArgs: undefined});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).contains('Fail to deserialize, given json is not an array');
            }
        });

        it('should deserialize each item', () => {

            const json = ['toto', 'titi'];
            const anyConverterDeserialize = sandbox.stub(anyConverter, 'deserialize');
            anyConverterDeserialize.withArgs('toto', {arg: 'something'}).returns('toto1');
            anyConverterDeserialize.withArgs('titi', {arg: 'something'}).returns('titi1');

            const obj = arrayConverter.deserialize(json, {
                itemConverter: anyConverter,
                itemConverterArgs: {arg: 'something'},
            }, undefined);

            expect(obj).length(2);
            expect(obj[0]).equal('toto1');
            expect(obj[1]).equal('titi1');
        });

        it('when deserialization of item <1> fail, should throw an error', () => {

            const json = ['toto', 'titi'];
            const anyConverterDeserialize = sandbox.stub(anyConverter, 'deserialize');
            anyConverterDeserialize.withArgs('toto', {arg: 'something'}).returns('toto1');
            anyConverterDeserialize.withArgs('titi', {arg: 'something'}).throws(new Error('unexpected'));

            try {
                arrayConverter.deserialize(json, {itemConverter: anyConverter, itemConverterArgs: {arg: 'something'}});
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
            const anyConverterSerialize = sandbox.stub(anyConverter, 'serialize');
            anyConverterSerialize.withArgs('toto', {arg: 'something'}).returns('toto1');
            anyConverterSerialize.withArgs('titi', {arg: 'something'}).returns('titi1');

            const json = arrayConverter.serialize(obj, {itemConverter: anyConverter, itemConverterArgs: {arg: 'something'}});

            expect(json).length(2);
            expect(json[0]).equal('toto1');
            expect(json[1]).equal('titi1');
        });

        it('when serialization of item <1> fail, should throw an error', () => {

            const obj = ['toto', 'titi'];
            const anyConverterSerialize = sandbox.stub(anyConverter, 'serialize');
            anyConverterSerialize.withArgs('toto', {arg: 'something'}).returns('toto1');
            anyConverterSerialize.withArgs('titi', {arg: 'something'}).throws(new Error('unexpected'));

            try {
                arrayConverter.serialize(obj, {itemConverter: anyConverter, itemConverterArgs: {arg: 'something'}});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).contains('Fail to serialize index <1> of array');
            }
        });
    });
});
