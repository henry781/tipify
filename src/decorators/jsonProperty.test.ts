import {jsonProperty} from "./jsonProperty";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";
import * as chai from "chai";

describe('jsonProperty', () => {

    class Person {
        @jsonProperty('name', String)
        private _name: string;
    }

    it('should create type mapping', () => {
        const foundTypeMapping = JsonConverterMapper.MAPPING.find(m => m.type === Person);
        chai.expect(foundTypeMapping).not.undefined;
    });

    it('should add property mapping', () => {
        const foundTypeMapping = JsonConverterMapper.MAPPING.find(m => m.type === Person);

        const foundPropertyMapping = foundTypeMapping.properties.find(m => m.name === '_name');
        chai.expect(foundPropertyMapping).not.undefined;
        chai.expect(foundPropertyMapping.serializedName).equal('name');
        chai.expect(foundPropertyMapping.type).equal(String);

    });
});