import * as React from 'react';
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { homeStyle } from './home_page.style';

export default function HomePage(props: { navigation: any }) {
  const styles = homeStyle(useWindowDimensions().width < 800);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        BEM VINDO AO REAL TIME MONITORING ACESSE AS OPÇÕES DISPONÍVEIS NO MENU
        LATERAL
      </Text>
      <SafeAreaView style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.navigate('Registrar Sinistro')}
        >
          <Text style={styles.buttonText}>Registrar Sinistro</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => props.navigation.navigate('Mapa de Calor')}
        >
          <Text style={styles.buttonText}>Visualizar Mapa de Calor</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
