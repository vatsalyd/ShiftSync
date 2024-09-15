import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Location, Permissions } from 'expo';

const App = () => {
  const [location, setLocation] = useState(null);
  const [attendance, setAttendance] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert('Permission to access location was denied');
      } else {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  const handleCheckIn = () => {
    // Call API to mark attendance
    setAttendance(true);
  };

  const handleCheckOut = () => {
    // Call API to mark attendance
    setAttendance(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Geolocation-based Attendance Tracking App</Text>
      {location ? (
        <View style={styles.locationContainer}>
          <Text style={styles.locationText}>
            Your current location: {location.coords.latitude}, {location.coords.longitude}
          </Text>
        </View>
      ) : (
        <Text style={styles.noLocationText}>Waiting for location...</Text>
      )}
      {attendance ? (
        <TouchableOpacity style={styles.checkOutButton} onPress={handleCheckOut}>
          <Text style={styles.buttonText}>Check Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  locationText: {
    fontSize: 18,
    color: '#333',
  },
  noLocationText: {
    fontSize: 18,
    color: '#999',
  },
  checkInButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  checkOutButton: {
    backgroundColor: '#FF9800',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default App;