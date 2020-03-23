import {expect} from 'chai';
import {AnyConverter} from './AnyConverter';

describe('AnyConverter', () => {

    let anyConverter: AnyConverter;

    beforeEach(() => {
        anyConverter = new AnyConverter();
    });

    describe('deserialize', () => {

        it('should return a copy', () => {
            const json = {a: 'b'};
            const obj = anyConverter.deserialize(json, {});
            expect(obj).to.deep.equal(json);
        });
    });

    describe('serialize', () => {

        it('should return a copy', () => {
            const obj = {a: 'b'};
            const json = anyConverter.serialize(obj, {});
            expect(json).to.deep.equal(obj);
        });
    });
});
