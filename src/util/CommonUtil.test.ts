import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {tryParseBoolean, tryParseNumber} from './CommonUtil';

/**
 * JsonConverterUtil
 */
describe('JsonConverterUtil', () => {

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
});
