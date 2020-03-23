import {DeserializeOptions, SerializeOptions} from '../core/JsonConverter';

export interface CustomConverter<T = any, K extends CustomConverterArgs = CustomConverterArgs> {

    serialize(obj: T,
              args?: K,
              serializeOptions?: SerializeOptions): any;

    deserialize(json: any,
                args?: K,
                deserializeOptions?: DeserializeOptions): T;
}

export interface CustomConverterArgs {
}

export interface ConverterAndArgs {
    converter: CustomConverter;
    args?: CustomConverterArgs;
}
