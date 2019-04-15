import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
export default class DataManager {
	static getData(callback){
		AsyncStorage.getItem("data",(error,result)=>{
			//console.log(error+","+result);
			if(!error){
				result=result?result:"";
				let array = result.split('@@');
				callback(array);
			}
		});
	}
	static addCollection(url,resultCallback){
		this.getData((array)=>{
			//解析去重
			let success = false;
			let tempSet = new Set(array);
			array = Array.from(tempSet);
			if(!tempSet.has(url) && url.split("&&")[0]!=="no-subtitle"){
				array.push(url);
				success = true;
			}else{
				success = false;
			}
			let str = array.join('@@');
			//console.log(url);
			//console.log(array);
			AsyncStorage.setItem("data",str);
			console.log(success?"收藏成功保存":"收藏保存异常");
			resultCallback(success);
		});
	}
}