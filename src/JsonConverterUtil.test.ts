import * as chai from 'chai';
import {JsonConverterError} from './JsonConverterError';
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
            chai.expect(() => JsonConverterUtil.tryParseBoolean('something'))
                .throw(JsonConverterError, 'E03');
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
            chai.expect(() => JsonConverterUtil.tryParseNumber('something'))
                .throw(JsonConverterError, 'E03');
        });
    });

    /**
     * Check consistency
     */
    describe('checkConsistency', () => {

        describe('when strict mode is enabled', () => {

            it('should throw an error when expecting string and got obj', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency({}, String, true))
                    .throw(JsonConverterError, 'E03');
            });

            it('should throw an error when expecting number and got string', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency('12', Number, true))
                    .throw(JsonConverterError, 'E03');
            });

            it('should throw an error when expecting boolean and got string', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency('true', Boolean, true))
                    .throw(JsonConverterError, 'E03');
            });

            it('should throw an error when expecting array and got not an array', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency('', [String], true))
                    .throw(JsonConverterError, 'E03');
            });

            it('should do nothing when got string and expecting string', () => {
                JsonConverterUtil.checkConsistency('', String, true);
            });

            it('should do nothing when got number and expecting number', () => {
                JsonConverterUtil.checkConsistency(1, Number, true);
            });

            it('should do nothing when got boolean and expecting boolean', () => {
                JsonConverterUtil.checkConsistency(true, Boolean, true);
            });

            it('should do nothing when got array and expecting array', () => {
                JsonConverterUtil.checkConsistency([''], [String], true);
            });
        });

        describe('when strict mode is disabled', () => {

            it('should do nothing when expecting number and got string', () => {
                JsonConverterUtil.checkConsistency('12', Number, false);
            });

            it('should do nothing when expecting boolean and got string', () => {
                JsonConverterUtil.checkConsistency('true', Boolean, false);
            });

            it('should throw an error when expecting number and got object', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency({}, Number, false))
                    .throw(JsonConverterError, 'E03');
            });

            it('should throw an error when expecting boolean and got not an array', () => {
                chai.expect(() => JsonConverterUtil.checkConsistency({}, Boolean, false))
                    .throw(JsonConverterError, 'E03');
            });
        });
    });
});
