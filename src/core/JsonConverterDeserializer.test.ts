import * as chai from 'chai';
import * as sinon from 'sinon';
import {JsonCustomConverter} from '../converter/JsonCustomConverter';
import {jsonObject} from '../decorators/jsonObject';
import {jsonProperty} from '../decorators/jsonProperty';
import {JsonConverterError} from '../JsonConverterError';
import {JsonConverterUtil} from '../JsonConverterUtil';
import {PidConverter} from '../samples/converter/PidConverter';
import {Color} from '../samples/models/Color';
import {Pid} from '../samples/models/Pid';
import {Any} from '../type/Any';
import {Enum} from '../type/Enum';
import {JsonConverterDeserializer} from './JsonConverterDeserializer';

describe('JsonConverterDeserializer', () => {

    const converter = new JsonConverterDeserializer();
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    /**
     * Deserialize
     */
    describe('deserialize', () => {

        it('should throw error E40 when something wrong happened', () => {

            const processDeserialize = sandbox.stub(converter, 'processDeserialize').withArgs('Steve', Number)
                .throws(new JsonConverterError(''));

            chai.expect(() => converter.deserialize('Steve', Number))
                .to.throw(JsonConverterError, 'E40');
            chai.expect(processDeserialize.calledOnce).to.be.true;
        });

        it('should deserialize', () => {

            const processDeserialize = sandbox.stub(converter, 'processDeserialize').withArgs('Steve', String)
                .returns('Steve');

            const result = converter.deserialize('Steve', String);
            chai.expect(result).equal('Steve');
            chai.expect(processDeserialize.calledOnce).to.be.true;
        });
    });

    /**
     * Process deserialize
     */
    describe('processDeserialize', () => {

        it('should return null', () => {
            const result = converter.processDeserialize(null, String);
            chai.expect(result).to.be.null;
        });

        it('should return undefined', () => {
            const result = converter.processDeserialize(undefined, String);
            chai.expect(result).to.be.undefined;
        });

        it('should return number', () => {
            const result = converter.processDeserialize(-1, Number);
            chai.expect(result).to.equal(-1);
        });

        it('should return string', () => {
            const result = converter.processDeserialize('test', String);
            chai.expect(result).to.equal('test');
        });

        it('should return boolean', () => {
            const result = converter.processDeserialize(true, Boolean);
            chai.expect(result).to.equal(true);
        });

        it('should check consistency', () => {

            const obj = 'test';
            const checkConsistency = sandbox.stub(JsonConverterUtil, 'checkConsistency')
                .withArgs('test', Number, true)
                .throws(new JsonConverterError(''));

            chai.expect(() => converter.processDeserialize(obj, Number)).throw(JsonConverterError);
            chai.expect(checkConsistency.calledOnce).to.be.true;
        });

        describe('when given type is a custom converter', () => {

            const json = 12;

            it('should deserialize', () => {
                const result = converter.processDeserialize(json, PidConverter);
                chai.expect((result as Pid).id).equal(12);
            });

            it('should throw error E01 when custom converter is not instantiated', () => {

                class SomeConverter extends JsonCustomConverter<Pid> {
                    public deserialize(obj: any): Pid {
                        return undefined;
                    }

                    public serialize(obj: Pid): any {
                    }
                }

                chai.expect(() => converter.processDeserialize(json, SomeConverter))
                    .to.throw(JsonConverterError, 'E01');
            });
        });

        describe('when obj is an array', () => {

            it('should throw error E02 when type is an empty array', () => {
                const json = ['a', 'b', 'c'];
                chai.expect(() => converter.processDeserialize(json, []))
                    .to.throw(JsonConverterError, 'E02');
            });
        });

        describe('when given type is Any', () => {

            it('should return object', () => {

                const informations = {
                    age: 21,
                    languages: ['french', 'english', 'german'],
                };

                const json = converter.processDeserialize(informations, Any);
                chai.expect(json).deep.equal(informations);
            });
        });

        describe('when parsing is enabled', () => {

            it('should parse boolean', () => {
                const result = converter.processDeserialize('true', Boolean, {tryParse: true});
                chai.expect(result).to.equal(true);
            });

            it('should parse number', () => {
                const result = converter.processDeserialize('-10.20', Number, {tryParse: true});
                chai.expect(result).to.equal(-10.20);
            });
        });
    });

    /**
     * Deserialize array
     */
    describe('processDeserializeArray', () => {

        it('should serialize', () => {
            const json = ['abc'];
            const serialize = sandbox.stub(converter, 'processDeserialize').withArgs('abc', String)
                .returns('abd');

            const result = converter.processDeserializeArray(json, String);
            chai.expect(result).deep.equal(['abd']);
            chai.expect(serialize.calledOnce).to.be.true;
        });

        it('should throw error E30 when an exception occured', () => {
            const json = ['abc'];
            const serialize = sandbox.stub(converter, 'processDeserialize').withArgs('abc', String)
                .throws(new JsonConverterError(''));

            chai.expect(() => converter.processDeserializeArray(json, String)).throw(JsonConverterError, 'E30');
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });

    /**
     * Deserialize enum
     */
    describe('processDeserializeEnum', () => {

        it('should return enum value (case index)', () => {
            const result = converter.processDeserializeEnum(2, Enum(Color));
            chai.expect(result).equal(Color.BLUE);
        });

        it('should return enum value (cas name)', () => {
            const result = converter.processDeserializeEnum('RED', Enum(Color));
            chai.expect(result).equal(Color.RED);
        });

        it('should throw error E31 when enum value cannot be found (1)', () => {
            chai.expect(() => converter.processDeserializeEnum(20, Enum(Color)))
                .throw(JsonConverterError, 'E31');
        });

        it('should throw error E31 when enum value cannot be found (2)', () => {
            chai.expect(() => converter.processDeserializeEnum('ORANGE', Enum(Color)))
                .throw(JsonConverterError, 'E31');
        });
    });

    /**
     * Deserialize object
     */
    describe('processDeserializeObject', () => {

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
});
