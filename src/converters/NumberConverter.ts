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
            throw new JsonConverterError('Fail to deserialize number, expected type is <Number>, but obj is not');
        }
    }

    public serialize(obj: number, options: CustomConverterOptions): any {
        return obj;
    }
}
