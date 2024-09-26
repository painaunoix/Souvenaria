import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Utilisé pour la navigation

export default function ParametresScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      {/* Rubrique Familles */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/parametres/familles')}>
        <Text style={styles.buttonText}>Familles</Text>
      </TouchableOpacity>

      {/* Rubrique Profils */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('/parametres/profils')}>
        <Text style={styles.buttonText}>Profils</Text>
      </TouchableOpacity>

      {/* Ajoute d'autres rubriques ici si nécessaire */}
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
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
