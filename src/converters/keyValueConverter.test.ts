import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {JsonConverterError} from '../core/JsonConverterError';
import {anyConverter} from './anyConverter';
import {keyValueConverter, KeyValueConverterArgs} from './keyValueConverter';

describe('KeyValueConverter', () => {

    const sandbox = createSandbox();
    const stringKeyValueConverterArgs: KeyValueConverterArgs = {
        keyType: String,
        valueConverter: anyConverter,
        valueConverterArgs: {arg: 'something'},
    };
    const numberKeyValueConverterArgs: KeyValueConverterArgs = {
        keyType: Number,
        valueConverter: anyConverter,
        valueConverterArgs: {arg: 'something'},
    };

    afterEach(() => {
        sandbox.restore();
    });

    describe('deserialize', () => {

        it('when json is not an object, should throw an error', () => {
            const json = [];
            expect(() => keyValueConverter.deserialize(json, stringKeyValueConverterArgs))
                .throws(JsonConverterError, 'Fail to deserialize map, given json is not an object');
        });

        it('when key is a string and expecting a number, should throw an error', () => {
            const json = {titi: 'toto'};
            expect(() => keyValueConverter.deserialize(json, numberKeyValueConverterArgs))
                .throws(JsonConverterError, 'Fail to parse map key <titi> should be a <Number>');
        });

        it('when fail to deserialize a value, should throw an error', () => {
            const json = {titi: 'toto'};
            sandbox.stub(anyConverter, 'deserialize')
                .withArgs('toto', stringKeyValueConverterArgs.valueConverterArgs)
                .throws(new JsonConverterError(''));

            expect(() => keyValueConverter.deserialize(json, stringKeyValueConverterArgs))
                .throws(JsonConverterError, 'Fail to deserialize map value with key <titi>');
        });

        it('should deserialize map', () => {
            const json = {titi: 'toto'};
            sandbox.stub(anyConverter, 'deserialize')
                .withArgs('toto', stringKeyValueConverterArgs.valueConverterArgs)
                .returns('toto1');

            const result = keyValueConverter.deserialize(json, stringKeyValueConverterArgs);
            expect(result).deep.equal({titi: 'toto1'});
        });
    });

    describe('serialize', () => {

        it('when fail to serialize a value, should throw an error', () => {
            const json = {titi: 'toto'};
            sandbox.stub(anyConverter, 'serialize')
                .withArgs('toto', stringKeyValueConverterArgs.valueConverterArgs)
                .throws(new JsonConverterError(''));

            expect(() => keyValueConverter.serialize(json, stringKeyValueConverterArgs))
                .throws(JsonConverterError, 'Fail to serialize map value with key <titi>');
        });

        it('should serialize map', () => {
            const json = {titi: 'toto'};
            sandbox.stub(anyConverter, 'serialize')
                .withArgs('toto', stringKeyValueConverterArgs.valueConverterArgs)
                .returns('toto1');

            const result = keyValueConverter.serialize(json, stringKeyValueConverterArgs);
            expect(result).deep.equal({titi: 'toto1'});
        });
    });
});
