import {Car} from "../samples/models/Car";
import {JsonConverterMapper} from "./JsonConverterMapper";
import {Vehicle} from "../samples/models/Vehicle";
import * as chai from 'chai';
import {Planet} from "../samples/models/Planet";

describe('JsonConverter', () => {

    describe('createMappingForType', () => {

        it('should return mapping', () => {
            const mapping1 = JsonConverterMapper.createMappingForType(Planet);
            const mapping2 = JsonConverterMapper.MAPPING.find(m => m.type === Planet);

            chai.expect(mapping1.type).equal(Planet);
            chai.expect(mapping2.type).equal(Planet);
        });
    });

    describe('getMappingForType', () => {

        it('should have parent', () => {
            const parentMapping = JsonConverterMapper.getMappingForType(Vehicle);
            const mapping = JsonConverterMapper.getMappingForType(Car);
            chai.expect(mapping.parent).equal(parentMapping);
        });

        it('should have options', () => {
            const mapping = JsonConverterMapper.getMappingForType(Vehicle);
            chai.expect(mapping.options.discriminatorProperty).equal('type');
        });

    });

    describe('getAllPropertiesForType', () => {

        const vehicleMapping = JsonConverterMapper.getMappingForType(Vehicle);
        const carMapping = JsonConverterMapper.getMappingForType(Car);

        it('should return all properties', () => {
            const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(vehicleMapping);
            chai.expect(properties).length(5);
        });

        it('should return all properties + inherited properties', () => {
            const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(carMapping);
            chai.expect(properties).length(6);
        });
    });
});