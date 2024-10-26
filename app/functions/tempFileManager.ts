import fs from "node:fs"
import path from "node:path"

export class TempFileManager {
  static getTempDir() {
    const tmpDir = path.join(__dirname, '../../', 'tmp');

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir)
    }

    return tmpDir
  }

  static createTempFilePath(fileId: string, extension: string): string {
    return path.join(this.getTempDir(), `${fileId}.${extension}`)
  }

  static cleanup(baseFilePath: string) {
    const dir = path.dirname(baseFilePath)
    const basename = path.basename(baseFilePath, path.extname(baseFilePath))

    // Удаляем оригинальный файл
    if (fs.existsSync(baseFilePath)) {
      fs.unlinkSync(baseFilePath)
    }

    // Удаляем все части файла, если они есть
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      if (file.startsWith(basename + '_part')) {
        fs.unlinkSync(path.join(dir, file))
      }
    })
  }
}