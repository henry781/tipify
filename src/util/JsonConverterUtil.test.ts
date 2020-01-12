import * as chai from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {tryParseBoolean, tryParseNumber} from './JsonConverterUtil';

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
            chai.expect(result).to.be.true;
        });

        it('should return false when string is false', () => {
            const result = tryParseBoolean('false');
            chai.expect(result).to.be.false;
        });

        it('should return true when string is yes', () => {
            const result = tryParseBoolean('yes');
            chai.expect(result).to.be.true;
        });

        it('should return false when string is no', () => {
            const result = tryParseBoolean('no');
            chai.expect(result).to.be.false;
        });

        it('should return true when string is 1', () => {
            const result = tryParseBoolean('1');
            chai.expect(result).to.be.true;
        });

        it('should return false when string is 0', () => {
            const result = tryParseBoolean('0');
            chai.expect(result).to.be.false;
        });

        it('should throw an error when string is unknown', () => {
            chai.expect(() => tryParseBoolean('something'))
                .throw(JsonConverterError, 'E03');
        });
    });

    /**
     * Try to parse a string to a number
     */
    describe('tryParseNumber', () => {

        it('should return 12 when string is 12', () => {
            const result = tryParseNumber('12');
            chai.expect(result).to.equal(12);
        });

        it('should return 12.12 when string is 12.12', () => {
            const result = tryParseNumber('12.12');
            chai.expect(result).to.equal(12.12);
        });

        it('should return 12.12 when string is 12.12', () => {
            chai.expect(() => tryParseNumber('something'))
                .throw(JsonConverterError, 'E03');
        });
    });
});
