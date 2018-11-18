import {PropertyMapping} from "../mapping/PropertyMapping";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";
import {JsonValidator} from "../mapping/JsonValidators";
import 'reflect-metadata';

export function jsonProperty(serializedName: string, type?: any, validators?: JsonValidator[]) {

    return (cls: any, property: string) => {

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const propertyMapping: PropertyMapping = {
            name: property,
            serializedName: serializedName,
            type: type,
            validators: validators
        };

        typeMapping.properties.push(propertyMapping);
    };
}