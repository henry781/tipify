import {Gender} from "./Gender";
import {Pid} from "./Pid";

export interface PassengerOptions {
    pid?: Pid;
    gender?: Gender;
    name?: string;
    informations?: object
}