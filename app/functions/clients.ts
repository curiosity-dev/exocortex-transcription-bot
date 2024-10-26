import { Bot } from 'grammy'
import OpenAI from 'openai'
import { CONFIG } from './config'

export const bot = new Bot(CONFIG.BOT_TOKEN)

export const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY
})