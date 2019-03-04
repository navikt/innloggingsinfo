import UrlPattern from 'url-pattern';

// eslint-disable-next-line max-len
const urlParser = new UrlPattern('/innloggingsinfo(/type/:type)(/undertype/:undertype)(/varselid/:varselid)(/henvendelsesid/:henvendelsesid)*');

export default function parselocation(location) {
    const { pathname, search } = location;

    return {
        ...urlParser.match(pathname),
        visTekster: (`${search}` || '').indexOf('visTekster') >= 0
    };
}
