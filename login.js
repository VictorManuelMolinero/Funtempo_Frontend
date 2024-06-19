import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard
} from 'react-native';

class Login extends Component {
  //Creates props to send the user's data to other components
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      userPassword: '',
      usernameError: '',
      passwordError: '',
    };
  }

  //Handles validations and login when pressing the login button
  login = () => {
    const { username, userPassword } = this.state;
    //Boolean to check if no warning has been triggered
    let hasError = false;

    //If empty, show the warning and prevent submit
    if (username === "") {
      this.setState({ usernameError: 'Please enter your username' });
      hasError = true;
    } else {
      this.setState({ usernameError: '' });
    }

    //If empty, show the warning and prevent submit
    if (userPassword === "") {
      this.setState({ passwordError: 'Please enter your password' });
      hasError = true;
    } else {
      this.setState({ passwordError: '' });
    }

    //If no warning has been triggered, send the post request to get the user    
    if (!hasError) {
      fetch('http://192.168.1.100/users/post/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: userPassword
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.username) {
            //Go to the agenda component sendind the user's data
            this.props.navigation.navigate("Agenda", {
              username: responseJson.username,
              password: responseJson.password,
              email: responseJson.email
            });
          } else {
            alert("Wrong Login Details");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    Keyboard.dismiss();
  }

  //Render of the component's elements
  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: 200, margin: 10 }}>
          {this.state.usernameError ? (
            <Text style={{ color: 'red' }}>{this.state.usernameError}</Text>
          ) : null}
          <TextInput
            placeholder="Enter username"
            onChangeText={username => this.setState({ username })}
          />
        </View>

        <View style={{ width: 200, margin: 10 }}>
          {this.state.passwordError ? (
            <Text style={{ color: 'red' }}>{this.state.passwordError}</Text>
          ) : null}
          <TextInput
            placeholder="Enter Password"
            secureTextEntry
            onChangeText={userPassword => this.setState({ userPassword })}
          />
        </View>

        <TouchableOpacity
          onPress={this.login}
          style={{ width: 200, padding: 10, backgroundColor: 'magenta', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default Login;
