import {PropertyMapping} from "./PropertyMapping";
import {JsonObjectOptions} from "../decorators/JsonObjectOptions";

export interface TypeMapping {
    type: any;
    options?: JsonObjectOptions;
    properties: PropertyMapping[];
    parent?: TypeMapping;
}