import {CustomConverter, CustomConverterArgs} from '../../core/CustomConverter';
import {isNullOrUndefined} from '../../util/commonUtil';
import {Pid} from '../models/Pid';

export const pidConverter: CustomConverter<Pid, CustomConverterArgs> = {

    deserialize(obj: any): Pid {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return {
            id: parseInt(obj, 10),
        } as Pid;
    },

    serialize(obj: Pid): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return obj.id;
    },
};
