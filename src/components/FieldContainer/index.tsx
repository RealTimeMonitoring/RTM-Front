import { DimensionValue, View } from 'react-native';
import { styles } from './styles';
import { ReactNode } from 'react';

interface FieldContainerProps {
  children: ReactNode;
  height?: number;
  width?: DimensionValue | undefined;
}

export default function FieldContainer({
  children,
  height,
  width,
}: FieldContainerProps) {
  return (
    <View
      style={[
        styles.container,
        width ? { width } : {},
        height ? { height } : {},
      ]}
    >
      {children}
    </View>
  );
}
