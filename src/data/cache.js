import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'BOOKING_DATA';

export const saveBookingCache = async (data) => {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const getBookingCache = async () => {
  const cache = await AsyncStorage.getItem(CACHE_KEY);
  return cache ? JSON.parse(cache) : null;
};

export const clearBookingCache = async () => {
  await AsyncStorage.removeItem(CACHE_KEY);
};
