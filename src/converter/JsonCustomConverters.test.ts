import * as chai from 'chai';
import {JsonCustomConverter} from './JsonCustomConverter';
import {JsonCustomConverters} from './JsonCustomConverters';

describe('JsonCustomConverters', () => {

    class DateConverter extends JsonCustomConverter<Date> {

        constructor() {
            super();
        }
        public deserialize(obj: any): Date {
            return undefined;
        }

        public serialize(obj: Date): any {
        }
    }

    /**
     * Instantiate converter
     */
    describe('instantiateConverter', () => {

        it('should instantiate DateConverter', () => {

            JsonCustomConverters.instantiateConverter(DateConverter);
            const foundConverter = JsonCustomConverters.CONVERTERS.find((c) => c instanceof DateConverter);

            chai.expect(foundConverter).not.undefined;
        });

        it('should not instantiate DateConverter 2 times', () => {

            JsonCustomConverters.instantiateConverter(DateConverter);
            JsonCustomConverters.instantiateConverter(DateConverter);

            const foundConverters = JsonCustomConverters.CONVERTERS.filter((c) => c instanceof DateConverter);

            chai.expect(foundConverters).length(1);
        });
    });

    /**
     * Get converter instance
     */
    describe('getConverterInstance', () => {

        it('should return DateConverter instance', () => {

            const foundConverter = JsonCustomConverters.getConverterInstance(DateConverter);

            chai.expect(foundConverter).not.undefined;
            chai.expect(foundConverter).is.instanceOf(DateConverter);
        });
    });
});
