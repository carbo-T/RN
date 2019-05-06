import React from 'react';
import { ScrollView, StyleSheet, Button, View, Text, ToastAndroid, TouchableOpacity, ActivityIndicator, Dimensions, PanResponder } from 'react-native';
import NetTool from './../Tools/NetTool';
import { Ionicons } from '@expo/vector-icons';
import MyHeader from '../poetryView/myHeaders';

/**滑动最小范围，暂未使用 */
const slidePageOffset = 50;
/**每组古诗个数 */
const itemsPerRequest = 10;
/**最大古诗组数，用于提升性能 */
const maxListCount = 6;

export default class PoetryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.netTool = new NetTool();
    let dataArray = new Array();
    this.state = {
      poems: dataArray,
      currentIndex: 0,
      detailShown: false,
      loading: false,
    };
  }

  componentWillMount() {
    let windowSize = Dimensions.get('window');
    /**
     * 接收用户触摸事件，暂未使用
     */
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onPanResponderGrant: (evt, gestureState) => {
      },
      onPanResponderMove: (evt, gestureState) => {
        this.refs.scrollView.scrollTo({ x: windowSize.width * this.state.currentIndex - gestureState.dx, animated: false });
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(`gestureState.dx : ${gestureState.dx}   gestureState.dy : ${gestureState.dy}`);
        if (gestureState.dx < -slidePageOffset) {
          console.log("right");
          this._rightSwitch();
        } else if (gestureState.dx > slidePageOffset) {
          console.log("left");
          this._leftSwitch();
        }

      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({ instance: this });
    this._getData();
  }
  /**
   * 导航栏属性
   */
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
      <MyHeader
        color="white"
        side="left"
        min={0}
        max={itemsPerRequest*maxListCount}
        navigation={navigation}
        onPress={() => {
          let instance = navigation.getParam('instance');
          instance._leftSwitch();
          if (instance) {
            console.log(instance.state.currentIndex);
            return instance.state.currentIndex-1;
          } else {
            return 0;
          }
        }}
        update={()=>{
          let instance = navigation.getParam('instance');
          if (instance) {
            return instance.state.currentIndex;
          } else {
            return 0;
          }
        }} />
    ),
    headerRight: (
      <MyHeader
      color="white"
      side="right"
      min={0}
      max={itemsPerRequest*maxListCount}
      navigation={navigation}
      onPress={() => {
        let instance = navigation.getParam('instance');
        instance._rightSwitch();
        if (instance) {
          console.log(instance.state.currentIndex);
          return instance.state.currentIndex+1;
        } else {
          return 0;
        }
      }}
      update={()=>{
        let instance = navigation.getParam('instance');
        if (instance) {
          return instance.state.currentIndex;
        } else {
          return 0;
        }
      }} />
    ),
  });

  /**
   * 向左切换古诗
   */
  _leftSwitch() {
    let windowSize = Dimensions.get('window');
    let currIndex = this.state.currentIndex;
    if (currIndex > 0) {
      this.refs.scrollView.scrollTo({ x: windowSize.width * (this.state.currentIndex - 1), animated: true });
      this.setState({
        currentIndex: currIndex - 1,
      });
    } else {
      ToastAndroid.show('当前已是第一首', ToastAndroid.SHORT);
    }
  }
  /**
   * 向右切换古诗
   */
  _rightSwitch() {
    let windowSize = Dimensions.get('window');
    let currIndex = this.state.currentIndex;
    //console.log(`length:${this.state.poems.length} index:${currIndex}`);
    this.refs.scrollView.scrollTo({ x: windowSize.width * (currIndex + 1), animated: true });
    if (this.state.poems.length <= currIndex + 1) {
      ToastAndroid.show('到达最后，更新数据', ToastAndroid.SHORT);
      setTimeout(() => { this._getData(); }, 150);
    } else {
      //跳转到载入画面时不需要调整index
      this.setState({
        currentIndex: currIndex + 1,
      });
    }
  }

  /**
   * 通过NetTools类获得新古诗数据
   */
  _getData() {
    let windowSize = Dimensions.get('window');
    if (!this.state.loading) {
      this.setState({ loading: true });
      this.netTool.getPoems(itemsPerRequest, (data) => {
        if (data && data["msg"] === "success" && data["newslist"]) {
          let arr = data["newslist"];
          for (let i = 0; i < arr.length; i++) {
            arr[i].key = String(i + this.state.currentIndex - 1);
          }
          // if (this.state.poems.length < itemsPerRequest * maxListCount) {
          this.setState({
            poems: this.state.poems.concat(arr),
            detailShown: false,
          });
          // } else {
          //   this.setState({
          //     poems: this.state.poems.concat(arr),//(this.state.poems.splice(0, itemsPerRequest)).concat(arr),
          //     currentIndex: this.state.currentIndex - itemsPerRequest,
          //     detailShown: false,
          //   });
          // }
        } else if (data === "error") {
          setTimeout(() => { this.setState({ loading: false }); }, 2000);
        }
      });
    } else {
      ToastAndroid.show('更新中，请勿重复点击', ToastAndroid.SHORT);
    }
  }

  /**
   * 获取古诗详情
   * @param  poemObj 单首古诗对象
   */
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

  /**
   * 获得单首古诗渲染控件
   * @param poemIndex poem数组下标
   */
  _getContents(poemIndex) {
    let windowSize = Dimensions.get('window');
    //let poemIndex = this.state.currentIndex;
    if (poemIndex >= 0 && poemIndex <= this.state.poems.length - 1) {
      let poemObj = this.state.poems[poemIndex];
      if (poemObj) {
        let contents = poemObj["content"].replace(/。/g, '。\n');
        //console.log(contents);
        return (
          <ScrollView style={[styles.poemContainer, { width: windowSize.width - 40 }]} key={poemObj["title"].concat(String(Math.random() * 100))} showsVerticalScrollIndicator={false}>
            <Text style={styles.poemTitle} key={"title"}>{poemObj["title"]}</Text>
            <Text style={styles.poemAuthor} key={"author"}>{poemObj["author"]}</Text>
            <Text style={styles.poemContents} key={"content"}>{contents}</Text>
            {this._getDetail(poemObj)}
          </ScrollView>
        );
      } else {
        return (
          <View key={"unavailable"} style={[styles.poemContainer, { width: windowSize.width - 40 }]}>
            <ActivityIndicator animating={true} color="blue" style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }} size='large' />
            <Text style={styles.poemNotification}>暂无可用古诗</Text>
          </View>
        );
      }
    } else {
      return (
        <View key={"loading"} style={[styles.poemContainer, { width: windowSize.width - 40 }]}>
          <ActivityIndicator animating={true} color="blue" style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }} size='large' />
          <Text style={styles.poemNotification}>载入中，请稍候</Text>
        </View>
      );
    }
  }

  /**
   * 获得当前古诗渲染数组，末尾添加载入画面
   */
  _getContentList() {
    let poemArr = new Array();
    let index = 0;
    for (index = 0; index < this.state.poems.length; index++) {
      poemArr.push(this._getContents(index));
      poemArr[index].key = String(index);
      //console.log(this._getContents(index));
    }
    poemArr.push(this._getContents(-1));
    poemArr[index].key = String(-1);
    return poemArr;
  }

  render() {
    let windowSize = Dimensions.get('window');
    return (
      <View
        style={styles.container}
      // {...this._panResponder.panHandlers}
      >
        <ScrollView
          // pagingEnabled={true} 
          alwaysBounceHorizontal={true}
          overScrollMode={'always'}
          ref={'scrollView'}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          // 提供分页滑动功能
          decelerationRate={0}
          snapToInterval={windowSize.width}
          snapToAlignment={"center"}
          onContentSizeChange={(contentWidth, contentHeight) => {
            //载入状态复位
            this.setState({ loading: false });
            ToastAndroid.show('已更新唐诗列表', ToastAndroid.SHORT);
            //限制list大小, 删除最前端一组诗
            if (this.state.poems.length > itemsPerRequest * maxListCount) {
              this.refs.scrollView.scrollTo({ x: windowSize.width * (this.state.currentIndex - itemsPerRequest + 1), animated: true });
              let arr = this.state.poems;
              arr.splice(0, itemsPerRequest);
              this.setState({
                poems: arr,
                currentIndex: this.state.currentIndex - itemsPerRequest + 1,
                detailShown: false,
              });
              console.log("限制list大小");
            }
          }}
          // 更新currentIndex值，监听首尾到达状态
          onMomentumScrollEnd={(param) => {
            let currentPos = param.nativeEvent.contentOffset.x;
            let index = Number.parseInt((currentPos + 1) / windowSize.width);
            // console.log('====================================');
            // console.log(`currentPos: ${currentPos} index: ${index} width:${windowSize.width} currIndex:${this.state.currentIndex}`);
            // console.log('====================================');
            if (index != this.state.currentIndex && index < this.state.poems.length) {
              this.setState({
                currentIndex: index,
              });
              // console.log(this.state.currentIndex);
            } else {
              //首页
              if (index == 0 && currentPos == 0) {
                console.log("首页");
                ToastAndroid.show('当前已是第一首', ToastAndroid.SHORT);
              }
              //末页
              else if (index >= this.state.poems.length) {
                console.log("末页");
                ToastAndroid.show('到达最后，更新数据', ToastAndroid.SHORT);
                this._getData();
              }
            }
          }}
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
