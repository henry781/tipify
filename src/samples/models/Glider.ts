import {jsonObject} from '../../decorators/jsonObject';
import {Plane} from './Plane';

@jsonObject({discriminatorValue: 'glider'})
export class Glider extends Plane {

}
