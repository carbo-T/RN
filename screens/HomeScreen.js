import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyHeader from '../poetryView/myHeaders';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  contentContainer: {
    paddingTop: 30,
  },
});

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.innerIndex = 3;
    this.state = {
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ instance: this });
    // this.props.navigation.setParams({ headerRight: this.navigationOptions.headerRight });
    // this.props.navigation.setParams({ headerLeft: this.navigationOptions.headerLeft });
    this.props.navigation.setParams({ innerIndex: this.innerIndex });
  }

  static navigationOptions = ({ navigation }) => ({
    // header: null,
    title: "家",
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
        min={-1}
        max={5}
        navigation={navigation}
        onPress={() => {
          let instance = navigation.getParam('instance');
          if (instance) {
            instance.innerIndex -= 1;
            // console.log(instance.innerIndex);
            return instance.innerIndex;
          } else {
            return 0;
          }
        }}
        update={()=>{
          let instance = navigation.getParam('instance');
          if (instance) {
            return instance.innerIndex;
          } else {
            return 0;
          }
        }} />
    ),
    headerRight: (
      <MyHeader
        color="white"
        side="right"
        min={-1}
        max={5}
        navigation={navigation}
        onPress={() => {
          let instance = navigation.getParam('instance');
          if (instance) {
            instance.innerIndex += 1;
            // console.log(instance.innerIndex);
            return instance.innerIndex;
          } else {
            return 0;
          }
        }}
        update={()=>{
          let instance = navigation.getParam('instance');
          if (instance) {
            return instance.innerIndex;
          } else {
            return 0;
          }
        }} />
    ),
  });

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <Button title="To News page" color="#8c4" onPress={() => { this.props.navigation.navigate('News') }} />
          <View style={{backgroundColor:'rgb(233,233,233)', height:1}}></View>
          {/* <Button title="content changed" color="#8c4" onPress={() => { this.props.navigation.getParam('headerRight').onPress() }} /> */}
        </ScrollView>
      </View>
    );
  }
}

