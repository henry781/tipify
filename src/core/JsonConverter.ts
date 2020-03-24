import {isNullOrUndefined} from '../util/commonUtil';
import {autodetectConverterAndArgs, normalizeConverterAndArgs, TypeOrConverter} from '../util/jsonConverterUtil';
import {JsonConverterError} from './JsonConverterError';

export class JsonConverter {

    constructor(private _options = DEFAULT_JSON_CONVERTER_OPTIONS) {
    }

    /**
     * Serialize an object
     * @param obj
     * @param type
     * @param options
     */
    public serialize<T>(obj: T,
                        type?: TypeOrConverter,
                        options: SerializeOptions = this._options.serialize): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        try {
            const {converter, args} = type ? normalizeConverterAndArgs(type) : autodetectConverterAndArgs(obj);
            return converter.serialize(obj, args, options);

        } catch (err) {
            const errorMessage = this.buildErrorMessage('Fail to serialize json at ', err);
            throw new JsonConverterError(errorMessage);
        }
    }

    public deserialize<T>(json: any,
                          type: TypeOrConverter,
                          options: DeserializeOptions = this._options.deserialize): T {
        if (isNullOrUndefined(json)) {
            return json;
        }

        try {
            if (!type) {
                const errorMessage = 'Type is required';
                throw new JsonConverterError(errorMessage);
            }

            const {converter, args} = normalizeConverterAndArgs(type);
            return converter.deserialize(json, args, options);
        } catch (err) {
            const errorMessage = this.buildErrorMessage('Fail to deserialize json at ', err);
            throw new JsonConverterError(errorMessage);
        }
    }

    private buildErrorMessage(message: string, err: Error) {
        let errorMessage = '';
        let segment = '/';

        while (err) {
            errorMessage += '\n    -> ' + err.message;

            if (err instanceof JsonConverterError) {
                if (!isNullOrUndefined(err.segment)) {
                    segment += '/' + err.segment;
                }
                err = err.parent;
            } else {
                break;
            }
        }

        return message + segment + errorMessage;
    }
}

export interface SerializeOptions {
    unsafe: boolean;
}

export interface DeserializeOptions {
    keepObjectFieldValues?: boolean;
    tryParse?: boolean;
}

export interface JsonConverterOptions {
    serialize: SerializeOptions;
    deserialize: DeserializeOptions;
}

const DEFAULT_SERIALIZE_OPTIONS: SerializeOptions = {
    unsafe: false,
};

const DEFAULT_DESERIALIZE_OPTIONS: DeserializeOptions = {
    keepObjectFieldValues: true,
    tryParse: false,
};

const DEFAULT_JSON_CONVERTER_OPTIONS: JsonConverterOptions = {
    deserialize: DEFAULT_DESERIALIZE_OPTIONS,
    serialize: DEFAULT_SERIALIZE_OPTIONS,
};
