import {JsonCustomConverter} from '../../converter/JsonCustomConverter';
import {jsonCustomConverter} from '../../decorators/jsonCustomConverter';
import {JsonConverterUtil} from '../../JsonConverterUtil';
import {Pid} from '../models/Pid';

@jsonCustomConverter()
export class PidConverter extends JsonCustomConverter<Pid> {

    /**
     * Deserialize
     * @param obj
     */
    public deserialize(obj: any): Pid {

        if (JsonConverterUtil.isNullOrUndefined(obj)) {
            return obj;
        }

        return {
            id: parseInt(obj, 10),
        } as Pid;
    }

    /**
     * Serialize
     * @param obj
     */
    public serialize(obj: Pid): any {

        if (JsonConverterUtil.isNullOrUndefined(obj)) {
            return obj;
        }

        return obj.id;
    }
}
