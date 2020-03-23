import {CustomConverter} from '../converters/CustomConverter';
import {CustomConverters} from '../converters/CustomConverters';
import {Instantiable} from '../util/commonUtil';

export function customConverter() {

    return (constructor: Instantiable<CustomConverter<any>>) => {
        CustomConverters.instantiateConverter(constructor);
    };
}
