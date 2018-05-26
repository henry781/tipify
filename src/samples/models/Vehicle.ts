import {jsonObject} from "../../decorators/jsonObject";
import {jsonProperty} from "../../decorators/jsonProperty";
import {Passenger} from "./Passenger";
import {Color} from "./Color";
import {VehicleOptions} from "./VehicleOptions";
import {Enum, EnumStrategy} from "../../type/Enum";

@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String)
    public _type: string;

    @jsonProperty('id', Number)
    public _id: number;

    @jsonProperty('name', String)
    public _name: string;

    @jsonProperty('passengers', [Passenger])
    public _passengers: Passenger[];

    @jsonProperty('color', Enum(Color, EnumStrategy.NAME))
    public _color: Color;

    constructor(type?: string, options?: VehicleOptions) {
        this._type = type;

        if (options) {
            this._id = options.id;
            this._name = options.name;
            this._passengers = options.passengers;
            this._color = options.color;
        }
    }
}