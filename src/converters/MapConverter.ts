import {JsonConverterError} from '../core/JsonConverterError';
import {ensureConverterDefinition, isNumber, isObject, isString, Type} from '../util/JsonConverterUtil';
import {ConverterDefinition, CustomConverter, CustomConverterOptions} from './CustomConverter';

export class MapConverter extends CustomConverter<object, MapConverterOptions> {

    public deserialize(json: any, options: MapConverterOptions): object {

        if (!isObject(json)) {
            const errorMessage = 'Fail to deserialize map, given obj is not an object';
            throw new JsonConverterError(errorMessage);
        }

        const instance = {};
        Object.keys(json).forEach((key) => {

            if (options.keyType === String && !isString(key)) {
                // TODO throw
            } else if (!isNumber(key)) {
                // TODO throw
            }

            try {
                instance[key] = this.converter.deserialize(json[key], options.valueConverter);
            } catch (err) {
                const errorMessage = `Fail to deserialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, err, key);
            }
        });
        return instance;
    }

    public serialize(obj: object, options: MapConverterOptions): any {

        const instance = {};
        Object.keys(obj).forEach((key) => {
            try {
                instance[key] = this.converter.serialize(obj[key], options.valueConverter);
            } catch (err) {
                const errorMessage = `Fail to serialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, err, key);
            }
        });
        return instance;
    }
}

type StringOrNumberType = typeof String | typeof Number;

export interface MapConverterOptions extends CustomConverterOptions {
    keyType: StringOrNumberType;
    valueConverter: ConverterDefinition;
}

export function mapOf(keyType: StringOrNumberType,
                      valueTypeOrConverter: Type | ConverterDefinition): ConverterDefinition {
    return {
        converter: MapConverter,
        options: {keyType, valueConverter: ensureConverterDefinition(valueTypeOrConverter)},
    };
}
