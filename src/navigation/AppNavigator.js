import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RobotListScreen from '../screens/RobotListScreen';
import RobotDetailScreen from '../screens/RobotDetailScreen';
import SensorScreen from '../screens/SensorScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { isAuthenticated } from '../services/authService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação principal com tabs
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Robôs') {
            iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
          } else if (route.name === 'Sensores') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Entregas') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Robôs" component={RobotStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Sensores" component={SensorScreen} />
      <Tab.Screen name="Entregas" component={DeliveryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Stack navigator para a seção de robôs
const RobotStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lista de Robôs" component={RobotListScreen} />
      <Stack.Screen name="Detalhes do Robô" component={RobotDetailScreen} />
    </Stack.Navigator>
  );
};

// Navegador principal do app
const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // ou um componente de loading
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 