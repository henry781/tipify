import {DeserializeOptions, JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {customConverter} from '../decorators/customConverter';
import {isBoolean, isString, tryParseBoolean} from '../util/commonUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

@customConverter()
export class BooleanConverter extends CustomConverter<boolean> {

    public deserialize(json: any,
                       converterOptions: CustomConverterOptions,
                       deserializeOptions: DeserializeOptions,
                       jsonConverter: JsonConverter): boolean {

        if (isBoolean(json)) {
            return json as boolean;
        } else if (jsonConverter.options.tryParse && isString(json)) {
            return tryParseBoolean(json);
        } else {
            const errorMessage = 'Fail to deserialize, expected type is <Boolean>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
    }

    public serialize(obj: boolean, options: CustomConverterOptions): any {
        return obj;
    }
}
