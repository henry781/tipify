import {ConverterDefinition} from '../converters/CustomConverter';

export interface PropertyMapping {
    name: string;
    serializedName: string;
    converterDefinition: ConverterDefinition;
}
