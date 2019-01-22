import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {JsonValidators} from '../../mapping/JsonValidators';
import {Enum, EnumStrategy} from '../../type/Enum';
import {Color} from './Color';
import {Passenger} from './Passenger';
import {VehicleOptions} from './VehicleOptions';

@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String, [JsonValidators.required])
    public _type: string;

    @jsonProperty('id', Number, [JsonValidators.required])
    public _id: number;

    @jsonProperty('name', String, [JsonValidators.required])
    public _name: string;

    @jsonProperty('passengers', [Passenger])
    public _passengers: Passenger[];

    @jsonProperty('color', Enum(Color, EnumStrategy.NAME))
    public _color: Color;

    protected constructor(type?: string, options?: VehicleOptions) {
        this._type = type;

        if (options) {
            this._id = options.id;
            this._name = options.name;
            this._passengers = options.passengers;
            this._color = options.color;
        }
    }
}
