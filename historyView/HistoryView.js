import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import NetTools from '../Tools/NetTool';

let windowSize = Dimensions.get('window');

export default class HistoryView extends Component {
	constructor(props) {
		super(props);
		this.netTools = new NetTools();
		this.state = {
			date: new Date(),
			eventList: new Array(),
		};
		this._getData(this.state.date);
	}
	_getData(date) {
		if (date) {
			let month = date.getMonth()+1;
			let dayInMonth = date.getDate();
			if (month && dayInMonth) {
				month < 10 ? month = "0" + String(month) : month = String(month);
				dayInMonth < 10 ? dayInMonth = "0" + String(dayInMonth) : dayInMonth = String(dayInMonth);

				this.netTools.getHistoryData(month + dayInMonth, (data) => {
					//console.log(data["newslist"]);
					if (data && data["newslist"]) {
						for (let index = 0; index < data["newslist"].length; index++) {
							data["newslist"][index].key = String(index);
						}
						this.setState({
							eventList: data["newslist"],
						});
					} else {
						Alert.alert("未获取到数据，请稍后再试");
					}
				});
			}
		}
	}
	_contentView() {
		let element = (
			<FlatList key={"1"} style={myStyle.listView} data={this.state.eventList}
				renderItem={({ item }) => {
					item["title"] = item["title"].replace(/&nbsp;/g,"");
					return (
						<View style={{alignItems: 'center'}}>
							<Text style={myStyle.date}>{item["lsdate"]}</Text>
							<Text style={myStyle.title}>{item["title"]}</Text>
							<View style={myStyle.line}></View>
						</View>
					);
				}} 
				showsVerticalScrollIndicator={false}
				overScrollMode={'always'}
				endFillColor={'#dcdcdc'}
				/>
		);
		return element;
	}
	render() {
		return (
			<View style={myStyle.contentView}>
				<View style={myStyle.datePickerView}>
					<Text style={{fontSize:15,margin:20,flex:1}}>请选择日期:</Text>
					<DatePicker
						style={myStyle.datePicker}
						date={this.state.date}
						mode="date"
						format="YYYY-MM-DD"
						confirmBtnText="确定"
						cancelBtnText="取消"
						showIcon={false}
						customStyles={{
							dateInput: {
								borderColor: 'lavenderblush',
							},
							dateText:{
								fontSize:17,
							}
						}}
						onDateChange={(date) => {
							this.setState({ date: new Date(date) }); 
							//  console.log(this.state.date.toDateString());
							//  console.log(date);
							if(this.state.date.toDateString() !== date){
								this._getData(new Date(date));
							}
						}}
					/>
				</View>
				{this._contentView()}
			</View>
		);
	}
}

let myStyle = StyleSheet.create({
	contentView: {
		flex: 1,
		backgroundColor: '#dcdcdc',
		flexDirection: 'column',
	},
	datePickerView:{
		flexDirection:'row',
		width: windowSize.width,
		backgroundColor:'lavenderblush',
	},
	datePicker:{
		flex:3,
		alignSelf: 'center',
	},
	listView: {
		borderRadius:10,
		marginLeft:20,
		marginRight:20,
		backgroundColor:'ivory',
	},
	title: {
		fontSize: 18,
		marginTop:10,
		marginBottom:10,
		marginLeft:40,
		marginRight:40,
	},
	date: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop:10,
	},
	line: {
		color: "rgb(20,20,20)",
		marginLeft: 15,
		marginRight: 15,
		marginTop: 5,
		marginBottom: 5,
		height: 1
	}
});