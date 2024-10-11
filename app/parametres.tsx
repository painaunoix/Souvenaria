import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Utilisé pour la navigation

export default function ParametresScreen() {
  const router = useRouter();

  // Récupération des dimensions de l'écran
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width, height }]}>
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
    backgroundColor: '#f5f5f5', // Fond gris qui se scale
  },
  title: {
    fontSize: 36, // Augmenté pour correspondre à l'autre style
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'ADLaM Display',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'ADLaM Display',
  },
  underlineContainer: {
    alignItems: 'center',
  },
  underline: {
    width: '30%',
    height: 2,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff', // Couleur du bouton
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
    width: 'auto', // Ajuste la largeur pour être juste assez large pour le texte
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
  familyId: {
    fontSize: 16,
    fontWeight: 200,
    textAlign: 'center',
    fontFamily: 'ADLaM Display',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#28a745', // Couleur du bouton de copie
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    width: 'auto', // Ajuste la largeur pour être juste assez large pour le texte
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
});
