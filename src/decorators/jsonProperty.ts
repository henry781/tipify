import 'reflect-metadata';
import {ConverterWithOptions, CustomConverter} from '../converters/CustomConverter';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {PropertyMapping} from '../mapping/PropertyMapping';
import {Instantiable, Type} from '../util/commonUtil';
import {normalizeConverter} from '../util/jsonConverterUtil';

export function jsonProperty(serializedName: string, type?: Type | Instantiable<CustomConverter> | ConverterWithOptions) {

    return (cls: any, property: string) => {

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const converterWithOptions = normalizeConverter(type);
        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);

        const propertyMapping: PropertyMapping = {
            converterWithOptions,
            name: property,
            serializedName,
        };

        typeMapping.properties.push(propertyMapping);
    };
}
