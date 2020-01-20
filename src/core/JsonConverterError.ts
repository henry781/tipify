export class JsonConverterError extends Error {

    public segment: string | number;
    public parent: Error;

    constructor(message: string, segment?: string | number, parent?: Error) {
        super(message);
        this.segment = segment;
        this.parent = parent;
        Object.setPrototypeOf(this, JsonConverterError.prototype);
    }
}
