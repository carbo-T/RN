import React, { Component } from 'react';
export default class NetTool {
	constructor() {
		this.apiKey = "837adb54bd6fcf76efb072dc716072cf";
		this.prefix = "http://api.tianapi.com/";
		this.newsPostfix = "/?key=" + this.apiKey + "&num=20&page=";
		this.serialName = ["social", "guonei", "world", "huabian", "tiyu", "nba", "football", "keji", "startup", "apple", "military", "mobile", "travel", "health", "qiwen", "meinv", "vr", "it", "blockchain", "ai"];
		this.historyPostfix = "/?key=" + this.apiKey + "&date=";
		this.poetryPostfix = "/?key=" + this.apiKey + "&num=";
	}

	getNewsData(type, page, callback) {
		let url = this.prefix + this.serialName[Number.parseInt(type)] + this.newsPostfix + page;
		console.log(url);
		fetch(url, {
			method: 'GET'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			callback(data);
		}).catch((error) => {
			callback("error");
			console.log(error);
		});
	}

	getHistoryData(date, callback) {
		let url = this.prefix +"txapi/lishi"+ this.historyPostfix + date;
		console.log(url);
		fetch(url, {
			method: 'GET'
		}).then((response) => {
			return response.json();
		}).then((data) => {
			callback(data);
		}).catch((error) => {
			callback("error");
			console.log(error);
		});
	}

	getPoems(num, callback){
		let url = this.prefix + "txapi/poetry" + this.poetryPostfix + num;
		console.log(url);
		fetch(url, {
			method:'GET'
		}).then((response)=>{
			return response.json();
		}).then((data)=>{
			callback(data);
		}).catch((error)=>{
			callback("error");
			console.log(error);
		})
	}
}