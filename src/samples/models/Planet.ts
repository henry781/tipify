import {arrayOf} from '../../converters/ArrayConverter';
import {mapOf} from '../../converters/MapConverter';
import {jsonObject} from '../../decorators/jsonObject';
import {jsonProperty} from '../../decorators/jsonProperty';

@jsonObject()
export class Planet {

    @jsonProperty('seas', mapOf(String, Number))
    private readonly _seas: { [name: string]: number };

    @jsonProperty('seasCoordinates', mapOf(String, arrayOf(Number)))
    private readonly _seasCoordinates: { [name: string]: number[] };

    get seas(): { [p: string]: number } {
        return this._seas;
    }

    get seasCoordinates(): { [p: string]: number[] } {
        return this._seasCoordinates;
    }

    constructor(options?: PlanetOptions) {
        if (options) {
            this._seas = options.seas;
            this._seasCoordinates = options.seasCoordinates;
        }
    }
}

interface PlanetOptions {
    seas: { [name: string]: number };
    seasCoordinates: { [name: string]: number[] };
}
