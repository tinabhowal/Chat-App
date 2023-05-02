# Chat-App
A chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their
location.
The app will IS for both Android and iOS devices. 
Expo has been used to develop the app and Google Firestore to store the chat messages.

# Key Features
● A page where users can enter their name and choose a background color for the chat screen
before joining the chat.

● A page displaying the conversation, as well as an input field and submit button.

● The chat must provide users with two additional communication features: sending images
and location data.

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

- React Navigation is made by the community and not integrated into React Native, so you first need to install it. Open up your terminal and navigate to your new project folder, then type 

npm install --save @react-navigation/native @react-navigation/native-stack

Once done, run the following command to install the necessary dependencies that react-navigation uses:

expo install react-native-screens react-native-safe-area-context

