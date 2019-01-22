import 'reflect-metadata';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {JsonValidator} from '../mapping/JsonValidators';
import {PropertyMapping} from '../mapping/PropertyMapping';

export function jsonProperty(serializedName: string, type?: any, validators?: JsonValidator[]) {

    return (cls: any, property: string) => {

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const propertyMapping: PropertyMapping = {
            name: property,
            serializedName,
            type,
            validators,
        };

        typeMapping.properties.push(propertyMapping);
    };
}
