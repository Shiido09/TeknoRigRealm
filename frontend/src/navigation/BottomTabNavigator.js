import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

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

const BottomTabNavigator = () => {
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
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Me" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
