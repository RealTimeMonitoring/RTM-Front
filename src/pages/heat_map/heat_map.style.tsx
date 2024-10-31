import { StyleSheet, useWindowDimensions } from 'react-native';

export const heatMapStyle = (screnHeight?: number) =>
  StyleSheet.create({
    view: {
      height: '100%',
      width: '100%',
    },
    map: {
      width: '100%',
      height: screnHeight ?? 500,
    },
  });
