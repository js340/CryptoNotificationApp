import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CoinDetailedScreen from '../screens/CoinDetailedScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LoginScreen from '../screens/LoginScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name='LoginScreen' component={LoginScreen}/>
      <Stack.Screen name='Root' component={BottomTabNavigator}/>
      <Stack.Screen name='HomeScreen' component={HomeScreen}/>
      <Stack.Screen name='CoinDetailedScreen' component={CoinDetailedScreen}/>
      <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
    </Stack.Navigator>
  )
}

export default Navigation;