require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const FormData = require("form-data");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TOKEN) throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Devil Telegraph Bot started...");

// ─── Upload to Catbox.moe ────────────────────────────────────────────────────

async function uploadFile(buffer, mimeType, filename) {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("fileToUpload", buffer, {
    filename,
    contentType: mimeType,
    knownLength: buffer.length,
  });

  const response = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    responseType: "text",
  });

  const url = String(response.data).trim();
  if (!url.startsWith("https://files.catbox.moe/")) {
    throw new Error("Upload failed: " + url);
  }
  return url;
}

// ─── Download file from Telegram ────────────────────────────────────────────

const MIME_MAP = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  gif: "image/gif",  mp4: "video/mp4",  webm: "video/webm",
  mov: "video/quicktime", webp: "image/webp",
  mp3: "audio/mpeg", ogg: "audio/ogg",
};

async function downloadFromTelegram(fileId, hintMime) {
  const file = await bot.getFile(fileId);
  const filePath = file.file_path;
  if (!filePath) throw new Error("Could not get file path from Telegram");

  const ext = filePath.split(".").pop()?.toLowerCase() ?? "bin";
  const url = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);
  const mimeType = hintMime ?? MIME_MAP[ext] ?? "application/octet-stream";
  return { buffer, mimeType, filename: `upload.${ext}` };
}

// ─── Footer & inline keyboard ────────────────────────────────────────────────

const FOOTER =
  "\n\n🖥 𝚃𝙷𝙸𝚂 𝙱𝙾𝚃 𝙸𝚂 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 [𝙈𝙍 𝘿𝙀𝙑𝙄𝙻](http://t.me/mrdevil12)\n" +
  "𝙵𝙾𝚁 𝚄𝙿𝙳𝙰𝚃𝙴 𝙹𝙾𝙸𝙽 𝙾𝚄𝚁 𝙲𝙷𝙰𝙽𝙽𝙴𝙻  [𝘿𝙀𝙑𝙄𝙻 𝘽𝙾𝚃'𝚂](https://t.me/devilbots971)";

const START_KEYBOARD = {
  inline_keyboard: [
    [{ text: "😈𝙾𝙽𝚆𝙴𝚁😈", url: "http://t.me/mrdevil12" }],
    [{ text: "🔥𝚄𝙿𝙳𝙰𝚃𝙴 𝙲𝙷𝙰𝙽𝙽𝙴𝙻🔥", url: "https://t.me/devilbots971" }],
    [{ text: "🔥𝚂𝚄𝙿𝙿𝙾𝚁𝚃 𝙶𝚁𝙾𝚄𝙿🔥", url: "https://t.me/devilbotsupport" }],
  ],
};

// ─── /start command ──────────────────────────────────────────────────────────

bot.onText(/\/start/, async (msg) => {
  const firstName = msg.from?.first_name ?? "User";
  const caption =
    "ᗪEᐯIᒪ ᙭ TEᒪEGᖇᗩᑭᕼ\n" +
    `             𝐇𝐎𝐖 𝐀𝐑𝐄 𝐘𝐎𝐔 *\`${firstName}\`*,\n\n` +
    "🏷 ᴊᴜꜱᴛ ꜱᴇɴᴅ ᴘʜᴏᴛᴏ ᴇɪᴛʜᴇʀ ɪɴ ᴄᴏᴍᴘʀᴇꜱꜱᴇᴅ ᴏʀ ᴜɴᴄᴏᴍᴘʀᴇꜱꜱᴇᴅ ꜰᴏʀᴍᴀᴛ\n" +
    "- `JPG`\n- `JPEG`\n- `PNG`\n- `GIF`\n- `Mp4`\n- `Mp3`\n" +
    "🏷 ᴋᴇᴇᴘ ꜱᴇɴᴅɪɴɢ ʏᴏᴜʀ ʀᴇQᴜɪʀᴇᴅ ᴛʏᴘᴇ ꜰɪʟᴇꜱ ᴏɴᴇ ʙʏ ᴏɴᴇ.\n" +
    "🏷 ꜰɪʟᴇꜱ ᴍᴏʀᴇ ᴛʜᴇɴ 100ᴍʙ ɪꜱ ɴᴏᴛ ꜱᴜᴘᴘᴏʀᴛᴇᴅ.\n\n\n" +
    "🖥 𝚃𝙷𝙸𝚂 𝙱𝙾𝚃 𝙸𝚂 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 [𝙈𝙍 𝘿𝙀𝙑𝙄𝙻](http://t.me/mrdevil12)\n" +
    "𝙵𝙾𝚁 𝚄𝙿𝙳𝙰𝚃𝙴 𝙹𝙾𝙸𝙽 𝙾𝚄𝚁 𝙲𝙷𝙰𝙽𝙽𝙴𝙻  [𝘿𝙀𝙑𝙄𝙻 𝘽𝙾𝚃'𝚂](https://t.me/devilbots971)";

  await bot.sendPhoto(msg.chat.id, "https://files.catbox.moe/w3oe8k.jpg", {
    caption,
    parse_mode: "Markdown",
    reply_markup: START_KEYBOARD,
  });
});

// ─── Media handler ───────────────────────────────────────────────────────────

async function handleMedia(msg, fileId, label, hintMime) {
  const chatId = msg.chat.id;
  const statusMsg = await bot.sendMessage(chatId, `⏳ Uploading your ${label}...`, {
    reply_to_message_id: msg.message_id,
  });

  try {
    const { buffer, mimeType, filename } = await downloadFromTelegram(fileId, hintMime);
    const url = await uploadFile(buffer, mimeType, filename);

    await bot.editMessageText(`Link :- \`${url}\`${FOOTER}`, {
      chat_id: chatId,
      message_id: statusMsg.message_id,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    console.log(`✅ Uploaded ${label}: ${url}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${label}:`, err.message);
    await bot.editMessageText(
      `❌ Failed to upload your ${label}. Please try again.\n\nError: ${err.message}`,
      { chat_id: chatId, message_id: statusMsg.message_id },
    );
  }
}

// ─── Message listeners ───────────────────────────────────────────────────────

bot.on("photo", async (msg) => {
  const largest = msg.photo[msg.photo.length - 1];
  await handleMedia(msg, largest.file_id, "photo", "image/jpeg");
});

bot.on("video", async (msg) => {
  if (msg.video) await handleMedia(msg, msg.video.file_id, "video", msg.video.mime_type ?? "video/mp4");
});

bot.on("animation", async (msg) => {
  if (msg.animation) await handleMedia(msg, msg.animation.file_id, "GIF", msg.animation.mime_type ?? "video/mp4");
});

bot.on("video_note", async (msg) => {
  if (msg.video_note) await handleMedia(msg, msg.video_note.file_id, "video note", "video/mp4");
});

bot.on("document", async (msg) => {
  const doc = msg.document;
  if (!doc) return;
  const mime = doc.mime_type ?? "";
  if (mime.startsWith("image/") || mime.startsWith("video/") || mime.startsWith("audio/")) {
    await handleMedia(msg, doc.file_id, "file", mime);
  } else {
    await bot.sendMessage(msg.chat.id, "❌ Sorry, only photos, videos, GIFs and audio files are supported.");
  }
});

bot.on("message", async (msg) => {
  if (msg.photo || msg.video || msg.animation || msg.video_note || msg.document || msg.text) return;
  await bot.sendMessage(msg.chat.id, "Please send a photo, video, or GIF.");
});

bot.on("polling_error", (err) => console.error("Polling error:", err.message));
