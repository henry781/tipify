import {JsonCustomConverters} from '../converter/JsonCustomConverters';

export function jsonCustomConverter() {

    return (constructor: Function) => {
        JsonCustomConverters.instantiateConverter(constructor);
    };
}
