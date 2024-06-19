import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const AgendaComponent = () => {
  //Saves the agenda's schedules
  const [items, setItems] = useState({});
  //Checks if the schedules are still being rendered
  const [loading, setLoading] = useState(true);
  //Saves the currently selected date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  //Saves the dates that have schedules
  const [markedDates, setMarkedDates] = useState({});
  const route = useRoute();
  //Gets the user's data from the parent component
  const { username, email, password } = route.params; 
  const navigation = useNavigation();

  //UseEffect that adds the user button to the top right corner,
  //redirects to the user's info page
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.userButton}
          onPress={() => navigation.navigate('UserInfo', { username, email, password })}
        >
          <Image source={require('./assets/userIcon.png')} style={styles.userIcon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, username, email, password]);

  //Used to receive the schedules from the API
  const fetchSchedules = async () => {
    // Clears the items before fetching new data to avoid stacking
    setItems({});
    try {
      const response = await fetch(`http://192.168.1.100/schedules/${username}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const schedules = await response.json();
      //Saves the schedules in their respective date
      const formattedItems = {};
      //Saves the dates that have schedules to mark them in the calendar
      const newMarkedDates = {};

      if (schedules.length > 0) {
        //Loop used to save the schedules in their respective date
        for (const schedule of schedules) {
          const date = schedule.starting_date;

          if (!formattedItems[date]) {
            formattedItems[date] = [];
          }
          //Save each schedule in it's date
          formattedItems[date].push({
            id: schedule.id,
            name: schedule.description,
            height: 60,
            starting_hour: schedule.starting_hour,
            finishing_hour: schedule.finishing_hour
          });
          //Mark with a blue dot all the dates with schedules
          newMarkedDates[date] = { marked: true, dotColor: 'blue', selectedColor: '#a0c4ff' };
        }
      }

      // Update items with fetched data
      setItems(formattedItems);
      // Update marked dates
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //Method to delete a schedule after the user presses it's delete button
  const deleteSchedule = async (id, date) => {
    //Api request to send the schedule's id that's gonna be deleted
    try {
      const response = await fetch(`http://192.168.1.100/schedules/delete/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          schedule_id: id
        })
      });
      if (response.ok) {
        //Removes the schedule from the list
        setItems(prevItems => {
          const newItems = { ...prevItems };
          newItems[date] = newItems[date].filter(item => item.id !== id);
          if (newItems[date].length === 0) {
            delete newItems[date];
            const newMarkedDates = { ...markedDates };
            delete newMarkedDates[date];
            setMarkedDates(newMarkedDates);
          }
          return newItems;
        });
      } else {
        Alert.alert('Error', 'Failed to delete the schedule.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete the schedule.');
    }
  };

  //Fetches the schedules when the component is loaded
  useEffect(() => {
    fetchSchedules();
  }, [username]);

  //Fetches the schedules when the component regains focus
  useFocusEffect(
    useCallback(() => {
      fetchSchedules();
    }, [selectedDate])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSchedules();
    });
    return unsubscribe;
  }, [navigation]);

  //Reders the schedules
  const renderItem = (item) => (
    <View style={styles.item} key={item.id}>
      <Text style={styles.timeText}>{`${item.starting_hour.slice(0, -3)} - ${item.finishing_hour.slice(0, -3)}`}</Text>
      <Text>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => navigation.navigate('EditSchedule', { item, username })}
        >
          <Text style={styles.editButtonText}>✎</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => deleteSchedule(item.id, selectedDate)}
        >
          <Text style={styles.deleteButtonText}>✘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  //Changes the date after you press a different day in the agenda
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  //While the component is still rendering, show a loading view
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  //Populates the list with the selected date's schedule
  const filteredItems = {
    [selectedDate]: items[selectedDate] || []
  };

  //Renders the component's elements
  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={filteredItems}
        selected={selectedDate}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        pastScrollRange={12}
        futureScrollRange={12}
        renderEmptyData={() => {
          if (!loading && filteredItems[selectedDate].length === 0) {
            return (
              <View style={styles.emptyDate}>
                <Text>You don't have any schedules added</Text>
              </View>
            );
          }
          return null;
        }}
        rowHasChanged={(r1, r2) => 
          r1.id !== r2.id ||
          r1.name !== r2.name ||
          r1.starting_hour !== r2.starting_hour ||
          r1.finishing_hour !== r2.finishing_hour
        }
        markedDates={markedDates}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSchedule', { selectedDate, username })}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    position: 'relative',
  },
  timeText: {
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    paddingBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  editButton: {
    backgroundColor: 'blue',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
  userButton: {
    marginRight: 10,
  },
  userIcon: {
    width: 40,
    height: 40,
  },
});

export default AgendaComponent;
