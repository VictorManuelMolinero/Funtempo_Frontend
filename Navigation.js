import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './App';
import Login from './login';
import Register from './Register';
import Profile from './profile';
import Agenda from './Agenda';
import UserInfo from './UserInfo'
import EditUser from './EditUser';

const Stack = createStackNavigator();

const UsersManager = () => {
  return (
    <NavigationContainer style={{ flex: 1, width: '100%' }}>
      <Stack.Navigator
        screenOptions={{
          cardStyle: { flex: 1, width: '100%' },
        }}
        style={{ flex: 1, width: '100%' }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Agenda" component={Agenda} />
        <Stack.Screen name="UserInfo" component={UserInfo} />
        <Stack.Screen name="EditUser" component={EditUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default UsersManager;