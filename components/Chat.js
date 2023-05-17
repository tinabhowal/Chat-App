import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { GiftedChat, Bubble, Avatar, InputToolbar } from "react-native-gifted-chat";
import doodle from '../assets/doodle.png';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


const Chat = ({ db, route, navigation, isConnected, storage }) => {
    
  const { name, selectedColor, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageBackgroundColor, setMessageBackgroundColor] = useState('gray');
  //const [isFirstConnection, setIsFirstConnection] = useState(true);
  
    
  let unsubscribeMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubscribeMessages) unsubscribeMessages();
      unsubscribeMessages = null;

      unsubscribeMessages = onSnapshot(
        query(collection(db, "messages"), orderBy("createdAt", "desc")),
        async (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach((doc) => {
            const data = doc.data();
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
              user: {
                          _id: data.user._id,
                          name: data.user.name,
                          avatar: "https://placeimg.com/140/140/any"
                        },
            });
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        }
      );
    } else {
      loadCachedMessages();
    }
    // Clean up code
    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  
  const onSend = async (newMessages) => {
    //if (!isConnected && !isFirstConnection) {
      if (!isConnected) {
      // User is offline
      //alert("Oops, network connection is lost. Messgaes will be sent when connection is regained.");
      setMessageBackgroundColor('gray');
    } else {
      // User is online
      setMessageBackgroundColor('blue');
    }
  
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  
    await addDoc(collection(db, 'messages'), newMessages[0]);
  };
  
  
   
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

  const renderInputToolbar = (props) => {
    return <InputToolbar {...props} />;
  };
  
  const renderCustomActions = (props) => {
    return <CustomActions onSend={onSend} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };
    

  return (
    
    <View style={styles.container}>
      <ImageBackground source={doodle}  style={[styles.backgroundImage, { backgroundColor: selectedColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderAvatar={renderAvatar}
        renderActions={renderCustomActions}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}
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






