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
  constructor(props){
    super(props);
    this.innerIndex = 3;
    this.state = {
      currentIndex:0,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ innerIndex: this.innerIndex });
  }

  static navigationOptions = ({navigation})=>({
    // header: null,
    title:"家",
    headerStyle: {
      backgroundColor: 'skyblue',	
    },
    headerTitleContainerStyle: {
      justifyContent:'center',
    },
		headerTintColor: 'white',
		headerTitleStyle: {
      fontWeight: 'bold',
      fontSize:22,
    },
    headerLeft: (
      <TouchableOpacity onPress={()=>{console.log(navigation.getParam('innerIndex'))}} style={{paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15}}>
				<Ionicons name="md-arrow-back" size={25} color="white" />
			</TouchableOpacity>
    ),
    headerRight:(
      <TouchableOpacity onPress={()=>{}} style={{paddingLeft:25,paddingRight:25,paddingTop:15,paddingBottom:15}}>
				<Ionicons name="md-arrow-forward" size={25} color="white" />
			</TouchableOpacity>
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
          <Button title="To News page" color="#8c4" onPress={()=>{this.props.navigation.navigate('News')}}/>

        </ScrollView>
      </View>
    );
  }
}

