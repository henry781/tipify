import {any} from '../../converters/anyConverter';
import {enumOf, EnumStrategy} from '../../converters/enumConverter';
import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {pidConverter} from '../converter/pidConverter';
import {Gender} from './Gender';
import {Pid} from './Pid';

@jsonObject()
export class Passenger {

    @jsonProperty('pid', pidConverter)
    public _pid: Pid;

    @jsonProperty('gender', enumOf(Gender, EnumStrategy.NAME))
    public _gender: Gender;

    @jsonProperty('name')
    public _name: string;

    @jsonProperty('informations', any())
    public _informations: object;

    constructor(options?: PassengerOptions) {
        if (options) {
            this._pid = options.pid;
            this._gender = options.gender;
            this._name = options.name;
            this._informations = options.informations;
        }
    }
}

export interface PassengerOptions {
    pid?: Pid;
    gender?: Gender;
    name?: string;
    informations?: object;
}
