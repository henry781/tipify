import 'reflect-metadata';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {PropertyMapping} from '../mapping/PropertyMapping';

export function jsonProperty(serializedName: string, type?: any) {

    return (cls: any, property: string) => {

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const propertyMapping: PropertyMapping = {
            name: property,
            serializedName,
            type,
        };

        typeMapping.properties.push(propertyMapping);
    };
}
