import {jsonObject} from "../../decorators/JsonObject";
import {Pid} from "./Pid";
import {jsonProperty} from "../../decorators/JsonProperty";
import {PidConverter} from "../converter/PidConverter";
import {Gender} from "./Gender";
import {Enum, EnumStrategy} from "../../type/Enum";
import {Any} from "../../type/Any";
import {PassengerOptions} from "./PassengerOptions";

@jsonObject()
export class Passenger {

    @jsonProperty('pid', PidConverter)
    private _pid: Pid;

    @jsonProperty('gender', Enum(Gender, EnumStrategy.INDEX_COMPATIBLE))
    private _gender: Gender;

    @jsonProperty('name', String)
    private _name: string;

    @jsonProperty('informations', Any)
    private _informations: object;

    constructor(options?: PassengerOptions) {
        if (options) {
            this._pid = options.pid;
            this._gender = options.gender;
            this._name = options.name;
            this._informations = options.informations;
        }
    }
}