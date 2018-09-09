import {Instantiable} from "./JsonConverterUtil";
import {JsonCustomConverter} from "./converter/JsonCustomConverter";
import {JsonConverterSerializer} from "./core/JsonConverterSerializer";
import {JsonConverterDeserializer} from "./core/JsonConverterDeserializer";

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
    public serialize<T>(obj: T[], type?: Instantiable<T>[] | JsonCustomConverter<T>[]): any;

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
     * @param {Instantiable<T> | JsonCustomConverter<T>} type
     * @returns {T}
     */
    public deserialize<T>(obj: any, type: Instantiable<T> | JsonCustomConverter<T>): T;


    /**
     * Deserialize
     * @param obj
     * @param type
     */
    public deserialize<T>(obj: any, type: any): T {
        return this.deserializer.deserialize(obj, type);
    }
}