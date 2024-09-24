// app/chronologie.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChronologieScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chronologie</Text>
      <Text style={styles.description}>Voici la chronologie de vos souvenirs.</Text>
      {/* Ajoute ici le contenu que tu souhaites afficher sur cette page */}
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
  description: {
    fontSize: 18,
    textAlign: 'center',
  },
});
