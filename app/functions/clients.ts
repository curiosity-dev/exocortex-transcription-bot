import { Bot } from 'grammy'
import OpenAI from 'openai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { CONFIG } from './config'

const proxyAgent = new HttpsProxyAgent(CONFIG.PROXY)

export const bot = new Bot(CONFIG.BOT_TOKEN)

export const openai = new OpenAI({
  apiKey: CONFIG.OPENAI_API_KEY,
  httpAgent: proxyAgent,
})