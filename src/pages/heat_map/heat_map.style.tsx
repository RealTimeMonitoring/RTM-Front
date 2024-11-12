import { StyleSheet, useWindowDimensions } from 'react-native';

export const heatMapStyle = (screnHeight?: number) =>
  StyleSheet.create({
    view: {
      height: '100%',
      width: '100%',
    },
    viewContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    picker: {
      height: 50,
      width: '100%',
    },
    map: {
      width: '100%',
      height: (screnHeight ?? 500) - 50,
    },
  });
