export class JsonConverterError extends Error {

    public parent: Error;

    constructor(message: string, parent?: JsonConverterError) {
        super(message);
        this.parent = parent;
    }

    public toString(): string {
        let message = this.message;

        if (this.parent) {
            message = message + '\n' + this.parent.toString();
        }

        return message;
    }
}