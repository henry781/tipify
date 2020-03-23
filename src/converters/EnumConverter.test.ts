import {expect} from 'chai';
import {JsonConverterError} from '../core/JsonConverterError';
import {Color} from '../samples/models/Color';
import {EnumConverter, EnumStrategy} from './EnumConverter';

describe('EnumConverter', () => {

    let enumConverter: EnumConverter;

    beforeEach(() => {
        enumConverter = new EnumConverter();
    });

    describe('deserialize', () => {

        it('should return enum value (case index)', () => {
            const result = enumConverter.deserialize(2, {type: Color, strategy: EnumStrategy.NAME});
            expect(result).equal(Color.BLUE);
        });

        it('should return enum value (cas name)', () => {
            const result = enumConverter.deserialize('RED', {type: Color, strategy: EnumStrategy.NAME});
            expect(result).equal(Color.RED);
        });

        it('when enum value cannot be found should throw an error', () => {
            expect(() => enumConverter.deserialize(20, {type: Color, strategy: EnumStrategy.NAME}))
                .throw(JsonConverterError, 'Enum value <20> cannot be found');
        });

        it('when enum value cannot be found should throw an error (2)', () => {
            expect(() => enumConverter.deserialize('ORANGE', {type: Color, strategy: EnumStrategy.NAME}))
                .throw(JsonConverterError, 'Enum value <ORANGE> cannot be found');
        });
    });

    describe('serialize', () => {

        it('should return enum as name', () => {
            const result = enumConverter.serialize(Color.BLUE, {type: Color, strategy: EnumStrategy.NAME});
            expect(result).equal('BLUE');
        });

        it('should return enum as index', () => {
            const result = enumConverter.serialize(Color.BLUE, {type: Color, strategy: EnumStrategy.INDEX});
            expect(result).equal(2);
        });

        it('when strategy is not defined should throw an error', () => {
            expect(() => enumConverter.serialize(Color.BLUE, {type: Color, strategy: undefined}))
                .throw(JsonConverterError, 'Enum strategy is not defined');
        });

        it('when enum value does not exist should throw an error', () => {
            expect(() => enumConverter.serialize(14, {type: Color, strategy: EnumStrategy.INDEX}))
                .throw(JsonConverterError, 'Enum value <14> cannot be found');
        });
    });
});
