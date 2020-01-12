import {JsonConverter} from '../core/JsonConverter';
import {Instantiable} from '../util/JsonConverterUtil';

export abstract class CustomConverter<T = any, K extends CustomConverterOptions = CustomConverterOptions> {

    private readonly _converter: JsonConverter;

    public get converter(): JsonConverter {
        return this._converter;
    }

    constructor(converter: JsonConverter) {
        this._converter = converter;
    }

    public abstract serialize(obj: T, options: K): any;

    public abstract deserialize(json: any, options: K): T;
}

export interface CustomConverterOptions {
}

export interface ConverterDefinition {
    converter: Instantiable<CustomConverter>;
    options?: CustomConverterOptions;
}
