export class JsonConverterError extends Error {

    public parent: Error;

    constructor(message: string, parent?: JsonConverterError) {
        super(message);
        this.parent = parent;
    }
}