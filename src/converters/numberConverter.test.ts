import {fail} from 'assert';
import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {numberConverter} from './numberConverter';

describe('NumberConverter', () => {

    describe('deserialize', () => {

        it('when is 10 (number), should return 10', () => {
            const obj = numberConverter.deserialize(10, undefined, {tryParse: false});
            expect(obj).equal(10);
        });

        it('when is 0 (number), should return 0', () => {
            const obj = numberConverter.deserialize(0, undefined, {tryParse: false});
            expect(obj).equal(0);
        });

        it('when is 10 (string) and tryParse is enabled, should return 10', () => {
            const obj = numberConverter.deserialize('10', undefined, {tryParse: true});
            expect(obj).equal(10);
        });

        it('when is 10 (string) and tryParse is disabled, should throw an error', () => {

            try {
                numberConverter.deserialize('10', undefined, {tryParse: false});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize, expected type is <Number>, but json is not');
            }
        });
    });

    describe('serialize', () => {

        it('should return obj', () => {
            const json = numberConverter.serialize(10, {});
            expect(json).equal(10);
        });
    });
});
