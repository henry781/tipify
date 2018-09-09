import {JsonValidator} from "./JsonValidators";

export interface PropertyMapping {
    name: string;
    serializedName: string;
    type?: any;
    validators: JsonValidator[];
}