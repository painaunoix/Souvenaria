import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';

type Request = {
  request_id: string;
  user_id: string;
  family_id: string;
  request_status: string;
  created_at: string;
  username: string;
};

export default function DemandesScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();

  // Obtenir les dimensions de l'écran
  const { width, height } = Dimensions.get('window');

  // Fonction pour récupérer les demandes et les usernames
  useEffect(() => {
    const fetchRequests = async () => {
      const { data: requestsData, error: requestsError } = await supabase
        .from('family_requests')
        .select('*')
        .eq('request_status', 'pending');

      if (requestsError) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des demandes.');
        console.error(requestsError);
        return;
      }

      if (!requestsData || requestsData.length === 0) {
        setRequests([]);
        return;
      }

      const userIds = requestsData.map(request => request.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('username, id')
        .in('id', userIds);

      if (profilesError) {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des utilisateurs.');
        console.error(profilesError);
        return;
      }

      const requestsWithUsernames = requestsData.map(request => {
        const userProfile = profilesData?.find(profile => profile.id === request.user_id);
        return {
          ...request,
          username: userProfile?.username || 'Inconnu',
        };
      });

      setRequests(requestsWithUsernames);
    };

    fetchRequests();
  }, []);

  const handleAccept = async (request_id: string, user_id: string, family_id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('family_requests')
        .update({ request_status: 'accepted' })
        .eq('request_id', request_id);

      if (updateError) throw updateError;

      const { error: insertError } = await supabase
        .from('user_families')
        .insert([{ user_id, family_id }]);

      if (insertError) throw insertError;

      const { error: deleteError } = await supabase
        .from('family_requests')
        .delete()
        .eq('request_id', request_id);

      if (deleteError) throw deleteError;

      Alert.alert('Succès', 'Demande acceptée et utilisateur ajouté à la famille.');
      setRequests(prevRequests => prevRequests.filter(req => req.request_id !== request_id));
    } catch (error) {
      Alert.alert('Erreur', "Une erreur est survenue lors de l'acceptation de la demande.");
      console.error(error);
    }
  };

  const handleReject = async (request_id: string) => {
    try {
      const { error } = await supabase
        .from('family_requests')
        .delete()
        .eq('request_id', request_id);

      if (error) throw error;

      Alert.alert('Succès', 'Demande refusée.');
      setRequests(prevRequests => prevRequests.filter(req => req.request_id !== request_id));
    } catch (error) {
      Alert.alert('Erreur', "Une erreur est survenue lors du refus de la demande.");
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Demandes d'adhésion</Text>
      {requests.length > 0 ? (
        requests.map(request => (
          <View key={request.request_id} style={styles.requestItem}>
            <Text>Utilisateur : {request.username}</Text>
            <Text>Date : {new Date(request.created_at).toLocaleDateString()}</Text>
            <TouchableOpacity onPress={() => handleAccept(request.request_id, request.user_id, request.family_id)} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(request.request_id)} style={styles.rejectButton}>
              <Text style={styles.buttonText}>Refuser</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noRequestsText}>Aucune demande en attente.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Assure que la vue occupe tout l'espace disponible
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5', // Fond gris qui se scale selon l'écran
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  requestItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRequestsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
