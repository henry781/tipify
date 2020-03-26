import {expect} from 'chai';
import {arrayConverter} from '../converters/arrayConverter';
import {booleanConverter} from '../converters/booleanConverter';
import {numberConverter} from '../converters/numberConverter';
import {objectConverter, ObjectConverterArgs} from '../converters/objectConverter';
import {stringConverter} from '../converters/stringConverter';
import {Car} from '../samples/models/Car';
import {autodetectConverterAndArgs, normalizeConverterAndArgs} from './jsonConverterUtil';

describe('jsonConverterUtil', () => {

    describe('normalizeConverter', () => {

        it('should return converter with args when type is a converter', () => {
            const result = normalizeConverterAndArgs(arrayConverter);
            expect(result.converter).is.equal(arrayConverter);
        });

        it('should return converter with args when type is a converter with args', () => {
            const converterWithOptions = {converter: arrayConverter};
            const result = normalizeConverterAndArgs(converterWithOptions);
            expect(result).is.equal(converterWithOptions);
        });

        it('should return StringConverter with args when type is String', () => {
            const result = normalizeConverterAndArgs(String);
            expect(result.converter).is.equal(stringConverter);
        });

        it('should return BooleanConverter with args when type is Boolean', () => {
            const result = normalizeConverterAndArgs(Boolean);
            expect(result.converter).is.equal(booleanConverter);
        });

        it('should return NumberConverter with args when type is Number', () => {
            const result = normalizeConverterAndArgs(Number);
            expect(result.converter).is.equal(numberConverter);
        });

        it('should return ObjectConverter with args when type is a type', () => {
            const result = normalizeConverterAndArgs(Car);
            expect(result.converter).is.equal(objectConverter);
            expect((result.args as ObjectConverterArgs).type).is.equal(Car);
        });
    });

    describe('autodetectConverter', () => {

        it('should return ArrayConverter when obj is an array', () => {
            const result = autodetectConverterAndArgs(['test']);
            expect(result.converter).to.equal(arrayConverter);
        });

        it('should return StringConverter when obj is a string', () => {
            const result = autodetectConverterAndArgs('test');
            expect(result.converter).to.equal(stringConverter);
        });

        it('should return NumberConverter when obj is a number', () => {
            const result = autodetectConverterAndArgs(10);
            expect(result.converter).to.equal(numberConverter);
        });

        it('should return BooleanConverter when obj is a boolean', () => {
            const result = autodetectConverterAndArgs(true);
            expect(result.converter).to.equal(booleanConverter);
        });

        it('should return BooleanConverter when obj is an object', () => {
            const result = autodetectConverterAndArgs(new Car());
            expect(result.converter).to.equal(objectConverter);
            expect((result.args as ObjectConverterArgs).type).to.equal(Car);
        });
    });
});
