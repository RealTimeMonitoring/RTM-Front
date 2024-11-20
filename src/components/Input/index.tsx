import { TextInput } from 'react-native';
import { styles } from './styles';

type Props = {
  value: any;
  event: any;
  placeHolder?: string;
  securityTextEntry?: boolean;
};

export default function Input({
  value,
  event,
  placeHolder,
  securityTextEntry,
}: Props) {
  return (
    <TextInput
      secureTextEntry={securityTextEntry}
      multiline={true && !securityTextEntry}
      numberOfLines={securityTextEntry ? undefined : 8}
      maxLength={307}
      style={styles.field}
      value={value}
      onChangeText={event}
      placeholder={placeHolder}
    />
  );
}
