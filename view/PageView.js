import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, FlatList, Text, Platform, ActivityIndicator} from 'react-native';
import NetTool from './../Tools/NetTool';
import ItemView from './ItemView';

const slideLeftOffset = 50;
const slideRightOffset = 150;

export default class PageView extends Component{

	constructor(props) {
		super(props);
		this.netTool = new NetTool();
		//this.netTool.getNewsData(3,1,(data)=>{console.log(data);});
		let dataArray = new Array();
		let refreshArray = new Array();
		for (let i = 0; i <= this.netTool.serialName.length; i++) {
			dataArray.push([]);
			refreshArray.push({page:1});
		}
	 	this.state = {
	 		dataArray:dataArray,
	 		refreshArray:refreshArray,
	 		loading:false,
	 		isRefreshing:false,
	 	};
	 	this.getData(0,1);
	 	this.selectedIndex=0;
	}
	contentView(width){
		let views = new Array();
		for (let i = 0; i < this.netTool.serialName.length; i++) {
			let element=(
				<FlatList key={String(i)} style={{width:width}} data={this.state.dataArray[i]}
				renderItem={({item})=>{
					return (<ItemView data={item} style={{fontSize:17}} clickItem={()=>{
						this.props.goDetails(item);
					}}/>);
				}}
				onScroll={(event)=>{            
				    let offsetY = event.nativeEvent.contentOffset.y;
				    let contentHeight = event.nativeEvent.contentSize.height;
				    let originHeight = event.nativeEvent.layoutMeasurement.height;
				    let index = Number.parseInt(this.selectedIndex);
				    //console.log("selectedIndex:"+index);
				    let segment = this.state.dataArray[index].length/20;
				    //console.log("segment:"+segment);
				    if(!this.state.loading){
				        if(offsetY+originHeight+200>=contentHeight){
				            if(this.state.refreshArray[index].page>segment){
				            	segment=segment+1;
				            }
				            this.state.refreshArray[index].page = segment+1;
				            this.setState({
				                loading:true,
				                refreshArray:this.state.refreshArray,
				            });
				            this.getData(index,segment+1);
				        }
				    }
				    //console.log(this.state.loading+","+offsetY);
				}}
				onContentSizeChange={(contentWidth, contentHeight)=>{
			    	this.releaseFlag();
				}}
				onRefresh={()=>{
					if(!this.state.isRefreshing){
						let index = Number.parseInt(this.selectedIndex);
						this.state.refreshArray[index].page = 1;
						this.setState({
							isRefreshing:true,
			                refreshArray:this.state.refreshArray,
			            });
						this.getData(index,1);
					}
				}}
				refreshing={this.state.isRefreshing}
				ListFooterComponent={()=>{
					return(
						<View style={{backgroundColor:'rgb(240,240,240)'}}>
							<ActivityIndicator animating={true} color="green" style={{alignSelf:'center',marginTop:10,marginBottom:10}} size='large'/>
						</View>
					);
				}}
				/>
				);
			views.push(element);
		}
		return views;
	}
	releaseFlag(){
		if(this.state.loading){
	        this.setState({
	            loading:false,
	        });
	    }
	    if(this.state.isRefreshing){
			this.setState({
	  			isRefreshing:false,
			});
		}
	}
	getData(index,page){
		this.netTool.getNewsData(index,page,(data)=>{
			let list=data.newslist;
			//console.log("data:"+data);
			let i=20*(page-1);
			if(list){
				list.forEach((item)=>{
					item.key = String(i++);
				});
			}else{
				if(data==="error"){
					alert("读取失败，请检查网络");
				}
				setInterval(()=>{
					this.releaseFlag();
				},500);
			}
			let array=this.state.dataArray;
			if(page==1){
				array[index]=list;
			}else{
				array[index]=array[index].concat(list);
			}
			this.setState({
				dataArray: array,
				isRefreshing:false,
			});
			//console.log(data);
		});
	}
	show(index){
		let windowSize = Dimensions.get('window');
		this.refs.scrollView.scrollTo({x:index*windowSize.width,animated:true});
		if(Platform.OS === 'android'){
			if(this.state.dataArray[index].length==0){
				this.getData(index,1);
			}
		}
		this.selectedIndex = index;
	}
	render(){
		let windowSize = Dimensions.get('window');
		//console.log(windowSize.width);
		return(
			<ScrollView showsHorizontalScrollIndicator={false} style={mainStyle.pageView} horizontal={true} pagingEnable={true} ref={'scrollView'} 
				onMomentumScrollEnd={(param)=>{
					//console.log(param.nativeEvent);
					let index=this.selectedIndex;
					let currentPos = param.nativeEvent.contentOffset.x;
					let offset = currentPos-index*windowSize.width;
					//console.log(offset,Number.parseInt(currentPos/windowSize.width));
					//setTimeout(()=>{
						if(offset<-slideRightOffset){
							//index=Number.parseInt(currentPos/windowSize.width-0.9);
							index=this.selectedIndex-1;
						}else if(offset<-slideLeftOffset){
							index=this.selectedIndex-1;
						}else if(offset>slideLeftOffset && offset<=slideRightOffset){
							index=this.selectedIndex+1;
						}else if(offset>slideRightOffset){
							//index=Number.parseInt(currentPos/windowSize.width+0.9);
							index=this.selectedIndex+1;
						}
						index=index<0?0:index;
						index=index>this.state.dataArray.length?this.state.dataArray.length:index;
						//console.log("pageview scroll to:",index);
						//console.log(this.state.dataArray);
						this.props.onScroll(index);
						if(this.state.dataArray[index].length==0){
							this.getData(index,1);
						}
						this.refs.scrollView.scrollTo({x:windowSize.width*index, animated:true});
						this.selectedIndex = index;
					//},100);
				}}>
				{this.contentView(windowSize.width)}
			</ScrollView>
		);
	}

}
let mainStyle=StyleSheet.create({
	pageView:{
		backgroundColor:'white',
	}
});