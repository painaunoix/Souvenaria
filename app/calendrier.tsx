import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../supabaseClient';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Event = {
  event_id: string;
  event_name: string;
  event_date: string;
  event_type: string;
};

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Récupérer la taille de l'écran
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchUserFamily = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const { data: userFamilyData, error } = await supabase
          .from('user_families')
          .select('family_id')
          .eq('user_id', session.user.id)
          .single();

        if (userFamilyData) {
          setFamilyId(userFamilyData.family_id);
          fetchEvents(userFamilyData.family_id);
        } else {
          Alert.alert('Erreur', 'Vous n\'êtes associé à aucune famille.');
        }
      }
    };

    fetchUserFamily();
  }, []);

  const fetchEvents = async (familyId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('family_id', familyId)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) {
      Alert.alert('Erreur', 'Impossible de récupérer les événements.');
      console.error(error);
    } else {
      setEvents(data as Event[]);
    }
  };

  const handleAddEvent = async () => {
    if (!familyId || eventName.trim() === '' || eventDate.trim() === '' || eventType.trim() === '') {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
  
    // Utilisation de dayjs pour formater correctement la date avant l'insertion
    const formattedDate = dayjs(eventDate).format('YYYY-MM-DD');
  
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          family_id: familyId,
          event_name: eventName,
          event_date: formattedDate,  // Format correct de la date
          event_type: eventType,
        }]);
  
      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message);
      }
  
      Alert.alert('Succès', 'Événement ajouté avec succès!');
      setEventName('');
      setEventDate('');
      setEventType('');
      setModalVisible(false);
      fetchEvents(familyId!);
  
    } catch (error) {
      Alert.alert('Erreur', `Une erreur est survenue`);
    }
  };
  

  const groupEventsByMonth = (events: Event[]) => {
    return events.reduce((acc, event) => {
      const month = dayjs(event.event_date).format('MMMM YYYY');
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(event);
      return acc;
    }, {} as { [key: string]: Event[] });
  };

  const groupedEvents = groupEventsByMonth(events);

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Text style={styles.title}>Événements à venir</Text>

      <FlatList
        data={Object.keys(groupedEvents)}
        keyExtractor={(item) => item}
        renderItem={({ item: month }) => (
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>{month}</Text>
            {groupedEvents[month].map((event) => (
              <View key={event.event_id} style={styles.eventItem}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName}>{event.event_name}</Text>
                  <Text style={styles.eventDate}>{dayjs(event.event_date).format('DD/MM/YYYY')}</Text>
                </View>
                <Text style={styles.eventType}>{event.event_type}</Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text>Aucun événement à venir.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un événement</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nom de l'événement"
              value={eventName}
              onChangeText={setEventName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Date de l'événement (YYYY-MM-DD)"
              value={eventDate}
              onChangeText={setEventDate}
            />

            <TextInput
              style={styles.input}
              placeholder="Type d'événement"
              value={eventType}
              onChangeText={setEventType}
            />
            
            <Button title="Ajouter l'événement" onPress={handleAddEvent} />
            <Button title="Annuler" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'ADLaM Display',
  },
  monthSection: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ADLaM Display',
  },
  eventItem: {
    width: '100%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ADLaM Display',
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
    fontFamily: 'ADLaM Display',
  },
  eventType: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'ADLaM Display',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'ADLaM Display',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'ADLaM Display',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontFamily: 'ADLaM Display',
  },
});
