import { useState } from 'react';
import { Button, View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';


import * as Location from 'expo-location';

import { onSnapshot } from "firebase/firestore";

import { useActionSheet } from '@expo/react-native-action-sheet';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const [media, setMedia] = useState(null);
  const [video, setVideo] = useState(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [location, setLocation] = useState(null);
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture','Record video', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickMedia();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            recordVideo(cameraType);
            return;  
          case 3:
            getLocation();
          default:
        }
      },
    );
  };

// To upload images and videos
const checkCameraPermissions = async () => {
    let { status } = await Camera.requestCameraPermissionsAsync();
    setIsCameraAvailable(status === 'granted');
  };

  //Creating a unique ref for every uploaded image
  const generateReference = (uri) => {
    const timeStamp = (new Date()).getTime();
    const imageName = uri.split("/")[uri.split("/").length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  }
  
  //uploading and sending an image 
  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref)
      onSend({ image: imageURL })
    });
  }

  //uploading and sending a video
  const uploadAndSendVideo = async (videoURI) => {
    const uniqueRefString = generateReference(videoURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(videoURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const videoURL = await getDownloadURL(snapshot.ref);
      onSend({ video: videoURL });
    });
  };
  

  const pickMedia = async (mediaType) => {
    let permissions = await MediaLibrary.requestMediaLibraryPermissionsAsync();
  
    if (permissions.granted) {
      let result;
  
      if (mediaType === 'image') {
        result = await ImagePicker.launchImageLibraryAsync();
      } else if (mediaType === 'video') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
      }
  
      if (!result.canceled) {
        
        await uploadAndSendImage(result.assets[0].uri);
        setMedia(result.uri);
        await uploadAndSendVideo(result.uri);
        setVideo(result.uri);
      } else {
        Alert.alert("Permissions haven't been granted.");
        setMedia(null);
        setVideo(null);
      }
    }
  };
  

  const takePhoto = async () => {
    let permissions = await MediaLibrary.requestPermissionsAsync();

    if (permissions.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
        setMedia(result.uri);
      } else {
        setMedia(null);
      }
    }
  };

  const recordVideo = async (cameraType) => {
    let permissions = await Camera.requestCameraPermissionsAsync();
  
    if (permissions.granted && isCameraAvailable) {
      let videoOptions = {
        quality: Camera.Constants.VideoQuality.high,
        //maxDuration: 30, // Maximum video duration in seconds
        mirror: cameraType === Camera.Constants.Type.front, // Mirror the video if using front camera
      };
  
      let result = await ImagePicker.launchCameraAsync(videoOptions);
  
      if (!result.canceled) {
        await uploadAndSendVideo(result.uri);
        setVideo(result.uri);
      } else {
        setVideo(null);
      }
    }
  };
  

  

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };


  //location
  const getLocation = async () => {
    let permissions = await Location.requestForegroundPermissionsAsync();
    if (permissions?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          });
          
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert("Error occurred while fetching location");
    } else Alert.alert("Permissions haven't been granted.");
  }

  

  

  return (
   

    <TouchableOpacity 
    style={styles.container}
    onPress={onActionPress}
    accessible={true}
    accessibilityLabel="More options"
    accessibilityHint="Let's you choose between options of sending an image or a video or your geolocation."
    > 
    <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
      {media && !video && <Image source={{ uri: media }} style={{ width: 200, height: 200 }} />}
    {video && <Video source={{ uri: video }} style={{ width: 200, height: 200 }} />}
    </TouchableOpacity>

    // </View>
  );
};


const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 10,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  });

export default CustomActions;



