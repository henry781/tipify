import {ArrayConverter} from '../converters/ArrayConverter';
import {BooleanConverter} from '../converters/BooleanConverter';
import {ConverterWithOptions, CustomConverter} from '../converters/CustomConverter';
import {NumberConverter} from '../converters/NumberConverter';
import {ObjectConverter, ObjectConverterOptions} from '../converters/ObjectConverter';
import {StringConverter} from '../converters/StringConverter';
import {Instantiable, isBoolean, isNullOrUndefined, isNumber, isObject, isString, Type} from './CommonUtil';

export type TypeOrConverter = Type | Instantiable<CustomConverter> | ConverterWithOptions;

export function normalizeConverter(typeOrConverter: TypeOrConverter): ConverterWithOptions {

    if (isNullOrUndefined(typeOrConverter)) {
        return undefined;
    }

    const converter = typeOrConverter as Instantiable<CustomConverter>;
    const isConverter = converter && converter.prototype && converter.prototype instanceof CustomConverter;
    if (isConverter) {
        return {converter};
    }

    const converterDefinition = typeOrConverter as ConverterWithOptions;
    const isConverterDefinition = converterDefinition
        && converterDefinition.converter
        && converterDefinition.converter.prototype
        && converterDefinition.converter.prototype instanceof CustomConverter;
    if (isConverterDefinition) {
        return converterDefinition;
    }

    const type = typeOrConverter as Type;
    switch (type) {
        case String:
            return {converter: StringConverter};
        case Boolean:
            return {converter: BooleanConverter};
        case Number:
            return {converter: NumberConverter};
        default:
            return {converter: ObjectConverter, options: {type} as ObjectConverterOptions};
    }
}

export function autodetectConverter<T>(obj: T): ConverterWithOptions {
    if (Array.isArray(obj)) {
        return {converter: ArrayConverter, options: {}};

    } else if (isString(obj)) {
        return {converter: StringConverter};

    } else if (isBoolean(obj)) {
        return {converter: BooleanConverter};

    } else if (isNumber(obj)) {
        return {converter: NumberConverter};

    } else if (isObject(obj)) {
        return {converter: ObjectConverter, options: {}};
    }
}
