
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ImageBackground, TouchableOpacity, Button } from 'react-native';
import { GiftedChat, Bubble, Avatar, InputToolbar } from "react-native-gifted-chat";
import doodle from '../assets/doodle.png';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
import { Video } from 'expo-av';
import { Audio } from "expo-av";


const Chat = ({ db, route, navigation, isConnected, storage }) => {
    
  const { name, selectedColor, userID } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageBackgroundColor, setMessageBackgroundColor] = useState('gray');
  //const [isFirstConnection, setIsFirstConnection] = useState(true);
  let soundObject = null;
  const videoRef = useRef(null);
 
    
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
      if (soundObject) soundObject.unloadAsync();
      if (videoRef.currentMessage) {
        videoRef.currentMessage.unloadAsync();
      }
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
        textStyle={{
          left: {
            fontSize: 20, // Replace with the desired font size for the left side
          },
          right: {
            fontSize: 20, // Replace with the desired font size for the right side
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

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;
    if (currentMessage.video) {
    return (
      <View>
        {/* <Text>{currentMessage.video}</Text> */}
        <Video
          ref={videoRef}
          source={{ uri: currentMessage.video }}
          style={{ width: 200, height: 200 }}
          useNativeControls
        />
      </View>
    );
   }
   return null;
  };

  
  const renderMessageAudio = (props) => {
    const { currentMessage } = props;
    if (currentMessage.audio) {
    return (
    <View>
    <TouchableOpacity
    style={{ backgroundColor: "#FF0", borderRadius: 10, margin: 5
    }}
    onPress={async () => {
    if (soundObject) soundObject.unloadAsync();
    const { sound } = await Audio.Sound.createAsync({ uri:
    props.currentMessage.audio });
    soundObject = sound;
    await sound.playAsync();
    }}>
    <Text style={{ textAlign: "center", color: 'black', padding:
    5 }}>Play Audio</Text>
    </TouchableOpacity>
    </View>
    )
  }
  }
    


  
  

  


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
        renderMessageVideo={renderMessageVideo}
        renderMessageAudio={renderMessageAudio}
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