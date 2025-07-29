import bookingData from '../../assets/booking.json';

export const fetchBookingsFromService = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: bookingData,
        timestamp: Date.now(),
      });
    }, 1000); // 模拟延迟
  });
};
