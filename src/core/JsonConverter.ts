import {
    AnyConverter,
    ArrayConverter,
    BooleanConverter,
    ConverterWithOptions,
    CustomConverter,
    EnumConverter,
    KeyValueConverter,
    NumberConverter,
    ObjectConverter,
    StringConverter,
} from '../converters/api';
import {Instantiable, isNullOrUndefined, Type} from '../util/CommonUtil';
import {autodetectConverter, normalizeConverter} from '../util/JsonConverterUtil';
import {JsonConverterError} from './JsonConverterError';

export class JsonConverter {

    private _converters: Array<CustomConverter<any>> = [];

    constructor(private _options = DEFAULT_OPTIONS) {
        this.registerDefaultConverters();
    }

    public get options() {
        return this._options;
    }

    /**
     * Register a converterWithOptions
     * @param converterType
     */
    public registerConverter(converterType: Instantiable<CustomConverter<any>>) {
        this._converters.push(new converterType(this));
    }

    /**
     * Register all default converters
     */
    public registerDefaultConverters() {
        this.registerConverter(AnyConverter);
        this.registerConverter(ArrayConverter);
        this.registerConverter(EnumConverter);
        this.registerConverter(KeyValueConverter);
        this.registerConverter(ObjectConverter);
        this.registerConverter(BooleanConverter);
        this.registerConverter(StringConverter);
        this.registerConverter(NumberConverter);
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

        const converterInstance = this.getConverterInstance(converterWithOptions.converter);
        if (!converterInstance) {
            const errorMessage = 'Cannot get instance of converter'
                + ` <${converterWithOptions.converter.name}>,`
                + ` use jsonConverter.register(${converterWithOptions.converter.name}) to register converter`;
            throw new JsonConverterError(errorMessage);
        }

        return converterInstance.serialize(obj, converterWithOptions.options, serializeOptions);
    }

    public processDeserialize<T>(json: any, type?: Type | ConverterWithOptions): T {

        if (isNullOrUndefined(json)) {
            return json;
        }

        const converterWithOptions = normalizeConverter(type);
        const converterInstance = this.getConverterInstance(converterWithOptions.converter);

        if (!converterInstance) {
            const errorMessage = 'Cannot get instance of converter'
                + ` <${converterWithOptions.converter.name}>,`
                + ` use jsonConverter.register(${converterWithOptions.converter.name}) to register converter`;
            throw new JsonConverterError(errorMessage);
        }

        return converterInstance.deserialize(json, converterWithOptions.options);
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

    /**
     * Get converter instance
     * @param converterType
     */
    private getConverterInstance(converterType: Instantiable<CustomConverter>): CustomConverter {
        return this._converters.find((c) => c instanceof converterType);
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

const DEFAULT_SERIALIZE_OPTIONS: SerializeOptions = {
    unsafe: false,
};
