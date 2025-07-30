import { getBookingCache, saveBookingCache } from './cache';
import { fetchBookingsFromService } from './service';

const DATA_TTL = 1000 * 60 * 5; // 5分钟

export const getBookingData = async (forceRefresh = false) => {
  const cache = await getBookingCache();  // 获取缓存数据
  const now = Date.now();
  // 判断缓存是否在本地时间限制内以及未超过数据本身的有效期
  const isCacheValid = cache &&
    (now - cache.timestamp < DATA_TTL) &&
    cache.data?.expiryTime &&
    now < Number(cache.data.expiryTime) * 1000; // 转换为毫秒


    console.log('90===', isCacheValid)

  // 如果缓存有效且没有强制刷新，直接返回缓存数据
  if (isCacheValid && !forceRefresh) {
    return cache.data;
  }

  try {
    // 从服务器获取新数据
    const result = await fetchBookingsFromService();

    // 合并缓存数据和新数据
    const mergedData = mergeBookingData(cache?.data, result.data);

    // 保存新数据到缓存
    await saveBookingCache({
      timestamp: now, // 更新缓存时间戳
      data: mergedData, // 保存新数据
    });

    return mergedData;

  } catch (error) {
    console.error('获取数据失败:', error);

    // 如果获取新数据失败，返回缓存数据（如果缓存数据存在）
    return cache?.data ?? [];
  }
};

// 合并缓存数据和新数据
const mergeBookingData = (cacheData, newData) => {
  if (!cacheData) {
    return newData; // 如果没有缓存数据，直接返回新数据
  }

  // 合并 segments 数组，避免重复
  const mergedSegments = [
    ...cacheData.segments,
    ...newData.segments.filter(
      newSegment => !cacheData.segments.some(
        cacheSegment => cacheSegment.id === newSegment.id
      )
    )
  ];

  // 返回合并后的数据
  return {
    ...cacheData,
    ...newData,
    segments: mergedSegments
  };
};






