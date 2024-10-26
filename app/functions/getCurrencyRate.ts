import axios from 'axios';

let usdRate: number | null = null;
let lastUpdateTime: number = 0;

const CACHE_DURATION = 1000 * 60 * 60; // 1 час

export async function getUSDtoRUBRate(): Promise<number> {
  const now = Date.now();

  // Используем кэшированное значение, если оно есть и не устарело
  if (usdRate && (now - lastUpdateTime) < CACHE_DURATION) {
    return usdRate;
  }

  try {
    // Используем API ЦБ РФ
    const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
    usdRate = response.data.Valute.USD.Value;
    lastUpdateTime = now;
    return usdRate;
  } catch (error) {
    console.error('Error fetching currency rate:', error);
    // Возвращаем примерный курс если API недоступен
    return 90;
  }
}