import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RobosScreen from '../screens/RobosScreen';
import SensoresScreen from '../screens/SensoresScreen';
import EntregasScreen from '../screens/EntregasScreen';

// Components
import CustomDrawerContent from '../components/CustomDrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="Robos"
        component={RobosScreen}
        options={{ title: 'Gerenciamento de Robôs' }}
      />
      <Stack.Screen
        name="Sensores"
        component={SensoresScreen}
        options={{ title: 'Monitoramento de Sensores' }}
      />
      <Stack.Screen
        name="Entregas"
        component={EntregasScreen}
        options={{ title: 'Rastreamento de Entregas' }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { signed, signOut } = useAuth();

  if (!signed) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent {...props} signOut={signOut} />
        )}
      >
        <Drawer.Screen
          name="MainStack"
          component={MainStack}
          options={{ title: 'LogiTrack' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 