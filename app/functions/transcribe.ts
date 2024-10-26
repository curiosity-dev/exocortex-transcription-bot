import fs from "node:fs"
import { openai } from './clients'
import { splitAudioIfNeeded, getAudioDuration } from './splitAudio'
import { calculateWhisperCost } from './calculateCost'

export async function transcribeAudio(filePath: string): Promise<{
  text: string,
  cost: number
}> {
  const duration = await getAudioDuration(filePath) // получаем длительность в секундах
  const durationMinutes = duration / 60 // переводим в минуты

  const chunks = await splitAudioIfNeeded(filePath)
  const transcriptions: string[] = []

  const whisperCost = calculateWhisperCost(durationMinutes)

  for (const chunk of chunks) {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(chunk),
      model: "whisper-1",
    })

    transcriptions.push(transcription.text)

    if (chunk !== filePath) {
      fs.unlinkSync(chunk)
    }
  }

  return {
    text: transcriptions.join(' '),
    cost: whisperCost
  }
}