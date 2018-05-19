export class JsonConverterUtil {

    public static checkConsistency(obj: any, type: any) {

        if (type === String &&
            typeof obj !== 'string' && obj instanceof String === false) {
            throw Error('consistency error');
        }

        if (type === Boolean &&
            typeof obj !== 'boolean' && obj instanceof Boolean === false) {
            throw Error('consistency error');
        }

        if (type === Number &&
            typeof obj !== 'number' && obj instanceof Number === false) {
            throw Error('consistency error');
        }

        if (Array.isArray(obj) !== Array.isArray(type)) {
            throw Error('consistency error');
        }
    }

    public static deepCopy(obj: any): any {
        return obj;
    }
}