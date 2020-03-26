import {expect} from 'chai';
import {JsonConverter} from '../../core/JsonConverter';
import {Car} from './Car';
import {Color} from './Color';
import {Gender} from './Gender';
import {Passenger} from './Passenger';
import {Vehicle} from './Vehicle';

describe('Car', () => {

    const converter = new JsonConverter();

    describe('serialize', () => {

        it('should return car json', () => {

            const passenger1 = new Passenger({
                gender: Gender.MALE,
                informations: {
                    age: 21,
                },

                name: 'steve',
                pid: {
                    id: 12,
                },
            });

            const car = new Car({
                brand: 'Audi',
                color: Color.BLUE,
                id: 12,
                name: 'A5',
                passengers: [passenger1],
            });

            const actualJson = converter.serialize(car);

            const expectedJson = {
                brand: 'Audi',
                color: 'BLUE',
                id: 12,
                name: 'A5',
                passengers: [{
                    gender: 'MALE',
                    informations: {
                        age: 21,
                    },
                    name: 'steve',
                    pid: 12,
                }],
                type: 'car',
            };

            expect(actualJson).deep.equal(expectedJson);
        });

        it('should serialize even when mapping cannot be found (unsafe)', () => {
            const car = new Car({brand: 'audi', name: 'a1'});
            const obj = [{a1: [car]}];

            const result = converter.serialize(obj, undefined, {unsafe: true});
            expect(result).deep.equal([{a1: [{brand: 'audi', type: 'car', name: 'a1'}]}]);
        });
    });

    describe('deserialize', () => {

        it('should return car object', () => {

            const json = {
                brand: 'Audi',
                color: 'BLUE',
                id: 12,
                name: 'A5',
                passengers: [{
                    gender: 'MALE',
                    informations: {
                        age: 21,
                    },
                    name: 'steve',
                    pid: 12,
                }],
                type: 'car',
            };

            const vehicle = converter.deserialize<Vehicle>(json, Vehicle);

            expect(vehicle).instanceOf(Car);

            const car = vehicle as Car;
            expect(car._id).equal(12);
            expect(car._color).equal(Color.BLUE);
            expect(car._name).equal('A5');
            expect(car._type).equal('car');
            expect(car._brand).equal('Audi');
            expect(car._passengers).length(1);
            expect(car._passengers[0]._name).equal('steve');
            expect(car._passengers[0]._gender).equal(Gender.MALE);
            expect(car._passengers[0]._pid.id).equal(12);
            expect((car._passengers[0]._informations as any).age).equal(21);
        });
    });
});
