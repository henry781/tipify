import {DeserializeOptions, JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {customConverter} from '../decorators/customConverter';
import {isNumber, isString, tryParseNumber} from '../util/commonUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

@customConverter()
export class NumberConverter extends CustomConverter<number> {

    public deserialize(json: any,
                       converterOptions: CustomConverterOptions,
                       deserializeOptions: DeserializeOptions,
                       jsonConverter: JsonConverter): number {

        if (isNumber(json)) {
            return json as number;
        } else if (jsonConverter.options.tryParse && isString(json)) {
            return tryParseNumber(json);
        } else {
            const errorMessage = 'Fail to deserialize, expected type is <Number>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
    }

    public serialize(obj: number, options: CustomConverterOptions): any {
        return obj;
    }
}
