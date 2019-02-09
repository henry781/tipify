export function JsonConverterError(message: string, parent?: Error) {

    this.message = message;
    this.parent = parent;

    this.toString = function(): string {
        let m = this.message;

        if (this.parent) {
            m = m + '\n' + this.parent.toString();
        }

        return m;
    };
}

JsonConverterError.prototype = Object.create(Error.prototype, {
    constructor: {
        configurable: true,
        value: JsonConverterError,
        writable: true,
    },
});
