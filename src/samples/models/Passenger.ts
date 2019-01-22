import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {Any} from '../../type/Any';
import {Enum, EnumStrategy} from '../../type/Enum';
import {PidConverter} from '../converter/PidConverter';
import {Gender} from './Gender';
import {PassengerOptions} from './PassengerOptions';
import {Pid} from './Pid';

@jsonObject()
export class Passenger {

    @jsonProperty('pid', PidConverter)
    public _pid: Pid;

    @jsonProperty('gender', Enum(Gender, EnumStrategy.NAME))
    public _gender: Gender;

    @jsonProperty('name', String)
    public _name: string;

    @jsonProperty('informations', Any)
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
