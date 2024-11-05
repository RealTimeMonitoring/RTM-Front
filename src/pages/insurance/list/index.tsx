import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { fetchCategories } from "../../../data/service/WMdataService";
import { WmCategory } from "../../../models/WmCategory";
import { set } from "react-hook-form";

export default function InsuranceListPage(props: { navigation: any }) {
  const [items, setItems] = useState<WmCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reset, setReset] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        if (reset) {
          const categories = await fetchCategories(offset);
          console.log("categories:", categories.length);
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

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
        <FlatList
          onEndReached={() => {
            if (!loading && reset) setOffset(offset + 65);
          }}
          onEndReachedThreshold={0.1}
          data={items}
          renderItem={({ item }) => (
            <Text onPress={() => console.log(item)}>{item.id}</Text>
          )}
          ListFooterComponent={() => {
            if (loading) {
              return <ActivityIndicator size="large" color="#0000ff" />;
            } else {  
              <View></View>
          }}}
        >
        </FlatList>
    </View>
  );
}
