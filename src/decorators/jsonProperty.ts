import 'reflect-metadata';
import {ConverterDefinition} from '../converters/CustomConverter';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {PropertyMapping} from '../mapping/PropertyMapping';
import {ensureConverterDefinition, Type} from '../util/JsonConverterUtil';

export function jsonProperty(serializedName: string, type?: Type | ConverterDefinition) {

    return (cls: any, property: string) => {

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const converterDefinition = ensureConverterDefinition(type);
        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        const propertyMapping: PropertyMapping = {
            converterDefinition,
            name: property,
            serializedName,
        };

        typeMapping.properties.push(propertyMapping);
    };
}
