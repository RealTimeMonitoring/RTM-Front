import { View } from "react-native";
import { styles } from "./styles";
import { ReactNode } from "react";

interface FieldContainerProps {
  children: ReactNode;
  height?: number;
}

export default function FieldContainer({
  children,
  height,
}: FieldContainerProps) {
  return (
    <View style={[styles.container, height ? { height } : {}]}>{children}</View>
  );
}
