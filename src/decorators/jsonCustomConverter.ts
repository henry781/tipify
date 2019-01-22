import {JsonCustomConverters} from '../converter/JsonCustomConverters';

export function jsonCustomConverter() {

    return (constructor: () => any) => {
        JsonCustomConverters.instantiateConverter(constructor);
    };
}
