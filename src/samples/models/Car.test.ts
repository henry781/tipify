import * as chai from 'chai';
import {JsonConverter} from '../../JsonConverter';
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

            chai.expect(actualJson).deep.equal(expectedJson);
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

            chai.expect(vehicle).instanceOf(Car);

            const car = vehicle as Car;
            chai.expect(car._id).equal(12);
            chai.expect(car._color).equal(Color.BLUE);
            chai.expect(car._name).equal('A5');
            chai.expect(car._type).equal('car');
            chai.expect(car._brand).equal('Audi');
            chai.expect(car._passengers).length(1);
            chai.expect(car._passengers[0]._name).equal('steve');
            chai.expect(car._passengers[0]._gender).equal(Gender.MALE);
            chai.expect(car._passengers[0]._pid.id).equal(12);
            chai.expect((car._passengers[0]._informations as any).age).equal(21);
        });

    });
});
