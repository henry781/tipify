import {JsonConverter} from "./JsonConverter";
import * as chai from 'chai';

const converter = new JsonConverter();

describe('JsonConverter.deserialize', () => {

    it('should return null', () => {
        const result = converter.deserialize(null, String);
        chai.expect(result).to.be.null;
    });

    it('should return undefined', () => {
        const result = converter.deserialize(undefined, String);
        chai.expect(result).to.be.undefined;
    });

    it('should return number', () => {
        const result = converter.deserialize(-1, Number);
        chai.expect(result).to.equal(-1);
    });

    it('should return string', () => {
        const result = converter.deserialize('test', String);
        chai.expect(result).to.equal('test');
    });

    it('should return boolean', () => {
        const result = converter.deserialize(true, Boolean);
        chai.expect(result).to.equal(true);
    });

});