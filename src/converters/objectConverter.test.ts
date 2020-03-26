import * as chai from 'chai';
import {expect} from 'chai';
import {createSandbox} from 'sinon';
import {DeserializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {jsonObject} from '../decorators/jsonObject';
import {jsonProperty} from '../decorators/jsonProperty';
import {objectConverter} from './objectConverter';
import {stringConverter} from './stringConverter';

describe('ObjectConverter', () => {

    @jsonObject()
    class Actor {

        public static init(name?: string) {
            const a = new Actor();
            a._name = name;
            return a;
        }

        @jsonProperty('name')
        public _name: string = 'TOTO';

        constructor() {
        }
    }

    class Movie {
    }

    const actor = Actor.init('Steve');
    const actorJson = {
        name: 'Steve',
    };
    const movie = new Movie();

    const sandbox = createSandbox();
    const deserializationOptions: DeserializeOptions = {
        keepObjectFieldValues: true,
        tryParse: false,
    };

    afterEach(() => {
        sandbox.restore();
    });

    describe('deserialize', () => {

        it('when type mapping is missing should throw an error', () => {
            expect(() => objectConverter.deserialize(movie, {type: Movie}, deserializationOptions))
                .throw(JsonConverterError, 'Cannot get mapping <Movie>');
        });

        it('when deserialization of one field fail should throw an error', () => {
            const deserialize = sandbox.stub(stringConverter, 'deserialize')
                .withArgs('Steve', undefined, deserializationOptions)
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.deserialize(actorJson, {type: Actor}, deserializationOptions))
                .throw(JsonConverterError, 'Fail to deserialize property <name>');
            expect(deserialize.calledOnce).to.be.true;
        });

        it('should deserialize', () => {
            sandbox.stub(stringConverter, 'deserialize')
                .withArgs('Steve', undefined, deserializationOptions)
                .returns('Steve1');

            const result = objectConverter.deserialize(actorJson, {type: Actor}, deserializationOptions);
            expect(result).instanceOf(Actor);
            expect(result._name).equal('Steve1');
        });

        it('should set name to undefined (keepObjectFieldValues = false)', () => {

            const options: DeserializeOptions = {
                keepObjectFieldValues: false,
            };

            const actorJson2 = {};
            sandbox.stub(stringConverter, 'deserialize')
                .withArgs(undefined, undefined, options)
                .returns(undefined);

            const result = objectConverter.deserialize(actorJson2, {type: Actor}, options);
            expect(result).instanceOf(Actor);
            expect(result._name).to.be.undefined;
        });

        it('should keep name TOTO (keepObjectFieldValues = true)', () => {
            const actorJson2 = {};
            const options: DeserializeOptions = {
                keepObjectFieldValues: true,
            };

            const result = objectConverter.deserialize(actorJson2, {type: Actor}, options);
            expect(result).instanceOf(Actor);
            expect(result._name).equal('TOTO');
        });
    });

    describe('serialize', () => {

        it('when type mapping is missing should throw an error', () => {

            expect(() => objectConverter.serialize(movie, {}, {unsafe: false}))
                .throw(JsonConverterError, 'Cannot get mapping <Movie>');
        });

        it('when serializing property fail should throw an error', () => {

            const serialize = sandbox.stub(stringConverter, 'serialize')
                .withArgs('Steve')
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.serialize(actor, {}, {unsafe: false}))
                .throw(JsonConverterError, 'Fail to serialize property <name>');
            expect(serialize.calledOnce).to.be.true;
        });

        it('should return serialized object', () => {

            const serialize = sandbox.stub(stringConverter, 'serialize')
                .withArgs('Steve')
                .returns('Steve');

            const expectedJson = {
                name: 'Steve',
            };

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return null properties', () => {

            const serialize = sandbox.stub(stringConverter, 'serialize')
                .withArgs('Steve')
                .returns(null);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return undefined properties', () => {

            const serialize = sandbox.stub(stringConverter, 'serialize')
                .withArgs('Steve')
                .returns(undefined);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should serialize each field when unsafe is true', () => {

            const serializeOptions = {unsafe: true};
            const serialize = sandbox.stub(stringConverter, 'serialize')
                .withArgs('Steve', undefined, serializeOptions)
                .returns('Steve');

            const obj = {actor};

            const expectedJson = {
                actor: {name: 'Steve'},
            };

            const result = objectConverter.serialize(obj, {}, serializeOptions);

            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });
});
