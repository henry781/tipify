import {ConverterAndArgs, CustomConverter, CustomConverterArgs} from '../core/CustomConverter';
import {DeserializeOptions, SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isNullOrUndefined, Type} from '../util/commonUtil';
import {autodetectConverterAndArgs, normalizeConverterAndArgs} from '../util/jsonConverterUtil';

type ArrayConverter = CustomConverter<any[], ArrayConverterArgs>;

export const arrayConverter: ArrayConverter = {

    deserialize<T>(json: any,
                   args: ArrayConverterArgs,
                   deserializeOptions: DeserializeOptions): T[] {

        if (isNullOrUndefined(json)) {
            return json;
        }

        if (!Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize, given json is not an array';
            throw new JsonConverterError(errorMessage);
        }

        const arr = [];
        json.forEach((entry, index) => {
            try {
                arr[index] = args.itemConverter.deserialize(entry, args.itemConverterArgs, deserializeOptions);
            } catch (err) {
                const errorMessage = `Fail to deserialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, index, err);
            }
        });

        return arr as any;
    },

    serialize<T>(obj: T[],
                 args: ArrayConverterArgs,
                 serializeOptions: SerializeOptions): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        if (!Array.isArray(obj)) {
            const errorMessage = 'Fail to serialize, given json is not an array';
            throw new JsonConverterError(errorMessage);
        }

        const arr = [];
        obj.forEach((entry, index) => {
            try {
                if (!entry) {
                    arr[index] = entry;

                } else {
                    const converterAndArgs = args.itemConverter
                        ? {converter: args.itemConverter, args: args.itemConverterArgs}
                        : autodetectConverterAndArgs(entry);
                    arr[index] = converterAndArgs.converter.serialize(entry, converterAndArgs.args, serializeOptions);
                }

            } catch (err) {
                const errorMessage = `Fail to serialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, index, err);
            }
        });
        return arr;
    },
};

export interface ArrayConverterArgs extends CustomConverterArgs {
    itemConverter: CustomConverter;
    itemConverterArgs: CustomConverterArgs;
}

export function arrayOf(itemTypeOrConverter: Type | ConverterAndArgs): ConverterAndArgs {
    const {converter, args} = normalizeConverterAndArgs(itemTypeOrConverter);
    return {
        args: {itemConverter: converter, itemConverterArgs: args} as ArrayConverterArgs,
        converter: arrayConverter,
    };
}
