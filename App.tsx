import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from "./src/pages/home/HomePage";
import HeaderTitle from "./src/components/HeaderTitle";
import InsuranceClaimPage from "./src/pages/insurance/InsuranceClaimPage";
import HeatMapPage from "./src/pages/heat_map/heat_map_page";
import CategoryFormPage from "./src/pages/category/CategoryFormPage";
import { registerRootComponent } from 'expo';

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" screenOptions={{headerTitleContainerStyle: {width: "100%", height: "100%"}}}>
                <Drawer.Screen name="Home" component={HomePage} options={{headerTitle: (props) => <HeaderTitle props={{...props}}/>}}/>
                <Drawer.Screen name="Registrar Sinistro" component={InsuranceClaimPage}/>
                <Drawer.Screen name="Mapa de Calor" component={HeatMapPage}/>
                <Drawer.Screen name="Registrar Categoria" component={CategoryFormPage}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}