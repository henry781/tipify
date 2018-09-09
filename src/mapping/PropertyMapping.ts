import {JsonValidator} from "../decorators/jsonProperty";

export interface PropertyMapping {
    name: string;
    serializedName: string;
    type?: any;
    validators: JsonValidator[];
}