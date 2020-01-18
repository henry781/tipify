import {JsonConverterError} from '../core/JsonConverterError';
import {isBoolean, isString, tryParseBoolean} from '../util/CommonUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

export class BooleanConverter extends CustomConverter<boolean> {

    public deserialize(json: any, options: CustomConverterOptions): boolean {

        if (isBoolean(json)) {
            return json as boolean;
        } else if (this.converter.options.tryParse && isString(json)) {
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
