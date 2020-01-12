import {JsonConverterError} from '../core/JsonConverterError';
import {ensureConverterDefinition, Type} from '../util/JsonConverterUtil';
import {ConverterDefinition, CustomConverter, CustomConverterOptions} from './CustomConverter';

export class ArrayConverter extends CustomConverter<any[], ArrayConverterOptions> {

    public deserialize<T>(json: any, options: ArrayConverterOptions): T[] {

        if (!Array.isArray(json)) {
            const errorMessage = 'Fail to deserialize array, given obj is not an array';
            throw new JsonConverterError(errorMessage);
        }

        return json.map((entry, index) => {
            try {
                return this.converter.deserialize(entry, options.itemConverter) as T;
            } catch (err) {
                const errorMessage = `Fail to deserialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, err, index);
            }
        });
    }

    public serialize<T>(obj: T[], options: ArrayConverterOptions): any {

        return obj.map((entry, index) => {
            try {
                return this.converter.serialize(entry, options.itemConverter);
            } catch (err) {
                const errorMessage = `Fail to serialize index <${index}> of array`;
                throw new JsonConverterError(errorMessage, err, index);
            }
        });
    }
}

export interface ArrayConverterOptions extends CustomConverterOptions {
    itemConverter: ConverterDefinition;
}

export function arrayOf(itemTypeOrConverter: Type | ConverterDefinition): ConverterDefinition {
    return {
        converter: ArrayConverter,
        options: {itemConverter: ensureConverterDefinition(itemTypeOrConverter)} as ArrayConverterOptions,
    };
}
