import {JsonCustomConverter} from "../converter/JsonCustomConverter";
import {jsonCustomConverter} from "./jsonCustomConverter";
import {JsonCustomConverters} from "../converter/JsonCustomConverters";
import * as chai from 'chai';

describe('jsonCustomConverter', () => {

    @jsonCustomConverter()
    class DayConverter implements JsonCustomConverter<String> {
        public deserialize(obj: any): String {
            return undefined;
        }

        public serialize(obj: String): any {
        }
    }

    it('should instantiate DayConverter', () => {
        const foundConverter = JsonCustomConverters.CONVERTERS.find(c => c instanceof DayConverter);
        chai.expect(foundConverter).not.undefined;
    });
});