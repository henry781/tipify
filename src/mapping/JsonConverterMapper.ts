import {TypeMapping} from "./TypeMapping";
import {PropertyMapping} from "./PropertyMapping";

export class JsonConverterMapper {

    public static MAPPING: TypeMapping[] = [];

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
            this.MAPPING.push(typeMapping);
        }

        return typeMapping;
    }

    /**
     * Get mapping for type
     * @param type
     */
    public static getMappingForType(type: any): TypeMapping {
        return this.MAPPING.find(m => m.type === type);
    }

    /**
     * List mapping for extending type
     * @param type
     */
    public static listMappingForExtendingType(type: any): TypeMapping[] {
        return this.MAPPING.filter(m => m.type.prototype instanceof type);
    }

    /**
     * Get all properties for type mapping
     * @param typeMapping
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