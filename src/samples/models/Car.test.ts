import {Gender} from "./Gender";
import {Color} from "./Color";
import {Passenger} from "./Passenger";
import {Car} from "./Car";
import * as chai from "chai";
import {JsonConverter} from "../../JsonConverter";

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
});