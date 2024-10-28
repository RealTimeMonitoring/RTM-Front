import * as React from "react";
import { Button, Pressable, Text, View } from "react-native";
import { homeStyle } from "./home_page.style";

export default function HomePage(props: { navigation: any }) {
  return (
    <View style={homeStyle.container}>
      <Text style={homeStyle.title}>
        BEM VINDO AO REAL TIME MONITORING ACESSE AS OPÇÕES DISPONÍVEIS NO MENU
        LATERAL
      </Text>
      <View style={homeStyle.buttonsContainer}>
        <Pressable
          style={homeStyle.button}
          onPress={() => props.navigation.navigate("Registrar Sinistro")}
        >
          <Text style={homeStyle.buttonText}>Registrar Sinistro</Text>
        </Pressable>
        <Pressable
          style={homeStyle.button}
          onPress={() => props.navigation.navigate("Mapa de Calor")}
        >
          <Text style={homeStyle.buttonText}>Visualizar Mapa de Calor</Text>
        </Pressable>
        <Pressable
          style={homeStyle.button}
          onPress={() => props.navigation.navigate("Registrar Categoria")}
        >
          <Text style={homeStyle.buttonText}>Registrar Categoria</Text>
        </Pressable>
      </View>
    </View>
  );
}
