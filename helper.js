const fs = require("fs/promises");

function shortenText(text, maxLength = 300) {
  if (text.length <= maxLength) {
    return text;
  }

  const shortenedText = text.substr(0, maxLength).trim();
  return shortenedText + "...";
}

function splitLongMessage(text, maxLength) {
  const chunks = [];
  let i = 0;

  while (i < text.length) {
    chunks.push(text.substr(i, maxLength));
    i += maxLength;
  }

  return chunks;
}

function sendLongMessage(chatId, text) {
  const maxLength = 4096; // Максимальна довжина повідомлення в Телеграмі
  const chunks = splitLongMessage(text, maxLength);

  chunks.forEach((chunk) => {
    bot.sendMessage(chatId, chunk, { parse_mode: "Markdown" });
  });
}

function prepareTextForTelegram(text) {
  const cleanedText = text.replace(/\n/g, "").replace(/<\/?[^>]+(>|$)/g, "");

  return cleanedText;
}

async function writeJsonFile(content, fileName = "source1") {
  try {
    await fs.writeFile("./logs/" + fileName + ".json", JSON.stringify(content));
  } catch (err) {
    console.log(err);
  }
}

async function readRegFile(fileName = "source1") {
  try {
    const data = await fs.readFile("./logs/" + fileName + ".json", {
      encoding: "utf8",
    });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
}

async function isFileExists(fileName) {
    const filePath = "./logs/" + fileName+".json";
    try {
        await fs.access(filePath);
        return true;
      } catch (error) {
        if (error.code === 'ENOENT') {
          return false;
        } else {
          throw error;
        }
      }
  }

module.exports={
  shortenText,
  sendLongMessage,
  prepareTextForTelegram,
  writeJsonFile,
    readRegFile,
    isFileExists
};
