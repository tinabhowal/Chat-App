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
import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import appBackground1 from '../assets/appBackground1.png';
import appBackground2 from '../assets/appBackground2.png';
import appBackground3 from '../assets/appBackground3.png';
import appBackground5 from '../assets/appBackground5.png';
import appBackground6 from '../assets/appBackground6.png';
import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const colorOptions = ['#ffffff', '#e6e6e6', '#bfbfbf', '#808080', '#404040'];
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

  const backgroundImages = [appBackground1, appBackground2, appBackground3, appBackground5, appBackground6];

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
    top: 380,
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





// import { useState, useRef, useEffect } from 'react';
// import { StyleSheet, View, Text, Button, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
// import appBackground1 from '../assets/appBackground1.png';
// import appBackground2 from '../assets/appBackground2.png';
// import appBackground3 from '../assets/appBackground3.png';
// import appBackground5 from '../assets/appBackground5.png';
// import appBackground7 from '../assets/appBackground7.png';
// import appBackground8 from '../assets/appBackground8.png';
// import appBackground9 from '../assets/appBackground9.png';
// import appBackground10 from '../assets/appBackground10.png';
// import appBackground11 from '../assets/appBackground11.png';
// import appBackground12 from '../assets/appBackground12.png';
// import appBackground13 from '../assets/appBackground13.png';
// import appBackground14 from '../assets/appBackground14.png';
// import appBackground15 from '../assets/appBackground15.png';
// import appBackground16 from '../assets/appBackground16.png';
// import appBackground17 from '../assets/appBackground17.png';
// import appBackground18 from '../assets/appBackground18.png';
// import appBackground19 from '../assets/appBackground19.png';
// import appBackground20 from '../assets/appBackground20.png';
// import appBackground21 from '../assets/appBackground21.png';
// import appBackground22 from '../assets/appBackground22.png';
// import appBackground23 from '../assets/appBackground23.png';
// import appBackground24 from '../assets/appBackground24.png';
// import appBackground25 from '../assets/appBackground25.png';
// import appBackground26 from '../assets/appBackground26.png';
// import appBackground27 from '../assets/appBackground27.png';
// import appBackground28 from '../assets/appBackground28.png';
// import appBackground29 from '../assets/appBackground29.png';
// import appBackground30 from '../assets/appBackground30.png';
// import appBackground31 from '../assets/appBackground31.png';
// import appBackground32 from '../assets/appBackground32.png';
// import appBackground33 from '../assets/appBackground33.png';


// const Start = ({ navigation }) => {
//   const [name, setName] = useState('');
//   const [selectedColor, setSelectedColor] = useState('#ffffff');
//   const colorOptions = ['#ffffff', '#e6e6e6', '#bfbfbf', '#808080', '#404040'];
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const backgroundImages = [ appBackground7,
//     appBackground8, appBackground9, appBackground10, appBackground11, appBackground12,
//     appBackground13, appBackground14, appBackground15, appBackground16, appBackground17,
//     appBackground28, appBackground2, appBackground32, appBackground5,
//     appBackground18, appBackground19, appBackground20, appBackground21, appBackground22,
//     appBackground23, appBackground24, appBackground25, appBackground26, appBackground27,
//     appBackground28, appBackground29, appBackground30, appBackground31, appBackground32, appBackground33,
//     appBackground15, appBackground16
    
    
//   ];
  
//   const fadeAnims = useRef(backgroundImages.map(() => new Animated.Value(0))).current;
  
 

// // const positions = [];
// // const numRows = 3;
// // const numCols = 10;

// // for (let i = 0; i < numRows; i++) {
// //   for (let j = 0; j < numCols; j++) {
// //     positions.push({
// //       top: i * 150,
// //       left: j * 150,
// //     });
// //   }
// // }



   
//   useEffect(() => {
//     const fadeIn = Animated.timing(fadeAnims[0], {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: false,
//     });

   

//     const loopImages = () => {
//       if (currentImageIndex === backgroundImages.length - 1) {
//         setCurrentImageIndex(0);
//         return;
//       }
    
//       for (let i = 0; i < fadeAnims.length; i++) {
//         if (i === currentImageIndex) {
//           Animated.timing(fadeAnims[i], {
//             toValue: 1,
//             duration: 300,
//             useNativeDriver: false,
//           }).start();
//         } 
    
//       }
    
//       setCurrentImageIndex(currentImageIndex + 1);
//     };
    

//     const intervalId = setInterval(loopImages, 300);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [currentImageIndex]);

  
//   return (
   
// <View style={[styles.container, { backgroundColor: 'black' }]}>


//       <View style={styles.imageContainer}>
//         {backgroundImages.map((image, index) => (
//           <View key={index} style={styles.imageWrapper}>
//             <Animated.Image
//               source={image}
//               style={[
//                 styles.image,
//                 { width: '100%', height: '100%', opacity: fadeAnims[index] },
//               ]}
//             />
//           </View>
//         ))}
//       </View>



//       <View style={styles.chatContainer}>
//         <Text style={styles.title}>Chat App</Text>
//         <TextInput
//           style={styles.textInput}
//           value={name}
//           onChangeText={setName}
//           placeholder='Type your name here'
//         />
//         <Text style={{ color: 'grey', marginBottom: 6 }}>
//           Choose a background color:
//         </Text>
//         <View style={styles.colorContainer}>
//           {colorOptions.map((color, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.colorOption, { backgroundColor: color }]}
//               onPress={() => setSelectedColor(color)}
//             />
//           ))}
//         </View>
//         <Button
//           title='Go to chat'
//           onPress={() => navigation.navigate('Chat', { name: name, selectedColor: selectedColor })}
//       />
      
//       </View>
//       { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
//       {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black'
//   },

//   image: {
//     resizeMode: 'cover',
//     position: 'absolute',
//     top: 20,
//     left: 0,
//     width: '100%',
//     height: '100%',
    
//   },

//   imageContainer: {
//     top: 0,
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imageWrapper: {
//     width: '23%',
//     height: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 0
//   },

//   chatContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     width: 334,
//     height: 338,
//     left: 29,
//     top: 380,
//     borderRadius: 7,
//     backgroundColor: 'rgba(255, 255, 255, 1)',
//     // backgroundColor: 'rgba(255, 0, 0, 0.5)',
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 10,
//     zIndex: 1
//   },
  
 
//   backgroundImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%'
//   },
  
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     marginTop: 20,
//     color: 'grey'
//   },
//   textInput: {
//     width: "88%",
//     padding: 15,
//     borderWidth: 1,
//     borderColor: 'grey',
//     marginTop: 15,
//     marginBottom: 15,
//     color: 'grey',
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
