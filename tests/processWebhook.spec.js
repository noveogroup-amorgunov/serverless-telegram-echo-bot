const assert = require('assert');
const nock = require('nock');

const { processWebhook } = require('../handler');

const telegramWebhookSampleResponse = {
    update_id: 609959397,
    message: {
        message_id: 31,
        chat: { id: 329857149, type: 'private' },
        date: 1550655569,
        text: 'Hello, bot!'
    }
};

describe('processWebhook', () => {
    it('should respond { codeStatus: true }', async () => {
        const event = {
            resource: '/',
            httpMethod: 'POST',
            body: null,
            path: '/',
            pathParameters: null,
            headers: {}
        };

        const actual = await processWebhook(event);
        const expected = { codeStatus: true };

        assert(actual, expected);
    });

    it('should send message to telegram', async () => {
        const token = process.env.TELEGRAM_TOKEN;

        nock('https://api.telegram.org')
            .get(`/bot${token}/sendMessage`)
            .query(data => data.text === 'You said: Hello, bot!')
            .reply(200, {});

        const event = {
            resource: '/',
            httpMethod: 'POST',
            body: JSON.stringify(telegramWebhookSampleResponse),
            path: '/',
            pathParameters: null,
            headers: {}
        };

        const actual = await processWebhook(event);
        const expected = { codeStatus: true };

        assert(actual, expected);
    });
});
