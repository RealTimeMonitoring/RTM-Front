import { StyleSheet } from 'react-native';

export const insuranceStyle = StyleSheet.create({
  listContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  filterContainer: {
    width: '100%',
    display: 'flex',
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterPicker: {
    height: 50,
      width: '100%',
  }
});
