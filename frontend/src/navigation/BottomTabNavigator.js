import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Import screens
import LandingPage from '../screens/LandingPage';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import styles
import styles from '../styles/navigation/BottomTabNavigatorStyles';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => {
  // Display the full name for all tabs
  const displayName = name;
  
  return (
    <View style={styles.iconContainer}>
      <Text 
        style={[styles.label, focused ? styles.activeLabel : {}]}
        numberOfLines={1}
      >
        {displayName}
      </Text>
    </View>
  );
};

const BottomTabNavigator = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status whenever the tab navigator is focused
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // Also check when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', checkLoginStatus);
    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={LandingPage} />
      {isLoggedIn && (
        <>
          <Tab.Screen name="Notification" component={NotificationScreen} />
          <Tab.Screen name="Me" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
