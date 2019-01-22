import * as chai from 'chai';
import {JsonConverterUtil} from './JsonConverterUtil';

/**
 * JsonConverterUtil
 */
describe('JsonConverterUtil', () => {

    /**
     * Try to parse a string to a boolean
     */
    describe('tryParseBoolean', () => {

        it('should return true when string is true', () => {
            const result = JsonConverterUtil.tryParseBoolean('true');
            chai.expect(result).to.be.true;
        });

        it('should return false when string is false', () => {
            const result = JsonConverterUtil.tryParseBoolean('false');
            chai.expect(result).to.be.false;
        });

        it('should return true when string is yes', () => {
            const result = JsonConverterUtil.tryParseBoolean('yes');
            chai.expect(result).to.be.true;
        });

        it('should return false when string is no', () => {
            const result = JsonConverterUtil.tryParseBoolean('no');
            chai.expect(result).to.be.false;
        });

        it('should return true when string is 1', () => {
            const result = JsonConverterUtil.tryParseBoolean('1');
            chai.expect(result).to.be.true;
        });

        it('should return false when string is 0', () => {
            const result = JsonConverterUtil.tryParseBoolean('0');
            chai.expect(result).to.be.false;
        });

        it('should throw an error when string is unknown', () => {
            chai.expect(() => JsonConverterUtil.tryParseBoolean('something')).to.throw();
        });
    });

    /**
     * Try to parse a string to a number
     */
    describe('tryParseNumber', () => {

        it('should return 12 when string is 12', () => {
            const result = JsonConverterUtil.tryParseNumber('12');
            chai.expect(result).to.equal(12);
        });

        it('should return 12.12 when string is 12.12', () => {
            const result = JsonConverterUtil.tryParseNumber('12.12');
            chai.expect(result).to.equal(12.12);
        });

        it('should return 12.12 when string is 12.12', () => {
            chai.expect(() => JsonConverterUtil.tryParseNumber('something')).to.throw();
        });
    });
});
