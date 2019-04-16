import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class DetailPage extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let uri=this.props.uri;
		return(
			<WebView source={{uri:uri}}/>
		);
	}
}