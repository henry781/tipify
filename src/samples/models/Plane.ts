import {Vehicle} from "./Vehicle";
import {jsonObject} from "../../decorators/jsonObject";

@jsonObject({discriminatorValue: 'plane'})
export class Plane extends Vehicle {

}