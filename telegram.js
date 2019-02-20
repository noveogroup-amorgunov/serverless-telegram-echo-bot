const axios = require('axios-https-proxy-fix');
const url = require('url');

const PROXY = process.env.TELEGRAM_PROXY;
const TOKEN = process.env.TELEGRAM_TOKEN;

// Use proxy for countries where telegram api is blocked
function formatProxy(proxyString) {
    const formattedProxy = url.parse(proxyString);
    const [username, password] = formattedProxy.auth.split(':');

    return {
        host: formattedProxy.hostname,
        port: formattedProxy.port,
        auth: { username, password }
    };
}

module.exports.sendMessage = params => {
    const proxy = PROXY && formatProxy(PROXY);
    const baseUrl = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    return axios
        .get(baseUrl, { params, proxy })
        .catch(e => {
            console.error('Telegram error', e.response.data);
        });
};
