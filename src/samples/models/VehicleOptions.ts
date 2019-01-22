import {Color} from './Color';
import {Passenger} from './Passenger';

export interface VehicleOptions {
    id?: number;
    name?: string;
    passengers?: Passenger[];
    color?: Color;
}
