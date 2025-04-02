import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileDetailsScreen from '../screens/ProfileDetailsScreen';
import MyOrdersScreen from '../screens/MyOrdersScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutDetailsScreen from '../screens/CheckoutDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // Reference to the navigation container
  const navigationRef = useRef(null);

  return (
    <NavigationContainer ref={navigationRef} onStateChange={() => {
      // This will trigger when navigation state changes (including after login/logout)
      const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
      // Force update of tabs by remounting when we navigate to 'Main'
      if (currentRouteName === 'Main') {
        const key = new Date().getTime(); // Force remount with new key
        navigationRef.current?.setParams({ key });
      }
    }}>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={BottomTabNavigator}
          options={({ route }) => ({
            key: route.params?.key || 'default',
          })}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="CheckoutDetails" component={CheckoutDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
