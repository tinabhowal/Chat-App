// import { useState } from 'react';
// import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native';
// import appBackground from '../assets/appBackground.png';

// const Start = ({ navigation }) => {
//   const [name, setName] = useState('');
//   const [selectedColor, setSelectedColor] = useState('#ffffff');
//   const colorOptions = ['#ffffff', '#e6e6e6', '#bfbfbf', '#808080', '#404040'];

//   return (
//     <View style={styles.container}>
//       <Image source={appBackground} style={styles.backgroundImage} />
//       <Text style={styles.title}>Chat App</Text>
      
//       <TextInput
//         style={styles.textInput}
//         value={name}
//         onChangeText={setName}
//         placeholder='Type your name here'
//       />

// <Text style={{color: 'white'}}>Choose a background color:</Text>
//       <View style={styles.colorContainer}>
//         {colorOptions.map((color, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[styles.colorOption, { backgroundColor: color }]}
//             onPress={() => setSelectedColor(color)}
//           />
//         ))}
//       </View>

//       <Button
//         title="Go to chat"
//         onPress={() => navigation.navigate('Chat', { name: name, selectedColor: selectedColor })}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   backgroundImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
  
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     marginTop: 20,
//     color: 'white'
//   },
//   textInput: {
//     width: "88%",
//     padding: 15,
//     borderWidth: 1,
//     borderColor: 'white',
//     marginTop: 15,
//     marginBottom: 15,
//     color: 'white',
//     fontSize: 20
//   },
//   colorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     marginBottom: 20,
//   },
//   colorOption: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   }
// });



// export default Start;









import { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import appBackground1 from '../assets/appBackground1.png';
import appBackground2 from '../assets/appBackground2.png';
import appBackground3 from '../assets/appBackground3.png';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const colorOptions = ['#ffffff', '#e6e6e6', '#bfbfbf', '#808080', '#404040'];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [appBackground1, appBackground2, appBackground3, appBackground2];

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
    <View style={[styles.container, { backgroundColor: backgroundImages[currentImageIndex] }]}>
      <Animated.Image source={backgroundImages[currentImageIndex]} style={[styles.backgroundImage, { opacity: fadeAnim }]} />
      <Text style={styles.title}>Chat App</Text>
      <TextInput
        style={styles.textInput}
        value={name}
        onChangeText={setName}
        placeholder='Type your name here'
      />
      <Text style={{color: 'white'}}>Choose a background color:</Text>
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
        onPress={() => navigation.navigate('Chat', { name: name, selectedColor: selectedColor })}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  
 
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000'
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: 'white'
  },
  textInput: {
    width: "88%",
    padding: 15,
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 15,
    marginBottom: 15,
    color: 'white',
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