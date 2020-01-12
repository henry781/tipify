import {fail} from 'assert';
import {expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {NumberConverter} from './NumberConverter';

describe('NumberConverter', () => {

    let converter;
    let numberConverter: NumberConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        numberConverter = new NumberConverter(converter);
    });

    describe('deserialize', () => {

        it('when is <10>, should return 10', () => {
            const obj = numberConverter.deserialize(10, {});
            expect(obj).equal(10);
        });

        it('when is <0>, should return 0', () => {
            const obj = numberConverter.deserialize(0, {});
            expect(obj).equal(0);
        });

        it('when is <\'10\'> and tryParse is enabled, should return 10', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: true};
            });
            const obj = numberConverter.deserialize('10', {});
            expect(obj).equal(10);
        });

        it('when is <\'10\'> and tryParse is disabled, should throw an error', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: false};
            });

            try {
                numberConverter.deserialize('10', {});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize number, expected type is <Number>, but obj is not');
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
