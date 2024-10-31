import { TextInput } from "react-native";
import { styles } from "./styles";

type Props = {
  value: any;
  event: any;
  placeHolder?:string;
};

export default function Input({ value, event, placeHolder }: Props) {
  return (
    <TextInput
      multiline={true}
      numberOfLines={8}
      maxLength={307}
      style={styles.field}
      value={value}
      onChangeText={event}
      placeholder={placeHolder}
    />
  );
}