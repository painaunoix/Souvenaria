import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';

export default function ProfilEditScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const userId = session.user.id;

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('id', userId)
          .single();

        if (profileError) {
          Alert.alert('Erreur', 'Impossible de charger le profil.');
          console.error(profileError);
        } else {
          setUsername(profileData.username);
        }
      } else {
        Alert.alert('Erreur', 'Utilisateur non connecté.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (username.trim() === '') {
      Alert.alert('Erreur', 'Le nom d\'utilisateur ne peut pas être vide.');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const userId = session.user.id;

        const { error } = await supabase
          .from('user_profiles')
          .update({ username })
          .eq('id', userId);

        if (error) {
          throw error;
        }

        Alert.alert('Succès', 'Profil mis à jour.');
        router.push('/parametres/profils'); 
      } else {
        Alert.alert('Erreur', 'Utilisateur non connecté.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { width, height } = Dimensions.get('window'); // Récupérer les dimensions de l'écran

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Modifier le profil</Text>

      <Text style={styles.sectionTitle}>Nom d'utilisateur :</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre nouveau nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5', // Fond gris adaptable à la taille de l'écran
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'ADLaM Display',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 10,
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
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
});
