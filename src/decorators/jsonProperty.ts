import {PropertyMapping} from "../mapping/PropertyMapping";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";

export function jsonProperty(serializedName: string, type: any) {

    return (cls: any, property: string) => {

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        const propertyMapping: PropertyMapping = {
            name: property,
            serializedName: serializedName,
            type: type
        };

        typeMapping.properties.push(propertyMapping);
    };
}