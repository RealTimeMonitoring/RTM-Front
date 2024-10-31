import { TextInput, View } from "react-native";
import { styles } from "./styles";

type Props = {
  value: any;
  event: any;
};

export default function MultilineInput({ value, event }: Props) {
  return (
    <TextInput
      multiline={true}
      numberOfLines={8}
      maxLength={307}
      style={styles.field}
      value={value}
      onChangeText={event}
    />
  );
}
