import * as chai from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {jsonObject} from '../decorators/jsonObject';
import {jsonProperty} from '../decorators/jsonProperty';

describe('ObjectConverter', () => {

    describe('deserialize', () => {

        @jsonObject()
        class Actor {
            @jsonProperty('name', String)
            public _name: string;

            constructor(name: string) {
                this._name = name;
            }
        }

        const actorJson = {
            name: 'Steve',
        };

        it('should throw error E09 when type mapping is missing', () => {

            class Movie {
            }

            const movie = new Movie();
            chai.expect(() => converter.processDeserializeObject(movie, Movie)).throw(JsonConverterError, 'E09');
        });

        it('should throw error E32 when deserialization fail', () => {
            const deserialize = sandbox.stub(converter, 'processDeserialize').withArgs('Steve', String)
                .throws(new JsonConverterError(''));

            chai.expect(() => converter.processDeserializeObject(actorJson, Actor)).throw(JsonConverterError, 'E32');
            chai.expect(deserialize.calledOnce).to.be.true;
        });

        it('should deserialize', () => {
            sandbox.stub(converter, 'processDeserialize').withArgs('Steve', String)
                .returns('Steve1');

            const result = converter.processDeserializeObject<Actor>(actorJson, Actor);
            chai.expect(result).instanceOf(Actor);
            chai.expect(result._name).equal('Steve1');
        });
    });

    describe('serialize', () => {

        @jsonObject()
        class Actor {
            @jsonProperty('name', String)
            public _name: string;

            constructor(name: string) {
                this._name = name;
            }
        }

        const actor = new Actor('Steve');

        it('should throw error E09 when type mapping is missing', () => {

            class Movie {
            }

            const movie = new Movie();
            chai.expect(() => converter.processSerializeObject(movie)).throw(JsonConverterError, 'E09');
        });

        it('should throw error E08 when serializing property fail', () => {

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .throws(new JsonConverterError(''));

            chai.expect(() => converter.processSerializeObject(actor)).throw(JsonConverterError, 'E08');
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should return serialized object', () => {

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .returns('Steve');

            const expectedJson = {
                name: 'Steve',
            };

            const result = converter.processSerializeObject(actor);
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return null properties', () => {

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .returns(null);

            const expectedJson = {};

            const result = converter.processSerializeObject(actor);
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return undefined properties', () => {

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .returns(undefined);

            const expectedJson = {};

            const result = converter.processSerializeObject(actor);
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });
});
