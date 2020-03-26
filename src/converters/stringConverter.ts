import {CustomConverter} from '../core/CustomConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isNullOrUndefined, isString} from '../util/commonUtil';

type StringConverter = CustomConverter<string>;

export const stringConverter: StringConverter = {

    deserialize(json: any): string {

        if (isNullOrUndefined(json)) {
            return json;
        }

        if (!isString(json)) {
            const errorMessage = 'Fail to deserialize string, expected type is <String>, but json is not';
            throw new JsonConverterError(errorMessage);
        }
        return json as string;
    },

    serialize(obj: string): any {
        return obj;
    },
};
