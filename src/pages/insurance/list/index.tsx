import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Modal,
  Button,
} from "react-native";
import { fetchDataOffset, updateData } from "../../../data/service/WMdataService";
import WmData from "../../../data/models/WmData";
import React from "react";
import ListItems from "../../../components/ListItems";
import { LoaderContext } from "../../../contexts/ScreenLoader";
import moment from "moment";
import CustomModal from "../../../components/Modal";
import Checkbox from "expo-checkbox";
import { sendData } from "../../../data/service/WMdataService";
import { useUser } from "../../../contexts/UserContext";

export default function InsuranceListPage() {
  const formatter = (data: string) => {
    return moment(data).format("DD/MM/YYYY HH:mm:ss");
  };

  const { loading, showLoader, hideLoader } = useContext(LoaderContext);

  const [items, setItems] = useState<WmData[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<WmData | undefined>();

  const {activeUser} = useUser();

  useEffect(() => {
    const loadCategories = async () => {
      if (offset === 0) {
        showLoader();
      } else {
        setActivityLoading(true);
      }

      try {
        if (reset) {
          const categories: WmData[] = await fetchDataOffset(offset);
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

  const handleSave = async () => {
    if ( activeUser && activeUser.user.role === 'ADMIN' && modalContent) {
      try {
        showLoader();
        updateData(modalContent);
        const updatedItems = items.map((item) =>
          item.id === modalContent.id ? modalContent : item
        );
        setItems(updatedItems); // Atualiza a lista local de itens
      } catch (error) {
        console.error("Erro ao atualizar o registro:", error);
      } finally {
        hideLoader();
        setModalVisible(false);
      }
    }
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

      <CustomModal
        visible={modalVisible}
        onClose={() => {setModalVisible(false); handleSave(); }}
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
            { activeUser && activeUser.user.role === 'ADMIN' && <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Checkbox
                  value={modalContent.status === "CLOSED"}
                  onValueChange={(newValue) =>
                    setModalContent({
                      ...modalContent,
                      status: newValue ? "CLOSED" : "OPEN",
                    })
                  }
                  color={modalContent.status === "CLOSED" ? "#4CAF50" : undefined}
                />
                <Text style={{ marginLeft: 8 }}>
                  {modalContent.status === "CLOSED" ? "Concluído" : "Em Aberto"}
                </Text>
            </View>}
          </View>
        )}
      </CustomModal>
    </View>
  );
}
