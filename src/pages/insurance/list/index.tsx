import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  fetchDataOffset,
  updateData,
} from '../../../data/service/WMdataService';
import WmData from '../../../data/models/WmData';
import React from 'react';
import ListItems from '../../../components/ListItems';
import { LoaderContext } from '../../../contexts/ScreenLoader';
import moment from 'moment';
import CustomModal from '../../../components/Modal';
import Checkbox from 'expo-checkbox';
import { useUser } from '../../../contexts/UserContext';
import Selector from '../../../components/Picker';
import { fetchCategories } from '../../../data/service/WMCategoryService';
import { WmCategory } from '../../../data/models/WmCategory';
import DateTimePicker from 'react-native-ui-datepicker';
import { Dayjs } from 'dayjs';
import Input from '../../../components/Input';

type FilterProps = {
  category: string;
  startDate?: Date;
  endDate?: Date;
  status: 'OPEN' | 'CLOSED';
};

export default function InsuranceListPage() {
  const formatter = (data: string) => {
    return moment(data).format('DD/MM/YYYY HH:mm:ss');
  };

  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [showDateStartPicker, setShowPickerStartDate] = useState(false);

  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const [showDateEndPicker, setShowPickerEndDate] = useState(false);

  const [categories, setCategories] = useState<WmCategory[]>([]);

  const [items, setItems] = useState<WmData[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  const [filter, setFilter] = useState<FilterProps>({
    category: '',
    status: 'OPEN',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<WmData | undefined>();

  const { activeUser } = useUser();

  useEffect(() => {
    const loadItems = async () => {
      showLoader();
      try {
        const categories: WmCategory[] = await fetchCategories();
        setCategories(categories);
      } finally {
        hideLoader();
      }
    };

    loadItems();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      if (offset === 0) {
        showLoader();
      } else {
        setActivityLoading(true);
      }

      try {
        if (reset) {
          const categories: WmData[] = await fetchDataOffset(offset, {
            categoryId: filter.category,
            startDate: filter.startDate?.toLocaleDateString(),
            endDate: filter.endDate?.toLocaleDateString(),
            status: filter.status,
          });
          setItems((olds) => [...olds, ...categories]);
          if (categories.length === 0 || categories.length < 65) {
            setReset(!reset);
          }
        }
      } finally {
        if (offset === 0) {
          hideLoader();
        } else {
          setActivityLoading(false);
        }
      }
    };

    loadCategories();
  }, [
    offset,
    filter.category,
    filter.status,
    filter.startDate,
    filter.endDate,
  ]);

  const toggleStartDatePicker = useCallback(() => {
    setShowPickerStartDate((show) => !show);
  }, [showDateStartPicker]);

  const onStartDateChange = (date: Dayjs) => {
    resetValues();
    setFilter((oldFilter) => {
      return { ...oldFilter, startDate: date.toDate() };
    });
    setSelectedStartDate(date.toDate().toLocaleDateString());
    toggleStartDatePicker();
  };

  const toggleEndDatePicker = useCallback(() => {
    setShowPickerEndDate((show) => !show);
  }, [showDateEndPicker]);

  const onEndDateChange = (date: Dayjs) => {
    resetValues();
    setFilter((oldFilter) => {
      return { ...oldFilter, endDate: date.toDate() };
    });
    setSelectedEndDate(date.toDate().toLocaleDateString());
    toggleEndDatePicker();
  };

  const openModal = (item: WmData) => {
    setModalContent(item);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (activeUser && activeUser.user.role === 'ADMIN' && modalContent) {
      try {
        showLoader();
        updateData(modalContent);
        const updatedItems = items.map((item) =>
          item.id === modalContent.id ? modalContent : item
        );
        setItems(updatedItems); // Atualiza a lista local de itens
      } catch (error) {
        console.error('Erro ao atualizar o registro:', error);
      } finally {
        hideLoader();
        setModalVisible(false);
      }
    }
  };

  const resetValues = useCallback(() => {
    setOffset(0);
    setItems([]);
    setReset(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 50,
          width: '100%',
          paddingHorizontal: 20,
          display: 'flex',
          flexDirection: 'row',
          gap: 40,
        }}
      >
        <ScrollView
          style={{
            width: '100%',
            display: 'flex',
          }}
          horizontal={true}
        >
          <Selector
            style={{ marginBottom: 0, width: 200 }}
            items={categories}
            onChange={(categId) => {
              resetValues();
              setFilter((oldFilter) => {
                return { ...oldFilter, category: categId.toString() };
              });
            }}
          />
          <Pressable onPress={toggleStartDatePicker}>
            <Input
              placeHolder='Selecione a data inicial'
              value={selectedStartDate}
              event={setSelectedStartDate}
              editable={false}
            ></Input>
          </Pressable>
          <Pressable onPress={toggleEndDatePicker}>
            <Input
              placeHolder='Selecione a data final'
              value={selectedEndDate}
              event={setSelectedEndDate}
              editable={false}
            ></Input>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              value={filter.status === 'CLOSED'}
              onValueChange={(newValue) => {
                resetValues();
                setFilter({ ...filter, status: newValue ? 'CLOSED' : 'OPEN' });
              }}
              color={filter.status === 'CLOSED' ? '#4CAF50' : undefined}
            />
            <Text style={{ marginLeft: 8 }}>
              {filter.status === 'CLOSED' ? 'Concluído' : 'Em Aberto'}
            </Text>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          onEndReached={() => {
            if (!loading && reset) setOffset(offset + 1);
          }}
          onEndReachedThreshold={0.1}
          data={items}
          renderItem={({ item }) => (
            <ListItems
              item={item}
              onPress={() => {
                openModal(item);
                console.log(item);
              }}
            ></ListItems>
          )}
          ListFooterComponent={() => {
            if (activityLoading) {
              return <ActivityIndicator size='large' color='#0000ff' />;
            } else {
              return <View />;
            }
          }}
        />

        <CustomModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            handleSave();
          }}
        >
          {modalContent && (
            <View style={{ gap: 5, paddingBottom: 25 }}>
              <Text>Registro: {modalContent.id}</Text>
              <Text>Categoria: {modalContent.category?.description}</Text>
              <Text>Referencia: {modalContent.category?.example}</Text>
              <Text>Valor: {modalContent.value}</Text>
              <Text>Descrição: {modalContent.description}</Text>
              <Text>Vendor ID: {modalContent.vendorId}</Text>
              <Text>Latitude: {modalContent.latitude}</Text>
              <Text>Longitude: {modalContent.longitude}</Text>
              <Text>Data registro: {formatter(modalContent.dtInsert)}</Text>
              {activeUser && activeUser.user.role === 'ADMIN' && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox
                    value={modalContent.status === 'CLOSED'}
                    onValueChange={(newValue) =>
                      setModalContent({
                        ...modalContent,
                        status: newValue ? 'CLOSED' : 'OPEN',
                      })
                    }
                    color={
                      modalContent.status === 'CLOSED' ? '#4CAF50' : undefined
                    }
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {modalContent.status === 'CLOSED'
                      ? 'Concluído'
                      : 'Em Aberto'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </CustomModal>
      </View>
      <CustomModal
        onClose={toggleStartDatePicker}
        visible={showDateStartPicker}
      >
        <DateTimePicker
          mode='single'
          date={filter.startDate ?? new Date()}
          onChange={(value) => onStartDateChange(value.date as Dayjs)}
        />
      </CustomModal>
      <CustomModal onClose={toggleEndDatePicker} visible={showDateEndPicker}>
        <DateTimePicker
          mode='single'
          date={filter.endDate ?? new Date()}
          onChange={(value) => onEndDateChange(value.date as Dayjs)}
        />
      </CustomModal>
    </View>
  );
}
