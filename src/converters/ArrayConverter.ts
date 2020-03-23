import {DeserializeOptions, JsonConverter, SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {customConverter} from '../decorators/customConverter';
import {Type} from '../util/commonUtil';
import {normalizeConverter} from '../util/jsonConverterUtil';
import {ConverterWithOptions, CustomConverter, CustomConverterOptions} from './CustomConverter';

@customConverter()
export class ArrayConverter extends CustomConverter<any[], ArrayConverterOptions> {

    public deserialize<T>(json: any,
                          arrayConverterOptions: ArrayConverterOptions,
                          deserializeOptions: DeserializeOptions,
                          jsonConverter: JsonConverter): T[] {

        if (!Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize, given json is not an array';
            throw new JsonConverterError(errorMessage);
        }

        return json.map((entry, index) => {
            try {
                return jsonConverter.processDeserialize(entry, arrayConverterOptions.itemConverter) as T;
            } catch (err) {
                const errorMessage = `Fail to deserialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, index, err);
            }
        });
    }

    public serialize<T>(obj: T[],
                        converterOptions: ArrayConverterOptions,
                        serializeOptions: SerializeOptions,
                        jsonConverter: JsonConverter): any {

        return obj.map((entry, index) => {
            try {
                return jsonConverter.processSerialize(entry, converterOptions.itemConverter, serializeOptions);
            } catch (err) {
                const errorMessage = `Fail to serialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, index, err);
            }
        });
    }
}

export interface ArrayConverterOptions extends CustomConverterOptions {
    itemConverter: ConverterWithOptions;
}

export function arrayOf(itemTypeOrConverter: Type | ConverterWithOptions): ConverterWithOptions {
    return {
        converter: ArrayConverter,
        options: {itemConverter: normalizeConverter(itemTypeOrConverter)} as ArrayConverterOptions,
    };
}
