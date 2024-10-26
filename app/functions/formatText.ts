import { openai } from './clients'
import { calculateGPT4Cost } from './calculateCost'

export async function formatText(text: string): Promise<{
  text: string,
  cost: number
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Ты редактор текста. Твоя задача - исправить грамматические и пунктуационные ошибки, добавить абзацы для лучшей читаемости, сохраняя при этом оригинальный смысл и формулировки. Не добавляй и не удаляй информацию."
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.3,
  })

  const formattedText = response.choices[0].message.content || text
  const tokens = response.usage?.total_tokens || 0
  const cost = calculateGPT4Cost(tokens)

  return {
    text: formattedText,
    cost: cost
  }
}