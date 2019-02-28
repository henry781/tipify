import {JsonConverterError} from './JsonConverterError';
import {Any} from './type/Any';

export type Instantiable<T> = new(...args: any[]) => T;

export class JsonConverterUtil {

    /**
     * Try parse boolean
     * @param value
     */
    public static tryParseBoolean(value: string): boolean {

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
                const errorMessage = '(E03) Expected type is <Boolean>, but obj is not';
                throw new JsonConverterError(errorMessage);
        }
    }

    /**
     * Try parse number
     * @param value
     */
    public static tryParseNumber(value: string): number {
        const n = Number(value);
        if (isNaN(n)) {
            const errorMessage = '(E03) Expected type is <Number>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }
        return n;
    }

    public static isNullOrUndefined(obj: any) {
        return typeof obj === 'undefined' || obj === null;
    }

    public static isString(obj: any): boolean {
        return typeof obj === 'string' || obj instanceof String;
    }

    public static isBoolean(obj: any): boolean {
        return typeof obj === 'boolean' || obj instanceof Boolean;
    }

    public static isNumber(obj: any): boolean {
        return typeof obj === 'number' || obj instanceof Number;
    }

    /**
     * Check consistency
     * @param obj
     * @param type
     * @param strict
     */
    public static checkConsistency<T>(obj: any, type: any, strict = false) {

        if (type === Any) {
            return;
        }

        if (type === String && !JsonConverterUtil.isString(obj)) {
            const errorMessage = '(E03) Expected type is <String>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        const isParsable = !strict && JsonConverterUtil.isString(obj);

        if (type === Boolean && !JsonConverterUtil.isBoolean(obj) && !isParsable) {
            const errorMessage = '(E03) Expected type is <Boolean>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        if (type === Number && !JsonConverterUtil.isNumber(obj) && !isParsable) {
            const errorMessage = '(E03) Expected type is <Number>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        if (Array.isArray(obj) !== Array.isArray(type)) {
            const errorMessage = '(E03) Expected type is an array, but given obj is not';
            throw new JsonConverterError(errorMessage);
        }
    }

    public static deepCopy(obj: any): any {
        // TODO : to implement
        return obj;
    }
}
