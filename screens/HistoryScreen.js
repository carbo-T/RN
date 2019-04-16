import React, {Component} from 'react';
import {Text} from 'react-native';
import HistoryView from '../historyView/HistoryView';

export default class HistoryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
		return{
			title:'历史今日',
			headerStyle: {
				backgroundColor: 'lavender',
			},
			headerTitleContainerStyle: {
				justifyContent:'center',
			},
			headerTintColor: 'black',
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize:25,
			},
		}
	};

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <HistoryView />
    );
  }
}
