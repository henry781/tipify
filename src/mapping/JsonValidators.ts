export type JsonValidator = (value: any) => boolean;

export class JsonValidators {

    public static required: JsonValidator = (value: any) => value !== null;

}