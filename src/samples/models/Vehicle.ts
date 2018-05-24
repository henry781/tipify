import {jsonObject} from "../../decorators/jsonObject";
import {jsonProperty} from "../../decorators/jsonProperty";
import {Passenger} from "./Passenger";
import {Color} from "./Color";
import {VehicleOptions} from "./VehicleOptions";
import {Enum, EnumStrategy} from "../../type/Enum";

@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String)
    private _type: string;

    @jsonProperty('id', Number)
    private _id: number;

    @jsonProperty('name', String)
    private _name: string;

    @jsonProperty('passengers', [Passenger])
    private _passengers: Passenger[];

    @jsonProperty('color', Enum(Color, EnumStrategy.NAME))
    private _color: Color;

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