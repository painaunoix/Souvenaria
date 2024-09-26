import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérification de la session existante
  useEffect(() => {
    const checkSession = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        await AsyncStorage.setItem('supabase.session', JSON.stringify(session.data.session));
        router.push('/'); // Redirige vers la page d'accueil si une session existe déjà
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert("Erreur", error.message);
    } else {
      // Stocker la session de l'utilisateur localement
      await AsyncStorage.setItem('supabase.session', JSON.stringify(data.session));

      // Naviguer vers la page d'accueil après la connexion
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title={loading ? "Connexion en cours..." : "Se connecter"} onPress={handleLogin} />
      <Button title="Créer un compte" onPress={() => router.push('/register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
