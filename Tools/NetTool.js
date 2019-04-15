import React, {Component} from 'react';
export default class NetTool {
	constructor() {
		this.apiKey = "837adb54bd6fcf76efb072dc716072cf";
	 	this.prefix = "http://api.tianapi.com/";
	  	this.postfix = "/?key="+this.apiKey+"&num=20&page=";
		this.serialName = ["social","guonei","world","huabian","tiyu","nba","football","keji","startup","apple","military","mobile","travel","health","qiwen","meinv","vr","it","blockchain","ai"];
	}

	getNewsData(type,page,callback){
		let url = this.prefix+this.serialName[Number.parseInt(type)]+this.postfix+page;
		console.log(url);
		fetch(url,{
			method:'GET'}).then((response)=>{
				return response.json();}).then((data)=>{
					callback(data);
				}).catch((error)=>{
					callback("error");
					console.log(error);
				});
	}
}