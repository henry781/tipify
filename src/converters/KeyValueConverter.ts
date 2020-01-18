import {SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isObject, Type} from '../util/commonUtil';
import {normalizeConverter} from '../util/jsonConverterUtil';
import {ConverterWithOptions, CustomConverter, CustomConverterOptions} from './CustomConverter';

export class KeyValueConverter extends CustomConverter<object, MapConverterOptions> {

    public deserialize(json: any, options: MapConverterOptions): object {

        if (!isObject(json) || Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize map, given json is not an object';
            throw new JsonConverterError(errorMessage);
        }

        const instance = {};
        Object.keys(json).forEach((k) => {

            let key: string | number;

            if (options.keyType === String) {
                key = String(k);
            } else {
                key = Number(k);
                if (Number.isNaN(key as number)) {
                    const errorMessage = `Fail to parse map key <${k}> should be a <${options.keyType.name}>`;
                    throw new JsonConverterError(errorMessage);
                }
            }

            try {
                instance[key] = this.converter.processDeserialize(json[key], options.valueConverter);
            } catch (err) {
                const errorMessage = `Fail to deserialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, key, err);
            }
        });
        return instance;
    }

    public serialize(obj: object, converterOptions: MapConverterOptions, serializeOptions: SerializeOptions): any {

        const instance = {};
        Object.keys(obj).forEach((key) => {
            try {
                instance[key] = this.converter.processSerialize(obj[key], converterOptions.valueConverter, serializeOptions);
            } catch (err) {
                const errorMessage = `Fail to serialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, key, err);
            }
        });
        return instance;
    }
}

type StringOrNumberType = typeof String | typeof Number;

export interface MapConverterOptions extends CustomConverterOptions {
    keyType: StringOrNumberType;
    valueConverter: ConverterWithOptions;
}

export function keyValueOf(keyType: StringOrNumberType,
                           valueTypeOrConverter: Type | ConverterWithOptions): ConverterWithOptions {
    return {
        converter: KeyValueConverter,
        options: {keyType, valueConverter: normalizeConverter(valueTypeOrConverter)},
    };
}
