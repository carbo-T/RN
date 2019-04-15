import React from 'react';
import { ScrollView, StyleSheet,Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
    headerStyle: {
      backgroundColor: 'skyblue',	
    },
    headerTitleContainerStyle: {
      justifyContent:'center',
      paddingLeft: 60,
    },
		headerTintColor: 'white',
		headerTitleStyle: {
		  fontWeight: 'bold',
    },
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#555"
      />
    ),
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links */}
        <ExpoLinksView />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
