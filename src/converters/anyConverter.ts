import {ConverterAndArgs, CustomConverter} from '../core/CustomConverter';

export const anyConverter: CustomConverter = {

    deserialize(json: any): any {
        return deepCopy(json);
    },

    serialize(obj: any): any {
        return deepCopy(obj);
    },
};

export function any(): ConverterAndArgs {
    return {converter: anyConverter};
}

function deepCopy(a: any) {
    // TODO: to implement
    return a;
}
