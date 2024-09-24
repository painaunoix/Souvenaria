import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GalerieScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      {/* Ajoute ici le contenu pour afficher les souvenirs */}
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
});
