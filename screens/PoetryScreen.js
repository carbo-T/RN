import React from 'react';
import { ScrollView, StyleSheet,Button, View, Text, Alert } from 'react-native';
import NetTool from './../Tools/NetTool';

export default class PoetryScreen extends React.Component {
  constructor(props){
    super(props);
    this.netTool = new NetTool();
    let dataArray = new Array();
    this.state = {
      poems:dataArray,
      currentIndex:0,
      needUpdate:true,
      detailShown:false,
    };
    this._getData();
  }

  static navigationOptions = {
    title: '唐诗',
    headerStyle: {
      backgroundColor: 'skyblue',	
    },
    headerTitleContainerStyle: {
      justifyContent:'center',
    },
		headerTintColor: 'white',
		headerTitleStyle: {
		  fontWeight: 'bold',
    },
  };

  _getData(){
    this.netTool.getPoems(10,(data)=>{
      if(data && data["msg"] === "success" && data["newslist"]){
        this.setState({
          poems:data["newslist"],
          needUpdate:false,
          detailShown:false,
        });
      }
    });
  }
  _getDetail(poemObj){
    if(!this.state.detailShown){
      return(
      <Button 
        title="详情"
        style={{alignSelf: 'center'}} 
        onPress={()=>{this.setState({detailShown:true});}} 
      />);
    }else{
      let details = poemObj["intro"].replace(/【/g, '\n【');
      //console.log(details);
      return(
        <View>
          <Button 
            title="收起"
            style={{alignSelf: 'center'}} 
            onPress={()=>{this.setState({detailShown:false});}} />
          <Text style={styles.poemDetails}>{details}</Text>
        </View>
      );
    }
  }
  _getContents(){
    let poemIndex = this.state.currentIndex;
    if(this.state.poems.length > 0 && poemIndex>=0 && poemIndex<=this.state.poems.length-1){
      // this.setState({
      //   currentIndex:-1,
      //   needUpdate:false,
      // });
      let poemObj = this.state.poems[poemIndex];
      if(poemObj){
        let contents = poemObj["content"].replace(/。/g, '。\n');
        //console.log(contents);
        return(
          <ScrollView style={styles.poemContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.poemTitle}>{poemObj["title"]}</Text>
            <Text style={styles.poemAuthor}>{poemObj["author"]}</Text>
            <Text style={styles.poemContents}>{contents}</Text>
            {this._getDetail(poemObj)}
          </ScrollView>
        );
      }else{
        return(
          <View style={styles.poemContainer}>
            <Text style={styles.poemNotification}>暂无可用古诗</Text>
          </View>
        );
      }
    }else{
      return(
        <View style={styles.poemContainer}>
          <Text style={styles.poemNotification}>服务暂不可用</Text>
        </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this._getContents()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    backgroundColor: 'ivory',
  },
  poemContainer:{
    flex:1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor:'lavenderblush',
    borderRadius: 20,
  },
  poemTitle:{
    fontSize:18,
    fontWeight: 'bold',
    padding:10,
    textAlign:'center',
  },
  poemAuthor:{
    fontSize:15,
    padding:10,
    textAlign:'center',
  },
  poemContents:{
    fontSize:16,
    padding:10,
    textAlign:'center',
    letterSpacing:2,
    lineHeight:20,
  },
  poemDetails:{
    fontSize:15,
    padding:10,
    letterSpacing:2,
    lineHeight:18,
  },
  poemNotification:{
    textAlign:'center',
    color:'gray'
  }
});
