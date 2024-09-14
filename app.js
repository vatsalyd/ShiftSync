import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000'; // Replace with your backend URL if running on a physical device

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleCheckIn = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please provide name and email');
      return;
    }

    try {
      const checkInTime = new Date().toISOString();
      await axios.post(`${BACKEND_URL}/checkin`, {
        name,
        email,
        checkInTime
      });
      Alert.alert('Success', 'Check-in saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check in.');
    }
  };

  const handleCheckOut = async () => {
    if (!email) {
      Alert.alert('Error', 'Please provide email');
      return;
    }

    try {
      const checkOutTime = new Date().toISOString();
      await axios.post(`${BACKEND_URL}/checkout`, {
        email,
        checkOutTime
      });
      Alert.alert('Success', 'Check-out saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter your details to check in/out</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Check In" onPress={handleCheckIn} />
      <Button title="Check Out" onPress={handleCheckOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    width: '80%',
    borderRadius: 5,
  },
});

export default App;
