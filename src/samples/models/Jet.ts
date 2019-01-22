import {jsonObject} from '../../decorators/jsonObject';
import {Plane} from './Plane';

@jsonObject({discriminatorValue: 'jet'})
export class Jet extends Plane {

}
