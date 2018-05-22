import {jsonObject} from "./jsonObject";
import * as chai from "chai";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";

describe('jsonObject', () => {

    @jsonObject({discriminatorProperty: 'type'})
    class Location {
    }

    @jsonObject({discriminatorValue: 'city'})
    class City extends Location {
    }

    it('should create mapping for type', () => {
        const foundMapping = JsonConverterMapper.MAPPING.find(m => m.type === City);
        chai.expect(foundMapping).not.undefined;
    });

    it('should set options', () => {
        const foundMapping = JsonConverterMapper.MAPPING.find(m => m.type === City);
        chai.expect(foundMapping.options.discriminatorValue).equal('city');
    });

    it('should set parent', () => {
        const parentMapping = JsonConverterMapper.MAPPING.find(m => m.type === Location);
        const foundMapping = JsonConverterMapper.MAPPING.find(m => m.type === City);
        chai.expect(parentMapping).not.undefined;
        chai.expect(foundMapping.parent).equal(parentMapping);
    });

});