import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard
} from 'react-native';

class Register extends Component {
  static navigationOptions= ({navigation}) =>({
    title: 'Register',  
    headerRight:  
    <TouchableOpacity
      onPress={() => navigation.navigate('Home')}
      style={{margin:10,backgroundColor:'orange',padding:10}}>
      <Text style={{color:'#ffffff'}}>Home</Text>
    </TouchableOpacity>
  });  

  //Creates props to send the user's data to other components
  constructor(props){
    super(props)
    this.state = {
      userName: '',
      userEmail: '', 
      userPassword: '',
      userNameError: '',
      userEmailError: '',
      userPasswordError: '',
    }
  }

  //Handles validations and register when pressing the register button
  userRegister = () => {
    const { userName, userEmail, userPassword } = this.state;

    //Stores the validation of the email
    const emailRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z]+\.(com)$/;

    //Boolean to check if no warning has been triggered
    let hasError = false;

    //If empty, show the warning and prevent submit
    if (userName === "") {
      this.setState({ userNameError: 'Please enter your username' });
      hasError = true;
    } else {
      this.setState({ userNameError: '' });
    }

    //If empty or not valid, show the warning and prevent submit
    if (!emailRegex.test(userEmail)) {
      this.setState({ userEmailError: 'Please enter a valid email' });
      hasError = true;
    } else {
      this.setState({ userEmailError: '' });
    }

    //If empty, show the warning and prevent submit
    if (userPassword === "") {
      this.setState({ userPasswordError: 'Please enter a password' });
      hasError = true;
    } else {
      this.setState({ userPasswordError: '' });
    }

    //If no warning has been triggered, send the POST request to save the user 
    if (!hasError) {
      const data = {
        username: userName,
        email: userEmail,
        password: userPassword
      };

      fetch('http://192.168.1.100/users/post/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        //If the username is received, it means that the user was created
        if (responseJson.username) {
          alert("User created successfully");
          //Go to the agenda component sendind the user's data
          this.props.navigation.navigate("Agenda", {
            username: responseJson.username,
            password: responseJson.password,
            email: responseJson.email
          });
        } else {
          alert("That user already exists");
        }
      })
      .catch((error) => {
        console.error(error);
      });

      Keyboard.dismiss();
    }
  }

  //Render of the component's elements
  render() {
    return (
      <View style={styles.container}>
        <View style={{ width: 250, margin: 10 }}>
          {this.state.userNameError ? (
            <Text style={{ color: 'red' }}>{this.state.userNameError}</Text>
          ) : null}
          <TextInput
            placeholder="Enter Name"
            underlineColorAndroid="transparent"
            onChangeText={userName => this.setState({ userName })}
          />
        </View>

        <View style={{ width: 250, margin: 10 }}>
          {this.state.userEmailError ? (
            <Text style={{ color: 'red' }}>{this.state.userEmailError}</Text>
          ) : null}
          <TextInput
            placeholder="Enter Email"
            underlineColorAndroid="transparent"
            onChangeText={userEmail => this.setState({ userEmail })}
          />
        </View>

        <View style={{ width: 250, margin: 10 }}>
          {this.state.userPasswordError ? (
            <Text style={{ color: 'red' }}>{this.state.userPasswordError}</Text>
          ) : null}
          <TextInput
            placeholder="Enter Password"
            underlineColorAndroid="transparent"
            secureTextEntry
            onChangeText={userPassword => this.setState({ userPassword })}
          />
        </View>

        <TouchableOpacity
          onPress={this.userRegister}
          style={{ width: 250, padding: 10, backgroundColor: 'magenta', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Signup</Text>
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

export default Register;
