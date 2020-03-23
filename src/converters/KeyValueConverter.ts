import {DeserializeOptions, JsonConverter, SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {customConverter} from '../decorators/customConverter';
import {isObject, Type} from '../util/commonUtil';
import {normalizeConverter} from '../util/jsonConverterUtil';
import {ConverterWithOptions, CustomConverter, CustomConverterOptions} from './CustomConverter';

@customConverter()
export class KeyValueConverter extends CustomConverter<object, MapConverterOptions> {

    public deserialize(json: any,
                       converterOptions: MapConverterOptions,
                       deserializeOptions: DeserializeOptions,
                       jsonConverter: JsonConverter): object {

        if (!isObject(json) || Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize map, given json is not an object';
            throw new JsonConverterError(errorMessage);
        }

        const instance = {};
        Object.keys(json).forEach((k) => {

            let key: string | number;

            if (converterOptions.keyType === String) {
                key = String(k);
            } else {
                key = Number(k);
                if (Number.isNaN(key as number)) {
                    const errorMessage = `Fail to parse map key <${k}> should be a <${converterOptions.keyType.name}>`;
                    throw new JsonConverterError(errorMessage);
                }
            }

            try {
                instance[key] = jsonConverter.processDeserialize(json[key], converterOptions.valueConverter);
            } catch (err) {
                const errorMessage = `Fail to deserialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, key, err);
            }
        });
        return instance;
    }

    public serialize(obj: object,
                     converterOptions: MapConverterOptions,
                     serializeOptions: SerializeOptions,
                     jsonConverter: JsonConverter): any {

        const instance = {};
        Object.keys(obj).forEach((key) => {
            try {
                instance[key] = jsonConverter.processSerialize(obj[key], converterOptions.valueConverter, serializeOptions);
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
