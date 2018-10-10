import {JsonCustomConverter} from "../../converter/JsonCustomConverter";
import {Pid} from "../models/Pid";
import {jsonCustomConverter} from "../../decorators/jsonCustomConverter";
import {JsonConverterUtil} from "../../JsonConverterUtil";

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

        return <Pid>{
            id: parseInt(obj, 10)
        };
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

    constructor() {
        super();
    }
}