import {JsonCustomConverter} from "./JsonCustomConverter";

export class JsonCustomConverters {

    public static CONVERTERS: JsonCustomConverter<any>[] = [];

    /**
     * Get converter type
     * @param converterType
     */
    public static getConverterInstance(converterType: any): JsonCustomConverter<any> {
        return JsonCustomConverters.CONVERTERS.find(c => c instanceof converterType);
    }

    /**
     * Instantiate converter
     * @param converterType
     */
    public static instantiateConverter(converterType: any): JsonCustomConverters {

        let instance = JsonCustomConverters.CONVERTERS.find(c => c instanceof converterType);

        if (!instance) {
            instance = new converterType.constructor();
            JsonCustomConverters.CONVERTERS.push(instance);
        }

        return instance;
    }
}