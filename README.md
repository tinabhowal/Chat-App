# Project Title

A chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.
The app will IS for both Android and iOS devices. 
Expo has been used to develop the app and Google Firestore to store the chat messages.

# Key Features
● A page where users can enter their name and choose a background color for the chat screen
before joining the chat.

● A page displaying the conversation, as well as an input field and submit button.

● The chat must provide users with two additional communication features: 

- sending videos (from gallery or by recording)

- sending images (from gallery or by clicking)

- location data

- record audio and share

- ability to send messages when offline (which gets delivered when connection resumes)

● Data gets stored online and offline.

## Roadmap

*****Setting up a React Native project with expo*****

- Terminal and Node: Expo only supports Node   16.. at max, so downgrading to “16.19.0” is necessary.

- Install the Expo CLI:
  npm install -g expo-cli

- Download Expo Go App

- Create an expo account and login via terminal: expo login

- Create an expo project. Type 
npx create-expo-app app-name --template
in the terminal

- After the initialization is complete, go to your project’s directory using cd app-name and start Expo with npm start or expo start. 

*****




## Installation

***React Navigation*** is made by the community and not integrated into React Native, so you first need to install it. Open up your terminal and navigate to your new project folder, then type 

- npm install --save @react-navigation/native @react-navigation/native-stack

Once done, run the following command to install the necessary dependencies that react-navigation uses:

- expo install react-native-screens react-native-safe-area-context



***Gifted Chat***

The most complete chat UI for React Native
Navigate in your terminal to your “Chat” project and install Gifted Chat via the npm command:

- npm install react-native-gifted-chat --save


***Firestore/Firebase***

Within the project, if you need to install Firestore (via Firebase), it can be done using npm. Open up your terminal, navigate to your project folder, and type in the following:

- npm install firebase@9.13.0 --save


***react-native-async-storage/async-storage***

React Native, UI elements are written in JSX and rendered natively on your smartphone. Because of this, React Native doesn’t work with HTML5 technologies such as Web Storage or IndexedDB. Instead, you’ll need a dedicated React Native package for local storage.

Run this expo-cli command from within your project root folder:

- expo install @react-native-async-storage/async-storage 


***netinfo***

To determine whether a user is online or not, you can use NetInfo, which is recommended by the Expo team and can be obtained from the package @react-native-community/netinfo.
Install the package using expo-cli by running this command:

- expo install @react-native-community/netinfo


***Expo ImagePicker***

To use the ImagePicker API, you first need to install the expo-image-picker Expo package. This will allow users of your app to select a photo from their library or take a new photo. Run the following command in the terminal:

- expo install expo-image-picker

***expo av library for Audio and Video***
- expo install expo-av

***Expo Media Library***

To fetch photos, videos, and audio files from the user's media library or to capture photos and videos using the device's camera, as well as record audio using the device's microphone

- expo install expo-media-library



## Demo