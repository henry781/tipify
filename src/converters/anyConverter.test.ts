import {expect} from 'chai';
import {anyConverter} from './anyConverter';

describe('AnyConverter', () => {

    describe('deserialize', () => {

        it('should return a copy', () => {
            const json = {a: 'b'};
            const obj = anyConverter.deserialize(json);
            expect(obj).to.deep.equal(json);
        });
    });

    describe('serialize', () => {

        it('should return a copy', () => {
            const obj = {a: 'b'};
            const json = anyConverter.serialize(obj);
            expect(json).to.deep.equal(obj);
        });
    });
});
