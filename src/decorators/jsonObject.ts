import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {JsonObjectOptions} from './JsonObjectOptions';

/**
 * jsonObject annotation
 * @param options
 */
export function jsonObject(options?: JsonObjectOptions) {

    return (constructor: Function) => {
        const mapping = JsonConverterMapper.createMappingForType(constructor);
        mapping.options = options;

        const parentType = Object.getPrototypeOf(constructor);
        if (parentType.name) {
            mapping.parent = JsonConverterMapper.getMappingForType(parentType);
        }
    };
}
