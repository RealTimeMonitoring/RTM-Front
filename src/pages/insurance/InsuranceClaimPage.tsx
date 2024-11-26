import { Button, View, Text, ActivityIndicator } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { WmCategory } from '../../data/models/WmCategory';
import WmFormFilds from '../../data/models/WmFormFields';
import { insuranceStyle } from './insurance_page.style';
import Selector from '../../components/Picker';
import FieldContainer from '../../components/FieldContainer';
import MultilineInput from '../../components/MultilineInput';
import Input from '../../components/Input';
import * as Location from 'expo-location';
import { sendData } from '../../data/service/WMdataService';
import CustomAlert from '../../components/Alert';
import { fetchCategories } from '../../data/service/WMCategoryService';

export default function InsuranceClaimPage() {
  const { control, handleSubmit, setValue, reset } = useForm<WmFormFilds>();

  const [items, setItems] = useState<WmCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<WmCategory | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: '',
    message: '',
  });

  const onFieldChange = (itemValue: WmCategory | undefined) => {
    setSelectedProduct(itemValue ?? null);
  };

  const validateInput = (value: string) => {
    return selectedProduct && value.length > 0
      ? new RegExp(selectedProduct.validateExpression).test(value)
      : true;
  };

  function onSubmit(data: WmFormFilds) {
    if (validateInput(data.value)) {
      data.latitude = location?.latitude ?? 0;
      data.longitude = location?.longitude ?? 0;

      sendData(data)
        .then(() => {
          showAlert('Sucesso', 'Registro realizado');
          reset({
            productId: 0,
            description: '',
            value: '',
          });
        })
        .catch(() => showAlert('Erro', 'Erro ao enviar o registro'));
    }
  }

  function showAlert(title: string, message: string) {
    setModalContent({ title, message });
    setModalVisible(true);
  }

  useEffect(() => {
    setLoading(true);
    fetchCategories().then((items) => {
      setItems(items);
      setLoading(false);
    });

    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } else {
        <CustomAlert
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title='Erro'
          message='Permissão para acessar a localização foi negada'
        ></CustomAlert>;
      }
    };

    fetchLocation();
  }, []);

  return (
    <View style={insuranceStyle.container}>
      <Text>ProductId</Text>
      <FieldContainer>
        {loading ? (
          <ActivityIndicator size='small' color='#0000ff' />
        ) : (
          <Controller
            control={control}
            name='productId'
            render={({ field: { onChange, value } }) => (
              <Selector
                value={value}
                onChange={(itemValue) => {
                  onChange(itemValue);
                  onFieldChange(items.find((item) => item.id === Number(itemValue)))
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
          name='description'
          render={({ field: { value, onChange } }) => (
            <MultilineInput value={value ?? ''} event={onChange} />
          )}
        />
      </FieldContainer>

      <Text>Valor</Text>
      <FieldContainer>
        <Controller
          control={control}
          name='value'
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
                  : 'Digite seu valor'
              }
            />
          )}
        />
      </FieldContainer>
      <Button onPress={handleSubmit(onSubmit)} title='Enviar' />

      <CustomAlert
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </View>
  );
}
