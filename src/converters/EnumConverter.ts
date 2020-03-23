import {JsonConverterError} from '../core/JsonConverterError';
import {customConverter} from '../decorators/customConverter';
import {isNullOrUndefined, isNumber} from '../util/commonUtil';
import {ConverterWithOptions, CustomConverter, CustomConverterOptions} from './CustomConverter';

type StringOrNumber = string | number;

@customConverter()
export class EnumConverter extends CustomConverter<StringOrNumber, EnumJsonConverterOptions> {

    public deserialize(json: any, options: EnumJsonConverterOptions): StringOrNumber {

        if (isNullOrUndefined(options.type[json])) {
            const errorMessage = `Enum value <${json}> cannot be found in [${Object.keys(options.type)}]`;
            throw new JsonConverterError(errorMessage);
        }

        if (isNumber(json)) {
            return json;
        }

        return options.type[json];
    }

    public serialize(obj: StringOrNumber, options: EnumJsonConverterOptions): any {

        if (isNullOrUndefined(options.type[obj])) {
            const errorMessage = `Enum value <${obj}> cannot be found`;
            throw new JsonConverterError(errorMessage);
        }

        if (options.strategy === EnumStrategy.INDEX) {
            return obj;

        } else if (options.strategy === EnumStrategy.NAME) {
            return options.type[obj];

        } else {
            const errorMessage = 'Enum strategy is not defined';
            throw new JsonConverterError(errorMessage);
        }
    }
}

export enum EnumStrategy {
    INDEX,
    NAME,
}

interface EnumJsonConverterOptions extends CustomConverterOptions {
    type: Enum;
    strategy: EnumStrategy;
}

interface Enum {
    [key: number]: string | number;
}

export function enumOf(type: Enum, strategy = EnumStrategy.NAME): ConverterWithOptions {
    return {converter: EnumConverter, options: {type, strategy}};
}
