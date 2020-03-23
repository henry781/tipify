import {ConverterAndArgs, CustomConverter, CustomConverterArgs} from '../core/CustomConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {isNullOrUndefined, isNumber} from '../util/commonUtil';

type StringOrNumber = string | number;

type EnumConverter = CustomConverter<StringOrNumber, EnumJsonConverterArgs>;

export const enumConverter: EnumConverter = {

    deserialize(json: any, args: EnumJsonConverterArgs): StringOrNumber {

        if (isNullOrUndefined(json)) {
            return json;
        }

        if (isNullOrUndefined(args.type[json])) {
            const errorMessage = `Enum value <${json}> cannot be found in [${Object.keys(args.type)}]`;
            throw new JsonConverterError(errorMessage);
        }

        if (isNumber(json)) {
            return json;
        }

        return args.type[json];
    },

    serialize(obj: StringOrNumber, args: EnumJsonConverterArgs): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        if (isNullOrUndefined(args.type[obj])) {
            const errorMessage = `Enum value <${obj}> cannot be found`;
            throw new JsonConverterError(errorMessage);
        }

        if (args.strategy === EnumStrategy.INDEX) {
            return obj;

        } else if (args.strategy === EnumStrategy.NAME) {
            return args.type[obj];

        } else {
            const errorMessage = 'Enum strategy is not defined';
            throw new JsonConverterError(errorMessage);
        }
    },
};

export enum EnumStrategy {
    INDEX,
    NAME,
}

interface EnumJsonConverterArgs extends CustomConverterArgs {
    type: Enum;
    strategy: EnumStrategy;
}

interface Enum {
    [key: number]: string | number;
}

export function enumOf(type: Enum, strategy = EnumStrategy.NAME): ConverterAndArgs {
    return {converter: enumConverter, args: {type, strategy} as EnumJsonConverterArgs};
}
