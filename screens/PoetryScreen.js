import React from 'react';
import { ScrollView, StyleSheet, Button, View, Text, ToastAndroid, TouchableOpacity, ActivityIndicator,Dimensions } from 'react-native';
import NetTool from './../Tools/NetTool';
import { Ionicons } from '@expo/vector-icons';

export default class PoetryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.netTool = new NetTool();
    let dataArray = new Array();
    this.state = {
      poems: dataArray,
      currentIndex: 0,
      detailShown: false,
    };
    this._getData();
  }

  componentDidMount() {
    this.props.navigation.setParams({ instance: this });
  }

  static navigationOptions = ({ navigation }) => ({
    title: '唐诗',
    headerStyle: {
      backgroundColor: 'skyblue',
    },
    headerTitleContainerStyle: {
      justifyContent: 'center',
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 22,
    },
    headerLeft: (
      <TouchableOpacity onPress={() => {
        let instance = navigation.getParam('instance');
        let currIndex = instance.state.currentIndex;
        if (currIndex > 0) {
          instance.setState({
            currentIndex: currIndex - 1,
          });
        } else {
          ToastAndroid.show('当前已是第一首', ToastAndroid.SHORT);
        }
      }} style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15 }}>
        <Ionicons name="md-arrow-back" size={25} color="white" />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity onPress={() => {
        let instance = navigation.getParam('instance');
        let currIndex = instance.state.currentIndex;
        instance.setState({
          currentIndex: currIndex + 1,
        });
        if (instance.state.poems.length <= currIndex + 1) {
          ToastAndroid.show('到达最后，更新数据', ToastAndroid.SHORT);
          instance._getData();
        }
      }} style={{ paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15 }}>
        <Ionicons name="md-arrow-forward" size={25} color="white" />
      </TouchableOpacity>
    ),
  });

  _getData() {
    this.netTool.getPoems(10, (data) => {
      if (data && data["msg"] === "success" && data["newslist"]) {
        if (this.state.poems.length < 30) {
          let arr = data["newslist"];
          for (let i = 0; i < this.state.poems.length; i++) {
            arr[i].key = String(i);
          }
          this.setState({
            poems: this.state.poems.concat(arr),
            needUpdate: false,
            detailShown: false,
          });
        } else {
          this.setState({
            poems: (this.state.poems.splice(0, 10)).concat(arr),
            needUpdate: false,
            detailShown: false,
          });
        }
      }
    });
  }

  _getDetail(poemObj) {
    if (!this.state.detailShown) {
      return (
        <Button
          title="详情"
          style={{ alignSelf: 'center' }}
          onPress={() => { this.setState({ detailShown: true }); }}
        />);
    } else {
      let details = poemObj["intro"].replace(/【/g, '\n【');
      //console.log(details);
      return (
        <View>
          <Button
            title="收起"
            style={{ alignSelf: 'center' }}
            onPress={() => { this.setState({ detailShown: false }); }} />
          <Text style={styles.poemDetails}>{details}</Text>
        </View>
      );
    }
  }

  _getContents(poemIndex) {
    let windowSize = Dimensions.get('window');
    //let poemIndex = this.state.currentIndex;
    if (poemIndex >= 0 && poemIndex <= this.state.poems.length - 1) {
      // this.setState({
      //   currentIndex:-1,
      //   needUpdate:false,
      // });
      let poemObj = this.state.poems[poemIndex];
      if (poemObj) {
        let contents = poemObj["content"].replace(/。/g, '。\n');
        //console.log(contents);
        return (
          <ScrollView style={[styles.poemContainer,{width:windowSize.width-40}]} key={poemObj["title"]} showsVerticalScrollIndicator={false}>
            <Text style={styles.poemTitle} key={"title"}>{poemObj["title"]}</Text>
            <Text style={styles.poemAuthor} key={"author"}>{poemObj["author"]}</Text>
            <Text style={styles.poemContents} key={"content"}>{contents}</Text>
            {this._getDetail(poemObj)}
          </ScrollView>
        );
      } else {
        return (
          <View style={[styles.poemContainer,{width:windowSize.width-40}]}>
            <ActivityIndicator animating={true} color="blue" style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }} size='large' />
            <Text style={styles.poemNotification}>暂无可用古诗</Text>
          </View>
        );
      }
    } else {
      return (
        <View style={[styles.poemContainer,{width:windowSize.width-40}]}>
          <ActivityIndicator animating={true} color="blue" style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }} size='large' />
          <Text style={styles.poemNotification}>载入中，请稍候</Text>
        </View>
      );
    }
  }

  _getContentList(){
    let poemArr = new Array();
    for (let index = 0; index < this.state.poems.length; index++) {
      poemArr.push(this._getContents(index));
      poemArr[index].key = String(index);
      //console.log(this._getContents(index));
    }
    return poemArr;
  }
  render() {
    let windowSize = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <ScrollView 
          // pagingEnabled={true} 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.1}
          snapToInterval={windowSize.width}
          snapToAlignment={"center"}
        >
          {this._getContentList()}
        </ScrollView>
        {/* {this._getContents()} */}
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
  poemContainer: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'lavenderblush',
    borderRadius: 20,
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  poemAuthor: {
    fontSize: 15,
    padding: 10,
    textAlign: 'center',
  },
  poemContents: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 20,
  },
  poemDetails: {
    fontSize: 15,
    padding: 10,
    letterSpacing: 2,
    lineHeight: 18,
  },
  poemNotification: {
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    color: 'gray',
    margin: 20,
  }
});
