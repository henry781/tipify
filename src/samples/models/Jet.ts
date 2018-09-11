import {Plane} from "./Plane";
import {jsonObject} from "../../decorators/jsonObject";

@jsonObject({discriminatorValue: 'jet'})
export class Jet extends Plane {

}