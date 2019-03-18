const Telegram = require('./telegram');
const Dynamo = require('./dynamo');

function getMethodByBody(body) {
    if (body.image) {
        return 'sendPhoto';
    } else if (body.video) {
        return 'sendVideo';
    }
    return 'sendMessage';
}

function updateButtons(buttons, data, voterId) {
    let loaderText = 'Loading...';

    // eslint-disable-next-line complexity
    const updatedButtons = buttons.map(button => {
        button.votersIds = button.votersIds || [];

        const hasVote = button.votersIds.includes(voterId);
        const votedButton = button.payload === data;

        // Если ранее голосовал уже за кнопку, отменяем реакцию
        if (hasVote && votedButton) {
            loaderText = 'You took your reaction back';
            button.votersIds = button.votersIds.filter(id => id !== voterId);
        } else if (hasVote) { // Если голосовал ранее, отменяем
            button.votersIds = button.votersIds.filter(id => id !== voterId);
        } else if (votedButton) { // Добавляем голос
            loaderText = `You ${button.text} that`;
            button.votersIds.push(voterId);
        }

        return button;
    });

    return [updatedButtons, loaderText];
}

// eslint-disable-next-line max-statements
module.exports.processWebhook = async event => {
    const body = JSON.parse(event.body);
    const { callback_query } = body;

    console.log(body);

    if (!callback_query) {
        return { statusCode: 200 };
    }

    const { message, from, data } = callback_query;
    const { message_id, chat } = message;
    const id = `${chat.id}-${message_id}`;

    const msg = await Dynamo.get(Dynamo.tables.MESSAGES, { id });

    if (!msg) {
        console.warn('Message is not found in database');

        return { statusCode: 200 };
    }

    const [buttons, loaderText] = updateButtons(msg.buttons, data, from.id);

    await Dynamo.update(Dynamo.tables.MESSAGES, { id }, ['buttons', buttons]);
    await Telegram.editMessageButtons({ chat_id: chat.id, message_id, buttons });

    return {
        statusCode: 200,
        body: JSON.stringify({
            method: 'answerCallbackQuery',
            callback_query_id: callback_query.id,
            text: loaderText
        })
    };
};

module.exports.sendMessage = async event => {
    const body = JSON.parse(event.body);

    const method = getMethodByBody(body);
    const data = await Telegram[method](body);

    const id = `${data.result.chat.id}-${data.result.message_id}`;

    const created = await Dynamo.put(Dynamo.tables.MESSAGES, { id, buttons: body.buttons });

    return {
        statusCode: 200,
        body: JSON.stringify(created)
    };
};
