import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { UserProvider } from './UserContext';
import Login from './login';
import Register from './Register';
import Agenda from './Agenda';
import AddSchedule from './AddSchedule';
import EditSchedule from './EditSchedule';
import UserInfo from './UserInfo';
import EditUser from './EditUser';
import { CardStyleInterpolators } from '@react-navigation/stack';

//Navigator to allow movement between components
const Stack = createStackNavigator();

//Root component, the one that appears when you open the app
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/calendarIcon.png')} style={styles.image} />
      <Text style={styles.greeting}>Welcome to Funtempo!</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btn1}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.btn2}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: height * 0.2,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  btn1: {
    backgroundColor: 'orange',
    padding: 10,
    margin: 10,
    width: '45%',
    alignItems: 'center',
  },
  btn2: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    width: '45%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

//Component that declares what screens you can access within the components
//It associates each one with the component they're gonna render
const App = () => (
  <UserProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Agenda" component={Agenda} />
        <Stack.Screen name="AddSchedule" component={AddSchedule} />
        <Stack.Screen name="EditSchedule" component={EditSchedule} />
        <Stack.Screen name="UserInfo" component={UserInfo} />   
        <Stack.Screen name="EditUser" component={EditUser} />      
      </Stack.Navigator>
    </NavigationContainer>
  </UserProvider>
);

export default App;
