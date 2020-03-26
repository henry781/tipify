import * as chai from 'chai';
import {JsonConverterMapper} from '../mapping/JsonConverterMapper';
import {jsonObject} from './jsonObject';

describe('jsonObject', () => {

    @jsonObject({discriminatorProperty: 'type'})
    class Location {
    }

    @jsonObject({discriminatorValue: 'city'})
    class City extends Location {
    }

    it('should create mapping for type', () => {
        const foundMapping = JsonConverterMapper.getMapping().find((m) => m.type === City);
        chai.expect(foundMapping).not.undefined;
    });

    it('should set args', () => {
        const foundMapping = JsonConverterMapper.getMapping().find((m) => m.type === City);
        chai.expect(foundMapping.options.discriminatorValue).equal('city');
    });

    it('should set parent', () => {
        const parentMapping = JsonConverterMapper.getMapping().find((m) => m.type === Location);
        const foundMapping = JsonConverterMapper.getMapping().find((m) => m.type === City);
        chai.expect(parentMapping).not.undefined;
        chai.expect(foundMapping.parent).equal(parentMapping);
    });

});
