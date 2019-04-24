import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Text, Dimensions} from 'react-native';

export default class TitleBar extends Component{
	constructor(props) {
		super(props);
		//标题数组
		this.dataArray=[
			"社会新闻","国内新闻","国际新闻","娱乐要闻","体育新闻",
			"NBA新闻","足球要闻","科技新闻","创业新闻","苹果新闻",
			"军事新闻","移动互联","旅游资讯","健康知识","奇闻异事",
			"美女图片","VR科技","IT资讯","区块链新闻","人工智能"
		]
		let selectedTitles = new Array();
		for (let i = 0; i < this.dataArray.length; i++) {
			if(i==0){
				selectedTitles.push("rgb(0,0,0)");
			}else{
				selectedTitles.push("rgb(111,111,111)");
			}
		}
		this.state = {
			selected:selectedTitles,
		};
		this.selectedIndex=0;
	}
	render(){
		return(
			<ScrollView style={titleBarStyle.bar} contentContainerStyle={{alignItems:'flex-end'}} horizontal={true}
			showsHorizontalScrollIndicator={false} ref={"scrollView"}>
				{this.createTips()}
			</ScrollView>
		);
	}
	selectTitle(index){
		let windowSize = Dimensions.get('window');
		let selectedTitles = [...this.state.selected];
		selectedTitles[index]="rgb(0,0,0)";
		if(index!=this.selectedIndex){
			selectedTitles[this.selectedIndex]="rgb(111,111,111)";
			this.selectedIndex=index;
		}
		this.setState({
		  selected: selectedTitles,
		});
		if(index<this.dataArray.length-4){
			this.refs.scrollView.scrollTo({x:(windowSize.width/4)*(index-2), animated:true});
		}else{
			this.refs.scrollView.scrollToEnd({animated:true});
		}
		//console.log(selectedTitles);
	}
	createTips(){
		//console.log("start to create tips");
		let tipsArray=new Array();
		for (let i = 0; i < this.dataArray.length; i++) {
			let index=i;
			let element=(<Text onPress={()=>{
					this.selectTitle(index);
					this.props.onPress(index);
				}}
				key={index} style={[titleBarStyle.text, {color:this.state.selected[index]}]}>
				{this.dataArray[index]}</Text>
			);
			tipsArray.push(element);
			//console.log(element);
		}
		//console.log(tipsArray);
		return tipsArray;
	}
}
let titleBarStyle=StyleSheet.create({
	bar:{
		backgroundColor:'snow',
		maxHeight:50
	},
	text:{
		fontSize: 20,
		height:50,
		marginLeft:10,
		marginRight:10,
		lineHeight:28,
		textAlignVertical:'center',
		color:'rgb(111,111,111)'
	}
});