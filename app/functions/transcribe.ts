import fs from "node:fs"
import { openai } from './clients'
import { splitAudioIfNeeded } from './splitAudio'
import { calculateWhisperCost } from './calculateCost'

export async function transcribeAudio(filePath: string): Promise<{
  text: string,
  cost: number
}> {
  const chunks = await splitAudioIfNeeded(filePath)
  const transcriptions: string[] = []

  const whisperCost = calculateWhisperCost(chunks.length)

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