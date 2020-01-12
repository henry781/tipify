export class JsonConverterError extends Error {

    private path: Array<string | number> = [];

    constructor(message: string, error?: Error, segment?: string | number) {
        super(error ? message + '\n caused by : ' + error.message : message);

        if (error && error instanceof JsonConverterError) {
            this.path = segment !== undefined ? [segment, ...error.path] : error.path;
        }

        Object.setPrototypeOf(this, JsonConverterError.prototype);
    }
}
