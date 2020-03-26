import {fail} from 'assert';
import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {booleanConverter} from './booleanConverter';

describe('BooleanConverter', () => {

    describe('deserialize', () => {

        it('when is true (bool), should return true', () => {
            const obj = booleanConverter.deserialize(true, undefined, {tryParse: false});
            expect(obj).equal(true);
        });

        it('when is false (bool), should return false', () => {
            const obj = booleanConverter.deserialize(false, undefined, {tryParse: false});
            expect(obj).equal(false);
        });

        it('when is true (string) and tryParse is enabled, should return true', () => {
            const obj = booleanConverter.deserialize('true', undefined, {tryParse: true});
            expect(obj).equal(true);
        });

        it('when is false (string) and tryParse is enabled, should return true', () => {
            const obj = booleanConverter.deserialize('false', undefined, {tryParse: true});
            expect(obj).equal(false);
        });

        it('when is false (string) and tryParse is disabled, should throw an error', () => {

            try {
                booleanConverter.deserialize('false', undefined, {tryParse: false});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize, expected type is <Boolean>, but json is not');
            }
        });
    });

    describe('serialize', () => {

        it('should return obj', () => {
            const json = booleanConverter.serialize(true);
            expect(json).equal(true);
        });
    });
});
