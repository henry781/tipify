import {JsonCustomConverters} from "./converter/JsonCustomConverters";
import {JsonConverterMapper} from "./mapping/JsonConverterMapper";
import {JsonConverterUtil} from "./JsonConverterUtil";
import {Any} from "./type/Any";
import {EnumOptions, EnumStrategy} from "./type/Enum";

export class JsonConverter {

    /**
     * Serialize
     * @param obj
     * @param type
     */
    public serialize(obj: any, type?: any): any {

        // when obj is null or undefined, return null or undefined
        if (typeof obj === 'undefined' || obj === null) {
            return obj;
        }

        if (type) {
            JsonConverterUtil.checkConsistency(obj, type);

            // when custom converter is provided, use custom provider
            if (type instanceof JsonConverter) {
                const converterInstance = JsonCustomConverters.getConverterInstance(type);
                return converterInstance.serialize(obj);
            }

            // when an enum is provided
            else if (type instanceof EnumOptions) {
                return this.serializeEnum(obj, type);
            }

            // when any type is provided, copy object
            else if (type === Any) {
                return JsonConverterUtil.deepCopy(obj);
            }
        }

        // when obj is an array, serialize as an array
        if (Array.isArray(obj)) {
            const _type = type[0];
            if (!_type) {
                throw Error('error (to define)');
            }
            return this.serializeArray(obj, type);
        }

        // when obj is an object, serialize as an obj
        if (obj === Object(obj)) {
            return this.serializeObject(obj);
        }

        // return obj, should match only cases [number, boolean, string]
        return obj;
    }

    /**
     * Deserialize
     * @param obj
     * @param type
     */
    public deserialize<T>(obj: any, type: any): T | T[] {

        // when obj is null or undefined, return null or undefined
        if (typeof obj === 'undefined' || obj === null) {
            return obj;
        }

        JsonConverterUtil.checkConsistency(obj, type);

        // when custom converter is provided, use custom provider
        if (type instanceof JsonConverter) {
            const converterInstance = JsonCustomConverters.getConverterInstance(type);
            return converterInstance.deserialize(obj);
        }

        // when an enum is provided
        else if (type instanceof EnumOptions) {
            return this.deserializeEnum(obj, type);
        }

        // when any type is provided, copy object
        else if (type === Any) {
            return JsonConverterUtil.deepCopy(obj);
        }

        // when obj is an array, deserialize as an array
        if (Array.isArray(obj)) {
            const _type = type[0];
            if (!_type) {
                throw Error('');
            }
            return this.deserializeArray(obj, type);
        }

        if (obj === Object(obj)) {
            return this.deserializeObject<T>(obj, type);
        }

        return obj;
    }

    /**
     * Serialize array
     * @param obj
     * @param type
     */
    protected serializeArray(obj: any[], type?: any): any[] {
        const instance: any[] = [];
        obj.forEach(entry => instance.push(this.serialize(entry, type)));
        return instance;
    }

    /**
     * Serialize object
     * @param obj
     */
    protected serializeObject(obj: any): any {

        const typeMapping = JsonConverterMapper.getMappingForType(obj.constructor);
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        const instance: any = {};

        // serialize each property
        properties.forEach(property => {
            instance[property.serializedName] = this.serialize(obj[property.name], property.type);
        });

        return instance;
    }

    /**
     * Serialize enum
     * @param obj
     * @param options
     */
    protected serializeEnum(obj: number, options: EnumOptions): number | string {

        if (options.strategy === EnumStrategy.INDEX || options.strategy === EnumStrategy.INDEX_COMPATIBLE) {

            if ((typeof options.type[obj] === 'undefined' || options.type[obj] === null)) {
                throw new Error('consistency error');
            }
            return obj;

        } else {

            if ((typeof options.type[obj] === 'undefined' || options.type[obj] === null)) {
                throw new Error('consistency error');
            }
            return options.type[obj];
        }
    }

    protected deserializeArray<T>(obj: any, type: any): T[] {
        return undefined;
        // TODO
    }

    protected deserializeEnum(obj: any, options: EnumOptions): any {
        // TODO
    }

    /**
     * Deserialize object
     * @param obj
     * @param type
     */
    protected deserializeObject<T>(obj: any, type: any): T {

        const typeMapping = JsonConverterMapper.getMappingForType(type);
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        // when polymorphism is defined
        if (typeMapping.options.discriminatorProperty) {
            const discriminatorValue = obj[typeMapping.options.discriminatorProperty];
            const subType = JsonConverterMapper.listMappingForExtendingType(type)
                .find(m => m.options.discriminatorValue === discriminatorValue);

            if (!subType) {
                throw Error('');
            }

            return this.deserializeObject(obj, subType);
        }

        // new instance of type
        const instance = new typeMapping.type();

        // deserialize each property
        properties.forEach(property => {
            instance[property.name] = this.deserialize(obj[property.serializedName], property.type);
        });

        return instance;
    }
}