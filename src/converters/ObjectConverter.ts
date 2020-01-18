import {SerializeOptions} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {AbstractType, Instantiable, isNullOrUndefined, isObject} from '../util/CommonUtil';
import {CustomConverter} from './CustomConverter';

export class ObjectConverter extends CustomConverter<any, ObjectConverterOptions> {

    public deserialize<T>(json: any, options: ObjectConverterOptions): T {

        if (!isObject(json)) {
            const errorMessage = `Cannot deserialize to <${options.type.name}>, given json is not an object`;
            throw new JsonConverterError(errorMessage);
        }

        const typeMapping = JsonConverterMapper.getMappingForType(options.type);
        if (!typeMapping) {
            const errorMessage = `Cannot get mapping <${options.type.name}>, `
                + 'this may occur when decorator @jsonObject is missing';
            throw new JsonConverterError(errorMessage);
        }

        // when polymorphism is defined
        const discriminatorProperty = JsonConverterMapper.getDiscriminatorPropertyForTypeMapping(typeMapping);
        if (discriminatorProperty) {
            const discriminatorValue = json[discriminatorProperty];
            const subTypes = JsonConverterMapper.listMappingForExtendingType(options.type);
            const subType = subTypes.find((m) => m.options && m.options.discriminatorValue === discriminatorValue);

            if (!subType) {
                const errorMessage = `Polymorphism error : Cannot get subtype for <${options.type.name}> `
                    + `got only subtypes <${subTypes.map((t) => t.options ? t.options.discriminatorValue : t.type.name).toString()}>`;
                throw new JsonConverterError(errorMessage);
            }

            return this.deserialize(json, {type: subType.type});
        }

        // new instance of type
        const instance = new typeMapping.type();

        // processDeserialize each property
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        properties.forEach((property) => {
            try {
                if (!this.converter.options.keepObjectFieldValues || json.hasOwnProperty(property.serializedName)) {
                    instance[property.name] = this.converter.processDeserialize(
                        json[property.serializedName],
                        property.converterWithOptions);
                }
            } catch (err) {
                const errorMessage = `Fail to deserialize property <${property.serializedName}>`;
                throw new JsonConverterError(errorMessage, property.serializedName, err);
            }
        });
        return instance;
    }

    public serialize<T>(obj: T, converter: ObjectConverterOptions, serializeOptions: SerializeOptions): any {

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
                    const value = this.converter.processSerialize(obj[property.name], property.converterWithOptions);
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
                    const value = this.converter.processSerialize(obj[property], undefined, serializeOptions);
                    if (!isNullOrUndefined(value)) {
                        instance[property] = value;
                    }
                } catch (err) {
                    const errorMessage = `Fail to serialize property <${property}>`;
                    throw new JsonConverterError(errorMessage, property, err);
                }
            });
        }

        return instance;
    }
}

export interface ObjectConverterOptions {
    type?: Instantiable<any> | AbstractType<any>;
}
