import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, Modal, TouchableOpacity } from 'react-native';
import { supabase } from '../supabaseClient'; // Assure-toi que ce chemin est correct
import dayjs from 'dayjs'; // Pour formater les dates
import AsyncStorage from '@react-native-async-storage/async-storage'; // Pour gérer les sessions

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
  const [userId, setUserId] = useState<string | null>(null); // Ajouter userId
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Obtenir l'utilisateur connecté et sa famille associée
  useEffect(() => {
    const fetchUserFamily = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id); // Stocker l'ID utilisateur
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

  // Fonction pour récupérer les événements
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

  // Fonction pour ajouter un événement
  const handleAddEvent = async () => {
    if (!userId) {
      Alert.alert('Erreur', 'Impossible de récupérer l\'ID utilisateur.');
      return;
    }

    if (eventName.trim() === '' || eventDate.trim() === '' || eventType.trim() === '') {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          family_id: familyId,
          user_id: userId, // Inclure l'ID utilisateur lors de l'insertion
          event_name: eventName,
          event_date: eventDate,
          event_type: eventType,
        }]);

      if (error) {
        throw error;
      }

      Alert.alert('Succès', 'Événement ajouté avec succès!');
      setEventName('');
      setEventDate('');
      setEventType('');
      setModalVisible(false);
      fetchEvents(familyId!);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'événement.');
      console.error(error);
    }
  };

  // Fonction pour grouper les événements par mois
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
    <View style={styles.container}>
      <Text style={styles.title}>Événements à venir</Text>

      {/* Liste des événements */}
      <FlatList
        data={Object.keys(groupedEvents)}
        keyExtractor={(item) => item}
        renderItem={({ item: month }) => (
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>{month}</Text>
            {groupedEvents[month].map((event, index) => (
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

      {/* Bouton pour ajouter un événement */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Fenêtre modale pour ajouter un événement */}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  monthSection: {
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 10,
  },
  eventItem: {
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
  },
  eventDate: {
    fontSize: 16,
    color: '#555',
  },
  eventType: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
