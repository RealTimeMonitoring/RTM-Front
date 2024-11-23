import React from "react";
import { View, Button, StyleSheet, Platform } from "react-native";
import { logout } from "../../data/service/AuthService";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./Styles";
import { AuthProps, useUser } from '../../contexts/UserContext';

export default function CustomDrawerContent(props: any)
{
    const { updateUser, activeUser } = useUser();
  const navigation = useNavigation();

  const handleLogout = () => {
    logout();
    updateUser(undefined);

    if (Platform.OS === "web") {
        window.location.reload();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
    }
  };
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <Button disabled={activeUser?.user == null} title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};
