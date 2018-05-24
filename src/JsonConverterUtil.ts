import {JsonConverterError} from "./JsonConverterError";

export class JsonConverterUtil {

    public static isNullOrUndefined(obj: any) {
        return typeof obj === 'undefined' || obj === null
    }

    public static checkConsistency(obj: any, type: any) {

        if (type === String &&
            typeof obj !== 'string' && obj instanceof String === false) {
            const errorMessage = '(E03) Expected type is <String>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        if (type === Boolean &&
            typeof obj !== 'boolean' && obj instanceof Boolean === false) {
            const errorMessage = '(E03) Expected type is <Boolean>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        if (type === Number &&
            typeof obj !== 'number' && obj instanceof Number === false) {
            const errorMessage = '(E03) Expected type is <Number>, but obj is not';
            throw new JsonConverterError(errorMessage);
        }

        if (Array.isArray(obj) !== Array.isArray(type)) {
            const errorMessage = '(E03) Expected type is an array, but given obj is not';
            throw new JsonConverterError(errorMessage);
        }
    }

    public static deepCopy(obj: any): any {
        // TODO
        return obj;
    }
}