import {jsonObject} from "../../decorators/jsonObject";
import {Pid} from "./Pid";
import {jsonProperty} from "../../decorators/jsonProperty";
import {PidConverter} from "../converter/PidConverter";
import {Gender} from "./Gender";
import {Enum, EnumStrategy} from "../../type/Enum";
import {Any} from "../../type/Any";
import {PassengerOptions} from "./PassengerOptions";

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