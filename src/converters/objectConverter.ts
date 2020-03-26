import {CustomConverter} from '../core/CustomConverter';
import {DeserializeOptions, SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {AbstractType, Instantiable, isNullOrUndefined, isObject} from '../util/commonUtil';
import {autodetectConverterAndArgs} from '../util/jsonConverterUtil';

type ObjectConverter = CustomConverter<any, ObjectConverterArgs>;

export const objectConverter: ObjectConverter = {

    deserialize<T>(json: any,
                   args: ObjectConverterArgs,
                   deserializeOptions: DeserializeOptions): T {

        if (isNullOrUndefined(json)) {
            return json;
        }

        if (!isObject(json)) {
            const errorMessage = `Cannot deserialize to <${args.type.name}>, given json is not an object`;
            throw new JsonConverterError(errorMessage);
        }

        const typeMapping = JsonConverterMapper.getMappingForType(args.type);
        if (!typeMapping) {
            const errorMessage = `Cannot get mapping <${args.type.name}>, `
                + 'this may occur when decorator @jsonObject is missing';
            throw new JsonConverterError(errorMessage);
        }

        // when polymorphism is defined
        const discriminatorProperty = JsonConverterMapper.getDiscriminatorPropertyForTypeMapping(typeMapping);
        if (discriminatorProperty) {
            const discriminatorValue = json[discriminatorProperty];
            const subTypes = JsonConverterMapper.listMappingForExtendingType(args.type);
            const subType = subTypes.find((m) => m.options && m.options.discriminatorValue === discriminatorValue);

            if (!subType) {
                const errorMessage = `Polymorphism error : Cannot get subtype for <${args.type.name}> `
                    + `got only subtypes <${subTypes.map((t) => t.options ? t.options.discriminatorValue : t.type.name).toString()}>`;
                throw new JsonConverterError(errorMessage);
            }

            return this.deserialize(json, {type: subType.type}, deserializeOptions);
        }

        // new instance of type
        const instance = new typeMapping.type();

        // processDeserialize each property
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        properties.forEach((property) => {
            try {
                if (!deserializeOptions.keepObjectFieldValues || json.hasOwnProperty(property.serializedName)) {
                    instance[property.name] = property.converter.deserialize(
                        json[property.serializedName],
                        property.args,
                        deserializeOptions);
                }
            } catch (err) {
                const errorMessage = `Fail to deserialize property <${property.serializedName}>`;
                throw new JsonConverterError(errorMessage, property.serializedName, err);
            }
        });
        return instance;
    },

    serialize<T>(obj: T,
                 args: ObjectConverterArgs,
                 serializeOptions: SerializeOptions): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        const typeMapping = JsonConverterMapper.getMappingForType(obj.constructor);
        const instance: any = {};

        if (!typeMapping && !serializeOptions.unsafe) {
            const errorMessage = `Cannot get mapping <${obj.constructor.name}>, `
                + 'this may occur when decorator @jsonObject is missing';
            throw new JsonConverterError(errorMessage);
        }

        if (typeMapping) {
            const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

            properties.forEach((property) => {
                try {
                    const value = property.converter.serialize(obj[property.name], property.args, serializeOptions);
                    if (!isNullOrUndefined(value)) {
                        instance[property.serializedName] = value;
                    }
                } catch (err) {
                    const errorMessage = `Fail to serialize property <${property.serializedName}>`;
                    throw new JsonConverterError(errorMessage, property.serializedName, err);
                }
            });

        } else {

            Object.keys(obj).forEach((property) => {
                try {
                    if (!isNullOrUndefined(obj[property])) {
                        const converterAndArgs = autodetectConverterAndArgs(obj[property]);
                        const value = converterAndArgs.converter.serialize(obj[property], converterAndArgs.args, serializeOptions);
                        if (!isNullOrUndefined(value)) {
                            instance[property] = value;
                        }
                    }
                } catch (err) {
                    const errorMessage = `Fail to serialize property <${property}>`;
                    throw new JsonConverterError(errorMessage, property, err);
                }
            });
        }

        return instance;
    },
};

export interface ObjectConverterArgs {
    type?: Instantiable<any> | AbstractType<any>;
}
