import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {isBoolean, isNullOrUndefined, isNumber, isObject, isString, tryParseBoolean, tryParseNumber} from './CommonUtil';

describe('CommonUtil', () => {

    /**
     * Try to parse a string to a boolean
     */
    describe('tryParseBoolean', () => {

        it('should return true when string is true', () => {
            const result = tryParseBoolean('true');
            expect(result).to.be.true;
        });

        it('should return false when string is false', () => {
            const result = tryParseBoolean('false');
            expect(result).to.be.false;
        });

        it('should return true when string is yes', () => {
            const result = tryParseBoolean('yes');
            expect(result).to.be.true;
        });

        it('should return false when string is no', () => {
            const result = tryParseBoolean('no');
            expect(result).to.be.false;
        });

        it('should return true when string is 1', () => {
            const result = tryParseBoolean('1');
            expect(result).to.be.true;
        });

        it('should return false when string is 0', () => {
            const result = tryParseBoolean('0');
            expect(result).to.be.false;
        });

        it('should throw an error when string is unknown', () => {
            expect(() => tryParseBoolean('something'))
                .throw(JsonConverterError, 'Obj cannot be parsed to type <Boolean>');
        });
    });

    /**
     * Try to parse a string to a number
     */
    describe('tryParseNumber', () => {

        it('should return 12 when string is 12', () => {
            const result = tryParseNumber('12');
            expect(result).to.equal(12);
        });

        it('should return 12.12 when string is 12.12', () => {
            const result = tryParseNumber('12.12');
            expect(result).to.equal(12.12);
        });

        it('should return 12.12 when string is 12.12', () => {
            expect(() => tryParseNumber('something'))
                .throw(JsonConverterError, 'Obj cannot be parsed to type <Number>');
        });
    });

    describe('isNullOrUndefined', () => {

        it('should return true when null', () => {
            expect(isNullOrUndefined(null)).to.be.true;
        });

        it('should return true when undefined', () => {
            expect(isNullOrUndefined(undefined)).to.be.true;
        });

        it('should return false when 0', () => {
            expect(isNullOrUndefined(0)).to.be.false;
        });

        it('should return false when empty string', () => {
            expect(isNullOrUndefined('')).to.be.false;
        });

        it('should return false when non empty string', () => {
            expect(isNullOrUndefined('test')).to.be.false;
        });
    });

    describe('isString', () => {

        it('should return false when object', () => {
            expect(isString({})).to.be.false;
        });

        it('should return true when string', () => {
            expect(isString('test')).to.be.true;
        });
    });

    describe('isBoolean', () => {

        it('should return false when object', () => {
            expect(isBoolean({})).to.be.false;
        });

        it('should return true when boolean', () => {
            expect(isBoolean(true)).to.be.true;
        });

        it('should return true when boolean (false)', () => {
            expect(isBoolean(false)).to.be.true;
        });
    });

    describe('isNumber', () => {

        it('should return false when object', () => {
            expect(isNumber({})).to.be.false;
        });

        it('should return true when number', () => {
            expect(isNumber(10)).to.be.true;
        });
    });

    describe('isObject', () => {

        it('should return false when number', () => {
            expect(isObject(10)).to.be.false;
        });

        it('should return true when object', () => {
            expect(isObject({})).to.be.true;
        });
    });
});
