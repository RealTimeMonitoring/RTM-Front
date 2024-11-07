import { ActivityIndicator, View } from 'react-native';
import { styles } from './styles';

export const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size='large' color='#0000ff' />
    </View>
  );
};
