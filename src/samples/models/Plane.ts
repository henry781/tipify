import {jsonObject} from '../../decorators/jsonObject';
import {Vehicle} from './Vehicle';

@jsonObject()
export abstract class Plane extends Vehicle {

}
