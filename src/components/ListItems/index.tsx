import React from "react";
import { GestureResponderEvent, View, StyleSheet, Text } from "react-native";
import WmData from "../../models/WmData";
import moment from "moment";

const formatter = (data: string) => {
  return moment(data).format("DD/MM/YYYY HH:mm:ss");
};

interface ListItemsProps {
  item: WmData;
  onPress: (event: GestureResponderEvent) => void;
}

export default function ListItems({ item, onPress }: ListItemsProps) {
  return (
    <View style={styles.container}>
      <Text onPress={onPress} style={styles.item}>
        {item.id} - {formatter(item.dtInsert)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  item: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
