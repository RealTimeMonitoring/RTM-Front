import { Button, Text, View } from "react-native";
import * as React from "react";
import { syncData } from "../data/service/WMdataService";
import { LoaderContext } from "../contexts/ScreenLoader";
import CustomAlert from "./Alert";
import { set } from "react-hook-form";

export default function HeaderTitle(props: { title: string }) {
  const { showLoader, hideLoader } = React.useContext(LoaderContext);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<{
    title: string;
    message: string;
  }>({
    title: "",
    message: "",
  });

  const handleSync = async () => {
    showLoader();
    try {
      await syncData(setModalVisible, setModalContent);
      hideLoader();
    } catch (error) {
      hideLoader();
    }
  };

  return (
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text>{props.title}</Text>
      <Button title="Sincronizar dados" onPress={handleSync} />
      <CustomAlert
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalContent.title}
        message={modalContent.message}
      />
    </View>
  );
}
