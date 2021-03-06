import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'
import WatchListScreen from '../screens/WatchListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen'
import { Entypo, FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: '#181818'
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: ({ focused, color }) => (<Entypo name="home" size={focused ? 30 : 25} color={color} />)
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        tabBarIcon: ({ focused, color }) => (<Entypo  name="emoji-flirt" size={focused ? 30 : 25} color={color} />)
      }} />
      <Tab.Screen name="Watchlist" component={WatchListScreen} options={{
        tabBarIcon: ({ focused, color }) => (<FontAwesome  name="star" size={focused ? 30 : 25} color={color} />)
      }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;