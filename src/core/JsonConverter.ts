import {ConverterWithOptions} from '../converters/api';
import {CustomConverters} from '../converters/CustomConverters';
import {isNullOrUndefined, Type} from '../util/commonUtil';
import {autodetectConverter, normalizeConverter} from '../util/jsonConverterUtil';
import {JsonConverterError} from './JsonConverterError';

export class JsonConverter {

    public get options() {
        return this._options;
    }

    constructor(private _options = DEFAULT_OPTIONS) {
    }

    /**
     * Serialize an object
     * @param obj
     * @param type
     * @param options
     */
    public serialize<T>(obj: T,
                        type?: Type | ConverterWithOptions,
                        options: SerializeOptions = DEFAULT_SERIALIZE_OPTIONS): any {
        try {
            return this.processSerialize<T>(obj, type, options);
        } catch (err) {
            const errorMessage = this.buildErrorMessage('Fail to serialize json at ', err);
            throw new JsonConverterError(errorMessage);
        }
    }

    /**
     * Deserialize json
     * @param json
     * @param type
     */
    public deserialize<T>(json: any, type?: Type | ConverterWithOptions): T {
        try {
            return this.processDeserialize<T>(json, type);
        } catch (err) {
            const errorMessage = this.buildErrorMessage('Fail to deserialize json at ', err);
            throw new JsonConverterError(errorMessage);
        }
    }

    public processSerialize<T>(obj: T,
                               type?: Type | ConverterWithOptions,
                               serializeOptions: SerializeOptions = DEFAULT_SERIALIZE_OPTIONS): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        const converterWithOptions = normalizeConverter(type) || autodetectConverter<T>(obj);
        if (!converterWithOptions) {
            const errorMessage = 'Cannot get converter or detect type of given obj';
            throw new JsonConverterError(errorMessage);
        }

        const converterInstance = CustomConverters.getConverterInstance(converterWithOptions.converter);
        if (!converterInstance) {
            const errorMessage = 'Cannot get instance of converter'
                + ` <${converterWithOptions.converter.name}>,`
                + ` use jsonConverter.register(${converterWithOptions.converter.name}) to register converter`;
            throw new JsonConverterError(errorMessage);
        }

        return converterInstance.serialize(obj, converterWithOptions.options, serializeOptions, this);
    }

    public processDeserialize<T>(json: any, type?: Type | ConverterWithOptions): T {

        if (isNullOrUndefined(json)) {
            return json;
        }

        const converterWithOptions = normalizeConverter(type);
        const converterInstance = CustomConverters.getConverterInstance(converterWithOptions.converter);

        if (!converterInstance) {
            const errorMessage = 'Cannot get instance of converter'
                + ` <${converterWithOptions.converter.name}>,`
                + ` use jsonConverter.register(${converterWithOptions.converter.name}) to register converter`;
            throw new JsonConverterError(errorMessage);
        }

        return converterInstance.deserialize(json, converterWithOptions.options, undefined, this);
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

const DEFAULT_OPTIONS: JsonConverterOptions = {
    keepObjectFieldValues: true,
    tryParse: false,
};

interface JsonConverterOptions {
    keepObjectFieldValues: boolean;
    tryParse: boolean;
}

export interface SerializeOptions {
    unsafe: boolean;
}

export interface DeserializeOptions {
}

const DEFAULT_SERIALIZE_OPTIONS: SerializeOptions = {
    unsafe: false,
};
