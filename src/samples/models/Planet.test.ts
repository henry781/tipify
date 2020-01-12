import {expect} from 'chai';
import {JsonConverter} from '../../core/JsonConverter';
import {Planet} from './Planet';

describe('Planet', () => {

    const converter = new JsonConverter();

    describe('deserialize', () => {

        it('should return planet object', () => {

            const json = {
                seas: {
                    atlantic: 1,
                    pacific: 2,
                },
                seasCoordinates: {
                    atlantic: [12, 11],
                    pacific: [21, 22],
                },
            };

            const planet = converter.deserialize<Planet>(json, Planet);

            expect(planet).instanceOf(Planet);

            expect(Object.keys(planet.seas).length).equal(2);
            expect(planet.seas.atlantic).equal(1);
            expect(planet.seas.pacific).equal(2);

            expect(Object.keys(planet.seasCoordinates).length).equal(2);
            expect(planet.seasCoordinates.atlantic.length).equal(2);
            expect(planet.seasCoordinates.pacific.length).equal(2);
        });

    });

});
