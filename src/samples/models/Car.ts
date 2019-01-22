import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';
import {CarOptions} from './CarOptions';
import {Vehicle} from './Vehicle';

@jsonObject({discriminatorValue: 'car'})
export class Car extends Vehicle {

    @jsonProperty('brand', String)
    public _brand: string;

    constructor(options?: CarOptions) {
        super('car', options);

        if (options) {
            this._brand = options.brand;
        }
    }
}
