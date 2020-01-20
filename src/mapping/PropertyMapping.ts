import {ConverterWithOptions} from '../converters/CustomConverter';

export interface PropertyMapping {
    name: string;
    serializedName: string;
    converterWithOptions: ConverterWithOptions;
}
