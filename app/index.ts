import { bot } from './functions/clients'
import { getFileExtension } from "./functions/getFileExtension"
import { downloadFile } from "./functions/downloadFile"
import { TempFileManager } from "./functions/tempFileManager"
import { transcribeAudio } from "./functions/transcribe"
import { formatText } from "./functions/formatText"
import { getUSDtoRUBRate } from './functions/getCurrencyRate'

bot.command("start", async (ctx) => {
  const welcomeMessage = `
👋 Привет! Я бот для транскрибации аудио в текст.

🎯 Что я умею:

• Преобразовывать голосовые сообщения и аудиофайлы в текст
• Форматировать получившийся текст для удобного чтения
• Работать с файлами различных форматов (mp3, ogg, wav, m4a)
• Обрабатывать файлы любого размера

📝 Как использовать:

1. Просто отправьте мне голосовое сообщение или аудиофайл
2. Дождитесь обработки
3. Получите готовый текст

💰 После обработки я покажу стоимость использования API

⚡️ Начните прямо сейчас - отправьте голосовое сообщение!
`

  await ctx.reply(welcomeMessage)
})

bot.on(['message:voice', 'message:audio'], async (ctx) => {
  try {
    await ctx.reply('Начинаю обработку аудио...');

    const file = ctx.message.voice || ctx.message.audio;
    const fileId = file.file_id;
    const mimeType = file.mime_type || 'audio/ogg';
    const extension = getFileExtension(mimeType);

    const fileInfo = await bot.api.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${fileInfo.file_path}`;

    const outputPath = TempFileManager.createTempFilePath(fileId, extension);
    await downloadFile(fileUrl, outputPath);

    if (fileInfo.file_size && fileInfo.file_size > 5 * 1024 * 1024) {
      await ctx.reply('Файл большой, разбиваю на части...');
    }

    const transcriptionResult = await transcribeAudio(outputPath);
    const formattingResult = await formatText(transcriptionResult.text);

    // Отправляем форматированный текст
    await ctx.reply(formattingResult.text);

    // Считаем и отправляем общую стоимость
    const totalCost = transcriptionResult.cost + formattingResult.cost;
    const usdRate = await getUSDtoRUBRate();
    const costInRub = totalCost * usdRate;

    await ctx.reply(
      `Стоимость обработки: ${totalCost.toFixed(2)} $ (≈${costInRub.toFixed(2)} ₽)`
    );

    await ctx.reply('Переведи по номеру +79521789523 на Тинькофф (Евгений К.) 🍺')

    TempFileManager.cleanup(outputPath);
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply(`Произошла ошибка при обработке аудио: ${error.message}`);
  }
});

bot.start()