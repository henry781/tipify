import {BooleanConverter} from '../converters/BooleanConverter';
import {ConverterDefinition, CustomConverter} from '../converters/CustomConverter';
import {NumberConverter} from '../converters/NumberConverter';
import {ObjectConverter, ObjectJsonConverterOptions} from '../converters/ObjectConverter';
import {StringConverter} from '../converters/StringConverter';
import {Type} from './JsonConverterUtil';

export function ensureConverterDefinition(converterDefinitionOrType: ConverterDefinition | Type): ConverterDefinition {

    const converterDefinition = converterDefinitionOrType as ConverterDefinition;

    const isConverterDefinition = converterDefinition
        && converterDefinition.converter
        && converterDefinition.converter.prototype
        && converterDefinition.converter.prototype instanceof CustomConverter;

    if (isConverterDefinition) {
        return converterDefinition;
    }

    const type = converterDefinitionOrType as Type;
    switch (type) {
        case String:
            return {converter: StringConverter};
        case Boolean:
            return {converter: BooleanConverter};
        case Number:
            return {converter: NumberConverter};
        default:
            return {converter: ObjectConverter, options: {type} as ObjectJsonConverterOptions};
    }
}
