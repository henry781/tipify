import {TypeMapping} from "./TypeMapping";
import {PropertyMapping} from "./PropertyMapping";

const JSONCONVERTER_MAPPING = Symbol.for('tipify.mapping');

const globalSymbols = Object.getOwnPropertySymbols(global);
const mappingInitialized = (globalSymbols.indexOf(JSONCONVERTER_MAPPING) > -1);

if (!mappingInitialized) {
    global[JSONCONVERTER_MAPPING] = [];
}

export class JsonConverterMapper {

    public static getMapping(): TypeMapping[] {
        return global[JSONCONVERTER_MAPPING];
    }

    /**
     * Create mapping for type
     * @param type
     */
    public static createMappingForType(type: any): TypeMapping {

        let typeMapping = this.getMappingForType(type);

        if (!typeMapping) {
            typeMapping = {
                type: type,
                properties: []
            };
            this.getMapping().push(typeMapping);
        }

        return typeMapping;
    }

    /**
     * Get mapping for type
     * @param type
     */
    public static getMappingForType(type: any): TypeMapping {
        return this.getMapping().find(m => m.type === type);
    }

    /**
     * List mapping for extending type
     * @param type
     */
    public static listMappingForExtendingType(type: any): TypeMapping[] {
        return this.getMapping().filter(m => m.type.prototype instanceof type);
    }

    /**
     * Get discriminator property for type mapping
     * @param {TypeMapping} typeMapping
     * @returns {string}
     */
    public static getDiscriminatorPropertyForTypeMapping(typeMapping: TypeMapping): string {

        if (typeMapping.options && typeMapping.options.discriminatorValue) {
            return;
        }

        let current = typeMapping;

        do {
            if (current.options && current.options.discriminatorProperty) {
                return current.options.discriminatorProperty;
            }

            current = current.parent;
        } while (current);
    }

    /**
     * Get all properties for type mapping
     * @param {TypeMapping} typeMapping
     * @returns {PropertyMapping[]}
     */
    public static getAllPropertiesForTypeMapping(typeMapping: TypeMapping): PropertyMapping[] {

        const properties: PropertyMapping[] = [];

        let current = typeMapping;

        do {
            current.properties.forEach(property => {
                if (!properties.some(p => p.name === property.name)) {
                    properties.push(property);
                }
            });

            current = current.parent;
        } while (current);

        return properties;
    }
}