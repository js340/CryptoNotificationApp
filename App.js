import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from "./src/navigation";
import WatchlistProvider from "./src/contexts/WatchlistContext";
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';


export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_900Black,
    DroidSans: require('./assets/fonts/DroidSans.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size={'large'} />
  }

  return (
    <NavigationContainer 
      theme={{
        colors: {
          background: '#121212',
        },
      }}
    >
      <WatchlistProvider>
        <View style={styles.container}> 
          <Navigation />
          <StatusBar style="light" />
        </View>
      </WatchlistProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 50,
  },
});
