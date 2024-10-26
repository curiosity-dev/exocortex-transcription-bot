import axios from "axios"
import fs from "node:fs"

export async function downloadFile(fileUrl: string, outputPath: string): Promise<void> {
  const response = await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  });
}