import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Button,
  Animated,
  Platform,
  FlatList,
  Keyboard,
  TextInput,
  Dimensions,
  UIManager,
  PixelRatio,
  StyleSheet,
  StatusBar,
  ScrollView,
  CameraRoll,
  BackHandler,
  SafeAreaView,
  AsyncStorage,
  ToastAndroid,
  LayoutAnimation,
  TouchableOpacity,
  PermissionsAndroid,
  KeyboardAvoidingView
} from 'react-native';
import KeyboardAvoidManager from 'react-native-keyboard-avoid-manager';

const { width, height } = Dimensions.get('window');
const toolbarHeight = 56;
const bottomBarHeight = 48;
const colors = [
  '#ef9a9a',
  '#f48fb1',
  '#ce93d8',
  '#b39ddb',
  '#9fa8da',
  '#90caf9',
  '#81d4fa',
  '#80deea',
  '#80cbc4',
  '#a5d6a7',
  '#c5e1a5',
  '#e6ee9c',
  '#fff59d',
  '#ffe082',
  '#ffcc80',
  '#ffab91',
  '#bcaaa4',
  '#bcaaa4',
  '#b0bec5']

export default class App extends Component {

  state = {
    keyboardHeight: 0
  }

  constructor(props) {
    super(props);
    console.log(KeyboardAvoidManager);
    this.kam = new KeyboardAvoidManager({
      offsetTop: toolbarHeight,
      onKeyboardHeight: (keyboardHeight, duration, easing) => {

        if (duration && easing) {
          console.log('keyb - full animating');
          LayoutAnimation.configureNext({
            duration: duration > 10 ? duration : 10,
            update: {
              duration: duration > 10 ? duration : 10,
              type: LayoutAnimation.Types[easing] || 'keyboard',
            },
          });
        } else {
          console.log('keyb - half animating');
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }

        this.setState({ keyboardHeight: keyboardHeight - bottomBarHeight });
      }
    });
  }

  componentDidMount() {
    this.kam.mount(this.refs.scrollView)
  }

  componentWillUnmount() {
    this.kam.unmount();
  }

  renderTextInputs() {
    const textInputs = [];
    const n = 15;
    for (let i = 0; i < n; i++) {
      textInputs.push(
        <TextInput
          key={i}
          ref={'textInput' + i}
          style={[styles.textInput, { backgroundColor: colors[i % colors.length] }]}
          onFocus={this.kam.onFocus}
          onBlur={this.kam.onBlur}
          returnKeyType={i < n - 1 ? 'next' : 'done'}
          blurOnSubmit={true}
          onSubmitEditing={() => {
            const ref = this.refs['textInput' + (i + 1)];
            ref && ref.focus();
          }}
        >
        </TextInput>
      );
    }
    return textInputs;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          ref='scrollView'
          style={{ flex: 1 }}
          onScroll={event => {
            this.kam.onScroll(event);
          }}
          keyboardShouldPersistTaps='handled'>
          <View>
            {this.renderTextInputs()}
          </View>
          <View style={{ height: this.state.keyboardHeight }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: width,
    backgroundColor: 'orange',
    height: 50,
    marginBottom: 8,
    paddingHorizontal: 16,
  }
});