import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Modal, Button } from "react-native";
import { fetchCategories } from "../../../data/service/WMdataService";
import WmData from "../../../models/WmData";

export default function InsuranceListPage(props: { navigation: any }) {
  const [items, setItems] = useState<WmData[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<WmData | null>();

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        if (reset) {
          const categories = await fetchCategories(offset);
          setItems((olds) => [...olds, ...categories]);
          if (categories.length === 0 || categories.length < 65) {
            setReset(!reset);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [offset]);

  const openModal = (item: WmData) => {
    setModalContent(item);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center"}}>
        <FlatList
          onEndReached={() => {
            if (!loading && reset) setOffset(offset + 65);
          }}
          onEndReachedThreshold={0.1}
          data={items}
          renderItem={({ item }) => (
            <Text onPress={() => {openModal(item); console.log(item)}}>{item.id}</Text>
          )}
          ListFooterComponent={() => {
            if (loading) {
              return <ActivityIndicator size="large" color="#0000ff" />;
            } else {  
              <View></View>
          }}}
        >
        </FlatList>

        <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
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
              <Button title="Fechar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
    </View>
  );
}

