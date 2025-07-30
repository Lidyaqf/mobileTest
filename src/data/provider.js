import { getBookingCache, saveBookingCache } from './cache';
import { fetchBookingsFromService } from './service';

const DATA_TTL = 1000 * 60 * 5; // 5分钟

export const getBookingData = async (forceRefresh = false) => {
  const cache = await getBookingCache();

  const now = Date.now();
  const isCacheValid = cache && (now - cache.timestamp < DATA_TTL);

  try {
    // 从服务获取新数据
    const result = await fetchBookingsFromService();

    // 如果缓存数据存在且有效期内
    let mergedData;

    if (isCacheValid) {
      const cacheSegmentsLength = cache.data?.segments?.length || 0;
      const resultSegmentsLength = result.data?.segments?.length || 0;

      if (resultSegmentsLength < cacheSegmentsLength) {
        // 如果新数据的 segments 更短，直接返回新数据
        mergedData = result.data;
      } else {
        // 如果新数据的 segments 更长，进行拼接
        mergedData = {
          ...result.data,
          segments: [
            ...cache.data.segments,
            ...result.data.segments.filter(
              (newSegment) =>
                !cache.data.segments.some(
                  (existingSegment) => existingSegment.id === newSegment.id
                )
            ),
          ], // 合并 segments
        };
      }
    } else {
      // 如果缓存无效，直接使用新数据
      mergedData = result.data;
    }


    // 保存合并后的数据到缓存
    await saveBookingCache({
      timestamp: now, // 更新缓存时间戳
      data: mergedData, // 保存合并后的数据
    });

    // 返回合并后的数据
    return mergedData;
  } catch (error) {
    console.error('获取数据失败:', error);
    // 如果获取新数据失败，则返回缓存数据
    return cache?.data ?? [];
  }
};



