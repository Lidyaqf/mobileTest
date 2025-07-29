import { getBookingCache, saveBookingCache } from './cache';
import { fetchBookingsFromService } from './service';

const DATA_TTL = 1000 * 60 * 5; // 5分钟

export const getBookingData = async (forceRefresh = false) => {
  const cache = await getBookingCache();

  const now = Date.now();
  const isCacheValid = cache && (now - cache.timestamp < DATA_TTL);

  if (!forceRefresh && isCacheValid) {
    return cache.data;
  }

  try {
    const result = await fetchBookingsFromService();
    await saveBookingCache(result);
    return result.data;
  } catch (error) {
    console.error('获取数据失败:', error);
    return cache?.data ?? [];
  }
};
