import React from 'react';
import {View, Text, ActivityIndicator, Button, Alert, Dimensions} from 'react-native';
import {MainView, Collection, Details} from '../view/MainView';
import NavigationBar from '../view/NavigationBar';
import {createStackNavigator, createAppContainer} from 'react-navigation';
var {height,width} =  Dimensions.get('window');

const AppNavigator = createStackNavigator(
	{
		NewsRoot: MainView,
		NewsCollection: Collection,
		NewsDetails: Details,
	},
	{
    initialRouteName: "NewsRoot",
	}  
);
  
const News = createAppContainer(AppNavigator);

export default class NewsScreen extends React.Component {
  static navigationOptions = {
    header:null,
  };
  render() {
    return (
      <News/>
    );
  }
}
