import {expect} from 'chai';
import * as sinon from 'sinon';
import {JsonConverter} from './JsonConverter';

describe('JsonConverter', () => {

    const converter = new JsonConverter();
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe('deserialize', () => {

        it('should return null', () => {
            const result = converter.deserialize(null, String);
            expect(result).to.be.null;
        });

        it('should return undefined', () => {
            const result = converter.deserialize(undefined, String);
            expect(result).to.be.undefined;
        });
    });

    describe('serialize', () => {

        it('should return null', () => {
            const result = converter.serialize(null);
            expect(result).to.be.null;
        });

        it('should return undefined', () => {
            const result = converter.serialize(undefined);
            expect(result).to.be.undefined;
        });
    });
});
