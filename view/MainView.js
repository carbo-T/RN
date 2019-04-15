import React, {Component} from 'react';
import {View, StyleSheet, Text,TouchableOpacity,Alert } from 'react-native';
import {NavigationMain, NavigationDetails, NavigationCollection} from './NavigationBar';
import TitleBar from './TitleBar';
import PageView from './PageView';
import DetailPage from './DetailPage';
import CollectionView from './CollectionView';
import DataManager from '../Tools/DataManager';

export class MainView extends Component{
	static navigationOptions = ({ navigation }) => {
		return{
			title:'新闻主页',
			headerStyle: {
				backgroundColor: 'deepskyblue',
			},
			headerTitleContainerStyle: {
				justifyContent:'center',
				paddingLeft: 60,
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize:25,
			},
			headerRight: (
				<TouchableOpacity onPress={()=>{navigation.push('NewsCollection');}} style={{paddingRight:20}}>
					<Text style={{fontSize:20,color:"white"}}>收藏夹</Text>
				</TouchableOpacity>
			),
		}
	};
	render(){
		return(
			<View style={{flex:1}}>
				<TitleBar ref='titleBar' onPress={this.clickTitle}/>
				<PageView ref='pageView' onScroll={this.switchPage} goDetails={(item)=>{
					console.log(item);
					this.props.navigation.push('NewsDetails',{
						title:item.description,
						type:'detail',
						uri:item.url,
						subtitle:item.title
					});
				}}/>
			</View>
		);
	}
	clickTitle=(index)=>{
		//this.refs.pageView.getData(index,1);
		this.refs.pageView.show(index);
	}
	switchPage=(index)=>{
		this.refs.titleBar.selectTitle(index);
	}
}

export class Details extends Component{
	static navigationOptions = ({ navigation }) => {
		return{
			title:'详情',
			headerStyle: {
				backgroundColor: 'deepskyblue',
			},
			headerTitleContainerStyle: {
				justifyContent:'center',
			},
			headerTintColor: 'white',
			headerTitleStyle: {
				fontWeight: 'bold',
				fontSize:25,
			},
			headerRight:(
				<TouchableOpacity onPress={()=>{
					let result;
					DataManager.addCollection(navigation.getParam("subtitle","no-subtitle")+"&&"+navigation.getParam("uri","no-uri"),(temp)=>{
						result=temp;
						//console.log(result);
						if(result===true){
							Alert.alert("提示",navigation.getParam("title","no-title")+",添加收藏夹成功!");
						}else{
							Alert.alert("提示",navigation.getParam("title","no-title")+",重复收藏");
						}
					});
				}} style={{paddingRight:20}}>
					<Text style={{fontSize:20,color:"white"}}>添加收藏</Text>
				</TouchableOpacity>
			)
		}
	};
	render(){
		const title = this.props.navigation.getParam("title","no-title");
		const type = this.props.navigation.getParam("type","no-type");
		const uri = this.props.navigation.getParam("uri","no-uri");
		return(
			<View style={{flex:1}}>
				<DetailPage uri={uri}/>
			</View>
		);
	}
}
export class Collection extends Component{
	static navigationOptions = {
		title:'收藏夹',
		headerStyle: {
			backgroundColor: 'deepskyblue',
		},
		headerTitleContainerStyle: {
			justifyContent:'center',
			paddingRight: 60,
		},
		headerTintColor: 'white',
		headerTitleStyle: {
			fontWeight: 'bold',
			fontSize:25,
		},
	};
	render(){
		const title = this.props.navigation.getParam("title","no-title");
		const type = this.props.navigation.getParam("type","no-type");
		return(
			<View style={{flex:1}}>
				<CollectionView goDetail={(url)=>{
					this.props.navigation.push('NewsDetails',{
						title:"来自收藏夹",
						type:'detail',
						uri:(url.split("&&"))[1],
					});
				}}/>
			</View>
		);
	}
}
