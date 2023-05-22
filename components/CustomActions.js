
import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { Video } from 'expo-av';
import * as Location from 'expo-location';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useActionSheet } from '@expo/react-native-action-sheet';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const [media, setMedia] = useState(null);
  const [location, setLocation] = useState(null);
  const actionSheet = useActionSheet();
  let recordingObject = null;
  


  const startRecording = async () => {
    try {
    let permissions = await Audio.requestPermissionsAsync();
    if (permissions?.granted) {
    // iOS specific config to allow recording on iPhone devices
    await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true
    });
    Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY).then(results => {
    return results.recording;
    }).then(recording => {
    recordingObject = recording;
    Alert.alert('You are recording...', undefined, [
    { text: 'Cancel', onPress: () => { stopRecording() } },
    { text: 'Stop and Send', onPress: () => {
    sendRecordedSound() } },
    ],
    { cancelable: false }
    );
    })
    }
    } catch (err) {
    Alert.alert('Failed to record!');
    }
    }


    const stopRecording = async () => {
    await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: false
    });
    await recordingObject.stopAndUnloadAsync();
    }


    const sendRecordedSound = async () => {
    await stopRecording()
    const uniqueRefString =
    generateReference(recordingObject.getURI());
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(recordingObject.getURI());
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
    const soundURL = await getDownloadURL(snapshot.ref)
    onSend({ audio: soundURL })
    });
    }

//     useEffect(() => {
// return () => {
// if (recordingObject) recordingObject.stopAndUnloadAsync();
// }
// }, []);



  const pickImage = async () => {
    let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissions?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        
        await uploadAndSendImage(result.uri);
      }
      else Alert.alert('Permission has not been granted.');
    }
  };

  const pickVideo = async () => {
    let permissions = await MediaLibrary.requestPermissionsAsync();

    if (permissions.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled) {
        
        await uploadAndSendVideo(result.uri);
        setMedia(result.uri);
      } else {
        setMedia(null);
      }
    }
  };

  const takePhoto = async () => {
    let permissions = await MediaLibrary.requestPermissionsAsync();

    if (permissions.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!result.canceled) {
        await uploadAndSendImage(result.uri);
        setMedia(result.uri);
      } else {
        setMedia(null);
      }
    }
  };

  const recordVideo = async () => {
    let permissions = await MediaLibrary.requestPermissionsAsync();

    if (permissions.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      if (!result.canceled) {
        await uploadAndSendVideo(result.uri);
        setMedia(result.uri);
      } else {
        setMedia(null);
      }
    }
  };

  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/').pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  const uploadAndSendImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  const uploadAndSendVideo = async (videoURI) => {
    const uniqueRefString = generateReference(videoURI);
    const newUploadRef = ref(storage, uniqueRefString);
    const response = await fetch(videoURI);
    const blob = await response.blob();
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      const videoURL = await getDownloadURL(snapshot.ref);
      onSend({ video: videoURL});
    });
  };

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
      } else Alert.alert('Error occurred while fetching location');
    } else Alert.alert("Permissions haven't been granted.");
  };

  const onActionPress = () => {
    const options = ['Choose an image from the library', 'Choose an video from the library', 'Click Picture', 'Record Video', 'Record Audio', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            pickVideo();
            return;  
          case 2:
            takePhoto();
            return;
          case 3:
            recordVideo();
            return;
          case 4:
            startRecording();
            return;
          case 5:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  return (
    <View>
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
      </TouchableOpacity>
    </View>
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