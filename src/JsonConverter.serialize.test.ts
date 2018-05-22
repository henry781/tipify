import {JsonConverter} from "./JsonConverter";
import {Car} from "./samples/models/Car";
import {Color} from "./samples/models/Color";
import * as chai from 'chai';
import {Passenger} from "./samples/models/Passenger";
import {Enum, EnumStrategy} from "./type/Enum";
import {Any} from "./type/Any";
import {Gender} from "./samples/models/Gender";

const converter = new JsonConverter();

describe('JsonConverter.serialize', () => {

    it('should return null', () => {
        const result = converter.serialize(null);
        chai.expect(result).to.be.null;
    });

    it('should return undefined', () => {
        const result = converter.serialize(undefined);
        chai.expect(result).to.be.undefined;
    });

    it('should return number', () => {
        const result = converter.serialize(-1);
        chai.expect(result).to.equal(-1);
    });

    it('should return string', () => {
        const result = converter.serialize('test');
        chai.expect(result).to.equal('test');
    });

    it('should return boolean', () => {
        const result = converter.serialize(true);
        chai.expect(result).to.equal(true);
    });

    /**
     * With an enum property
     */
    describe('with Enum property', () => {

        it('should return enum as name', () => {
            const result = converter.serialize(Color.BLUE, Enum(Color, EnumStrategy.NAME));
            chai.expect(result).equal('BLUE');
        });

        it('should return enum as name (2)', () => {
            const result = converter.serialize(Color.BLUE, Enum(Color, EnumStrategy.NAME_COMPATIBLE));
            chai.expect(result).equal('BLUE');
        });

        it('should return enum as index', () => {
            const result = converter.serialize(Color.BLUE, Enum(Color, EnumStrategy.INDEX));
            chai.expect(result).equal(2);
        });

        it('should return enum as index (2)', () => {
            const result = converter.serialize(Color.BLUE, Enum(Color, EnumStrategy.INDEX_COMPATIBLE));
            chai.expect(result).equal(2);
        });
    });

    it('should return object', () => {

        const informations = {
            age: 21,
            languages: ['french', 'english', 'german']
        };

        const json = converter.serialize(informations, Any);
        chai.expect(json).deep.equal(informations);
    });

    describe('samples', () => {

        it('should return car json', () => {

            const passenger1 = new Passenger({
                pid: {
                    id: 12
                },
                gender: Gender.MALE,
                name: 'steve',
                informations: {
                    age: 21
                }
            });

            const car = new Car({
                id: 12,
                color: Color.BLUE,
                name: 'A5',
                passengers: [passenger1],
                brand: 'Audi'
            });
            const actualJson = converter.serialize(car);

            const expectedJson = {
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

            chai.expect(actualJson).deep.equal(expectedJson);
        });
    });
});