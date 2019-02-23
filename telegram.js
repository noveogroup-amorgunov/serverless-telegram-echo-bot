const axios = require('axios-https-proxy-fix');
const url = require('url');

const PROXY = process.env.TELEGRAM_PROXY;
const TOKEN = process.env.TELEGRAM_TOKEN;

class Telegram {
    static async sendPhoto({ chat_id, image, text, buttons = [] }) {
        return await this.request('sendPhoto', {
            parse_mode: 'Markdown',
            chat_id,
            photo: image,
            caption: text,
            reply_markup: this.createInlineKeyboard(buttons)
        });
    }

    static async sendMessage({ chat_id, text, buttons = [], disable_web_page_preview = false }) {
        return await this.request('sendMessage', {
            parse_mode: 'Markdown',
            disable_web_page_preview,
            chat_id,
            text,
            reply_markup: this.createInlineKeyboard(buttons)
        });
    }

    static async editMessageButtons({ chat_id, message_id, buttons }) {
        return await this.request('editMessageReplyMarkup', {
            chat_id,
            message_id,
            reply_markup: this.createInlineKeyboard(buttons)
        });
    }

    static request(method, params) {
        const proxy = PROXY && this._formatProxy(PROXY);
        const baseUrl = `https://api.telegram.org/bot${TOKEN}/${method}`;

        return axios
            .get(baseUrl, { params, proxy })
            .then(r => r.data)
            .catch(e => {
                console.error('Telegram error', e.response.data);
            });
    }

    static createInlineKeyboard(buttons) {
        return {
            one_time_keyboard: true,
            inline_keyboard: [buttons.map(({ text, payload, votersIds = [] }) => ({
                text: `${text} ${votersIds.length}`, callback_data: payload
            }))]
        };
    }

    // Use proxy for countries where telegram api is blocked
    static _formatProxy(proxyString) {
        const formattedProxy = url.parse(proxyString);
        const [username, password] = formattedProxy.auth.split(':');

        return {
            host: formattedProxy.hostname,
            port: formattedProxy.port,
            auth: { username, password }
        };
    }
}

module.exports = Telegram;
