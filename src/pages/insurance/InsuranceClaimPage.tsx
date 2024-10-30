import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import {
  Button,
  View,
  SafeAreaView,
  TextInput,
  Text,
  SectionList,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { WmCategory } from "../../models/WmCategory";
import WmFormFilds from "../../models/WmFormFields";
import Input from "../../components/Input";
import { insuranceStyle } from "./insurance_page.style";
import { Picker } from "@react-native-picker/picker";
import Selector from "../../components/Picker";


export default function InsuranceClaimPage(props: { navigation: any }) {
  function onSubmit(data: WmFormFilds) {
    console.log(data);
  }

  const { control, handleSubmit } = useForm<WmFormFilds>();

  const [items, setItems] = useState<WmCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:9000/category", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then<WmCategory[]>((response) => response.json())
      .then((items) => {
        setItems(items);
        setLoading(false);
      });
  }, []);

  return (
    <View style={insuranceStyle.container}>
      <Text>ProductId</Text>
      <Controller
        control={control}
        name="productId"
        defaultValue={0}
        disabled={loading}
        render={({ field: { value, onChange } }) => (
            <Selector 
              value={value}
              onChange={onChange}
              items={items}
            />
        )}
      />
      <Text>Descrição</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => (
          <Input value={value ?? ''} event={onChange} />
        )}
      />
      {/* <Controller
          control={control}
          name="value"
          render={({ field: { value, onChange } }) => (
            <TextInput style={insuranceStyle.textinput}  value={value} onChangeText={onChange} />
          )}
        />  */}
      <Button onPress={handleSubmit(onSubmit)} title="Enviar" />
    </View>
  );
}
