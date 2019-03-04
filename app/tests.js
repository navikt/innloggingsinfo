/* eslint-env mocha */
/* eslint-disable max-len */
import 'babel-polyfill'; // eslint-disable-line import/no-extraneous-dependencies
import { Assertion, expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import parselocation from './utils';

Assertion.addMethod('match', function matcher(expected) {
    const actual = this._obj; // eslint-disable-line no-underscore-dangle

    Object.entries(expected)
        .forEach(([key, value]) => {
            this.assert(
                value === actual[key],
                'expected #{this} to have received #{exp}, but found #{act}',
                'expected #{this} to have received #{exp}, but found #{act}',
                { [key]: value },
                { [key]: actual[key] }
            );
        });
});

const createLocation = (pathname, search) => ({ pathname, search });
const createExpected = ({ type, undertype, varselid, henvendelsesid, visTekster = false }) => ({
    type,
    undertype,
    varselid,
    henvendelsesid,
    visTekster
});

describe('parsing av url', () => {
    describe('skal håndtere ingen parametere', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo'))).to.match(createExpected({}));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/'))).to.match(createExpected({}));
        });

        it('uten trailing slash, visTekster', () => {
            expect(parselocation(createLocation('/innloggingsinfo', '?visTekster'))).to.match(createExpected({
                visTekster: true
            }));
        });

        it('med trailing slash, visTekster', () => {
            expect(parselocation(createLocation('/innloggingsinfo/', '?visTekster'))).to.match(createExpected({
                visTekster: true
            }));
        });
    });

    describe('skal håndtere bare id', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/varselid/abba'))).to.match(createExpected({
                varselid: 'abba'
            }));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/varselid/abba/'))).to.match(createExpected({
                varselid: 'abba'
            }));
        });

        it('uten trailing slash, visTekster', () => {
            expect(parselocation(createLocation('/innloggingsinfo/henvendelsesid/abba'))).to.match(createExpected({
                henvendelsesid: 'abba'
            }));
        });

        it('med trailing slash, visTekster', () => {
            expect(parselocation(createLocation('/innloggingsinfo/varselid/abba', '?visTekster'))).to.match(createExpected({
                varselid: 'abba',
                visTekster: true
            }));
        });
    });

    describe('skal håndtere bare type', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave'))).to.match(createExpected({
                type: 'oppgave'
            }));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/'))).to.match(createExpected({
                type: 'oppgave'
            }));
        });

        it('uten trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                visTekster: true
            }));
        });

        it('med trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                visTekster: true
            }));
        });
    });

    describe('skal håndtere type og id', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/varselid/testeree'))).to.match(createExpected({
                type: 'oppgave',
                varselid: 'testeree'
            }));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/varselid/testeree/'))).to.match(createExpected({
                type: 'oppgave',
                varselid: 'testeree'
            }));
        });

        it('uten trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/varselid/testeree', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                varselid: 'testeree',
                visTekster: true
            }));
        });

        it('med trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/varselid/testeree/', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                varselid: 'testeree',
                visTekster: true
            }));
        });
    });

    describe('skal håndtere type og undertype', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree'
            }));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree'
            }));
        });

        it('uten trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                visTekster: true
            }));
        });

        it('med trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                visTekster: true
            }));
        });
    });

    describe('skal håndtere type, undertype og id', () => {
        it('uten trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/varselid/abba'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                varselid: 'abba'
            }));
        });

        it('med trailing slash', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/varselid/abba/'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                varselid: 'abba'
            }));
        });

        it('uten trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/varselid/abba', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                varselid: 'abba',
                visTekster: true
            }));
        });

        it('med trailing slash, visTekst', () => {
            expect(parselocation(createLocation('/innloggingsinfo/type/oppgave/undertype/testeree/varselid/abba/', '?visTekster'))).to.match(createExpected({
                type: 'oppgave',
                undertype: 'testeree',
                varselid: 'abba',
                visTekster: true
            }));
        });
    });
});
