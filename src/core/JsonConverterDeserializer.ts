import {JsonConverterUtil} from "../JsonConverterUtil";
import {EnumOptions} from "../type/Enum";
import {JsonCustomConverters} from "../converter/JsonCustomConverters";
import {JsonConverterError} from "../JsonConverterError";
import {JsonCustomConverter} from "../converter/JsonCustomConverter";
import {JsonConverterMapper} from "../mapping/JsonConverterMapper";
import {Any} from "../type/Any";
import {DEFAULT_DESERIALIZER_OPTIONS, DeserializerOptions} from "./DeserializerOptions";

export class JsonConverterDeserializer {

    /**
     * Deserialize
     * @param obj
     * @param type
     * @param options
     */
    public deserialize<T>(obj: any, type: any, options = DEFAULT_DESERIALIZER_OPTIONS): T {
        try {
            return this.processDeserialize<T>(obj, type, options);
        } catch (err) {
            const errorMessage = '(E40) cannot derialize :\n'
                + JSON.stringify(obj, null, 2);
            throw new JsonConverterError(errorMessage, err);
        }
    }

    /**
     * Process deserialize
     * @param obj
     * @param type
     * @param options
     */
    public processDeserialize<T>(obj: any, type: any, options: DeserializerOptions): T {

        // when obj is null or undefined, return null or undefined
        if (JsonConverterUtil.isNullOrUndefined(obj)) {
            return obj;
        }

        JsonConverterUtil.checkConsistency(obj, type, !options.parseString);

        // when custom converter is provided, use custom provider
        if (type.prototype instanceof JsonCustomConverter) {
            const converterInstance = JsonCustomConverters.getConverterInstance(type);
            if (!converterInstance) {
                const errorMessage = `(E01) Cannot get instance of custom converter <${type.name}>, this may occur when :\n`
                    + '   -  decorator @jsonCustomConverter is missing\n'
                    + '   -  class does not extends JsonCustomConverter';
                throw new JsonConverterError(errorMessage);
            }
            return converterInstance.deserialize(obj);
        }

        // when an enum is provided
        else if (type instanceof EnumOptions) {
            return this.processDeserializeEnum(obj, type);
        }

        // when any type is provided, copy object
        else if (type === Any) {
            return JsonConverterUtil.deepCopy(obj);
        }

        // when obj is an array, deserialize as an array
        else if (Array.isArray(obj)) {
            const _type = type[0];
            if (!_type) {
                const errorMessage = `(E02) Given type is not valid, it should be an array like [String]`;
                throw new JsonConverterError(errorMessage);
            }
            return <any>this.processDeserializeArray(obj, _type, options);
        }

        // when obj is an object
        else if (obj === Object(obj)) {
            return this.processDeserializeObject<T>(obj, type, options);

        }

        // when obj is a string and parseString is enabled
        else if (typeof obj === 'string' && options.parseString) {

            if (type === Number) {
                return <any>JsonConverterUtil.tryParseNumber(obj);

            } else if (type === Boolean) {
                return <any>JsonConverterUtil.tryParseBoolean(obj);
            }
        }

        return obj;
    }

    /**
     * Deserialize array
     * @param json
     * @param type
     * @param options
     */
    public processDeserializeArray<T>(json: any[], type: any, options: DeserializerOptions): T[] {
        const instance: T[] = [];

        json.forEach((entry, index) => {
            try {
                instance.push(<T>this.processDeserialize(entry, type, options));
            } catch (err) {
                const errorMessage = `(E30) error deserializing index <${index}>, type <${type.name}>`;
                throw new JsonConverterError(errorMessage, err);
            }
        });

        return instance;
    }

    /**
     * Deserialize enum
     * @param obj
     * @param options
     */
    public processDeserializeEnum(obj: any, options: EnumOptions): any {

        if (JsonConverterUtil.isNullOrUndefined(options.type[obj])) {
            const errorMessage = `(E31) error deserializing, enum value <${obj}> cannot be found`;
            throw new JsonConverterError(errorMessage);
        }

        if (typeof obj === 'number' || obj instanceof Number) {
            return obj;
        }

        return options.type[obj];
    }

    /**
     * Deserialize object
     * @param obj
     * @param type
     * @param options
     */
    public processDeserializeObject<T>(obj: any, type: any, options: DeserializerOptions): T {

        const typeMapping = JsonConverterMapper.getMappingForType(type);
        if (!typeMapping) {
            const errorMessage = `(E09) Cannot get mapping for <${type.name}>, this may occur when :\n`
                + '   -  decorator @jsonObject is missing\n';
            throw new JsonConverterError(errorMessage);
        }


        // when polymorphism is defined
        const discriminatorProperty = JsonConverterMapper.getDiscriminatorPropertyForTypeMapping(typeMapping);
        if (discriminatorProperty) {
            const discriminatorValue = obj[discriminatorProperty];
            const subTypes = JsonConverterMapper.listMappingForExtendingType(type);
            const subType = subTypes.find(m => m.options && m.options.discriminatorValue === discriminatorValue);

            if (!subType) {
                const errorMessage = `(E80) Polymorphism error : Cannot get subtype for <${type.name}> `
                    + `got only subtypes <${subTypes.map(t => t.options ? t.options.discriminatorValue : t.type.name).toString()}>`;
                throw new JsonConverterError(errorMessage);
            }

            return this.processDeserializeObject(obj, subType.type, options);
        }

        // new instance of type
        const instance = new typeMapping.type();

        // deserialize each property
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        properties.forEach(property => {
            try {
                JsonConverterUtil.validate(obj, property.serializedName, property.validators);
                instance[property.name] = this.deserialize(obj[property.serializedName], property.type, options);
            } catch (err) {
                const errorMessage = `(E32) error deserializing property <${property.name}>, type <${property.type.name}>`;
                throw new JsonConverterError(errorMessage, err);
            }
        });

        return instance;
    }
}