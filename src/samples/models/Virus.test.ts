import {expect} from 'chai';
import {JsonConverter} from '../../core/JsonConverter';
import {Virus} from './Virus';

describe('Virus', () => {

    describe('deserialize', () => {

        it('should not keep default value', () => {
            const converter = new JsonConverter({
                deserialize: {keepObjectFieldValues: true},
                serialize: {unsafe: true},
            });

            const json = {name: 'flu'};
            expect(converter.deserialize<Virus>(json, Virus)._name).equal('flu');
        });

        it('should keep default value when keepObjectFieldValues=true', () => {
            const converter = new JsonConverter({
                deserialize: {keepObjectFieldValues: true},
                serialize: {unsafe: true},
            });

            const json = {};
            expect(converter.deserialize<Virus>(json, Virus)._name).equal('coronavirus');
        });

        it('should not keep default value when keepObjectFieldValues=false', () => {
            const converter = new JsonConverter({
                deserialize: {keepObjectFieldValues: false},
                serialize: {unsafe: true},
            });

            const json = {};
            expect(converter.deserialize<Virus>(json, Virus)._name).to.be.undefined;
        });
    });
});
