import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';

const OtherScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ padding: 20 }}>
      <Text>我是 Other 页面</Text>
      <Button title="返回 List 页面" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default OtherScreen;
