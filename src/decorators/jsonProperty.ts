import {PropertyMapping} from "../mapping/PropertyMapping";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";
import {JsonValidator} from "../mapping/JsonValidators";

export function jsonProperty(serializedName: string, type: any, validators?: JsonValidator[]) {

    return (cls: any, property: string) => {

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        const propertyMapping: PropertyMapping = {
            name: property,
            serializedName: serializedName,
            type: type,
            validators: validators
        };

        typeMapping.properties.push(propertyMapping);
    };
}