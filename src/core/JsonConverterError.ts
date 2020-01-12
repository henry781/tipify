export class JsonConverterError extends Error {

    private segment: string | number;
    private parent: Error;

    constructor(message: string, segment?: string | number, parent?: Error) {
        super(message);
        this.segment = segment;
        this.parent = parent;
        Object.setPrototypeOf(this, JsonConverterError.prototype);
    }
}
