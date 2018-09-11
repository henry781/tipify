import {Vehicle} from "./Vehicle";
import {jsonObject} from "../../decorators/jsonObject";

@jsonObject()
export abstract class Plane extends Vehicle {

}