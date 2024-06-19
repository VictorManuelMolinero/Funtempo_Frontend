import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';

const UserInfo = () => {
  const route = useRoute();
  //To go back to the agenda component
  const navigation = useNavigation();
  const { username, email, password } = route.params;

  //To hide the password from the user
  const hiddenPassword = '•'.repeat(password.length);

  //Shows the message to make sure the user wants to delete the account
  //If yes, call the method to delete it
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: deleteAccount },
      ]
    );
  };

  //Sends an API request to delete the account
  const deleteAccount = async () => {
    try {
      const response = await fetch(`http://192.168.1.100/users/${username}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        Alert.alert('Success', 'Account deleted');
        //Takes the user to the login screen, while also letting them go back
        //to the home screen
        navigation.dispatch(
          CommonActions.reset({
            index: 1, 
            routes: [
                { name: 'Home' }, 
                { name: 'Login' },
      ],
          })
        );
      } else {
        Alert.alert('Error', 'Failed to delete the account.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete the account.');
    }
  };

  //Takes the user to the login screen if they logout, 
  //while also letting them go back to the home screen
  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
            { name: 'Home' },
            { name: 'Login' },
      ],
      })
    );
  };

  //Renders the component's elements
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Password</Text>
        <Text style={styles.value}>{hiddenPassword}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditUser', { username, email, password })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  value: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserInfo;
