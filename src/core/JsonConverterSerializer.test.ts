import {Color} from "../samples/models/Color";
import * as chai from 'chai';
import {Enum, EnumStrategy} from "../type/Enum";
import {Any} from "../type/Any";
import {Pid} from "../samples/models/Pid";
import {PidConverter} from "../samples/converter/PidConverter";
import {jsonObject} from "../decorators/jsonObject";
import {jsonProperty} from "../decorators/jsonProperty";
import * as sinon from 'sinon';
import {JsonConverterSerializer} from "./JsonConverterSerializer";

describe('JsonConverteSerialize', () => {

    const converter = new JsonConverterSerializer();
    const sandbox = sinon.createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    /**
     * Serialize
     */
    describe('serialize', () => {

        // it('should throw error E00 when something wrong happened', () => {
        //
        //     const processSerialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', Number)
        //         .throws(new JsonConverterError(''));
        //
        //     chai.expect(() => converter.serialize('Steve', <any>Number))
        //         .to.throw(JsonConverterError, 'E00');
        //     chai.expect(processSerialize.calledOnce).to.be.true;
        // });

        it('should serialize', () => {

            const processSerialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .returns('Steve');

            const result = converter.serialize('Steve', String);
            chai.expect(result).equal('Steve');
            chai.expect(processSerialize.calledOnce).to.be.true;
        });
    });

    /**
     * Process serialize
     */
    describe('processSerialize', () => {

        it('should return null', () => {
            const result = converter.processSerialize(null);
            chai.expect(result).to.be.null;
        });

        it('should return undefined', () => {
            const result = converter.processSerialize(undefined);
            chai.expect(result).to.be.undefined;
        });

        it('should return number', () => {
            const result = converter.processSerialize(-1);
            chai.expect(result).to.equal(-1);
        });

        it('should return string', () => {
            const result = converter.processSerialize('test');
            chai.expect(result).to.equal('test');
        });

        it('should return boolean', () => {
            const result = converter.processSerialize(true);
            chai.expect(result).to.equal(true);
        });

        // it('should check consistency', () => {
        //
        //     const obj = 'test';
        //     const checkConsistency = sandbox.stub(JsonConverterUtil, 'checkConsistency').withArgs('test', Number)
        //         .throws(new JsonConverterError(''));
        //
        //     chai.expect(() => converter.processSerialize(obj, Number)).throw(JsonConverterError);
        //     chai.expect(checkConsistency.calledOnce).to.be.true;
        // });

        describe('when given type is a custom converter', () => {

            const pid: Pid = {
                id: 12
            };

            it('should serialize', () => {
                const result = converter.processSerialize(pid, PidConverter);
                chai.expect(result).equal(12);
            });

            // it('should throw error E01 when custom converter is not instantiated', () => {
            //
            //     class SomeConverter extends JsonCustomConverter<Pid> {
            //         public deserialize(obj: any): Pid {
            //             return undefined;
            //         }
            //
            //         public serialize(obj: Pid): any {
            //         }
            //     }
            //
            //     chai.expect(() => converter.processSerialize(pid, SomeConverter))
            //         .to.throw(JsonConverterError, 'E01');
            // });
        });

        describe('when obj is an array', () => {

            // it('should throw error E02 when type is an empty array', () => {
            //     const json = ['a', 'b', 'c'];
            //     chai.expect(() => converter.processSerialize(json, []))
            //         .to.throw(JsonConverterError, 'E02');
            // });
        });

        describe('when given type is Any', () => {

            it('should return object as is', () => {

                const informations = {
                    age: 21,
                    languages: ['french', 'english', 'german']
                };

                const json = converter.processSerialize(informations, Any);
                chai.expect(json).deep.equal(informations);
            });
        });
    });

    /**
     * Serialize an enum
     */
    describe('processSerializeEnum', () => {

        it('should return enum as name', () => {
            const result = (<any>converter).processSerializeEnum(Color.BLUE, Enum(Color, EnumStrategy.NAME));
            chai.expect(result).equal('BLUE');
        });

        it('should return enum as index', () => {
            const result = (<any>converter).processSerializeEnum(Color.BLUE, Enum(Color, EnumStrategy.INDEX));
            chai.expect(result).equal(2);
        });

        // it('should throw error E12 when strategy is not defined', () => {
        //     const options = new EnumOptions(Color);
        //     options.strategy = undefined;
        //     chai.expect(() => (<any>converter).processSerializeEnum(Color.BLUE, options))
        //         .throw(JsonConverterError, 'E12');
        // });
        //
        // it('should throw error E10 when enum value does not exist (1)', () => {
        //     chai.expect(() => (<any>converter).processSerializeEnum(14, Enum(Color, EnumStrategy.INDEX)))
        //         .throw(JsonConverterError, 'E10');
        // });
    });

    /**
     * Serialize an object
     */
    describe('processSerializeObject', () => {

        @jsonObject()
        class Actor {
            @jsonProperty('name', String)
            public _name: string;

            constructor(name: string) {
                this._name = name;
            }
        }

        const actor = new Actor('Steve');

        // it('should throw error E09 when type mapping is missing', () => {
        //
        //     class Movie {
        //     }
        //
        //     const movie = new Movie();
        //     chai.expect(() => converter.processSerializeObject(movie)).throw(JsonConverterError, 'E09');
        // });

        // it('should throw error E08 when serializing property fail', () => {
        //
        //     const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
        //         .throws(new JsonConverterError(''));
        //
        //     chai.expect(() => converter.processSerializeObject(actor)).throw(JsonConverterError, 'E08');
        //     chai.expect(serialize.calledOnce).to.be.true;
        // });

        it('should return serialized object', () => {

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('Steve', String)
                .returns('Steve');

            const expectedJson = {
                name: 'Steve'
            };

            const result = converter.processSerializeObject(actor);
            chai.expect(result).deep.equal(expectedJson);
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });

    /**
     * Serialize an array
     */
    describe('processSerializeArray', () => {

        // it('should throw error E20 when serializing an item fail', () => {
        //
        //     const arr = ['abc'];
        //
        //     const serialize = sandbox.stub(converter, 'processSerialize').withArgs('abc', String)
        //         .throws(new JsonConverterError(''));
        //
        //     chai.expect(() => converter.processSerializeArray(arr, String)).throw(JsonConverterError, 'E20');
        //     chai.expect(serialize.calledOnce).to.be.true;
        // });

        it('should return serialized array', () => {

            const arr = ['abc'];

            const serialize = sandbox.stub(converter, 'processSerialize').withArgs('abc', String)
                .returns('abc');

            const result = converter.processSerializeArray(arr, String);
            chai.expect(result).deep.equal(arr);
            chai.expect(serialize.calledOnce).to.be.true;
        });
    });
});