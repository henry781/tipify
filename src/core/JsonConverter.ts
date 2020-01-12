import {
    AnyConverter,
    ArrayConverter,
    BooleanConverter,
    ConverterDefinition,
    CustomConverter,
    EnumConverter,
    KeyValueConverter,
    NumberConverter,
    ObjectConverter,
    StringConverter,
} from '../converters/api';
import {ensureConverterDefinition} from '../util/ConverterDefinitionUtil';
import {Instantiable, isNullOrUndefined, Type} from '../util/JsonConverterUtil';
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
     * Register a converterDefinition
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
     * Get converter instance
     * @param converterType
     */
    public getConverterInstance(converterType: Instantiable<CustomConverter>): CustomConverter {
        return this._converters.find((c) => c instanceof converterType);
    }

    public serialize<T>(obj: T, type?: Type | ConverterDefinition): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        const converterDefinition = ensureConverterDefinition(type);
        const converterInstance = this.getConverterInstance(converterDefinition.converter);

        if (!converterInstance) {
            const errorMessage = '(E01) Cannot get instance of custom converter'
                + ` <${converterDefinition.converter.name}>, this may occur when :\n`
                + '   -  decorator @jsonCustomConverter is missing\n'
                + '   -  class does not extends CustomConverter';
            throw new JsonConverterError(errorMessage);
        }

        return converterInstance.serialize(obj, converterDefinition.options);
    }

    public deserialize<T>(json: any, type?: Type | ConverterDefinition): any {

        // when json is null or undefined, return null or undefined
        if (isNullOrUndefined(json)) {
            return json;
        }

        const converterDefinition = ensureConverterDefinition(type);
        const converterInstance = this.getConverterInstance(converterDefinition.converter);

        if (!converterInstance) {
            const errorMessage = '(E01) Cannot get instance of custom converter'
                + ` <${converterDefinition.converter.name}>, this may occur when :\n`
                + '   -  decorator @jsonCustomConverter is missing\n'
                + '   -  class does not extends CustomConverter';
            throw new JsonConverterError(errorMessage);
        }
        return converterInstance.deserialize(json, converterDefinition.options);
    }
}

const DEFAULT_OPTIONS: JsonConverterOptions = {
    tryParse: false,
};

interface JsonConverterOptions {
    tryParse: boolean;
}
