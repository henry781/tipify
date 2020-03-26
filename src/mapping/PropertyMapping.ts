import {CustomConverter, CustomConverterArgs} from '../core/CustomConverter';

export interface PropertyMapping {
    args: CustomConverterArgs;
    converter: CustomConverter;
    name: string;
    serializedName: string;
}
