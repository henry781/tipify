import {Plane} from "./Plane";
import {jsonObject} from "../../decorators/jsonObject";

@jsonObject({discriminatorValue: 'glider'})
export class Glider extends Plane {

}