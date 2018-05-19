import {Passenger} from "./Passenger";
import {Color} from "./Color";

export interface VehicleOptions {
    id?: number;
    name?: string;
    passengers?: Passenger[];
    color?: Color
}