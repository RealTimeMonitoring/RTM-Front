import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Modal,
  Button,
} from 'react-native';
import { fetchCategories } from '../../../data/service/WMdataService';
import WmData from '../../../models/WmData';
import React from 'react';
import { LoaderContext } from '../../../contexts/ScreenLoader';

export default function InsuranceListPage() {
  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  const [items, setItems] = useState<WmData[]>([]);
  const [activityLoading, setctivityLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<WmData | undefined>();

  useEffect(() => {
    const loadCategories = async () => {
      if (offset === 0) {
        showLoader();
      } else {
        setctivityLoading(true);
      }

      try {
        if (reset) {
          setTimeout(async () => {
            const categories: WmData[] = await fetchCategories(offset);
            setItems((olds) => [...olds, ...categories]);
            if (categories.length === 0 || categories.length < 65) {
              setReset(!reset);
            }
          }, 3000);
        }
      } finally {
        if (offset === 0) {
          hideLoader();
        } else {
          setctivityLoading(false);
        }
      }
    };

    loadCategories();
  }, [offset]);

  const openModal = (item: WmData) => {
    setModalContent(item);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <FlatList
        onEndReached={() => {
          if (!loading && reset) setOffset(offset + 65);
        }}
        onEndReachedThreshold={0.1}
        data={items}
        renderItem={({ item }) => (
          <Text
            onPress={() => {
              openModal(item);
              console.log(item);
            }}
          >
            {item.id}
          </Text>
        )}
        ListFooterComponent={() => {
          if (activityLoading) {
            return <ActivityIndicator size='large' color='#0000ff' />;
          } else {
            <View></View>;
          }
        }}
      ></FlatList>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            {modalContent && (
              <>
                <Text>ID: {modalContent.id}</Text>
                <Text>Categoria: {modalContent.productId}</Text>
                <Text>Valor: {modalContent.value}</Text>
                <Text>Vendor ID: {modalContent.vendorId}</Text>
                <Text>Latitude: {modalContent.latitute}</Text>
                <Text>Logitude: {modalContent.longitude}</Text>
                <Text>Exemplo: {modalContent.dt_insert?.toString()}</Text>
              </>
            )}
            <Button title='Fechar' onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
