import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

//initializing a connection for Firestore
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create the navigator
const Stack = createNativeStackNavigator();

//imports for running the app when offline
import { useNetInfo }from '@react-native-community/netinfo';
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";

const App = () => {

  //enabling the app to work and be notified when offline
  const connectionStatus = useNetInfo();
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5r5hDe6pu0ccmFNubOpW66T63o0LyKQE",
  authDomain: "chatapp-febbb.firebaseapp.com",
  projectId: "chatapp-febbb",
  storageBucket: "chatapp-febbb.appspot.com",
  messagingSenderId: "514616997271",
  appId: "1:514616997271:web:87f3826a5b5d6df19280d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
      >
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chat"
          >
          {props => <Chat isConnected={connectionStatus.isConnected} db={db} {...props} />}
          </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
