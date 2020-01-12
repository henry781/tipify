import {expect} from 'chai';
import {createStubInstance} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {AnyConverter} from './AnyConverter';

describe('AnyConverter', () => {

    let converter;
    let anyConverter: AnyConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        anyConverter = new AnyConverter(converter);
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
