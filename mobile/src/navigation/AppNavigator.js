import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/colors';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import CartScreen from '../screens/CartScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Auth = createStackNavigator();
const App = createStackNavigator();

// 1. Unauthenticated Stack
const AuthStack = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: COLORS.BG_MAIN },
    }}
  >
    <Auth.Screen name="Login" component={LoginScreen} />
  </Auth.Navigator>
);

// 2. Authenticated Stack with new warm navigation header theme
const AppStack = () => (
  <App.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: COLORS.BG_CARD, // #EFE9E3
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BG_BORDER,
      },
      headerTintColor: COLORS.TEXT_PRIMARY, // #2D2D2D
      headerTitleStyle: {
        fontWeight: '700',
        color: COLORS.TEXT_PRIMARY, // #2D2D2D
      },
      cardStyle: { backgroundColor: COLORS.BG_MAIN }, // #F9F8F6
    }}
  >
    <App.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'SmartCart' }}
    />
    <App.Screen
      name="Scan"
      component={ScanScreen}
      options={{ title: 'Scan Barcode' }}
    />
    <App.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: 'Your Cart' }}
    />
    <App.Screen
      name="Payment"
      component={PaymentScreen}
      options={{ title: 'Checkout' }}
    />
  </App.Navigator>
);

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.BG_MAIN,
    card: COLORS.BG_CARD,
    text: COLORS.TEXT_PRIMARY,
    border: COLORS.BG_BORDER,
    primary: COLORS.ACCENT,
  },
};

// 3. Root Navigator: restores session & dynamically switches stacks
export const AppNavigator = () => {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        {user ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
