import {CustomConverter, CustomConverterArgs} from '../core/CustomConverter';
import {DeserializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isBoolean, isNullOrUndefined, isString, tryParseBoolean} from '../util/commonUtil';

type BooleanConverter = CustomConverter<boolean>;

export const booleanConverter: BooleanConverter = {

    deserialize(json: any,
                args: CustomConverterArgs,
                deserializeOptions: DeserializeOptions): boolean {

        if (isNullOrUndefined(json)) {
            return json;
        } else if (isBoolean(json)) {
            return json as boolean;
        } else if (deserializeOptions.tryParse && isString(json)) {
            return tryParseBoolean(json);
        } else {
            const errorMessage = 'Fail to deserialize, expected type is <Boolean>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
    },

    serialize(obj: boolean): any {
        return obj;
    },
};
