import {Gender} from "./Gender";
import {Color} from "./Color";
import {Passenger} from "./Passenger";
import {Car} from "./Car";
import * as chai from "chai";
import {JsonConverter} from "../../JsonConverter";
import {Vehicle} from "./Vehicle";

describe('Car', () => {

    const converter = new JsonConverter();

    describe('serialize', () => {

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

    describe('deserialize', () => {

        describe('validation', () => {

            //     it('should throw an error when name is not set', () => {
            //
            //         const json = {
            //             id: 12,
            //             color: 'BLUE',
            //             // name: 'A5',
            //             passengers: [{
            //                 pid: 12,
            //                 gender: 'MALE',
            //                 name: 'steve',
            //                 informations: {
            //                     age: 21
            //                 }
            //             }],
            //             brand: 'Audi',
            //             type: 'car'
            //         };
            //
            //         try {
            //             converter.deserialize(json, Vehicle);
            //             chai.expect.fail();
            //         } catch (err) {
            //             chai.expect(err).instanceOf(JsonConverterError);
            //             chai.expect(err.toString()).contains('E50');
            //         }
            //     });
        });

        it('should return car object', () => {

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

            const vehicle = converter.deserialize<Vehicle>(json, Vehicle);

            chai.expect(vehicle).instanceOf(Car);

            const car = <Car>vehicle;
            chai.expect(car._id).equal(12);
            chai.expect(car._color).equal(Color.BLUE);
            chai.expect(car._name).equal('A5');
            chai.expect(car._type).equal('car');
            chai.expect(car._brand).equal('Audi');
            chai.expect(car._passengers).length(1);
            chai.expect(car._passengers[0]._name).equal('steve');
            chai.expect(car._passengers[0]._gender).equal(Gender.MALE);
            chai.expect(car._passengers[0]._pid.id).equal(12);
            chai.expect((<any>car._passengers[0]._informations)['age']).equal(21);
        });

    });
});