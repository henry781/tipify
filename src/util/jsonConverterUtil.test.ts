import {expect} from 'chai';
import {ArrayConverter} from '../converters/ArrayConverter';
import {BooleanConverter} from '../converters/BooleanConverter';
import {NumberConverter} from '../converters/NumberConverter';
import {ObjectConverter, ObjectConverterOptions} from '../converters/ObjectConverter';
import {StringConverter} from '../converters/StringConverter';
import {Car} from '../samples/models/Car';
import {autodetectConverter, normalizeConverter} from './jsonConverterUtil';

describe('jsonConverterUtil', () => {

    describe('normalizeConverter', () => {

        it('should return undefined when type is undefined', () => {
            const result = normalizeConverter(undefined);
            expect(result).is.undefined;
        });

        it('should return null when type is null', () => {
            const result = normalizeConverter(null);
            expect(result).is.undefined;
        });

        it('should return converter with options when type is a converter', () => {
            const result = normalizeConverter(ArrayConverter);
            expect(result.converter).is.equal(ArrayConverter);
        });

        it('should return converter with options when type is a converter with options', () => {
            const converterWithOptions = {converter: ArrayConverter};
            const result = normalizeConverter(converterWithOptions);
            expect(result).is.equal(converterWithOptions);
        });

        it('should return StringConverter with options when type is String', () => {
            const result = normalizeConverter(String);
            expect(result.converter).is.equal(StringConverter);
        });

        it('should return BooleanConverter with options when type is Boolean', () => {
            const result = normalizeConverter(Boolean);
            expect(result.converter).is.equal(BooleanConverter);
        });

        it('should return NumberConverter with options when type is Number', () => {
            const result = normalizeConverter(Number);
            expect(result.converter).is.equal(NumberConverter);
        });

        it('should return ObjectConverter with options when type is a type', () => {
            const result = normalizeConverter(Car);
            expect(result.converter).is.equal(ObjectConverter);
            expect((result.options as ObjectConverterOptions).type).is.equal(Car);
        });
    });

    describe('autodetectConverter', () => {

        it('should return ArrayConverter when obj is an array', () => {
            const result = autodetectConverter(['test']);
            expect(result.converter).to.equal(ArrayConverter);
        });

        it('should return StringConverter when obj is a string', () => {
            const result = autodetectConverter('test');
            expect(result.converter).to.equal(StringConverter);
        });

        it('should return NumberConverter when obj is a number', () => {
            const result = autodetectConverter(10);
            expect(result.converter).to.equal(NumberConverter);
        });

        it('should return BooleanConverter when obj is a boolean', () => {
            const result = autodetectConverter(true);
            expect(result.converter).to.equal(BooleanConverter);
        });

        it('should return BooleanConverter when obj is an object', () => {
            const result = autodetectConverter(new Car());
            expect(result.converter).to.equal(ObjectConverter);
            expect((result.options as ObjectConverterOptions).type).to.equal(Car);
        });
    });
});
