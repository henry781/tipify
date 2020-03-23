import {arrayOf} from '../../converters/arrayConverter';
import {enumOf, EnumStrategy} from '../../converters/enumConverter';
import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {Color} from './Color';
import {Passenger} from './Passenger';

@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type')
    public _type: string;

    @jsonProperty('id')
    public _id: number;

    @jsonProperty('name')
    public _name: string;

    @jsonProperty('passengers', arrayOf(Passenger))
    public _passengers: Passenger[];

    @jsonProperty('color', enumOf(Color, EnumStrategy.NAME))
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

export interface VehicleOptions {
    id?: number;
    name?: string;
    passengers?: Passenger[];
    color?: Color;
}
