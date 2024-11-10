import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Modal,
  Button,
} from "react-native";
import { fetchCategories } from "../../../data/service/WMdataService";
import WmData from "../../../models/WmData";
import React from "react";
import ListItems from "../../../components/ListItems";
import { LoaderContext } from "../../../contexts/ScreenLoader";

export default function InsuranceListPage() {
  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  const [items, setItems] = useState<WmData[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<WmData | undefined>();

  useEffect(() => {
    const loadCategories = async () => {
      if (offset === 0) {
        showLoader();
      } else {
        setActivityLoading(true);
      }

      try {
        if (reset) {
          const categories: WmData[] = await fetchCategories(offset);
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
  }, [offset]);

  const openModal = (item: WmData) => {
    setModalContent(item);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, display: "flex", justifyContent: "center" }}>
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
            return <ActivityIndicator size="large" color="#0000ff" />;
          } else {
            return <View />;
          }
        }}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            {modalContent && (
              <View style={{ gap: 5, paddingBottom: 25 }}>
                <Text>Registro: {modalContent.id}</Text>
                <Text>Categoria: {modalContent.category?.description}</Text>
                <Text>Referencia: {modalContent.category?.example}</Text>
                <Text>Valor: {modalContent.value}</Text>
                <Text>Vendor ID: {modalContent.vendorId}</Text>
                <Text>Latitude: {modalContent.latitude}</Text>
                <Text>Longitude: {modalContent.longitude}</Text>
                <Text>Data registro: {modalContent.dtInsert?.toString()}</Text>
              </View>
            )}
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
