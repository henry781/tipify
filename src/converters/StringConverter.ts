import {JsonConverterError} from '../core/JsonConverterError';
import {isString} from '../util/commonUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

export class StringConverter extends CustomConverter<string> {

    public deserialize(json: any, options: CustomConverterOptions): string {

        if (!isString(json)) {
            const errorMessage = 'Fail to deserialize string, expected type is <String>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
        return json as string;
    }

    public serialize(obj: string, options: CustomConverterOptions): any {
        return obj;
    }
}
