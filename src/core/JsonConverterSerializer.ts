import {JsonCustomConverter} from '../converter/JsonCustomConverter';
import {JsonCustomConverters} from '../converter/JsonCustomConverters';
import {JsonConverterError} from '../JsonConverterError';
import {JsonConverterUtil} from '../JsonConverterUtil';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {Any} from '../type/Any';
import {EnumOptions, EnumStrategy} from '../type/Enum';

export class JsonConverterSerializer {

    /**
     * Serialize
     * @param {T} obj
     * @param type
     * @returns {any}
     */
    public serialize<T>(obj: T, type?: any): any {

        try {
            return this.processSerialize(obj, type);
        } catch (err) {
            const errorMessage = '(E00) cannot serialize object :\n'
                + JSON.stringify(obj, null, 2);
            throw new JsonConverterError(errorMessage, err);
        }
    }

    /**
     * Process serialize
     * @param obj
     * @param type
     * @returns {any}
     */
    public processSerialize<T>(obj: T, type?: any): any {

        // when obj is null or undefined, return null or undefined
        if (JsonConverterUtil.isNullOrUndefined(obj)) {
            return obj;
        }

        if (type) {
            JsonConverterUtil.checkConsistency(obj, type);

            // when custom converter is provided, use custom provider
            if (type.prototype && type.prototype instanceof JsonCustomConverter) {
                const converterInstance = JsonCustomConverters.getConverterInstance(type);
                if (!converterInstance) {
                    const errorMessage = `(E01) Cannot get instance of custom converter <${type.name}>, this may occur when :\n`
                        + '   -  decorator @jsonCustomConverter is missing\n'
                        + '   -  class does not extends JsonCustomConverter';
                    throw new JsonConverterError(errorMessage);
                }
                return converterInstance.serialize(obj);
            } else if (type instanceof EnumOptions) {
                return this.processSerializeEnum(obj, type);
            } else if (type === Any) {
                return JsonConverterUtil.deepCopy(obj);
            }
        }

        // when obj is an array, serialize as an array
        if (Array.isArray(obj)) {
            let _type;

            // if type is provided, it should be an array
            if (type) {
                if (!Array.isArray(type) || !type[0]) {
                    const errorMessage = '(E02) Given type is not valid, it should be an array like [String]';
                    throw new JsonConverterError(errorMessage);
                }
                _type = type[0];
            }

            return this.processSerializeArray(obj, _type);
        }

        // when obj is an object, serialize as an obj
        if (obj === Object(obj)) {
            return this.processSerializeObject(obj);
        }

        // return obj, should match only cases [number, boolean, string]
        return obj;
    }

    /**
     * Serialize enum
     * @param obj
     * @param options
     */
    public processSerializeEnum(obj: any, options: EnumOptions): number | string {

        if (JsonConverterUtil.isNullOrUndefined(options.type[obj])) {
            const errorMessage = `(E10) <${obj}> for enum <${options.type.name}> does not exist`;
            throw new JsonConverterError(errorMessage);
        }

        if (options.strategy === EnumStrategy.INDEX) {
            return obj;
        } else if (options.strategy === EnumStrategy.NAME) {
            return options.type[obj];
        } else {
            const errorMessage = `(E12) strategy for enum <${options.type.name}> is not defined`;
            throw new JsonConverterError(errorMessage);
        }
    }

    /**
     * Serialize object
     * @param obj
     */
    public processSerializeObject(obj: any): any {

        const typeMapping = JsonConverterMapper.getMappingForType(obj.constructor);
        if (!typeMapping) {
            const errorMessage = `(E09) Cannot get mapping for <${obj.constructor.name}>, this may occur when :\n`
                + '   -  decorator @jsonObject is missing\n';
            throw new JsonConverterError(errorMessage);
        }

        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        const instance: any = {};

        // serialize each property
        properties.forEach((property) => {
            try {
                const value = this.serialize(obj[property.name], property.type);
                if (value !== undefined && value !== null) {
                    instance[property.serializedName] = value;
                }
            } catch (err) {
                const errorMessage = `(E08) error serializing property <${property.name}>, type <${property.type.name}>`;
                throw new JsonConverterError(errorMessage, err);
            }
        });

        return instance;
    }

    /**
     * Serialize array
     * @param obj
     * @param type
     */
    public processSerializeArray(obj: any[], type?: any): any[] {
        const instance: any[] = [];

        obj.forEach((entry, index) => {
            try {
                instance.push(this.serialize(entry, type));
            } catch (err) {
                const errorMessage = `(E20) error serializing index <${index}>, type <${type ? type.name : undefined}>`;
                throw new JsonConverterError(errorMessage, err);
            }
        });

        return instance;
    }

}
