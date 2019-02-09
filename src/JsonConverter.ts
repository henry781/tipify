import {JsonCustomConverter} from './converter/JsonCustomConverter';
import {DeserializerOptions} from './core/DeserializerOptions';
import {JsonConverterDeserializer} from './core/JsonConverterDeserializer';
import {JsonConverterSerializer} from './core/JsonConverterSerializer';
import {Instantiable} from './JsonConverterUtil';

export class JsonConverter {

    private serializer = new JsonConverterSerializer();
    private deserializer = new JsonConverterDeserializer();

    constructor() {
    }

    /**
     * Serialize
     * @param {T[]} obj
     * @param {Instantiable<T>[] | JsonCustomConverter<T>[]} type
     * @returns {any}
     */
    public serialize<T>(obj: T[], type?: Array<Instantiable<T>> | Array<JsonCustomConverter<T>>): any;

    /**
     * Serialize
     * @param {T} obj
     * @param {Instantiable<T> | JsonCustomConverter<T>} type
     * @returns {any}
     */
    public serialize<T>(obj: T, type?: Instantiable<T> | JsonCustomConverter<T>): any;

    /**
     * Serialize
     * @param {T} obj
     * @param type
     * @returns {any}
     */
    public serialize<T>(obj: T, type?: any): any {
        return this.serializer.serialize(obj, type);
    }

    /**
     * Deserialize
     * @param obj
     * @param type
     * @param options
     */
    public deserialize<T>(obj: any, type: any, options?: DeserializerOptions): T {
        return this.deserializer.deserialize(obj, type);
    }
}
