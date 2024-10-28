import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import { Button, View, SafeAreaView, TextInput } from "react-native";
import { insuranceStyle } from "./insurance_page.style";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { WmCategory } from "../../models/WmCategory";
import WmFormFilds from "../../models/WmFormFields";
import Input from "../../components/Input";

export default function InsuranceClaimPage(props: { navigation: any }) {
  function onSubmit(data: WmFormFilds) {
    console.log(data);
  }

  const { control, handleSubmit } = useForm<WmFormFilds>();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<ItemType<WmCategory>[]>([]);

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
      .then((categories) => {
        let items: ItemType<WmCategory>[] = [];

        categories?.map((category) =>
          items.push({
            testID: category.id.toString(),
            label: category.description,
            value: category,
          })
        ) ?? [];

        console.log(categories);

        setItems(items);
        setLoading(false);
      });
  }, []);

  return (
    <View style={insuranceStyle.container} >
      <text>
        ProductId
      </text>
      <DropDownPicker<WmCategory>
          open={open}
          placeholder="Selecione um item"
          disabled={loading}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <text>
          Descrição
        </text>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <Input value={value} event={onChange} />
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
