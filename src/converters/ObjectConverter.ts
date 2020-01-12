import {JsonConverterError} from '../core/JsonConverterError';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {Instantiable, isObject} from '../util/JsonConverterUtil';
import {CustomConverter} from './CustomConverter';

export class ObjectConverter extends CustomConverter<any, ObjectJsonConverterOptions> {

    public deserialize<T>(json: any, options: ObjectJsonConverterOptions): T {

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

        // deserialize each property
        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        properties.forEach((property) => {
            try {
                instance[property.name] = this.converter.deserialize(json[property.serializedName], property.converterDefinition);
            } catch (err) {
                const errorMessage = `Fail to deserialize property <${property.serializedName}>`;
                throw new JsonConverterError(errorMessage, property.serializedName, err);
            }
        });
        return instance;
    }

    public serialize<T>(obj: T, options: ObjectJsonConverterOptions): any {

        const typeMapping = JsonConverterMapper.getMappingForType(obj.constructor);
        if (!typeMapping) {
            const errorMessage = `Cannot get mapping <${obj.constructor.name}>, `
                + 'this may occur when decorator @jsonObject is missing';
            throw new JsonConverterError(errorMessage);
        }

        const properties = JsonConverterMapper.getAllPropertiesForTypeMapping(typeMapping);

        const instance: any = {};

        // serialize each property
        properties.forEach((property) => {
            try {
                const value = this.converter.serialize(obj[property.name], property.converterDefinition);
                if (value !== undefined && value !== null) {
                    instance[property.serializedName] = value;
                }
            } catch (err) {
                const errorMessage = `Fail to serialize property <${property.serializedName}>`;
                throw new JsonConverterError(errorMessage, property.serializedName, err);
            }
        });

        return instance;
    }
}

export interface ObjectJsonConverterOptions {
    type?: Instantiable<any>;
}
