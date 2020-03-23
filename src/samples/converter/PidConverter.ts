import {CustomConverter, CustomConverterOptions} from '../../converters/CustomConverter';
import {customConverter} from '../../decorators/customConverter';
import {isNullOrUndefined} from '../../util/commonUtil';
import {Pid} from '../models/Pid';

@customConverter()
export class PidConverter extends CustomConverter<Pid, CustomConverterOptions> {

    public deserialize(obj: any, options: CustomConverterOptions): Pid {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return {
            id: parseInt(obj, 10),
        } as Pid;
    }

    public serialize(obj: Pid, options: CustomConverterOptions): any {

        if (isNullOrUndefined(obj)) {
            return obj;
        }

        return obj.id;
    }
}
