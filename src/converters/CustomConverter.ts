import {DeserializeOptions, JsonConverter, SerializeOptions} from '../core/JsonConverter';
import {Instantiable} from '../util/commonUtil';

export abstract class CustomConverter<T = any, K extends CustomConverterOptions = CustomConverterOptions> {

    public abstract serialize(obj: T,
                              converterOptions: K,
                              serializeOptions: SerializeOptions,
                              jsonConverter: JsonConverter): any;

    public abstract deserialize(json: any,
                                converterOptions: K,
                                deserializeOptions: DeserializeOptions,
                                jsonConverter: JsonConverter): T;
}

export interface CustomConverterOptions {
}

export interface ConverterWithOptions {
    converter: Instantiable<CustomConverter>;
    options?: CustomConverterOptions;
}
