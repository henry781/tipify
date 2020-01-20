import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {Vehicle, VehicleOptions} from './Vehicle';

@jsonObject({discriminatorValue: 'car'})
export class Car extends Vehicle {

    @jsonProperty('brand')
    public _brand: string;

    constructor(options?: CarOptions) {
        super('car', options);

        if (options) {
            this._brand = options.brand;
        }
    }
}

export interface CarOptions extends VehicleOptions {
    brand?: string;
}
