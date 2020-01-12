import {JsonConverterError} from '../core/JsonConverterError';
import {isBoolean, isString, tryParseBoolean} from '../util/JsonConverterUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

export class BooleanConverter extends CustomConverter<boolean> {

    public deserialize(json: any, options: CustomConverterOptions): boolean {

        if (isBoolean(json)) {
            return json as boolean;
        } else if (this.converter.options.tryParse && isString(json)) {
            return tryParseBoolean(json);
        } else {
            throw new JsonConverterError('Fail to deserialize boolean, expected type is <Boolean>, but obj is not');
        }
    }

    public serialize(obj: boolean, options: CustomConverterOptions): any {
        return obj;
    }
}
