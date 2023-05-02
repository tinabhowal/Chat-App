import React, { useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const BG_IMAGE_WIDTH = 1000;
const BG_IMAGE_HEIGHT = 1000;
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BackgroundAnimation = () => {
  const translationX = useRef(new Animated.Value(0)).current;

  const translateAnimation = Animated.timing(translationX, {
    toValue: -(BG_IMAGE_WIDTH - SCREEN_WIDTH),
    duration: 2000,
    useNativeDriver: true,
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: translationX }] }]}>
      <LottieView
        source={require('../assets/background.json')}
        style={{ width: BG_IMAGE_WIDTH, height: BG_IMAGE_HEIGHT }}
        autoPlay
        loop
        speed={1}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BG_IMAGE_WIDTH,
    height: BG_IMAGE_HEIGHT,
    top: 0,
    left: 0,
  },
});

export default BackgroundAnimation;
