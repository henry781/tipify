import {Instantiable} from '../util/commonUtil';
import {CustomConverter} from './CustomConverter';

export class CustomConverters {

    public static CONVERTERS: Array<CustomConverter<any>> = [];

    public static getConverterInstance(converterType: Instantiable<CustomConverter>): CustomConverter {
        return CustomConverters.CONVERTERS.find((c) => c instanceof converterType);
    }

    public static instantiateConverter(converterType: Instantiable<CustomConverter<any>>) {

        let instance = CustomConverters.CONVERTERS.find((c) => c instanceof converterType);

        if (!instance) {
            instance = new converterType();
            CustomConverters.CONVERTERS.push(instance);
        }
    }
}
