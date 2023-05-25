import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Alert } from 'react-native';

import appBackground2 from '../assets/appBackground2.png';
import appBackground3 from '../assets/appBackground3.png';
import appBackground4 from '../assets/appBackground4.png';
import appBackground5 from '../assets/appBackground5.png';
import appBackground6 from '../assets/appBackground6.png';
import appBackground7 from '../assets/appBackground7.png';

import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#f5f5dc');
  const colorOptions = ['#f5f5dc', '#e1f1ff', '#d3f8d380',  '#808080', '#404040'];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const auth = getAuth();
  const signInUser = () => {
    signInAnonymouslyUser();
  }
  const signInAnonymouslyUser = () => {
    signInAnonymously(auth)
      .then(result => {
        navigation.navigate("Chat", {name: name, userID: result.user.uid, selectedColor: selectedColor });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  }

  const backgroundImages = [appBackground2, appBackground4, appBackground6, appBackground7];

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: false,
    });

    
    
    const loopImages = () => {
        if (currentImageIndex === backgroundImages.length - 1) {
          // Stop the animation and set the current image to be the last image
          fadeAnim.setValue(1);
          setCurrentImageIndex(backgroundImages.length - 1);
          return;
        }
      
        fadeIn.start(() => {
          setTimeout(() => {
            fadeOut.start(() => {
              setCurrentImageIndex((currentImageIndex + 1) % backgroundImages.length);
            });
          }, 2000);
        });
      };
      
    loopImages();
    
    return () => {
      fadeIn.stop();
      fadeOut.stop();
    };
  }, [currentImageIndex]);

  return (
    <View style={[styles.container, { backgroundColor: 'black' }]}>
      
      <Animated.Image source={backgroundImages[currentImageIndex]} style={[styles.backgroundImage, { opacity: fadeAnim }]} />
      <View style={styles.chatContainer}>
      
      <Text style={styles.title}>Chat App</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder='Type your name here'
      />
      <Text style={{color: 'grey', marginBottom: 6}}>Choose a background color:</Text>
      <View style={styles.colorContainer}>
        {colorOptions.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorOption, { backgroundColor: color }]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
      <Button
        title="Go to chat"
        onPress={signInUser}
      />
      
      </View>
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  
  chatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 334,
    height: 338,
    left: 29,
    top: 450,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // backgroundColor: 'rgba(255, 0, 0, 0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1
  },
  
 
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: 'grey'
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 15,
    marginBottom: 15,
    color: 'grey',
    fontSize: 20
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  }
});

export default Start;





