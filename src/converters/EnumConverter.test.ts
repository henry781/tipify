import * as chai from "chai";
import {createStubInstance} from 'sinon';
import {JsonConverter} from '../core/JsonConverter';
import {JsonConverterError} from '../core/JsonConverterError';
import {Color} from '../samples/models/Color';
import {EnumConverter} from './EnumConverter';

describe('EnumConverter', () => {

    let converter;
    let enumConverter: EnumConverter;

    beforeEach(() => {
        converter = createStubInstance(JsonConverter);
        enumConverter = new EnumConverter(converter);
    });

    describe('deserialize', () => {

        it('should return enum value (case index)', () => {
            const result = converter.processDeserializeEnum(2, Enum(Color));
            chai.expect(result).equal(Color.BLUE);
        });

        it('should return enum value (cas name)', () => {
            const result = converter.processDeserializeEnum('RED', Enum(Color));
            chai.expect(result).equal(Color.RED);
        });

        it('should throw error E31 when enum value cannot be found (1)', () => {
            chai.expect(() => converter.processDeserializeEnum(20, Enum(Color)))
                .throw(JsonConverterError, 'E31');
        });

        it('should throw error E31 when enum value cannot be found (2)', () => {
            chai.expect(() => converter.processDeserializeEnum('ORANGE', Enum(Color)))
                .throw(JsonConverterError, 'E31');
        });
    });

    describe('serialize', () => {

        it('should return enum as name', () => {
            const result = (converter as any).processSerializeEnum(Color.BLUE, Enum(Color, EnumStrategy.NAME));
            chai.expect(result).equal('BLUE');
        });

        it('should return enum as index', () => {
            const result = (converter as any).processSerializeEnum(Color.BLUE, Enum(Color, EnumStrategy.INDEX));
            chai.expect(result).equal(2);
        });

        it('should throw error E12 when strategy is not defined', () => {
            const options = new EnumOptions(Color);
            options.strategy = undefined;
            chai.expect(() => (converter as any).processSerializeEnum(Color.BLUE, options))
                .throw(JsonConverterError, 'E12');
        });

        it('should throw error E10 when enum value does not exist (1)', () => {
            chai.expect(() => (converter as any).processSerializeEnum(14, Enum(Color, EnumStrategy.INDEX)))
                .throw(JsonConverterError, 'E10');
        });
    });
});
