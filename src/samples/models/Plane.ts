import {Vehicle} from "./Vehicle";
import {jsonObject} from "../../decorators/JsonObject";

@jsonObject({discriminatorValue: 'plane'})
export class Plane extends Vehicle {

}