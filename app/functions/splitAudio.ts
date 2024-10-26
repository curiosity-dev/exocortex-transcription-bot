import ffmpeg from 'fluent-ffmpeg'
import fs from 'node:fs'
import path from 'node:path'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB в байтах

export async function splitAudioIfNeeded(inputPath: string): Promise<string[]> {
  const stats = fs.statSync(inputPath)
  if (stats.size <= CHUNK_SIZE) {
    return [inputPath]
  }

  const duration = await getAudioDuration(inputPath)
  const numberOfChunks = Math.ceil(stats.size / CHUNK_SIZE)
  const chunkDuration = duration / numberOfChunks

  const outputDir = path.dirname(inputPath)
  const basename = path.basename(inputPath, path.extname(inputPath))
  const outputPaths: string[] = []

  for (let i = 0; i < numberOfChunks; i++) {
    const outputPath = path.join(outputDir, `${basename}_part${i}${path.extname(inputPath)}`)
    outputPaths.push(outputPath)

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(i * chunkDuration)
        .setDuration(chunkDuration)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run()
    })
  }

  return outputPaths
}

function getAudioDuration(filepath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filepath, (err, metadata) => {
      if (err) return reject(err)
      resolve(metadata.format.duration || 0)
    })
  })
}