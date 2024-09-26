import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient'; // Assure-toi que le chemin est correct

export default function GalerieScreen() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  // Obtenir l'utilisateur connecté et son ID
  const fetchUserId = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
      setUserId(session.user.id); // Assigne l'ID de l'utilisateur connecté
    }
  };

  // Fonction pour ajouter le username
  const handleAddUsername = async () => {
    if (username.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un nom d\'utilisateur.');
      return;
    }

    try {
      const { error } = await supabase
        .from('users') // Utilise la table `users` de Supabase
        .update({ username: username }) // Mise à jour du champ `username`
        .eq('id', userId); // Utilise l'ID de l'utilisateur pour cibler la bonne ligne

      if (error) {
        throw error;
      }

      Alert.alert('Succès', 'Nom d\'utilisateur ajouté avec succès!');
      setUsername(''); // Réinitialise le champ après succès

    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du nom d\'utilisateur.');
      console.error(error);
    }
  };

  // Charger l'ID utilisateur au chargement de la page
  React.useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoris</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddUsername}>
        <Text style={styles.buttonText}>Ajouter le nom d'utilisateur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
