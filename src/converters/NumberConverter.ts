import {JsonConverterError} from '../core/JsonConverterError';
import {isNumber, isString, tryParseNumber} from '../util/JsonConverterUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

export class NumberConverter extends CustomConverter<number> {

    public deserialize(json: any, options: CustomConverterOptions): number {

        if (isNumber(json)) {
            return json as number;
        } else if (this.converter.options.tryParse && isString(json)) {
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
