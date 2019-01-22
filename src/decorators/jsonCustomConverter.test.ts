import * as chai from 'chai';
import {JsonCustomConverter} from '../converter/JsonCustomConverter';
import {JsonCustomConverters} from '../converter/JsonCustomConverters';
import {jsonCustomConverter} from './jsonCustomConverter';

describe('jsonCustomConverter', () => {

    @jsonCustomConverter()
    class DayConverter implements JsonCustomConverter<string> {
        public deserialize(obj: any): string {
            return undefined;
        }

        public serialize(obj: string): any {
        }
    }

    it('should instantiate DayConverter', () => {
        const foundConverter = JsonCustomConverters.CONVERTERS.find((c) => c instanceof DayConverter);
        chai.expect(foundConverter).not.undefined;
    });
});
