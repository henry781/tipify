import {fail} from 'assert';
import {expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {BooleanConverter} from './BooleanConverter';

describe('BooleanConverter', () => {

    let converter;
    let booleanConverter: BooleanConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        booleanConverter = new BooleanConverter();
    });

    describe('deserialize', () => {

        it('when is true (bool), should return true', () => {
            const obj = booleanConverter.deserialize(true, {}, undefined, converter);
            expect(obj).equal(true);
        });

        it('when is false (bool), should return false', () => {
            const obj = booleanConverter.deserialize(false, {}, undefined, converter);
            expect(obj).equal(false);
        });

        it('when is true (string) and tryParse is enabled, should return true', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: true};
            });
            const obj = booleanConverter.deserialize('true', {}, undefined, converter);
            expect(obj).equal(true);
        });

        it('when is false (string) and tryParse is enabled, should return true', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: true};
            });
            const obj = booleanConverter.deserialize('false', {}, undefined, converter);
            expect(obj).equal(false);
        });

        it('when is false (string) and tryParse is disabled, should throw an error', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: false};
            });

            try {
                booleanConverter.deserialize('false', {}, undefined, converter);
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize, expected type is <Boolean>, but json is not');
            }
        });
    });

    describe('serialize', () => {

        it('should return obj', () => {
            const json = booleanConverter.serialize(true, {});
            expect(json).equal(true);
        });
    });
});
