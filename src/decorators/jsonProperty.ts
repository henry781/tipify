import 'reflect-metadata';
import {ConverterAndArgs, CustomConverter} from '../core/CustomConverter';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {PropertyMapping} from '../mapping/PropertyMapping';
import {Type} from '../util/commonUtil';
import {normalizeConverterAndArgs} from '../util/jsonConverterUtil';

export function jsonProperty(serializedName: string, type?: Type | CustomConverter | ConverterAndArgs) {

    return (cls: any, property: string) => {

        if (!type) {
            type = Reflect.getMetadata('design:type', cls, property);
        }

        const {converter, args} = normalizeConverterAndArgs(type);

        const typeMapping = JsonConverterMapper.createMappingForType(cls.constructor);
        const propertyMapping: PropertyMapping = {
            args,
            converter,
            name: property,
            serializedName,
        };

        typeMapping.properties.push(propertyMapping);
    };
}
