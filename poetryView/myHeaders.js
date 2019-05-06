import React from 'react';
import { StyleSheet, View, Text, ToastAndroid, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class MyHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 1,
        };
        let willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                this.indexRefreshClock = setInterval(() => {
                    let currIndex = this.props.update();
                    if(currIndex != this.state.index){
                        this.setState({
                            index:currIndex,
                        });
                    }
                }, 500);
            }
        );
        let didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
              clearInterval(this.indexRefreshClock);
            }
        );
    }

    render() {
        return (
            <TouchableOpacity 
                onPress={() => {
                    this.setState({ index: this.props.onPress() });
                    //console.log(this.state.index);
                }} 
                style={this.props.style?this.props.style:{paddingLeft: 25, paddingRight: 25, paddingTop: 15, paddingBottom: 15}}>
                {this._getInside()}
            </TouchableOpacity>
        );
    }

    _getInside() {
        if(this.props.side==="left" && this.state.index > (this.props.min?this.props.min:0)){
            //console.log("show arrow left, index:" + this.state.index);
            return(
                <Ionicons name="md-arrow-back" size={25} color={this.props.color} />
            );
        }else if(this.props.side==="right" && this.state.index < (this.props.max?this.props.max:10)){
            //console.log("show arrow right, index:" + this.state.index);
            return (
                <Ionicons name="md-arrow-forward" size={25} color={this.props.color} />
            );
        } else {
            //console.log("show nothing");
            return (<View />);
        }
    }
}