import * as chai from "chai";
import {JsonConverter} from "../../JsonConverter";
import {Jet} from "./Jet";
import {Plane} from "./Plane";

describe('Plane', () => {

    const converter = new JsonConverter();

    describe('serialize', () => {

    });

    describe('deserialize', () => {

        it('should return an instance of jet', () => {

            const json = {
                id: 12,
                color: 'BLUE',
                name: 'dassault',
                type: 'jet'
            };

            const plane = converter.deserialize<Plane>(json, Plane);

            chai.expect(plane).instanceOf(Jet);
        });

    });
});