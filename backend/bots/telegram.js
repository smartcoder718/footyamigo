const TelegramBot = require("node-telegram-bot-api");
const { TelegramToken, User, FreeTrial } = require("../db");
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAMBOTTOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/start (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const trial = await FreeTrial.findByChatId(chatId);
  const activation_token = match[1]; // the captured "whatever"
  const telegramToken = await TelegramToken.findUserByToken(activation_token);

  if (telegramToken) {
    try {
      if (trial) {
        const user = await User.findById(telegramToken.user_id);
        console.log(user);
        if (
          !user.subscription ||
          (user.subscription.trial && trial.user_id != user.id)
        ) {
          const opts = {
            // reply_to_message_id: msg.message_id,
            parse_mode: "html",
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: "⚡ Switch To Pro",
                    url: "https://dashboard.footyamigo.com/profile/subscription"
                  }
                ]
              ]
            })
          };

          return bot.sendMessage(
            chatId,
            "Your telegram has already been used for a 7 days free trial. Please upgrade to Pro to connect this telegram and continue receiving alerts from Footy Amigo.",
            opts
          );
          // return bot.sendMessage(
          //   chatId,
          //   "This telegram has already been used for a free trial. Please buy a subscription to connect this telegram!"
          // );
        }
      }
      await User.setTelegramToken(telegramToken.user_id, chatId);
      bot.sendMessage(chatId, "Bot Linked Successfully!");
      TelegramToken.deleteUserToken(activation_token);
    } catch (err) {
      console.error(err);
      bot.sendMessage(
        chatId,
        "Bot Linking Failed! Please try again or contact us at support@footyamigo.com if it is not working."
      );
    }
  }
});

module.exports = bot;
