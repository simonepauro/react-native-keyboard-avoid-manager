import React from 'react';

import {
  Platform,
  Keyboard,
  TextInput,
  UIManager,
  Dimensions
} from 'react-native';

export default class KeyboardAvoidingManager {
  constructor(props) {
    this.props = props;
    this.state = {
      contentOffsetY: 0,
    };
    this.listeners = Platform.OS === 'ios' ? [
      //Keyboard.addListener('keyboardWillChangeFrame', this._onKeyboardChange),
      //https://github.com/facebook/react-native/blob/87b65339379362f9db77ae3f5c9fa8934da34b25/Libraries/Components/Keyboard/KeyboardAvoidingView.js
      Keyboard.addListener('keyboardWillShow', this._onKeyboardChange),
      Keyboard.addListener('keyboardWillHide', this._onKeyboardChange)
    ] : [
        Keyboard.addListener('keyboardDidShow', this._onKeyboardChange),
        Keyboard.addListener('keyboardDidHide', this._onKeyboardChange)
      ];
  }

  mount = (scrollView) => {
    this.scrollView = scrollView;
  }

  unmount = () => {
    this.listeners.forEach(listener => listener.remove());
  }

  onScroll = (event) => {
    this.state.contentOffsetY = event.nativeEvent.contentOffset.y;
    this.state.contentHeight = event.nativeEvent.contentSize.height;
    this.state.scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
  }

  onFocus = () => {
    const { State: TextInputState } = TextInput;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    if (currentlyFocusedField) {
      UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
        const textFieldAbsoluteY = pageY;
        const textFieldHeight = height + 26; // aggiungo un margine sotto al textField
        const screenHeight = Dimensions.get('window').height;
        const contentOffsetY = this.state.contentOffsetY;
        const topOffset = this.props.offsetTop;
        const keyboardHeight = this.state.keyboardHeight;
        const textFieldOffset = (textFieldAbsoluteY - this.props.offsetTop) + contentOffsetY;
        const visibleHeight = screenHeight - topOffset - keyboardHeight - textFieldHeight;

        console.log(textFieldAbsoluteY, textFieldHeight, screenHeight, contentOffsetY, topOffset, keyboardHeight, textFieldOffset, visibleHeight);
        console.log('state: ', this.state)
        let isVisible = false; // TODO: check if already visible do nothing
        
        this.state.scrollOffset = textFieldOffset - visibleHeight;
        if (this.state.keyboardHeight) {
          this._scrollToOffset(this.state.scrollOffset);
        }

        /*
        const newContentHeight = this.state.contentHeight + keyboardHeight;
        if (!this.oldContentHeight) {
          this.oldContentHeight = this.state.contentHeight;
          this.props.setContentHeight(newContentHeight);
        }
        */

      });
    }
  }

  onBlur = () => {
    if (this.state.contentOffsetY + this.state.scrollViewHeight > this.state.contentHeight) {
      this.scrollView.scrollToOffset && this.scrollView.scrollToOffset({ offset: this.state.contentHeight - this.state.scrollViewHeight });
      this.scrollView.scrollTo && this.scrollView.scrollTo({ y: this.state.contentHeight - this.state.scrollViewHeight });
    } else if (this.state.contentOffsetY < 0) {
      this.scrollView.scrollToOffset && this.scrollView.scrollToOffset({ offset: 0 });
      this.scrollView.scrollTo && this.scrollView.scrollTo({ y: 0 });
    }
  }

  _scrollToOffset(offset) {
    if (offset < 0) offset = 0;
    //const offset = textFieldOffset - visibleHeight;
    if (this.scrollView.scrollToOffset) {
      this.scrollView.scrollToOffset({ offset });
    } else if (this.scrollView.scrollTo) {
      this.scrollView.scrollTo({ y: offset });
    }
  }

  _keyboardHeight(height) {
    this.state.keyboardHeight = height;
    if (this.props.onKeyboardHeight) this.props.onKeyboardHeight(height);
  }

  _onKeyboardChange = (event) => {
    if (event == null) {
      console.log('keyb - hiding');
      this._keyboardHeight(0);
      this.onBlur();
      return;
    }

    const { duration, easing } = event;
    const height = event.endCoordinates.height;
    this.onFocus();

    if (this.state.keyboardHeight === height) {
      console.log('keyb - return');
      return;
    }

    console.log('keyb - showing');
    this._keyboardHeight(height, duration, easing);
    
    if(this.state.scrollOffset) this._scrollToOffset(this.state.scrollOffset);
  };

}
