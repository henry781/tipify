import {ConverterAndArgs, CustomConverter, CustomConverterArgs} from '../core/CustomConverter';
import {DeserializeOptions, SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isNullOrUndefined, isObject, Type} from '../util/commonUtil';
import {normalizeConverterAndArgs} from '../util/jsonConverterUtil';

type KeyValueConverter = CustomConverter<object, KeyValueConverterArgs>;

export const keyValueConverter: KeyValueConverter = {

    deserialize(json: any,
                args: KeyValueConverterArgs,
                deserializeOptions: DeserializeOptions): object {

        if (isNullOrUndefined(json)) {
            return json;
        }

        if (!isObject(json) || Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize map, given json is not an object';
            throw new JsonConverterError(errorMessage);
        }

        const instance = {};
        Object.keys(json).forEach((k) => {

            let key: string | number;

            if (args.keyType === String) {
                key = String(k);
            } else {
                key = Number(k);
                if (Number.isNaN(key as number)) {
                    const errorMessage = `Fail to parse map key <${k}> should be a <${args.keyType.name}>`;
                    throw new JsonConverterError(errorMessage);
                }
            }

            try {
                instance[key] = args.valueConverter.deserialize(json[key], args.valueConverterArgs, deserializeOptions);
            } catch (err) {
                const errorMessage = `Fail to deserialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, key, err);
            }
        });
        return instance;
    },

    serialize(obj: object,
              args: KeyValueConverterArgs,
              serializeOptions: SerializeOptions): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        const instance = {};
        Object.keys(obj).forEach((key) => {
            try {
                instance[key] = args.valueConverter.serialize(obj[key], args.valueConverterArgs, serializeOptions);
            } catch (err) {
                const errorMessage = `Fail to serialize map value with key <${key}>`;
                throw new JsonConverterError(errorMessage, key, err);
            }
        });
        return instance;
    },
};

type StringOrNumberType = typeof String | typeof Number;

export interface KeyValueConverterArgs extends CustomConverterArgs {
    keyType: StringOrNumberType;
    valueConverter: CustomConverter;
    valueConverterArgs: CustomConverterArgs;
}

export function keyValueOf(keyType: StringOrNumberType,
                           valueTypeOrConverter: Type | ConverterAndArgs): ConverterAndArgs {
    const {converter, args} = normalizeConverterAndArgs(valueTypeOrConverter);
    return {
        args: {keyType, valueConverter: converter, valueConverterArgs: args} as KeyValueConverterArgs,
        converter: keyValueConverter,
    };
}
