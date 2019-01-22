export const DEFAULT_DESERIALIZER_OPTIONS: DeserializerOptions = {
    tryParse: false,
};

export interface DeserializerOptions {
    tryParse: boolean;
}
