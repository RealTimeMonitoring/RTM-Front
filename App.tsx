import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from "./src/pages/HomePage";
import NotificationsPage from "./src/pages/NotificationsPage";
import HeaderTitle from "./src/components/HeaderTitle";

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" screenOptions={{headerTitleContainerStyle: {width: "100%", height: "100%"}}}>
                <Drawer.Screen name="Home" component={HomePage} options={{headerTitle: (props) => <HeaderTitle props={{...props}}/>}}/>
                <Drawer.Screen name="Notifications" component={NotificationsPage}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}