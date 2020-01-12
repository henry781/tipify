import {JsonConverterError} from '../core/JsonConverterError';
import {isString} from '../util/JsonConverterUtil';
import {CustomConverter, CustomConverterOptions} from './CustomConverter';

export class StringConverter extends CustomConverter<string> {

    public deserialize(json: any, options: CustomConverterOptions): string {

        if (!isString(json)) {
            throw new JsonConverterError('Fail to deserialize string, expected type is <String>, but obj is not');
        }
        return json as string;
    }

    public serialize(obj: string, options: CustomConverterOptions): any {
        return obj;
    }
}
