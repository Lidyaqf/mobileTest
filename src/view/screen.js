import { useEffect, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { getBookingData } from '../data/provider';

import { View } from 'react-native';

const Screen = () => {
  const [data, setData] = useState(null);

  const loadData = async () => {
    const bookingData = await getBookingData();
    setData(bookingData);
    console.log('Booking Data:', bookingData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return null;

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <Text>Ship Reference: {data.shipReference}</Text>
      <Text>Duration: {data.duration} mins</Text>
      <Text>Can Issue Ticket: {data.canIssueTicketChecking ? 'Yes' : 'No'}</Text>

      <Text style={{ marginTop: 16, fontWeight: 'bold' }}>Segments:</Text>
      {data.segments.map((segment, index) => (
        <View key={segment.id} style={{ marginTop: 8 }}>
          <Text>Segment {index + 1}:</Text>
          <Text>
            From {segment.originAndDestinationPair.origin.displayName} ({segment.originAndDestinationPair.origin.code})
            — {segment.originAndDestinationPair.originCity}
          </Text>
          <Text>
            To {segment.originAndDestinationPair.destination.displayName} ({segment.originAndDestinationPair.destination.code})
            — {segment.originAndDestinationPair.destinationCity}
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default Screen;

