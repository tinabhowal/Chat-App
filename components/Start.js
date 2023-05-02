import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, Image, TouchableOpacity } from 'react-native';
import appBackground from '../assets/appBackground.png';

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const colorOptions = ['#ffffff', '#e6e6e6', '#bfbfbf', '#808080', '#404040'];

  return (
    <View style={styles.container}>
      <Image source={appBackground} style={styles.backgroundImage} />
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
    alignItems: 'center'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  
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


// import React, { useState } from 'react';
// import { StyleSheet, View, Text, Button, TextInput, Image } from 'react-native';
// import appBackground from '../assets/appBackground.png';
// import BackgroundAnimation from './BackgroundAnimation';

// const Start = ({ navigation }) => {
//   const [name, setName] = useState('');

//   return (
//     <View style={styles.container}>
//       <BackgroundAnimation />
//       <Text style={styles.title}>Chat App</Text>
//       <TextInput
//         style={styles.textInput}
//         value={name}
//         onChangeText={setName}
//         placeholder='Type your name here'
//       />
//       <Button
//         title="Go to chat"
//         onPress={() => navigation.navigate('Chat', { name: name })}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 30,
//   },
//   backgroundImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//   },
//   textInput: {
//     width: "88%",
//     padding: 15,
//     borderWidth: 1,
//     marginTop: 15,
//     marginBottom: 15
//   }
// });

// export default Start;
