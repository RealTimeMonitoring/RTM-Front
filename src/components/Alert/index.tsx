import React from "react";
import { Modal, View, Text, Button } from "react-native";
import { styles } from "./styles";

interface AlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export default function CustomAlert({
  visible,
  onClose,
  title,
  message,
}: AlertProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title || "Sem título"}</Text>
          <Text style={styles.message}>{message || "Sem mensagem"}</Text>
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
