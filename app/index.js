import 'whatwg-fetch';
import PromisePolyfill from 'es6-promise';
import 'ponyfill-array-find';
import entries from 'object.entries';
import parselocation from './utils';
import tekster from './tekster.json';

if (!Object.entries) {
    entries.shim();
}

PromisePolyfill.polyfill();

const injectRegex = /\{([^}]+)\}/g;

function finnElementer() {
    return {
        overskrift: document.querySelector('#overskrift'),
        ingress: document.querySelector('#ingress'),
        lenke: document.querySelector('#videre-lenke')
    };
}

export function mestBeskrivendeTekster(type, undertype) {
    const norskeTekster = tekster.nb;

    return ['overskrift', 'ingress', 'knapptekst']
        .map((key) => {
            const funnetKey = [`${type}.${undertype}.${key}`, `${type}.${key}`, `${key}`]
                .find((test) => norskeTekster[test]);
            return [key, norskeTekster[funnetKey], funnetKey];
        }).reduce((acc, [key, tekst, funnetKey]) => ({ ...acc, [key]: { tekst, funnetKey } }), {});
}

export function injectVariables(baseStr, values) {
    return baseStr.replace(injectRegex, (_, capture) => values[capture] || capture);
}

function render() {
    const { overskrift, ingress, lenke } = finnElementer();
    const params = parselocation(location);
    const { type, undertype, varselid, henvendelsesid } = params;

    const tekster = Object.entries(mestBeskrivendeTekster(type, undertype))
        .map(([key, tekst]) => {
            return { key, value: tekst.tekst };
        })
        .reduce((obj, { key, value }) => ({ ...obj, [key]: value }), {});

    overskrift.innerText = tekster.overskrift;
    ingress.innerHTML = tekster.ingress;
    lenke.innerText = tekster.knapptekst;
    hentRedirecturl(params)
        .then(url => {
            lenke.href = injectVariables(url, { type, undertype, varselid, henvendelsesid });
        })
        .then(toggleSpinner)
}

function renderFeilmelding(err) {
    console.error(err); // eslint-disable-line no-console
    const { overskrift, ingress, lenke } = finnElementer();
    overskrift.innerText = 'Oops';
    overskrift.classList.remove('hode-advarsel');
    overskrift.classList.add('hode-feil');
    ingress.innerText = 'Det skjedde en ukjent feil.';
    lenke.style.display = 'none';
}

function toggleSpinner() {
    document.querySelector('#spinner').style.display = 'none';
    document.querySelector('#lastet-innhold').style.display = 'block';
}

function getConfigparams(params) {
    const { type, undertype, varselid, henvendelsesid} = params;
    const configparams = {type: type, undertype: undertype, varselid: varselid, henvendelsesid: henvendelsesid}
    Object.keys(configparams).forEach(key => {
        if(configparams[key] === undefined) {
            delete configparams[key]
        }
    })
    return configparams;
}

function hentRedirecturl() {
    const params = parselocation(location);
    const url = new URL('/innloggingsinfo-api/api/redirecturl', window.location.href);
    url.search = new URLSearchParams(getConfigparams(params))
    return fetch(url)
            .then(response => {return response.text()})
            .catch(renderFeilmelding)
}

function redirect(params) {
    hentRedirecturl(params).then(url => {
        window.location.assign(url)
    })
}

function redirectHvisInnloggingsniva(innloggingsniva) {
    if(4 === innloggingsniva) {
        redirect()
    } else {
        render()
    }
}

function init() {
    fetch('/innloggingsinfo-api/api/authlevel')
        .then((res) => res.json())
        .then(redirectHvisInnloggingsniva)
        .catch(renderFeilmelding)
}

let readyBound = false;
document.addEventListener('DOMContentLoaded', () => {
    if (readyBound) {
        return;
    }
    readyBound = true;
    init();
});
