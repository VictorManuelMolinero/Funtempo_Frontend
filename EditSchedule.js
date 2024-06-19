import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const EditSchedule = ({ route }) => {
  const { item, username } = route.params;
  //To go back to the agenda component
  const navigation = useNavigation();
  //To save the starting and finishing hour of the schedule
  const [startingHour, setStartingHour] = useState(item.starting_hour.split(':')[0]);
  const [startingMinute, setStartingMinute] = useState(item.starting_hour.split(':')[1]);
  const [finishingHour, setFinishingHour] = useState(item.finishing_hour.split(':')[0]);
  const [finishingMinute, setFinishingMinute] = useState(item.finishing_hour.split(':')[1]);
  //To save the description of the schedule
  const [description, setDescription] = useState(item.name);

  //Method to check if all the data is correct before sending the schedules to the API
  const handleSubmit = () => {
    const start = `${startingHour}:${startingMinute}`;
    const finish = `${finishingHour}:${finishingMinute}`;

    //To make sure the finishing hour is not before the starting one or at the same time
    //Logically, your schedules always end after you start them
    if (parseInt(startingHour) > parseInt(finishingHour) || 
        (startingHour === finishingHour && parseInt(startingMinute) >= parseInt(finishingMinute))) {
      alert('Starting time must be before finishing time.');
      return;
    }

    //The description field can't be empty
    if (!description) {
      alert('Description cannot be blank.');
      return;
    }

    // Perform API call to update schedule
    fetch(`http://192.168.1.100/schedules/edit/${item.id}/`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        starting_hour: start,
        finishing_hour: finish,
        starting_date: item.starting_date,
        description: description,
        username: username
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Schedule updated:', data);
        //Go back to the agenda component
        navigation.goBack();
      })
      .catch(error => {
        console.error('Error updating schedule:', error);
      });
  };

  //Shows the elements of the component
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Starting time</Text>
      <View style={styles.row}>
        <Picker
          selectedValue={startingHour}
          style={styles.picker}
          onValueChange={(itemValue) => setStartingHour(itemValue)}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />
          ))}
        </Picker>
        <Text style={styles.colon}>:</Text>
        <Picker
          selectedValue={startingMinute}
          style={styles.picker}
          onValueChange={(itemValue) => setStartingMinute(itemValue)}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Finishing time</Text>
      <View style={styles.row}>
        <Picker
          selectedValue={finishingHour}
          style={styles.picker}
          onValueChange={(itemValue) => setFinishingHour(itemValue)}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />
          ))}
        </Picker>
        <Text style={styles.colon}>:</Text>
        <Picker
          selectedValue={finishingMinute}
          style={styles.picker}
          onValueChange={(itemValue) => setFinishingMinute(itemValue)}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: Platform.OS === "ios" ? -20 : 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: Platform.OS === "ios" ? 200 : 50,
  },
  colon: {
    fontSize: 18,
    paddingHorizontal: 5,
    textAlignVertical: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default EditSchedule;
