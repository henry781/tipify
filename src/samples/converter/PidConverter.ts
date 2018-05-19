import {JsonCustomConverter} from "../../converter/JsonCustomConverter";
import {Pid} from "../models/Pid";
import {jsonCustomConverter} from "../../decorators/JsonCustomConverter";

@jsonCustomConverter()
export class PidConverter implements JsonCustomConverter<Pid> {

    public deserialize(obj: any): Pid {
        return undefined;
    }

    public serialize(obj: Pid): any {
        return undefined;
    }
}