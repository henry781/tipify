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
        booleanConverter = new BooleanConverter(converter);
    });

    describe('deserialize', () => {

        it('when is <true>, should return true', () => {
            const obj = booleanConverter.deserialize(true, {});
            expect(obj).equal(true);
        });

        it('when is <false>, should return false', () => {
            const obj = booleanConverter.deserialize(false, {});
            expect(obj).equal(false);
        });

        it('when is <\'true\'> and tryParse is enabled, should return true', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: true};
            });
            const obj = booleanConverter.deserialize('true', {});
            expect(obj).equal(true);
        });

        it('when is <\'false\'> and tryParse is enabled, should return true', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: true};
            });
            const obj = booleanConverter.deserialize('false', {});
            expect(obj).equal(false);
        });

        it('when is <\'false\'> and tryParse is disabled, should throw an error', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: false};
            });

            try {
                booleanConverter.deserialize('false', {});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize boolean, expected type is <Boolean>, but obj is not');
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
