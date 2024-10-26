export function getFileExtension(mime_type: string): string {
  const mimeToExt: { [key: string]: string } = {
    'audio/ogg': 'ogg',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'video/mp4': 'mp4',
  };

  return mimeToExt[mime_type] || 'mp3'
}