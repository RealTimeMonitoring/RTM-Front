import { TextInput } from 'react-native';
import { styles } from './styles';

type Props = {
  value: any;
  event: any;
  placeHolder?: string;
  securityTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
};

export default function Input({
  value,
  event,
  placeHolder,
  securityTextEntry = false,
  editable,
  multiline = false,
}: Props) {
  return (
    <TextInput
      secureTextEntry={securityTextEntry}
      multiline={multiline}
      numberOfLines={multiline ? undefined : 8}
      maxLength={307}
      style={styles.field}
      value={value}
      onChangeText={event}
      editable={editable}
      placeholder={placeHolder}
    />
  );
}
