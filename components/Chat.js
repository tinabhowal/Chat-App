import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { GiftedChat, Bubble, Avatar } from "react-native-gifted-chat";
import doodle from '../assets/doodle.png';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth } from 'firebase/app';

const Chat = ({ db, route, navigation }) => {
    
  const { name, selectedColor, userID } = route.params;
  const [messages, setMessages] = useState([]);
  
  // const onSend = (newMessages) => {
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  // }



  useEffect(() => {
    navigation.setOptions({ title: name });

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (snapshot) => {
      let newMessages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newMessages.push({
          _id: doc.id,
          text: data.text,
          createdAt: new Date(data.createdAt.toMillis()),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: "https://placeimg.com/140/140/any"
          },
      
        });
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);


  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

 
  
  //Changing the color of renderBubble
  const renderBubble = (props) => {
    return <Bubble
    // inheriting props
      {...props}
      wrapperStyle={{
        // right: {
        //   backgroundColor: "#000"
        // },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  // useEffect(() => {
  //   navigation.setOptions({ title: name });
  // }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: `Hello ${name}`,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: "React Native",
  //         avatar: "https://placeimg.com/140/140/any",
         
  //       },
  //     },
  //     {
  //       _id: 2,
  //       text: 'Welcome to the chat room!',
  //       createdAt: new Date(),
  //       system: true,
  //     },
  //   ]);
  // }, [name]);

  
    
  
  const renderAvatar = (props) => {
    return <Avatar {...props} />;
  };
  
  return (
    
    <View style={styles.container}>
      <ImageBackground source={doodle}  style={[styles.backgroundImage, { backgroundColor: selectedColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
        onSend={messages => onSend(messages)}
        user={{
          _id: userID,
          name: name,
          
          
        }}
       
      />
      </ImageBackground>
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch'
    
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

});

export default Chat;




