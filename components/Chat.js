import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { GiftedChat, Bubble, Avatar } from "react-native-gifted-chat";
import doodle from '../assets/doodle.png';
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth } from 'firebase/app';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ db, route, navigation, isConnected }) => {
    
  const { name, selectedColor, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageBackgroundColor, setMessageBackgroundColor] = useState('gray');
  const [isFirstConnection, setIsFirstConnection] = useState(true);
  
  // const onSend = (newMessages) => {
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  // }


//useeffect beofre async
  // useEffect(() => {
  //   navigation.setOptions({ title: name });

  //   const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  //   const unsubMessages = onSnapshot(q, (snapshot) => {
  //     let newMessages = [];
  //     snapshot.forEach((doc) => {
  //       const data = doc.data();
  //       newMessages.push({
  //         _id: doc.id,
  //         text: data.text,
  //         createdAt: new Date(data.createdAt.toMillis()),
  //         user: {
  //           _id: data.user._id,
  //           name: data.user.name,
  //           avatar: "https://placeimg.com/140/140/any"
  //         },
      
  //       });
  //     });
  //     setMessages(newMessages);
  //   });

  //   return () => {
  //     if (unsubMessages) unsubMessages();
  //   };
  // }, []);

  // useeffect after async
  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('async_messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedMessages = async () => {
    const cachedMessages = await AsyncStorage.getItem("async_messages") || [];
    setLists(JSON.parse(cachedMessages));
  }
  
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });
    if (isConnected === true) {
    
    // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
    if (unsubMessages) unsubShoppinglists();
    unsubMessages = null;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsubMessages = onSnapshot(q, async (snapshot) => {
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

        cacheMessages(newMessages);
        setMessages(newMessages);
      });   

      if (isFirstConnection) {
        setIsFirstConnection(false);
      }

    });
  } else {
    loadCachedMessages();
    setIsFirstConnection(true);
  }
      
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);



  // const onSend = (newMessages) => {
  //   addDoc(collection(db, "messages"), newMessages[0])
  // }

  const onSend = async (newMessages) => {
    if (!isConnected && !isFirstConnection) {
      // User is offline
      alert("Oops, network connection is lost");
      setMessageBackgroundColor('gray');
    } else {
      // User is online
      setMessageBackgroundColor('blue');
    }
  
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  
    if (isConnected && isFirstConnection) {
      // Network is resumed
      alert("Connection regained");
      setIsFirstConnection(false);
      
    }
  
    await addDoc(collection(db, 'messages'), newMessages[0]);
  };
  
  

  
  

 
  
  // //Changing the color of renderBubble
  // const renderBubble = (props) => {
  //   return <Bubble
  //   // inheriting props
  //     {...props}
  //     wrapperStyle={{
  //       // right: {
  //       //   backgroundColor: "#000"
  //       // },
  //       left: {
  //         backgroundColor: "#FFF"
  //       }
  //     }}
  //   />
  // }
   
  const renderBubble = (props) => {
    const backgroundColor = isConnected ? 'blue' : 'gray';
  
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: backgroundColor,
          },
        }}
      />
    );
  };
  
  


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




