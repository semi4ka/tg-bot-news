const TelegramBot = require("node-telegram-bot-api");
const cron = require("cron");
const { articleService } = require("./services/article.service");
const { readRegFile, writeJsonFile, isFileExists } = require("./helper");
const { TOKEN, IDS } = require("./config.json");

const bot = new TelegramBot(TOKEN, { polling: true });


bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log("chatId:", msg.chat);
  console.log("msg:", msg);
  switch (msg.text) {
    case ".logs":
    bot.sendMessage(chatId, "test logs");
      break;
  
    default:
      break;
  }
});

const cronJob = new cron.CronJob("0 * * * *", async () => {
  await start();
});

const start = async () => {
  const art1 = await articleService.getSource1();
  sendPosts(art1);
  const art2 = await articleService.getSource2();
  sendPosts(art2, "source2");
};
cronJob.start();
start();

async function sendPosts(data, fileName = "source1") {
  const isFileExist = await isFileExists(fileName);
  let lastPost = "";
  if (isFileExists) {
     lastPost = await readRegFile(fileName);
  }
    data.map(async (post) => {
      if (!isFileExist || Date.parse(post.date) > Date.parse(lastPost.date)) {
        const text = `[${post.title.rendered}](${post.link})`;
        IDS.forEach((id) => {
          bot.sendMessage(id, text, { parse_mode: "Markdown" });
        });
      }
    });
  

  await writeJsonFile(data[0], fileName);
}
