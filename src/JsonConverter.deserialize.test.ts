import {JsonConverter} from "./JsonConverter";
import * as chai from 'chai';
import {Enum, EnumStrategy} from "./type/Enum";
import {Color} from "./samples/models/Color";
import {Any} from "./type/Any";
import {Car} from "./samples/models/Car";
import {Vehicle} from "./samples/models/Vehicle";

const converter = new JsonConverter();

describe('JsonConverter.deserialize', () => {

    it('should return null', () => {
        const result = converter.deserialize(null, String);
        chai.expect(result).to.be.null;
    });

    it('should return undefined', () => {
        const result = converter.deserialize(undefined, String);
        chai.expect(result).to.be.undefined;
    });

    it('should return number', () => {
        const result = converter.deserialize(-1, Number);
        chai.expect(result).to.equal(-1);
    });

    it('should return string', () => {
        const result = converter.deserialize('test', String);
        chai.expect(result).to.equal('test');
    });

    it('should return boolean', () => {
        const result = converter.deserialize(true, Boolean);
        chai.expect(result).to.equal(true);
    });

    /**
     * With an enum property
     */
    describe('with Enum property', () => {

        it('should return enum', () => {
            const result = converter.deserialize('BLUE', Enum(Color, EnumStrategy.NAME));
            chai.expect(result).equal(Color.BLUE);
        });

        it('should return enum (2)', () => {
            const result = converter.deserialize(Color.BLUE.valueOf(), Enum(Color, EnumStrategy.NAME));
            chai.expect(result).equal(Color.BLUE);
        });

        it('should return enum (3)', () => {
            const result = converter.deserialize(Color.BLUE.valueOf(), Enum(Color, EnumStrategy.INDEX));
            chai.expect(result).equal(Color.BLUE);
        });

        it('should return enum (4)', () => {
            const result = converter.deserialize('BLUE', Enum(Color, EnumStrategy.INDEX));
            chai.expect(result).equal(Color.BLUE);
        });
    });

    it('should return object', () => {

        const informations = {
            age: 21,
            languages: ['french', 'english', 'german']
        };

        const json = converter.deserialize(informations, Any);
        chai.expect(json).deep.equal(informations);
    });

    describe('samples', () => {

        it('should return car json', () => {

            const json = {
                id: 12,
                color: 'BLUE',
                name: 'A5',
                passengers: [{
                    pid: 12,
                    gender: 'MALE',
                    name: 'steve',
                    informations: {
                        age: 21
                    }
                }],
                brand: 'Audi',
                type: 'car'
            };

            const car = converter.deserialize(json, Vehicle);

            chai.expect(car).instanceOf(Car);
        });
    });
});