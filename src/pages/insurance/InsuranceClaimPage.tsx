import { Button, View, Text, ActivityIndicator, Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { WmCategory } from "../../models/WmCategory";
import WmFormFilds from "../../models/WmFormFields";
import { insuranceStyle } from "./insurance_page.style";
import Selector from "../../components/Picker";
import FieldContainer from "../../components/FieldContainer";
import MultilineInput from "../../components/MultilineInput";
import Input from "../../components/Input";

export default function InsuranceClaimPage(props: { navigation: any }) {
  const { control, handleSubmit, setValue } = useForm<WmFormFilds>();

  const [items, setItems] = useState<WmCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<WmCategory | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const onFieldChange = (itemValue: number) => {
    setSelectedProduct(items.find((opt) => opt.id === itemValue) || null);
    setValue("value", "");
  };

  const validateInput = (value: string) => {
    return selectedProduct
      ? new RegExp(selectedProduct.validateExpression).test(value)
      : true;
  };

  function onSubmit(data: WmFormFilds) {
    if (validateInput(data.value)) {
      console.log(data);
    } else {
      Alert.alert("Erro", "Puta vida");
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.0.144:9000/category", {
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
      <FieldContainer>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Controller
            control={control}
            name="productId"
            render={({ field: { onChange, value } }) => (
              <Selector
                value={value}
                onChange={(itemValue) => {
                  onChange(itemValue);
                  onFieldChange(itemValue);
                }}
                items={items}
              />
            )}
          />
        )}
      </FieldContainer>

      <Text>Descrição</Text>
      <FieldContainer height={120}>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <MultilineInput value={value ?? ""} event={onChange} />
          )}
        />
      </FieldContainer>

      <Text>Valor</Text>
      <FieldContainer>
        <Controller
          control={control}
          name="value"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              event={(text: string) => {
                if (validateInput(text)) {
                  onChange(text);
                }
              }}
              placeHolder={
                selectedProduct
                  ? `Exemplo: ${selectedProduct.example}`
                  : "Digite seu valor"
              }
            />
          )}
        />
      </FieldContainer>
      <Button onPress={handleSubmit(onSubmit)} title="Enviar" />
    </View>
  );
}
