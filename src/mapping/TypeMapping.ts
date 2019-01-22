import {JsonObjectOptions} from '../decorators/JsonObjectOptions';
import {PropertyMapping} from './PropertyMapping';

export interface TypeMapping {
    type: any;
    options?: JsonObjectOptions;
    properties: PropertyMapping[];
    parent?: TypeMapping;
}
