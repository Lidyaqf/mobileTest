import { useEffect, useState } from 'react';
import { Linking, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { getBookingData } from '../data/provider';

import { View } from 'react-native';

import {
  RefreshControl,
  ScrollView,
  StyleSheet
} from 'react-native';

const Screen = () => {
  const [data, setData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    const bookingData = await getBookingData(forceRefresh);  // 获取数据，传入 forceRefresh 参数
    setData(bookingData);  // 更新状态
    console.log('Booking Data:', bookingData);

  };

  useEffect(() => {
    loadData();
  }, []);

  // 下拉刷新处理函数
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true); // 重新加载数据
    setIsRefreshing(false);
  };

  const handleOpenUrl = (url) => {
    const prefixedUrl = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(prefixedUrl).catch((err) => console.error('URL打开失败:', err));
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60); // 获取小时数
    const minutes = duration % 60;          // 获取分钟数
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };



  if (!data) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh} // 刷新时调用
          />
        }
      >
        <View style={styles.card}>
          <Text style={styles.title}>🎉 Booking Confirmed</Text>
          <Text style={styles.label}>Ship Reference:</Text>
          <Text style={styles.value}>{data.shipReference}</Text>

          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{formatDuration(data.duration)}</Text>

          <Text style={styles.label}>Can Issue Ticket:</Text>
          <Text style={styles.value}>
            {data.canIssueTicketChecking ? 'Yes' : 'No'}
          </Text>

          <Text style={styles.label}>Total Route:</Text>
          <Text style={styles.value}>
            {data.segments[0].originAndDestinationPair.origin.displayName} → {data.segments[data.segments.length - 1].originAndDestinationPair.destination.displayName}
          </Text>

        
        </View>

        <Text style={styles.segmentTitle}>🧭 Segments</Text>

        {data.segments.map((segment, index) => {
          const { origin, destination, originCity, destinationCity } = segment.originAndDestinationPair;

          const originFullUrl = origin.url.startsWith('http')
            ? `${origin.url}/${origin.code}`
            : `https://${origin.url}/${origin.code}`;

          const destinationFullUrl = destination.url.startsWith('http')
            ? `${destination.url}/${destination.code}`
            : `https://${destination.url}/${destination.code}`;

          return (
            <View key={segment.id} style={styles.segmentCard}>
              <Text style={styles.segmentHeader}>Segment {index + 1}</Text>

              <Text style={styles.cityText}>
                🧭 {originCity} → {destinationCity}
              </Text>

              <View style={styles.routeRow}>
                <TouchableOpacity onPress={() => handleOpenUrl(originFullUrl)}>
                  <Text style={styles.linkText}>{origin.displayName}</Text>
                </TouchableOpacity>
                <Text style={styles.arrow}>→</Text>
                <TouchableOpacity onPress={() => handleOpenUrl(destinationFullUrl)}>
                  <Text style={styles.linkText}>{destination.displayName}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2c3e50',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  segmentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 12,
    marginLeft: 4,
  },
  segmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  segmentHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  linkText: {
    color: '#1e90ff',
    marginBottom: 6,
    fontSize: 14,
  },
  cityText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    marginHorizontal: 6,
    fontSize: 16,
    color: '#333',
  },
});

export default Screen;


