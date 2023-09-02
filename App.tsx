import React, {useEffect, useState} from 'react';
import {Text, View, PermissionsAndroid, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
type Location = {
  latitude: number;
  longitude: number;
};
const App = () => {
  const reference = firebase
    .app()
    .database('https://tracking-82889-default-rtdb.firebaseio.com/')
    .ref('/users/123');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  useEffect(() => {
    requestCameraPermission();

    const locationUpdateInterval = setInterval(() => {
      getLoction();
    }, 5000);
    return () => {
      clearInterval(locationUpdateInterval);
    };
  }, []);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLoction = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
        console.log(latitude, longitude);

        reference
          .set({
            latitude,
            longitude,
          })
          .then(() => console.log('Data set.'));
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          backgroundColor: 'orange',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          bottom: -10,
        }}
        onPress={() => {
          getLoction();
        }}>
        <Text>Get Current Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
