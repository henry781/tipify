export enum EnumStrategy {
    INDEX,
    NAME,
    INDEX_COMPATIBLE,
    NAME_COMPATIBLE
}

export function Enum(type: any, strategy?: EnumStrategy) {
    return new EnumOptions(type, strategy);
}

export class EnumOptions {

    public type: any;
    public strategy: EnumStrategy;

    constructor(type: any, strategy?: EnumStrategy) {
        this.type = type;
        this.strategy = strategy ? strategy : EnumStrategy.INDEX_COMPATIBLE;
    }
}