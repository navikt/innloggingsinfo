import 'whatwg-fetch';
import PromisePolyfill from 'es6-promise';
import 'ponyfill-array-find';
import entries from 'object.entries';
import parselocation from './utils';

if (!Object.entries) {
    entries.shim();
}

PromisePolyfill.polyfill();

const injectRegex = /\{([^}]+)\}/g;
const injectRegexSingle = /\{([^}]+)\}/;

function finnElementer() {
    return {
        overskrift: document.querySelector('#overskrift'),
        ingress: document.querySelector('#ingress'),
        lenke: document.querySelector('#videre-lenke')
    };
}

export function mestBeskrivendeTekster(type, undertype, alleTekster) {
    const norskeTekster = alleTekster.nb;

    return ['overskrift', 'ingress', 'knapptekst', 'url']
        .map((key) => {
            const funnetKey = [`${type}.${undertype}.${key}`, `${type}.${key}`, `${key}`]
                .find((test) => norskeTekster[test]);
            return [key, norskeTekster[funnetKey], funnetKey];
        }).reduce((acc, [key, tekst, funnetKey]) => ({ ...acc, [key]: { tekst, funnetKey } }), {});
}

export function alleParams(params) {
    return ({ url }) => {
        let localUrl = url;
        while (true) { // eslint-disable-line no-constant-condition
            const matched = localUrl.match(injectRegexSingle);
            if (!matched) {
                break;
            }
            const [, capture] = matched;
            if (!params[capture]) {
                return false;
            }
            localUrl = localUrl.replace(injectRegexSingle, '');
        }
        return true;
    };
}

export function mestBeskrivendeUrl(type, undertype, tekster, params) {
    const norskeTekster = tekster.nb;
    return [`${type}.${undertype}.url`, `${type}.url`, 'url']
        .filter((test) => norskeTekster[test])
        .map((test) => ({ url: norskeTekster[test], key: test }))
        .filter(alleParams(params))
        .find(() => true);
}

export function injectVariables(baseStr, values) {
    return baseStr.replace(injectRegex, (_, capture) => values[capture] || capture);
}

function render(alleTekster) {
    const { overskrift, ingress, lenke } = finnElementer();
    const params = parselocation(location);
    const { type, undertype, varselid, henvendelsesid, visTekster } = params;

    const tekster = Object.entries(mestBeskrivendeTekster(type, undertype, alleTekster))
        .map(([key, tekst]) => {
            if (visTekster) {
                return { key, value: tekst.funnetKey };
            }
            return { key, value: tekst.tekst };
        })
        .reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {});
    const urlConfig = mestBeskrivendeUrl(type, undertype, alleTekster, params);

    overskrift.innerText = tekster.overskrift;
    ingress.innerHTML = tekster.ingress;
    lenke.innerText = tekster.knapptekst;
    lenke.href = injectVariables(urlConfig.url, { type, undertype, varselid, henvendelsesid });

    if (visTekster) {
        lenke.insertAdjacentHTML('afterend', `<p>Urlen benytter keyen: ${urlConfig.key}</p>`);
    }
}

function toggleSpinner() {
    document.querySelector('#spinner').style.display = 'none';
    document.querySelector('#lastet-innhold').style.display = 'block';
}

function renderFeilmelding(err) {
    console.error(err); // eslint-disable-line no-console
    const { overskrift, ingress, lenke } = finnElementer();

    overskrift.innerText = 'Oops';
    overskrift.classList.remove('hode-advarsel');
    overskrift.classList.add('hode-feil');

    ingress.innerText = 'Det skjedde en feil ved uthenting av tekster for denne siden.';

    lenke.style.display = 'none';
}

function init() {
    fetch('/innloggingsinfo-api/api/tekster')
        .then((res) => {
            if (res.redirected) {
                window.location.assign(res.url);
            } else if (!res.ok) {
                throw new Error();
            }
            return res;
        })
        .then((res) => res.json())
        .then(render)
        .catch(renderFeilmelding)
        .then(toggleSpinner);
}

let readyBound = false;
document.addEventListener('DOMContentLoaded', () => {
    if (readyBound) {
        return;
    }
    readyBound = true;
    init();
});
