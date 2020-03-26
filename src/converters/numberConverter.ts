import {CustomConverter, CustomConverterArgs} from '../core/CustomConverter';
import {DeserializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isNullOrUndefined, isNumber, isString, tryParseNumber} from '../util/commonUtil';

type NumberConverter = CustomConverter<number>;

export const numberConverter: NumberConverter = {

    deserialize(json: any,
                args: CustomConverterArgs,
                deserializeOptions: DeserializeOptions): number {

        if (isNullOrUndefined(json)) {
            return json;
        } else if (isNumber(json)) {
            return json as number;
        } else if (deserializeOptions.tryParse && isString(json)) {
            return tryParseNumber(json);
        } else {
            const errorMessage = 'Fail to deserialize, expected type is <Number>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
    },

    serialize(obj: number): any {
        return obj;
    },
};
