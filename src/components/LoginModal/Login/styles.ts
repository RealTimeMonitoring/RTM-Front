import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15,
    paddingVertical: 20,
  },
  loginContainer: {
    width: '100%',
  },
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    gap: 10,
    marginBottom: 10,
  },
  errorText: {
    color: '#cc4137',
    fontSize: 12,
  },
});