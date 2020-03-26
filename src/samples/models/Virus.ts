import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';

@jsonObject()
export class Virus {
    @jsonProperty('name', String)
    public _name = 'coronavirus';
}
