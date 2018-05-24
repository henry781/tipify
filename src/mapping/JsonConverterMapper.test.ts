import {Car} from "../samples/models/Car";
import {JsonConverterMapper} from "./JsonConverterMapper";
import {Vehicle} from "../samples/models/Vehicle";
import * as chai from 'chai';

describe('JsonConverterMapper', () => {

    class Asteroid {
    }

    class AsteroidA extends Asteroid {
    }

    class AsteroidB extends Asteroid {
    }

    class AsteroidA1 extends AsteroidA {
    }

    class Meteorite {
    }

    /**
     * Create mapping
     */
    describe('createMappingForType', () => {

        it('should create mapping', () => {
            JsonConverterMapper.createMappingForType(Asteroid);
            const mapping = JsonConverterMapper.MAPPING.find(m => m.type === Asteroid);

            chai.expect(mapping.type).equal(Asteroid);
        });

        it('should return mapping', () => {
            const mapping = JsonConverterMapper.createMappingForType(Asteroid);

            chai.expect(mapping.type).equal(Asteroid);
        });
    });

    /**
     * Get mapping
     */
    describe('getMappingForType', () => {

        it('should return mapping', () => {
            const mapping = JsonConverterMapper.getMappingForType(Asteroid);
            chai.expect(mapping).equal(mapping);
        });
    });

    /**
     * List mapping for classes extending class
     */
    describe('listMappingForExtendingType', () => {

        it('should return AsteroidA, AsteroidB, AsteroidA1', () => {

            JsonConverterMapper.createMappingForType(AsteroidA);
            JsonConverterMapper.createMappingForType(AsteroidB);
            JsonConverterMapper.createMappingForType(AsteroidA1);
            JsonConverterMapper.createMappingForType(Meteorite);

            const mappings = JsonConverterMapper.listMappingForExtendingType(Asteroid);

            // expected mappings
            const mapping1 = JsonConverterMapper.getMappingForType(AsteroidA);
            const mapping2 = JsonConverterMapper.getMappingForType(AsteroidB);
            const mapping3 = JsonConverterMapper.getMappingForType(AsteroidA1);


            chai.expect(mappings).length(3);
            chai.expect(mappings).contains(mapping1);
            chai.expect(mappings).contains(mapping2);
            chai.expect(mappings).contains(mapping3);
        });
    });

    /**
     * Get all properties for type
     */
    describe('getAllPropertiesForType', () => {

        const vehicleMapping = JsonConverterMapper.getMappingForType(Vehicle);
        const carMapping = JsonConverterMapper.getMappingForType(Car);

        it('should return properties', () => {
            const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(vehicleMapping);
            chai.expect(properties).length(5);
        });

        it('should return properties + inherited properties', () => {
            const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(carMapping);
            chai.expect(properties).length(6);
        });
    });
});