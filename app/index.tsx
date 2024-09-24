import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue à Souvenaria</Text>
      {/* Utilisation de Link pour naviguer */}
      <Link href="/addMemory">
        <Text style={styles.linkText}>Ajouter un souvenir</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  linkText: {
    color: 'blue',
    fontSize: 18,
    marginTop: 20,
  },
});
