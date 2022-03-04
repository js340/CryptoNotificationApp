import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../../../firebase'

const ProfileScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
        navigation.navigate("LoginScreen");
    })
    .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.emailText}>Signed in as:  {auth.currentUser?.email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.button}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ProfileScreen;