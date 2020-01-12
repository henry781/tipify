import {fail} from 'assert';
import {expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {StringConverter} from './StringConverter';

describe('StringConverter', () => {

    let converter;
    let stringConverter: StringConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        stringConverter = new StringConverter(converter);
    });

    describe('deserialize', () => {

        it('when value is <titi>, should return titi', () => {
            const obj = stringConverter.deserialize('titi', {});
            expect(obj).equal('titi');
        });

        it('when value is <10>, should throw an error', () => {
            stub(converter, 'options').get(() => {
                return {tryParse: false};
            });

            try {
                stringConverter.deserialize(10, {});
                fail();
            } catch (err) {
                expect(err).instanceOf(JsonConverterError);
                expect(err.message).equal('Fail to deserialize string, expected type is <String>, but obj is not');
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
