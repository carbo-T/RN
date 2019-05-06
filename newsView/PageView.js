import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, FlatList, Text, Platform, ActivityIndicator,PanResponder} from 'react-native';
import NetTool from './../Tools/NetTool';
import ItemView from './ItemView';

const slidePageOffset = 50;
const slideMultiPagesOffset = 150;

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

	// componentWillMount(){
	// 	let windowSize = Dimensions.get('window');
    //     this._panResponder = PanResponder.create({
    //         onStartShouldSetPanResponder: (evt, gestureState) => {
    //             return true;
    //         },
    //         onMoveShouldSetPanResponder:  (evt, gestureState) => {
    //             return true;
	// 		},
	// 		onStartShouldSetResponderCapture: (evt, gestureState) => {
	// 			if(gestureState.vx>0.3 || gestureState.vx<-0.3){
	// 				return true;
	// 			}else{
	// 				return false;
	// 			}
	// 		},
	// 		onMoveShouldSetResponderCapture: (evt, gestureState) => {
	// 			if(gestureState.vx>0.3 || gestureState.vx<-0.3){
	// 				return true;
	// 			}else{
	// 				return false;
	// 			}
	// 		},
    //         onPanResponderGrant: (evt, gestureState) => {   
    //         },
    //         onPanResponderMove: (evt, gestureState) => {
    //             console.log(`gestureState.dx : ${gestureState.dx}   gestureState.dy : ${gestureState.dy}`);
    //             console.log(`gestureState.vx : ${gestureState.vx}   gestureState.vy : ${gestureState.vy}`);
    //         },
    //         onPanResponderRelease: (evt, gestureState) => {
    //         },
    //         onPanResponderTerminate: (evt, gestureState) => {
    //         },
    //     });
    // }

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
				setTimeout(()=>{
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
			// <View {...this._panResponder.panHandlers}>
				<ScrollView showsHorizontalScrollIndicator={false} style={mainStyle.pageView} horizontal={true} 
				// pagingEnable={true} 
				ref={'scrollView'} 
				decelerationRate={0.1}
				snapToInterval={windowSize.width}
				snapToAlignment={"center"}
				onMomentumScrollEnd={(param)=>{
						//console.log(param.nativeEvent);
						let index=this.selectedIndex;
						let currentPos = param.nativeEvent.contentOffset.x;
						let offset = currentPos-index*windowSize.width;
						//console.log(offset,windowSize.width);
						//console.log(param.nativeEvent.velocity);
						//setTimeout(()=>{
							if(offset<-slideMultiPagesOffset){
								//index=Number.parseInt(currentPos/windowSize.width-0.9);
								index=this.selectedIndex-1;
							}else if(offset<-slidePageOffset){
								index=this.selectedIndex-1;
							}else if(offset>slidePageOffset && offset<=slideMultiPagesOffset){
								index=this.selectedIndex+1;
							}else if(offset>slideMultiPagesOffset){
								//index=Number.parseInt(currentPos/windowSize.width+0.9);
								index=this.selectedIndex+1;
							}
							index=index<0?0:index;
							index=index>this.state.dataArray.length?this.state.dataArray.length:index;
							//console.log("pageview scroll to:",index);
							//console.log(this.state.dataArray);
							this.refs.scrollView.scrollTo({x:windowSize.width*index, animated:false});
							this.props.onScroll(index);
							if(this.state.dataArray[index].length==0){
								this.getData(index,1);
							}
							this.selectedIndex = index;
						//},100);
					}}
					// // 限制左右滑动范围
					// onScroll={(param)=>{
					// 	let index=this.selectedIndex;
					// 	let currentPos = param.nativeEvent.contentOffset.x;
					// 	let offset = currentPos-index*windowSize.width;
					// 	console.log(offset);
					// 	if(offset>windowSize.width-slidePageOffset || offset<-windowSize.width+slidePageOffset){
					// 		this.refs.scrollView.scrollEnabled = false;
					// 	}else{
					// 		this.refs.scrollView.scrollEnabled = true;
					// 	}
					// }}
					>
					{this.contentView(windowSize.width)}
				</ScrollView>
			// </View>
		);
	}

}
let mainStyle=StyleSheet.create({
	pageView:{
		backgroundColor:'white',
	}
});