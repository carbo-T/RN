import React, {Component} from 'react';
import {View, StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import DataManager from '../Tools/DataManager';

export default class CollectionView extends Component{
	constructor(props) {
		super(props);
		let data = new Array();
		this.state = {
			dataArray:new Array(),
		};
		DataManager.getData((array)=>{
			//console.log(array);
			for(let i=0;i<array.length;i++){
				if(array[i].length===0){
					continue;
				}
				data.push({key:String(i),url:array[i]});
				this.setState({
					dataArray:data,
				});
			}
		});
	}
	render(){
		return(
			<View style={{flex:1,backgroundColor:'white'}}>
				<FlatList style={collectionStyle.list} data={this.state.dataArray} renderItem={({item})=>{
					return(
						<TouchableOpacity onPress={()=>{this.props.goDetail(item.url);}}>
							<View>
								<Text style={collectionStyle.text}>
									{item.url.split("&&")[0]}
								</Text>
								<Text style={collectionStyle.line}></Text>
							</View>
						</TouchableOpacity>
					);
				}}/>
			</View>
		);
	}
}

let collectionStyle=StyleSheet.create({
	text:{
		fontSize:15,
		marginLeft:15,
		marginRight:15,
		marginBottom:10,
		marginTop:10,
	},
	line:{
		marginLeft:15,
		marginRight:15,
		height:1,
		backgroundColor:'rgb(111,111,111)',
		marginBottom:10
	}
});