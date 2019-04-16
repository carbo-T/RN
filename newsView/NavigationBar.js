import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';
import DataManager from '../Tools/DataManager';

export class NavigationMain extends Component{
	render(){
		return(
			<View style={naviStyle.bar}>
				<View style={naviStyle.textView}>
					<Text style={naviStyle.text}>
						{this.props.title}
					</Text>
				</View>
				<TouchableOpacity onPress={this.props.goCollection} style={naviStyle.rightButton}>
					<Text style={{fontSize:18}}>收藏夹</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

export class NavigationDetails extends Component{
	render(){
		return(
			<View style={naviStyle.bar}>
				<View style={naviStyle.textView}>
					<Text style={naviStyle.text}>
						{this.props.title}
					</Text>
				</View>
				<TouchableOpacity onPress={this.props.pop} style={naviStyle.leftButton}>
					<Text style={{fontSize:18}}>返回</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>{
					let result;
					DataManager.addCollection(this.props.url,(temp)=>{
						result=temp;
						console.log(result);
						if(result===true){
							Alert.alert("提示",this.props.title+",添加收藏夹成功!");
						}else{
							Alert.alert("提示",this.props.title+",重复收藏");
						}
					});
				}} style={naviStyle.rightButton}>
					<Text style={{fontSize:18}}>添加收藏</Text>
				</TouchableOpacity>
			</View>
		);	
	}
}

export class NavigationCollection extends Component{
	render(){
		return(
			<View style={naviStyle.bar}>
				<View style={naviStyle.textView}>
					<Text style={naviStyle.text}>
						{this.props.title}
					</Text>
				</View>
				<TouchableOpacity onPress={this.props.pop} style={naviStyle.leftButton}>
					<Text style={{fontSize:18}}>返回</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

let naviStyle=StyleSheet.create({
	bar:{
		height:64,
		backgroundColor:'skyblue',
		flexDirection:'row',
		paddingTop: 15
	},
	textView:{
		alignSelf:'center',
		justifyContent:'center',
		flex:1,
	},
	text:{
		textAlign:'center',
		fontSize:21,
	},
	rightButton:{
		position:'absolute',
		right:15,
		alignSelf:'center',
	},
	leftButton:{
		position:'absolute',
		left:15,
		alignSelf:'center',
	}
});