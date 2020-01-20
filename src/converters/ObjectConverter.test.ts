import * as chai from 'chai';
import {expect} from 'chai';
import {createStubInstance, stub} from 'sinon';
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
        stub(converter, 'options').get(() => {
            return {keepObjectFieldValues: false};
        });
        objectConverter = new ObjectConverter(converter);
    });

    @jsonObject()
    class Actor {

        public static init(name?: string) {
            const a = new Actor();
            a._name = name;
            return a;
        }

        @jsonProperty('name', String)
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

    describe('deserialize', () => {

        it('when type mapping is missing should throw an error', () => {

            expect(() => objectConverter.deserialize(movie, {type: Movie}))
                .throw(JsonConverterError, 'Cannot get mapping <Movie>');
        });

        it('when deserialization of one field fail should throw an error', () => {
            const deserialize = converter.processDeserialize
                .withArgs('Steve', {converter: StringConverter})
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.deserialize(actorJson, {type: Actor}))
                .throw(JsonConverterError, 'Fail to deserialize property <name>');
            expect(deserialize.calledOnce).to.be.true;
        });

        it('should deserialize', () => {
            converter.processDeserialize
                .withArgs('Steve', {converter: StringConverter})
                .returns('Steve1');

            const result = objectConverter.deserialize<Actor>(actorJson, {type: Actor});
            expect(result).instanceOf(Actor);
            expect(result._name).equal('Steve1');
        });

        it('should set name to undefined (keepObjectFieldValues = false)', () => {
            const actorJson2 = {};
            converter.processDeserialize
                .withArgs(undefined, {converter: StringConverter})
                .returns(undefined);

            const result = objectConverter.deserialize<Actor>(actorJson2, {type: Actor});
            expect(result).instanceOf(Actor);
            expect(result._name).to.be.undefined;
        });

        it('should keep name TOTO (keepObjectFieldValues = true)', () => {
            const actorJson2 = {};
            stub(converter, 'options').get(() => {
                return {keepObjectFieldValues: true};
            });

            const result = objectConverter.deserialize<Actor>(actorJson2, {type: Actor});
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

            const serialize = converter.processSerialize
                .withArgs('Steve', {converter: StringConverter})
                .throws(new JsonConverterError(''));

            expect(() => objectConverter.serialize(actor, {}, {unsafe: false}))
                .throw(JsonConverterError, 'Fail to serialize property <name>');
            expect(serialize.calledOnce).to.be.true;
        });

        it('should return serialized object', () => {

            const serialize = converter.processSerialize
                .withArgs('Steve', {converter: StringConverter})
                .returns('Steve');

            const expectedJson = {
                name: 'Steve',
            };

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return null properties', () => {

            const serialize = converter.processSerialize
                .withArgs('Steve', {converter: StringConverter})
                .returns(null);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should not return undefined properties', () => {

            const serialize = converter.processSerialize
                .withArgs('Steve', {converter: StringConverter})
                .returns(undefined);

            const expectedJson = {};

            const result = objectConverter.serialize(actor, {}, {unsafe: false});
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should serialize each field when unsafe is true', () => {

            const serializeOptions = {unsafe: true};
            const serialize = converter.processSerialize
                .withArgs(actor, undefined, serializeOptions)
                .returns({name: 'Steve'});

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
