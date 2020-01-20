import {JsonConverter, SerializeOptions} from '../core/JsonConverter';
import {Instantiable} from '../util/commonUtil';

export abstract class CustomConverter<T = any, K extends CustomConverterOptions = CustomConverterOptions> {

    private readonly _converter: JsonConverter;

    public get converter(): JsonConverter {
        return this._converter;
    }

    constructor(converter: JsonConverter) {
        this._converter = converter;
    }

    public abstract serialize(obj: T, converterOptions: K, serializeOptions?: SerializeOptions): any;

    public abstract deserialize(json: any, converterOptions: K): T;
}

export interface CustomConverterOptions {
}

export interface ConverterWithOptions {
    converter: Instantiable<CustomConverter>;
    options?: CustomConverterOptions;
}
