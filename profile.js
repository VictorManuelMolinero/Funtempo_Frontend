import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import login from './login';
import Register from './Register';

export default class home extends Component{
static navigationOptions= ({navigation}) =>({
		  title: 'Welcome',	
	});  
	
	render(){
		const { navigate } = this.props.navigation;
		return(
	  <View style={styles.container}>	
	  
	   <Text style={styles.pageName}>profile</Text>
	   

      </View>
		);
	}
}
const styles = StyleSheet.create({
	container:{
		display:'flex',alignItems:'center',
		justifyContent:'center'
	},

	pageName:{
		margin:10,fontWeight:'bold',
		color:'#000', textAlign:'center'
	},

	
});


AppRegistry.RegisterComponent('profile', () => profile);
