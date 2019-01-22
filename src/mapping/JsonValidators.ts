import {JsonConverterError} from '../JsonConverterError';

export type JsonValidator = (obj: any, serializedName: string) => void;

export class JsonValidators {

    public static required: JsonValidator = (obj: any, serializedName: string) => {
        if (!obj.hasOwnProperty(serializedName)) {
            throw new JsonConverterError('value is required');
        }
    }
}
