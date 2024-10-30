import { Picker } from "@react-native-picker/picker";
import { useRef } from "react";

export default function Selector(props: {
  value: number;
  onChange: (...event: any[]) => void;
  items: any[];
}) {
  const pickerRef = useRef();

  return (
    <Picker
      ref={pickerRef.current}
      selectedValue={props.value}
      onValueChange={(value) => props.onChange(value)}
    >
      <Picker.Item key={0} label="Selecione um valor" value={0} />
      {props.items.map((categ, idx) => (
        <Picker.Item label={categ.description} key={idx} value={categ.id} />
      ))}
    </Picker>
  );
}
