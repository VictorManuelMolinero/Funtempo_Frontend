import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditUser = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { username, email, password } = route.params;

  //To save the user's data
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState(password);
  const [usernameError, setUsernameError] = useState('');
  //To check if the warning messages should appear
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameTakenError, setUsernameTakenError] = useState('');

  //Stores the validation of the email
  const emailRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z]+\.(com)$/;

  //It's executed when the button to apply the changes have been pressed
  const handleApplyChanges = async () => {
    //Boolean to know if no warning has been triggered
    let isValid = true;

    //If empty, show the warning and prevent submit
    if (newUsername === "") {
      setUsernameError('Please enter your username');
      isValid = false;
    } else {
      setUsernameError('');
    }

    //If empty or not valid, show the warning and prevent submit
    if (!emailRegex.test(newEmail)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    //If empty, show the warning and prevent submit
    if (newPassword === "") {
      setPasswordError('Please enter a password');
      isValid = false;
    } else {
      setPasswordError('');
    }

    //If no warning has been triggered, send the put request to edit the user
    if (isValid) {
      try {
        const response = await fetch(`http://192.168.1.100/users/${username}/`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: newUsername,
            email: newEmail,
            password: newPassword,
          })
        });
        if (response.ok) {
          //Clears the user taken warning if present
          setUsernameTakenError('');
          //Navigates to the userInfo component, sendind the user's data
          navigation.navigate('UserInfo', { username: newUsername, email: newEmail, password: newPassword });
        } else if (response.status === 400) {
          //If the Api returns a 400 error, it's because that username is already taken
          setUsernameTakenError('Username already taken');
        } else {
          Alert.alert('Error', 'Failed to update the user information.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to update the user information.');
      }
    } else {
      //Clears the user taken warning if present
      setUsernameTakenError('');
    }
  };

  //Render of the component's elements
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username</Text>
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        {usernameTakenError ? <Text style={styles.errorText}>{usernameTakenError}</Text> : null}
        <TextInput
          style={styles.input}
          value={newUsername}
          onChangeText={setNewUsername}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email</Text>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Password</Text>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate('UserInfo', { username, email, password })}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyChanges}
        >
          <Text style={styles.buttonText}>Apply Changes</Text>
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
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5, // Add margin between buttons
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5, // Add margin between buttons
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditUser;
