import {arrayConverter, arrayOf} from '../converters/arrayConverter';
import {booleanConverter} from '../converters/booleanConverter';
import {numberConverter} from '../converters/numberConverter';
import {objectConverter, ObjectConverterArgs} from '../converters/objectConverter';
import {stringConverter} from '../converters/stringConverter';
import {ConverterAndArgs, CustomConverter} from '../core/CustomConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isBoolean, isNumber, isObject, isString, Type} from './commonUtil';

export type TypeOrConverter = Type | CustomConverter | ConverterAndArgs;

export function normalizeConverterAndArgs(typeOrConverter: TypeOrConverter): ConverterAndArgs {

    const converter = typeOrConverter as CustomConverter;
    if (converter
        && typeof converter.serialize === 'function'
        && typeof converter.deserialize === 'function') {
        return {converter};
    }

    const converterWithArgs = typeOrConverter as ConverterAndArgs;
    if (converterWithArgs
        && converterWithArgs.converter
        && typeof converterWithArgs.converter.serialize === 'function'
        && typeof converterWithArgs.converter.deserialize === 'function') {
        return converterWithArgs;
    }

    if (typeOrConverter && Array.isArray(typeOrConverter) && typeOrConverter.length) {
        return arrayOf(typeOrConverter[0]);
    }

    const type = typeOrConverter as Type;
    switch (type) {
        case String:
            return {converter: stringConverter};
        case Boolean:
            return {converter: booleanConverter};
        case Number:
            return {converter: numberConverter};
        default:
            return {converter: objectConverter, args: {type} as ObjectConverterArgs};
    }
}

export function autodetectConverterAndArgs<T>(obj: T): ConverterAndArgs {
    if (Array.isArray(obj)) {
        return {converter: arrayConverter, args: {}};

    } else if (isString(obj)) {
        return {converter: stringConverter};

    } else if (isBoolean(obj)) {
        return {converter: booleanConverter};

    } else if (isNumber(obj)) {
        return {converter: numberConverter};

    } else if (isObject(obj)) {
        return {converter: objectConverter, args: {type: obj.constructor}};
    } else {
        const errorMessage = 'Cannot get detect type of given obj';
        throw new JsonConverterError(errorMessage);
    }
}
