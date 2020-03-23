import {isNullOrUndefined, Type} from '../util/commonUtil';
import {autodetectConverterAndArgs, normalizeConverterAndArgs} from '../util/jsonConverterUtil';
import {ConverterAndArgs} from './CustomConverter';
import {JsonConverterError} from './JsonConverterError';

export class JsonConverter {

    constructor(private _serializeOptions = DEFAULT_SERIALIZE_OPTIONS,
                private _deserializeOptions = DEFAULT_DESERIALIZE_OPTIONS) {
    }

    /**
     * Serialize an object
     * @param obj
     * @param type
     * @param options
     */
    public serialize<T>(obj: T,
                        type?: Type | ConverterAndArgs,
                        options: SerializeOptions = this._serializeOptions): any {

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
                          type: Type | ConverterAndArgs,
                          options: DeserializeOptions = this._deserializeOptions): T {
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

const DEFAULT_SERIALIZE_OPTIONS: SerializeOptions = {
    unsafe: false,
};

const DEFAULT_DESERIALIZE_OPTIONS: DeserializeOptions = {
    keepObjectFieldValues: true,
    tryParse: false,
};
