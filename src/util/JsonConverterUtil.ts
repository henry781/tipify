import {JsonConverterError} from '../core/JsonConverterError';

export type Instantiable<T> = Function & { prototype: T };
export type BasicType = typeof Number | typeof String | typeof Boolean;
export type Type = BasicType | Instantiable<any>;

/**
 * Try parse boolean
 * @param value
 */
export function tryParseBoolean(value: string): boolean {

    switch (value.toLowerCase()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
            return false;
        default:
            const errorMessage = 'Obj cannot be parsed to type <Boolean>';
            throw new JsonConverterError(errorMessage);
    }
}

/**
 * Try parse number
 * @param value
 */
export function tryParseNumber(value: string): number {
    const n = Number(value);
    if (isNaN(n)) {
        const errorMessage = 'Obj cannot be parsed to type <Number>';
        throw new JsonConverterError(errorMessage);
    }
    return n;
}

/**
 * Is object null or undefined
 * @param obj
 */
export function isNullOrUndefined(obj: any) {
    return typeof obj === 'undefined' || obj === null;
}

/**
 * Is obj a string
 * @param obj
 */
export function isString(obj: any): boolean {
    return typeof obj === 'string' || obj instanceof String;
}

/**
 * Is obj a boolean
 * @param obj
 */
export function isBoolean(obj: any): boolean {
    return typeof obj === 'boolean' || obj instanceof Boolean;
}

/**
 * Is obj a number
 * @param obj
 */
export function isNumber(obj: any): boolean {
    return typeof obj === 'number' || obj instanceof Number;
}

/**
 * is obj an object
 * @param obj
 */
export function isObject(obj: any): boolean {
    return Object(obj) === obj;
}

