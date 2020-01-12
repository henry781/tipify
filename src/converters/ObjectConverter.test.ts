import * as chai from 'chai';
import {expect} from 'chai';
import {createStubInstance} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {jsonObject} from '../decorators/jsonObject';
import {jsonProperty} from '../decorators/jsonProperty';
import {ObjectConverter} from './ObjectConverter';
import {StringConverter} from './StringConverter';

describe('ObjectConverter', () => {

    let converter;
    let objectConverter: ObjectConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        objectConverter = new ObjectConverter(converter);
    });

    @jsonObject()
    class Actor {
        @jsonProperty('name', String)
        public _name: string;

        constructor(name: string) {
            this._name = name;
        }
    }

    class Movie {
    }

    const actor = new Actor('Steve');
    const actorJson = {
        name: 'Steve',
    };
    const movie = new Movie();

    describe('deserialize', () => {

        it('when type mapping is missing should throw an error', () => {

            expect(() => objectConverter.deserialize(movie, {type: Movie}))
                .throw(JsonConverterError, 'Cannot get mapping <Movie>');
        });

        it('when deserialization of one field fail should throw an error', () => {
            const deserialize = converter.deserialize
                .withArgs('Steve', {converter: StringConverter})
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.deserialize(actorJson, {type: Actor}))
                .throw(JsonConverterError, 'Fail to deserialize property <name>');
            expect(deserialize.calledOnce).to.be.true;
        });

        it('should deserialize', () => {
            converter.deserialize
                .withArgs('Steve', {converter: StringConverter})
                .returns('Steve1');

            const result = objectConverter.deserialize<Actor>(actorJson, {type: Actor});
            expect(result).instanceOf(Actor);
            expect(result._name).equal('Steve1');
        });
    });

    describe('serialize', () => {

        it('when type mapping is missing should throw an error', () => {

            expect(() => objectConverter.serialize(movie, {}))
                .throw(JsonConverterError, 'Cannot get mapping <Movie>');
        });

        it('when serializing property fail should throw an error', () => {

            const serialize = converter.serialize
                .withArgs('Steve', {converter: StringConverter})
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.serialize(actor, {}))
                .throw(JsonConverterError, 'Fail to serialize property <name>');
            expect(serialize.calledOnce).to.be.true;
        });

        it('should return serialized object', () => {

            const serialize = converter.serialize
                .withArgs('Steve', {converter: StringConverter})
                .returns('Steve');

            const expectedJson = {
                name: 'Steve',
            };

            const result = objectConverter.serialize(actor, {});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return null properties', () => {

            const serialize = converter.serialize
                .withArgs('Steve', {converter: StringConverter})
                .returns(null);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return undefined properties', () => {

            const serialize = converter.serialize
                .withArgs('Steve', {converter: StringConverter})
                .returns(undefined);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });
});
