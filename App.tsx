import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './src/pages/home/HomePage';
import InsuranceClaimPage from './src/pages/insurance/InsuranceClaimPage';
import HeatMapPage from './src/pages/heat_map/heat_map_page';
import { useJsApiLoader } from '@react-google-maps/api';
import InsuranceListPage from './src/pages/insurance/list';
import { LoaderProvider } from './src/contexts/ScreenLoader';
import HeaderTitle from './src/components/HomeHeader';
import { AuthProps, UserProvider } from './src/contexts/UserContext';
import CustomDrawerContent from './src/components/CustomDrawer/CustomDrawerContent';
import { useEffect, useState } from 'react';
import { storageService } from './src/utils/Storage';

const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState<AuthProps>();

  const { isLoaded } = useJsApiLoader({
    mapIds: ['8e11dbeb36dc205f'],
    googleMapsApiKey: 'AIzaSyBB6jwcdzwVjOj9S5jioxt4TfdH1grQK6s',
    libraries: ['visualization'],
  });

  useEffect(() => {
    const initialVerification = async () => {
      const user = await storageService.getItem('activeUser');

      if (user) {
        setUser(JSON.parse(user) as AuthProps);
      }
    };

    initialVerification();
  }, []);

  return (
    <LoaderProvider>
      <UserProvider>
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName='Home'
            drawerContent={(props) => (
              <CustomDrawerContent
                {...props}
                onLogout={() => setUser(undefined)}
              />
            )} // Personaliza o Drawer
            screenOptions={{
              headerTitleContainerStyle: { width: '100%', height: '100%' },
            }}
          >
            <Drawer.Screen
              name='Home'
              component={HomePage}
              options={{
                headerTitle: (props) => (
                  <HeaderTitle title={props.children} OnAuth={setUser} />
                ),
              }}
            />
            <Drawer.Screen
              name='Registrar Sinistro'
              component={InsuranceClaimPage}
            />
            {user && (
              <Drawer.Screen
                name='Lista de Sinistros'
                component={InsuranceListPage}
                options={{
                  unmountOnBlur: true,
                }}
              />
            )}
            <Drawer.Screen
              name='Mapa de Calor'
              component={() => <HeatMapPage isLoaded={isLoaded}></HeatMapPage>}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </UserProvider>
    </LoaderProvider>
  );
}
