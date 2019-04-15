import React, {Component} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';

export default class ItemView extends Component{
	constructor(props){
		super(props);
	}
	render(){
		if(this.props.data.picUrl.length>0){
			return(
				<TouchableOpacity onPress={this.props.clickItem}>
					<View>
						{/* <Text style={itemStyle.title}>{this.props.data.description}</Text> */}
						<View style={itemStyle.contentView}>
							<Image style={itemStyle.image} source={{uri:this.props.data.picUrl}}/>
							<Text style={itemStyle.subTitle}>{this.props.data.title}</Text>
						</View>
						<Text style={itemStyle.time}>{this.props.data.ctime}</Text>
						<View style={itemStyle.line}></View>
					</View>
				</TouchableOpacity>
			);
		}else{
			return(
				<TouchableOpacity onPress={this.props.clickItem}>
					<View>
						{/* <Text style={itemStyle.title}> {this.props.data.description}</Text> */}
						<Text style={itemStyle.detail}> {this.props.data.title}</Text>
						<Text style={itemStyle.time}> {this.props.data.ctime}</Text>
						<View style={itemStyle.line}></View>
					</View>
				</TouchableOpacity>
			);
		}
	}
}
let itemStyle = StyleSheet.create({
	title:{
		marginTop:10,
		marginLeft:15,
		fontSize:20
	},
	image:{
		width:120,
		height:80,
		marginLeft:15,
		marginTop:5,
	},
	contentView:{
		flexDirection:'row',
		marginTop:5,
	},
	subTitle:{
		flex:1,
		fontSize:18,
		marginTop:5,
		marginRight:15,
		marginLeft:15,
		color:'rgb(111,111,111)',
	},
	detail:{
		flex:1,
		marginTop:10,
		marginLeft:15,
		fontSize:13,
		marginRight:15,
		color:'rgb(111,111,111)',
	},
	time:{
		alignSelf:'flex-end',
		marginRight:15,
	},
	line:{
		backgroundColor:'rgb(233,233,233)',
		marginLeft:15,
		marginRight:15,
		height:1,
		marginTop:5
	}
});