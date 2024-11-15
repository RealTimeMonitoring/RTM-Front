import { ReactNode } from "react";
import { Button, Modal, View } from "react-native";
import { styles } from "./styles";

interface AlertProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CustomModal({
  visible,
  onClose,
  children,
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
          {children}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
