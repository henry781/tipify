import {fail} from 'assert';
import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {stringConverter} from './stringConverter';

describe('StringConverter', () => {

    describe('deserialize', () => {

        it('when value is titi, should return titi', () => {
            const obj = stringConverter.deserialize('titi', {});
            expect(obj).equal('titi');
        });

        it('when value is 10 (number), should throw an error', () => {
            try {
                stringConverter.deserialize(10, {});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize string, expected type is <String>, but json is not');
            }
        });
    });

    describe('serialize', () => {

        it('should return obj', () => {
            const json = stringConverter.serialize('titi', {});
            expect(json).equal('titi');
        });
    });
});
